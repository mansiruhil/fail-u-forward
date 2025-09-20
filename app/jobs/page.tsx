"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshButton } from "@/components/ui/refresh-button";
import Link from "next/link";

export default function FailedJobs() {
  const [fails, setFails] = useState([
    { id: 1, title: "The Sandwich Artist Who Couldn't Make A Sandwich", description: "I put toothpaste instead of mayo. The customer was not happy. I also forgot the bread.", image: "/failed-sandwich.jpg" },
    { id: 2, title: "The Barista Who Couldn't Brew Coffee", description: "The coffee machine exploded. Turns out it wasn't plugged in... Oops", image: "/failed-coffee.jpg" },
    { id: 3, title: "The Delivery Driver Who Got Lost in the Parking Lot", description: "How do you get lost in a parking lot? I still don't know. I took 40 minutes to find my car.", image: "/failed-delivery.jpg" },
    { id: 4, title: "The Chef Who Created The Worst Soup Ever", description: "I confused salt with sugar. People were *salty* about that one.", image: "/failed-soup.jpg" },
    { id: 5, title: "The Office Worker Who Sent a Personal Email to The Whole Company", description: "I accidentally emailed a meme about cats to the CEO. He's a dog person.", image: "/failed-email.jpg" },
  ]);

  const handleRefresh = async () => {
    // Force a page refresh to reload all data
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-end mb-4">
        <RefreshButton onRefresh={handleRefresh} size="sm" />
      </div>
      {/* Hero Section */}
      <div className="text-center my-20">
        <h1 className="text-4xl font-bold text-primary">Failed Jobs: Where Things Go Hilariously Wrong</h1>
        <p className="text-xl text-secondary mt-4">
          Everyone's had that one day at work where things didn't quite go as planned. But sometimes, it's *really* funny. Let's relive those epic moments together.
        </p>
      </div>

      {/* Job Fails Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {fails.map((fail) => (
          <div key={fail.id} className="bg-white border border-gray-200 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-200 flex flex-col justify-between">
            <img
              src={fail.image}
              alt={fail.title}
              className="w-full h-auto object-cover rounded-t-lg mb-4"
            />
            <h3 className="font-semibold text-xl mb-2">{fail.title}</h3>
            <p className="text-secondary mb-4">{fail.description}</p>
            <div className="mt-auto flex justify-between items-center">
              <Link href={`/failed-jobs/${fail.id}`} className="text-primary hover:underline">Read more</Link>
              <Button>
                Laugh
              </Button>
            </div>
          </div>
        ))}
      </div>


      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold text-primary my-20">Top 3 Epic Fails</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fails.slice(0, 3).map((fail) => (
            <div key={fail.id} className="bg-white border border-gray-200 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-200 flex flex-col justify-between">
            <img
              src={fail.image}
              alt={fail.title}
              className="w-full h-auto object-cover rounded-t-lg mb-4"
            />
            <h3 className="font-semibold text-xl mb-2">{fail.title}</h3>
            <p className="text-secondary mb-4">{fail.description}</p>
          </div>
          ))}
        </div>
      </div>


      <div className="mt-12 text-center">
        <Link href="/submit-fail" className="text-xl text-primary hover:underline">
          Fail? Share It Here.
        </Link>
      </div>
    </div>
  );
}