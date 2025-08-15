"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ThumbsDown, Users, Coffee } from "lucide-react";
import { useEffect } from "react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";
import Link from "next/link";
import { useTranslation } from "react-i18next";

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
    <div id="vanta-bg" className="min-h-screen w-full flex flex-col items-center justify-center relative">
      <div className="absolute inset-0 bg-black opacity-70 z-0"></div>

      {/* MAIN SECTION with Flex Layout */}
      <main className="container mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 flex flex-col min-h-screen relative z-10">
        {/* All content above cards */}
        <div className="flex-grow mt-16 sm:mt-20">
          <div className="text-center space-y-6 px-2">
            <h1 className="text-3xl md:text-6xl font-bold tracking-tight">
              <TextGenerateEffect words={"Welcome To Fail U Forward"} />
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.5, type: "tween" }}
            className="text-center space-y-6"
          >
            <br />
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              fail. learn. connect.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 sm:mt-8 px-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 2 } }}
            >
              <Link href="/feed">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-black text-white border-black font-bold hover:bg-gray-800 hover:border-gray-800 text-xs sm:text-s"
                >
                  Explore
                  <ArrowRight className="h-4 w-4 ml-2 transform transition duration-300 ease-in-out group-hover:translate-x-[6px]" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 2 } }}
            >
              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white text-black border-gray-300 font-bold hover:bg-gray-50 hover:border-gray-400 text-xs sm:text-s"
                >
                  About Fail U Forward
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Cards section pushed to bottom via mt-auto */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-auto"
        >
          <div className="p-4 sm:p-6 rounded-lg border bg-card bg-gradient-to-r from-slate-400 via-slate-200 to-slate-600">
            <div className="flex items-center gap-2">
              <ThumbsDown className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-2" />
              <h3 className="text-lg sm:text-xl font-bold mb-2 relative z-10 mb-4">
                Professional Setbacks
              </h3>
            </div>
            <p className="text-black font-bold text-sm sm:text-base">
              Share your rejected applications and celebrate career mishaps
            </p>
          </div>

          <div className="p-4 sm:p-6 rounded-lg border bg-card bg-gradient-to-r from-slate-400 via-slate-200 to-slate-600">
            <div className="flex items-center gap-2">
              <Users className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-2" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Network</h3>
            </div>
            <p className="text-black font-bold text-sm sm:text-base">Connect with others</p>
          </div>

          <div className="p-4 sm:p-6 rounded-lg border bg-card bg-gradient-to-r from-slate-400 via-slate-200 to-slate-600">
            <div className="flex items-center gap-2">
              <Coffee className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-2" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Daily Disappointments</h3>
            </div>
            <p className="text-black font-bold text-sm sm:text-base">
              Share your daily struggles and workplace disasters
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
