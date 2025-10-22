"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes } from "react";
import { useRouter } from "next/navigation";

// mock components 
const Button = ({
  children,
  className,
  type,
  disabled,
  onClick,
  ...props
}: {
  children: ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
} & ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type={type}
    className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${className}`}
    disabled={disabled}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

const Input = ({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 ${className}`}
    {...props}
  />
);


const Label = ({
  children,
  htmlFor,
  className
}: {
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium ${className}`}>
    {children}
  </label>
);


const Link = ({
  href,
  children,
  className
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) => (
  <a href={href} className={className}>
    {children}
  </a>
);

// Password strength types
type PasswordType = "" | "short" | "weak" | "medium" | "strong" | "high";

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
  const router = useRouter();

  const handleRefresh = async () => {
    // Force a page refresh to reload all data
    window.location.reload();
  };

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
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsSubmitting(true);
    setErrors({});

    try {
      // Mock signup logic - replace with your actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Account created successfully!");
      // router.push("/feed");
       router.push("/login");
    } catch (err: any) {
      setErrors({ general: "Signup failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const signupWithProvider = async (providerName: string) => {
    setIsSubmitting(true);
    setErrors({});
    try {
      // Mock provider signup - replace with your actual implementation
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log(`${providerName} signup successful!`);
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
      // Mock username check - replace with your actual API call
      await new Promise(resolve => setTimeout(resolve, 800));
      const available = Math.random() > 0.5; // Random for demo
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
    short: "!border-yellow-500",
    weak: "!border-red-500",
    medium: "!border-blue-500",
    strong: "!border-orange-500",
    high: "!border-green-500",
    "": "",
  }[passwordStrength];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-20 left-20 w-4 h-4 bg-white/30 rounded-full" 
          animate={{ 
            y: [0, -120, 0], 
            x: [0, 60, 0], 
            opacity: [0, 1, 0], 
            scale: [0, 1.2, 0] 
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }} 
        />
         
        <motion.div 
          className="absolute top-40 right-32 w-3 h-3 bg-white/40 rounded-full"
          animate={{ 
            y: [0, -100, 0], 
            x: [0, -40, 0], 
            opacity: [0, 1, 0], 
            scale: [0, 1.5, 0] 
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut", 
            delay: 1 
          }} 
        />
        
        <motion.div 
          className="absolute bottom-32 left-40 w-5 h-5 bg-white/25 rounded-full"
          animate={{ 
            y: [0, -80, 0], 
            x: [0, 50, 0], 
            opacity: [0, 1, 0], 
            scale: [0, 1.3, 0] 
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity, 
            ease: "easeInOut", 
            delay: 2 
          }} 
        />

        <motion.div 
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-white/5 to-white/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, 120, 0], 
            y: [0, -60, 0], 
            scale: [1, 1.3, 1], 
            opacity: [0.2, 0.5, 0.2] 
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }} 
        />
        
        <motion.div 
          className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-l from-white/5 to-white/8 rounded-full blur-3xl"
          animate={{ 
            x: [0, -100, 0], 
            y: [0, 40, 0], 
            scale: [1.2, 1, 1.2], 
            opacity: [0.3, 0.6, 0.3] 
          }}
          transition={{ 
            duration: 18, 
            repeat: Infinity, 
            ease: "easeInOut", 
            delay: 7 
          }} 
        />
      </div>

      {/* Main Form */}
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
            className="text-3xl font-bold text-white"
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
            Create Account
          </motion.h1>
          <p className="text-white/70">Join the community and share your journey</p>
        </motion.div>

        {errors.general && (
          <motion.div 
            className="flex items-center gap-2 p-3 text-red-300 bg-red-500/20 border border-red-500/30 rounded-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{errors.general}</span>
          </motion.div>
        )}

        <motion.form 
          dir="ltr"
          onSubmit={handleSignup} 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {/* Username Field */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Label htmlFor="username" className="font-medium text-white/90">
              Username
            </Label>
            <div className="relative group">
              <Input
                id="username"
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={e => handleUsernameCheck(e.target.value)}
                disabled={isSubmitting}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/60 hover:bg-white/15 hover:border-white/30 transition-all duration-300 focus:shadow-lg focus:shadow-white/20 backdrop-blur-sm"
                required
              />
              <motion.div
                className="absolute inset-0 rounded-md bg-gradient-to-r from-white/10 to-white/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"
                initial={false}
              />

              {usernameChecking && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-white/60" />
              )}
              {uniqueUsername && !usernameChecking && !errors.username && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400"/>
              )}
            </div>
            
            {!usernameChecking && uniqueUsername && !errors.username && (
              <motion.div 
                className="text-green-400 text-sm"
                initial={{ opacity: 0, x: -10, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.4, type: "spring" }}
              >
                Username is available
              </motion.div>
            )}
            {errors.username && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3"/>
                {errors.username}
              </p>
            )}
            {uniqueUsername === false && !errors.username && !usernameChecking && (
              <p className="text-sm text-red-400">Username is taken</p>
            )}
          </motion.div>

          {/* Email Field */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Label htmlFor="email" className="font-medium text-white/90">
              Email
            </Label>
            <div className="relative group">
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/60 hover:bg-white/15 hover:border-white/30 transition-all duration-300 focus:shadow-lg focus:shadow-white/20 backdrop-blur-sm"
                required
              />
              <motion.div
                className="absolute inset-0 rounded-md bg-gradient-to-r from-white/10 to-white/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"
                initial={false}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3"/>
                {errors.email}
              </p>
            )}
          </motion.div>

          {/* Password Field */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Label htmlFor="password" className="font-medium text-white/90">
              Password
            </Label>
            <div className="relative group">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePasswordStrength(e.target.value);
                }}
                disabled={isSubmitting}
                className={`pr-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/60 hover:bg-white/15 hover:border-white/30 transition-all duration-300 focus:shadow-lg focus:shadow-white/20 backdrop-blur-sm ${outlineColor}`}
                required
              />
              <motion.div
                className="absolute inset-0 rounded-md bg-gradient-to-r from-white/10 to-white/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"
                initial={false}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-1 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90 z-10 transition-colors duration-200 focus:outline-none focus:text-white/90 p-1 rounded"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {password && (
              <div>
                <div className={`text-sm font-medium ${strengthColor}`}>
                  Strength: {passwordStrength}
                </div>
                <div className="flex gap-1 mt-1">
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
                        }[passwordStrength] : "bg-white/20"}`
                      }/>
                  ))}
                </div>
              </div>
            )}
            {errors.password && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3"/>
                {errors.password}
              </p>
            )}
          </motion.div>

          {/* Submit Button */}
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
                disabled={!isFormValid || isSubmitting}
                className={`w-full py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isFormValid && !isSubmitting 
                    ? "bg-gradient-to-r from-white to-gray-100 hover:from-gray-100 hover:to-white text-black hover:shadow-white/25" 
                    : "bg-gray-500/50 text-gray-300 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2 justify-center">
                    <Loader2 className="animate-spin h-5 w-5" />
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </motion.div>
          </motion.div>
        </motion.form>

        {/* Forgot Password Link */}
        <motion.div 
          className="text-center text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <Link 
            href="/forgot-password" 
            className="text-white/80 hover:text-white hover:underline transition-all duration-200 hover:scale-105 inline-block"
          >
            ?Forgot your password
          </Link>
        </motion.div>

        {/* Divider */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"/>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gray-900 px-2 text-white/60">Or continue with</span>
          </div>
        </motion.div>

        {/* Social Login Buttons */}
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
              onClick={() => signupWithProvider("GitHub")}
              disabled={isSubmitting}
              className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:shadow-lg backdrop-blur-sm"
            >
              GitHub
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Button 
              type="button" 
              onClick={() => signupWithProvider("Google")}
              disabled={isSubmitting}
              className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:shadow-lg backdrop-blur-sm"
            >
              Google
            </Button>
          </motion.div>
        </motion.div>

        {/* Login Link */}
        <motion.p 
          dir="ltr"
          className="text-center text-sm text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.5 }}
        >
          Already have an account?{" "}
          <Link 
            href="/login" 
            className="text-white/80 hover:text-white hover:underline transition-all duration-200 font-medium hover:scale-105 inline-block"
          >
            Sign In
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
