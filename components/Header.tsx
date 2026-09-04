"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function Header() {
  const { user, isAdmin, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" aria-label="Ir para a página inicial">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span className="brand-text">
            <strong>Saborê</strong>
            <small>receitas que aproximam</small>
          </span>
        </Link>

        <nav className="header-actions" aria-label="Acesso">
          {user ? (
            <>
              <span className="header-greeting">
                Olá, {user.name}
                {isAdmin && <span className="header-badge">Admin</span>}
              </span>
              <button
                type="button"
                className="button button-ghost"
                onClick={handleLogout}
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="button button-ghost">
                Login
              </Link>
              <Link href="/cadastro" className="button button-primary">
                Cadastre-se
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
