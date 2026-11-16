"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null); const [loading, setLoading] = useState(false);
  useEffect(() => { supabase.auth.getSession().then(({ data }) => { if (data.session) router.replace("/dashboard"); }); }, [router]);
  async function submit(e) {
    e.preventDefault(); setLoading(true); setMsg(null);
    const creds = { email, password };
    const { data, error } = mode === "login" ? await supabase.auth.signInWithPassword(creds) : await supabase.auth.signUp(creds);
    setLoading(false);
    if (error) return setMsg({ type: "error", text: error.message });
    if (data.session) router.replace("/dashboard");
    else setMsg({ type: "ok", text: "Your account has been created. Check your inbox to confirm your email, then log in." });
  }
  return <div className="auth-shell"><Link href="/" className="brand"><span className="brand-mark">R</span> ReportDrop</Link><div className="auth-card"><div className="section-kicker">YOUR REPORTING WORKSPACE</div><h1>{mode === "login" ? "Welcome back." : "Get started."}</h1><p className="muted">{mode === "login" ? "Log in to manage your client reports." : "Create an account for your accounting team."}</p><form onSubmit={submit}><label htmlFor="email">Work email</label><input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /><label htmlFor="password">Password</label><input id="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /><button className="auth-submit" disabled={loading}>{loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"} <span>→</span></button>{msg && <p className={msg.type}>{msg.text}</p>}</form><p className="auth-switch">{mode === "login" ? "New to ReportDrop?" : "Already have an account?"} <button type="button" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMsg(null); }}>{mode === "login" ? "Create an account" : "Log in"}</button></p></div><Link href="/" className="back-home">← Back to ReportDrop</Link></div>;
}