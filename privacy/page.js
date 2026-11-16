import Link from "next/link";

export const metadata = { title: "Privacy Policy – ReportDrop" };

export default function Privacy() {
  return (
    <>
      <p><Link href="/">← Home</Link></p>
      <h1>Privacy Policy</h1>
      <p className="muted">Last updated: November 16, 2026</p>

      <h2>What we collect</h2>
      <p>We collect the email address and name on your account (including when you sign in with Google), the client names and email addresses you add, and the PDF files you upload.</p>

      <h2>How we use it</h2>
      <p>We use this data only to run the service: to identify you, store your reports, and let you access and download them. We do not sell your data or share it with third parties for advertising.</p>

      <h2>Where it is stored</h2>
      <p>Data is stored with the infrastructure providers we use (Supabase and Vercel). Files are private: each user can only access their own data.</p>

      <h2>Your rights</h2>
      <p>You can ask us at any time to delete your account and all of your data, or to send you a copy, by writing to the email below.</p>

      <h2>Contact</h2>
      <p>YOUR_EMAIL_HERE</p>
    </>
  );
}
