"use client";

import { useEffect, useState } from "react";
import { CreatePost } from "@/components/post/create-post";
import { LeftSidebar } from "@/components/sidebar/leftsidebar";
import { RightSidebar } from "@/components/sidebar/rightsidebar";
import { useRouter } from "next/navigation";
import { firebaseApp } from "@/lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Spinner } from "@heroui/spinner";
import { toast } from "react-toastify";
import Head from "next/head";

export default function Feed() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    }, (error) => {
      // Handle auth state error if any
      toast.error(`Error fetching user data: ${error.message || error}`);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center dark:bg-black">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-background container max-h-screen mx-auto px-4 py-8">
      <Head>
        <title>Feed — Fail U Forward</title>
        <meta name="description" content="Explore the latest stories of setbacks and learning from the Fail U Forward community." />
        <meta property="og:title" content="Feed — Fail U Forward" />
        <meta property="og:description" content="Explore the latest stories of setbacks and learning." />
        <meta property="og:image" content="https://failuforward.vercel.app/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className="hidden lg:block">
        <LeftSidebar />
      </div>

      <main className="flex-1 h-screen overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-hide max-w-2xl no-scrollbar md:mx-[28%]">
        <CreatePost />
      </main>

      <div className="hidden lg:block">
        <RightSidebar />
      </div>
    </div>
  );
}
