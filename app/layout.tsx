import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import Chatbot from "@/components/chatbot";
const inter = Inter({ subsets: ["latin"] });
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function RootLayout({

  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>failuforward</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="description" content="FailUForward: Share and engage with posts" />
      </head>

      <body className={`${inter.className}`}>
        <a href="#main-content" className="skip-to-main">
          Skip to main content
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
