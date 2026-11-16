"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [step, setStep] = useState("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => { supabase.auth.getSession().then(({data}) => { if (data.session) router.replace("/dashboard"); }); }, [router]);

  async function submit(e) {
    e.preventDefault(); setLoading(true); setMsg(null);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      setLoading(false);
      if (error) return setMsg({type:"error",text:"We couldn't log you in. Check your email and password."});
      router.replace("/dashboard"); return;
    }
    const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      const duplicate = /already registered|already been registered|user already exists/i.test(error.message);
      return setMsg({type:"error",text:duplicate ? "This email is already registered. Please log in instead." : error.message});
    }
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      return setMsg({type:"error",text:"This email is already registered. Please log in instead."});
    }
    if (data.session) { router.replace("/dashboard"); return; }
    setStep("verify");
    setMsg({type:"success",text:"We've sent a 6-digit verification code to your email address."});
  }

  async function verify(e) {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) return setMsg({type:"error",text:"Enter the 6-digit code from your email."});
    setLoading(true); setMsg(null);
    const {error} = await supabase.auth.verifyOtp({email:email.trim(),token:code,type:"signup"});
    setLoading(false);
    if (error) return setMsg({type:"error",text:"That code is invalid or has expired. Please try again."});
    router.replace("/dashboard");
  }

  async function resend() {
    setLoading(true); setMsg(null);
    const {error} = await supabase.auth.resend({type:"signup",email:email.trim()});
    setLoading(false);
    setMsg(error ? {type:"error",text:error.message} : {type:"success",text:"A new verification code has been sent."});
  }

  return <div className="auth-shell"><Link href="/" className="brand"><span className="brand-mark">R</span> ReportDrop</Link>
    <div className="auth-card"><div className="section-kicker">YOUR REPORTING WORKSPACE</div>
      {step === "credentials" ? <>
        <h1>{mode === "login" ? "Welcome back." : "Create your account."}</h1>
        <p className="muted">{mode === "login" ? "Log in to manage your client reports." : "Start organizing your clients and monthly reports."}</p>
        <form onSubmit={submit}>
          <label htmlFor="email">Work email</label><input id="email" type="email" autoComplete="email" required value={email} onChange={(e)=>setEmail(e.target.value)}/>
          <label htmlFor="password">Password</label><input id="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={6} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder={mode === "signup" ? "At least 6 characters" : ""}/>
          <button className="auth-submit" disabled={loading}>{loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"} <span>→</span></button>
          {msg && <p className={msg.type === "error" ? "error" : "ok"}>{msg.text}</p>}
        </form>
        <p className="auth-switch">{mode === "login" ? "New to ReportDrop?" : "Already have an account?"} <button type="button" onClick={()=>{setMode(mode === "login" ? "signup" : "login");setMsg(null);}}>{mode === "login" ? "Create an account" : "Log in"}</button></p>
      </> : <>
        <div className="otp-symbol">✉</div><h1>Check your inbox.</h1>
        <p className="muted">Enter the 6-digit code we sent to <strong>{email}</strong> to verify your email and activate your account.</p>
        <form onSubmit={verify}>
          <label htmlFor="otp-code">Verification code</label><input className="otp-input" id="otp-code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={(e)=>setCode(e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="000000"/>
          <button className="auth-submit" disabled={loading || code.length !== 6}>{loading ? "Verifying…" : "Verify email"} <span>→</span></button>
          {msg && <p className={msg.type === "error" ? "error" : "ok"}>{msg.text}</p>}
        </form>
        <div className="otp-actions"><button type="button" onClick={resend} disabled={loading}>Resend code</button><button type="button" onClick={()=>{setStep("credentials");setCode("");setMsg(null);}}>Change email</button></div>
      </>}
    </div><Link href="/" className="back-home">← Back to ReportDrop</Link>
  </div>;
}
