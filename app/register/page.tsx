import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { AlertCircle, Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react";

// mock components 
const Button = ({ children, className, type, disabled, onClick, ...props }) => (
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

const Input = ({ className, ...props }) => (
  <input
    className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 ${className}`}
    {...props}
  />
);

const Label = ({ children, htmlFor, className }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium ${className}`}>
    {children}
  </label>
);

const Link = ({ href, children, className }) => (
  <a href={href} className={className} onClick={(e) => e.preventDefault()}>
    {children}
  </a>
);

type PasswordStrength = "short" | "weak" | "medium" | "strong" | "high";

interface ValidationErrors {
  username?: string;
  email?: string;
  password?: string;
  general?: string;
}

function calculatePasswordStrength(password) {
  if (password.length < 6) {
    return { score: 1, label: "short", color: "#eab308" };
  }

  const tests = [/[a-z]/, /[A-Z]/, /\d/, /[@.#$!%^&*.?]/];
  let score = tests.reduce((acc, rx) => acc + Number(rx.test(password)), 0);

  if (score === 1) return { score: 1, label: "weak", color: "#ef4444" };
  if (score === 2) return { score: 2, label: "medium", color: "#3b82f6" };
  if (score === 3) return { score: 3, label: "strong", color: "#f97316" };
  return { score: 4, label: "high", color: "#22c55e" };
}

export default function SignupDemo() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [iconFlipped, setIconFlipped] = useState(false);
  const flipControls = useAnimation();

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uniqueUsername, setUniqueUsername] = useState(null);
  const [usernameChecking, setUsernameChecking] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "short",
    color: "transparent"
  });

  // animated background 
  const backgroundElements = [
    { id: 1, delay: 0, duration: 8, x: [0, 60, 0], y: [0, -120, 0] },
    { id: 2, delay: 1, duration: 6, x: [0, -40, 0], y: [0, -100, 0] },
    { id: 3, delay: 2, duration: 7, x: [0, 50, 0], y: [0, -80, 0] },
    { id: 4, delay: 0, duration: 15, x: [0, 120, 0], y: [0, -60, 0] },
    { id: 5, delay: 7, duration: 18, x: [0, -100, 0], y: [0, 40, 0] }
  ];

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password));
  }, [password]);

  useEffect(() => {
    validateForm();
  }, [username, email, password, passwordStrength.score]);

  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) newErrors.username = "Username is required";
    else if (username.length < 3) newErrors.username = "Must be at least 3 characters";
    else if (!/^[\w\d_]+$/.test(username)) newErrors.username = "Only letters, numbers & underscore";

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";
    else if (passwordStrength.label === "short" || passwordStrength.label === "weak")
      newErrors.password = "Include uppercase, lowercase, number & symbol";

    setErrors(newErrors);
  };

  const isFormValid = 
    username.trim() !== "" && 
    email.trim() !== "" && 
    password.trim() !== "" && 
    Object.keys(errors).length === 0 &&
    uniqueUsername !== false;

  const handleUsernameCheck = async (val) => {
    setUsername(val);
    if (!val || val.length < 3) {
      setUniqueUsername(null);
      return;
    }
    
    setUsernameChecking(true);
    // simulate API call
    setTimeout(() => {
      const available = Math.random() > 0.3; 
      setUniqueUsername(available);
      setUsernameChecking(false);
    }, 1000);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setLoading(true);
    setErrors({});

    // simulate signup
    setTimeout(() => {
      console.log("Account created successfully");
      setLoading(false);
      alert("Account created successfully");
    }, 2000);
  };

  const handleSocialSignup = async (provider) => {
    setErrors({});
    setLoading(true);
    
    setTimeout(() => {
      console.log(`${provider} signup successful`);
      setLoading(false);
      alert(`${provider} signup successful`);
    }, 1500);
  };

  const handleEyeToggle = async () => {
    await flipControls.start({ rotateY: 90, transition: { duration: 0.17 } });
    setIconFlipped(f => !f);
    setShowPassword(v => !v);
    await flipControls.start({ rotateY: 0, transition: { duration: 0.17 } });
  };

  const strengthColors = {
    short: "#eab308",
    weak: "#ef4444",
    medium: "#3b82f6", 
    strong: "#f97316",
    high: "#22c55e",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 relative overflow-hidden">
      {/* animated background effect */}
      <div className="absolute inset-0 overflow-hidden">
        {/* floating particles */}
        {backgroundElements.slice(0, 3).map((element, index) => (
          <motion.div 
            key={element.id}
            className={`absolute w-${index === 0 ? '4' : index === 1 ? '3' : '5'} h-${index === 0 ? '4' : index === 1 ? '3' : '5'} bg-blue-400/30 rounded-full`}
            style={{
              top: `${20 + index * 20}%`,
              left: `${20 + index * 20}%`
            }}
            animate={{ 
              y: element.y, 
              x: element.x, 
              opacity: [0, 1, 0], 
              scale: [0, 1.2, 0] 
            }}
            transition={{ 
              duration: element.duration, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: element.delay
            }} 
          />
        ))}
        
        {/* background blurs */}
        <motion.div 
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-blue-400/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, 120, 0], 
            y: [0, -60, 0], 
            scale: [1, 1.3, 1], 
            opacity: [0.1, 0.3, 0.1] 
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }} 
        />
        
        <motion.div 
          className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-l from-slate-600/10 to-blue-500/15 rounded-full blur-3xl"
          animate={{ 
            x: [0, -100, 0], 
            y: [0, 40, 0], 
            scale: [1.2, 1, 1.2], 
            opacity: [0.2, 0.4, 0.2] 
          }}
          transition={{ 
            duration: 18, 
            repeat: Infinity, 
            ease: "easeInOut", 
            delay: 7 
          }} 
        />

        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-blue-400/20"
              style={{
                width: '2px',
                height: `${Math.random() * 200 + 100}px`,
                top: `${Math.random() * 80}%`,
                left: `${Math.random() * 90}%`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
              animate={{
                opacity: [0, 0.6, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
            />
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="
          relative z-20 w-full max-w-md p-8 space-y-6 
          bg-white/10 backdrop-blur-xl
          rounded-2xl 
          shadow-xl shadow-black/20
          border border-white/20
          hover:bg-white/15 hover:border-white/30 
          transition-all duration-500
        "
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-sm text-white/70 mt-2">Join the community and share your journey</p>
        </motion.div>

        {errors.general && (
          <div className="flex items-center gap-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded px-3 py-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="text-sm">{errors.general}</span>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-white/90">
              username
            </Label>
            <div className="relative">
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 hover:bg-white/15 hover:border-white/30 transition-all duration-300 pr-10"
                value={username}
                onChange={(e) => handleUsernameCheck(e.target.value)}
                required
                disabled={loading}
              />
              
              {usernameChecking && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-white/60" />
              )}
              {uniqueUsername && !usernameChecking && !errors.username && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400"/>
              )}
            </div>
            
            {!usernameChecking && uniqueUsername && !errors.username && (
              <motion.p 
                className="text-sm text-green-400"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                username is available
              </motion.p>
            )}
            {errors.username && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3"/>
                {errors.username}
              </p>
            )}
            {uniqueUsername === false && !errors.username && !usernameChecking && (
              <p className="text-sm text-red-400">Username is already taken</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/90">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 hover:bg-white/15 hover:border-white/30 transition-all duration-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            {errors.email && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3"/>
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2 relative">
            <Label htmlFor="password" className="text-white/90">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-12 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 hover:bg-white/15 hover:border-white/30 transition-all duration-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              
              <button
                type="button"
                onClick={handleEyeToggle}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90 z-10 transition-colors duration-200 p-1 rounded"
              >
                <motion.span animate={flipControls} initial={{ rotateY: 0 }} style={{ display: "inline-flex", perspective: 400 }}>
                  {iconFlipped ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </motion.span>
              </button>
            </div>

            {password.length > 0 && (
              <div className="mt-1">
                <div className="flex gap-1 mb-1">
                  {[1,2,3,4].map(idx => (
                    <div key={idx}
                      className={`h-1 flex-1 rounded-full transition-all duration-300`}
                      style={{
                        backgroundColor: passwordStrength.score >= idx ? strengthColors[passwordStrength.label] : 'rgba(255,255,255,0.2)'
                      }}
                    />
                  ))}
                </div>
                <p 
                  className="text-xs font-medium select-none"
                  style={{ color: strengthColors[passwordStrength.label] }}
                >
                  Password strength: {passwordStrength.label}
                </p>
              </div>
            )}
            
            {errors.password && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3"/>
                {errors.password}
              </p>
            )}
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="button"
              onClick={handleSignup}
              disabled={!isFormValid || loading}
              className={`w-full py-3 font-semibold transition-all duration-200 rounded-lg shadow-lg ${
                isFormValid && !loading 
                  ? "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl" 
                  : "bg-gray-500/50 text-gray-300 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4" />
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </motion.div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-800 px-2 text-white/60">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              type="button"
              onClick={() => handleSocialSignup("Google")}
              disabled={loading}
              className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path
                  fill="currentColor"
                  d="M12.24 10.29v3.52h6.21c-.3.86-.87 1.88-1.74 2.54-.87.66-2.15 1.15-3.66 1.15-3.35 0-6.07-2.72-6.07-6.07s2.72-6.07 6.07-6.07c1.51 0 2.82.43 3.87 1.34l2.87-2.87C17.58 2.96 15.02 2 12.24 2 6.64 2 2 6.64 2 12s4.64 10 10.24 10c6.01 0 9.87-4.14 9.87-10.14 0-.69-.06-1.35-.16-1.97H12.24z"
                />
              </svg>
              Google
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="button"
              onClick={() => handleSocialSignup("GitHub")}
              disabled={loading}
              className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path
                  fill="currentColor"
                  d="M12 0a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.6-2.8-.3-5.7-1.4-5.7-6.2 0-1.4.5-2.6 1.3-3.5-.1-.3-.6-1.7.1-3.5 0 0 1-.3 3.4 1.3a11.9 11.9 0 0 1 6 0c2.4-1.6 3.4-1.3 3.4-1.3.7 1.8.2 3.2.1 3.5.9.9 1.3 2.1 1.3 3.5 0 4.8-2.9 5.9-5.7 6.2.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 0z"
                />
              </svg>
              GitHub
            </Button>
          </motion.div>
        </div>

        <p className="text-center text-sm text-white/70">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 hover:underline transition-all duration-200 font-medium">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
