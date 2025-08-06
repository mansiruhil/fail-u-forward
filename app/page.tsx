"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";
import { motion } from "framer-motion";
import { ArrowRight, ThumbsDown, Users, Coffee } from "lucide-react";

import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { Button } from "@/components/ui/button";
import GradientButton from "@/components/ui/gradient-button";

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
      backgroundColor: 0x000000,
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
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-70 z-0" />

      {/* Main content */}
      <main className="container relative z-10 flex flex-col px-4 sm:px-6 md:px-8 py-12 sm:py-16 min-h-screen">
        {/* Hero Section */}
        <section className="text-center mt-16 sm:mt-20 space-y-6 px-2">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text drop-shadow-[0_2px_4px_rgba(255,255,255,0.5)]">
            <TextGenerateEffect words="Welcome To Fail U Forward" />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-base sm:text-lg md:text-xl text-neutral-200 max-w-2xl mx-auto font-bold"
          >
            fail. learn. connect.
          </motion.p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6 sm:mt-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 1.5 } }}
            >
              <Link href="/feed">
                <GradientButton className="text-xs sm:text-sm">
                  Explore <ArrowRight className="h-4 w-4 ml-2" />
                </GradientButton>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 1.6 } }}
            >
              <Link href="/about">
                <GradientButton className="text-xs sm:text-sm">
                  About Fail U Forward
                </GradientButton>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Cards Section */}
        <section className="mt-12 sm:mt-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2 }}
            className="p-4 sm:p-6 rounded-lg border bg-gradient-to-r from-slate-400 via-slate-200 to-slate-600"
          >
            <div className="flex items-center gap-2 mb-4">
              <ThumbsDown className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
              <h3 className="text-lg sm:text-xl font-bold">Professional Setbacks</h3>
            </div>
            <p className="text-black font-semibold text-sm sm:text-base">
              Share your rejected applications and celebrate career mishaps.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.2 }}
            className="p-4 sm:p-6 rounded-lg border bg-gradient-to-r from-slate-400 via-slate-200 to-slate-600"
          >
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
              <h3 className="text-lg sm:text-xl font-bold">Network</h3>
            </div>
            <p className="text-black font-semibold text-sm sm:text-base">
              Connect with others who have failed forward.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.4 }}
            className="p-4 sm:p-6 rounded-lg border bg-gradient-to-r from-slate-400 via-slate-200 to-slate-600"
          >
            <div className="flex items-center gap-2 mb-4">
              <Coffee className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
              <h3 className="text-lg sm:text-xl font-bold">Daily Disappointments</h3>
            </div>
            <p className="text-black font-semibold text-sm sm:text-base">
              Share your daily struggles and workplace disasters.
            </p>
          </motion.div>
        </section>
      </main>
    </div>
  );
}



