import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StructuredData } from "./structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neuralcosmology - Navigate Reality Through States, Memory & Attention",
  description: "A system of reality navigation through states, memory, and attention. Explore the intersection of neural networks and cosmic structures, with no fluff or mysticism—just presence, pattern, and decision.",
  keywords: [
    "neuralcosmology", 
    "neural cosmology", 
    "consciousness", 
    "reality navigation", 
    "mental states", 
    "cognitive patterns", 
    "self awareness", 
    "perception", 
    "mindfulness", 
    "cosmic structure", 
    "neural networks", 
    "inner space"
  ],
  authors: [
    {
      name: "Neuralcosmology",
      url: "https://neuralcosmology.com",
    },
  ],
  creator: "Neuralcosmology",
  publisher: "Neuralcosmology",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://neuralcosmology.com",
    title: "Neuralcosmology - A New Layer of Perception",
    description: "You're not in the world. You are the structure. A system of reality navigation through states, memory, and attention.",
    siteName: "Neuralcosmology",
    images: [
      {
        url: "/og-image.jpg", // Add this image to your public folder
        width: 1200,
        height: 630,
        alt: "Neuralcosmology - A new layer of perception",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Neuralcosmology - Navigate Reality Through States, Memory & Attention",
    description: "A new layer of perception. Explore the intersection of neural networks and cosmic structures.",
    images: ["/twitter-image.jpg"], // Add this image to your public folder
    creator: "@neuralcosmology",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL("https://neuralcosmology.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
