"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível fazer login."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <Link href="/" className="brand brand-light">
          <span className="brand-mark">S</span>
          <span className="brand-text">
            <strong>Saborê</strong>
            <small>receitas que aproximam</small>
          </span>
        </Link>

        <div className="auth-visual-content">
          <span className="eyebrow eyebrow-light">Bem-vindo de volta</span>
          <h1>Seu caderno de receitas, sempre com você.</h1>
          <p>
            Entre para salvar receitas, organizar seus favoritos e descobrir
            novos sabores.
          </p>
        </div>

        <div className="auth-decoration" aria-hidden="true">
          <span>folhas</span>
          <strong>+</strong>
          <span>temperos</span>
          <strong>+</strong>
          <span>afeto</span>
        </div>
      </section>

      <section className="auth-form-side">
        <div className="auth-form-card">
          <Link href="/" className="back-link">← Voltar para o início</Link>

          <div className="auth-heading">
            <span className="eyebrow">Acesse sua conta</span>
            <h2>Login</h2>
            <p>Use seu e-mail e senha para continuar.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              <span>E-mail</span>
              <input
                type="email"
                placeholder="voce@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label>
              <span>Senha</span>
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </label>

            {error && <div className="form-error">{error}</div>}

            <button
              type="submit"
              className="button button-primary button-full"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="auth-switch">
            Ainda não tem conta? <Link href="/cadastro">Cadastre-se</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
