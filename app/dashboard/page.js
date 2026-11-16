"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("clients").select("*").order("name");
    if (error) setError(error.message);
    else setClients(data || []);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/");
      else { setReady(true); load(); }
    });
  }, [router, load]);

  function startEdit(client) {
    setEditingId(client.id);
    setName(client.name || "");
    setEmail(client.email || "");
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setName("");
    setEmail("");
    setError(null);
  }

  async function saveClient(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      setBusy(false);
      return setError("Your session expired. Please log in again.");
    }

    const result = editingId
      ? await supabase.from("clients").update({ name: name.trim(), email: email.trim() }).eq("id", editingId)
      : await supabase.from("clients").insert({ name: name.trim(), email: email.trim(), owner_id: session.user.id });

    setBusy(false);
    if (result.error) return setError(result.error.message);
    cancelEdit();
    await load();
  }

  async function deleteClient(client) {
    const confirmed = window.confirm("Delete " + client.name + "? Clients with saved reports must have those reports deleted first.");
    if (!confirmed) return;
    setError(null);
    const { data: linkedReports, error: checkError } = await supabase
      .from("reports").select("id").eq("client_id", client.id).limit(1);
    if (checkError) return setError(checkError.message);
    if (linkedReports?.length) return setError("This client has saved reports. Delete the reports first, then remove the client.");

    const { error } = await supabase.from("clients").delete().eq("id", client.id);
    if (error) return setError(error.message);
    if (editingId === client.id) cancelEdit();
    await load();
  }

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  if (!ready) return null;

  return <div className="workspace-page"><div className="workspace-container">
    <header className="workspace-header">
      <div>
        <p className="section-kicker">REPORTDROP WORKSPACE</p>
        <h1>Your clients</h1>
        <p className="muted">Manage client details and monthly reports in one place.</p>
      </div>
      <button type="button" className="ghost" onClick={logout}>Log out</button>
    </header>

    <form onSubmit={saveClient} className="card">
      <h2>{editingId ? "Edit client" : "Add a client"}</h2>
      <div className="workspace-form-grid">
        <div><label htmlFor="name">Business name</label>
          <input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Acme Consulting" /></div>
        <div><label htmlFor="email">Client email</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="client@company.com" /></div>
      </div>
      <div className="workspace-form-actions">
        <button disabled={busy}>{busy ? "Saving…" : editingId ? "Save changes" : "Add client"}</button>
        {editingId && <button type="button" className="ghost" onClick={cancelEdit}>Cancel</button>}
      </div>
    </form>

    {error && <p className="error">{error}</p>}
    <h2 className="workspace-section-title">Client list <span>({clients.length})</span></h2>
    {clients.length === 0
      ? <div className="workspace-empty">No clients yet. Add your first client above.</div>
      : <ul className="workspace-list">{clients.map((c) => <li key={c.id}>
          <div><Link href={"/clients/" + c.id}>{c.name}</Link><div className="muted">{c.email}</div></div>
          <div className="workspace-actions">
            <button type="button" className="ghost" onClick={() => startEdit(c)}>Edit</button>
            <button type="button" className="ghost" onClick={() => deleteClient(c)}>Delete</button>
            <Link className="btn" href={"/clients/" + c.id}>Open workspace <span aria-hidden="true">→</span></Link>
          </div>
        </li>)}</ul>}
  </div></div>;
}
