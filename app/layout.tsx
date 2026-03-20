import type { Metadata } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Analytics } from "@vercel/analytics/next";

const instrumentSans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: {
    default: "Digital Asset Jobs",
    template: "%s | Digital Asset Jobs",
  },
  description: "Premium job board for TradFi-to-crypto professionals. Find roles across crypto, DeFi, and digital assets.",
  metadataBase: new URL("https://digitalassetjobs.com"),
  openGraph: {
    title: "Digital Asset Jobs",
    description: "Find digital asset roles that suit you",
    siteName: "Digital Asset Jobs",
    images: [{ url: "/api/og", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Asset Jobs",
    description: "Premium job board for TradFi-to-crypto professionals",
    images: ["/api/og"],
  },
  icons: {
    icon: "/logos/64x64.png",
    apple: "/logos/180x180.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${instrumentSans.variable} ${instrumentSerif.variable} antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
