"use client";

import { useState } from "react";

/**
 * Configure the Stripe-hosted CUSTOMER PORTAL LOGIN LINK in .env.local:
 * NEXT_PUBLIC_STRIPE_PORTAL_LOGIN_URL=https://billing.stripe.com/p/login/...
 *
 * This must be the actual customer portal login link created in Stripe,
 * not an individual customer's portal session URL.
 *
 * After updating .env.local, restart `npm run dev`.
 * Without a configured link, the page provides a support-email fallback
 * and NEVER claims a subscription has been cancelled.
 */
const portalUrl = process.env.NEXT_PUBLIC_STRIPE_PORTAL_LOGIN_URL?.trim() ?? "";
const supportEmail = "support@understandmylove.com"; // Set to your real, monitored inbox.
const isPortalConfigured = /^https:\/\/billing\.stripe\.com\/p\/login\/[a-zA-Z0-9_/-]+(?:\?.*)?$/.test(portalUrl);

function Logo() {
  return (
    <span className="cs-logo">
      <span className="cs-logo-mark" aria-hidden="true">
        <svg viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" fill="currentColor" opacity=".11" />
          <path d="M24 34.3 13.8 24.2c-5.7-5.7 2.7-14.1 8.4-8.4l1.8 1.8 1.8-1.8c5.7-5.7 14.1 2.7 8.4 8.4L24 34.3Z" fill="currentColor" />
          <path d="M24 7v5M41 24h-5M12 24H7M36 12l-3.5 3.5M15.5 15.5 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      <span>Understand<span className="cs-coral">Mylove</span></span>
    </span>
  );
}

const faqs = [
  {
    q: "Can I cancel at any time?",
    a: "Yes. You can request cancellation of future renewals at any time. If you have access to the Stripe Customer Portal, you can manage your subscription there. Follow the cancellation process through to its confirmation.",
  },
  {
    q: "What happens after I cancel?",
    a: "Your subscription will stop renewing once cancellation has been confirmed. Your remaining access depends on the effective cancellation date shown in the billing portal or your confirmation.",
  },
  {
    q: "Will I receive a cancellation confirmation?",
    a: "Check the confirmation displayed by your billing provider and any related email. Keep it for your records. Simply opening this page does not cancel your subscription.",
  },
  {
    q: "I can't find my subscription. What should I do?",
    a: "Check the email address used at checkout, including spam and promotions for payment emails. If you still need help, contact our support team with the purchase email, payment date and approximate amount. Never send your full card number.",
  },
  {
    q: "Does cancelling automatically refund a previous payment?",
    a: "No. Cancellation of future renewals and refunds are separate processes. To request a refund, contact support and refer to the refund terms presented at purchase.",
  },
];

