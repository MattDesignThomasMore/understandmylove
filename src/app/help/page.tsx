"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Topic = "all" | "getting-started" | "report" | "billing" | "cancellation" | "technical";
type Article = { id: string; topic: Exclude<Topic, "all">; title: string; answer: string; tags?: string[] };

const articles: Article[] = [
  {id:"start",topic:"getting-started",title:"How do I take the test?",answer:"Select “Take the test” on the main website. Answer 24 short either-or questions by choosing the option that feels most natural to you. There are no right or wrong answers.",tags:["quiz","begin"]},
  {id:"time",topic:"getting-started",title:"How long does the test take?",answer:"Most people finish in about four minutes. Take your time and answer honestly."},
  {id:"single",topic:"getting-started",title:"Can I take the test if I'm single?",answer:"Absolutely. UnderstandMylove explores how you express and experience connection, whether you're single, dating or in a relationship."},
  {id:"result",topic:"report",title:"What will I find in my report?",answer:"Your report covers your primary and secondary love expressions, giving versus receiving love, emotional safety, potential disconnect triggers, communication guidance and a practical 28-day action plan."},
  {id:"personal",topic:"report",title:"How is my result calculated?",answer:"Your answers are compared across eight expressions of love. The result is intended as a personal self-reflection tool, not a clinical assessment or diagnosis."},
  {id:"access",topic:"report",title:"When can I access my report?",answer:"The checkout offer provides access after successful payment. If payment succeeds but your report does not appear, check your payment confirmation and contact the support address provided in your purchase confirmation."},
  {id:"price",topic:"billing",title:"How much does UnderstandMylove cost?",answer:"The displayed offer is €1.95 today for seven days of full access. After seven days, the subscription renews at €29.95 every four weeks until cancelled. Review the terms shown at checkout before confirming your payment.",tags:["price","trial","subscription"]},
  {id:"payment",topic:"billing",title:"Is the payment secure?",answer:"Payments are processed through the website's checkout provider. Always check the final payment amount and renewal conditions on the checkout screen before completing your purchase."},
  {id:"renew",topic:"billing",title:"Will my subscription renew automatically?",answer:"Yes. Under the displayed offer, it renews at €29.95 every four weeks after the initial seven-day access period, unless you cancel before renewal."},
  {id:"cancel",topic:"cancellation",title:"How can I cancel my subscription?",answer:"Use the cancellation or subscription-management instructions provided in your payment confirmation. If you cannot find them, contact the support contact listed in that confirmation. Cancellation prevents future renewals according to the applicable terms; keep the confirmation for your records.",tags:["stop","unsubscribe"]},
  {id:"refund",topic:"cancellation",title:"Can I request a refund?",answer:"Please refer to the refund policy presented at purchase and in your confirmation. Include the purchase email and transaction date when contacting support; never send your full card number."},
  {id:"load",topic:"technical",title:"The checkout or report isn't loading. What can I try?",answer:"Refresh the page, check your connection and try another up-to-date browser. Temporarily disable extensions that block checkout scripts. If you have already paid, avoid paying again before checking your confirmation."},
  {id:"mail",topic:"technical",title:"I haven't received a confirmation email.",answer:"Check spam, promotions and the email address entered during checkout. If it is still missing, contact the support details shown on your payment or bank confirmation with the date and amount."}
];

const topics: {id:Topic;title:string;description:string;icon:string}[] = [
  {id:"all",title:"All questions",description:"Browse every answer",icon:"✦"},
  {id:"getting-started",title:"Getting started",description:"Taking the love test",icon:"♡"},
  {id:"report",title:"Your report",description:"Your personal insights",icon:"✧"},
  {id:"billing",title:"Subscription & billing",description:"Pricing and payments",icon:"€"},
  {id:"cancellation",title:"Cancellation & refunds",description:"Managing your access",icon:"↺"},
  {id:"technical",title:"Technical support",description:"Solving common issues",icon:"⚙"}
];

function Brand() {
  return <span className="hc-brand">
    <span className="hc-mark" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" fill="currentColor" opacity=".1"/><path d="M24 34.3 13.8 24.2c-5.7-5.7 2.7-14.1 8.4-8.4l1.8 1.8 1.8-1.8c5.7-5.7 14.1 2.7 8.4 8.4L24 34.3Z" fill="currentColor"/><path d="M24 7v5M41 24h-5M12 24H7M36 12l-3.5 3.5M15.5 15.5 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></span>
    <span>Understand<span className="hc-rose">Mylove</span></span>
  </span>;
}

