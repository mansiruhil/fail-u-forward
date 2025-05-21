"use client";
import { useEffect,useState } from "react";
import { CreatePost } from "@/components/post/create-post";
import { LeftSidebar } from "@/components/sidebar/leftsidebar";
import { RightSidebar } from "@/components/sidebar/rightsidebar";
import { useRouter } from "next/navigation";
import { firebaseApp } from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { HashLoader } from "react-spinners";
import { toast } from "react-toastify";
export default function Feed() {
  const router =useRouter()
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    try {
    const auth = getAuth(firebaseApp)
    const user = auth.currentUser
    if(!user){
      router.push("/login");
      return
    } 
    else{
      setLoading(false)
    }
    } catch (error:any) {
      toast.error("Error fetching user data:", error);
    }
   
  }, [router])
  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <HashLoader color="white"/>
    </div>
  );

  return (
    <div className="container max-h-screen mx-auto px-4 py-8">
      <div className="lg:block">
          <LeftSidebar />
        </div>
        
        <main className="flex-1 h-screen overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-hide max-w-2xl no-scrollbar md:mx-[28%]">
        <CreatePost />
        
        </main>
        
        <div className="lg:block">
          <RightSidebar />
        </div>
    </div>
  );
}