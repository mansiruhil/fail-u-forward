import React from "react";
import { Button } from "@/components/ui/button";
import { Twitter, Linkedin, Github, Instagram } from "lucide-react";

const StoryPage = () => {
  const devComments = [
    {comment: "Users can share their rejections, flops and failures from college rejections to startup shutdowns." },
    {comment: "Every post becomes a learning moment. Whether it's a resume that got ignored or a pitch that bombed, users can reflect, discuss and grow from real life experiences." },
    {comment: "The platform curates a custom feed based on your interests tech fails, career rejections, entrepreneurial setbacks so you’re always learning what not to do in your journey." },
    {comment: "A Raw & Real Community: It’s a judgment free zone where every rejection is a rite of passage." },
  ];

  return (
    <div className="min-h-screen bg-background text-primary">

      <section className="py-20 px-8 text-base">
        <h2 className="text-2xl font-semibold mb-6 text-center">About Fail U Forward</h2>
        <p className="max-w-4xl mx-auto leading-8">
        The idea for Fail U Forward came from scrolling through LinkedIn where everyone’s success stories looked flawless but real growth happens through failure. I wanted to create a space that shows the messy, unfiltered side of the journey that LinkedIn rarely highlights.
        </p>
        <p className="max-w-4xl mx-auto leading-8">
          This platform is your no judgment zone to share your rejections, epic fails and the lessons you actually learned because failure is the ultimate teacher. Whether you flopped a project, bombed an interview or just had a bad day, Fail U Forward turns those moments into badges of honor.
        </p>
        <p className="max-w-4xl mx-auto leading-8">
          We’re here to normalize setbacks, build a community of real talk and remind everyone that every failure is just a stepping stone to something bigger. Because growth isn’t about never falling, it’s about getting up and sharing the story.
        </p>
      </section>
      <br/>
      <br/>

      <section className="bg-background py-16 px-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {devComments.map((dev, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center bg-background border border-border shadow-md rounded-lg p-6"
            >
              <p className="text-gray-600 mt-2">{dev.comment}</p>
            </div>
          ))}
        </div>
      </section>
      <br/>
      <br/>
      <br/>
      <br/>
      <section>
        <div className="max-w-4xl mx-auto mt-8 px-4 text-center">
  <p className="text-lg font-semibold mb-2 text-white-700">
    Find more about Fail U Forward
  </p>
  <div className="flex justify-center gap-6 text-2xl">
    <a href="https://twitter.com/username" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors duration-200">
      <Twitter size={28} />
    </a>
    <a href="https://linkedin.com/in/username" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 transition-colors duration-200">
      <Linkedin size={28} />
    </a>
    <a href="https://github.com/username" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors duration-200">
      <Github size={28} />
    </a>
    <a href="https://instagram.com/username" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors duration-200">
      <Instagram size={28} />
    </a>
  </div>
  <p className="mt-4 text-sm text-gray-500">
    Built with 💙 by{' '}
    <a
      href="https://www.linkedin.com/in/mansi-ruhil-7a00a0228/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline"
    >
      Mansi Ruhil
    </a>
  </p>
</div>
<br/>
<br/>


      </section>
    </div>
  );
};

export default StoryPage;
