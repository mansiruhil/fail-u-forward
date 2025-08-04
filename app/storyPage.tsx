"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";

const StoryPage = () => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

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
    { comment: "The platform curates a custom feed based on your interests—tech fails, career rejections, entrepreneurial setbacks—so you’re always learning what not to do in your journey." },
    { comment: "A Raw & Real Community: It’s a judgment-free zone where every rejection is a rite of passage." },
  ];

  return (
    <div ref={vantaRef} className="relative min-h-screen w-full text-primary overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-70 pointer-events-none z-10" />

      <div className="relative z-20">
        <section className="py-20 px-8 text-base">
          <h2 className="text-xl md:text-4xl font-extrabold mb-10 text-center text-white tracking-wide drop-shadow-lg">
            About Fail U Forward
          </h2>

          <p className="max-w-4xl mx-auto mb-5 leading-8 text-lg text-gray-200 font-medium shadow-inner bg-white dark:bg-zinc-900 border border-gray-500 px-4 py-3 rounded-xl ">
            The idea for Fail U Forward came from scrolling through LinkedIn where everyone’s success stories looked flawless—but real growth happens through failure. I wanted to create a space that shows the messy, unfiltered side of the journey that LinkedIn rarely highlights.
          </p>

          <p className="max-w-4xl mx-auto mb-5 leading-8 text-lg text-gray-200 font-medium shadow-inner bg-white dark:bg-zinc-900 border border-gray-500 px-4 py-3 rounded-xl ">
            This platform is your no-judgment zone to share your rejections, epic fails and the lessons you actually learned—because failure is the ultimate teacher. Whether you flopped a project, bombed an interview or just had a bad day, Fail U Forward turns those moments into badges of honor.
          </p>

          <p className="max-w-4xl mx-auto mb-5 leading-8 text-lg text-gray-200 font-medium shadow-inner bg-white dark:bg-zinc-900 border border-gray-500 px-4 py-3 rounded-xl ">
            We’re here to normalize setbacks, build a community of real talk, and remind everyone that every failure is just a stepping stone to something bigger.
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

        {/* New Section: How to Get Started Video */}
        <section className="bg-black py-16 px-6 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-8 drop-shadow">
            🎥 How to Get Started on Fail U Forward
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-6">
            Not sure how to share your story? Watch this quick video to see how easy it is to post, reflect, and inspire others through your real-life failures.
          </p>
          <div className="flex justify-center">
            <div className="w-full max-w-3xl aspect-video rounded-xl overflow-hidden shadow-lg">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                title="How to use Fail U Forward"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StoryPage;
