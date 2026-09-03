import Link from "next/link";

export function Header() {
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
          <Link href="/login" className="button button-ghost">
            Login
          </Link>
          <Link href="/cadastro" className="button button-primary">
            Cadastre-se
          </Link>
        </nav>
      </div>
    </header>
  );
}
