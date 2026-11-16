"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

const currentMonth = () => new Date().toISOString().slice(0, 7);
const safeName = (n) => n.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]/g, "_");

export default function ClientPage() {
  const { id } = useParams();
  const router = useRouter();
  const [client, setClient] = useState(null);
  const [reports, setReports] = useState([]);
  const [month, setMonth] = useState(currentMonth());
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const c = await supabase.from("clients").select("*").eq("id", id).single();
    if (c.error) return setMsg({ type: "error", text: "Cliente não encontrado." });
    setClient(c.data);
    const r = await supabase.from("reports").select("*").eq("client_id", id).order("month", { ascending: false });
    if (!r.error) setReports(r.data);
  }, [id]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/");
      else load();
    });
  }, [router, load]);

  async function upload(e) {
    e.preventDefault();
    const form = e.target;
    if (!file) return;
    if (file.type !== "application/pdf") return setMsg({ type: "error", text: "Envie um arquivo PDF." });
    if (file.size > 10 * 1024 * 1024) return setMsg({ type: "error", text: "O arquivo passa de 10 MB." });
    setBusy(true); setMsg(null);
    const { data: { session } } = await supabase.auth.getSession();
    const path = `${session.user.id}/${id}/${month}-${Date.now()}-${safeName(file.name)}`;
    const up = await supabase.storage.from("reports").upload(path, file, { contentType: "application/pdf" });
    if (up.error) { setBusy(false); return setMsg({ type: "error", text: up.error.message }); }
    const ins = await supabase.from("reports").insert({ client_id: id, month, file_path: path, file_name: file.name });
    setBusy(false);
    if (ins.error) return setMsg({ type: "error", text: ins.error.message });
    setFile(null);
    form.reset();
    setMsg({ type: "ok", text: "Relatório salvo." });
    load();
  }

  async function download(r) {
    const { data, error } = await supabase.storage.from("reports").createSignedUrl(r.file_path, 60);
    if (error) return setMsg({ type: "error", text: error.message });
    window.open(data.signedUrl, "_blank");
  }

  async function remove(r) {
    if (!confirm(`Apagar "${r.file_name}"?`)) return;
    await supabase.storage.from("reports").remove([r.file_path]);
    await supabase.from("reports").delete().eq("id", r.id);
    load();
  }

  return (
    <>
      <p><Link href="/dashboard">← Voltar aos clientes</Link></p>
      <h1>{client ? client.name : "Carregando…"}</h1>
      {client && <p className="muted">{client.email}</p>}

      <form onSubmit={upload} className="card" style={{ marginTop: 20 }}>
        <label htmlFor="mes">Mês do relatório</label>
        <input id="mes" type="month" required value={month} onChange={(e) => setMonth(e.target.value)} />
        <label htmlFor="pdf">Arquivo PDF</label>
        <input id="pdf" type="file" accept="application/pdf" required onChange={(e) => setFile(e.target.files[0])} />
        <div style={{ marginTop: 16 }}><button disabled={busy}>{busy ? "Enviando…" : "Salvar relatório"}</button></div>
      </form>
      {msg && <p className={msg.type}>{msg.text}</p>}

      <h2>Relatórios enviados</h2>
      {reports.length === 0 ? (
        <p className="muted">Nenhum relatório ainda. Envie o primeiro acima.</p>
      ) : (
        <ul className="list">
          {reports.map((r) => (
            <li key={r.id}>
              <div><strong>{r.month}</strong><div className="muted">{r.file_name}</div></div>
              <div>
                <button className="ghost" onClick={() => download(r)}>Baixar</button>{" "}
                <button className="ghost" onClick={() => remove(r)}>Apagar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