export default function CancelSubscriptionPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [copyState, setCopyState] = useState(false);

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const mailSubject = "UnderstandMylove — Subscription cancellation assistance";
  const mailBody = [
    "Hello UnderstandMylove Support,",
    "",
    "I would like help cancelling my subscription and stopping future renewals.",
    email.trim() ? `My purchase email is: ${email.trim()}` : "My purchase email is: [enter your checkout email]",
    "",
    "Please let me know how I can complete the cancellation securely.",
    "",
    "Thank you.",
  ].join("\n");
  const mailto = `mailto:${supportEmail}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

  async function copySupportRequest() {
    const content = `To: ${supportEmail}\nSubject: ${mailSubject}\n\n${mailBody}`;
    try {
      await navigator.clipboard.writeText(content);
      setCopyState(true);
    } catch {
      window.prompt("Copy your cancellation support request:", content);
    }
  }

  return (
    <main className="cs-page">
      <header className="cs-header">
        <div className="cs-container cs-header-inner">
          <a href="/" aria-label="UnderstandMylove home"><Logo /></a>
          <a className="cs-close" href="/" aria-label="Close and return to website" title="Back to website">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </a>
        </div>
      </header>

      <section className="cs-hero">
        <div className="cs-container cs-hero-content">
          <span className="cs-pill">♡ HERE TO MAKE THINGS SIMPLE</span>
          <h1>Your journey, <em>your choice.</em></h1>
          <p>Need to say goodbye for now? We understand. Managing your subscription should always feel simple and straightforward.</p>
        </div>
      </section>

      <section className="cs-content cs-container">
        <div className="cs-grid">
          <div className="cs-main-card">
            <span className="cs-eyebrow">MANAGE YOUR MEMBERSHIP</span>
            <h2>Cancel your <em>subscription.</em></h2>
            <p className="cs-lead">You are always in control of your UnderstandMylove membership. Follow the steps below to manage your billing securely.</p>

            <div className="cs-steps">
              <div className="cs-step"><span className="cs-number">01</span><div><strong>Open your billing portal</strong><p>Use the secure subscription management link to access your account.</p></div></div>
              <div className="cs-step"><span className="cs-number">02</span><div><strong>Find your active subscription</strong><p>Follow the billing provider's identity verification steps and select the subscription you want to manage.</p></div></div>
              <div className="cs-step"><span className="cs-number">03</span><div><strong>Confirm your cancellation</strong><p>Complete all confirmation steps and keep the cancellation confirmation for your records.</p></div></div>
            </div>

            {isPortalConfigured ? (
              <div className="cs-action-panel">
                <span className="cs-eyebrow">SECURE SUBSCRIPTION MANAGEMENT</span>
                <h3>Ready when you are.</h3>
                <p>Continue to Stripe to securely manage your subscription. You may need access to the email address used at checkout.</p>
                <a className="cs-primary" href={portalUrl} rel="noopener noreferrer">Manage my subscription <span>↗</span></a>
                <small>You'll be redirected to Stripe. Your subscription is not cancelled until you complete and confirm the process there.</small>
              </div>
            ) : (
              <div className="cs-action-panel">
                <span className="cs-eyebrow">CANCELLATION ASSISTANCE</span>
                <h3>We'll help you with the next step.</h3>
                <p>Online subscription management is not connected on this page yet. Contact support to request cancellation of future renewals.</p>
                <button type="button" className="cs-primary" onClick={() => setShowHelp(true)}>Get cancellation help <span>→</span></button>
                <small>Opening this page or requesting help does not automatically cancel a subscription.</small>
              </div>
            )}
          </div>

          <aside className="cs-aside">
            <div className="cs-info-card">
              <span className="cs-info-icon">♡</span>
              <span className="cs-eyebrow">GOOD TO KNOW</span>
              <h3>A little clarity goes a long way.</h3>
              <p>Here's a reminder of the subscription offer displayed on UnderstandMylove.</p>
              <div className="cs-price-row"><span>Initial access</span><strong>€1,95 / 7 days</strong></div>
              <div className="cs-price-row"><span>Then renews</span><strong>€29,95 / 4 weeks</strong></div>
              <p className="cs-small-note">The terms that apply to your purchase are those confirmed at your checkout. Cancellation stops future renewals once completed.</p>
            </div>
            <div className="cs-soft-card">
              <span className="cs-soft-icon">✉</span>
              <h3>Need a helping hand?</h3>
              <p>Having trouble accessing your billing portal or locating a purchase? You can always reach out.</p>
              <button type="button" onClick={() => setShowHelp(v => !v)}>Contact support <span>→</span></button>
              <a href="/help">Visit the Help Center ↗</a>
            </div>
          </aside>
        </div>

        {showHelp && (
          <section className="cs-support" id="cancellation-support" aria-label="Cancellation support">
            <div className="cs-support-head"><div><span className="cs-eyebrow">PERSONAL ASSISTANCE</span><h2>We'll help you <em>find your way.</em></h2></div><button type="button" aria-label="Close support panel" onClick={() => setShowHelp(false)}>×</button></div>
            <p>Enter the email address you used at checkout. We'll prepare a cancellation request that you can send through your email application.</p>
            <label htmlFor="cs-purchase-email">Purchase email <span>(optional)</span></label>
            <input id="cs-purchase-email" type="email" autoComplete="email" value={email} onChange={e => {setEmail(e.target.value);setCopyState(false);}} placeholder="you@example.com" aria-invalid={!!email.trim() && !validEmail} />
            {!!email.trim() && !validEmail && <small className="cs-error">Please enter a valid email or leave the field empty.</small>}
            <div className="cs-support-actions">
              <a className={`cs-primary ${email.trim() && !validEmail ? "cs-disabled" : ""}`} href={email.trim() && !validEmail ? undefined : mailto} aria-disabled={!!email.trim() && !validEmail} onClick={e => {if(email.trim() && !validEmail)e.preventDefault();}}>Open email request <span>↗</span></a>
              <button type="button" className="cs-secondary" disabled={!!email.trim() && !validEmail} onClick={copySupportRequest}>{copyState ? "Copied ✓" : "Copy request"}</button>
            </div>
            <small>This prepares an email only. You must send it yourself. Do not include passwords or full payment card details.</small>
          </section>
        )}

        <div className="cs-faq-section">
          <span className="cs-eyebrow">COMMON QUESTIONS</span>
          <h2>Everything you might <em>want to know.</em></h2>
          <div className="cs-faq-list">
            {faqs.map((faq, index) => (
              <article className="cs-faq" key={faq.q}>
                <h3><button type="button" aria-expanded={openFaq === index} aria-controls={`cs-answer-${index}`} onClick={() => setOpenFaq(openFaq === index ? null : index)}><span>{faq.q}</span><span className="cs-plus" aria-hidden="true">{openFaq === index ? "−" : "+"}</span></button></h3>
                {openFaq === index && <div id={`cs-answer-${index}`} className="cs-answer">{faq.a}</div>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cs-bottom"><div className="cs-container"><span className="cs-eyebrow">WHATEVER COMES NEXT</span><h2>Thank you for being <em>part of our story.</em></h2><p>We hope UnderstandMylove has brought a little more clarity to your connections.</p><a href="/">Return to UnderstandMylove <span>→</span></a></div></section>
    

      <style>{`
        .cs-page{--green:#214d45;--deep:#173b35;--rose:#e76f72;--cream:#fffaf4;--mint:#eaf5ef;--line:rgba(33,77,69,.13);min-height:100vh;background:var(--cream);color:var(--deep);font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
        .cs-page *{box-sizing:border-box}.cs-page a{text-decoration:none;color:inherit}.cs-page button,.cs-page input{font:inherit}.cs-page button{cursor:pointer}.cs-container{width:min(1120px,calc(100% - 44px));margin:0 auto}
        .cs-header{height:76px;background:#fffaf4;border-bottom:1px solid var(--line)}.cs-header-inner{height:100%;display:flex;align-items:center;justify-content:space-between}.cs-logo{display:inline-flex;align-items:center;gap:9px;font:700 24px Georgia,"Times New Roman",serif;letter-spacing:-.7px;color:#1b7b66;white-space:nowrap}.cs-logo-mark{width:35px;height:35px;color:var(--rose)}.cs-logo-mark svg{width:100%;height:100%}.cs-coral{color:var(--rose)}.cs-close{width:43px;height:43px;display:grid;place-items:center;border:1px solid #dfe8e3;border-radius:50%;background:#fff;color:var(--green)!important;transition:background .2s,transform .2s}.cs-close svg{width:15px;height:15px}.cs-close:hover{background:#eaf5ef;transform:rotate(90deg)}.cs-close:focus-visible{outline:3px solid #a8d9c7;outline-offset:3px}
        .cs-hero{text-align:center;padding:76px 0 89px;background:radial-gradient(circle at 9% 35%,#ffebe5 0,transparent 43%),radial-gradient(circle at 92% 73%,#e8f5ee 0,transparent 42%),linear-gradient(135deg,#fffaf4,#f8fbf8)}.cs-hero-content{max-width:780px}.cs-pill{display:inline-block;border:1px solid #f7d9d2;background:#fff0ea;border-radius:40px;color:#90534f;font-size:10px;font-weight:800;letter-spacing:.11em;padding:10px 16px}
        .cs-page h1,.cs-page h2,.cs-page h3{font-family:Georgia,"Times New Roman",serif;letter-spacing:-.045em;font-weight:400}.cs-page h1 em,.cs-page h2 em{color:var(--rose);font-weight:400}.cs-page h1{font-size:clamp(46px,6vw,75px);color:var(--green);line-height:1.12;margin:24px 0 17px}.cs-hero p{font-size:15px;line-height:1.8;color:#657971;max-width:565px;margin:0 auto}
        .cs-content{padding:82px 0 105px}.cs-grid{display:grid;grid-template-columns:1.27fr .73fr;gap:27px;align-items:start}.cs-eyebrow{font-size:10px;letter-spacing:.14em;font-weight:850;color:#16806b}.cs-main-card{background:white;border:1px solid #eadfd8;border-radius:23px;padding:39px;box-shadow:0 19px 55px rgba(34,60,47,.055)}.cs-main-card h2{font-size:clamp(36px,4vw,49px);line-height:1.13;color:var(--green);margin:13px 0 16px}.cs-lead{font-size:13px;line-height:1.85;color:#6d8177;max-width:570px;margin:0 0 31px}.cs-steps{border-top:1px solid var(--line)}.cs-step{display:flex;align-items:flex-start;gap:19px;padding:22px 0;border-bottom:1px solid var(--line)}.cs-number{flex:0 0 37px;width:37px;height:37px;display:grid;place-items:center;background:#eaf5ef;border-radius:11px;color:#16806b;font-size:12px;font-weight:800}.cs-step strong{font-size:14px}.cs-step p{font-size:12px;line-height:1.7;color:#73867b;margin:7px 0 0}.cs-action-panel{margin-top:28px;background:#fff1ec;border:1px solid #f7d9cf;border-radius:16px;padding:25px}.cs-action-panel h3{font-size:26px;color:var(--green);margin:11px 0}.cs-action-panel p{font-size:12px;color:#7d7169;line-height:1.75;margin:0 0 20px}.cs-primary{display:flex;align-items:center;justify-content:center;gap:15px;width:100%;border:0;border-radius:11px;padding:17px 18px;background:var(--rose);color:white!important;font-size:13px;font-weight:750;text-align:center;box-shadow:0 12px 25px rgba(231,111,114,.17);transition:background .2s,transform .2s}.cs-primary:hover{background:#d95e62;transform:translateY(-1px)}.cs-action-panel>small{display:block;text-align:center;color:#8d8179;font-size:10px;line-height:1.65;margin-top:13px}
        .cs-aside{display:flex;flex-direction:column;gap:18px}.cs-info-card,.cs-soft-card{border-radius:19px;padding:28px}.cs-info-card{background:#eaf5ef;border:1px solid #d9eadf}.cs-info-icon{display:grid;place-items:center;width:41px;height:41px;border-radius:12px;background:white;color:var(--rose);font-size:24px;margin-bottom:20px}.cs-info-card h3,.cs-soft-card h3{font-size:27px;line-height:1.15;color:var(--green);margin:12px 0}.cs-info-card>p,.cs-soft-card p{font-size:12px;color:#6b8174;line-height:1.75}.cs-price-row{display:flex;justify-content:space-between;gap:15px;align-items:center;padding:15px 0;border-top:1px solid #d0e4d7;font-size:12px;color:#587369}.cs-price-row strong{color:var(--green);white-space:nowrap;font-size:13px}.cs-info-card .cs-small-note{font-size:10px;color:#728b7c;line-height:1.7;border-top:1px solid #d0e4d7;padding-top:16px;margin-bottom:0}.cs-soft-card{background:white;border:1px solid #eadfd8}.cs-soft-icon{font-size:26px;color:var(--rose)}.cs-soft-card button,.cs-soft-card a{display:flex;align-items:center;gap:8px;background:none;border:0;padding:9px 0;font-size:12px;font-weight:750;color:#19846a;text-align:left}.cs-soft-card button:hover,.cs-soft-card a:hover{text-decoration:underline}
        .cs-support{margin-top:25px;padding:30px 36px;border:1px solid #d9e9df;border-radius:19px;background:#f0f8f3}.cs-support-head{display:flex;justify-content:space-between;align-items:start;gap:12px}.cs-support-head h2{font-size:31px;color:var(--green);margin:8px 0 10px}.cs-support-head>button{border:1px solid #c9e2d1;background:white;color:var(--green);border-radius:50%;height:31px;width:31px;font-size:19px}.cs-support>p{font-size:12px;line-height:1.8;color:#627a6c;max-width:660px}.cs-support>label{display:block;font-size:12px;font-weight:750;margin:21px 0 9px}.cs-support>label span{font-size:11px;font-weight:400;color:#728b7c}.cs-support input{width:100%;max-width:470px;border:1px solid #d4e4d9;border-radius:10px;padding:14px;background:white;color:var(--deep);outline:none}.cs-support input:focus{border-color:#8bc8a9;box-shadow:0 0 0 3px #e0f1e5}.cs-support-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:19px 0 12px}.cs-support-actions .cs-primary{width:auto;min-width:220px}.cs-secondary{padding:16px 20px;background:white;border:1px solid #c9dfd1;border-radius:10px;color:var(--green);font-size:12px;font-weight:750}.cs-support>small{font-size:10px;color:#71867a;line-height:1.6}.cs-error{display:block;color:#b94b50;font-size:11px;margin-top:8px}.cs-disabled{opacity:.5;pointer-events:none}
        .cs-faq-section{margin:80px auto 0;max-width:880px}.cs-faq-section>h2{font-size:clamp(34px,4vw,46px);color:var(--green);margin:13px 0 27px}.cs-faq-list{background:white;border:1px solid var(--line);border-radius:18px;overflow:hidden}.cs-faq+.cs-faq{border-top:1px solid var(--line)}.cs-faq h3{margin:0;font-family:inherit;letter-spacing:normal}.cs-faq h3 button{display:flex;align-items:center;justify-content:space-between;gap:15px;width:100%;text-align:left;background:white;border:0;padding:20px 24px;font-size:14px;font-weight:700;color:var(--deep)}.cs-faq h3 button:hover{background:#fafdfb}.cs-plus{flex:0 0 29px;width:29px;height:29px;border-radius:50%;display:grid;place-items:center;background:#eaf5ef;color:#23876d;font-size:19px;font-weight:400}.cs-answer{padding:0 65px 22px 24px;color:#657a6e;font-size:13px;line-height:1.8}
        .cs-bottom{text-align:center;padding:74px 0 82px;background:#eaf5ef}.cs-bottom h2{font-size:clamp(34px,4.5vw,52px);color:var(--green);margin:14px 0}.cs-bottom p{color:#647b70;font-size:13px;margin-bottom:26px}.cs-bottom a{display:inline-flex;gap:12px;background:var(--rose);color:#fff;padding:14px 21px;border-radius:10px;font-size:13px;font-weight:750}.cs-bottom a:hover{background:#d95e62}.cs-footer{background:#173b35;color:white;padding:34px 0}.cs-footer-inner{display:flex;align-items:center;justify-content:space-between;gap:15px}.cs-footer .cs-logo{font-size:19px;color:white}.cs-footer .cs-logo-mark{width:28px;height:28px}.cs-footer-inner>span,.cs-footer-inner>a{font-size:11px;color:#c2d6ce}
        @media(max-width:800px){.cs-grid{grid-template-columns:1fr}.cs-aside{display:grid;grid-template-columns:1fr 1fr}.cs-content{padding:55px 0 75px}.cs-faq-section{margin-top:65px}}
        @media(max-width:600px){.cs-container{width:min(100% - 34px,520px)}.cs-header{height:68px}.cs-logo{font-size:20px}.cs-logo-mark{width:30px;height:30px}.cs-close{width:39px;height:39px}.cs-hero{padding:58px 0 65px}.cs-page h1{font-size:clamp(43px,10vw,57px)}.cs-hero p{font-size:14px}.cs-main-card{padding:24px 19px;border-radius:17px}.cs-main-card h2{font-size:38px}.cs-aside{grid-template-columns:1fr}.cs-info-card,.cs-soft-card{padding:23px}.cs-support{padding:23px 18px}.cs-support-actions{flex-direction:column;align-items:stretch}.cs-support-actions .cs-primary{width:100%}.cs-faq h3 button{padding:18px 16px}.cs-answer{padding:0 20px 20px 16px}.cs-bottom{padding:59px 0 67px}.cs-footer-inner{flex-wrap:wrap}.cs-footer-inner>span{order:3;width:100%}}
        @media(max-width:360px){.cs-logo{font-size:17px}.cs-main-card{padding:20px 15px}.cs-price-row{font-size:11px}.cs-price-row strong{font-size:12px}}
        @media(prefers-reduced-motion:reduce){.cs-page *{transition:none!important;scroll-behavior:auto!important}}
      `}</style>
    </main>
  );
}
