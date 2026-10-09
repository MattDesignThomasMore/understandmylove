export const dimensions = {
 communication: {title:"Heartfelt Communication", receive:"being listened to without judgment and hearing words that acknowledge your inner world", give:"asking thoughtful questions and speaking with sincerity", safety:"a calm conversation where your feelings are heard before anyone tries to fix them", trigger:"being interrupted, dismissed, or left guessing about what someone means", ask:"Could we make ten minutes to really hear each other, without trying to solve anything yet?", practice:"Share one feeling and one hope in a quiet conversation"},
 time: {title:"Meaningful Presence", receive:"someone choosing undistracted time with you", give:"making space in your day for shared moments", safety:"predictable moments of attention, even when life is busy", trigger:"repeated distractions or plans that never quite happen", ask:"Could we set aside a little time that's just ours this week?", practice:"Create a 15-minute phone-free moment together"},
 actions: {title:"Thoughtful Actions", receive:"practical care that eases your day", give:"noticing what needs doing and helping without fanfare", safety:"reliable follow-through and shared responsibility", trigger:"promises that do not turn into action", ask:"It means a lot when support becomes something practical. Could we share this task?", practice:"Offer or request one small concrete act of support"},
 spark: {title:"Playful Spark", receive:"laughter, affectionate playfulness, and feeling desired", give:"bringing energy, humor, and spontaneity into connection", safety:"room to be lighthearted without being mocked or misunderstood", trigger:"constant seriousness or humor that feels unkind", ask:"I miss our playful side. Could we do something fun together, just because?", practice:"Create one playful moment, inside joke, or unexpected invitation"},
 gifts: {title:"Meaningful Gestures", receive:"thoughtful tokens that show someone remembered what matters to you", give:"remembering details and choosing meaningful surprises", safety:"evidence that your preferences and milestones are noticed", trigger:"important moments passing without acknowledgment", ask:"Small thoughtful gestures help me feel remembered. Can I tell you one that matters to me?", practice:"Write a note or choose a no-cost gesture tied to a shared memory"},
 warmth: {title:"Physical Warmth", receive:"welcome, consensual closeness and comforting touch", give:"gentle physical affection when it is wanted", safety:"respect for your boundaries alongside welcome affection", trigger:"distance without explanation or touch that ignores consent", ask:"Would a hug feel good right now, or would you prefer some space?", practice:"Ask what kind of closeness feels comfortable today"},
 reassurance: {title:"Steady Reassurance", receive:"clear appreciation, emotional steadiness, and repair after tension", give:"checking in, encouraging, and reminding someone they matter", safety:"consistent words and actions that make the relationship feel dependable", trigger:"silence after conflict or uncertainty about where you stand", ask:"A little reassurance helps me settle. Could you tell me how we're doing?", practice:"Name one thing you appreciate and invite a gentle check-in"},
 growth: {title:"Shared Growth", receive:"being encouraged to become more fully yourself", give:"celebrating progress and supporting another person's goals", safety:"freedom to evolve without being compared or controlled", trigger:"feeling judged, held back, or unsupported in what matters", ask:"I'd love to share something I'm working toward. Would you listen and cheer me on?", practice:"Celebrate one small step toward a meaningful personal goal"},
} as const;
export type LoveKey = keyof typeof dimensions;
export const questionOptions: readonly (readonly [{key:LoveKey;text:string},{key:LoveKey;text:string}])[] = [
  [{key:"actions",text:"Takes care of me when I'm sick"},{key:"time",text:"Spends one-on-one time with me"}], 
  [{key:"spark",text:"Playfully roasts me as part of our banter"},{key:"warmth",text:"Holds my hand when we're out"}], 
  [{key:"communication",text:"Has a deep conversation with me"},{key:"gifts",text:"Gets me something I've been wanting"}], 
  [{key:"actions",text:"Cooks me a meal"},{key:"warmth",text:"Hugs me when I'm stressed"}], 
  [{key:"reassurance",text:"Offers support when I'm feeling down"},{key:"warmth",text:"Cuddles with me on the couch"}], 
  [{key:"spark",text:"Cracks me up with funny stories"},{key:"time",text:"Engages in my hobbies and interests"}], 
  [{key:"communication",text:"Encourages me to share my feelings"},{key:"growth",text:"Encourages my personal growth"}], 
  [{key:"gifts",text:"Surprises me with my favorite treat"},{key:"growth",text:"Helps me face my fears"}], 
  [{key:"time",text:"Plans and takes me out for dates."},{key:"communication",text:"Validates my feelings through conversation"}], 
  [{key:"gifts",text:"Remembers important dates and surprises me"},{key:"actions",text:"Runs errands for me"}], 
  [{key:"communication",text:"Lets me vent without giving advice"},{key:"reassurance",text:"Compliments me"}], 
  [{key:"reassurance",text:"Values my intelligence"},{key:"time",text:"Takes a weekend trip with me"}], 
  [{key:"reassurance",text:"Supports me during stressful times"},{key:"actions",text:"Pampers me when I'm sick"}], 
  [{key:"communication",text:"Leaves me sweet notes"},{key:"spark",text:"Expresses their desire for me"}], 
  [{key:"time",text:"Shares a sunset with me"},{key:"communication",text:"Listens to my dreams and aspirations"}], 
  [{key:"warmth",text:"Holds my hand in public"},{key:"growth",text:"Helps me learn from my mistakes"}], 
  [{key:"reassurance",text:"Apologizes when they're wrong"},{key:"communication",text:"Writes me a heartfelt letter"}], 
  [{key:"growth",text:"Celebrates my accomplishments with me"},{key:"communication",text:"Tells me how much I mean to them"}], 
  [{key:"actions",text:"Goes out of their way to make my life easier"},{key:"time",text:"Enjoys a long walk with me"}], 
  [{key:"reassurance",text:"Understands my need for space"},{key:"warmth",text:"Kisses me out of the blue"}], 
  [{key:"growth",text:"Joins me in a thoughtful debate"},{key:"gifts",text:"Buys me small gifts 'just because'"}], 
  [{key:"actions",text:"Does the laundry without me asking"},{key:"reassurance",text:"Validates my feelings without judgment"}], 
  [{key:"spark",text:"Makes me laugh"},{key:"warmth",text:"Gives me a foot massage"}], 
  [{key:"gifts",text:"Surprises me with tickets to my favorite band's concert"},{key:"growth",text:"Helps me achieve my goals"}], 
];
export type PersonalReport = ReturnType<typeof buildPersonalReport>;
export function buildPersonalReport(choices:string, name:string) {
 if (!/^[01]{24}$/.test(choices)) throw new Error("Invalid quiz choices");
 const counts=Object.fromEntries(Object.keys(dimensions).map(k=>[k,0])) as Record<LoveKey,number>;
 const opportunities=Object.fromEntries(Object.keys(dimensions).map(k=>[k,0])) as Record<LoveKey,number>;
 const selections=Array.from(choices,(bit,i)=>{
  const pair=questionOptions[i]; pair.forEach(p=>opportunities[p.key]++);
  const chosen=pair[Number(bit)]; counts[chosen.key]++;
  return {question:i+1,choice:chosen.text,key:chosen.key,alternative:pair[1-Number(bit)].text};
 });
 const ranking=(Object.keys(dimensions) as LoveKey[]).map(key=>({key,title:dimensions[key].title,selected:counts[key],opportunities:opportunities[key],ratio:opportunities[key]?counts[key]/opportunities[key]:0})).sort((a,b)=>b.ratio-a.ratio||b.selected-a.selected||a.key.localeCompare(b.key));
 const primary=ranking[0].key, secondary=ranking[1].key;
 const p=dimensions[primary],q=dimensions[secondary];
 const preferred=selections.filter(x=>x.key===primary).slice(0,3);
 const personalExamples=preferred.map(x=>`In reflection ${x.question}, you leaned toward “${x.choice}” rather than “${x.alternative}”. That suggests this kind of moment may resonate with you.`);
 const insights=[`Your strongest pattern is ${p.title.toLowerCase()}, closely accompanied by ${q.title.toLowerCase()}. Together they suggest that ${p.receive} and ${q.receive} may help you feel especially connected.`,...personalExamples,`You may naturally offer care through ${p.give}; you may also express it by ${q.give}. Giving and receiving do not always look the same, so treat these as starting points for reflection rather than assumptions.`, `Emotional safety may grow when you experience ${p.safety}, alongside ${q.safety}.`, `Potential disconnection may show up when you encounter ${p.trigger}; ${q.trigger} could also feel difficult. These are possibilities, not predictions about you or your partner.`, `When distance appears, begin with curiosity: name the moment, describe how it landed, and invite the other person's perspective before making a request.`];
 const scripts=[p.ask,q.ask,"When that happened, I felt a little distant. Could I share what I needed, and hear how it felt for you?","I care about us. Could we take a short pause and come back when we can both listen?","What helps you feel most understood when we're not seeing things the same way?"];
 const themes=["Notice your needs","Recognize patterns","Practice gentle communication","Build lasting rituals"];
 const exercises=["Write down a moment you felt genuinely cared for.",`Reflect on why ${p.title.toLowerCase()} matters to you.`,"Notice how you respond when someone offers help.",`Try this: ${p.practice}.`,"Write a sentence that starts with: I feel connected when…","Notice a small act of care you might otherwise overlook.","Rest and reflect: what surprised you this week?","Identify a moment you withdrew or felt misunderstood.",`Consider whether ${p.trigger} has ever affected your sense of closeness.`,"Name one feeling without criticizing yourself for it.",`Try this: ${q.practice}.`,"Ask someone what helps them feel supported.","Practice asking for a pause before a difficult conversation.","Write about one thing you want to understand more gently.",`Say aloud: ${p.ask}`,"Practice listening for two minutes without preparing your reply.","Use an I-statement about one small need.",`Say aloud: ${q.ask}`,"Offer a genuine appreciation without expecting a response.","If safe and appropriate, revisit a small misunderstanding with kindness.","Reflect on what changed when you slowed down.","Choose a small weekly connection ritual.","Invite the other person to shape that ritual with you.","Make a list of three signs that you feel emotionally safe.","Choose one boundary you would like to communicate warmly.","Celebrate one way you have grown in understanding.","Plan a low-pressure moment of connection for next week.","Write a note to your future self about the kind of love you want to practice."];
 const plan=exercises.map((action,i)=>({day:i+1,week:Math.floor(i/7)+1,theme:themes[Math.floor(i/7)],title:["Notice","Reflect","Connect","Practice","Express","Appreciate","Integrate"][i%7],action}));
 const safeName=name.trim().slice(0,80)||"friend";
 return {name:safeName,primary,secondary,ranking,selections,insights,scripts,plan,createdAt:new Date().toISOString()};
}