export default function HelpPage() {
  const [topic,setTopic] = useState<Topic>("all");
  const [query,setQuery] = useState("");
  const [expanded,setExpanded] = useState<string|null>(null);
  const [showAll,setShowAll] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchFocused,setSearchFocused] = useState(false);
  const [activeSuggestion,setActiveSuggestion] = useState(0);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && document.activeElement === searchRef.current) { setQuery(""); searchRef.current?.blur(); }
      if (event.key === "/" && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) { event.preventDefault(); searchRef.current?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  const filtered = useMemo(() => {
    const q=query.trim().toLocaleLowerCase();
    return articles.filter(a => (q || topic==="all" || a.topic===topic) &&
      (!q || [a.title,a.answer,...(a.tags||[])].join(" ").toLocaleLowerCase().includes(q)));
  },[topic,query]);
  const displayed=showAll||query.trim()||topic!=="all"?filtered:filtered.slice(0,6);
  const suggestions=query.trim()?filtered.slice(0,5):[];
  function openArticle(id:string) {
    setTopic("all"); setShowAll(true); setExpanded(id); setSearchFocused(false);
    window.requestAnimationFrame(()=>document.getElementById(`article-${id}`)?.scrollIntoView({behavior:"smooth",block:"center"}));
  }
  function submitSearch() {
    if (suggestions.length) openArticle(suggestions[Math.min(activeSuggestion,suggestions.length-1)].id);
    else document.getElementById("hc-answers")?.scrollIntoView({behavior:"smooth"});
  }
  function chooseTopic(next:Topic) {
    setTopic(next);setExpanded(null);setShowAll(false);
    document.getElementById("hc-answers")?.scrollIntoView({behavior:"smooth",block:"start"});
  }
  return <main className="hc">
    <header className="hc-header"><div className="hc-shell hc-header-inner">
      <a href="/" aria-label="UnderstandMylove home"><Brand/></a>
      <a className="hc-close" href="/" aria-label="Close Help Center and return to website" title="Back to website"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></a>
    </div></header>

    <section className="hc-hero">
      <div className="hc-shell hc-hero-inner">
        <span className="hc-pill"><span>♥</span> HERE WHEN YOU NEED US</span>
        <h1>A little help, <em>with a lot of heart.</em></h1>
        <p>Questions about your test, personal report or subscription? Find a clear answer, at your own pace.</p>
        <div className="hc-search-wrap">
          <form className="hc-search" role="search" onSubmit={e=>{e.preventDefault();submitSearch();}}>
            <span aria-hidden="true">⌕</span>
            <input ref={searchRef} type="search" value={query} autoComplete="off"
              onFocus={()=>setSearchFocused(true)}
              onBlur={()=>window.setTimeout(()=>setSearchFocused(false),140)}
              onChange={e=>{setQuery(e.target.value);setExpanded(null);setActiveSuggestion(0);}}
              onKeyDown={e=>{if(e.key==="ArrowDown"){e.preventDefault();setActiveSuggestion(i=>Math.min(i+1,suggestions.length-1));}if(e.key==="ArrowUp"){e.preventDefault();setActiveSuggestion(i=>Math.max(0,i-1));}}}
              placeholder="What can we help you with?" aria-label="Search help articles"
              aria-controls="hc-search-suggestions" aria-expanded={searchFocused&&!!query.trim()}
              aria-activedescendant={searchFocused&&suggestions.length?`suggestion-${suggestions[Math.min(activeSuggestion,suggestions.length-1)].id}`:undefined}/>
            {query&&<button type="button" onClick={()=>{setQuery("");setExpanded(null);searchRef.current?.focus();}} aria-label="Clear search">×</button>}
            <button className="hc-search-submit" type="submit" aria-label="Search questions">Search</button>
          </form>
          {searchFocused&&query.trim()&&<div id="hc-search-suggestions" className="hc-suggestions" role="listbox" aria-label="Suggested answers">
            {suggestions.length?suggestions.map((a,i)=><button type="button" role="option" aria-selected={i===activeSuggestion} id={`suggestion-${a.id}`} key={a.id} className={i===activeSuggestion?"selected":""} onMouseDown={e=>e.preventDefault()} onClick={()=>openArticle(a.id)}>
              <span>{a.title}</span><span aria-hidden="true">↗</span>
            </button>):<div className="hc-no-suggestions">No matching questions. Try “refund”, “report” or “cancel”.</div>}
            <div className="hc-suggestion-foot">Press Enter to open an answer · Search covers all topics</div>
          </div>}
        </div>
      </div>
    </section>

    <section className="hc-content hc-shell" id="hc-answers">
      <div className="hc-heading"><span className="hc-kicker">EXPLORE THE HELP CENTER</span><h2>What can we help <em>you with?</em></h2><p>Choose a topic, or search for something specific above.</p></div>
      <div className="hc-categories" aria-label="Help topics">
        {topics.map(t=><button type="button" key={t.id} className={`hc-category ${topic===t.id?"active":""}`} onClick={()=>chooseTopic(t.id)} aria-pressed={topic===t.id}>
          <span className="hc-category-icon">{t.icon}</span><strong>{t.title}</strong><small>{t.description}</small>
        </button>)}
      </div>
      <div className="hc-results-heading"><div><span className="hc-kicker">GOOD TO KNOW</span><h2>{query.trim()?`Search results`:topics.find(t=>t.id===topic)?.title}</h2></div><span className="hc-count">{filtered.length} {filtered.length===1?"answer":"answers"}</span></div>
      {query.trim()&&<p className="hc-search-for">Showing matches for “{query.trim()}”</p>}
      <div className="hc-articles">
        {displayed.length?displayed.map(a=><article className="hc-article" id={`article-${a.id}`} key={a.id}>
          <h3><button type="button" aria-expanded={expanded===a.id} aria-controls={`answer-${a.id}`} onClick={()=>setExpanded(expanded===a.id?null:a.id)}><span>{a.title}</span><span className="hc-toggle" aria-hidden="true">{expanded===a.id?"−":"+"}</span></button></h3>
          {expanded===a.id&&<div id={`answer-${a.id}`} className="hc-answer"><p>{a.answer}</p></div>}
        </article>):<div className="hc-empty"><strong>No matching answers yet.</strong><p>Try another word or browse all questions.</p><button type="button" onClick={()=>{setQuery("");setTopic("all");setShowAll(true);}}>Show all questions</button></div>}
      </div>
      {!query.trim()&&topic==="all"&&!showAll&&filtered.length>6&&<button type="button" className="hc-more" onClick={()=>setShowAll(true)}>View all {filtered.length} questions ↓</button>}
      <aside className="hc-contact"><span className="hc-contact-heart">♡</span><div><span className="hc-kicker">STILL NEED A HAND?</span><h2>We're here to help you find your way.</h2><p>For payment or account-specific issues, use the support contact provided in your purchase confirmation. Please never share your password or full card number.</p></div><a href="/" className="hc-cta">Back to website <span>→</span></a></aside>
    </section>

    <style>{`
      .hc{--green:#214d45;--deep:#173b35;--rose:#e76f72;--cream:#fffaf4;--mint:#eaf5ef;--line:rgba(33,77,69,.12);min-height:100vh;background:var(--cream);color:var(--deep);font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
      .hc *{box-sizing:border-box}.hc button,.hc input{font:inherit}.hc button{cursor:pointer}.hc a{color:inherit;text-decoration:none}.hc-shell{width:min(1120px,calc(100% - 44px));margin:auto}
      .hc-header{height:76px;background:rgba(255,250,244,.96);border-bottom:1px solid var(--line)}.hc-header-inner{height:100%;display:flex;justify-content:space-between;align-items:center;gap:15px}.hc-brand{display:inline-flex;align-items:center;gap:9px;font:700 24px Georgia,"Times New Roman",serif;letter-spacing:-.7px;color:#1b7b66;white-space:nowrap}.hc-mark{width:35px;height:35px;color:var(--rose)}.hc-mark svg{width:100%;height:100%}.hc-rose{color:var(--rose)}.hc-close{width:43px;height:43px;display:grid;place-items:center;border:1px solid #dfe8e3;border-radius:50%;background:#fff;color:var(--green)!important;transition:background .2s,transform .2s}.hc-close svg{width:15px;height:15px}.hc-close:hover{background:#eaf5ef;transform:rotate(90deg)}.hc-close:focus-visible{outline:3px solid #a8d9c7;outline-offset:3px}
      .hc-hero{background:radial-gradient(circle at 8% 45%,#ffebe5 0,transparent 42%),radial-gradient(circle at 92% 75%,#e8f5ee 0,transparent 42%),linear-gradient(140deg,#fffaf4,#f8fbf8);padding:82px 0 90px;text-align:center}.hc-hero-inner{max-width:850px}.hc-pill{display:inline-flex;align-items:center;gap:7px;border:1px solid #f7d9d2;border-radius:50px;background:#fff0ea;color:#85524d;padding:7px 13px;font-size:11px;letter-spacing:.09em;font-weight:800}.hc-pill span{color:var(--rose);font-size:15px}.hc h1,.hc h2{font-family:Georgia,"Times New Roman",serif;font-weight:400;letter-spacing:-.045em}.hc h1{font-size:clamp(43px,5.6vw,73px);line-height:1.08;max-width:790px;margin:25px auto 18px;color:var(--green)}.hc h1 em,.hc h2 em{color:var(--rose);font-weight:400}.hc-hero p{max-width:570px;margin:0 auto;color:#61746e;font-size:15px;line-height:1.8}.hc-search-wrap{position:relative;max-width:590px;margin:34px auto 0;z-index:5}.hc-search{height:60px;width:100%;margin:0;background:white;border:1px solid var(--line);border-radius:14px;box-shadow:0 12px 35px rgba(25,65,53,.08);display:flex;align-items:center;gap:13px;padding:0 17px;text-align:left}.hc-search:focus-within{outline:2px solid #b8ded0}.hc-search>span{font-size:29px;color:#639487}.hc-search input{min-width:0;flex:1;border:0;outline:0;background:transparent;font-size:14px;color:var(--deep)}.hc-search input::placeholder{color:#8a9c97}.hc-search button{border:0;background:#f6eee9;color:var(--green);border-radius:50%;height:26px;width:26px;flex-shrink:0}.hc-search .hc-search-submit{border-radius:9px;background:var(--rose);color:white;width:auto;height:38px;padding:0 15px;font-size:12px;font-weight:750}.hc-search .hc-search-submit:hover{background:#d95d62}.hc-suggestions{position:absolute;top:calc(100% + 8px);left:0;right:0;background:#fff;border:1px solid #e3ebe5;border-radius:14px;box-shadow:0 17px 40px rgba(25,65,53,.13);padding:7px;text-align:left;max-height:340px;overflow-y:auto}.hc-suggestions>button{width:100%;display:flex;justify-content:space-between;gap:12px;padding:12px 13px;border:0;border-radius:9px;background:white;color:var(--green);font-size:13px;text-align:left}.hc-suggestions>button:hover,.hc-suggestions>button.selected{background:#edf7f0}.hc-suggestion-foot{padding:9px 12px 5px;border-top:1px solid #eef1ed;color:#82948c;font-size:10px}.hc-no-suggestions{padding:16px 12px;font-size:12px;color:#60776d}.hc-article{scroll-margin-top:110px}
      .hc-content{padding:74px 0 105px;scroll-margin-top:25px}.hc-heading{text-align:center}.hc-kicker{font-size:10px;font-weight:850;letter-spacing:.14em;color:#16806b}.hc-heading h2{font-size:clamp(34px,4vw,49px);margin:15px 0 12px;color:var(--green)}.hc-heading p{font-size:13px;color:#71817b;margin:0}.hc-categories{margin-top:37px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:15px}.hc-category{text-align:left;display:flex;flex-direction:column;align-items:flex-start;min-height:134px;padding:21px;border:1px solid var(--line);background:#fff;border-radius:16px;color:var(--deep);transition:transform .2s,border-color .2s,background .2s}.hc-category:hover{transform:translateY(-3px);border-color:#a9d5c4}.hc-category.active{background:#f0f8f3;border-color:#9acdb9}.hc-category-icon{display:grid;place-items:center;width:35px;height:35px;border-radius:10px;background:#e7f4ec;color:#19876d;font-size:20px;margin-bottom:12px}.hc-category strong{font-size:14px}.hc-category small{font-size:12px;color:#72817c;margin-top:6px;line-height:1.5}.hc-results-heading{margin-top:72px;display:flex;align-items:end;justify-content:space-between;gap:15px}.hc-results-heading h2{font-size:35px;margin:9px 0 0;color:var(--green)}.hc-count{font-size:12px;color:#75857e}.hc-search-for{font-size:13px;color:#667d73}.hc-articles{margin-top:21px;border:1px solid var(--line);background:white;border-radius:18px;overflow:hidden}.hc-article+.hc-article{border-top:1px solid var(--line)}.hc-article h3{margin:0}.hc-article h3 button{width:100%;display:flex;align-items:center;justify-content:space-between;gap:20px;text-align:left;padding:20px 24px;border:0;background:transparent;color:var(--deep);font-size:15px;font-weight:650}.hc-article h3 button:hover{background:#fafdfb}.hc-toggle{flex:0 0 29px;display:grid;place-items:center;height:29px;background:#eaf5ef;color:#23876d;border-radius:50%;font-size:19px;font-weight:400}.hc-answer{padding:0 64px 22px 24px;color:#596d66;font-size:14px;line-height:1.8}.hc-answer p{margin:0}.hc-empty{padding:40px;text-align:center}.hc-empty p{color:#71817b;font-size:13px}.hc-empty button,.hc-more{background:white;border:1px solid #c9ded5;border-radius:11px;padding:12px 19px;color:var(--green);font-size:13px;font-weight:700}.hc-more{display:block;margin:22px auto 0}.hc-contact{display:flex;align-items:center;gap:24px;margin-top:74px;padding:34px 38px;background:#e8f4ec;border:1px solid #d6eadd;border-radius:22px}.hc-contact-heart{font-size:39px;color:var(--rose)}.hc-contact>div{flex:1}.hc-contact h2{font-size:30px;margin:7px 0;color:var(--green)}.hc-contact p{font-size:13px;color:#5e746a;line-height:1.7;max-width:630px;margin:0}.hc-cta{display:inline-flex;gap:12px;align-items:center;justify-content:center;background:var(--rose);color:white!important;padding:15px 20px;border-radius:11px;font-size:13px;font-weight:750;white-space:nowrap}.hc-cta:hover{background:#d95d62}.hc-footer{background:#173b35;color:#fff;padding:35px 0}.hc-footer-inner{display:flex;align-items:center;justify-content:space-between;gap:20px}.hc-footer .hc-brand{font-size:20px;color:white}.hc-footer .hc-mark{width:29px;height:29px}.hc-footer-inner>span,.hc-footer-inner>a{font-size:11px;color:#bed3cc}
      @media(max-width:700px){.hc-shell{width:min(100% - 34px,520px)}.hc-header{height:68px}.hc-brand{font-size:20px}.hc-mark{width:30px;height:30px}.hc-close{width:39px;height:39px}.hc-hero{padding:56px 0 64px}.hc h1{font-size:clamp(41px,10vw,56px);margin-top:22px}.hc-hero p{font-size:14px}.hc-search-wrap{margin-top:26px}.hc-search{height:56px}.hc-search .hc-search-submit{height:35px;padding:0 11px}.hc-content{padding:55px 0 75px}.hc-categories{grid-template-columns:repeat(2,minmax(0,1fr));gap:11px;margin-top:28px}.hc-category{padding:15px;min-height:130px}.hc-category strong{font-size:13px}.hc-category small{font-size:11px}.hc-results-heading{margin-top:54px}.hc-results-heading h2{font-size:30px}.hc-article h3 button{padding:18px 16px;font-size:14px}.hc-answer{padding:0 20px 20px 16px}.hc-contact{flex-direction:column;align-items:flex-start;padding:25px;gap:13px;margin-top:55px}.hc-contact h2{font-size:28px}.hc-cta{width:100%}.hc-footer-inner{flex-wrap:wrap}.hc-footer-inner>span{order:3;width:100%}}
      @media(max-width:370px){.hc-brand{font-size:17px}.hc-close{width:37px;height:37px}.hc-categories{grid-template-columns:1fr}.hc-category{min-height:95px}}
      @media(prefers-reduced-motion:reduce){.hc *{scroll-behavior:auto!important;transition:none!important}}
    `}</style>
  </main>;
}
