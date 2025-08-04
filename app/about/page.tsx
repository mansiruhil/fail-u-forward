"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Twitter, Linkedin, Github, Instagram } from "lucide-react";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";

const StoryPage = () => {
  const vantaRef = useRef(null); // Reference for the background container
  const vantaEffect = useRef<any>(null); // To store the Vanta effect instance

  useEffect(() => {
    if (!vantaEffect.current && vantaRef.current) {
      vantaEffect.current = NET({
        el: vantaRef.current,
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
    }
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  const devComments = [
    { comment: "Users can share their rejections, flops and failures from college rejections to startup shutdowns." },
    { comment: "Every post becomes a learning moment. Whether it's a resume that got ignored or a pitch that bombed, users can reflect, discuss and grow from real life experiences." },
    { comment: "The platform curates a custom feed based on your interests tech fails, career rejections, entrepreneurial setbacks so you’re always learning what not to do in your journey." },
    { comment: "A Raw & Real Community: It’s a judgment free zone where every rejection is a rite of passage." },
  ];

  return (
    // Container with ref to apply Vanta.js effect
    <div ref={vantaRef} className="relative min-h-screen w-full text-primary overflow-hidden">
      {/* Overlay for better text contrast */}
      <div className="absolute inset-0 bg-black opacity-70 pointer-events-none z-10"></div>

      {/* Content container - relative to overlay */}
      <div className="relative z-20">
        <section className="py-20 px-8 text-base">
          <h2 className="text-xl md:text-4xl font-extrabold mb-10 text-center text-white tracking-wide drop-shadow-lg">
            About Fail U Forward
          </h2>
          <p className="max-w-4xl mx-auto mb-5 md:mb-7 leading-8 text-lg md:text-s text-gray-200 font-medium shadow-inner bg-white dark:bg-zinc-900 border border-gray-500 px-4 py-3 rounded-xl ">
            The idea for Fail U Forward came from scrolling through LinkedIn where everyone’s success stories looked flawless but real growth happens through failure. I wanted to create a space that shows the messy, unfiltered side of the journey that LinkedIn rarely highlights.
          </p>

          <p className="max-w-4xl mx-auto mb-5 md:mb-7 leading-8 text-lg md:text-s text-gray-200 font-medium shadow-inner bg-white dark:bg-zinc-900 border border-gray-500 px-4 py-3 rounded-xl ">
            This platform is your no judgment zone to share your rejections, epic fails and the lessons you actually learned because failure is the ultimate teacher. Whether you flopped a project, bombed an interview or just had a bad day, Fail U Forward turns those moments into badges of honor.
          </p>

          <p className="max-w-4xl mx-auto mb-5 md:mb-7 leading-8 text-lg md:text-s text-gray-200 font-medium shadow-inner bg-white dark:bg-zinc-900 border border-gray-500 px-4 py-3 rounded-xl ">
            This platform is your no judgment zone to share your rejections, epic fails and the lessons you actually learned because failure is the ultimate teacher. Whether you flopped a project, bombed an interview or just had a bad day, Fail U Forward turns those moments into badges of honor.
          </p>

          <p className="max-w-4xl mx-auto mb-5 md:mb-7 leading-8 text-lg md:text-s text-gray-200 font-medium shadow-inner bg-white dark:bg-zinc-900 border border-gray-500 px-4 py-3 rounded-xl ">
            We’re here to normalize setbacks, build a community of real talk and remind everyone that every failure is just a stepping stone to something bigger. Because growth isn’t about never falling, it’s about getting up and sharing the story.
          </p>
        </section>

        <section className="bg-black py-16 px-8">
          <h2 className="text-4xl md:text-4xl font-extrabold mb-10 text-center text-white tracking-wide drop-shadow-lg">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {devComments.map((dev, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center bg-white dark:bg-zinc-900 border border-gray-500 shadow-lg rounded-xl p-6 hover:scale-105 transition-transform duration-300 hover:bg-gray-800"
              >
                <p className="text-gray-200 font-medium text-lg">{dev.comment}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="max-w-4xl mx-auto mt-8 px-4 text-center">
            <p className="text-lg font-semibold mb-2 text-white">
              Find more about Fail U Forward on
            </p>
            <div className="flex justify-center gap-6 text-2xl">
              <a href="https://twitter.com/username" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-gray-200 hover:bg-gray-500 shadow transition duration-300 transform hover:-translate-y-1">
                <Twitter size={28} />
              </a>
              <a href="https://linkedin.com/in/username" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-gray-200 hover:bg-gray-500 shadow transition duration-300 transform hover:-translate-y-1">
                <Linkedin size={28} />
              </a>
              <a href="https://github.com/username" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-gray-200 hover:bg-gray-500 shadow transition duration-300 transform hover:-translate-y-1">
                <Github size={28} />
              </a>
              <a href="https://instagram.com/username" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-gray-200 hover:bg-gray-500 shadow transition duration-300 transform hover:-translate-y-1">
                <Instagram size={28} />
              </a>
            </div>
          </div>
          <br />
          <br />
        </section>
      </div>
    </div>
  );
};

export default StoryPage;
