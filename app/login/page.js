"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/dashboard");
    });
  }, [router]);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const { data, error } = mode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/dashboard" }
        });
    setLoading(false);
    if (error) return setMsg({ type: "error", text: error.message });
    if (data.session) router.replace("/dashboard");
    else setMsg({
      type: "ok",
      text: "Your account was created. Check your inbox and spam folder for the confirmation email. If it does not arrive, you can request another email below."
    });
  }

  async function resendConfirmation() {
    if (!email) return setMsg({ type: "error", text: "Enter your email address first." });
    setResending(true);
    setMsg(null);
    const { error } = await supabase.auth.resend({ type: "signup", email });
    setResending(false);
    setMsg(error
      ? { type: "error", text: error.message }
      : { type: "ok", text: "If this address has a pending signup, a new confirmation email has been requested. Check your inbox and spam folder." });
  }

  return <div className="auth-shell">
    <Link href="/" className="brand"><span className="brand-mark">R</span> ReportDrop</Link>
    <div className="auth-card">
      <div className="section-kicker">YOUR REPORTING WORKSPACE</div>
      <h1>{mode === "login" ? "Welcome back." : "Get started."}</h1>
      <p className="muted">{mode === "login" ? "Log in to manage your client reports." : "Create an account for your accounting team."}</p>
      <form onSubmit={submit}>
        <label htmlFor="email">Work email</label>
        <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        {mode === "login" && <p className="auth-switch" style={{ textAlign: "right", margin: "10px 0 0" }}><Link href="/forgot-password">Forgot password?</Link></p>}
        <button className="auth-submit" disabled={loading}>{loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"} <span>→</span></button>
        {msg && <p className={msg.type}>{msg.text}</p>}
        {mode === "signup" && msg?.type === "ok" && <button type="button" className="auth-switch" style={{ border: 0, background: "none", color: "var(--brand)", fontWeight: 700, cursor: "pointer" }} onClick={resendConfirmation} disabled={resending}>{resending ? "Sending…" : "Resend confirmation email"}</button>}
      </form>
      <p className="auth-switch">{mode === "login" ? "New to ReportDrop?" : "Already have an account?"} <button type="button" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMsg(null); }}>{mode === "login" ? "Create an account" : "Log in"}</button></p>
    </div>
    <Link href="/" className="back-home">← Back to ReportDrop</Link>
  </div>;
}
