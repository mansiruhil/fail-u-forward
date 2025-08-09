"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { toast } from "react-toastify";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";

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

function calculatePasswordStrength(password: string): { score: number; label: string; color: string } {
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (password.length <= 3 && !hasSpecial) {
    return { score: 1, label: "Weak", color: "#ef4444" };
  }

  if (password.length > 3 && password.length < 8 && !hasSpecial) {
    return { score: 2, label: "Medium", color: "#eab308" };
  }

  if (password.length >= 8 || hasSpecial) {
    return { score: 3, label: "Strong", color: "#22c55e" };
  }

  return { score: 1, label: "Weak", color: "#ef4444" };
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
      failureHighlights: existingData.failureHighlights || [],
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
  const [showPassword, setShowPassword] = useState(false);
  const [iconFlipped, setIconFlipped] = useState(false);
  const flipControls = useAnimation();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
    color: "transparent"
  });

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

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password));
  }, [password]);

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

  const handleEyeToggle = async () => {
    await flipControls.start({ rotateY: 90, transition: { duration: 0.17 } });
    setIconFlipped(f => !f);
    setShowPassword(v => !v);
    await flipControls.start({ rotateY: 0, transition: { duration: 0.17 } });
  };

  return (

    <div
      ref={vantaRef}
      className="relative min-h-screen w-full flex items-center justify-center bg-black"
    >
      <div className="absolute inset-0 bg-black opacity-70 pointer-events-none z-10" />
      <main role="main">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="
            relative z-20 w-full max-w-md p-8 space-y-6 
            bg-white/70 dark:bg-zinc-900/70 
            rounded-2xl 
            shadow-xl shadow-black/20 dark:shadow-black/50
            border border-gray-200 dark:border-zinc-700 
            backdrop-blur-md
          "
        >

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-3xl sm:text-3xl font-bold text-gray-900 dark:text-white">Welcome</h1>
        </motion.div>

        {error && (
          <div 
            className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700 rounded px-3 py-2 mb-2"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-800 dark:text-gray-200">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 rounded-md transition duration-300 ease-in-out hover:border-blue-400 outline-none"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              aria-describedby="email-description"
              aria-invalid={error ? 'true' : 'false'}
            />
            <div id="email-description" className="sr-only">
              Enter your email address to sign in to your account
            </div>
          </div>

          <div className="space-y-2 relative">
            <Label htmlFor="password" className="text-gray-800 dark:text-gray-200">
              Password
            </Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-zinc-400 pr-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 rounded-md transition duration-300 ease-in-out hover:border-blue-400 outline-none"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              aria-describedby="password-description password-strength"
              aria-invalid={error ? 'true' : 'false'}
            />
            <div id="password-description" className="sr-only">
              Enter your password to sign in to your account
            </div>
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={handleEyeToggle}
              tabIndex={-1}
              disabled={loading}
              className="absolute right-3 top-7 p-1 rounded focus:outline-none focus:ring-0 transition"
            >
              <motion.span animate={flipControls} initial={{ rotateY: 0 }} style={{ display: "inline-flex", perspective: 400 }} className="flex items-center">
                {iconFlipped ? (
                  <EyeOff className="w-5 h-5 text-gray-500 dark:text-zinc-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-500 dark:text-zinc-400" />
                )}
              </motion.span>
            </button>

            {password.length > 0 && (
              <div className="mt-1" id="password-strength">
                <div 
                  className="h-2 rounded-full bg-gray-200 dark:bg-zinc-700 relative"
                  role="progressbar"
                  aria-valuenow={passwordStrength.score}
                  aria-valuemin={0}
                  aria-valuemax={3}
                  aria-label={`Password strength: ${passwordStrength.label}`}
                >
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(passwordStrength.score / 3) * 100}%`,
                      backgroundColor: passwordStrength.color,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      bottom: 0
                    }}
                  />
                </div>
                <p 
                  className="mt-1 text-xs font-medium select-none" 
                  style={{ color: passwordStrength.color }}
                  aria-live="polite"
                >
                  Password strength: {passwordStrength.label}
                </p>
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={!isFormValid || loading}
            size="lg"
            className={`w-full font-semibold py-2 transition-all duration-200 rounded-lg bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:bg-blue-600 shadow-md hover:shadow-lg focus:shadow-lg disabled:bg-gray-300 dark:disabled:bg-zinc-700 disabled:text-gray-500 disabled:cursor-not-allowed ${!isFormValid || loading ? "pointer-events-none" : ""}`}
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
            <div className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-zinc-900 px-2 text-gray-500 dark:text-zinc-400">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
         <Button 
          type="button"
          variant="outline"
          className="hover:bg-gray-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={handleGoogleSignIn}
          disabled={loading}
          aria-describedby="google-signin-description"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              width="20px" 
              height="20px"
              aria-hidden="true"
            >
              <path
                d="M12.24 10.29v3.52h6.21c-.3.86-.87 1.88-1.74 2.54-.87.66-2.15 1.15-3.66 1.15-3.35 0-6.07-2.72-6.07-6.07s2.72-6.07 6.07-6.07c1.51 0 2.82.43 3.87 1.34l2.87-2.87C17.58 2.96 15.02 2 12.24 2 6.64 2 2 6.64 2 12s4.64 10 10.24 10c6.01 0 9.87-4.14 9.87-10.14 0-.69-.06-1.35-.16-1.97H12.24z"
                fill="currentColor"
              />
            </svg>
            <span className="google px-3">Continue with Google</span>
          </Button>
          <div id="google-signin-description" className="sr-only">
            Sign in using your Google account
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleGitHubSignIn}
            disabled={loading}
            className="flex items-center justify-center space-x-2 w-full hover:bg-gray-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-zinc-700 text-sm px-1 py-1 text-white transition rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-describedby="github-signin-description"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-5 w-5 text-black dark:text-white"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M12 0a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.6-2.8-.3-5.7-1.4-5.7-6.2 0-1.4.5-2.6 1.3-3.5-.1-.3-.6-1.7.1-3.5 0 0 1-.3 3.4 1.3a11.9 11.9 0 0 1 6 0c2.4-1.6 3.4-1.3 3.4-1.3.7 1.8.2 3.2.1 3.5.9.9 1.3 2.1 1.3 3.5 0 4.8-2.9 5.9-5.7 6.2.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 0z"
              />
            </svg>
            <span className="github px-3">Continue with GitHub</span>
          </Button>
          <div id="github-signin-description" className="sr-only">
            Sign in using your GitHub account
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-300">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary dark:text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
        </motion.div>
      </main>
    </div>
  );
}
