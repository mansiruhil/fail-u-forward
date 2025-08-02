"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { AlertCircle } from "lucide-react";

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
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Form is only valid if both fields are filled
  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      await mergeUserData(user);

      router.push("/feed");
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await mergeUserData(user);

      router.push("/feed");
    } catch (err: any) {
      setError(err.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    setError("");
    setLoading(true);
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await mergeUserData(user);

      router.push("/feed");
    } catch (err: any) {
      setError(err.message || "GitHub sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-black">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md p-8 space-y-6 
          bg-white dark:bg-zinc-900 
          rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome</h1>
        </div>
        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700 rounded px-3 py-2 mb-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-800 dark:text-gray-200">
              Email
            </Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="user@example.com"
              className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-zinc-400"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-800 dark:text-gray-200">
              Password
            </Label>
            <Input 
              id="password" 
              type="password"
              placeholder="Enter your password"
              className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-zinc-400"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            className={`
              w-full font-semibold py-2 
              transition-all duration-200 rounded-lg
              bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white
              dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:bg-blue-600
              shadow-md hover:shadow-lg focus:shadow-lg
              disabled:bg-gray-300 dark:disabled:bg-zinc-700 disabled:text-gray-500 disabled:cursor-not-allowed
              ${!isFormValid || loading ? "pointer-events-none" : ""}
            `}
            size="lg"
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="text-center text-sm">
          <Link href="/forgot-password" className="text-primary hover:underline dark:text-blue-400">
            Forgot your password?
          </Link>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-zinc-900 px-2 text-gray-500 dark:text-zinc-400">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
         <Button 
          type="button"
          variant="outline"
          className="hover:bg-gray-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-zinc-700 text-white"
          onClick={handleGoogleSignIn}
          disabled={loading}
          >
          Google
        </Button>
        <Button 
          type="button"
          variant="outline"
          className="hover:bg-gray-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-zinc-700 text-white"
          onClick={handleGitHubSignIn}
          disabled={loading}
        >
        GitHub
        </Button>

        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-300">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary dark:text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
