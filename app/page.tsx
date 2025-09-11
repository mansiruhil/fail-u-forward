'use client';

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ThumbsDown, Users, Coffee } from "lucide-react";
import { useEffect } from "react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";
import Link from "next/link";

// Dummy AuthProvider stub for UI-only mode
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default function Home() {
  useEffect(() => {
    const vantaEffect = NET({
      el: "#vanta-bg",
      THREE: THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0xffffff,
      backgroundColor: 0x0,
      points: 20.0,
      maxDistance: 12.0,
    });
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  return (
    <div
      id="vanta-bg"
      className="min-h-screen w-full flex flex-col items-center justify-center relative"
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black opacity-70 z-0"></div>

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full bg-black bg-opacity-80 backdrop-blur-md z-50 border-b border-gray-700">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <Link href="/" className="text-xl font-bold text-white">
            Fail U Forward
          </Link>
          <nav className="space-x-6 hidden sm:block">
            <span className="text-gray-200 cursor-not-allowed">Home</span>
            <span className="text-gray-200 cursor-not-allowed">Feed</span>
            <span className="text-gray-200 cursor-not-allowed">About</span>
            <span className="text-gray-200 cursor-not-allowed">Contact</span>
          </nav>
        </div>
      </header>

      {/* MAIN SECTION */}
      <main className="container mx-auto px-4 sm:px-6 md:px-8 py-24 flex flex-col min-h-screen relative z-10">
        {/* Hero Section */}
        <div className="flex-grow mt-16 sm:mt-20 text-center space-y-6 px-2">
          <h1 className="text-3xl md:text-6xl font-bold tracking-tight">
            <TextGenerateEffect words={"Welcome To Fail U Forward"} />
          </h1>

          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.5, type: "tween" }}
            className="text-center space-y-6"
          >
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              fail. learn. connect. — Turning setbacks into stepping stones.
            </p>
          </motion.div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 sm:mt-8 px-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 2 } }}
            >
              <Button
                variant="outline"
                size="lg"
                className="bg-black text-white border-black font-bold hover:bg-gray-800 hover:border-gray-800 cursor-not-allowed"
              >
                Explore <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 2 } }}
            >
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-black border-gray-300 font-bold hover:bg-gray-50 hover:border-gray-400 cursor-not-allowed"
              >
                About Fail U Forward
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Cards Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-12"
        >
          {[
            {
              icon: <ThumbsDown className="h-12 w-12 text-black" />,
              title: "Professional Setbacks",
              desc: "Share your rejected applications and celebrate career mishaps",
            },
            {
              icon: <Users className="h-12 w-12 text-black" />,
              title: "Network",
              desc: "Connect with others and build meaningful relationships",
            },
            {
              icon: <Coffee className="h-12 w-12 text-black" />,
              title: "Daily Disappointments",
              desc: "Share your daily struggles and workplace disasters",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl shadow-lg border bg-gradient-to-bl from-slate-300 via-slate-400 to-slate-500 flex flex-col items-center text-center hover:scale-105 transition-transform hover:shadow-indigo-400/40 hover:border-indigo-400"
            >
              <div className="mb-4">{card.icon}</div>
              <h3 className="text-xl font-bold text-black mb-2">{card.title}</h3>
              <p className="text-sm sm:text-base font-medium text-gray-800">{card.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <section className="mt-20 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-6 text-white">
            Why Fail U Forward?
          </h2>
          <p className="max-w-2xl mx-auto text-gray-300">
            We believe failure is not the end, but the first step to growth.
            Share your journey, learn from others, and connect with people
            who’ve been there too.
          </p>
          <Button size="lg" className="mt-8 bg-indigo-600 text-white cursor-not-allowed">
            Join Now
          </Button>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-black bg-opacity-90 text-gray-400 py-6 text-center border-t border-gray-700 relative z-10">
        <p>© {new Date().getFullYear()} Fail U Forward. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <span className="hover:text-white cursor-not-allowed">Privacy Policy</span>
          <span className="hover:text-white cursor-not-allowed">Terms</span>
          <span className="hover:text-white cursor-not-allowed">Contact</span>
        </div>
      </footer>
    </div>
  );
}
