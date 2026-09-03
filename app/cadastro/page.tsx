"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      await register({ name, email, password });
      router.push("/login?cadastro=sucesso");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível concluir o cadastro."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-visual auth-visual-register">
        <Link href="/" className="brand brand-light">
          <span className="brand-mark">S</span>
          <span className="brand-text">
            <strong>Saborê</strong>
            <small>receitas que aproximam</small>
          </span>
        </Link>

        <div className="auth-visual-content">
          <span className="eyebrow eyebrow-light">Comece sua coleção</span>
          <h1>Crie, descubra e guarde receitas que valem repetir.</h1>
          <p>
            Sua conta deixa tudo organizado para você encontrar seus pratos
            preferidos quando quiser.
          </p>
        </div>

        <div className="auth-decoration" aria-hidden="true">
          <span>descubra</span>
          <strong>→</strong>
          <span>salve</span>
          <strong>→</strong>
          <span>cozinhe</span>
        </div>
      </section>

      <section className="auth-form-side">
        <div className="auth-form-card">
          <Link href="/" className="back-link">← Voltar para o início</Link>

          <div className="auth-heading">
            <span className="eyebrow">É rapidinho</span>
            <h2>Crie sua conta</h2>
            <p>Preencha seus dados para começar.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              <span>Nome</span>
              <input
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
              />
            </label>

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
              <input
                type="password"
                placeholder="Mínimo de 6 caracteres"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                minLength={6}
                required
              />
            </label>

            <label>
              <span>Confirme a senha</span>
              <input
                type="password"
                placeholder="Digite a senha novamente"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                minLength={6}
                required
              />
            </label>

            {error && <div className="form-error">{error}</div>}

            <button
              type="submit"
              className="button button-primary button-full"
              disabled={loading}
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <p className="auth-switch">
            Já possui cadastro? <Link href="/login">Faça login</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
