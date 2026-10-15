
type MetaEvent =
  | "StartQuiz"
  | "CompleteRegistration"
  | "InitiateCheckout";

const CONSENT_KEY = "uml-cookie-consent-v1";

function hasMarketingConsent(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return false;

    const consent = JSON.parse(raw) as {
      marketing?: unknown;
    };

    return consent.marketing === true;
  } catch {
    return false;
  }
}

export function hasMetaMarketingConsent(): boolean {
  return hasMarketingConsent();
}

export function trackMetaEvent(
  event: MetaEvent,
  parameters?: Record<string, string | number>
): void {
  if (typeof window === "undefined") return;
  if (!hasMarketingConsent()) return;
  if (typeof window.fbq !== "function") return;

  if (event === "InitiateCheckout") {
    window.fbq("track", event, parameters ?? {});
  } else {
    window.fbq("trackCustom", event, parameters ?? {});
  }
}
