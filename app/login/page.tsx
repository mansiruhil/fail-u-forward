"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { toast } from "react-toastify";
import { InputWithIcon } from "@/components/ui/input";

interface UserData {
  username: string;
  email: string;
  location?: string;
  bio?: string;
  profilepic?: string;
  failedExperience?: string[];
  misEducation?: string[];
  failureHighlights?: string[];
}

const mergeUserData = async (user: any): Promise<UserData> => {
  const userDocRef = doc(db, "users", user.uid);
  
  try {
    const userDocSnap = await getDoc(userDocRef);
    const existingData = userDocSnap.exists() ? userDocSnap.data() : {};

    const updatedUserData: UserData = {
      username: user.displayName || existingData.username || "Anonymous",
      email: user.email || existingData.email,
      location: existingData.location || "",
      bio: existingData.bio || "",
      profilepic: existingData.profilepic || "",
      failedExperience: existingData.failedExperience || [],
      misEducation: existingData.misEducation || [],
      failureHighlights: existingData.failureHighlights || []
    };

    await setDoc(userDocRef, updatedUserData, { merge: true });

    return updatedUserData;
  } catch (error) {
    console.error("Error merging user data:", error);
    toast.error("Error processing user data");
    throw error;
  }
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      await mergeUserData(user);

      router.push("/feed");
    } catch (err: any) {
      setError(err.message);
      toast.error("Login failed");
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await mergeUserData(user);

      router.push("/feed");
    } catch (err: any) {
      setError(err.message);
      toast.error("Google sign-in failed");
    }
  };

  const handleGitHubSignIn = async () => {
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await mergeUserData(user);

      router.push("/feed");
    } catch (err: any) {
      setError(err.message);
      toast.error("GitHub sign-in failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md p-6 space-y-4 bg-card rounded-lg shadow-lg border"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold">Login</h1>
        </div>

        {error && (
          <div className="text-red-500 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <InputWithIcon 
              icon="user"
              id="email" 
              type="email" 
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <InputWithIcon 
              icon="key"
              id="password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="mt-20 w-full" size="lg">
            Sign In
          </Button>
        </form>

        <div className="text-center text-sm">
          <Link href="/forgot-password" className="text-primary hover:underline">
            <strong>Forgot your password?</strong> 
          </Link>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button 
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
          >
            Google
          </Button>
          <Button 
            type="button"
            variant="outline"
            onClick={handleGitHubSignIn}
          >
            GitHub
          </Button>
        </div>

        <p className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            <strong>Sign up</strong>
          </Link>
        </p>
      </motion.div>
    </div>
  );
}