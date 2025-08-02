"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

import { useAuth } from "@/contexts/AuthContext";

// Password strength types
type PasswordType = "" | "short" | "weak" | "medium" | "strong" | "high";

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

interface ValidationErrors {
  username?: string;
  email?: string;
  password?: string;
  general?: string;
}

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState<PasswordType>("");

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const [uniqueUsername, setUniqueUsername] = useState<boolean | null>(null);
  const [usernameChecking, setUsernameChecking] = useState(false);

  const { signup } = useAuth();
  const router = useRouter();

  // Validate form on every field change
  useEffect(() => {
    validateForm();
  }, [username, email, password, passwordStrength]);

  // Password strength logic
  const validatePasswordStrength = (pwd: string) => {
    if (pwd.length < 6) {
      setPasswordStrength("short");
      return;
    }
    const tests = [/[a-z]/, /[A-Z]/, /\d/, /[@.#$!%^&*.?]/];
    let score = tests.reduce((acc, rx) => acc + Number(rx.test(pwd)), 0);
    const levels: PasswordType[] = ["short", "weak", "medium", "strong", "high"];
    setPasswordStrength(levels[Math.min(score, levels.length - 1)]);
  };

  // Basic form validation & errors
  const validateForm = () => {
    const newErr: ValidationErrors = {};

    if (!username.trim()) newErr.username = "Username is required";
    else if (username.length < 3) newErr.username = "Must be at least 3 chars";
    else if (!/^[\w\d_]+$/.test(username)) newErr.username = "Only letters, numbers & _";

    if (!email.trim()) newErr.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErr.email = "Invalid email";

    if (!password) newErr.password = "Password is required";
    else if (passwordStrength === "short" || passwordStrength === "weak")
      newErr.password = "Include uppercase, lowercase, number & symbol";

    setErrors(newErr);
    setIsFormValid(
    Object.keys(newErr).length === 0 &&
    Boolean(username) &&
    Boolean(email) &&
    Boolean(password)
  );


  const createUserData = async (user: any, displayName?: string) => {
    const docRef = doc(db, "users", user.uid);
    const data: UserData = {
      username: displayName || username || user.displayName || "Anonymous",
      email: user.email || "",
      location: "",
      bio: "",
      profilepic: user.photoURL || "",
      failedExperience: [],
      misEducation: [],
      failureHighlights: [],
    };
    await setDoc(docRef, data);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName: username });
      await createUserData(res.user, username);
      toast.success("Account created!");
      router.push("/feed");
    } catch (err: any) {
      const msg =
        err.code === "auth/email-already-in-use"
          ? "Email already in use"
          : err.code === "auth/invalid-email"
          ? "Invalid email"
          : err.code === "auth/weak-password"
          ? "Weak password"
          : "Signup failed";
      setErrors({ general: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const signupWithProvider = async (provider: GoogleAuthProvider | GithubAuthProvider, providerName: string) => {
    setIsSubmitting(true);
    setErrors({});
    try {
      const result = await signInWithPopup(auth, provider as any);
      await createUserData(result.user);
      toast.success(`${providerName} signup successful!`);
      router.push("/feed");
    } catch {
      setErrors({ general: `${providerName} signup failed. Try again.` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUsernameCheck = async (val: string) => {
    setUsername(val);
    if (!val || val.length < 3) {
      setUniqueUsername(null);
      return;
    }
    setUsernameChecking(true);
    try {
      const res = await fetch("/api/check-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: val }),
      });
      const { available } = await res.json();
      setUniqueUsername(available);
    } catch {
      setUniqueUsername(false);
    } finally {
      setUsernameChecking(false);
    }
  };

  const strengthColor = {
    short: "text-yellow-500",
    weak: "text-red-500",
    medium: "text-blue-500",
    strong: "text-orange-500",
    high: "text-green-500",
    "": "",
  }[passwordStrength];

  const outlineColor = {
    short: "!outline-yellow-500",
    weak: "!outline-red-500",
    medium: "!outline-blue-500",
    strong: "!outline-orange-500",
    high: "!outline-green-500",
    "": "",
  }[passwordStrength];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700"
      >

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white relative group inline-block">
            Create Account
            <span className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 blur-2xl opacity-0 group-hover:opacity-70 group-hover:scale-[1.08] transition-all duration-300 -z-10 rounded-lg" />
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Join the community and share your journey</p>
        </div>

        {errors.general && (
          <div className="flex items-center gap-2 p-3 text-red-700 bg-red-50 dark:bg-red-900/30 border dark:border-red-700 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4" noValidate>
          {/* Username field with availability check */}
          <div className="space-y-2 relative">
            <Label htmlFor="username" className="font-medium text-gray-700 dark:text-gray-200">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={e => handleUsernameCheck(e.target.value)}
              disabled={isSubmitting}
              autoComplete="username"
              className={`transition-all duration-200 ${errors.username ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : username && !errors.username ? "border-green-300 focus:border-green-500 focus:ring-green-500" : ""}`}
              required
            />
            {usernameChecking && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin" />}
            {uniqueUsername && !usernameChecking && !errors.username && (
              <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500"/>
            )}
            {errors.username && (
              <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.username}</p>
            )}
            {uniqueUsername === false && !errors.username && !usernameChecking && (
              <p className="text-sm text-red-600">Username is taken</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="font-medium text-gray-700 dark:text-gray-200">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={isSubmitting}
              autoComplete="email"
              className={`transition-all duration-200 ${errors.email ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : email && !errors.email ? "border-green-300 focus:border-green-500 focus:ring-green-500" : ""}`}
              required
            />
            {errors.email && (
              <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2 relative">
            <Label htmlFor="password" className="font-medium text-gray-700 dark:text-gray-200">Password</Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                validatePasswordStrength(e.target.value);
              }}
              disabled={isSubmitting}
              autoComplete="new-password"
              className={`pr-10 transition-all duration-200 ${outlineColor}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
            </button>

            {password && (
              <div>
                <div className={`text-sm font-medium ${strengthColor}`}>Strength: {passwordStrength}</div>
                <div className="flex gap-1">
                  {[1,2,3,4].map(idx => (
                    <div key={idx}
                      className={`h-1 flex-1 rounded-full ${
                        (passwordStrength === "high" && idx <= 4) ||
                        (passwordStrength === "strong" && idx <= 3) ||
                        (passwordStrength === "medium" && idx <= 2) ||
                        (passwordStrength === "weak" && idx <= 1) ?
                        {
                          high: "bg-green-500", strong: "bg-orange-500",
                          medium: "bg-blue-500", weak: "bg-red-500",
                        }[passwordStrength] : "bg-gray-200 dark:bg-zinc-700"}`
                    }/>
                  ))}
                </div>
              </div>
            )}
            {errors.password && (
              <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className={`w-full py-3 font-medium rounded-md shadow-md transform transition duration-200 hover:scale-[1.02] ${
              isFormValid && !isSubmitting ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none"
            }`}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2 justify-center">
                <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"/>
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="text-center text-sm">
          <Link href="/forgot-password" className="text-primary hover:underline">
            Forgot your password?
          </Link>
        </div>

        <div className="relative text-center my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-zinc-700"/>
          </div>
          <span className="relative px-2 bg-white dark:bg-zinc-900 text-xs uppercase text-gray-500 dark:text-gray-400">
            Or continue with
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => signupWithProvider(new GoogleAuthProvider(), "Google")}
            disabled={isSubmitting}
          >
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => signupWithProvider(new GithubAuthProvider(), "GitHub")}
            disabled={isSubmitting}
          >
            GitHub
          </Button>
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
            Sign In
          </Link>
        </p>

      </motion.div>
    </div>
  );
}
