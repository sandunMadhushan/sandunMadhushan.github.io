import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppToaster } from "@/components/app-toaster";
import { ScrollToTopOnRoute } from "@/components/motion/scroll-to-top";
import { SiteJsonLd } from "@/components/seo/site-json-ld";
import { getSiteUrl } from "@/lib/site-url";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const siteTitle = "Sandun Madhushan | Full-Stack Developer Portfolio";
const siteDescription =
  "Full-Stack Developer from Sri Lanka. React, TypeScript & Node.js — portfolio, projects, and contact.";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: siteTitle,
    template: "%s | Sandun Madhushan",
  },
  description: siteDescription,
  keywords: [
    "Sandun Madhushan",
    "Full-Stack Developer",
    "Web Developer",
    "React",
    "TypeScript",
    "Node.js",
    "Sri Lanka",
    "Software Engineer",
    "Portfolio",
    "Matale",
  ],
  authors: [{ name: "Sandun Madhushan" }],
  creator: "Sandun Madhushan",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Sandun Madhushan Portfolio",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/sandun-madhushan.png",
        width: 1200,
        height: 1200,
        alt: "Sandun Madhushan — Full-Stack Developer from Sri Lanka",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sandun Madhushan | Full-Stack Developer",
    description: siteDescription,
    images: ["/sandun-madhushan.png"],
    site: "@sandunMadhushan",
    creator: "@sandunMadhushan",
  },
  verification: {
    google: "b648pEfc1hBPsTV9oKHUX_kiAN6jEqp1YUcoictpzDI",
  },
  other: {
    "geo.region": "LK-2",
    "geo.placename": "Matale, Central Province, Sri Lanka",
    "format-detection": "telephone=yes",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} min-h-screen font-sans`} suppressHydrationWarning>
        <SiteJsonLd />
        <ScrollToTopOnRoute />
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
