import React from "react";
import { Twitter, Linkedin, Github, Instagram } from "lucide-react";

const StoryPage = () => {
  const devComments = [
    { comment: "Users can share their rejections, flops and failures from college rejections to startup shutdowns." },
    { comment: "Every post becomes a learning moment. Whether it's a resume that got ignored or a pitch that bombed, users can reflect, discuss and grow from real life experiences." },
    { comment: "The platform curates a custom feed based on your interests tech fails, career rejections, entrepreneurial setbacks so you’re always learning what not to do in your journey." },
    { comment: "A Raw & Real Community: It’s a judgment free zone where every rejection is a rite of passage." },
  ];

  return (
    <div className="min-h-screen bg-background text-gray-100">
      {/* About Section with Radial Background */}
      <section className="py-24 px-8 text-base space-y-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-background to-black transition-all animate-fade-in">
        <h2 className="text-3xl md:text-4xl font-bold text-center">About Fail U Forward</h2>
        <div className="border-b-4 border-border w-16 mx-auto mb-10" />

        <p className="max-w-4xl mx-auto leading-relaxed">
          The idea for Fail U Forward came from scrolling through LinkedIn where everyone’s success stories looked flawless but real growth happens through failure.
        </p>
        <p className="max-w-4xl mx-auto leading-relaxed">
          This platform is your no judgment zone to share your rejections, epic fails and the lessons you actually learned because failure is the ultimate teacher.
        </p>
        <p className="max-w-4xl mx-auto leading-relaxed">
          We’re here to normalize setbacks, build a community of real talk and remind everyone that every failure is just a stepping stone to something bigger.
        </p>

        {/* Testimonial */}
        <div className="max-w-2xl mx-auto mt-20 p-6 border border-border rounded-lg shadow-md bg-black/30 backdrop-blur-sm animate-slide-up">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gray-500"></div>
            <div>
              <p className="text-sm text-gray-300 font-semibold">Aayush — Student & Early User</p>
            </div>
          </div>
          <blockquote className="text-gray-300 italic leading-relaxed">
            “Fail U Forward felt like the first place I could be real about bombing interviews without shame. It gave me the courage to keep going.”
          </blockquote>
        </div>

      </section>

      {/* Features Section */}
      <section className="bg-background py-24 px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center">Features</h2>
        <div className="border-b-4 border-border w-16 mx-auto mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {devComments.map((dev, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center bg-background border border-border shadow-md rounded-lg p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer animate-fade-in"
            >
              <p className="text-gray-300 mt-2">{dev.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold">Connect With Us</h2>
          <div className="border-b-4 border-border w-16 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-100">
            Find more about Fail U Forward on
          </p>
          <div className="flex justify-center gap-8 text-2xl">
            <a
              href="https://twitter.com/username"
              target="_blank"
              rel="noopener noreferrer"
              title="Follow us on Twitter"
              className="hover:text-blue-500 transition-all duration-300 transform hover:scale-110 hover:rotate-3"
            >
              <Twitter size={28} />
            </a>
            <a
              href="https://linkedin.com/in/username"
              target="_blank"
              rel="noopener noreferrer"
              title="Connect on LinkedIn"
              className="hover:text-blue-700 transition-all duration-300 transform hover:scale-110 hover:rotate-3"
            >
              <Linkedin size={28} />
            </a>
            <a
              href="https://github.com/username"
              target="_blank"
              rel="noopener noreferrer"
              title="Check our GitHub"
              className="hover:text-gray-400 transition-all duration-300 transform hover:scale-110 hover:rotate-3"
            >
              <Github size={28} />
            </a>
            <a
              href="https://instagram.com/username"
              target="_blank"
              rel="noopener noreferrer"
              title="Follow on Instagram"
              className="hover:text-pink-500 transition-all duration-300 transform hover:scale-110 hover:rotate-3"
            >
              <Instagram size={28} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StoryPage;
