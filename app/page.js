import Link from "next/link";

const features = [
  { number: "01", title: "One upload. Every client.", text: "Keep monthly financial reports organized by client instead of juggling folders and email attachments." },
  { number: "02", title: "A clear client workspace.", text: "Find each business, its contact details, and its report history in one simple dashboard." },
  { number: "03", title: "Built for recurring work.", text: "Give your monthly reporting routine a predictable home, so nothing gets lost between busy seasons." },
];

export default function Home() {
  return (
    <div className="marketing">
      <header className="site-header">
        <Link href="/" className="brand"><span className="brand-mark">R</span> ReportDrop</Link>
        <nav><a href="#how-it-works">How it works</a><a href="#features">Features</a><Link className="nav-login" href="/login">Log in</Link><Link className="nav-cta" href="/login?mode=signup">Get started <span>→</span></Link></nav>
      </header>
      <main className="marketing-main">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> REPORTING, WITHOUT THE RUNAROUND</div>
            <h1>Monthly reports.<br /><span>Delivered without</span><br />the busywork.</h1>
            <p className="hero-text">A simpler way for accounting firms to organize client reports and keep monthly delivery moving.</p>
            <div className="hero-actions"><Link href="/login?mode=signup" className="primary-cta">Start your workspace <span>→</span></Link><a href="#how-it-works" className="text-link">See how it works <span>↓</span></a></div>
            <div className="trust-note"><span className="trust-icon">✓</span> Made for accounting firms and bookkeepers</div>
          </div>
          <div className="hero-visual" aria-label="Preview of the ReportDrop workspace">
            <div className="visual-glow" />
            <div className="dashboard-preview">
              <div className="preview-top"><div className="preview-brand"><span className="brand-mark small">R</span> ReportDrop</div><span className="preview-avatar">JD</span></div>
              <div className="preview-content">
                <div className="preview-greeting">WORKSPACE OVERVIEW</div><h3>Your clients</h3><p className="preview-sub">Keep every monthly report in one place.</p>
                <div className="preview-stats"><div><span>CLIENTS</span><strong>24</strong></div><div><span>REPORTS THIS MONTH</span><strong>18</strong></div></div>
                <div className="preview-list-head"><strong>Recent clients</strong><span>View all</span></div>
                <div className="client-row"><span className="client-avatar lavender">AC</span><div><b>Acme Consulting</b><small>finance@acme.co</small></div><em>Up to date</em></div>
                <div className="client-row"><span className="client-avatar mint">NB</span><div><b>Northstar Bakery</b><small>books@northstar.com</small></div><em>Up to date</em></div>
                <div className="client-row"><span className="client-avatar peach">GF</span><div><b>Greenfield Studio</b><small>admin@greenfield.io</small></div><em className="pending">Report due</em></div>
                <div className="preview-upload"><span>＋</span><div><b>Upload a monthly report</b><small>PDF files, organized by client</small></div><span className="upload-arrow">↗</span></div>
              </div>
            </div>
            <div className="floating-note"><span className="floating-check">✓</span><div><b>Everything in its place</b><small>Client reports, neatly organized</small></div></div>
          </div>
        </section>
        <section className="value-strip"><span>LESS ADMINISTRATIVE WORK</span><i /> <span>MORE ORGANIZED CLIENT FILES</span><i /> <span>A BETTER MONTH-END ROUTINE</span></section>
        <section className="section-how" id="how-it-works"><div className="section-kicker">A SIMPLER WORKFLOW</div><h2>From scattered files to a<br />repeatable process.</h2><p className="section-intro">ReportDrop gives your team one straightforward place to manage recurring client reports.</p><div className="steps"><div><span>1</span><h3>Add your clients</h3><p>Save each business and its reporting contact in your workspace.</p></div><div><span>2</span><h3>Upload the report</h3><p>Choose the client and reporting month, then add the PDF.</p></div><div><span>3</span><h3>Keep everything organized</h3><p>Return to a clear history of reports for every client.</p></div></div></section>
        <section className="feature-section" id="features"><div><div className="section-kicker">MADE FOR THE MONTHLY CLOSE</div><h2>Less chasing.<br />More clarity.</h2><p className="section-intro">A focused tool for the recurring work accounting professionals already do.</p></div><div className="feature-list">{features.map((f) => <article key={f.number}><span>{f.number}</span><div><h3>{f.title}</h3><p>{f.text}</p></div><b>↗</b></article>)}</div></section>
        <section className="bottom-cta"><div><div className="section-kicker">MAKE REPORTING FEEL LIGHTER</div><h2>Bring your client reports<br />into one place.</h2><p>Start building a more organized monthly workflow.</p></div><Link href="/login?mode=signup" className="primary-cta">Create your workspace <span>→</span></Link></section>
      </main>
      <footer className="site-footer"><Link href="/" className="brand"><span className="brand-mark">R</span> ReportDrop</Link><span>Simple, organized client reporting.</span><span>© {new Date().getFullYear()} ReportDrop</span></footer>
    </div>
  );
}
