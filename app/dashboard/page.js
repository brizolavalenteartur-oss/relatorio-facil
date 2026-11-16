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
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const load = useCallback(async () => {
    const { data, error } = await supabase.from("clients").select("*").order("name");
    if (error) setError(error.message); else setClients(data || []);
  }, []);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/login");
      else { setReady(true); load(); }
    });
  }, [router, load]);
  async function addClient(e) {
    e.preventDefault(); setError(""); setSaving(true);
    const { error } = await supabase.from("clients").insert({ name: name.trim(), email: email.trim() });
    setSaving(false);
    if (error) return setError(error.message);
    setName(""); setEmail(""); load();
  }
  async function logout() { await supabase.auth.signOut(); router.replace("/"); }
  if (!ready) return <div className="workspace-loading">Loading your workspace…</div>;
  return <div className="workspace">
    <aside className="workspace-sidebar">
      <Link href="/" className="workspace-brand"><span className="brand-mark">R</span><span>ReportDrop<small>ACCOUNTING WORKSPACE</small></span></Link>
      <div className="sidebar-label">WORKSPACE</div>
      <div className="sidebar-active"><span>▦</span> Clients <b>{clients.length}</b></div>
      <div className="sidebar-bottom"><div className="sidebar-avatar">RD</div><div className="sidebar-user"><b>My workspace</b><small>Account owner</small></div><button onClick={logout} aria-label="Log out" title="Log out">↗</button></div>
    </aside>
    <main className="workspace-main">
      <header className="workspace-topbar"><span>Workspace <i>/</i> Clients</span><button className="workspace-logout" onClick={logout}>Log out <span>↗</span></button></header>
      <section className="workspace-content">
        <div className="workspace-heading"><div><div className="section-kicker">CLIENT MANAGEMENT</div><h1>Your clients</h1><p>Keep every client and their monthly reports organized in one place.</p></div><div className="client-count"><strong>{clients.length.toString().padStart(2,"0")}</strong><span>ACTIVE CLIENTS</span></div></div>
        <div className="workspace-grid">
          <section className="client-panel">
            <div className="panel-heading"><div><h2>Client directory</h2><p>All the businesses you manage.</p></div><span className="directory-count">{clients.length} {clients.length === 1 ? "client" : "clients"}</span></div>
            {clients.length === 0 ? <div className="empty-clients"><div className="empty-icon">▤</div><h3>No clients yet</h3><p>Add your first client to start organizing monthly financial reports.</p></div> :
              <div className="client-directory">{clients.map((c) => <Link className="client-entry" key={c.id} href={`/clients/${c.id}`}><span className="client-initial">{(c.name || "C").trim().charAt(0).toUpperCase()}</span><span className="client-details"><b>{c.name}</b><small>{c.email}</small></span><span className="client-open">Open workspace <i>→</i></span></Link>)}</div>}
          </section>
          <section className="add-client-panel">
            <div className="add-panel-icon">＋</div><h2>Add a client</h2><p>Create a client profile to start storing their monthly reports.</p>
            <form onSubmit={addClient}>
              <label htmlFor="client-name">Business name</label><input id="client-name" required value={name} onChange={(e)=>setName(e.target.value)} placeholder="e.g. Acme Consulting"/>
              <label htmlFor="client-email">Client email address</label><input id="client-email" type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="name@company.com"/>
              {error && <p className="workspace-error">{error}</p>}
              <button className="add-client-submit" disabled={saving}>{saving ? "Adding client…" : "Add client"} <span>→</span></button>
            </form>
            <div className="privacy-note"><span>✓</span> Client reports are kept private to your workspace.</div>
          </section>
        </div>
      </section>
      <footer className="workspace-footer"><span>© {new Date().getFullYear()} ReportDrop</span><span>Simple, organized client reporting.</span></footer>
    </main>
  </div>;
}
