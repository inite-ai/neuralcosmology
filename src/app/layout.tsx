import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteBackground from "@/components/layout/SiteBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Root metadata is a safe fallback. Per-locale metadata (title, description,
// hreflang alternates, openGraph locale) lives in app/[locale]/layout.tsx so
// each locale gets the right crawler signal.
export const metadata: Metadata = {
  metadataBase: new URL("https://neuralcosmology.com"),
  title: "Neural Cosmology — Mikhail Savchenko",
  description:
    "Public HQ for the Neural Cosmology programme: three books, one preprint, a growing body of essays.",
  authors: [{ name: "Mikhail Savchenko", url: "https://neuralcosmology.com" }],
  creator: "Mikhail Savchenko",
  publisher: "Mikhail Savchenko",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/favicons/icon.svg", type: "image/svg+xml" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/favicons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-white bg-[#0a1026]`}
      >
        <SiteBackground />
        {children}
      </body>
    </html>
  );
}
