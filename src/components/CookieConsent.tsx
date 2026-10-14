
"use client";

import { useEffect, useState, Suspense } from "react";
import MetaPixel from "./MetaPixel";

type Consent = {
  necessary: true;
  marketing: boolean;
};

const STORAGE_KEY = "uml-cookie-consent-v1";

function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const data: unknown = JSON.parse(raw);

    if (
      typeof data === "object" &&
      data !== null &&
      "marketing" in data &&
      typeof data.marketing === "boolean"
    ) {
      return {
        necessary: true,
        marketing: data.marketing,
      };
    }
  } catch {
    // Invalid or inaccessible storage.
  }

  return null;
}

export default function CookieConsent() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    setConsent(readConsent());
    setInitialized(true);
  }, []);

  function saveConsent(marketing: boolean) {
    const next: Consent = {
      necessary: true,
      marketing,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Consent remains in memory for this session.
    }

    setConsent(next);
    setShowSettings(false);
  }

  if (!initialized) return null;

  return (
    <>
      {consent?.marketing === true && (
        <Suspense fallback={null}>
          <MetaPixel />
        </Suspense>
      )}

      {consent === null && (
        <div
          role="dialog"
          aria-label="Cookie preferences"
          className="fixed bottom-4 left-4 right-4 z-[9999] mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-5 text-gray-900 shadow-2xl"
        >
          <h2 className="text-lg font-semibold">
            Your privacy matters
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            We use necessary storage to operate this website.
            With your permission, we also use marketing
            cookies to measure and improve our advertising.
            You can decline or change your choice.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => saveConsent(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium"
            >
              Reject optional
            </button>

            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium"
            >
              Preferences
            </button>

            <button
              type="button"
              onClick={() => saveConsent(true)}
              className="rounded-lg bg-[#173b35] px-4 py-2 text-sm font-medium text-white"
            >
              Accept marketing
            </button>
          </div>

          {showSettings && (
            <div className="mt-4 border-t pt-4">
              <p className="mb-3 text-sm">
                Necessary storage is always enabled.
                Marketing cookies are optional.
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => saveConsent(false)}
                  className="rounded-lg border px-4 py-2 text-sm"
                >
                  Save without marketing
                </button>

                <button
                  type="button"
                  onClick={() => saveConsent(true)}
                  className="rounded-lg bg-[#173b35] px-4 py-2 text-sm text-white"
                >
                  Allow marketing
                </button>
              </div>
            </div>
          )}

          <a
            href="/privacy"
            className="mt-4 inline-block text-xs underline"
          >
            Privacy policy
          </a>
        </div>
      )}

      {consent !== null && (
        <button
          type="button"
          onClick={() => {
            setConsent(null);
            setShowSettings(false);
          }}
          className="fixed bottom-3 left-3 z-[9998] rounded-full border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 shadow-md"
          aria-label="Change cookie preferences"
        >
          Cookie settings
        </button>
      )}
    </>
  );
}
