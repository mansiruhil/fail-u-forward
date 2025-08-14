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
  const { t } = useTranslation();

  useEffect(() => {
    const vantaEffect = NET({
      el: "#vanta-bg",
      THREE,
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
    return () => vantaEffect && vantaEffect.destroy();
  }, []);

  return (
    <div id="vanta-bg" className="min-h-screen w-full flex flex-col items-center justify-center relative">
      <div className="absolute inset-0 bg-black opacity-70 z-0"></div>
      <main className="container mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 flex flex-col min-h-screen relative z-10">
        <div className="flex-grow mt-16 sm:mt-20 text-center space-y-6 px-2">
          <h1 className="text-3xl md:text-6xl font-bold tracking-tight">
            <TextGenerateEffect words={t("welcome")} />
          </h1>
          <motion.div initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.5, type: "tween" }}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">{t("tagline")}</p>
          </motion.div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 sm:mt-8 px-2">
            <Link href="/feed"><Button variant="outline" size="lg">{t("explore")} <ArrowRight className="ml-2" /></Button></Link>
            <Link href="/about"><Button variant="outline" size="lg">{t("about")}</Button></Link>
          </div>
        </div>
      </main>
    </div>
  );
}
