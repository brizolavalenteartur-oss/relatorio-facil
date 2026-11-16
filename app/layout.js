import "./globals.css";

export const metadata = { title: "Relatório Fácil", description: "Entregue relatórios mensais aos seus clientes sem pastas nem e-mails soltos." };

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
