import Stripe from "stripe";
import {buildPersonalReport,dimensions} from "./personal-love-report";
const escapeHtml=(x:string)=>x.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]||c));
export async function sendPaidLoveReport(session:Stripe.Checkout.Session){
 if(session.payment_status!=="paid"||session.mode!=="payment"||session.metadata?.offer!=="lover-reveal-trial"||session.amount_total!==199)return;
 const choices=session.metadata?.reportChoices||"";if(!/^[01]{24}$/.test(choices)){console.error("Paid session missing report answers",session.id);return;}
 const to=session.customer_details?.email;if(!to){console.error("Paid session missing email",session.id);return;}
 const key=process.env.RESEND_API_KEY,from=process.env.REPORT_FROM_EMAIL;
 if(!key||!from){console.warn("Report email not sent: configure RESEND_API_KEY and REPORT_FROM_EMAIL");return;}
 const r=buildPersonalReport(choices,session.customer_details?.name||"");
 const url=new URL("/checkout/success",process.env.NEXT_PUBLIC_APP_URL||"https://understandmylove.com");url.searchParams.set("session_id",session.id);
 const bullet=(s:string)=>`<li style="margin:12px 0;line-height:1.7">${escapeHtml(s)}</li>`;
 const html=`<div style="background:#fff8f4;padding:32px 12px;color:#214c42;font-family:Arial,sans-serif"><div style="max-width:640px;margin:auto;background:white;padding:32px;border-radius:18px"><p style="color:#e86b72;font-weight:bold">♡ UnderstandMylove</p><h1 style="font-family:Georgia,serif;font-weight:normal">Dear ${escapeHtml(r.name)}, your love report is here.</h1><p>Your personal reflections, based on the 24 choices you made.</p><h2>Your primary expression: ${escapeHtml(dimensions[r.primary].title)}</h2><p>${escapeHtml(dimensions[r.primary].receive)}</p><h2>Your secondary expression: ${escapeHtml(dimensions[r.secondary].title)}</h2><p>${escapeHtml(dimensions[r.secondary].receive)}</p><h2>Your personal insights</h2><ul>${r.insights.map(bullet).join("")}</ul><h2>Words you can use</h2><ul>${r.scripts.map(bullet).join("")}</ul><h2>Your 28-day plan</h2><ol>${r.plan.map(d=>bullet(`Day ${d.day}: ${d.action}`)).join("")}</ol><p style="margin-top:30px"><a style="background:#e86b72;color:white;padding:15px 20px;border-radius:9px;text-decoration:none" href="${escapeHtml(url.toString())}">Open your beautifully formatted report</a></p><p style="font-size:12px;color:#71867b">For reflection and education, not diagnosis or therapy. Keep this email private.</p></div></div>`;
 const res=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":`Bearer ${key}`,"Content-Type":"application/json","Idempotency-Key":`uml-love-report-${session.id}`},body:JSON.stringify({from,to,subject:`${r.name}, your personal love report is ready ♡`,html})});
 if(!res.ok)throw new Error(`Report email delivery failed: ${res.status} ${(await res.text()).slice(0,250)}`);
}
