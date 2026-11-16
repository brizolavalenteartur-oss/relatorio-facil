"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState("entrar");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/dashboard");
    });
  }, [router]);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const creds = { email, password };
    const { data, error } = mode === "entrar"
      ? await supabase.auth.signInWithPassword(creds)
      : await supabase.auth.signUp(creds);
    setLoading(false);
    if (error) return setMsg({ type: "error", text: error.message });
    if (data.session) router.replace("/dashboard");
    else setMsg({ type: "ok", text: "Conta criada. Confirme o e-mail que enviamos e depois entre." });
  }

  return (
    <div style={{ maxWidth: 400, margin: "60px auto 0" }}>
      <h1>Relatório Fácil</h1>
      <p className="muted">Envie os relatórios mensais aos seus clientes num único lugar.</p>
      <form onSubmit={submit} className="card" style={{ marginTop: 24 }}>
        <label htmlFor="email">E-mail</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="senha">Senha</label>
        <input id="senha" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        <div style={{ marginTop: 20 }}>
          <button disabled={loading}>{mode === "entrar" ? "Entrar" : "Criar conta"}</button>{" "}
          <button type="button" className="ghost" onClick={() => setMode(mode === "entrar" ? "criar" : "entrar")}>
            {mode === "entrar" ? "Quero criar conta" : "Já tenho conta"}
          </button>
        </div>
        {msg && <p className={msg.type}>{msg.text}</p>}
      </form>
    </div>
  );
}
