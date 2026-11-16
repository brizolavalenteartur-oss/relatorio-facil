"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password"
    });
    setLoading(false);
    setMessage(error
      ? { type: "error", text: error.message }
      : { type: "ok", text: "If an account exists for this email, a password reset link has been requested. Check your inbox and spam folder." });
  }

  return <div className="auth-shell">
    <Link href="/" className="brand"><span className="brand-mark">R</span> ReportDrop</Link>
    <div className="auth-card">
      <div className="section-kicker">ACCOUNT RECOVERY</div>
      <h1>Reset your password.</h1>
      <p className="muted">Enter the email address associated with your ReportDrop account. We’ll request a secure reset link.</p>
      <form onSubmit={submit}>
        <label htmlFor="email">Work email</label>
        <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="auth-submit" disabled={loading}>{loading ? "Please wait…" : "Send reset link"} <span>→</span></button>
        {message && <p className={message.type}>{message.text}</p>}
      </form>
    </div>
    <Link href="/login" className="back-home">← Back to login</Link>
  </div>;
}
