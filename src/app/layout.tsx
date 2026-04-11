import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppToaster } from "@/components/app-toaster";
import { ScrollToTopOnRoute } from "@/components/motion/scroll-to-top";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Sandun Madhushan | Aspiring Software Engineer",
  description:
    "Aspiring software engineer — learning full-stack web development with React, TypeScript, and Node.js.",
  verification: {
    google: "b648pEfc1hBPsTV9oKHUX_kiAN6jEqp1YUcoictpzDI",
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
        <ScrollToTopOnRoute />
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
