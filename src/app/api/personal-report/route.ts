import {NextResponse} from "next/server";
import Stripe from "stripe";
import {buildPersonalReport} from "@/lib/personal-love-report";
export const runtime="nodejs";
export async function GET(request:Request){
 const sessionId=new URL(request.url).searchParams.get("session_id")||"";
 if(!/^cs_(test_|live_)[A-Za-z0-9]+$/.test(sessionId))return NextResponse.json({error:"Invalid session."},{status:400});
 if(!process.env.STRIPE_SECRET_KEY)return NextResponse.json({error:"Payment verification unavailable."},{status:503});
 try{
  const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);
  const session=await stripe.checkout.sessions.retrieve(sessionId);
  if(session.mode!=="payment"||session.payment_status!=="paid"||session.status!=="complete"||session.amount_total!==199||session.currency!=="eur"||session.metadata?.offer!=="lover-reveal-trial")return NextResponse.json({error:"Payment not yet confirmed."},{status:403});
  const choices=session.metadata?.reportChoices||"";
  if(!/^[01]{24}$/.test(choices))return NextResponse.json({error:"Your payment is confirmed, but this checkout did not include all 24 quiz answers. Contact support with your receipt."},{status:409});
  const customerName=session.customer_details?.name||"";
  const report=buildPersonalReport(choices,customerName);
  return NextResponse.json({report},{headers:{"Cache-Control":"private, no-store"}});
 }catch(error){console.error("Personal report retrieval failed",error);return NextResponse.json({error:"We could not open your report right now."},{status:500});}
}
