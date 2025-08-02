"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,

  updateProfile
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { toast } from "react-toastify";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

type PasswordType = "" | "too short" | "weak" | "medium" | "strong" | "high";

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

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const [uniqueUsername, setUniqueUsername] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signup } = useAuth();

  const router = useRouter();

  useEffect(() => {
    validateForm();
  }, [username, email, password]);

  const validateForm = () => {
    const newErrors: ValidationErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (passwordStrength === "weak" || passwordStrength === "too short") {
      newErrors.password = "Password is too weak. Include uppercase, lowercase, numbers, and special characters";
    }

    setErrors(newErrors);
    setIsFormValid(
      Object.keys(newErrors).length === 0 &&
      Boolean(username) &&
      Boolean(email) &&
      Boolean(password)
    );
  };

  const createUserData = async (user: any, displayName?: string): Promise<void> => {
    const userDocRef = doc(db, "users", user.uid);

    try {
      const userData: UserData = {
        username: displayName || username || user.displayName || "Anonymous",
        email: user.email,
        location: "",
        bio: "",
        profilepic: user.photoURL || "",
        failedExperience: [],
        misEducation: [],
        failureHighlights: []
      };
      await setDoc(userDocRef, userData);
    } catch (error) {
      toast.error("Error creating user data");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsSubmitting(true);
    setErrors({ ...errors, general: undefined });

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      await updateProfile(user, { displayName: username });
      await createUserData(user, username);

      router.push("/feed");
      toast.success("Account created successfully!");
    } catch (err: any) {
      let errorMessage = "An error occurred during signup";
      if (err.code === "auth/email-already-in-use") {
        errorMessage = "An account with this email already exists";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address";
      }
      setErrors({ ...errors, general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const signupWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    setIsSubmitting(true);
    try {
      const result = await signInWithPopup(auth, provider);
      await createUserData(result.user);
      router.push("/feed");
      toast.success("Google signup successful!");
    } catch (err: any) {
      setErrors({ general: "Google signup failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const signupWithGitHub = async () => {
    const provider = new GithubAuthProvider();
    setIsSubmitting(true);
    try {
      const result = await signInWithPopup(auth, provider);
      await createUserData(result.user);
      router.push("/feed");
      toast.success("GitHub signup successful!");
    } catch (err: any) {
      setErrors({ general: "GitHub signup failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };


  const strengthColors: Record<typeof passwordStrength, string> = {
    "": "",
    "too short": "text-yellow-500",
    "weak": "text-red-500",
    "medium": "text-blue-500",
    "strong": "text-orange-500",
    "high": "text-green-500"
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      setPasswordStrength("too short");
      return;
    }

    const checks = [/[a-z]/, /[A-Z]/, /\d/, /[@.#$!%^&*.?]/];
    const levels: PasswordType[] = ["too short", "weak", "medium", "strong", "high"];
    const score = checks.reduce((acc, rgx) => acc + Number(rgx.test(password)), 0);
    setPasswordStrength(levels[score]);
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
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white group relative inline-block">
            Create Account
            {/* Glow/Aura on hover behind heading */}
            <span className="absolute inset-0 rounded-lg blur-2xl opacity-0 group-hover:opacity-70 group-hover:scale-[1.08] transition-all duration-300 bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 -z-10" />
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Join the community and share your journey</p>
        </div>


        {errors.general && (
          <div className="flex items-center gap-2 p-3 text-red-700 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{errors.general}</span>
          </div>
        )}

        {error && <div className="text-red-500 text-center">{error}</div>}


        <form onSubmit={handleSignup} className="space-y-4" noValidate>
          <div className="space-y-2">

            <Label htmlFor="username" className="font-medium text-gray-700 dark:text-gray-200">
              Username
            </Label>
            <div className="relative group">
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                className={`transition-all duration-200 border-gray-300 dark:border-zinc-700 focus:border-blue-500 hover:border-blue-400 dark:hover:border-blue-600
                  focus:ring-blue-500/50 focus:outline-none focus:ring-2 rounded-md bg-white dark:bg-zinc-800
                  text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-400
                  ${errors.username ? "border-red-300 focus:border-red-500 focus:ring-red-500/50" : ""}
                  ${username && !errors.username ? "border-green-300 focus:border-green-500 focus:ring-green-500/50" : ""}
                `}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isSubmitting}
                autoComplete="username"
              />
              {username && !errors.username && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
              )}
            </div>
            {errors.username && (
              <p className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="h-3 w-3" />
                {errors.username}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="font-medium text-gray-700 dark:text-gray-200">
              Email
            </Label>
            <div className="relative group">
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                className={`transition-all duration-200 border-gray-300 dark:border-zinc-700 focus:border-blue-500 hover:border-blue-400 dark:hover:border-blue-600
                  focus:ring-blue-500/50 focus:outline-none focus:ring-2 rounded-md bg-white dark:bg-zinc-800
                  text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-400
                  ${errors.email ? "border-red-300 focus:border-red-500 focus:ring-red-500/50" : ""}
                  ${email && !errors.email ? "border-green-300 focus:border-green-500 focus:ring-green-500/50" : ""}
                `}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                autoComplete="email"
              />
              {email && !errors.email && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
              )}
            </div>
            {errors.email && (
              <p className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="h-3 w-3" />
                {errors.email}
              </p>
            )}

            <Label htmlFor="username" className="font-medium">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter Username"
              className="placeholder:text-gray-500"
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
            {!loading && uniqueUsername && <div className="text-green-500 text-sm">Username is unique</div>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              className="placeholder:text-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="font-medium text-gray-700 dark:text-gray-200">Password</Label>
            <div className="relative group">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                className={`pr-10 transition-all duration-200 border-gray-300 dark:border-zinc-700 focus:border-blue-500 hover:border-blue-400 dark:hover:border-blue-600
                  focus:ring-blue-500/50 focus:outline-none focus:ring-2 rounded-md bg-white dark:bg-zinc-800
                  text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-400
                  ${errors.password ? "border-red-300 focus:border-red-500 focus:ring-red-500/50" : ""}
                  ${password && !errors.password && passwordStrength !== "weak" && passwordStrength !== "too short"
                  ? "border-green-300 focus:border-green-500 focus:ring-green-500/50" : ""}
                `}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                required

                disabled={isSubmitting}
                autoComplete="new-password"

                className={`pr-10 ${outlineColors}`}

              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}

                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                tabIndex={-1}

                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500"

              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {password && (
              <div className="space-y-1">
                <div className={`text-sm font-medium ${strengthColors[passwordStrength]}`}>
                  Password strength: {passwordStrength || "checking..."}
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        passwordStrength === "high" && level <= 4 ? "bg-green-500" :
                        passwordStrength === "strong" && level <= 3 ? "bg-orange-500" :
                        passwordStrength === "medium" && level <= 2 ? "bg-blue-500" :
                        passwordStrength === "weak" && level <= 1 ? "bg-red-500" :
                        passwordStrength === "too short" && level <= 1 ? "bg-yellow-500" :
                        "bg-gray-200 dark:bg-zinc-700"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
            {errors.password && (
              <p className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="h-3 w-3" />
                {errors.password}
              </p>
            )}

            <div className={`text-sm ${textColors}`}>
              {passwordStrength}
            </div>

          </div>

          <Button
            type="submit"
            className={`
              w-full font-medium py-3 rounded-md
              bg-blue-600 hover:bg-blue-700 focus:bg-blue-700
              text-white shadow-md hover:shadow-lg focus:shadow-lg
              transition-transform duration-200 transform hover:scale-[1.02] focus:scale-[1.02]
              ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
              ${!isFormValid && !isSubmitting ? "bg-gray-300 text-gray-500 shadow-none pointer-events-none" : ""}
            `}
            size="lg"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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


        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-zinc-700"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">

            <span className="bg-white dark:bg-zinc-900 px-2 text-gray-500 dark:text-zinc-400">Or continue with</span>

            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>

          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">

          <Button
            type="button"
            variant="outline"
            className="hover:bg-gray-100 hover:text-blue-600 focus:bg-gray-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-zinc-700 text-white dark:hover:text-blue-400 font-medium transition-all duration-200"
            onClick={signupWithGoogle}
            disabled={isSubmitting}
          >
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="hover:bg-gray-100 hover:text-blue-600 focus:bg-gray-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-zinc-700 text-white dark:hover:text-blue-400 font-medium transition-all duration-200"
            onClick={signupWithGitHub}
            disabled={isSubmitting}
          >

          <Button type="button" variant="outline" onClick={signupWithGoogle}>
            Google
          </Button>
          <Button type="button" variant="outline" onClick={signupWithGitHub}>

            GitHub
          </Button>
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium transition-colors">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
