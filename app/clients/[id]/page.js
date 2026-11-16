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
    if (c.error) return setMsg({ type: "error", text: "Client not found." });
    setClient(c.data);
    const r = await supabase.from("reports").select("*").eq("client_id", id).order("month", { ascending: false });
    if (r.error) setMsg({ type: "error", text: r.error.message });
    else setReports(r.data || []);
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
    if (!file) return setMsg({ type: "error", text: "Choose a PDF file first." });
    if (file.type !== "application/pdf") return setMsg({ type: "error", text: "Please upload a PDF file." });
    if (file.size > 10 * 1024 * 1024) return setMsg({ type: "error", text: "The file exceeds the 10 MB limit." });
    if (!month) return setMsg({ type: "error", text: "Choose the reporting month." });

    setBusy(true);
    setMsg(null);
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      setBusy(false);
      return setMsg({ type: "error", text: "Your session expired. Please log in again." });
    }

    const path = session.user.id + "/" + id + "/" + month + "-" + Date.now() + "-" + safeName(file.name);
    const up = await supabase.storage.from("reports").upload(path, file, { contentType: "application/pdf" });
    if (up.error) {
      setBusy(false);
      return setMsg({ type: "error", text: up.error.message });
    }

    const ins = await supabase.from("reports").insert({
      owner_id: session.user.id,
      client_id: id,
      month,
      file_path: path,
      file_name: file.name
    });

    if (ins.error) {
      await supabase.storage.from("reports").remove([path]);
      setBusy(false);
      return setMsg({ type: "error", text: ins.error.message });
    }

    setBusy(false);
    setFile(null);
    form.reset();
    setMonth(currentMonth());
    setMsg({ type: "ok", text: "Report uploaded and saved." });
    await load();
  }

  async function download(report) {
    setMsg(null);
    const { data, error } = await supabase.storage.from("reports").createSignedUrl(report.file_path, 60);
    if (error) return setMsg({ type: "error", text: error.message });
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  async function remove(report) {
    if (!window.confirm('Delete "' + report.file_name + '"?')) return;
    setBusy(true);
    setMsg(null);

    const storageResult = await supabase.storage.from("reports").remove([report.file_path]);
    if (storageResult.error) {
      setBusy(false);
      return setMsg({ type: "error", text: storageResult.error.message });
    }

    const dbResult = await supabase.from("reports").delete().eq("id", report.id);
    setBusy(false);
    if (dbResult.error) return setMsg({ type: "error", text: dbResult.error.message });
    setMsg({ type: "ok", text: "Report deleted." });
    await load();
  }

  return <>
    <p><Link href="/dashboard">← Back to clients</Link></p>
    <p className="section-kicker">CLIENT WORKSPACE</p>
    <h1>{client ? client.name : "Loading…"}</h1>
    {client && <p className="muted">{client.email}</p>}

    <form onSubmit={upload} className="card" style={{ marginTop: 20 }}>
      <h2 style={{ marginTop: 0 }}>Upload a monthly report</h2>
      <label htmlFor="month">Reporting month</label>
      <input id="month" type="month" required value={month} onChange={(e) => setMonth(e.target.value)} />
      <label htmlFor="pdf">PDF file</label>
      <input id="pdf" type="file" accept="application/pdf" required onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <div style={{ marginTop: 16 }}><button disabled={busy}>{busy ? "Working…" : "Upload report"}</button></div>
    </form>

    {msg && <p className={msg.type}>{msg.text}</p>}
    <h2>Report history</h2>
    {reports.length === 0
      ? <p className="muted">No reports yet. Upload the first PDF above.</p>
      : <ul className="list">{reports.map((report) => <li key={report.id}>
          <div><strong>{report.month}</strong><div className="muted">{report.file_name}</div></div>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" className="ghost" onClick={() => download(report)} disabled={busy}>Download</button>
            <button type="button" className="ghost" onClick={() => remove(report)} disabled={busy}>Delete</button>
          </div>
        </li>)}</ul>}
  </>;
}
