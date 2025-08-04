"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  getAuth
} from "firebase/auth";
import { firebaseApp } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Loader2 } from "lucide-react";

type PasswordType = "" | "short" | "weak" | "medium" | "strong" | "high";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordType>("");
  const [uniqueUsername, setUniqueUsername] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const textColors = {
    "": "",
    "short": "text-yellow-500",
    "weak": "text-red-500",
    "medium": "text-blue-500",
    "strong": "text-orange-500",
    "high": "text-green-500",
  }[passwordStrength];

  const outlineColors = {
    "": "",
    "short": "!outline-yellow-500",
    "weak": "!outline-red-500",
    "medium": "!outline-blue-500",
    "strong": "!outline-orange-500",
    "high": "!outline-green-500",
  }[passwordStrength];

  const validatePassword = (password: string) => {
    const checks = [/[a-z]/, /[A-Z]/, /\d/, /[@.#$!%^&*.?]/];
    const levels: PasswordType[] = ["short", "weak", "medium", "strong", "high"];
    const score = checks.reduce((acc, rgx) => acc + Number(rgx.test(password)), 0);
    setPasswordStrength(levels[score]);
  };

  const checkUsernameAvailability = async (name: string) => {
    try {
      const res = await fetch("/api/check-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name }),
      });
      const data = await res.json();
      return data.available;
    } catch (err) {
      console.error("Username check failed", err);
      return false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 relative overflow-hidden">

      <div className="absolute inset-0 overflow-hidden">
        <motion.div className="absolute top-20 left-20 w-4 h-4 bg-white/30 rounded-full" 
          animate={{ y: [0, -120, 0], x: [0, 60, 0], opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
        
        <motion.div className="absolute top-40 right-32 w-3 h-3 bg-white/40 rounded-full"
          animate={{ y: [0, -100, 0], x: [0, -40, 0], opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
        
        <motion.div className="absolute bottom-32 left-40 w-5 h-5 bg-white/25 rounded-full"
          animate={{ y: [0, -80, 0], x: [0, 50, 0], opacity: [0, 1, 0], scale: [0, 1.3, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }} />
        
        <motion.div className="absolute top-60 left-1/3 w-3.5 h-3.5 bg-white/35 rounded-full"
          animate={{ y: [0, -110, 0], x: [0, -30, 0], opacity: [0, 1, 0], scale: [0, 1.4, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }} />
        
        <motion.div className="absolute bottom-40 right-20 w-4 h-4 bg-white/20 rounded-full"
          animate={{ y: [0, -90, 0], x: [0, -35, 0], opacity: [0, 1, 0], scale: [0, 1.1, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 4 }} />
        
        <motion.div className="absolute top-32 right-40 w-2.5 h-2.5 bg-white/45 rounded-full"
          animate={{ y: [0, -95, 0], x: [0, 25, 0], opacity: [0, 1, 0], scale: [0, 1.6, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 5 }} />

        <motion.div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-white/5 to-white/10 rounded-full blur-3xl"
          animate={{ x: [0, 120, 0], y: [0, -60, 0], scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} />
        
        <motion.div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-l from-white/5 to-white/8 rounded-full blur-3xl"
          animate={{ x: [0, -100, 0], y: [0, 40, 0], scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 7 }} />
        
        <motion.div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-white/3 to-white/6 rounded-full blur-3xl"
          animate={{ x: [0, -80, 0], y: [0, 60, 0], scale: [1, 1.4, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 10 }} />

      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.8, 
          ease: "easeOut",
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
        className="w-full max-w-md p-8 space-y-6 backdrop-blur-xl bg-white/5 rounded-3xl shadow-2xl border border-white/10 relative z-10 hover:bg-white/8 hover:border-white/20 transition-all duration-500 hover:shadow-white/5 hover:shadow-2xl"
      >
        <motion.div 
          className="space-y-2 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
        >
          <motion.h1 
            className="text-3xl font-bold"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: 0.5, 
              duration: 0.8,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
          >
            Welcome
          </motion.h1>
        </motion.div>

        {error && (
          <motion.div 
            className="text-red-500 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        <motion.form 
            onSubmit={handleSignup} 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
         <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Label htmlFor="username" className="font-medium text-white/90">Username</Label>
            <div className="relative group">
            <Input
              id="username"
              type="text"
              placeholder="Enter Username"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/60 hover:bg-white/15 hover:border-white/30 transition-all duration-300 focus:shadow-lg focus:shadow-white/20 backdrop-blur-sm"
              value={username}
              onChange={async (e) => {
                const value = e.target.value;
                setUsername(value);
                setLoading(true);
                const isAvailable = await checkUsernameAvailability(value);
                setUniqueUsername(isAvailable);
                setLoading(false);
              }}
              required
            />
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            </div>
            {!loading && uniqueUsername && (
              <motion.div 
                className="text-green-500 text-sm"
                initial={{ opacity: 0, x: -10, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.4, type: "spring" }}
              >
                Username is unique
              </motion.div>
            )}
          </motion.div>

          <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
            <Label htmlFor="email" className="font-medium text-white/90">Email</Label>
            <div className="relative group">
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/60 hover:bg-white/15 hover:border-white/30 transition-all duration-300 focus:shadow-lg focus:shadow-white/20 backdrop-blur-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <motion.div
              className="absolute inset-0 rounded-md bg-gradient-to-r from-white/10 to-white/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"
              initial={false}
            />
            </div>
          </motion.div>

          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Label htmlFor="password" className="font-medium text-white/90">Password</Label>
            <div className="relative group">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                required
                 className={`pr-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/60 hover:bg-white/15 hover:border-white/30 transition-all duration-300 focus:shadow-lg focus:shadow-white/20 backdrop-blur-sm ${outlineColors}`}
              />
              <motion.div
                className="absolute inset-0 rounded-md bg-gradient-to-r from-white/10 to-white/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"
                initial={false}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90 z-10 transition-colors duration-200 focus:outline-none focus:text-white/90 p-1 rounded"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className={`text-sm ${textColors}`}>
              {passwordStrength}
            </div>
          </motion.div>

          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-white to-gray-100 hover:from-gray-100 hover:to-white text-black font-semibold shadow-lg hover:shadow-xl hover:shadow-white/25 transition-all duration-300" 
                size="lg"
              >
                Sign Up
              </Button>
            </motion.div>
          </motion.div>
        </motion.form>

        <motion.div 
          className="text-center text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <Link href="/forgot-password" className="text-white/80 hover:text-white hover:underline transition-all duration-200 hover:scale-105 inline-block">
            Forgot your password?
          </Link>
        </motion.div>

        <motion.div 
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Button 
              type="button" 
              variant="outline" 
              onClick={signupWithGoogle} 
              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:shadow-lg backdrop-blur-sm"
            >
              Google
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Button 
              type="button" 
              variant="outline" 
              onClick={signupWithGitHub} 
              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:shadow-lg backdrop-blur-sm"
            >
              GitHub
            </Button>
          </motion.div>
        </motion.div>

        <motion.p 
          className="text-center text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.5 }}
        >
          Have an account?{" "}
          <Link href="/login" className="text-white/80 hover:text-white hover:underline transition-all duration-200 font-medium hover:scale-105 inline-block">
            Log In
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}