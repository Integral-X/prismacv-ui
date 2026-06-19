import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { SentryProvider } from "@/components/providers/sentry-provider";
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
  title: "PrismaCV - Build Your Professional Resume",
  description:
    "Create professional resumes with AI-powered insights, track job applications, and identify skill gaps. Stand out at leading companies with PrismaCV.",
  keywords: [
    "resume builder",
    "CV builder",
    "job application tracker",
    "ATS resume",
    "professional resume",
    "career development",
  ],
  authors: [{ name: "Integral-X Team" }],
  creator: "Integral-X",
  publisher: "Integral-X",
  robots: "index, follow",
  icons: {
    icon: [
      {
        url: "/images/favicon/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/images/favicon/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/images/favicon/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/images/favicon/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      { url: "/images/favicon/favicon.ico", sizes: "any" },
    ],
    apple: [
      {
        url: "/images/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://prismacv.com",
    siteName: "PrismaCV",
    title: "PrismaCV - Build Your Professional Resume",
    description:
      "Create professional resumes with AI-powered insights, track job applications, and identify skill gaps.",
    images: [
      {
        url: "/images/landing-page/hero_1.svg",
        width: 852,
        height: 608,
        alt: "PrismaCV Resume Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PrismaCV - Build Your Professional Resume",
    description:
      "Create professional resumes with AI-powered insights, track job applications, and identify skill gaps.",
    images: ["/images/landing-page/hero_1.svg"],
    creator: "@integral-x",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SentryProvider />
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
