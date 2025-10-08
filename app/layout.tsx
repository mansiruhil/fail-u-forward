import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { AuthProvider } from "@/contexts/AuthProvider";
import Chatbot from "@/components/chatbot";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LanguageSwitcher from "@/components/ui/LanguageSwitcher"; // client component

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "failuforward",
  description: "failuforward: Share and engage with posts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>failuforward</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="failuforward: Share and engage with posts"
        />
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

              {/* Language Switcher & Refresh Button */}
              <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
               
                <LanguageSwitcher />
              </div>

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
