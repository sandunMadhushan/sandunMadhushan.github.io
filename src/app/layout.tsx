import type { Metadata } from "next";
import Script from "next/script";
import { Inter_Tight, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppToaster } from "@/components/app-toaster";
import { DisableContextMenu } from "@/components/disable-context-menu";
import { ScrollToTopOnRoute } from "@/components/motion/scroll-to-top";
import { SiteJsonLd } from "@/components/seo/site-json-ld";
import { getSiteUrl } from "@/lib/site-url";
import { ThemeProvider, themeInitScript } from "@/components/theme/theme-provider";

/* Body — tight grotesk, variable weight. */
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

/* Display — editorial serif carrying every oversized headline. */
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
});

/* Metadata, labels and numerals. */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const siteTitle = "Sandun Madhushan | Aspiring Software Engineer";
const siteDescription =
  "Full-Stack Developer from Sri Lanka. React, TypeScript & Node.js — portfolio, projects, and contact.";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  referrer: "strict-origin-when-cross-origin",
  title: {
    default: siteTitle,
    template: "%s | Sandun Madhushan",
  },
  description: siteDescription,
  keywords: [
    "Sandun Madhushan",
    "Sandun Madushan",
    "Sadun Madushan",
    "Sadun Madhushan",
    "S Madhushan",
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
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
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
        url: "/sandun-madhushan.webp",
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
    images: ["/sandun-madhushan.webp"],
    site: "@sandunMadhushan",
    creator: "@sandunMadhushan",
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  verification: {
    google: "b648pEfc1hBPsTV9oKHUX_kiAN6jEqp1YUcoictpzDI",
  },
  other: {
    bingbot: "index, follow",
    "geo.position": "7.4675;80.6234",
    ICBM: "7.4675,80.6234",
    "DC.title": siteTitle,
    "DC.creator": "Sandun Madhushan",
    "DC.publisher": "Sandun Madhushan",
    "DC.language": "en",
    "DC.coverage": "Worldwide",
    "DC.coverage.spatial": "Matale, Central Province, Sri Lanka",
    "geo.region": "LK-2",
    "geo.placename": "Matale, Central Province, Sri Lanka",
    thumbnail: `${getSiteUrl()}/sandun-madhushan.webp`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${interTight.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Applies the stored theme before first paint so there is no flash of
            the wrong palette. beforeInteractive is emitted into the initial
            HTML by Next, which is why this is a next/script and not a raw
            <script> — React will not execute those when it renders. */}
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
      </head>
      <body className="min-h-screen font-sans" suppressHydrationWarning>
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only z-[100] rounded-sm bg-primary-container px-4 py-2 text-sm font-semibold text-on-primary-container focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
          >
            Skip to content
          </a>
          <DisableContextMenu />
          <SiteJsonLd />
          <ScrollToTopOnRoute />
          {children}
          <AppToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
