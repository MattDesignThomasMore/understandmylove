
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import CookieConsent from "../components/CookieConsent";
import "./globals.css";

const SITE_URL = "https://www.understandmylove.com";
const SITE_NAME = "UnderstandMyLove";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  applicationName: SITE_NAME,

  title: {
    default:
      "Love Language Test & Relationship Quiz | UnderstandMyLove",
    template: "%s | UnderstandMyLove",
  },

  description:
    "Discover how you give and receive love. Explore your emotional needs, relationship patterns, and connection style with the UnderstandMyLove self-reflection quiz.",

  keywords: [
    "love language test",
    "love languages",
    "relationship quiz",
    "relationship test",
    "understand my love language",
    "emotional connection",
    "relationship patterns",
    "how do I express love",
    "how do I receive love",
    "relationship self reflection",
    "emotional needs in relationships",
    "understand yourself in relationships",
    "love and relationships",
    "UnderstandMyLove",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title:
      "Discover How You Love & Connect | UnderstandMyLove",
    description:
      "What helps you feel truly loved? Explore your emotional needs, relationship patterns, and the way you connect with others.",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Understand Your Love Language | UnderstandMyLove",
    description:
      "Discover what makes you feel loved, understood, and emotionally connected.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
        sizes: "any",
      },
    ],
    shortcut: "/favicon.ico",
  },

  category: "relationships",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#173b35",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  description:
    "UnderstandMyLove is an educational self-reflection platform focused on love, emotional needs, and relationship patterns.",
  logo: `${SITE_URL}/favicon.ico`,
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "en",
  publisher: {
    "@id": `${SITE_URL}/#organization`,
  },
  description:
    "Explore how you express love, what makes you feel connected, and your emotional needs in relationships.",
};

function safeJsonLd(data: object) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}

        <CookieConsent />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd(organizationSchema),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd(websiteSchema),
          }}
        />
      </body>
    </html>
  );
}
