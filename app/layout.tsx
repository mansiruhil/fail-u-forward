import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import Chatbot from "@/components/chatbot";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { dir } from "i18next";
import { languages } from "../next-i18next.config";

const inter = Inter({ subsets: ["latin"] });

export const dynamicParams = false;

export function generateStaticParams() {
  return languages.map((lng: string) => ({ locale: lng }));
}

export default function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={params.locale} dir={dir(params.locale)} suppressHydrationWarning>
      <head>
        <title>failuforward</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="FailUForward: Share and engage with posts" />
      </head>

      <body className={`${inter.className}`}>
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
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
