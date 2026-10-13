
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "UnderstandMyLove",
    template: "%s | UnderstandMyLove",
  },
  description:
    "Understand the way your heart connects. Discover what helps you feel safe, seen, and genuinely connected.",
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
};

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
      </body>
    </html>
  );
}
