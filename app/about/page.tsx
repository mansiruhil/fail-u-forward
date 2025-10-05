'use client';

import { useState, useRef, useEffect } from 'react';
import NET from 'vanta/dist/vanta.net.min';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

const teamMembers = [
  {
    name: 'Sukhman Singh',
    role: 'Full Stack Developer',
    avatar: '/sukhman.jpeg',
  },
  {
    name: 'Lovepreet Singh',
    role: 'UI/UX Designer',
    avatar: '/lovepreet.jpeg',
  },
  {
    name: 'Gursimran Singh',
    role: 'Marketing Head',
    avatar: '/gursimran.jpeg',
  },
];

export default function AboutPage() {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        NET({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x4d4d4d, // Darker gray color for the net
          backgroundColor: 0x0, // Black background
          points: 12.0, // Number of points
          maxDistance: 25.0, // Max distance between points
          spacing: 20.0, // Spacing between points
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  const handleRefresh = () => {
    if (vantaEffect) {
      vantaEffect.destroy();
      setVantaEffect(null);
    }
  };

  return (
    <div ref={vantaRef} className="relative min-h-screen w-full text-primary overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-70 pointer-events-none z-10"></div>
      {/* Page Content */}
      <div className="relative z-20">
        <section className="py-16 px-4 sm:px-6 md:px-8 text-base">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-10 text-center text-white tracking-wide drop-shadow-lg">
            About Fail U Forward
          </h2>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto"
          >
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                variants={cardVariants}
                custom={i}
                className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
              >
                <div className="p-6 text-center">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto border-4 border-white/20 shadow-md"
                  />
                  <h3 className="mt-5 text-xl font-semibold text-white">{member.name}</h3>
                  <p className="mt-2 text-sm text-gray-300">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.5 } }}
          className="text-center mt-12"
        >
          <Button
            onClick={() => router.back()}
            className="bg-white/10 backdrop-blur-md text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={20} />
            <span>Go Back</span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
