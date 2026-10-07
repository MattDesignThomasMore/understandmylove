"use client";

import { FormEvent, useState } from "react";

const SUPPORT_EMAIL = "support@understandmylove.com"; // Change if your verified support inbox is different.

type FormValues = { name: string; email: string; topic: string; message: string; order: string };
const initial: FormValues = {name:"",email:"",topic:"",message:"",order:""};
const topics = ["General question","My personal report","Subscription & billing","Cancel my subscription","Refund request","Technical issue","Other"];

function Logo() {
  return <span className="contact-logo">
    <span className="contact-logo-icon" aria-hidden="true">
      <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" fill="currentColor" opacity=".11"/><path d="M24 34.3 13.8 24.2c-5.7-5.7 2.7-14.1 8.4-8.4l1.8 1.8 1.8-1.8c5.7-5.7 14.1 2.7 8.4 8.4L24 34.3Z" fill="currentColor"/><path d="M24 7v5M41 24h-5M12 24H7M36 12l-3.5 3.5M15.5 15.5 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
    </span>
    <span>Understand<span className="contact-rose">Mylove</span></span>
  </span>;
}

export default function ContactPage() {
  const [form,setForm]=useState<FormValues>(initial);
  const [attempted,setAttempted]=useState(false);
  const [prepared,setPrepared]=useState(false);
  const [copied,setCopied]=useState(false);
  const [privacy,setPrivacy]=useState(false);
  const change=(key:keyof FormValues,value:string)=>{setForm(f=>({...f,[key]:value}));setPrepared(false);};
  const validEmail=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const valid=form.name.trim().length>=2&&validEmail&&!!form.topic&&form.message.trim().length>=15&&privacy;
  const subject=`UnderstandMylove support — ${form.topic||"General question"}`;
  const message=`Hello UnderstandMylove Support,\n\n${form.message.trim()}\n\n---\nName: ${form.name.trim()}\nEmail: ${form.email.trim()}\nTopic: ${form.topic}\n${form.order.trim()?`Order reference (optional): ${form.order.trim()}\n`:""}\nSent from the UnderstandMylove contact page.`;
  const mailto=`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

  function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();setAttempted(true);
    if(!valid)return;
    setPrepared(true);
    window.location.href=mailto;
  }
  async function copyMessage(){
    try{
      await navigator.clipboard.writeText(`To: ${SUPPORT_EMAIL}\nSubject: ${subject}\n\n${message}`);
      setCopied(true);
    }catch{
      setCopied(false);
      window.prompt("Copy your message:",`To: ${SUPPORT_EMAIL}\nSubject: ${subject}\n\n${message}`);
    }
  }
  return <main className="contact-page">
    <header className="contact-header">
      <div className="contact-container contact-header-inner">
        <a href="/" aria-label="UnderstandMylove home"><Logo/></a>
        <a className="contact-close" href="/" aria-label="Close contact page and return to website" title="Back to website"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></a>
      </div>
    </header>

    <section className="contact-hero">
      <div className="contact-container">
        <span className="contact-pill">♡ A LITTLE SPACE TO CONNECT</span>
        <h1>We're here <em>to listen.</em></h1>
        <p>Questions, concerns, or something you'd like to share? Whatever brings you here, we're glad you reached out.</p>
      </div>
    </section>

    <section className="contact-main contact-container">
      <div className="contact-grid">
        <aside className="contact-aside">
          <span className="contact-eyebrow">GET IN TOUCH</span>
          <h2>Every question <em>matters.</em></h2>
          <p>Whether you're wondering about your love report or need help with your subscription, you can find the right next step here.</p>
          <div className="contact-aside-card">
            <span className="contact-icon">✉</span>
            <div><strong>Prefer writing directly?</strong><p>You can reach us by email.</p><a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL} ↗</a></div>
          </div>
          <div className="contact-aside-card">
            <span className="contact-icon">♡</span>
            <div><strong>Looking for a quick answer?</strong><p>Our Help Center covers reports, billing, subscriptions and more.</p><a href="/help">Explore the Help Center →</a></div>
          </div>
          <div className="contact-note"><span>✧</span><p>A gentle reminder: UnderstandMylove is an educational self-reflection experience, not medical or therapeutic advice.</p></div>
        </aside>

        <div className="contact-form-card">
          <div className="contact-card-top"><span className="contact-eyebrow">SEND US A MESSAGE</span><h2>How can we <em>help you?</em></h2><p>Fill in the details below and we'll prepare your message.</p></div>
          <form onSubmit={submit} noValidate>
            <div className="contact-two">
              <label> Your name <span>*</span><input autoComplete="name" value={form.name} maxLength={100} onChange={e=>change("name",e.target.value)} placeholder="Your first name" aria-invalid={attempted&&form.name.trim().length<2}/>{attempted&&form.name.trim().length<2&&<small className="contact-error">Please enter your name (at least 2 characters).</small>}</label>
              <label> Email address <span>*</span><input type="email" autoComplete="email" value={form.email} maxLength={254} onChange={e=>change("email",e.target.value)} placeholder="you@example.com" aria-invalid={attempted&&!validEmail}/>{attempted&&!validEmail&&<small className="contact-error">Enter a valid email address.</small>}</label>
            </div>
            <label> What is this about? <span>*</span><select value={form.topic} onChange={e=>change("topic",e.target.value)} aria-invalid={attempted&&!form.topic}><option value="" disabled>Choose a topic</option>{topics.map(t=><option key={t} value={t}>{t}</option>)}</select>{attempted&&!form.topic&&<small className="contact-error">Please select a topic.</small>}</label>
            <label> Order reference <span className="contact-optional">(optional)</span><input value={form.order} maxLength={100} onChange={e=>change("order",e.target.value)} placeholder="Only if your question concerns a purchase"/></label>
            <label> Your message <span>*</span><textarea value={form.message} maxLength={4000} rows={6} onChange={e=>change("message",e.target.value)} placeholder="Tell us a little about what's on your mind..." aria-invalid={attempted&&form.message.trim().length<15}/><span className="contact-field-bottom">{attempted&&form.message.trim().length<15?<small className="contact-error">Please write at least 15 characters.</small>:<small>Share what feels relevant. Please don't include passwords or full card details.</small>}<small>{form.message.length}/4000</small></span></label>
            <label className="contact-consent"><input type="checkbox" checked={privacy} onChange={e=>setPrivacy(e.target.checked)}/><span>I understand this will open my email app to send the message. <b>*</b></span></label>
            {attempted&&!privacy&&<small className="contact-error">Please confirm before continuing.</small>}
            <button className="contact-submit" type="submit">Prepare my message <span>→</span></button>
            <p className="contact-disclaimer">Your email app will open with your message ready to send. Nothing is submitted automatically from this page.</p>
            {prepared&&<div className="contact-prepared" role="status"><strong>Your message is ready ♡</strong><p>If your email app didn't open, use the options below. Your message has not been sent yet.</p><div><a href={mailto}>Open email app ↗</a><button type="button" onClick={copyMessage}>{copied?"Copied ✓":"Copy message"}</button></div></div>}
          </form>
        </div>
      </div>
    </section>

    <section className="contact-bottom"><div className="contact-container"><span className="contact-eyebrow">YOU'RE IN THE RIGHT PLACE</span><h2>A little understanding goes <em>a long way.</em></h2><p>Sometimes a simple answer can make everything feel a little lighter.</p><a href="/help">Visit our Help Center <span>→</span></a></div></section>

    <style>{`
    .contact-page{--green:#214d45;--deep:#173b35;--rose:#e76f72;--cream:#fffaf4;--mint:#eaf5ef;--line:rgba(33,77,69,.13);min-height:100vh;background:var(--cream);color:var(--deep);font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
    .contact-page *{box-sizing:border-box}.contact-page a{text-decoration:none;color:inherit}.contact-page button,.contact-page input,.contact-page textarea,.contact-page select{font:inherit}.contact-container{width:min(1120px,calc(100% - 44px));margin:0 auto}.contact-header{height:76px;background:#fffaf4;border-bottom:1px solid var(--line)}.contact-header-inner{height:100%;display:flex;justify-content:space-between;align-items:center}.contact-logo{display:inline-flex;align-items:center;gap:9px;font:700 24px Georgia,"Times New Roman",serif;letter-spacing:-.7px;color:#1b7b66;white-space:nowrap}.contact-logo-icon{width:35px;height:35px;color:var(--rose)}.contact-logo-icon svg{width:100%;height:100%}.contact-rose{color:var(--rose)}.contact-close{width:43px;height:43px;display:grid;place-items:center;border:1px solid #dfe8e3;border-radius:50%;background:#fff;color:var(--green)!important;transition:background .2s,transform .2s}.contact-close svg{width:15px;height:15px}.contact-close:hover{background:#eaf5ef;transform:rotate(90deg)}.contact-close:focus-visible{outline:3px solid #a8d9c7;outline-offset:3px}
    .contact-hero{text-align:center;padding:76px 0 90px;background:radial-gradient(circle at 10% 35%,#ffebe5 0,transparent 42%),radial-gradient(circle at 91% 70%,#e8f5ee 0,transparent 42%),linear-gradient(135deg,#fffaf4,#f8fbf8)}.contact-pill{display:inline-block;border:1px solid #f7d9d2;background:#fff0ea;border-radius:40px;color:#90534f;font-size:10px;font-weight:800;letter-spacing:.11em;padding:10px 16px}.contact-page h1,.contact-page h2{font-family:Georgia,"Times New Roman",serif;letter-spacing:-.045em;font-weight:400}.contact-page h1{font-size:clamp(46px,6vw,75px);color:var(--green);line-height:1.12;margin:24px 0 17px}.contact-page h1 em,.contact-page h2 em{font-weight:400;color:var(--rose)}.contact-hero p{font-size:15px;line-height:1.8;color:#657971;max-width:570px;margin:0 auto}.contact-main{padding:83px 0 105px}.contact-grid{display:grid;grid-template-columns:.82fr 1.18fr;gap:75px;align-items:start}.contact-eyebrow{font-size:10px;letter-spacing:.14em;font-weight:850;color:#16806b}.contact-aside{padding-top:25px}.contact-aside h2{font-size:clamp(38px,4vw,53px);line-height:1.13;color:var(--green);margin:17px 0}.contact-aside>p{font-size:14px;line-height:1.9;color:#657971;max-width:385px;margin-bottom:34px}.contact-aside-card{display:flex;gap:15px;align-items:flex-start;border-top:1px solid var(--line);padding:24px 0}.contact-icon{display:grid;place-items:center;flex:0 0 43px;width:43px;height:43px;border-radius:13px;background:#e8f5ee;color:#21866d;font-size:23px}.contact-aside-card strong{font-size:14px;color:var(--deep)}.contact-aside-card p{font-size:12px;color:#72847c;line-height:1.7;margin:7px 0}.contact-aside-card a{font-size:12px;font-weight:750;color:#19846a}.contact-aside-card a:hover{text-decoration:underline}.contact-note{display:flex;gap:13px;background:#fff0ea;border:1px solid #f6ddd3;border-radius:15px;padding:15px 18px;margin-top:20px}.contact-note>span{font-size:21px;color:var(--rose)}.contact-note p{font-size:11px;line-height:1.7;color:#8c6960;margin:0}
    .contact-form-card{background:white;border:1px solid #eadfd8;border-radius:23px;padding:37px;box-shadow:0 19px 55px rgba(34,60,47,.065)}.contact-card-top h2{font-size:38px;line-height:1.15;color:var(--green);margin:11px 0}.contact-card-top p{font-size:13px;color:#71847a;line-height:1.7;margin:0 0 28px}.contact-form-card form{display:flex;flex-direction:column;gap:18px}.contact-two{display:grid;grid-template-columns:1fr 1fr;gap:15px}.contact-form-card label:not(.contact-consent){display:flex;flex-direction:column;gap:8px;font-size:12px;font-weight:750;color:var(--deep)}.contact-form-card label>span:not(.contact-optional){color:var(--rose)}.contact-form-card input:not([type=checkbox]),.contact-form-card select,.contact-form-card textarea{display:block;width:100%;min-width:0;border:1px solid #e3e8e3;border-radius:10px;background:#fcfdfb;color:var(--deep);padding:13px 14px;font-size:13px;font-weight:400;outline:0;transition:border-color .2s,box-shadow .2s}.contact-form-card textarea{resize:vertical;min-height:130px;line-height:1.65}.contact-form-card input:focus,.contact-form-card select:focus,.contact-form-card textarea:focus{border-color:#88c4ae;box-shadow:0 0 0 3px #e8f5ed}.contact-form-card [aria-invalid=true]{border-color:#dc7777!important}.contact-form-card input::placeholder,.contact-form-card textarea::placeholder{color:#9aaba3}.contact-optional{color:#87988e;font-size:11px;font-weight:400}.contact-field-bottom{display:flex;justify-content:space-between;gap:10px;color:#899b90!important;font-weight:400}.contact-field-bottom small{font-size:10px;line-height:1.5}.contact-error{color:#bd4b50!important;font-size:11px;font-weight:500}.contact-consent{display:flex;align-items:flex-start;gap:11px;color:#6b7e73;font-size:12px;line-height:1.65;cursor:pointer}.contact-consent input{accent-color:#21866d;margin-top:4px;flex-shrink:0}.contact-consent b{color:var(--rose)}.contact-submit{display:flex;align-items:center;justify-content:center;gap:16px;width:100%;border:0;border-radius:11px;padding:18px 20px;background:var(--rose);color:white;font-size:14px;font-weight:750;cursor:pointer;box-shadow:0 13px 26px rgba(231,111,114,.2);transition:background .2s,transform .2s}.contact-submit:hover{background:#d95e62;transform:translateY(-1px)}.contact-disclaimer{font-size:10px;color:#87988e;text-align:center;line-height:1.6;margin:-7px 0 0}.contact-prepared{border:1px solid #b8dcc8;background:#eef8f0;border-radius:12px;padding:16px;font-size:12px;color:var(--green)}.contact-prepared p{font-size:12px;line-height:1.6}.contact-prepared>div{display:flex;gap:10px;flex-wrap:wrap}.contact-prepared a,.contact-prepared button{border:1px solid #b8dcc8;border-radius:8px;background:white;padding:10px 12px;font-size:12px;font-weight:700;color:var(--green);cursor:pointer}
    .contact-bottom{text-align:center;padding:72px 0 83px;background:#eaf5ef}.contact-bottom h2{font-size:clamp(34px,4.5vw,52px);color:var(--green);margin:14px 0}.contact-bottom p{color:#647b70;font-size:13px;margin-bottom:26px}.contact-bottom a{display:inline-flex;gap:12px;background:var(--rose);color:#fff;padding:14px 21px;border-radius:10px;font-size:13px;font-weight:750}.contact-bottom a:hover{background:#d95e62}.contact-footer{background:#173b35;color:white;padding:34px 0}.contact-footer-inner{display:flex;align-items:center;justify-content:space-between;gap:15px}.contact-footer .contact-logo{font-size:19px;color:white}.contact-footer .contact-logo-icon{width:28px;height:28px}.contact-footer-inner>span,.contact-footer-inner>a{font-size:11px;color:#c2d6ce}
    @media(max-width:800px){.contact-grid{grid-template-columns:1fr;gap:40px}.contact-aside{padding-top:0}.contact-main{padding:55px 0 75px}.contact-aside>p{max-width:650px}.contact-aside-card{max-width:650px}.contact-note{max-width:650px}}
    @media(max-width:600px){.contact-container{width:min(100% - 34px,520px)}.contact-header{height:68px}.contact-logo{font-size:20px}.contact-logo-icon{width:30px;height:30px}.contact-close{width:39px;height:39px}.contact-hero{padding:58px 0 66px}.contact-page h1{font-size:clamp(43px,10vw,57px)}.contact-hero p{font-size:14px}.contact-aside h2{font-size:39px}.contact-form-card{padding:23px 18px;border-radius:17px}.contact-card-top h2{font-size:34px}.contact-two{grid-template-columns:1fr;gap:18px}.contact-bottom{padding:58px 0 65px}.contact-footer-inner{flex-wrap:wrap}.contact-footer-inner>span{order:3;width:100%}}
    @media(max-width:360px){.contact-logo{font-size:17px}.contact-form-card{padding:19px 14px}}
    @media(prefers-reduced-motion:reduce){.contact-page *{transition:none!important;scroll-behavior:auto!important}}
    `}</style>
  </main>;
}
