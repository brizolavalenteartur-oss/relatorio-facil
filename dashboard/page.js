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
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("clients").select("*").order("name");
    if (error) setError(error.message);
    else setClients(data);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/");
      else { setReady(true); load(); }
    });
  }, [router, load]);

  async function addClient(e) {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.from("clients").insert({ name, email });
    if (error) return setError(error.message);
    setName(""); setEmail("");
    load();
  }

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  if (!ready) return null;

  return (
    <>
      <div className="row">
        <h1>Your clients</h1>
        <button className="ghost" onClick={logout}>Sign out</button>
      </div>

      <form onSubmit={addClient} className="card" style={{ marginTop: 20 }}>
        <label htmlFor="name">Client name</label>
        <input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
        <label htmlFor="cemail">Client email</label>
        <input id="cemail" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <div style={{ marginTop: 16 }}><button>Add client</button></div>
      </form>
      {error && <p className="error">{error}</p>}

      <h2>Clients</h2>
      {clients.length === 0 ? (
        <p className="muted">No clients yet. Add your first one above.</p>
      ) : (
        <ul className="list">
          {clients.map((c) => (
            <li key={c.id}>
              <div><Link href={`/clients/${c.id}`}>{c.name}</Link><div className="muted">{c.email}</div></div>
              <Link className="btn ghost" href={`/clients/${c.id}`}>Open</Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
