// app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { AuthProvider } from "@/contexts/AuthProvider"; // ✅ only one AuthProvider import
import Chatbot from "@/components/chatbot";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { dir } from "i18next";
import { languages } from "../next-i18next.config";

export const dynamicParams = false;

export function generateStaticParams() {
  return languages.map((lng: string) => ({ locale: lng }));
}

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html
      lang={params.locale}
      dir={dir(params.locale)}
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Fail U Forward</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://failuforward.vercel.app/" />

        {/* Primary SEO */}
        <meta name="description" content="Fail U Forward is a community to share failures, learn from setbacks, and connect with others. fail. learn. connect." />
        <meta name="keywords" content="fail, failure, learn from failure, community, setbacks, resilience, growth" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#000000" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://failuforward.vercel.app/" />
        <meta property="og:title" content="Fail U Forward" />
        <meta property="og:description" content="Share setbacks, celebrate learning, and connect with a like‑minded community." />
        <meta property="og:site_name" content="Fail U Forward" />
        <meta property="og:image" content="https://fail-u-forward-git-seo-optimisation-rudrasinghdev.vercel.app/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Fail U Forward" />
        <meta name="twitter:description" content="Share setbacks, celebrate learning, and connect with a like‑minded community." />
        <meta name="twitter:image" content="https://fail-u-forward-git-seo-optimisation-rudrasinghdev.vercel.app/og-image.png" />
      </head>

      <body className={inter.className}>
        <a href="#main-content" className="skip-to-main">
          skip to main content
        </a>

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="min-h-screen">
            <AuthProvider>
              <Navbar />
              <ToastContainer position="top-right" autoClose={3000} />
              <main id="main-content">{children}</main>
            </AuthProvider>

            <SpeedInsights />
            <Chatbot />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
