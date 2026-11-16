import "./globals.css";

export const metadata = {
  title: "ReportDrop",
  description: "Deliver monthly financial reports to your clients from one place, with no folders and no scattered emails.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
