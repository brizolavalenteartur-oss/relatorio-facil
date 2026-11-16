"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setMessage(null);
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "The passwords do not match." });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }
    setMessage({ type: "ok", text: "Your password has been updated. Redirecting to login…" });
    setTimeout(() => router.replace("/login"), 1600);
  }

  return <div className="auth-shell">
    <Link href="/" className="brand"><span className="brand-mark">R</span> ReportDrop</Link>
    <div className="auth-card">
      <div className="section-kicker">ACCOUNT RECOVERY</div>
      <h1>Create a new password.</h1>
      <p className="muted">Choose a new password for your ReportDrop account.</p>
      <form onSubmit={submit}>
        <label htmlFor="password">New password</label>
        <input id="password" type="password" autoComplete="new-password" minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} />
        <label htmlFor="confirm-password">Confirm new password</label>
        <input id="confirm-password" type="password" autoComplete="new-password" minLength={6} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <button className="auth-submit" disabled={loading}>{loading ? "Updating…" : "Update password"} <span>→</span></button>
        {message && <p className={message.type}>{message.text}</p>}
      </form>
      <p className="auth-switch"><Link href="/login">Back to login</Link></p>
    </div>
    <Link href="/" className="back-home">← Back to ReportDrop</Link>
  </div>;
}
