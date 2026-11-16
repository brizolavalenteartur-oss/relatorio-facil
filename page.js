"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../lib/supabase";

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/dashboard");
    });
  }, [router]);

  async function googleLogin() {
    setMsg(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) setMsg({ type: "error", text: error.message });
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const creds = { email, password };
    const { data, error } = mode === "signin"
      ? await supabase.auth.signInWithPassword(creds)
      : await supabase.auth.signUp(creds);
    setLoading(false);
    if (error) return setMsg({ type: "error", text: error.message });
    if (data.session) router.replace("/dashboard");
    else setMsg({ type: "ok", text: "Account created. Check your email to confirm it, then sign in." });
  }

  return (
    <div style={{ maxWidth: 400, margin: "60px auto 0" }}>
      <h1>ReportDrop</h1>
      <p className="muted">Deliver monthly financial reports to your clients from one place.</p>

      <div className="card" style={{ marginTop: 24 }}>
        <button type="button" onClick={googleLogin} style={{ width: "100%" }}>Continue with Google</button>
        <p className="muted" style={{ textAlign: "center", margin: "16px 0 0" }}>or use email and password</p>
        <form onSubmit={submit}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          <div style={{ marginTop: 20 }}>
            <button disabled={loading}>{mode === "signin" ? "Sign in" : "Create account"}</button>{" "}
            <button type="button" className="ghost" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
              {mode === "signin" ? "Create an account" : "I already have an account"}
            </button>
          </div>
        </form>
        {msg && <p className={msg.type}>{msg.text}</p>}
      </div>
      <p className="muted" style={{ textAlign: "center", marginTop: 20 }}><Link href="/privacy">Privacy Policy</Link></p>
    </div>
  );
}
