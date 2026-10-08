"use client";

import { useEffect, useState, type ReactNode } from "react";

type ResultKey = "communication" | "time" | "actions" | "spark" | "gifts" | "warmth" | "reassurance" | "growth";
type JourneyStage = "home" | "intro" | "questions" | "analyzing" | "offer";

const loveImages = {
  conversation: "https://images.unsplash.com/photo-1746813629190-80f67d5050fa?auto=format&fit=crop&w=1600&q=90",
  presence: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=1600&q=90",
  support: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1600&q=90",
  playful: "https://images.unsplash.com/photo-1746813629190-80f67d5050fa?auto=format&fit=crop&w=1600&q=90",
  tenderness: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1600&q=90",
  storyIntimate: "https://images.unsplash.com/photo-1758524941302-66f363778b38?auto=format&fit=crop&w=1600&q=90",
  together: "https://images.unsplash.com/photo-1746813629190-80f67d5050fa?auto=format&fit=crop&w=1600&q=90",
  thoughtful: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1600&q=90",
  growth: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=1600&q=90",
};

type IconName =
  | "message"
  | "clock"
  | "spark"
  | "hand"
  | "gift"
  | "heart"
  | "shield"
  | "growth";

const expressions: Array<{
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  icon: IconName;
}> = [
  {
    title: "Nurturing Communication",
    eyebrow: "Words that create safety",
    description:
      "You feel closest through thoughtful conversations, genuine compliments and the kind of listening that makes you feel fully understood.",
    image: loveImages.conversation,
    icon: "message",
  },
  {
    title: "Meaningful Time",
    eyebrow: "Presence over everything",
    description:
      "Undivided attention matters most to you. Shared experiences and small rituals turn ordinary moments into lasting connection.",
    image: loveImages.presence,
    icon: "clock",
  },
  {
    title: "Thoughtful Actions",
    eyebrow: "Care you can feel",
    description:
      "For you, love becomes real through considerate gestures, dependable support and the little things someone does without being asked.",
    image: loveImages.support,
    icon: "hand",
  },
  {
    title: "Emotional Spark",
    eyebrow: "Energy that draws you in",
    description:
      "Playfulness, anticipation and emotional chemistry make you feel alive. Love grows when a relationship keeps its sense of wonder.",
    image: loveImages.playful,
    icon: "spark",
  },
  {
    title: "Symbolic Giving",
    eyebrow: "Meaning in every detail",
    description:
      "The value is never the price. You treasure gestures that say: I noticed you, remembered you and chose this especially for you.",
    image: loveImages.thoughtful,
    icon: "gift",
  },
  {
    title: "Physical Warmth",
    eyebrow: "Closeness without words",
    description:
      "A warm embrace, a hand held at the right moment and comfortable closeness help you feel grounded, wanted and secure.",
    image: loveImages.tenderness,
    icon: "heart",
  },
  {
    title: "Steady Reassurance",
    eyebrow: "Consistency creates trust",
    description:
      "Love means knowing someone is truly there. Reliability, honesty and emotional steadiness allow your deepest feelings to unfold.",
    image: loveImages.presence,
    icon: "shield",
  },
  {
    title: "Shared Growth",
    eyebrow: "Becoming better together",
    description:
      "You connect through encouragement and shared direction. The strongest bond is one that helps both people become more fully themselves.",
    image: loveImages.growth,
    icon: "growth",
  },
];

const insightItems = [
  {
    title: "Go beyond traditional love languages",
    text: "Most quizzes stop at five broad labels. understandmylove explores emotional safety, communication, intimacy, reassurance and the patterns that quietly shape your relationships.",
  },
  {
    title: "Understand what you truly need",
    text: "Learn what helps you feel seen, what can make you withdraw and how to communicate your needs without guilt or confusion.",
  },
  {
    title: "Turn insight into real change",
    text: "Your personal report includes clear observations and practical suggestions you can use with a partner, friends and yourself.",
  },
  {
    title: "Receive your personal understandmylove",
    text: "See your strongest expressions, hidden patterns, relationship strengths and tailored guidance in one beautifully designed report.",
  },
];

const faqs = [
  {
    question: "What is a understandmylove?",
    answer:
      "Your understandmylove is a personalized profile of how you naturally express, receive and interpret affection. It highlights your strongest needs, connection patterns and practical ways to build healthier relationships.",
  },
  {
    question: "How long does the test take?",
    answer:
      "Most people complete the test in about four minutes. There are no right or wrong answers choose what feels most natural to you.",
  },
  {
    question: "Is this only for people in a relationship?",
    answer:
      "Not at all. The test is equally useful when you are single, dating or in a long-term relationship because it focuses on your own emotional patterns.",
  },
  {
    question: "Can my partner take the test too?",
    answer:
      "Yes. Comparing two profiles can reveal where you naturally connect and where clearer communication could make the relationship stronger.",
  },
  {
    question: "Is understandmylove a psychological diagnosis?",
    answer:
      "No. understandmylove is an educational self-reflection tool and does not replace advice, diagnosis or treatment from a qualified professional.",
  },
];

const quizQuestions: Array<{ prompt: string; options: [{ label: string; value: ResultKey }, { label: string; value: ResultKey }] }> = [
  { prompt: "I feel most loved when my partner", options: [{ label: "Takes care of me when I'm sick", value: "actions" }, { label: "Spends one-on-one time with me", value: "time" }] },
  { prompt: "I feel most loved when my partner", options: [{ label: "Playfully roasts me as part of our banter", value: "spark" }, { label: "Holds my hand when we're out", value: "warmth" }] },
  { prompt: "I feel most loved when my partner", options: [{ label: "Has a deep conversation with me", value: "communication" }, { label: "Gets me something I've been wanting", value: "gifts" }] },
  { prompt: "I feel most loved when my partner", options: [{ label: "Cooks me a meal", value: "actions" }, { label: "Hugs me when I'm stressed", value: "warmth" }] },
  { prompt: "I feel most loved when my partner", options: [{ label: "Offers support when I'm feeling down", value: "reassurance" }, { label: "Cuddles with me on the couch", value: "warmth" }] },
  { prompt: "I feel most loved when my partner", options: [{ label: "Cracks me up with funny stories", value: "spark" }, { label: "Engages in my hobbies and interests", value: "time" }] },
  { prompt: "I feel most loved when my partner", options: [{ label: "Encourages me to share my feelings", value: "communication" }, { label: "Encourages my personal growth", value: "growth" }] },
  { prompt: "I feel most loved when my partner", options: [{ label: "Surprises me with my favorite treat", value: "gifts" }, { label: "Helps me face my fears", value: "growth" }] },
  { prompt: "I feel most loved when my partner", options: [{ label: "Plans and takes me out for dates.", value: "time" }, { label: "Validates my feelings through conversation", value: "communication" }] },
  { prompt: "I feel most loved when my partner", options: [{ label: "Remembers important dates and surprises me", value: "gifts" }, { label: "Runs errands for me", value: "actions" }] },
  { prompt: "I feel most loved when my partner", options: [{ label: "Lets me vent without giving advice", value: "communication" }, { label: "Compliments me", value: "reassurance" }] },
  { prompt: "I feel most loved when my partner", options: [{ label: "Values my intelligence", value: "reassurance" }, { label: "Takes a weekend trip with me", value: "time" }] },
  { prompt: "I feel most loved when my partner", options: [{ label: "Supports me during stressful times", value: "reassurance" }, { label: "Pampers me when I'm sick", value: "actions" }] },
  { prompt: "I feel most loved when my partner", options: [{ label: "Leaves me sweet notes", value: "communication" }, { label: "Expresses their desire for me", value: "spark" }] },
  { prompt: "I feel most loved when my partner", options: [{ label: "Shares a sunset with me", value: "time" }, { label: "Listens to my dreams and aspirations", value: "communication" }] },
  { prompt: "I feel most loved when my partner", options: [{ label: "Holds my hand in public", value: "warmth" }, { label: "Helps me learn from my mistakes", value: "growth" }] },
  { prompt: "I feel most loved when my partner", options: [{ label: "Apologizes when they're wrong", value: "reassurance" }, { label: "Writes me a heartfelt letter", value: "communication" }] },
  { prompt: "I feel most loved when my partner", options: [{ label: "Celebrates my accomplishments with me", value: "growth" }, { label: "Tells me how much I mean to them", value: "communication" }] },
  { prompt: "I feel most loved when my partner", options: [{ label: "Goes out of their way to make my life easier", value: "actions" }, { label: "Enjoys a long walk with me", value: "time" }] },
  { prompt: "I feel most loved when my partner", options: [{ label: "Understands my need for space", value: "reassurance" }, { label: "Kisses me out of the blue", value: "warmth" }] },
  { prompt: "I feel most loved when my partner", options: [{ label: "Joins me in a thoughtful debate", value: "growth" }, { label: "Buys me small gifts 'just because'", value: "gifts" }] },
  { prompt: "I feel most loved when my partner", options: [{ label: "Does the laundry without me asking", value: "actions" }, { label: "Validates my feelings without judgment", value: "reassurance" }] },
  { prompt: "I feel most loved when my partner", options: [{ label: "Makes me laugh", value: "spark" }, { label: "Gives me a foot massage", value: "warmth" }] },
  { prompt: "I feel most loved when my partner", options: [{ label: "Surprises me with tickets to my favorite band's concert", value: "gifts" }, { label: "Helps me achieve my goals", value: "growth" }] },
];

const resultProfiles: Record<ResultKey, { title: string; text: string; icon: IconName; soft: string }> = {
  communication: {
    title: "Nurturing Communication",
    text: "You tend to feel closest when emotions can be expressed honestly and received with real attention.",
    icon: "message", soft: "#dcefe8",
  },
  time: {
    title: "Meaningful Time",
    text: "Presence matters deeply to you. Unhurried moments often say more than the biggest gestures.",
    icon: "clock", soft: "#f7eadb",
  },
  actions: {
    title: "Thoughtful Actions",
    text: "You notice care in the details—especially when someone understands what you need without making it feel transactional.",
    icon: "hand", soft: "#f6ded8",
  },
  spark: {
    title: "Emotional Spark",
    text: "Playfulness and shared energy help you feel alive, wanted and emotionally close.",
    icon: "spark", soft: "#f6e4c8",
  },
  gifts: {
    title: "Symbolic Giving",
    text: "You feel seen through meaningful details that quietly say: I remembered you and chose this with care.",
    icon: "gift", soft: "#f2dfdf",
  },
  warmth: {
    title: "Physical Warmth",
    text: "Affectionate touch helps your nervous system soften and turns closeness into something you can truly feel.",
    icon: "heart", soft: "#f9ddd6",
  },
  reassurance: {
    title: "Steady Reassurance",
    text: "Consistency helps your heart relax. You connect most deeply when care feels clear, dependable and emotionally safe.",
    icon: "shield", soft: "#dcebe5",
  },
  growth: {
    title: "Shared Growth",
    text: "Love feels strongest when it supports who you are becoming and gives both people room to flourish.",
    icon: "growth", soft: "#e4efda",
  },
};

function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <div className={`lr-brand ${light ? "lr-brand--light" : ""}`}>
      <span className="lr-brand__mark" aria-hidden="true">
        <svg viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" fill="currentColor" opacity=".1" />
          <path
            d="M24 34.3 13.8 24.2c-5.7-5.7 2.7-14.1 8.4-8.4l1.8 1.8 1.8-1.8c5.7-5.7 14.1 2.7 8.4 8.4L24 34.3Z"
            fill="currentColor"
          />
          <path d="M24 7v5M41 24h-5M12 24H7M36 12l-3.5 3.5M15.5 15.5 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      <span className="lr-brand__word">Understand<span>Mylove</span></span>
    </div>
  );
}

function MiniIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    message: <path d="M4 5.5h16v11H9l-5 4v-15Zm4 4h8M8 13h5" />,
    clock: <><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" /></>,
    spark: <path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Zm7 14 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" />,
    hand: <path d="M7 11V7a1.5 1.5 0 0 1 3 0v3-5a1.5 1.5 0 0 1 3 0v5-4a1.5 1.5 0 0 1 3 0v5-2a1.5 1.5 0 0 1 3 0v5c0 5-3 8-7 8-3 0-5-1.5-7-4l-2-3a1.7 1.7 0 0 1 2.7-2Z" />,
    gift: <><path d="M4 10h16v11H4zM2.5 6.5h19V10h-19zM12 6.5V21" /><path d="M12 6.5c-2.5 0-5-.8-5-2.6C7 2.6 8 2 9.1 2 11 2 12 4.4 12 6.5Zm0 0c2.5 0 5-.8 5-2.6C17 2.6 16 2 14.9 2 13 2 12 4.4 12 6.5Z" /></>,
    heart: <path d="M20.8 5.8c-2-2.3-5.7-1.8-7.4.8L12 8.8l-1.4-2.2C8.9 4 5.2 3.5 3.2 5.8 1 8.4 2 12 4.2 14.2L12 21l7.8-6.8C22 12 23 8.4 20.8 5.8Z" />,
    shield: <path d="M12 2 20 5v6c0 5-3.4 9-8 11-4.6-2-8-6-8-11V5l8-3Z" />,
    growth: <><path d="M12 21v-8M12 16c-5 0-7-3-7-7 5 0 7 3 7 7Zm0-3c0-5 3-8 8-8 0 5-3 8-8 8Z" /></>,
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function Arrow({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <svg className={direction === "left" ? "lr-flip" : ""} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M5 12h14M14 6l6 6-6 6" />
    </svg>
  );
}

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [openInsight, setOpenInsight] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [journeyStage, setJourneyStage] = useState<JourneyStage>("home");
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<ResultKey[]>([]);
  const [quizResultKey, setQuizResultKey] = useState<ResultKey>("communication");
  const [secondaryResultKey, setSecondaryResultKey] = useState<ResultKey>("time");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");


  const visibleExpressions = [0, 1, 2].map(
    (offset) => expressions[(slide + offset) % expressions.length],
  );

  const nextSlide = () => setSlide((current) => (current + 1) % expressions.length);
  const previousSlide = () =>
    setSlide((current) => (current - 1 + expressions.length) % expressions.length);

  const openQuiz = () => {
    setQuizAnswers([]);
    setQuizStep(0);
    setJourneyStage("intro");
  };

  const answerQuizQuestion = (value: ResultKey) => {
    const nextAnswers = [...quizAnswers, value];
    setQuizAnswers(nextAnswers);

    // Clear the browser's touch/focus state immediately. Mobile Safari/Chrome
    // can otherwise keep the tapped answer visually active while the next
    // question is being rendered.
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    if (quizStep === quizQuestions.length - 1) {
      const keys = Object.keys(resultProfiles) as ResultKey[];
      const opportunities = Object.fromEntries(keys.map((key) => [key, 0])) as Record<ResultKey, number>;
      quizQuestions.forEach((question) => question.options.forEach((option) => { opportunities[option.value] += 1; }));
      const wins = Object.fromEntries(keys.map((key) => [key, 0])) as Record<ResultKey, number>;
      nextAnswers.forEach((answer) => { wins[answer] += 1; });
      const ranked = keys.sort((a, b) => {
        const aRate = (wins[a] + 1) / (opportunities[a] + 2);
        const bRate = (wins[b] + 1) / (opportunities[b] + 2);
        return bRate - aRate || wins[b] - wins[a];
      });
      setQuizResultKey(ranked[0] || "communication");
      setSecondaryResultKey(ranked[1] || "time");
      setJourneyStage("analyzing");
    } else {
      window.setTimeout(() => {
        // Make sure no old touch/focus state survives the question change.
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        setQuizStep((current) => current + 1);
      }, 120);
    }
  };

  const result = resultProfiles[quizResultKey];
  const secondaryResult = resultProfiles[secondaryResultKey];
  const progress = ((quizStep + 1) / quizQuestions.length) * 100;

  useEffect(() => {
    if (journeyStage !== "analyzing") return;
    const timer = window.setTimeout(() => setJourneyStage("offer"), 2600);
    return () => window.clearTimeout(timer);
  }, [journeyStage]);

  useEffect(() => {
    if (journeyStage === "home") return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [journeyStage]);

  const trustpilotUrl = process.env.NEXT_PUBLIC_TRUSTPILOT_URL;

  const goBackInQuiz = () => {
    if (quizStep === 0) {
      setJourneyStage("intro");
      return;
    }
    setQuizAnswers((current) => current.slice(0, -1));
    setQuizStep((current) => current - 1);
  };

  const closeJourney = () => setJourneyStage("home");

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setCheckoutError("");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offer: "lover-reveal-trial",
          primaryResult: quizResultKey,
          checkoutAttemptId: crypto.randomUUID(),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error(data.error || "Checkout is temporarily unavailable.");
      window.location.assign(data.url);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Checkout is temporarily unavailable.");
      setCheckoutLoading(false);
    }
  };

  return (
    <main className="lr-page">
      <header className="lr-nav">
        <div className="lr-shell lr-nav__inner">
          <a href="#top" aria-label="understandmylove home">
            <BrandMark />
          </a>
          <nav className="lr-nav__links" aria-label="Main navigation">
            <a href="#how-it-works">How it works</a>
            <a href="#expressions">What you’ll discover</a>
            <a href="#faq">FAQ</a>
          </nav>
          <button className="lr-button lr-button--small lr-button--primary" onClick={openQuiz}>
            Take The Test
          </button>
        </div>
      </header>

      <section className="lr-hero" id="top">
        <div className="lr-hero__glow lr-hero__glow--one" />
        <div className="lr-hero__glow lr-hero__glow--two" />
        <div className="lr-shell lr-hero__grid">
          <div className="lr-hero__copy">
            <div className="lr-pill">
              <span>♥</span>
              A gentle 4-minute reflection
            </div>
            <h1>
              Understand the way your <em>heart connects.</em>
            </h1>
            <p className="lr-hero__lead">
              You are not difficult to love. You may simply experience closeness differently. Discover what helps you feel safe, seen and genuinely connected.
            </p>
            <div className="lr-hero__actions">
              <button className="lr-button lr-button--primary lr-button--hero" onClick={openQuiz}>
                Take The Test
                <Arrow />
              </button>
              <span className="lr-hero__note">
                <strong>About four minutes</strong>
                No signup to begin
              </span>
            </div>
            <div className="lr-proof">
              <div className="lr-avatars" aria-hidden="true">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" alt="" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="" />
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="" />
                <span>♡</span>
              </div>
              <div>
                <strong>Made for singles and couples</strong>
                <p>Honest reflection without judgement</p>
              </div>
            </div>
          </div>

          <div className="lr-hero__visual" aria-label="A couple sharing a warm and emotionally safe moment">
            <div className="lr-hero-photo">
              <img
                src={loveImages.conversation}
                alt="A loving couple smiling closely together"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </div>
            <div className="lr-benefit-card lr-benefit-card--top">
              <span className="lr-benefit-card__icon"><MiniIcon name="growth" /></span>
              <span><strong>Feel more understood</strong><small>Put quiet needs into words</small></span>
            </div>
            <div className="lr-benefit-card lr-benefit-card--left">
              <span className="lr-benefit-card__icon lr-benefit-card__icon--rose"><MiniIcon name="heart" /></span>
              <span><strong>Love more clearly</strong><small>Without changing who you are</small></span>
            </div>
            <div className="lr-benefit-card lr-benefit-card--result">
              <span className="lr-benefit-card__icon lr-benefit-card__icon--rose">♥</span>
              <span><small>One of your strongest needs</small><strong>Emotional presence</strong></span>
            </div>
            <span className="lr-hero-photo__spark" aria-hidden="true">✦</span>
            <span className="lr-hero-photo__heart" aria-hidden="true">♡</span>
          </div>
        </div>
      </section>

      <section className="lr-stats" aria-label="understandmylove statistics">
        <div className="lr-shell lr-stats__grid">
          <div><strong>8</strong><span>nuanced ways of connecting</span></div>
          <div><strong>4 min</strong><span>calm, intuitive questions</span></div>
          <div><strong>Personal</strong><span>insights shaped around you</span></div>
          <div><strong>Gentle</strong><span>no labels and no judgement</span></div>
        </div>
      </section>

      <section className="lr-intro lr-section" id="how-it-works">
        <div className="lr-shell">
          <div className="lr-section-heading lr-section-heading--center">
            <span className="lr-kicker">You make sense when you understand the pattern</span>
            <h2>You are not “too much.”<br /><em>You may just love differently.</em></h2>
            <p>Understandmylove helps you notice the quiet ways you seek closeness, offer affection and protect your heart then gives you language that feels human, useful and true to you.</p>
          </div>

          <div className="lr-steps">
            <div className="lr-step"><span>01</span><div><strong>Pause and answer honestly</strong><p>Choose what feels natural not what you think you should choose.</p></div></div>
            <div className="lr-step"><span>02</span><div><strong>See your pattern clearly</strong><p>Notice how you give love, seek closeness and respond when you feel unsure.</p></div></div>
            <div className="lr-step"><span>03</span><div><strong>Bring it into real life</strong><p>Use simple language and gentle guidance in the relationships that matter.</p></div></div>
          </div>

          <div className="lr-story-grid">
            <div className="lr-story-card lr-story-card--large">
              <img src={loveImages.conversation} alt="A couple laughing together after an open, caring conversation" />
              <span className="lr-image-chip">Real closeness starts with feeling understood</span>
            </div>
            <div className="lr-story-side">
              <div className="lr-story-card lr-story-card--image">
                <img src={loveImages.storyIntimate} alt="A loving couple sharing a warm and playful moment at home" loading="lazy" decoding="async" />
              </div>
              <div className="lr-story-quote">
                <span className="lr-quote-mark">“</span>
                <p>Sometimes the biggest shift is finally finding words for something you have felt for years.</p>
                <span>A small insight can change a whole conversation.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lr-expressions lr-section" id="expressions">
        <div className="lr-shell">
          <div className="lr-section-heading lr-section-heading--split">
            <div>
              <span className="lr-kicker">The 8 expressions of love</span>
              <h2>There is more than one<br /><em>way to feel loved.</em></h2>
            </div>
            <p>You are never only one type. Your personal blend shows what draws you closer and what can quietly make you feel unseen.</p>
          </div>

          <div className="lr-carousel">
            <button className="lr-carousel__button lr-carousel__button--left" onClick={previousSlide} aria-label="Previous expressions"><Arrow direction="left" /></button>
            <div className="lr-card-grid">
              {visibleExpressions.map((item, index) => (
                <article className="lr-expression-card" key={`${item.title}-${slide}-${index}`}>
                  <div className="lr-expression-card__image">
                    <img src={item.image} alt={item.title} />
                    <span className="lr-expression-card__number">0{((slide + index) % expressions.length) + 1}</span>
                  </div>
                  <div className="lr-expression-card__body">
                    <div className="lr-expression-card__eyebrow"><span><MiniIcon name={item.icon} /></span>{item.eyebrow}</div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <button onClick={openQuiz}>Take The Test <Arrow /></button>
                  </div>
                </article>
              ))}
            </div>
            <button className="lr-carousel__button lr-carousel__button--right" onClick={nextSlide} aria-label="Next expressions"><Arrow /></button>
          </div>
          <div className="lr-carousel__footer">
            <div className="lr-dots">
              {expressions.map((item, index) => <button key={item.title} aria-label={`Go to ${item.title}`} className={slide === index ? "active" : ""} onClick={() => setSlide(index)} />)}
            </div>
            <span>{String(slide + 1).padStart(2, "0")} / 08</span>
          </div>
        </div>
      </section>

      <section className="lr-mid-cta">
        <div className="lr-shell">
          <div className="lr-mid-cta__card">
            <div>
              <span className="lr-kicker">Your pattern is waiting</span>
              <h2>Give your feelings<br /><em>the words they deserve.</em></h2>
            </div>
            <div className="lr-mid-cta__action">
              <p>You do not need another generic label. You need a clearer, kinder picture of what connection feels like to you.</p>
              <button className="lr-button lr-button--primary" onClick={openQuiz}>Take The Test <Arrow /></button>
              <small>Four gentle minutes · No right or wrong answers</small>
            </div>
          </div>
        </div>
      </section>

      <section className="lr-insights lr-section">
        <div className="lr-shell lr-insights__grid">
          <div className="lr-insights__image">
            <img src={loveImages.presence} alt="A couple giving each other calm, undivided attention" />
            <div className="lr-image-stat"><strong>8</strong><span>dimensions that together form your personal connection pattern</span></div>
          </div>
          <div className="lr-insights__content">
            <span className="lr-kicker">Beyond the basics</span>
            <h2>Understand the patterns<br /><em>behind your connection.</em></h2>
            <div className="lr-accordion">
              {insightItems.map((item, index) => {
                const isOpen = openInsight === index;
                return (
                  <div className={`lr-accordion__item ${isOpen ? "open" : ""}`} key={item.title}>
                    <button onClick={() => setOpenInsight(index)} aria-expanded={isOpen}>
                      <span className="lr-accordion__count">0{index + 1}</span>
                      <strong>{item.title}</strong>
                      <span className="lr-plus">{isOpen ? "−" : "+"}</span>
                    </button>
                    <div className="lr-accordion__answer"><p>{item.text}</p></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="lr-testimonials lr-section">
        <div className="lr-shell">
          <div className="lr-section-heading lr-section-heading--center">
            <span className="lr-kicker">What clarity can sound like</span>
            <h2>Gentler conversations.<br /><em>More honest connection.</em></h2>
          </div>
          <div className="lr-testimonial-grid">
            <article><span className="lr-clarity-number">01</span><p>“I am not asking for too much. Consistency is simply one of the ways I feel safe and cared for.”</p><div className="lr-clarity-label"><strong>Understand yourself</strong><small>without judging your needs</small></div></article>
            <article className="featured"><span className="lr-clarity-number">02</span><p>“We are not incompatible. We sometimes recognise love in different moments and different gestures.”</p><div className="lr-clarity-label"><strong>Understand each other</strong><small>without deciding who is wrong</small></div></article>
            <article><span className="lr-clarity-number">03</span><p>“I can explain what helps me feel close instead of hoping someone will somehow guess it.”</p><div className="lr-clarity-label"><strong>Communicate with warmth</strong><small>without hiding what matters</small></div></article>
          </div>
        </div>
      </section>

      <section className="lr-faq lr-section" id="faq">
        <div className="lr-shell lr-faq__grid">
          <div className="lr-faq__intro">
            <span className="lr-kicker">Questions, answered</span>
            <h2>Frequently asked<br /><em>questions.</em></h2>
            <p>Still wondering how it works? Here are the things people ask us most often.</p>
            <button className="lr-button lr-button--outline" onClick={openQuiz}>Take The Test <Arrow /></button>
          </div>
          <div className="lr-faq__list">
            {faqs.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div className={`lr-faq__item ${isOpen ? "open" : ""}`} key={item.question}>
                  <button onClick={() => setOpenFaq(isOpen ? null : index)} aria-expanded={isOpen}>
                    <span>{item.question}</span><i>{isOpen ? "−" : "+"}</i>
                  </button>
                  <div><p>{item.answer}</p></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="lr-final-cta">
        <div className="lr-final-cta__orb lr-final-cta__orb--one" />
        <div className="lr-final-cta__orb lr-final-cta__orb--two" />
        <div className="lr-shell lr-final-cta__inner">
          <span className="lr-final-cta__heart">♥</span>
          <span className="lr-kicker">Meet yourself with more kindness</span>
          <h2>You deserve to feel understood<br />by others and <em>by yourself.</em></h2>
          <p>Take a quiet four-minute pause and discover the unique way you express, receive and understand love.</p>
          <button className="lr-button lr-button--light lr-button--hero" onClick={openQuiz}>Take The Test <Arrow /></button>
          <div className="lr-final-cta__proof">Private · Personal · No right or wrong answers</div>
        </div>
      </section>

      <footer className="lr-footer">
        <div className="lr-shell">
          <div className="lr-footer__top">
            <div className="lr-footer__brand"><BrandMark light /><p>Know yourself. Love with clarity.<br />Connect more deeply.</p><div className="lr-footer__socials"><a href="#" aria-label="Instagram">ig</a><a href="#" aria-label="TikTok">tt</a><a href="#" aria-label="Pinterest">p</a></div></div>
            <div className="lr-footer__links"><strong>Explore</strong><a href="#expressions">Love expressions</a><a href="#how-it-works">How it works</a><a href="#faq">FAQ</a><button onClick={openQuiz}>Take The Test</button></div>
            <div className="lr-footer__links"><strong>Support</strong><a href="/help">Help center</a><a href="/contact">Contact us</a><a href="/cancel">Cancel subscription</a><a href="/accessibility">Accessibility</a></div>
            <div className="lr-footer__links"><strong>Legal</strong><a href="/terms">Terms of service</a><a href="/privacy">Privacy policy</a><a href="/cookie">Cookie policy</a><a href="/refund">Refund policy</a></div>
          </div>
          <div className="lr-footer__bottom"><span>© 2026 understandmylove. All rights reserved.</span><span>Educational self-reflection tool · Not medical advice</span><button>English⌄</button></div>
        </div>
      </footer>

      <button className="lr-mobile-cta" onClick={openQuiz}>
        <span><strong>Take The Test</strong><small>4 minutes · no signup</small></span>
        <Arrow />
      </button>

      {journeyStage !== "home" && (
        <div className={`lr-journey lr-journey--${journeyStage}`} role="dialog" aria-modal="true" aria-label="understandmylove test">
          <header className="lr-journey__header">
            <BrandMark />
            <button className="lr-journey__close" onClick={closeJourney} aria-label="Close understandmylove">×</button>
          </header>

          {journeyStage === "intro" && (
            <section className="lr-journey-intro">
              <div className="lr-journey-intro__copy">
                <span className="lr-pill"><span>♥</span>A quiet moment for you</span>
                <h2>Your heart has a pattern.<br /><em>Let’s listen to it.</em></h2>
                <p>This is not about putting you in a box. It is a gentle reflection on the moments that make you feel safe, chosen and truly close to someone.</p>
                <div className="lr-journey-intro__checks">
                  <span><i>✓</i><b>Choose what feels true</b><small>Not what you think you should choose.</small></span>
                  <span><i>✓</i><b>There are no wrong answers</b><small>Your first instinct is usually enough.</small></span>
                  <span><i>✓</i><b>Your answers stay private</b><small>Created for honest self-reflection.</small></span>
                </div>
                <button className="lr-button lr-button--primary lr-button--hero" onClick={() => setJourneyStage("questions")}>Start Test <Arrow /></button>
                <small className="lr-journey-intro__time">24 gentle choices · About 4 minutes</small>
              </div>
              <div className="lr-journey-intro__visual">
                <img src={loveImages.playful} alt="Two people forming a heart with their hands in the warm evening light" />
                <div className="lr-journey-intro__quote">“Sometimes feeling understood begins with understanding yourself.”</div>
                <div className="lr-journey-intro__badge"><span>♡</span><div><strong>Warm, personal insight</strong><small>made around your answers</small></div></div>
              </div>
            </section>
          )}

          {journeyStage === "questions" && (
            <section className="lr-question-screen">
              <div className="lr-question-progress"><span style={{ width: `${progress}%` }} /></div>
              <div className="lr-question-layout">
                <div className="lr-question-card" key={quizStep}>
                  <div className="lr-question-card__meta"><span>Question {quizStep + 1} of {quizQuestions.length}</span><small>{Math.round(progress)}% complete</small></div>
                  <span className="lr-kicker">Which feels more like love to you?</span>
                  <h2>{quizQuestions[quizStep].prompt}</h2>
                  <div className="lr-question-options">
                    {quizQuestions[quizStep].options.map((option, index) => (
                      <button
                        key={`quiz-${quizStep}-${index}-${option.value}`}
                        type="button"
                        onPointerDown={(event) => {
                          // Prevent mobile browsers from carrying the tapped
                          // button's focus state into the next question.
                          event.currentTarget.blur();
                        }}
                        onClick={(event) => {
                          event.currentTarget.blur();
                          answerQuizQuestion(option.value);
                        }}
                      >
                        <i>{index === 0 ? "A" : "B"}</i><span>{option.label}</span><Arrow />
                      </button>
                    ))}
                  </div>
                  <div className="lr-question-card__bottom">
                    <button onClick={goBackInQuiz} className="lr-question-back"><Arrow direction="left" /> Back</button>
                    <span>Follow the answer your body relaxes into.</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {journeyStage === "analyzing" && (
            <section className="lr-analyzing">
              <div className="lr-analyzing__image"><img src={loveImages.tenderness} alt="A quiet, affectionate moment between two partners" /><span>♥</span></div>
              <span className="lr-kicker">Your answers are coming together</span>
              <h2>Finding the pattern beneath<br /><em>the moments you chose.</em></h2>
              <div className="lr-analyzing__bar"><span /></div>
              <div className="lr-analyzing__steps"><span>✓ Reading your connection signals</span><span>✓ Comparing all eight expressions</span><span className="active">• Creating your personal understandmylove</span></div>
            </section>
          )}

         {journeyStage === "offer" && (
  <div
    className="new-offer"
  >
    <div className="new-offer__shell">
      <div className="new-offer__intro">
        <span className="new-offer__eyebrow">
          ♡ YOUR 24 ANSWERS HAVE BEEN ANALYSED
        </span>

        <h1>
          Your answers reveal{" "}
          <em>something personal.</em>
        </h1>

        <p>
          Your 24 answers are in. Your personalised love report is ready to
          explore.
        </p>
      </div>

      <div className="new-offer__grid">
        <div className="new-offer__story">
          <div className="new-offer__photo">
            <img
              src={loveImages.conversation}
              alt="A couple sharing a genuine affectionate moment"
            />

            <div className="new-offer__photo-label">
              A little more understanding. A lot more connection. ♡
            </div>
          </div>
        </div>

        <div className="new-offer__checkout">
          <span className="new-offer__badge">
            YOUR PERSONAL REPORT
          </span>

          <h2>
            Your personal love report
            <br />
            <em>is ready to open.</em>
          </h2>

          <p className="new-offer__sub">
            Discover what your answers suggest about the way you give,
            receive and experience love.
          </p>

          <div className="new-offer__includes">
            <strong>What you'll discover</strong>

            {[
              "Your primary and secondary love expressions",
              "How you naturally give and receive love",
              "What helps you feel emotionally safe",
              "Your potential disconnect triggers",
              "Guidance for communicating with a partner",
              "A gentle, practical 28-day action plan",
            ].map((item) => (
              <div key={item}>
                <span>✓</span>
                {item}
              </div>
            ))}
          </div>

          <div className="new-offer__price">
            <div>
              <small>
                START YOUR 7-DAY FULL ACCESS
              </small>

              <strong>
                €1,99 <span>today</span>
              </strong>
            </div>

            <span>
              Full personal report
              <br />
              Instant access
            </span>
          </div>

          <div
            style={{
              marginTop: "14px",
              marginBottom: "18px",
              fontSize: "12px",
              lineHeight: 1.6,
              color: "#687a76",
              textAlign: "center",
            }}
          >
            €1,99 today. After 7 days, €29,99/month.
            <br />
            Cancel anytime.
          </div>

          <button
            className="lr-button lr-button--primary new-offer__button"
            onClick={handleCheckout}
            disabled={checkoutLoading}
          >
            {checkoutLoading
              ? "Opening secure checkout…"
              : "See my full report"}
            <Arrow />
          </button>

          {checkoutError && (
            <p
              className="lr-checkout-error"
              role="alert"
            >
              {checkoutError}
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
)}
        </div>
      )}
      <style>{`
        :root{--ink:#214d45;--ink-deep:#173b35;--sage:#5b9588;--mint:#eaf5ef;--mint-2:#f5faf7;--rose:#e76f72;--rose-dark:#d95d62;--blush:#fff0ea;--cream:#fffaf4;--brown:#51312d;--line:rgba(33,77,69,.12);--serif:Georgia,'Times New Roman',serif;--sans:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
        *{box-sizing:border-box}.lr-page{width:100%;overflow-x:clip;background:var(--cream);color:var(--ink-deep);font-family:var(--sans)}.lr-page button,.lr-page a{font:inherit}.lr-page button{cursor:pointer}.lr-page img{display:block;width:100%}.lr-shell{width:min(1200px,calc(100% - 48px));margin:0 auto}.lr-section{padding:132px 0}.lr-nav{position:fixed;z-index:50;top:0;left:0;right:0;height:76px;background:rgba(255,250,244,.92);border-bottom:1px solid rgba(24,63,57,.08);backdrop-filter:blur(18px)}.lr-nav__inner{height:100%;display:flex;align-items:center;justify-content:space-between}.lr-nav a{text-decoration:none;color:inherit}.lr-brand{display:flex;align-items:center;gap:10px;color:#1b7b66;font-family:var(--serif);font-size:24px;font-weight:700;letter-spacing:-.8px}.lr-brand__mark{display:block;width:36px;height:36px;flex:0 0 36px;color:var(--rose)}.lr-brand__mark svg{display:block;width:100%;height:100%}.lr-brand__word>span{color:var(--rose)}.lr-brand--light{color:#fff}.lr-brand--light .lr-brand__mark,.lr-brand--light .lr-brand__word>span{color:#ffd5cc}.lr-nav__links{display:flex;gap:34px;font-size:14px;font-weight:600}.lr-nav__links a{opacity:.72;transition:.2s}.lr-nav__links a:hover{opacity:1}.lr-button{display:inline-flex;align-items:center;justify-content:center;gap:12px;min-height:52px;padding:0 25px;border-radius:12px;border:1px solid transparent;font-weight:750;transition:transform .2s,box-shadow .2s,background .2s}.lr-button svg{width:19px;height:19px}.lr-button:hover{transform:translateY(-2px)}.lr-button--small{min-height:42px;padding:0 19px;border-radius:10px;font-size:14px}.lr-button--outline{color:var(--ink);border-color:rgba(24,63,57,.42);background:transparent}.lr-button--outline:hover{background:var(--mint)}.lr-button--primary{color:#fff;background:var(--rose);box-shadow:0 14px 30px rgba(231,111,114,.24)}.lr-button--primary:hover{background:var(--rose-dark);box-shadow:0 18px 36px rgba(231,111,114,.32)}.lr-button--hero{min-height:60px;padding:0 30px;border-radius:14px;font-size:16px}.lr-button--light{color:var(--ink-deep);background:#fff;box-shadow:0 16px 40px rgba(0,0,0,.16)}
        .lr-hero{position:relative;padding:152px 0 96px;min-height:800px;background:linear-gradient(145deg,#fffaf4 18%,#f4faf7 100%)}.lr-hero__grid{position:relative;z-index:2;display:grid;grid-template-columns:.95fr 1.05fr;gap:72px;align-items:center}.lr-hero__copy{padding-top:20px}.lr-pill{display:inline-flex;align-items:center;gap:9px;padding:8px 13px;border:1px solid rgba(231,111,114,.2);border-radius:99px;background:#fff0ea;color:#85524d;font-size:12px;font-weight:800;letter-spacing:.07em;text-transform:uppercase}.lr-pill span{display:grid;width:22px;height:22px;place-items:center;border-radius:50%;background:#ffdbd2;color:var(--rose)}.lr-hero h1,.lr-section-heading h2,.lr-mid-cta h2,.lr-insights h2,.lr-faq h2,.lr-final-cta h2{margin:25px 0 24px;font-family:var(--serif);font-weight:500;letter-spacing:-.045em;line-height:.98}.lr-hero h1{max-width:650px;font-size:clamp(58px,5.5vw,84px);color:var(--ink)}.lr-page h1 em,.lr-page h2 em{color:var(--rose);font-style:italic}.lr-hero__lead{max-width:605px;margin:0;color:#4b625d;font-size:18px;line-height:1.75}.lr-hero__actions{display:flex;align-items:center;gap:20px;margin-top:34px}.lr-hero__note{display:flex;flex-direction:column;color:#71807d;font-size:12px;line-height:1.45}.lr-hero__note strong{color:var(--ink);font-size:13px}.lr-proof{display:flex;align-items:center;gap:15px;margin-top:34px}.lr-avatars{display:flex}.lr-avatars img,.lr-avatars>span{width:39px;height:39px;margin-left:-9px;border:3px solid var(--cream);border-radius:50%;object-fit:cover}.lr-avatars img:first-child{margin-left:0}.lr-avatars>span{display:grid;place-items:center;background:var(--rose);color:#fff;font-size:17px;font-weight:800}.lr-proof strong{color:var(--ink);font-family:var(--serif);font-size:14px}.lr-proof p{margin:3px 0 0;color:#687a76;font-size:11px}.lr-hero__visual{position:relative;min-height:570px}.lr-visual-card--main{position:absolute;inset:25px 15px 25px 55px;overflow:hidden;border:12px solid #fff;border-radius:170px 170px 34px 34px;background:#eadfd7;box-shadow:0 35px 80px rgba(33,78,68,.16);transform:rotate(1deg)}.lr-visual-card--main:after{position:absolute;inset:0;background:linear-gradient(to top,rgba(11,42,36,.25),transparent 48%);content:''}.lr-visual-card--main>img{height:100%;object-fit:cover}.lr-result-badge{position:absolute;z-index:2;right:25px;bottom:26px;display:flex;align-items:center;gap:12px;width:260px;padding:13px 15px;border:1px solid rgba(255,255,255,.6);border-radius:15px;background:rgba(255,255,255,.92);box-shadow:0 12px 35px rgba(0,0,0,.12);backdrop-filter:blur(10px)}.lr-result-badge__icon{display:grid;width:42px;height:42px;flex:0 0 42px;place-items:center;border-radius:12px;background:var(--blush);color:var(--rose);font-size:19px}.lr-result-badge span:last-child{display:flex;flex-direction:column}.lr-result-badge small{color:#74807d;font-size:10px}.lr-result-badge strong{margin-top:3px;color:var(--ink);font-family:var(--serif);font-size:16px}.lr-floating-card{position:absolute;z-index:3;display:flex;align-items:center;gap:12px;width:245px;padding:14px;border:1px solid rgba(24,63,57,.08);border-radius:17px;background:rgba(255,255,255,.95);box-shadow:0 18px 45px rgba(35,73,66,.13);animation:lr-float 4s ease-in-out infinite}.lr-floating-card--top{top:72px;right:-23px}.lr-floating-card--bottom{bottom:73px;left:-12px;animation-delay:-2s}.lr-floating-card__icon{display:grid;width:43px;height:43px;flex:0 0 43px;place-items:center;border-radius:13px}.lr-floating-card__icon svg{width:22px;height:22px}.lr-floating-card__icon--mint{color:#2e8d73;background:#e1f4ec}.lr-floating-card__icon--rose{color:var(--rose);background:#ffebe7}.lr-floating-card>span:last-child{display:flex;flex-direction:column}.lr-floating-card strong{color:var(--ink);font-family:var(--serif);font-size:15px}.lr-floating-card small{margin-top:3px;color:#788480;font-size:10px;line-height:1.4}.lr-decoration{position:absolute;z-index:3;display:grid;place-items:center;color:var(--rose)}.lr-decoration--flower{left:10px;top:25px;width:56px;height:56px;border-radius:50%;background:#ffe8df;font-size:25px;transform:rotate(-12deg)}.lr-decoration--heart{right:10px;bottom:9px;font-family:var(--serif);font-size:52px;transform:rotate(12deg)}.lr-hero__glow{position:absolute;border-radius:50%;filter:blur(2px)}.lr-hero__glow--one{top:100px;right:-160px;width:440px;height:440px;background:rgba(214,239,229,.7)}.lr-hero__glow--two{left:-170px;bottom:-110px;width:340px;height:340px;background:rgba(255,226,218,.5)}@keyframes lr-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
        .lr-stats{border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:#fff}.lr-stats__grid{display:grid;grid-template-columns:repeat(4,1fr);padding:30px 0}.lr-stats__grid>div{display:flex;align-items:center;justify-content:center;gap:13px;min-height:46px;border-right:1px solid var(--line)}.lr-stats__grid>div:last-child{border-right:0}.lr-stats strong{color:var(--rose);font-family:var(--serif);font-size:27px}.lr-stats span{max-width:125px;color:#60706d;font-size:11px;line-height:1.35;text-transform:uppercase;letter-spacing:.07em}
        .lr-intro{position:relative;padding-bottom:150px;background:var(--cream)}.lr-section-heading--center{max-width:790px;margin:0 auto 64px;text-align:center}.lr-kicker{color:var(--sage);font-size:12px;font-weight:850;letter-spacing:.16em;text-transform:uppercase}.lr-section-heading h2,.lr-mid-cta h2,.lr-insights h2,.lr-faq h2,.lr-final-cta h2{font-size:clamp(43px,4.5vw,64px);color:var(--brown)}.lr-section-heading p{max-width:680px;margin:0 auto;color:#60706d;font-size:16px;line-height:1.75}.lr-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin:0 0 52px}.lr-step{display:flex;gap:16px;min-height:140px;padding:25px 23px;border:1px solid var(--line);border-radius:20px;background:rgba(255,255,255,.72);box-shadow:0 12px 35px rgba(49,76,69,.035)}.lr-step>span{display:grid;width:41px;height:41px;flex:0 0 41px;place-items:center;border-radius:50%;background:var(--blush);color:var(--rose);font-size:10px;font-weight:900}.lr-step strong{display:block;color:var(--brown);font-family:var(--serif);font-size:17px;line-height:1.25}.lr-step p{margin:8px 0 0;color:#6b7976;font-size:12px;line-height:1.6}.lr-story-grid{display:grid;grid-template-columns:minmax(0,1.32fr) minmax(330px,.78fr);gap:24px;align-items:stretch;height:auto;min-height:620px}.lr-story-card{position:relative;min-width:0;overflow:hidden;border-radius:28px;background:#e9e1d9}.lr-story-card--large{height:620px}.lr-story-card img{height:100%;object-fit:cover;transition:transform .7s}.lr-story-card:hover img{transform:scale(1.018)}.lr-story-side{display:grid;min-width:0;min-height:620px;grid-template-rows:300px minmax(0,1fr);gap:24px}.lr-story-card--image{height:300px}.lr-story-card--image img{object-position:center 35%}.lr-image-chip{position:absolute;left:25px;bottom:25px;max-width:calc(100% - 50px);padding:12px 16px;border:1px solid rgba(255,255,255,.65);border-radius:99px;background:rgba(255,255,255,.92);color:var(--ink);font-size:11px;font-weight:750;line-height:1.35;backdrop-filter:blur(10px)}.lr-story-quote{position:relative;display:flex;min-height:0;flex-direction:column;justify-content:center;overflow:hidden;padding:40px 38px;border-radius:28px;background:var(--mint);color:var(--ink)}.lr-story-quote p{position:relative;z-index:1;margin:0 0 20px;font-family:var(--serif);font-size:24px;line-height:1.4}.lr-story-quote>span:last-child{position:relative;z-index:1;color:#67807a;font-size:11px;font-weight:700;line-height:1.5}.lr-quote-mark{position:absolute;top:4px;right:24px;color:rgba(78,139,127,.15);font-family:var(--serif);font-size:100px}
        .lr-expressions{background:#f0f8f4}.lr-section-heading--split{display:grid;grid-template-columns:1.2fr .7fr;gap:80px;align-items:end;margin-bottom:55px}.lr-section-heading--split h2{margin-bottom:0}.lr-section-heading--split p{padding-bottom:8px}.lr-carousel{position:relative}.lr-card-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:19px}.lr-expression-card{overflow:hidden;border:1px solid rgba(24,63,57,.08);border-radius:24px;background:#fff;box-shadow:0 12px 35px rgba(34,76,67,.05);animation:lr-fade .35s ease}.lr-expression-card__image{position:relative;height:225px;overflow:hidden}.lr-expression-card__image img{height:100%;object-fit:cover;transition:transform .5s}.lr-expression-card:hover .lr-expression-card__image img{transform:scale(1.045)}.lr-expression-card__number{position:absolute;top:14px;right:14px;display:grid;width:40px;height:40px;place-items:center;border-radius:50%;background:rgba(255,255,255,.9);color:var(--ink);font-family:var(--serif);font-size:13px}.lr-expression-card__body{padding:27px 26px 29px}.lr-expression-card__eyebrow{display:flex;align-items:center;gap:8px;color:var(--sage);font-size:10px;font-weight:850;letter-spacing:.08em;text-transform:uppercase}.lr-expression-card__eyebrow>span{display:grid;width:29px;height:29px;place-items:center;border-radius:9px;background:var(--mint)}.lr-expression-card__eyebrow svg{width:15px;height:15px}.lr-expression-card h3{margin:17px 0 11px;color:var(--brown);font-family:var(--serif);font-size:25px;line-height:1.12}.lr-expression-card p{min-height:92px;margin:0;color:#687773;font-size:13px;line-height:1.7}.lr-expression-card button{display:flex;align-items:center;gap:8px;margin-top:20px;padding:0;border:0;background:none;color:var(--rose);font-size:12px;font-weight:800}.lr-expression-card button svg{width:16px}.lr-carousel__button{position:absolute;z-index:3;top:50%;display:grid;width:48px;height:48px;place-items:center;border:1px solid rgba(24,63,57,.12);border-radius:50%;background:#fff;color:var(--ink);box-shadow:0 8px 25px rgba(28,61,55,.12);transform:translateY(-50%);transition:.2s}.lr-carousel__button:hover{background:var(--ink);color:#fff}.lr-carousel__button svg{width:20px}.lr-carousel__button--left{left:-70px}.lr-carousel__button--right{right:-70px}.lr-flip{transform:rotate(180deg)}.lr-carousel__footer{display:flex;align-items:center;justify-content:center;gap:20px;margin-top:35px;color:#81908c;font-family:var(--serif);font-size:12px}.lr-dots{display:flex;gap:7px}.lr-dots button{width:7px;height:7px;padding:0;border:0;border-radius:99px;background:#bcd2ca;transition:.25s}.lr-dots button.active{width:28px;background:var(--rose)}@keyframes lr-fade{from{opacity:.55;transform:translateY(5px)}to{opacity:1;transform:none}}
        .lr-mid-cta{padding:80px 0;background:#f0f8f4}.lr-mid-cta__card{display:grid;grid-template-columns:1.1fr .8fr;gap:80px;align-items:center;padding:58px 64px;border-radius:28px;background:var(--ink);color:#fff;box-shadow:0 25px 70px rgba(16,46,42,.15)}.lr-mid-cta h2{margin:15px 0 0;color:#fff;font-size:47px}.lr-mid-cta h2 em{color:#a8dbc9}.lr-mid-cta .lr-kicker{color:#a8dbc9}.lr-mid-cta__action p{margin:0 0 22px;color:#d4e4df;font-size:14px;line-height:1.7}.lr-mid-cta__action .lr-button{width:100%}.lr-mid-cta__action small{display:block;margin-top:12px;color:#aabfba;text-align:center;font-size:10px}
        .lr-insights{background:#fff}.lr-insights__grid{display:grid;grid-template-columns:1fr .96fr;gap:80px;align-items:center}.lr-insights__image{position:relative;height:650px}.lr-insights__image>img{height:100%;border-radius:190px 28px 28px 28px;object-fit:cover}.lr-image-stat{position:absolute;right:-25px;bottom:35px;display:flex;align-items:center;gap:13px;width:235px;padding:18px;border-radius:18px;background:#fff;box-shadow:0 18px 45px rgba(21,55,49,.18)}.lr-image-stat strong{color:var(--rose);font-family:var(--serif);font-size:31px}.lr-image-stat span{color:#667773;font-size:10px;line-height:1.45}.lr-insights h2{margin-top:17px}.lr-accordion{margin-top:42px;border-top:1px solid var(--line)}.lr-accordion__item{border-bottom:1px solid var(--line)}.lr-accordion__item>button{display:grid;width:100%;grid-template-columns:38px 1fr 34px;gap:12px;align-items:center;padding:21px 0;border:0;background:transparent;color:#70807c;text-align:left}.lr-accordion__count{color:var(--rose);font-size:10px;font-weight:800}.lr-accordion__item strong{font-family:var(--serif);font-size:18px}.lr-plus{display:grid;width:32px;height:32px;place-items:center;border-radius:10px;background:var(--blush);color:var(--rose);font-size:20px}.lr-accordion__answer{display:grid;grid-template-rows:0fr;transition:grid-template-rows .3s}.lr-accordion__answer p{overflow:hidden;margin:0 46px 0 50px;color:#60706d;font-size:13px;line-height:1.7}.lr-accordion__item.open>button{color:var(--ink)}.lr-accordion__item.open .lr-accordion__answer{grid-template-rows:1fr}.lr-accordion__item.open .lr-accordion__answer p{padding-bottom:23px}
        .lr-testimonials{background:#fff5f0}.lr-testimonial-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.lr-testimonial-grid article{padding:32px;border:1px solid rgba(91,52,46,.08);border-radius:23px;background:#fff}.lr-testimonial-grid article.featured{background:var(--ink);color:#fff;transform:translateY(-14px)}.lr-testimonial-grid article>p{min-height:145px;margin:23px 0;color:#4f6460;font-family:var(--serif);font-size:21px;line-height:1.55}.lr-testimonial-grid article.featured>p{color:#eff7f4}.lr-clarity-number{display:grid;width:38px;height:38px;place-items:center;border-radius:50%;background:var(--blush);color:var(--rose);font-size:10px;font-weight:900}.lr-testimonial-grid article.featured .lr-clarity-number{background:rgba(255,255,255,.12);color:#ffd7ce}.lr-clarity-label{display:flex!important;flex-direction:column;align-items:flex-start!important;gap:0!important;padding-top:17px;border-top:1px solid var(--line)}.lr-testimonial-grid article.featured .lr-clarity-label{border-color:rgba(255,255,255,.14)}.lr-clarity-label strong{font-size:12px}.lr-clarity-label small{margin-top:5px;color:#80908c;font-size:10px}.lr-testimonial-grid article.featured .lr-clarity-label small{color:#a9c2bc}
        .lr-faq{background:#fff}.lr-faq__grid{display:grid;grid-template-columns:.7fr 1.3fr;gap:100px;align-items:start}.lr-faq__intro{position:sticky;top:130px}.lr-faq__intro h2{margin-top:18px}.lr-faq__intro>p{max-width:380px;margin:0 0 28px;color:#657571;font-size:14px;line-height:1.75}.lr-faq__item{margin-bottom:13px;overflow:hidden;border:1px solid var(--line);border-radius:17px;background:var(--mint-2);transition:.2s}.lr-faq__item.open{border-color:rgba(78,139,127,.3);background:var(--mint)}.lr-faq__item>button{display:flex;width:100%;align-items:center;justify-content:space-between;padding:25px 26px;border:0;background:transparent;color:var(--ink-deep);text-align:left}.lr-faq__item>button span{padding-right:20px;font-family:var(--serif);font-size:19px;font-weight:700}.lr-faq__item>button i{display:grid;width:36px;height:36px;flex:0 0 36px;place-items:center;border-radius:50%;background:#fff;color:var(--ink);font-style:normal;font-size:20px}.lr-faq__item>div{display:grid;grid-template-rows:0fr;transition:grid-template-rows .3s}.lr-faq__item>div p{overflow:hidden;margin:0;padding:0 70px 0 26px;color:#60706d;font-size:13px;line-height:1.75}.lr-faq__item.open>div{grid-template-rows:1fr}.lr-faq__item.open>div p{padding-bottom:25px}
        .lr-final-cta{position:relative;padding:115px 0;overflow:hidden;background:var(--rose);color:#fff}.lr-final-cta__inner{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;text-align:center}.lr-final-cta .lr-kicker{color:#ffe8e4}.lr-final-cta h2{margin:19px 0;color:#fff}.lr-final-cta h2 em{color:#ffe1d7}.lr-final-cta p{max-width:620px;margin:0 0 30px;color:#ffeded;font-size:15px;line-height:1.7}.lr-final-cta__heart{display:grid;width:52px;height:52px;margin-bottom:20px;place-items:center;border:1px solid rgba(255,255,255,.38);border-radius:50%;background:rgba(255,255,255,.12);font-size:19px}.lr-final-cta__proof{margin-top:19px;color:#ffe3df;font-size:11px}.lr-final-cta__proof span{color:#fff2ae;letter-spacing:2px}.lr-final-cta__orb{position:absolute;border-radius:50%;border:1px solid rgba(255,255,255,.15)}.lr-final-cta__orb--one{top:-210px;left:-130px;width:520px;height:520px}.lr-final-cta__orb--two{right:-170px;bottom:-280px;width:650px;height:650px}
        .lr-footer{padding:75px 0 25px;background:var(--ink-deep);color:#dce9e5}.lr-footer__top{display:grid;grid-template-columns:1.5fr repeat(3,.65fr);gap:70px;padding-bottom:60px}.lr-footer__brand p{margin:22px 0;color:#9eb6b0;font-size:13px;line-height:1.7}.lr-footer__socials{display:flex;gap:9px}.lr-footer__socials a{display:grid;width:34px;height:34px;place-items:center;border:1px solid rgba(255,255,255,.16);border-radius:50%;color:#fff;font-size:10px;font-weight:800;text-decoration:none}.lr-footer__links{display:flex;flex-direction:column;gap:13px}.lr-footer__links strong{margin-bottom:7px;color:#fff;font-size:11px;letter-spacing:.14em;text-transform:uppercase}.lr-footer__links a{color:#9eb6b0;font-size:12px;text-decoration:none}.lr-footer__links a:hover{color:#fff}.lr-footer__bottom{display:flex;align-items:center;justify-content:space-between;padding-top:23px;border-top:1px solid rgba(255,255,255,.12);color:#76918b;font-size:10px}.lr-footer__bottom button{padding:8px 12px;border:1px solid rgba(255,255,255,.15);border-radius:9px;background:transparent;color:#dce9e5;font-size:10px}
        @media(max-width:1320px){.lr-carousel__button--left{left:-18px}.lr-carousel__button--right{right:-18px}}
        @media(max-width:980px){.lr-section{padding:95px 0}.lr-nav__links{display:none}.lr-hero{padding-top:130px}.lr-hero__grid{grid-template-columns:1fr;gap:45px}.lr-hero__copy{text-align:center}.lr-hero h1,.lr-hero__lead{margin-left:auto;margin-right:auto}.lr-hero__actions,.lr-proof{justify-content:center}.lr-hero__visual{width:min(620px,100%);margin:0 auto}.lr-stats__grid{grid-template-columns:repeat(2,1fr);row-gap:20px}.lr-stats__grid>div:nth-child(2){border-right:0}.lr-story-grid{height:520px}.lr-section-heading--split{grid-template-columns:1fr;gap:20px;text-align:center}.lr-section-heading--split p{margin:auto}.lr-card-grid{grid-template-columns:repeat(2,1fr)}.lr-expression-card:nth-child(3){display:none}.lr-mid-cta__card{gap:40px;padding:45px}.lr-insights__grid{grid-template-columns:1fr;gap:60px}.lr-insights__image{height:570px;width:min(620px,100%);margin:auto}.lr-testimonial-grid{grid-template-columns:1fr}.lr-testimonial-grid article.featured{transform:none}.lr-testimonial-grid article>p{min-height:0}.lr-faq__grid{grid-template-columns:1fr;gap:50px}.lr-faq__intro{position:static;text-align:center}.lr-faq__intro>p{margin-left:auto;margin-right:auto}.lr-footer__top{grid-template-columns:1.2fr repeat(3,1fr);gap:30px}}
        @media(min-width:681px){.lr-hero__actions > .lr-button--hero{min-width:210px;padding-inline:36px}.lr-journey-intro__copy > .lr-button--hero{min-width:278px;justify-content:center}}
        @media(max-width:680px){.lr-shell{width:min(100% - 34px,1200px)}.lr-section{padding:78px 0}.lr-nav{height:68px}.lr-brand{font-size:20px}.lr-brand__mark{transform:scale(.88)}.lr-nav .lr-button{min-height:38px;padding:0 13px;font-size:12px}.lr-hero{min-height:auto;padding:112px 0 70px}.lr-pill{font-size:9px}.lr-hero h1{font-size:49px;line-height:1}.lr-hero__lead{font-size:15px;line-height:1.65}.lr-hero__actions{flex-direction:column}.lr-button--hero{width:100%}.lr-hero__note{display:none}.lr-proof{margin-top:24px}.lr-hero__visual{min-height:440px;margin-top:10px}.lr-visual-card--main{inset:20px 4px 20px 20px;border-width:8px;border-radius:110px 110px 25px 25px}.lr-floating-card{width:190px;padding:10px}.lr-floating-card--top{top:50px;right:-8px}.lr-floating-card--bottom{bottom:45px;left:-7px}.lr-floating-card__icon{width:36px;height:36px;flex-basis:36px}.lr-floating-card strong{font-size:12px}.lr-floating-card small{font-size:8px}.lr-result-badge{right:15px;bottom:17px;width:214px;padding:9px}.lr-result-badge__icon{width:34px;height:34px;flex-basis:34px}.lr-result-badge strong{font-size:13px}.lr-decoration--flower{display:none}.lr-stats__grid{padding:22px 0}.lr-stats__grid>div{gap:8px;padding:5px 8px}.lr-stats strong{font-size:22px}.lr-stats span{font-size:8px}.lr-section-heading--center{margin-bottom:44px}.lr-section-heading h2,.lr-mid-cta h2,.lr-insights h2,.lr-faq h2,.lr-final-cta h2{font-size:39px}.lr-section-heading p{font-size:14px}.lr-story-grid{display:flex;height:auto;flex-direction:column}.lr-story-card--large{height:420px}.lr-story-side{grid-template-rows:280px auto}.lr-story-quote{padding:28px}.lr-story-quote p{font-size:21px}.lr-steps{grid-template-columns:1fr;gap:24px;margin-top:38px}.lr-section-heading--split{margin-bottom:38px}.lr-card-grid{grid-template-columns:1fr}.lr-expression-card:nth-child(2),.lr-expression-card:nth-child(3){display:none}.lr-expression-card__image{height:240px}.lr-expression-card p{min-height:0}.lr-carousel__button{top:215px;width:42px;height:42px}.lr-carousel__button--left{left:-10px}.lr-carousel__button--right{right:-10px}.lr-mid-cta{padding:55px 0}.lr-mid-cta__card{grid-template-columns:1fr;gap:25px;padding:34px 25px;text-align:center}.lr-mid-cta h2{font-size:36px}.lr-insights__image{height:460px}.lr-insights__image>img{border-radius:110px 24px 24px 24px}.lr-image-stat{right:10px;bottom:17px;width:210px}.lr-insights h2{text-align:center}.lr-insights__content>.lr-kicker{display:block;text-align:center}.lr-accordion__item strong{font-size:16px}.lr-testimonial-grid article{padding:25px}.lr-faq__item>button{padding:21px 19px}.lr-faq__item>button span{font-size:17px}.lr-faq__item>div p{padding-left:19px}.lr-faq__item.open>div p{padding-right:35px}.lr-final-cta{padding:85px 0}.lr-footer__top{grid-template-columns:1fr 1fr;gap:45px 25px}.lr-footer__brand{grid-column:1/-1}.lr-footer__bottom{align-items:flex-start;flex-direction:column;gap:12px}.lr-footer__links:last-child{display:none}}
        .lr-expressions.lr-section{position:relative;padding-top:150px;border-top:1px solid rgba(33,77,69,.07)}
        @media(max-width:980px) and (min-width:681px){.lr-story-grid{height:auto;min-height:560px}.lr-story-card--large{height:560px}.lr-story-side{min-height:560px;grid-template-rows:270px minmax(0,1fr)}.lr-story-card--image{height:270px}.lr-steps{gap:14px}.lr-step{padding:21px 18px}.lr-expressions.lr-section{padding-top:115px}}
        @media(max-width:680px){.lr-intro{padding-bottom:95px}.lr-steps{grid-template-columns:1fr;gap:12px;margin:0 0 36px}.lr-step{min-height:0;padding:20px}.lr-story-grid{display:flex;height:auto;min-height:0;flex-direction:column;gap:16px}.lr-story-card--large{height:430px}.lr-story-side{min-height:0;grid-template-rows:260px auto;gap:16px}.lr-story-card--image{height:260px}.lr-story-quote{min-height:270px;padding:32px 27px}.lr-image-chip{left:16px;right:16px;bottom:16px;max-width:none;text-align:center}.lr-expressions.lr-section{padding-top:95px}}

        /* Conversion-first test card */
        .lr-hero__grid{grid-template-columns:minmax(0,1.04fr) minmax(430px,.96fr);gap:76px}.lr-hero__visual{min-height:0;scroll-margin-top:110px}.lr-starter-card{width:100%;max-width:560px;margin-left:auto;overflow:hidden;border:1px solid rgba(33,77,69,.1);border-radius:30px;background:rgba(255,255,255,.96);box-shadow:0 32px 85px rgba(24,63,57,.14);backdrop-filter:blur(18px)}.lr-starter-card__top{display:flex;align-items:center;justify-content:space-between;padding:22px 28px 15px}.lr-starter-card__eyebrow{color:var(--sage);font-size:10px;font-weight:850;letter-spacing:.15em;text-transform:uppercase}.lr-starter-card__time{padding:7px 10px;border-radius:99px;background:var(--mint);color:#57756f;font-size:10px;font-weight:750}.lr-progress{height:5px;background:#edf3ef}.lr-progress span{display:block;height:100%;border-radius:0 99px 99px 0;background:linear-gradient(90deg,var(--rose),#f2a093)}.lr-starter-card__content{padding:30px 34px 32px}.lr-starter-card__number{display:grid;width:42px;height:42px;place-items:center;border-radius:50%;background:var(--blush);color:var(--rose);font-size:11px;font-weight:900}.lr-starter-card h2{max-width:460px;margin:20px 0 10px;color:var(--brown);font-family:var(--serif);font-size:35px;font-weight:500;letter-spacing:-.035em;line-height:1.1}.lr-starter-card__content>p{margin:0 0 22px;color:#6d7d79;font-size:13px;line-height:1.6}.lr-starter-options{display:grid;gap:10px}.lr-starter-options button{display:grid;width:100%;min-height:64px;grid-template-columns:42px 1fr 28px;gap:12px;align-items:center;padding:9px 14px;border:1px solid rgba(33,77,69,.12);border-radius:15px;background:#fff;color:var(--ink-deep);text-align:left;transition:border-color .2s,background .2s,box-shadow .2s,transform .2s}.lr-starter-options button:hover{border-color:rgba(231,111,114,.45);box-shadow:0 9px 24px rgba(33,77,69,.07);transform:translateY(-1px)}.lr-starter-options button.selected{border-color:var(--rose);background:#fff8f5;box-shadow:0 0 0 3px rgba(231,111,114,.1)}.lr-starter-options__icon{display:grid;width:42px;height:42px;place-items:center;border-radius:12px;background:var(--mint);font-size:18px}.lr-starter-options button>span:nth-child(2){font-size:13px;font-weight:700}.lr-starter-options button i{color:var(--sage);font-style:normal;font-size:18px}.lr-starter-card__continue{width:100%;margin-top:18px}.lr-starter-card__continue:disabled{cursor:not-allowed;opacity:.42;box-shadow:none;transform:none}.lr-starter-card__footer{display:flex;align-items:center;justify-content:center;gap:15px;padding:15px 24px;border-top:1px solid rgba(33,77,69,.07);background:var(--mint-2);color:#6b807b;font-size:10px;font-weight:700}.lr-starter-card__footer span+span:before{margin-right:15px;color:#b8c9c4;content:'•'}.lr-starter-note{display:block;margin:13px 0 0;color:#758782;text-align:center;font-size:10px}

        /* Focused quiz */
        .lr-quiz-overlay{position:fixed;z-index:100;inset:0;display:grid;place-items:center;padding:22px;background:rgba(14,42,37,.62);backdrop-filter:blur(12px);animation:lr-overlay-in .2s ease}.lr-quiz-modal{position:relative;width:min(620px,100%);max-height:calc(100vh - 44px);overflow:auto;border:1px solid rgba(255,255,255,.55);border-radius:29px;background:var(--cream);box-shadow:0 35px 100px rgba(8,30,26,.34);animation:lr-modal-in .28s ease}.lr-quiz-modal__close{position:absolute;z-index:2;top:16px;right:16px;display:grid;width:38px;height:38px;place-items:center;border:1px solid rgba(33,77,69,.1);border-radius:50%;background:#fff;color:var(--ink);font-size:23px;line-height:1}.lr-quiz-modal__header{display:flex;align-items:center;justify-content:space-between;padding:22px 68px 15px 28px}.lr-quiz-modal__header .lr-brand{font-size:19px}.lr-quiz-modal__header .lr-brand__mark{width:30px;height:30px;flex-basis:30px}.lr-quiz-modal__header>span{color:#74847f;font-size:10px;font-weight:750}.lr-quiz-modal__progress{height:5px;background:#e8f0ec}.lr-quiz-modal__progress span{display:block;height:100%;border-radius:0 99px 99px 0;background:linear-gradient(90deg,var(--rose),#f1a491);transition:width .3s}.lr-quiz-modal__body{padding:40px 42px 34px}.lr-quiz-modal__body h2{margin:15px 0 28px;color:var(--brown);font-family:var(--serif);font-size:38px;font-weight:500;letter-spacing:-.035em;line-height:1.12}.lr-quiz-options{display:grid;gap:11px}.lr-quiz-options button{display:flex;width:100%;min-height:62px;align-items:center;justify-content:space-between;padding:14px 18px;border:1px solid rgba(33,77,69,.12);border-radius:15px;background:#fff;color:var(--ink);text-align:left;transition:.2s}.lr-quiz-options button:hover{border-color:var(--rose);background:#fff8f5;box-shadow:0 9px 24px rgba(33,77,69,.07);transform:translateY(-1px)}.lr-quiz-options button span{font-size:13px;font-weight:700}.lr-quiz-options button svg{width:18px;height:18px;color:var(--rose)}.lr-quiz-modal__hint{padding:15px 25px;border-top:1px solid rgba(33,77,69,.07);background:var(--mint-2);color:#738580;text-align:center;font-size:10px}.lr-quiz-result{display:flex;min-height:570px;flex-direction:column;align-items:center;justify-content:center;padding:58px 50px;text-align:center}.lr-quiz-result__heart{display:grid;width:55px;height:55px;margin-bottom:22px;place-items:center;border-radius:50%;background:var(--blush);color:var(--rose);font-size:22px}.lr-quiz-result h2{margin:14px 0 16px;color:var(--brown);font-family:var(--serif);font-size:46px;font-weight:500;letter-spacing:-.04em;line-height:1.05}.lr-quiz-result>p{max-width:470px;margin:0;color:#61736f;font-size:15px;line-height:1.75}.lr-quiz-result__notice{max-width:470px;margin:24px 0;padding:14px 18px;border-radius:13px;background:var(--mint);color:#54716a;font-size:11px;line-height:1.55}.lr-quiz-result__retake{margin-top:15px;padding:5px;border:0;background:transparent;color:#73847f;font-size:11px;text-decoration:underline;text-underline-offset:3px}.lr-mobile-cta{display:none}@keyframes lr-overlay-in{from{opacity:0}to{opacity:1}}@keyframes lr-modal-in{from{opacity:0;transform:translateY(14px) scale(.985)}to{opacity:1;transform:none}}

        .lr-progress span{width:20%}
        @media(max-width:980px){.lr-hero__grid{grid-template-columns:1fr;gap:50px}.lr-starter-card{margin:0 auto}.lr-hero__visual{min-height:0}.lr-hero{padding-bottom:90px}}
        @media(max-width:680px){.lr-hero__visual{min-height:0;margin-top:18px}.lr-starter-card{border-radius:23px}.lr-starter-card__top{padding:18px 20px 13px}.lr-starter-card__content{padding:24px 19px 23px}.lr-starter-card h2{font-size:29px}.lr-starter-options button{min-height:59px;grid-template-columns:39px 1fr 22px;padding:8px 11px}.lr-starter-options__icon{width:39px;height:39px}.lr-starter-options button>span:nth-child(2){font-size:12px}.lr-starter-card__footer{flex-wrap:wrap;gap:7px 12px;padding:13px 15px}.lr-starter-card__footer span+span:before{margin-right:12px}.lr-starter-note{margin-bottom:0}.lr-mobile-cta{position:fixed;z-index:60;right:12px;bottom:12px;left:12px;display:flex;min-height:62px;align-items:center;justify-content:space-between;padding:10px 14px 10px 18px;border:1px solid rgba(255,255,255,.25);border-radius:17px;background:rgba(24,63,57,.96);color:#fff;box-shadow:0 18px 50px rgba(11,37,32,.28);backdrop-filter:blur(14px)}.lr-mobile-cta>span{display:flex;flex-direction:column;align-items:flex-start}.lr-mobile-cta strong{font-size:13px}.lr-mobile-cta small{margin-top:2px;color:#bdd4ce;font-size:9px}.lr-mobile-cta>svg{width:35px;height:35px;padding:8px;border-radius:50%;background:var(--rose)}.lr-footer{padding-bottom:105px}.lr-quiz-overlay{padding:10px}.lr-quiz-modal{max-height:calc(100vh - 20px);border-radius:22px}.lr-quiz-modal__header{padding:18px 57px 13px 18px}.lr-quiz-modal__body{padding:32px 19px 27px}.lr-quiz-modal__body h2{font-size:29px}.lr-quiz-options button{min-height:57px;padding:12px 14px}.lr-quiz-result{min-height:520px;padding:48px 22px}.lr-quiz-result h2{font-size:38px}.lr-quiz-result>p{font-size:14px}}
        /* Warm visual hero — the test only opens after a CTA click */
        .lr-hero__visual{min-height:600px}.lr-hero-photo{position:absolute;inset:22px 18px 28px 38px;overflow:hidden;border:11px solid #fff;border-radius:180px 180px 34px 34px;background:#e7eee9;box-shadow:0 34px 85px rgba(25,67,59,.17);transform:rotate(.45deg)}.lr-hero-photo:after{position:absolute;inset:0;background:linear-gradient(to top,rgba(15,46,40,.18),transparent 46%);content:''}.lr-hero-photo img{height:100%;object-fit:cover;object-position:center}.lr-benefit-card{position:absolute;z-index:4;display:flex;align-items:center;gap:13px;width:245px;padding:14px 16px;border:1px solid rgba(33,77,69,.09);border-radius:17px;background:rgba(255,255,255,.96);box-shadow:0 18px 45px rgba(24,63,57,.14);backdrop-filter:blur(13px)}.lr-benefit-card--top{top:-28px;right:-18px}.lr-benefit-card--left{bottom:75px;left:-25px}.lr-benefit-card--result{right:5px;bottom:46px;width:270px}.lr-benefit-card__icon{display:grid;width:43px;height:43px;flex:0 0 43px;place-items:center;border-radius:13px;background:#e0f4eb;color:#248b70}.lr-benefit-card__icon--rose{background:var(--blush);color:var(--rose)}.lr-benefit-card__icon svg{width:21px;height:21px}.lr-benefit-card>span:last-child{display:flex;min-width:0;flex-direction:column}.lr-benefit-card strong{color:var(--ink);font-family:var(--serif);font-size:17px;line-height:1.15}.lr-benefit-card small{margin-top:4px;color:#75837f;font-size:9px;line-height:1.35}.lr-benefit-card--result small{margin:0 0 4px}.lr-benefit-card--result strong{font-size:18px}.lr-hero-photo__spark{position:absolute;top:26px;left:4px;display:grid;width:54px;height:54px;place-items:center;border-radius:50%;background:#ffe7df;color:var(--rose);font-size:22px;transform:rotate(-9deg)}.lr-hero-photo__heart{position:absolute;z-index:5;right:1px;bottom:18px;color:var(--rose);font-family:var(--serif);font-size:48px;transform:rotate(10deg)}.lr-footer__links button{align-self:flex-start;padding:0;border:0;background:transparent;color:#9eb6b0;font-size:12px}.lr-footer__links button:hover{color:#fff}
        @media(max-width:980px){.lr-hero__visual{min-height:590px}.lr-hero-photo{inset:20px 35px 28px}.lr-benefit-card--top{top:-20px;right:5px}.lr-benefit-card--left{left:2px}.lr-benefit-card--result{right:22px}}
        @media(max-width:680px){.lr-hero__visual{min-height:490px;margin-top:20px}.lr-hero-photo{inset:20px 7px 30px 18px;border-width:8px;border-radius:115px 115px 25px 25px}.lr-benefit-card{gap:9px;width:190px;padding:10px 11px;border-radius:14px}.lr-benefit-card--top{top:-14px;right:-4px}.lr-benefit-card--left{bottom:62px;left:-4px}.lr-benefit-card--result{right:0;bottom:22px;width:214px}.lr-benefit-card__icon{width:36px;height:36px;flex-basis:36px;border-radius:10px}.lr-benefit-card__icon svg{width:17px;height:17px}.lr-benefit-card strong{font-size:13px}.lr-benefit-card small{font-size:8px}.lr-benefit-card--result strong{font-size:14px}.lr-hero-photo__spark{top:3px;left:0;width:43px;height:43px;font-size:17px}.lr-hero-photo__heart{right:-2px;bottom:3px;font-size:40px}}

        /* Complete understandmylove journey */
        .lr-journey{position:fixed;z-index:200;inset:0;overflow-x:hidden;overflow-y:auto;background:#fffaf5;color:var(--ink);animation:lr-journey-in .28s ease}.lr-journey__header{position:sticky;z-index:20;top:0;display:flex;height:76px;align-items:center;justify-content:space-between;padding:0 max(28px,calc((100vw - 1180px)/2));border-bottom:1px solid rgba(33,77,69,.08);background:rgba(255,252,248,.9);backdrop-filter:blur(18px)}.lr-journey__header .lr-brand{font-size:21px}.lr-journey__count{position:absolute;left:50%;color:#6d807b;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;transform:translateX(-50%)}.lr-journey__close{display:grid;width:42px;height:42px;place-items:center;border:1px solid rgba(33,77,69,.11);border-radius:50%;background:#fff;color:var(--ink);font-size:25px;line-height:1;transition:.2s}.lr-journey__close:hover{border-color:rgba(231,111,114,.45);color:var(--rose);transform:rotate(4deg)}
        .lr-journey-intro{display:grid;width:min(1180px,calc(100% - 48px));min-height:calc(100vh - 76px);grid-template-columns:1fr .9fr;gap:80px;align-items:center;margin:auto;padding:66px 0 76px}.lr-journey-intro__copy h2{margin:20px 0;color:var(--brown);font-family:var(--serif);font-size:clamp(48px,5vw,70px);font-weight:500;letter-spacing:-.052em;line-height:.98}.lr-journey-intro__copy h2 em{color:var(--rose);font-weight:500}.lr-journey-intro__copy>p{max-width:580px;margin:0 0 27px;color:#5f716d;font-size:15px;line-height:1.75}.lr-journey-intro__checks{display:grid;gap:13px;margin:0 0 27px}.lr-journey-intro__checks>span{display:grid;grid-template-columns:31px 1fr;align-items:center;column-gap:11px}.lr-journey-intro__checks i{display:grid;width:31px;height:31px;grid-row:1/3;place-items:center;border-radius:50%;background:var(--mint);color:#248a70;font-style:normal;font-size:12px;font-weight:900}.lr-journey-intro__checks b{color:var(--ink-deep);font-size:12px}.lr-journey-intro__checks small{margin-top:2px;color:#81908d;font-size:10px}.lr-journey-intro__time{display:block;margin:12px 0 0 4px;color:#7a8a86;font-size:10px}.lr-journey-intro__visual{position:relative;height:610px}.lr-journey-intro__visual>img{width:100%;height:100%;border:11px solid #fff;border-radius:170px 170px 30px 30px;object-fit:cover;object-position:center;box-shadow:0 34px 90px rgba(24,63,57,.16)}.lr-journey-intro__quote{position:absolute;right:-20px;top:-57px;width:245px;padding:17px 19px;border:1px solid rgba(33,77,69,.09);border-radius:17px;background:rgba(255,255,255,.96);box-shadow:0 18px 45px rgba(24,63,57,.13);color:var(--brown);font-family:var(--serif);font-size:17px;line-height:1.3}.lr-journey-intro__badge{position:absolute;bottom:42px;left:-34px;display:flex;width:255px;align-items:center;gap:13px;padding:14px 16px;border:1px solid rgba(33,77,69,.09);border-radius:18px;background:rgba(255,255,255,.97);box-shadow:0 18px 45px rgba(24,63,57,.14)}.lr-journey-intro__badge>span{display:grid;width:44px;height:44px;flex:0 0 44px;place-items:center;border-radius:13px;background:var(--blush);color:var(--rose);font-size:23px}.lr-journey-intro__badge div{display:flex;flex-direction:column}.lr-journey-intro__badge strong{color:var(--ink);font-family:var(--serif);font-size:16px}.lr-journey-intro__badge small{margin-top:3px;color:#758782;font-size:9px}
        .lr-question-screen{min-height:calc(100vh - 76px);background:radial-gradient(circle at 96% 5%,rgba(211,238,226,.65),transparent 27%),#fffaf5}.lr-question-progress{position:sticky;z-index:19;top:76px;height:5px;background:#e7eeea}.lr-question-progress span{display:block;height:100%;border-radius:0 99px 99px 0;background:linear-gradient(90deg,var(--rose),#f3a093);transition:width .35s ease}.lr-question-layout{display:grid;width:min(1180px,calc(100% - 48px));min-height:calc(100vh - 81px);grid-template-columns:.78fr 1.22fr;gap:72px;align-items:center;margin:auto;padding:52px 0 65px}.lr-question-scene{position:relative;height:610px;overflow:hidden;border:9px solid #fff;border-radius:135px 135px 25px 25px;background:#e7eee9;box-shadow:0 28px 70px rgba(24,63,57,.13)}.lr-question-scene:after{position:absolute;inset:0;background:linear-gradient(to top,rgba(14,48,41,.75),transparent 56%);content:''}.lr-question-scene>img{width:100%;height:100%;object-fit:cover}.lr-question-scene>div{position:absolute;z-index:2;right:28px;bottom:30px;left:28px;color:#fff}.lr-question-scene>div span{font-size:10px;font-weight:850;letter-spacing:.15em;text-transform:uppercase}.lr-question-scene>div p{max-width:330px;margin:9px 0 0;font-family:var(--serif);font-size:23px;line-height:1.25}.lr-question-card{animation:lr-question-in .28s ease}.lr-question-card__meta{display:flex;align-items:center;justify-content:space-between;margin-bottom:21px}.lr-question-card__meta span{display:grid;width:46px;height:46px;place-items:center;border-radius:50%;background:var(--blush);color:var(--rose);font-size:11px;font-weight:900}.lr-question-card__meta small{color:#7d8c88;font-size:10px;font-weight:750}.lr-question-card h2{max-width:690px;margin:16px 0 27px;color:var(--brown);font-family:var(--serif);font-size:clamp(38px,4vw,54px);font-weight:500;letter-spacing:-.045em;line-height:1.05}.lr-question-options{display:grid;gap:12px}.lr-question-options button{display:grid;width:100%;min-height:78px;grid-template-columns:46px 1fr 30px;gap:16px;align-items:center;padding:12px 17px;border:1px solid rgba(33,77,69,.14);border-radius:18px;background:#fff;color:var(--ink-deep);text-align:left;box-shadow:0 7px 25px rgba(31,72,64,.04);transition:.22s}.lr-question-options button i{display:grid;width:46px;height:46px;place-items:center;border-radius:14px;background:var(--mint);color:#338c77;font-style:normal;font-size:11px;font-weight:900}.lr-question-options button span{font-size:14px;font-weight:720;line-height:1.35}.lr-question-options button svg{width:22px;height:22px;color:var(--rose)}.lr-question-card__bottom{display:flex;align-items:center;justify-content:space-between;margin-top:21px}.lr-question-card__bottom>span{color:#87948f;font-size:10px}.lr-question-back{display:flex;align-items:center;gap:7px;padding:8px 4px;border:0;background:transparent;color:#70817c;font-size:11px;font-weight:700}.lr-question-back svg{width:17px;height:17px}
        .lr-analyzing{display:flex;width:min(760px,calc(100% - 40px));min-height:calc(100vh - 76px);flex-direction:column;align-items:center;justify-content:center;margin:auto;padding:70px 0;text-align:center}.lr-analyzing__image{position:relative;width:190px;height:190px;margin-bottom:34px;padding:8px;border:1px solid rgba(33,77,69,.1);border-radius:50%;background:#fff;box-shadow:0 22px 60px rgba(24,63,57,.13)}.lr-analyzing__image:before{position:absolute;inset:-14px;border:1px solid rgba(231,111,114,.26);border-radius:50%;content:'';animation:lr-pulse 1.6s infinite}.lr-analyzing__image img{width:100%;height:100%;border-radius:50%;object-fit:cover}.lr-analyzing__image span{position:absolute;right:-4px;bottom:5px;display:grid;width:52px;height:52px;place-items:center;border:6px solid #fff;border-radius:50%;background:var(--rose);color:#fff}.lr-analyzing h2{margin:18px 0 24px;color:var(--brown);font-family:var(--serif);font-size:clamp(40px,5vw,58px);font-weight:500;letter-spacing:-.045em;line-height:1.05}.lr-analyzing h2 em{color:var(--rose);font-weight:500}.lr-analyzing__bar{width:min(430px,100%);height:7px;overflow:hidden;border-radius:99px;background:#e3ede8}.lr-analyzing__bar span{display:block;width:100%;height:100%;border-radius:99px;background:linear-gradient(90deg,var(--rose),#f1a293,var(--sage));animation:lr-loading 2.5s ease}.lr-analyzing__steps{display:flex;flex-wrap:wrap;justify-content:center;gap:8px 18px;margin-top:21px;color:#668079;font-size:10px}.lr-analyzing__steps .active{color:var(--rose);font-weight:800}
        .lr-offer{background:#fffaf5}.lr-offer-hero{display:grid;width:min(1180px,calc(100% - 48px));grid-template-columns:1.08fr .82fr;gap:70px;align-items:start;margin:auto;padding:78px 0 100px}.lr-offer-ready{display:inline-flex;align-items:center;gap:8px;padding:8px 12px;border-radius:99px;background:var(--mint);color:#337c6b;font-size:10px;font-weight:850;letter-spacing:.08em;text-transform:uppercase}.lr-offer-hero__copy h1{margin:20px 0;color:var(--brown);font-family:var(--serif);font-size:clamp(49px,5vw,69px);font-weight:500;letter-spacing:-.052em;line-height:.99}.lr-offer-hero__copy h1 em{color:var(--rose);font-weight:500}.lr-offer-hero__copy>p{max-width:640px;margin:0 0 27px;color:#647571;font-size:15px;line-height:1.75}.lr-result-teaser{display:flex;align-items:flex-start;gap:17px;max-width:650px;padding:22px;border:1px solid rgba(33,77,69,.1);border-radius:20px;background:#fff;box-shadow:0 15px 40px rgba(24,63,57,.07)}.lr-result-teaser__icon{display:grid;width:54px;height:54px;flex:0 0 54px;place-items:center;border-radius:16px}.lr-result-teaser__icon svg{width:26px;height:26px;color:var(--ink)}.lr-result-teaser>div{display:flex;flex-direction:column}.lr-result-teaser small{color:#7c8a86;font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.lr-result-teaser strong{margin:4px 0;color:var(--ink);font-family:var(--serif);font-size:23px}.lr-result-teaser p{margin:0;color:#6f7e7a;font-size:11px;line-height:1.6}.lr-secondary-teaser{display:flex;align-items:center;gap:10px;margin:13px 4px 0;color:#72827e;font-size:11px}.lr-secondary-teaser span{display:grid;width:27px;height:27px;place-items:center;border-radius:50%;font-family:var(--serif);font-weight:800}.lr-offer-card{position:sticky;top:104px;padding:31px;border:1px solid rgba(231,111,114,.25);border-radius:28px;background:#fff;box-shadow:0 28px 75px rgba(24,63,57,.14)}.lr-offer-card__popular{display:inline-block;padding:6px 9px;border-radius:7px;background:var(--blush);color:var(--rose);font-size:9px;font-weight:850;letter-spacing:.08em;text-transform:uppercase}.lr-offer-card h2{margin:15px 0 2px;color:var(--brown);font-family:var(--serif);font-size:30px}.lr-offer-card__price{display:flex;align-items:flex-end;gap:7px;margin:4px 0 20px}.lr-offer-card__price strong{color:var(--ink-deep);font-family:var(--serif);font-size:48px;letter-spacing:-.04em}.lr-offer-card__price span{padding-bottom:8px;color:#7b8985;font-size:10px}.lr-offer-card ul{display:grid;gap:11px;margin:0 0 22px;padding:19px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);list-style:none}.lr-offer-card li{display:flex;align-items:flex-start;gap:9px;color:#526863;font-size:11px;line-height:1.45}.lr-offer-card li:before{display:grid;width:19px;height:19px;flex:0 0 19px;place-items:center;border-radius:50%;background:var(--mint);color:#25866f;content:'✓';font-size:9px;font-weight:900}.lr-offer-card .lr-button{width:100%}.lr-offer-card .lr-button:disabled{cursor:wait;opacity:.65}.lr-checkout-error{margin:10px 0 0;color:#b44f52;text-align:center;font-size:10px}.lr-offer-card__terms{margin:15px 0 0;padding:13px;border-radius:12px;background:var(--mint-2);color:#657873;font-size:9px;line-height:1.55}.lr-offer-card__terms strong{display:block;margin-bottom:2px;color:var(--ink);font-size:10px}.lr-offer-card__trust{display:flex;justify-content:center;gap:13px;margin-top:13px;color:#74847f;font-size:9px;font-weight:750}.lr-offer-preview{padding:105px 0;background:#fff}.lr-offer-heading{width:min(760px,calc(100% - 40px));margin:0 auto 50px;text-align:center}.lr-offer-heading h2{margin:15px 0 12px;color:var(--brown);font-family:var(--serif);font-size:clamp(39px,4vw,54px);font-weight:500;letter-spacing:-.04em}.lr-offer-heading p{margin:0;color:#6c7c78;font-size:14px;line-height:1.7}.lr-report-mockup{display:grid;width:min(1040px,calc(100% - 48px));grid-template-columns:.82fr 1.18fr;gap:42px;align-items:center;margin:auto;padding:55px;border:1px solid rgba(33,77,69,.09);border-radius:34px;background:var(--mint-2);box-shadow:0 28px 70px rgba(24,63,57,.08)}.lr-report-chart{position:relative;display:grid;min-height:390px;place-items:center}.lr-report-chart__rings{display:grid;width:310px;height:310px;place-items:center;border:45px solid #d6ebe2;border-right-color:#f2d3cd;border-bottom-color:#f6dfce;border-radius:50%;transform:rotate(22deg)}.lr-report-chart__rings:after{width:120px;height:120px;border:28px solid #f5d7d2;border-top-color:#bdddd1;border-radius:50%;content:''}.lr-report-chart>span{position:absolute;padding:10px 14px;border-radius:99px;background:#fff;color:#637771;font-size:10px;font-weight:800;box-shadow:0 10px 25px rgba(24,63,57,.1)}.lr-report-copy h3{margin:14px 0;color:var(--brown);font-family:var(--serif);font-size:37px;font-weight:500}.lr-report-copy>p{margin:0 0 22px;color:#6d7d79;font-size:13px;line-height:1.7}.lr-report-list{display:grid;gap:12px}.lr-report-list span{display:flex;align-items:center;gap:10px;color:#526863;font-size:12px}.lr-report-list i{display:grid;width:23px;height:23px;place-items:center;border-radius:50%;background:#dcefe8;color:#27836e;font-style:normal;font-size:10px;font-weight:900}.lr-offer-value{padding:100px 0;background:var(--ink-deep);color:#fff;text-align:center}.lr-offer-value>div{width:min(780px,calc(100% - 40px));margin:auto}.lr-offer-value .lr-kicker{color:#a8c9c0}.lr-offer-value h2{margin:17px 0;color:#fff;font-family:var(--serif);font-size:clamp(42px,5vw,60px);font-weight:500;letter-spacing:-.04em;line-height:1.04}.lr-offer-value h2 em{color:#ffc2b7;font-weight:500}.lr-offer-value p{max-width:650px;margin:0 auto 28px;color:#b5cac4;font-size:14px;line-height:1.7}.lr-offer-value .lr-offer-card__terms{max-width:560px;margin:17px auto 0;background:rgba(255,255,255,.08);color:#c1d2ce}.lr-offer-value .lr-offer-card__terms strong{color:#fff}
        .lr-result-teaser{position:relative}.lr-result-teaser>.lr-result-teaser__icons{display:flex;flex:0 0 76px;flex-direction:row}.lr-result-teaser__icons span{display:grid;width:51px;height:51px;place-items:center;border:3px solid #fff;border-radius:15px}.lr-result-teaser__icons span+span{margin:17px 0 0 -25px}.lr-result-teaser__icons svg{width:23px;height:23px}.lr-result-teaser>div:nth-child(2){display:flex;min-width:0;flex-direction:column;padding-right:100px}.lr-result-teaser__lock{position:absolute;right:18px;top:18px;max-width:92px;padding:7px 8px;border-radius:8px;background:var(--blush);color:#9d5d58;font-size:8px;font-weight:800;line-height:1.35;text-align:center}.lr-result-kindness{display:flex;max-width:640px;align-items:flex-start;gap:10px;margin:15px 2px 0!important;padding:13px 15px;border-radius:14px;background:rgba(234,245,239,.8);color:#5d736d!important;font-size:10px!important;line-height:1.6!important}.lr-result-kindness span{color:var(--rose);font-size:18px;line-height:1}.lr-offer-card__eyebrow{display:inline-block;padding:6px 9px;border-radius:7px;background:var(--blush);color:var(--rose);font-size:9px;font-weight:850;letter-spacing:.08em;text-transform:uppercase}.lr-offer-price{display:flex;align-items:flex-end;gap:8px;margin:15px 0 4px}.lr-offer-price strong{color:var(--ink-deep);font-family:var(--serif);font-size:48px;letter-spacing:-.04em}.lr-offer-price span{padding-bottom:8px;color:#7b8985;font-size:10px}.lr-offer-card>p{margin:0;color:#6c7b77;font-size:11px;line-height:1.55}.lr-offer-card__secure{margin:13px 0 0;color:#668078;text-align:center;font-size:9px;font-weight:750}.lr-report-mockup__page{min-height:410px;padding:38px;border:1px solid rgba(33,77,69,.1);border-radius:22px;background:#fff;box-shadow:0 20px 50px rgba(24,63,57,.09);transform:rotate(-1.2deg)}.lr-report-mockup__page .lr-brand{font-size:18px}.lr-report-mockup__page .lr-brand__mark{width:30px;height:30px;flex-basis:30px}.lr-report-mockup__page>span{display:block;margin:55px 0 10px;color:var(--sage);font-size:9px;font-weight:850;letter-spacing:.17em}.lr-report-mockup__page h3{margin:0 0 15px;color:var(--brown);font-family:var(--serif);font-size:34px;font-weight:500}.lr-report-mockup__page p{margin:0;color:#6c7b77;font-size:12px;line-height:1.65}.lr-report-bars{display:grid;gap:8px;margin-top:30px}.lr-report-bars i{display:block;height:9px;border-radius:99px;background:linear-gradient(90deg,var(--rose),#f2aaa0)}.lr-report-mockup__list{display:grid;gap:14px}.lr-report-mockup__list>strong{margin-bottom:5px;color:var(--brown);font-family:var(--serif);font-size:30px}.lr-report-mockup__list>span{display:flex;align-items:flex-start;gap:9px;color:#526863;font-size:12px;line-height:1.45}.lr-offer-value>.lr-final-cta__heart{margin:0 auto 20px}.lr-offer-value>h2{max-width:800px;margin-left:auto;margin-right:auto}.lr-offer-value>small{display:block;max-width:620px;margin:17px auto 0;color:#9ab3ad;font-size:9px;line-height:1.5}.lr-offer-value__button{width:auto;max-width:calc(100% - 40px);min-width:0;margin:0 auto;padding:0 24px;white-space:nowrap}.lr-offer-value .lr-button:disabled{cursor:wait;opacity:.65}
        @keyframes lr-journey-in{from{opacity:0}to{opacity:1}}@keyframes lr-question-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes lr-pulse{0%,100%{opacity:.35;transform:scale(.98)}50%{opacity:1;transform:scale(1.05)}}@keyframes lr-loading{from{width:4%}to{width:100%}}
        @media(max-width:980px){.lr-journey-intro{grid-template-columns:1fr;gap:45px;padding-top:55px}.lr-journey-intro__copy{text-align:center}.lr-journey-intro__copy>p{margin-left:auto;margin-right:auto}.lr-journey-intro__checks{width:min(500px,100%);margin-left:auto;margin-right:auto;text-align:left}.lr-journey-intro__time{text-align:center}.lr-journey-intro__visual{width:min(590px,100%);height:590px;margin:auto}.lr-question-layout{grid-template-columns:1fr;gap:35px;padding-top:34px}.lr-question-scene{height:230px;border-radius:90px 24px 24px 24px}.lr-question-scene>div p{font-size:19px}.lr-question-card{width:min(760px,100%);margin:auto;padding-bottom:20px}.lr-offer-hero{grid-template-columns:1fr;gap:40px}.lr-offer-card{position:static;width:min(590px,100%);margin:auto}.lr-offer-hero__copy{text-align:center}.lr-offer-hero__copy>p{margin-left:auto;margin-right:auto}.lr-result-teaser{margin-left:auto;margin-right:auto;text-align:left}.lr-secondary-teaser{justify-content:center}.lr-report-mockup{grid-template-columns:1fr}.lr-report-copy{text-align:center}.lr-report-list{width:min(520px,100%);margin:auto;text-align:left}}
        @media(max-width:680px){.lr-journey__header{height:66px;padding:0 17px}.lr-journey__header .lr-brand{font-size:17px}.lr-journey__header .lr-brand__mark{width:29px;height:29px;flex-basis:29px}.lr-journey__close{width:37px;height:37px;font-size:21px}.lr-journey__count{font-size:8px}.lr-journey-intro{width:calc(100% - 34px);min-height:calc(100vh - 66px);padding:42px 0 55px}.lr-journey-intro__copy h2{font-size:43px}.lr-journey-intro__copy>p{font-size:14px}.lr-journey-intro__checks{gap:15px}.lr-journey-intro__checks b{font-size:11px}.lr-journey-intro__visual{height:450px}.lr-journey-intro__visual>img{border-width:8px;border-radius:115px 115px 24px 24px}.lr-journey-intro__quote{right:-6px;top:-30px;width:188px;padding:12px;font-size:13px}.lr-journey-intro__badge{bottom:25px;left:-4px;width:220px;padding:11px}.lr-journey-intro__badge>span{width:38px;height:38px;flex-basis:38px}.lr-journey-intro__badge strong{font-size:14px}.lr-question-progress{top:66px}.lr-question-layout{width:calc(100% - 34px);min-height:calc(100vh - 71px);gap:25px;padding:24px 0 45px}.lr-question-scene{height:160px;border-width:6px;border-radius:55px 18px 18px 18px}.lr-question-scene>div{right:20px;bottom:18px;left:20px}.lr-question-scene>div p{margin-top:4px;font-size:15px}.lr-question-card h2{margin:13px 0 22px;font-size:34px}.lr-question-card__meta{margin-bottom:14px}.lr-question-card__meta span{width:40px;height:40px}.lr-question-options button{min-height:70px;grid-template-columns:40px 1fr 22px;gap:11px;padding:10px 12px}.lr-question-options button i{width:40px;height:40px}.lr-question-options button span{font-size:12px}.lr-question-card__bottom>span{display:none}.lr-analyzing{min-height:calc(100vh - 66px)}.lr-analyzing h2{font-size:39px}.lr-analyzing__image{width:155px;height:155px}.lr-analyzing__steps{flex-direction:column}.lr-offer-hero{width:calc(100% - 34px);padding:48px 0 70px}.lr-offer-hero__copy h1{font-size:45px}.lr-offer-hero__copy>p{font-size:14px}.lr-result-teaser{flex-wrap:wrap;padding:17px}.lr-result-teaser__icons{flex-basis:58px}.lr-result-teaser__icons span{width:42px;height:42px}.lr-result-teaser__icons span+span{margin-left:-25px}.lr-result-teaser>div:nth-child(2){width:calc(100% - 76px);padding-right:0}.lr-result-teaser strong{font-size:18px}.lr-result-teaser__lock{position:static;width:100%;max-width:none;margin-top:8px}.lr-offer-card{padding:24px 20px;border-radius:23px}.lr-offer-price strong{font-size:43px}.lr-offer-preview{padding:75px 0}.lr-report-mockup{width:calc(100% - 34px);gap:25px;padding:27px 19px;border-radius:24px}.lr-report-mockup__page{min-height:360px;padding:28px}.lr-report-mockup__page>span{margin-top:42px}.lr-report-mockup__list>strong{font-size:27px}.lr-offer-value{padding:80px 0}.lr-offer-value h2{font-size:40px}.lr-offer-value__button{width:auto;max-width:calc(100% - 48px);min-height:54px;padding:0 20px;font-size:14px;gap:9px;border-radius:14px}.lr-offer-value__button svg{width:17px;height:17px;flex:0 0 17px}.lr-mobile-cta{z-index:60}}
        /* A focused, image-free question layout at every screen size. */
        .lr-question-layout{display:flex;width:min(800px,calc(100% - 48px));min-height:calc(100svh - 81px);align-items:center;justify-content:center;padding:54px 0 70px}
        .lr-question-card{width:100%;margin:0;padding:0;text-align:center}
        .lr-question-card__meta{justify-content:center;gap:12px;margin-bottom:30px}
        .lr-question-card__meta span{width:auto;height:auto;padding:9px 14px;border-radius:99px;font-size:11px;white-space:nowrap}
        .lr-question-card__meta small{font-size:11px;white-space:nowrap}
        .lr-question-card h2{max-width:760px;margin:18px auto 34px;line-height:1.14}
        .lr-question-options{width:100%;max-width:760px;margin:auto}
        .lr-question-card__bottom{max-width:760px;margin:26px auto 0}
        .lr-question-back{min-height:44px;gap:10px;padding:0 17px;border:1px solid rgba(33,77,69,.2);border-radius:12px;background:#fff;color:var(--ink);font-size:13px;font-weight:750;box-shadow:0 5px 18px rgba(31,72,64,.05);transition:background .2s,border-color .2s}
        .lr-question-back:hover{border-color:var(--rose);background:#fff8f5}
        .lr-question-back:focus-visible,.lr-question-options button:focus-visible{outline:3px solid var(--rose);outline-offset:3px}

        /* IMPORTANT: touch devices must never keep the desktop hover/active
           styling after a tap. This is what prevents the previous answer
           from appearing red on the next question on iPhone/Android. */
        .lr-question-options button{
          -webkit-tap-highlight-color:transparent;
          touch-action:manipulation;
        }
        @media (hover:none) and (pointer:coarse){
          .lr-question-options button:hover,
          .lr-question-options button:active,
          .lr-question-options button:focus,
          .lr-question-options button:focus-visible{
            border-color:rgba(33,77,69,.14);
            background:#fff;
            box-shadow:0 7px 25px rgba(31,72,64,.04);
            transform:none;
            outline:none;
          }
        }
        @media (hover:hover) and (pointer:fine){
          .lr-question-options button:hover{
            border-color:var(--rose);
            background:#fff8f5;
            box-shadow:0 15px 34px rgba(33,77,69,.09);
            transform:translateY(-2px);
          }
        }
        @media(max-width:680px){
          .lr-journey__header{gap:12px;justify-content:space-between;padding:0 16px}
          .lr-journey__header .lr-brand{min-width:0;font-size:clamp(16px,4.4vw,19px);white-space:nowrap}
          .lr-journey__header .lr-brand__word{overflow:hidden;text-overflow:ellipsis}
          .lr-journey__close{flex:0 0 40px;width:40px;height:40px}
          .lr-question-layout{width:calc(100% - 36px);min-height:calc(100svh - 71px);padding:35px 0 55px}
          .lr-question-card__meta{gap:10px;margin-bottom:26px}
          .lr-question-card__meta span{width:auto;height:auto;font-size:10px}
          .lr-question-card__meta small{font-size:10px}
          .lr-question-card h2{margin:16px auto 28px;font-size:clamp(29px,8vw,38px)}
          .lr-question-options button{min-height:72px;grid-template-columns:38px minmax(0,1fr) 20px;gap:12px;padding:12px 14px}
          .lr-question-options button i{width:38px;height:38px}
          .lr-question-options button span{font-size:14px}
          .lr-question-card__bottom{justify-content:flex-start;margin-top:24px}
        }
        @media(max-width:360px){.lr-journey__header .lr-brand{font-size:15px}.lr-journey__header .lr-brand__mark{width:25px;height:25px;flex-basis:25px}.lr-question-card__meta{flex-wrap:wrap}.lr-question-options button span{font-size:13px}}
        /* Focused conversion payment summary inspired by the provided reference, without changing the rest of the site. */
        .lr-payment-hero{width:min(1100px,calc(100% - 48px));margin:0 auto;padding:48px 0 88px}
        .lr-payment-heading{max-width:720px;margin:0 auto 38px;text-align:center}
        .lr-payment-heading h1{margin:14px 0 10px;color:#222b2a;font-family:var(--serif);font-size:clamp(41px,4.7vw,62px);font-weight:600;line-height:1.04;letter-spacing:-.04em}
        .lr-payment-heading p{max-width:600px;margin:0 auto;color:#66736f;font-size:14px;line-height:1.6}
        .lr-payment-grid{display:grid;grid-template-columns:minmax(0,.84fr) minmax(0,1.16fr);gap:34px;align-items:start}
        .lr-payment-left{min-width:0}
        .lr-payment-plan{padding:27px 28px 25px;border:1px solid #efcfc4;border-radius:9px;background:#fff0ea;box-shadow:none}
        .lr-payment-plan__tag{display:inline-flex;align-items:center;padding:6px 9px;border-radius:5px;background:#eff8f3;color:#176f52;font-size:9px;font-weight:850;letter-spacing:.05em}
        .lr-payment-plan__top{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin:19px 0 18px}
        .lr-payment-plan__eyebrow{color:#53635e;font-size:11px;font-weight:750}
        .lr-payment-plan h2{margin:6px 0 0;color:#22302d;font-family:var(--serif);font-size:28px;font-weight:600;letter-spacing:-.025em;line-height:1.08}
        .lr-payment-plan__price{display:flex;flex:0 0 auto;flex-direction:column;align-items:flex-end;gap:2px;padding-top:3px}
        .lr-payment-plan__price strong{color:#202827;font-family:var(--serif);font-size:34px;line-height:1}
        .lr-payment-plan__price span{color:#6c7472;font-size:10px}
        .lr-payment-result{display:flex;align-items:center;gap:12px;margin:0 0 18px;padding:14px 0;border:0;border-top:1px solid rgba(72,92,85,.11);border-bottom:1px solid rgba(72,92,85,.11);border-radius:0;background:transparent}
        .lr-payment-result__icon{display:grid;width:42px;height:42px;flex:0 0 42px;place-items:center;border-radius:50%;color:var(--ink)}
        .lr-payment-result__icon svg{width:20px;height:20px}
        .lr-payment-result>div{display:flex;min-width:0;flex-direction:column;gap:2px}
        .lr-payment-result small{color:#72817c;font-size:9px}
        .lr-payment-result strong{color:#243431;font-family:var(--serif);font-size:17px}
        .lr-payment-result div span{color:#73817d;font-size:10px}
        .lr-payment-button{width:100%;min-height:58px;border-radius:7px;background:#df4c50;box-shadow:none;font-size:16px;font-weight:800}
        .lr-payment-button:hover{background:#cf4145;box-shadow:0 10px 25px rgba(205,65,69,.2)}
        .lr-payment-button:focus-visible,.lr-payment-trustpilot:focus-visible,.lr-payment-timer-button:focus-visible{outline:3px solid var(--rose);outline-offset:3px}
        .lr-payment-secure{margin:11px 0 0;color:#6a7672;text-align:center;font-size:10px}
        .lr-payment-guarantee{display:flex;align-items:center;justify-content:center;gap:10px;width:calc(100% - 56px);min-height:43px;margin:16px auto 0;padding:9px 14px;border-radius:8px;background:#fff0ea;color:#176f52}
        .lr-payment-guarantee__icon{font-size:20px;line-height:1}.lr-payment-guarantee>div{display:flex;flex-direction:column;line-height:1.18}.lr-payment-guarantee strong{font-family:var(--serif);font-size:14px}.lr-payment-guarantee small{margin-top:2px;color:#6b7773;font-size:9px}
        .lr-payment-timer-card{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:17px;padding:8px 12px;border:1px solid #efcfc4;border-radius:8px;background:#fff0ea;color:#5e6563;font-size:10px}
        .lr-payment-timer-button{display:inline-flex;align-items:center;gap:7px;min-width:82px;min-height:31px;justify-content:center;padding:0 10px;border:1px solid rgba(220,76,80,.16);border-radius:7px;background:#fff;color:#202827;font-variant-numeric:tabular-nums}
        .lr-payment-timer-dot{width:7px;height:7px;border-radius:50%;background:#df4c50;box-shadow:0 0 0 4px rgba(223,76,80,.1)}
        .lr-payment-timer-button strong{font-size:12px;letter-spacing:.02em}
        .lr-payment-trustpilot{display:flex;align-items:center;justify-content:center;gap:9px;margin:23px auto 0;color:#26352f;text-decoration:none;font-size:10px;font-weight:650}
        .lr-payment-trustpilot__label{font-weight:700}.lr-payment-trustpilot__stars{display:flex;gap:2px}.lr-payment-trustpilot__stars i{display:grid;width:21px;height:21px;place-items:center;background:#00b67a;color:#fff;font-style:normal;font-size:13px}.lr-payment-trustpilot__brand{display:flex;align-items:center;gap:4px;font-size:11px;font-weight:800}.lr-payment-trustpilot__brand b{color:#00b67a;font-size:16px}
        .lr-payment-included{position:relative;overflow:hidden;padding:38px 42px 35px;border:1px solid rgba(20,131,94,.08);border-radius:0 64px 0 64px;background:linear-gradient(145deg,#e7f4ee 0%,#dff0e9 100%);box-shadow:0 24px 60px rgba(31,72,64,.08)}
        .lr-payment-included:before{position:absolute;top:-82px;right:-74px;width:190px;height:190px;border-radius:50%;background:rgba(255,255,255,.35);content:""}
        .lr-payment-included__eyebrow{position:relative;z-index:1;color:#0b7758;font-size:10px;font-weight:900;letter-spacing:.23em}
        .lr-payment-included h2{position:relative;z-index:1;max-width:520px;margin:11px 0 27px;color:#174f40;font-family:var(--serif);font-size:35px;font-weight:600;letter-spacing:-.03em;line-height:1.08}
        .lr-payment-included__list{position:relative;z-index:1;display:grid;gap:14px;margin:0;padding:0;list-style:none}
        .lr-payment-included li{display:grid;grid-template-columns:20px minmax(0,1fr);gap:12px;align-items:start;color:#29473f;font-size:12.5px;line-height:1.45}
        .lr-payment-included li>span{display:grid;width:18px;height:18px;margin-top:1px;place-items:center;border-radius:50%;background:#16865f;color:#fff;box-shadow:0 4px 10px rgba(22,134,95,.18);font-size:10px;font-weight:900}
        .lr-payment-included li p{margin:0}
        .lr-payment-included__guarantee strong{color:#124d3b;font-weight:900}
        .lr-payment-included__divider{position:relative;z-index:1;height:1px;margin:26px 0 20px;background:rgba(23,95,73,.13)}
        .lr-payment-included__divider--tight{margin:22px 0 20px}
        .lr-payment-inside-report{position:relative;z-index:1}
        .lr-payment-inside-report>strong{display:block;margin-bottom:13px;color:#155c46;font-size:12px;font-weight:900}
        .lr-payment-inside-report ul{display:grid;gap:11px;margin:0;padding:0;list-style:none}
        .lr-payment-inside-report li{display:grid;grid-template-columns:20px minmax(0,1fr);gap:10px;align-items:start;color:#29473f;font-size:11.8px;line-height:1.42}
        .lr-payment-inside-report li>span{display:grid;width:18px;height:18px;margin-top:0;place-items:center;border-radius:50%;background:#16865f;color:#fff;font-size:10px;font-weight:900}
        .lr-payment-inside-report li p{margin:0}
        .lr-payment-subscription{position:relative;z-index:1;margin:0;padding:18px 19px 17px;border:1px solid rgba(18,111,81,.14);border-radius:14px;background:rgba(255,255,255,.58);box-shadow:0 10px 24px rgba(31,72,64,.04)}
        .lr-payment-subscription__head{display:flex;align-items:center;gap:9px;margin-bottom:8px}
        .lr-payment-subscription__icon{display:grid;width:26px;height:26px;flex:0 0 26px;place-items:center;border-radius:8px;background:#d7eee4;color:#126f51;font-size:14px;font-weight:900}
        .lr-payment-subscription strong{display:block;color:#155c46;font-size:11px;font-weight:900;letter-spacing:.01em}
        .lr-payment-subscription p{margin:0;color:#36574d;font-size:11.5px;line-height:1.58}
        .lr-payment-moneyback{position:relative;z-index:1;display:flex;align-items:center;gap:10px;margin-top:16px;padding:0 2px;color:#136f51}
        .lr-payment-moneyback>span{display:grid;width:23px;height:23px;flex:0 0 23px;place-items:center;border-radius:50%;background:#16865f;color:#fff;font-size:11px;font-weight:900}
        .lr-payment-moneyback>div{display:flex;flex-direction:column;gap:2px}
        .lr-payment-moneyback strong{font-size:11.5px;font-weight:900}
        .lr-payment-moneyback small{color:#5f746d;font-size:9.5px;line-height:1.3}
        @media(max-width:900px){.lr-payment-grid{grid-template-columns:1fr;gap:25px}.lr-payment-left,.lr-payment-included{width:min(620px,100%);margin:0 auto}.lr-payment-included{border-radius:0 58px 0 58px}}
        @media(max-width:680px){.lr-payment-hero{width:calc(100% - 28px);padding:34px 0 66px}.lr-payment-heading{margin-bottom:25px}.lr-payment-heading h1{font-size:clamp(36px,10vw,47px)}.lr-payment-heading p{font-size:12px}.lr-payment-plan{padding:21px 18px 20px}.lr-payment-plan__top{gap:14px}.lr-payment-plan h2{font-size:25px}.lr-payment-plan__price strong{font-size:30px}.lr-payment-result strong{font-size:16px}.lr-payment-button{min-height:56px;font-size:15px}.lr-payment-guarantee{width:calc(100% - 28px)}.lr-payment-timer-card{padding:8px 10px}.lr-payment-included{padding:29px 23px 27px;border-radius:0 42px 0 42px}.lr-payment-included h2{margin-bottom:23px;font-size:29px}.lr-payment-included li{font-size:12px}.lr-payment-included__divider{margin:23px 0 18px}.lr-payment-subscription{padding:16px}.lr-payment-subscription p{font-size:11px}.lr-payment-trustpilot{flex-wrap:wrap}}
        @media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}.lr-floating-card{animation:none!important}}

        /* Warm editorial offer redesign */
        /* Conversion refinement: readable couple portrait, checkout first on mobile. */
        .new-offer__mobile-result{display:none}
        .new-offer__photo{height:490px;border-radius:145px 145px 24px 24px;overflow:hidden}
        .new-offer__photo img{object-fit:cover;object-position:center 37%;filter:none;transform:scale(.94);border-radius:130px 130px 15px 15px}
        .new-offer__photo-label{padding:22px 14px 15px;background:linear-gradient(transparent,rgba(23,59,53,.65));font-size:17px}
        .new-offer__profile{margin:-14px 20px 0;z-index:1}
        .new-offer__button:focus-visible{outline:3px solid #214d45;outline-offset:3px}
        @media(max-width:850px){.new-offer__grid{display:flex;flex-direction:column;align-items:stretch;gap:28px}.new-offer__checkout{order:0}.new-offer__story{order:1}.new-offer__intro{margin-bottom:20px}.new-offer__mobile-result{display:flex;flex-direction:column;gap:5px;margin-bottom:18px;padding:13px 15px;border:1px solid #dcece2;background:#f0f8f2;border-radius:12px}.new-offer__mobile-result span{color:#16815f;font-size:10px;font-weight:850;letter-spacing:.1em}.new-offer__mobile-result strong{font:600 23px var(--serif);color:#214d45}.new-offer__mobile-result small{font-size:11px;color:#61786b}}
        @media(max-width:520px){.new-offer{padding:20px 12px 64px}.new-offer__intro h1{font-size:clamp(31px,8.5vw,39px);margin:10px 0}.new-offer__intro p{font-size:12px;margin:0}.new-offer__eyebrow{font-size:9px}.new-offer__checkout{padding:21px 17px}.new-offer__checkout h2{font-size:30px;margin:12px 0 8px}.new-offer__sub{margin:0 0 14px}.new-offer__includes{gap:9px;padding-top:13px}.new-offer__includes>strong{font-size:17px}.new-offer__includes>div{font-size:12px}.new-offer__price{margin:17px 0 12px;padding:12px 14px}.new-offer__price strong{font-size:34px}.new-offer__button{min-height:58px;font-size:14px}.new-offer__terms{font-size:11px}.new-offer__photo{height:360px;border-radius:115px 115px 20px 20px}.new-offer__photo img{object-position:center 34%;transform:scale(.96)}.new-offer__profile{margin:-8px 8px 0}.new-offer__closing{margin-top:45px}}
        .new-offer{min-height:100vh;background:radial-gradient(circle at 0 25%,#ffebe6 0,transparent 32%),radial-gradient(circle at 100% 40%,#e5f4ed 0,transparent 35%),#fffbf7;padding:54px 24px 95px}.new-offer__shell{max-width:1160px;margin:auto}.new-offer__intro{text-align:center;max-width:750px;margin:0 auto 45px}.new-offer__eyebrow,.new-offer__badge{display:inline-block;color:#167a60;background:#e8f5ee;border-radius:99px;padding:9px 14px;font-size:10px;font-weight:850;letter-spacing:.12em}.new-offer__intro h1{font:500 clamp(43px,5vw,67px)/1.04 var(--serif);letter-spacing:-.055em;color:#234b41;margin:18px 0}.new-offer em{color:#e76f72;font-style:italic}.new-offer__intro p{color:#64756e;font-size:15px;line-height:1.7}.new-offer__grid{display:grid;grid-template-columns:1fr .95fr;gap:48px;align-items:center}.new-offer__story{position:relative;min-width:0}.new-offer__photo{height:420px;position:relative;border:9px solid white;border-radius:190px 190px 28px 28px;overflow:hidden;box-shadow:0 26px 65px #244c4020}.new-offer__photo img{height:100%;width:100%;object-fit:cover}.new-offer__photo-label{position:absolute;bottom:0;left:0;right:0;padding:34px 18px 18px;background:linear-gradient(transparent,#173b35b8);color:white;text-align:center;font:italic 20px var(--serif)}.new-offer__profile{position:relative;display:flex;gap:15px;align-items:flex-start;margin:-35px 20px 0;padding:23px;background:#fff;border:1px solid #e8eee8;border-radius:20px;box-shadow:0 18px 45px #244c401c}.new-offer__profile-icon{width:46px;height:46px;flex-shrink:0;display:grid;place-items:center;border-radius:14px}.new-offer__profile-icon svg{width:24px;height:24px}.new-offer__profile small,.new-offer__price small{font-size:10px;font-weight:850;letter-spacing:.09em;color:#3d8c75}.new-offer__profile h2{font:500 28px var(--serif);margin:7px 0;color:#214d45}.new-offer__profile p{font-size:13px;line-height:1.65;color:#62736d;margin:0 0 12px}.new-offer__profile div>span{font-size:12px;color:#63756f}.new-offer__profile div>span strong{color:#214d45}.new-offer__note{text-align:center;font-size:12px;color:#788680;line-height:1.6;margin:16px 30px}.new-offer__checkout{background:white;padding:37px;border:1px solid #f0e6df;border-radius:25px;box-shadow:0 24px 70px #294a3814}.new-offer__checkout h2{font:500 clamp(32px,3vw,42px)/1.1 var(--serif);letter-spacing:-.035em;color:#214d45;margin:18px 0 10px}.new-offer__sub{font-size:13px;color:#6b7974;line-height:1.6;margin-bottom:24px}.new-offer__includes{display:grid;gap:13px;border-top:1px solid #e9efea;padding-top:20px}.new-offer__includes>strong{font:600 19px var(--serif);margin-bottom:4px;color:#244d43}.new-offer__includes>div{display:flex;gap:12px;align-items:center;font-size:13px;color:#3d5b51}.new-offer__includes>div span{width:21px;height:21px;flex-shrink:0;display:grid;place-items:center;border-radius:50%;background:#e2f3e9;color:#18815d;font-weight:900}.new-offer__price{display:flex;align-items:center;justify-content:space-between;gap:10px;background:#fff3ee;border:1px solid #f6dfd6;border-radius:14px;padding:17px 20px;margin:25px 0 15px}.new-offer__price strong{display:block;font:600 38px var(--serif);color:#263b35;margin-top:5px}.new-offer__price strong span{font:400 13px var(--sans);color:#6f7974}.new-offer__price>span{font-size:12px;line-height:1.5;text-align:right;color:#68776e}.new-offer__button{width:100%;min-height:60px;border-radius:12px;font-size:15px}.new-offer__terms{font-size:11px;line-height:1.65;color:#697772;margin:15px 0}.new-offer__terms strong{color:#3d5c51}.new-offer__trust{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;border-top:1px solid #edf0eb;padding-top:17px;font-size:11px;color:#537768}.new-offer__closing{text-align:center;margin:85px auto 0;max-width:680px}.new-offer__closing>span{font-size:10px;font-weight:850;letter-spacing:.13em;color:#438b72}.new-offer__closing h2{font:500 clamp(32px,4vw,49px)/1.1 var(--serif);margin:15px 0;color:#214d45}.new-offer__closing p{font-size:14px;color:#6c7d75;line-height:1.7}@media(max-width:850px){.new-offer__grid{grid-template-columns:1fr;gap:26px}.new-offer__story,.new-offer__checkout{max-width:590px;width:100%;margin:auto}.new-offer__story{order:0}.new-offer__checkout{order:1}}@media(max-width:520px){.new-offer{padding:35px 14px 70px}.new-offer__intro{margin-bottom:25px}.new-offer__intro h1{font-size:41px}.new-offer__photo{height:310px;border-radius:125px 125px 22px 22px}.new-offer__profile{margin:-26px 9px 0;padding:17px;gap:10px}.new-offer__profile h2{font-size:23px}.new-offer__checkout{padding:23px 19px;border-radius:20px}.new-offer__checkout h2{font-size:34px}.new-offer__closing{margin-top:55px}}
        /* Final cascade: mobile checkout must precede the photo. */
        /* Final editorial offer: wide sculptural image, no overlapping result card. */
        .new-offer{padding-top:42px;padding-bottom:68px;background:radial-gradient(ellipse at 9% 25%,#ffebe5 0,transparent 40%),radial-gradient(ellipse at 95% 80%,#eaf5ee 0,transparent 42%),#fffbf7}
        .new-offer__shell{max-width:1240px}
        .new-offer__intro{margin-bottom:32px}
        .new-offer__grid{grid-template-columns:minmax(0,1.07fr) minmax(0,.93fr);gap:44px;align-items:stretch}
        .new-offer__story{display:flex;flex-direction:column;justify-content:center}
        .new-offer__photo{height:480px;border:8px solid white;border-radius:45% 45% 26px 26px / 32% 32% 26px 26px;box-shadow:0 26px 75px rgba(34,73,60,.16);background:#eee3da}
        .new-offer__photo img{width:100%;height:100%;object-fit:cover;object-position:center 44%;transform:none;border-radius:0;filter:none}
        .new-offer__photo-label{padding:52px 16px 23px;font-size:19px;background:linear-gradient(transparent,rgba(23,59,53,.68))}
        .new-offer__profile{z-index:1;margin:17px 0 0;padding:22px 24px;border-radius:19px;box-shadow:0 13px 35px rgba(34,73,60,.07)}
        .new-offer__note{margin:12px 15px 0}
        .new-offer__checkout{align-self:center;border-radius:26px;padding:34px;box-shadow:0 25px 75px rgba(48,66,51,.1)}
        .new-offer__closing{display:none!important}
        @media(max-width:850px){.new-offer__grid{display:flex!important;flex-direction:column!important;gap:25px}.new-offer__checkout{order:0!important;align-self:stretch}.new-offer__story{order:1!important}.new-offer__photo{height:440px;border-radius:43% 43% 22px 22px / 30% 30% 22px 22px}.new-offer__profile{margin:14px 0 0!important}}
        @media(max-width:520px){.new-offer{padding:22px 13px 48px}.new-offer__intro{margin-bottom:18px}.new-offer__checkout{padding:22px 18px!important}.new-offer__photo{height:345px!important;border-width:6px;border-radius:43% 43% 18px 18px / 28% 28% 18px 18px}.new-offer__photo img{transform:none!important;object-position:center 43%!important}.new-offer__photo-label{font-size:15px;padding:40px 12px 17px}.new-offer__profile{padding:18px 16px;margin:13px 0 0!important}.new-offer__note{margin:10px 5px 0}.new-offer__grid{gap:23px}}
        @media(max-width:850px){.new-offer__grid{display:flex!important;flex-direction:column!important}.new-offer__checkout{order:0!important}.new-offer__story{order:1!important}}
        /* Align the photograph with the payment card: both columns start at the same height; the image fills the available vertical space above its preview. */
        @media(min-width:851px){.new-offer__grid{align-items:stretch!important}.new-offer__story{justify-content:flex-start!important;align-self:stretch!important}.new-offer__photo{flex:1 1 auto!important;height:auto!important;min-height:540px!important}.new-offer__checkout{align-self:stretch!important}.new-offer__profile{flex:0 0 auto}}
        /* Desktop: photo exactly matches checkout card height; no rounded corners. */
        @media(min-width:851px){
          .new-offer__grid{align-items:stretch!important}
          .new-offer__story{position:relative!important;display:block!important;min-height:0!important;align-self:stretch!important}
          .new-offer__photo{position:absolute!important;inset:0 0 0 0!important;width:100%!important;height:100%!important;min-height:0!important;max-height:none!important;flex:none!important;border:0!important;border-radius:0!important;overflow:hidden!important}
          .new-offer__photo img{width:100%!important;height:100%!important;object-fit:cover!important;border-radius:0!important;transform:none!important}
          .new-offer__profile{position:absolute!important;top:calc(100% + 16px)!important;left:0;right:0;margin:0!important}
          .new-offer__note{position:absolute!important;top:calc(100% + 150px)!important;left:0;right:0}
        }
        @media(max-width:850px){.new-offer__photo{border-radius:0!important;border:0!important}.new-offer__photo img{border-radius:0!important}}
        @media(max-width:520px){.new-offer__photo{height:360px!important}.new-offer__photo img{object-position:center 34%;transform:scale(.96)}.new-offer__profile{margin:-8px 8px 0!important}.new-offer__checkout{padding:21px 17px!important}.new-offer__checkout h2{font-size:30px!important}.new-offer__intro h1{font-size:clamp(31px,8.5vw,39px)!important}}
        /* Final requested adjustment: no separate result card beneath the photograph; match the checkout card's soft corners. */
        .new-offer__photo{border-radius:26px!important;overflow:hidden!important}
        .new-offer__photo img{border-radius:inherit!important;transform:none!important}
        @media(max-width:520px){.new-offer__photo{border-radius:23px!important}}
        /* Refined price typography: crisp, familiar and easy to read. */
        .new-offer__price strong{
          font-family:Georgia,"Times New Roman",serif!important;
          font-size:39px!important;
          font-weight:400!important;
          line-height:1.12!important;
          letter-spacing:-.035em!important;
          font-variant-numeric:lining-nums tabular-nums;
          -webkit-font-smoothing:antialiased;
        }
        .new-offer__price strong span{
          font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;
          font-size:12px!important;
          font-weight:450!important;
          letter-spacing:0!important;
          margin-left:5px;
        }
        @media(max-width:520px){.new-offer__price strong{font-size:36px!important}}

        /* Responsive finishing pass: narrow phones, large phones, tablets and landscape. */
        .new-offer,.new-offer *{min-width:0}
        /* Give the analysed-results pill a little extra breathing room on phones only. */
        @media(max-width:520px){.new-offer__eyebrow{margin-top:16px!important}}
        .new-offer__intro h1,.new-offer__checkout h2{overflow-wrap:normal;text-wrap:balance}
        .new-offer__button{white-space:normal;text-align:center;line-height:1.3;padding:12px 16px;min-height:56px}
        .new-offer__button svg{flex:0 0 18px}
        .new-offer__photo img{transform:none!important;object-fit:cover!important}
        .new-offer__mobile-result,.new-offer__profile{display:none!important}
        @media(max-width:850px){
          .new-offer{padding:clamp(16px,4vw,32px) clamp(12px,3.5vw,24px) 48px!important}
          .new-offer__shell{width:100%;max-width:640px;margin-inline:auto}
          .new-offer__intro{margin:0 auto 20px!important;padding-inline:2px}
          .new-offer__intro h1{font-size:clamp(30px,7.2vw,48px)!important;line-height:1.08!important;margin:12px 0!important}
          .new-offer__intro p{font-size:clamp(12px,3.2vw,14px)!important;line-height:1.55}
          .new-offer__grid{display:flex!important;flex-direction:column!important;gap:20px!important;width:100%}
          .new-offer__checkout{order:0!important;width:100%!important;max-width:none!important;margin:0!important;align-self:stretch!important;padding:clamp(18px,4.5vw,32px)!important;border-radius:clamp(17px,4vw,25px)!important}
          .new-offer__story{order:1!important;display:block!important;position:relative!important;width:100%!important;max-width:none!important;margin:0!important;min-height:0!important}
          .new-offer__photo{position:relative!important;inset:auto!important;width:100%!important;height:clamp(245px,74vw,470px)!important;min-height:0!important;max-height:none!important;border:0!important;border-radius:clamp(17px,4vw,25px)!important;overflow:hidden!important}
          .new-offer__photo img{height:100%!important;width:100%!important;object-position:center 42%!important;border-radius:0!important}
          .new-offer__photo-label{font-size:clamp(13px,3.5vw,18px)!important;padding:40px 12px 16px!important}
          .new-offer__checkout h2{font-size:clamp(28px,6.6vw,39px)!important;line-height:1.12!important}
          .new-offer__sub{font-size:clamp(12px,3vw,14px)!important;line-height:1.55}
          .new-offer__includes{gap:clamp(9px,2.4vw,13px)!important}
          .new-offer__includes>div{align-items:flex-start!important;font-size:clamp(12px,3vw,13px)!important;line-height:1.45}
          .new-offer__includes>div span{flex:0 0 21px}
          .new-offer__price{flex-wrap:wrap;gap:10px!important;padding:clamp(13px,3.5vw,18px)!important;margin:20px 0 14px!important}
          .new-offer__price strong{font-size:clamp(33px,8.5vw,39px)!important}
          .new-offer__price>span{margin-left:auto;font-size:11px}
          .new-offer__terms{font-size:clamp(11px,2.9vw,12px)!important;line-height:1.65!important}
          .new-offer__trust{gap:8px 14px!important;line-height:1.5;text-align:center}
        }
        @media(max-width:370px){
          .new-offer{padding-inline:10px!important}
          .new-offer__checkout{padding:18px 15px!important}
          .new-offer__intro h1{font-size:30px!important}
          .new-offer__checkout h2{font-size:28px!important}
          .new-offer__price>span{text-align:left;margin-left:0;width:100%}
          .new-offer__button{font-size:13px!important;gap:7px}
          .new-offer__eyebrow,.new-offer__badge{font-size:9px;letter-spacing:.07em}
        }
        @media(min-width:851px) and (max-width:1100px){
          .new-offer__grid{gap:clamp(20px,3vw,36px)!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important}
          .new-offer__checkout{padding:clamp(22px,2.8vw,34px)!important}
          .new-offer__checkout h2{font-size:clamp(29px,3.3vw,39px)!important}
        }
        @media(max-height:550px) and (orientation:landscape) and (max-width:850px){
          .new-offer__photo{height:300px!important}
          .new-offer__intro{margin-bottom:14px!important}
        }
        @media(prefers-reduced-motion:reduce){.new-offer *{scroll-behavior:auto!important;transition:none!important}}

        /* Warmer, more spacious mobile quiz introduction — no changes elsewhere */
        @media (max-width:680px) {
          .lr-journey--intro .lr-journey-intro { width:min(100% - 36px, 480px); min-height:0; align-items:start; align-content:start; margin:0 auto; padding-top:0; padding-bottom:34px; gap:30px; }
          .lr-journey--intro .lr-journey-intro__copy { padding:22px 15px 25px; border-radius:0 0 32px 32px; background:radial-gradient(ellipse at 50% 0%,rgba(255,224,216,.56),transparent 72%); }
          .lr-journey--intro .lr-journey-intro__copy>.lr-pill { padding:10px 17px; margin-bottom:15px; border-radius:100px; background:#fff0eb; border-color:#f6d9d1; letter-spacing:.065em; }
          .lr-journey--intro .lr-journey-intro__copy h2 { max-width:380px; margin:15px auto 27px; font-size:clamp(40px,10.6vw,53px); line-height:1.12; letter-spacing:-.048em; text-wrap:balance; }
          .lr-journey--intro .lr-journey-intro__copy h2 em { display:block; margin-top:9px; font-weight:400; line-height:1.13; }
          .lr-journey--intro .lr-journey-intro__copy>p { max-width:350px; margin:0 auto 30px; line-height:1.85; }
        }
        @media (max-width:360px) {
          .lr-journey--intro .lr-journey-intro__copy { padding-inline:6px; }
          .lr-journey--intro .lr-journey-intro__copy h2 { font-size:38px; }
        }
      `}</style>
    </main>
  );
}