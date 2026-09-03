import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Saborê | Receitas para todos os dias",
  description: "Descubra receitas, salve favoritas e encontre inspiração para cozinhar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
