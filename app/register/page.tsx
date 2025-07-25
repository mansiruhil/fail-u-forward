"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider 
} from "firebase/auth";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { InputWithIcon } from "@/components/ui/input/input-with-icon";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const router = useRouter();
  const auth = getAuth(firebaseApp);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signup(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const signupWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const signupWithGitHub = async () => {
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
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
        <div className="space-y-1 text-center">
          <h1 className="text-3xl font-bold">Sign Up</h1>
        </div>

        {error && (
          <div className="text-red-500 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <InputWithIcon 
              id="username"
              icon="user" 
              type="text" 
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <InputWithIcon
              icon="message"
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

          <Button type="submit" className="!mt-4 w-full" size="lg">
            Sign Up
          </Button>
        </form>

        <div className="text-center text-sm">
          <Link
            href="/forgot-password"
            className="text-primary hover:underline"
          >
            <strong>Forgot your password?</strong> 
          </Link>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button 
            type="button"
            variant="outline" 
            onClick={signupWithGoogle}
          >
            Google
          </Button>
          <Button 
            type="button"
            variant="outline"
            onClick={signupWithGitHub}
          >
            GitHub
          </Button>
        </div>

        <p className="text-center text-sm">
          Have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            <strong>Log In</strong>
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
