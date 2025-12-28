import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Shield, Zap, Award, CheckCircle, ArrowRight, AlertTriangle, Sparkles, Code, Rocket, Users, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const SignIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, signup, isLoading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setFormError(null);

    if (mode === "login") {
      await login(email, password);
      setSuccessMessage("Welcome back!");
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 100);
    } else {
      await signup(email, password, name || email.split("@")[0]);
      setSuccessMessage("You're in! Let's build something amazing.");
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 100);
      return;
    }
  } catch (error) {
    // ... existing error handling ...
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Something went wrong";
    let friendlyMessage = errorMessage;

    if (/user with this email already exists/i.test(errorMessage) || /account already exists/i.test(errorMessage)) {
      friendlyMessage = "An account with this email already exists. Please sign in instead or reset your password.";
    } else if (/validation failed/i.test(errorMessage)) {
      friendlyMessage =
        "Check your name, use a valid email, and be sure your password meets all requirements.";
    } else if (/too many authentication attempts/i.test(errorMessage)) {
      friendlyMessage = "You’ve tried too many times. Please wait a moment and try again.";
    }

    setFormError(friendlyMessage);
    toast({
      title: "Request failed",
      description: friendlyMessage,
      variant: "destructive",
    });
  }
};

const backendAuthBase = useMemo(() => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) return "";
  return apiUrl.replace(/\/api\/?$/, "");
}, []);

const handleOAuthSignIn = (provider: "google" | "github") => {
  if (!backendAuthBase) {
    toast({
      title: "Configuration missing",
      description: "Backend URL is not configured. Please set VITE_API_URL.",
      variant: "destructive",
    });
    return;
  }
  const promptParam = provider === "google" ? "?prompt=select_account" : "";
  window.location.href = `${backendAuthBase}/api/auth/${provider}${promptParam}`;
};

const benefits = [
  {
    icon: Shield,
    title: "Enterprise-grade security",
    description: "Encrypted sessions, MFA support, and OAuth providers.",
  },
  {
    icon: Zap,
    title: "Instant workspace access",
    description: "Resume progress, sync devices, and pick up where you left off.",
  },
  {
    icon: Award,
    title: "Pro learning experience",
    description: "Unlock pro paths, certifications, and AI copilots.",
  },
];

const socialProviders: { label: string; provider: "google" | "github" }[] = [
  { label: "Continue with Google", provider: "google" },
  { label: "Continue with GitHub", provider: "github" },
];

return (
  <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
    {/* Success Overlay - Heroic Design */}
    <AnimatePresence>
      {isSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-full max-w-lg text-center p-8"
          >
            {/* Heroic Success Animation */}
            <motion.div
              className="relative mx-auto mb-8 flex items-center justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <div className="absolute inset-0 bg-green-500/30 blur-3xl rounded-full" />
              <div className="relative h-28 w-28 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 flex items-center justify-center shadow-[0_0_40px_rgba(74,222,128,0.5)] ring-4 ring-slate-900">
                <CheckCircle className="h-14 w-14 text-white drop-shadow-md" strokeWidth={3} />
              </div>
            </motion.div>

            <motion.h2
              className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-teal-400 tracking-tight mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Success!
            </motion.h2>

            <motion.p
              className="text-2xl text-slate-300 font-medium"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {successMessage}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Enhanced Animated Background - Reduced Brightness */}
    <div className="absolute inset-0 overflow-hidden">
      {/* Static gradient mesh - No animation for better performance */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.12) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.12) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.08) 0%, transparent 50%)",
        }}
      />

      {/* Floating code symbols - Reduced count for performance */}
      {['</>', '{ }', '()'].map((symbol, i) => (
        <motion.div
          key={i}
          className="absolute text-white/5 font-mono text-3xl font-bold pointer-events-none"
          initial={{
            x: (i + 1) * (window.innerWidth / 4),
            y: (i + 1) * (window.innerHeight / 4),
            rotate: i * 120,
          }}
          animate={{
            y: [(i + 1) * (window.innerHeight / 4), (i + 1) * (window.innerHeight / 4) - 50, (i + 1) * (window.innerHeight / 4)],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
          style={{ willChange: "transform, opacity" }}
        >
          {symbol}
        </motion.div>
      ))}

      {/* Floating particles - Reduced count for performance */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full pointer-events-none"
          style={{
            boxShadow: "0 0 4px rgba(255, 255, 255, 0.2)",
            willChange: "transform, opacity",
          }}
          initial={{
            x: (i + 1) * (window.innerWidth / 5),
            y: (i + 1) * (window.innerHeight / 5),
          }}
          animate={{
            y: [(i + 1) * (window.innerHeight / 5), (i + 1) * (window.innerHeight / 5) - 30, (i + 1) * (window.innerHeight / 5)],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5,
          }}
        />
      ))}
    </div>

    {/* Back Button Header */}
    <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <motion.div
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-white/90 hover:text-white hover:bg-white/10 font-medium min-h-[44px] px-4"
          >
            <span className="text-lg mr-2">←</span>
            <span>Back to Home</span>
          </Button>
        </motion.div>
      </div>
    </div>

    {/* Hero Section with Enhanced Design */}
    <motion.div
      className="relative z-10 pt-8 sm:pt-16 pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-block mb-6"
        >
          <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 px-4 py-1.5 text-sm font-semibold shadow-lg">
            <Sparkles className="w-3 h-3 mr-2" />
            Secure Sign In
          </Badge>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-indigo-300 to-purple-300 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Welcome to{" "}
          <span
            className="inline-block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            CodeAcademy Pro
          </span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          🚀 Start your coding journey with{" "}
          <span className="text-indigo-400 font-semibold">interactive courses</span>,{" "}
          <span className="text-purple-400 font-semibold">real-world projects</span>, and{" "}
          <span className="text-pink-400 font-semibold">AI-powered mentorship</span>
        </motion.p>

        {/* Stats */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {[
            { icon: Users, label: "2M+", text: "Students" },
            { icon: Code, label: "20+", text: "Languages" },
            { icon: Star, label: "4.9", text: "Rating" },
            { icon: Rocket, label: "1000+", text: "Projects" },
          ].map((stat, index) => (
            <motion.div
              key={stat.text}
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05, duration: 0.3, ease: "easeOut" }}
              whileHover={{ scale: 1.05, y: -3 }}
              style={{ willChange: "transform" }}
            >
              <stat.icon className="w-8 h-8 text-indigo-400 mb-2" />
              <div className="text-3xl font-bold text-white">{stat.label}</div>
              <div className="text-sm text-white/70">{stat.text}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>

    <div className="container mx-auto px-6 py-12 grid gap-8 lg:grid-cols-2 relative z-10">
      {/* Left Column - Sign In Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ willChange: "opacity, transform" }}
      >
        <Card className="shadow-2xl border-2 border-indigo-500/40 backdrop-blur-xl bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-saturate-150">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-lg" />
          <div className="relative z-10">
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(-1)}
                    className="text-white/80 hover:text-white hover:bg-white/10"
                  >
                    ← Back
                  </Button>
                </motion.div>
                <motion.div
                  key={mode}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 text-xs uppercase px-3 py-1">
                    {mode === "login" ? "✨ Returning learner" : "🎉 New learner"}
                  </Badge>
                </motion.div>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardTitle className="text-3xl font-bold text-white mb-2">
                    {mode === "login" ? "Welcome back! 👋" : "Join us today! 🚀"}
                  </CardTitle>
                  <CardDescription className="text-white/70 text-base">
                    {mode === "login"
                      ? "Continue your learning journey with personalized courses and AI mentorship."
                      : "Start your coding journey with free courses, projects, and certifications."}
                  </CardDescription>
                </motion.div>
              </AnimatePresence>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="grid gap-3">
                {socialProviders.map((provider, index) => (
                  <motion.div
                    key={provider.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ willChange: "transform" }}
                  >
                    <Button
                      variant="outline"
                      className="w-full h-12 bg-slate-800/60 border-2 border-slate-700/50 text-white hover:bg-slate-700/60 hover:border-indigo-500/50 hover:text-white transition-all duration-300 font-medium"
                      type="button"
                      onClick={() => handleOAuthSignIn(provider.provider)}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {provider.provider === "google" ? "🔵" : "⚫"}
                        {provider.label}
                      </span>
                    </Button>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center gap-4 my-6">
                <Separator className="flex-1 bg-slate-700/50" />
                <span className="text-sm text-white/70 font-medium">or continue with email</span>
                <Separator className="flex-1 bg-slate-700/50" />
              </div>

              <motion.form
                className="space-y-5"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <AnimatePresence>
                  {mode === "signup" && (
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Label htmlFor="name" className="text-white font-medium">Full name</Label>
                      <motion.div
                        whileFocus={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        style={{ willChange: "transform" }}
                      >
                        <Input
                          id="name"
                          placeholder="Ada Lovelace"
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          required={mode === "signup"}
                          className="bg-slate-800/80 border-2 border-slate-700/50 text-white placeholder:text-white/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 h-12"
                        />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                >
                  <Label htmlFor="email" className="text-white font-medium">Email address</Label>
                  <motion.div
                    whileFocus={{ scale: 1.02, x: 2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      className="bg-slate-800/80 border-2 border-slate-700/50 text-white placeholder:text-white/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 h-12"
                    />
                  </motion.div>
                  <p className="text-xs text-white/60">
                    Use a valid email like <span className="font-medium text-white/80">you@example.com</span>.
                  </p>
                </motion.div>
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                >
                  <Label htmlFor="password" className="text-white font-medium">Password</Label>
                  <motion.div
                    whileFocus={{ scale: 1.02, x: 2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      className="bg-slate-800/80 border-2 border-slate-700/50 text-white placeholder:text-white/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 h-12"
                    />
                  </motion.div>
                  <p className="text-xs text-white/60">
                    Must be 8+ characters and include uppercase, lowercase, a number, and a special character (@$!%*?&).
                  </p>
                </motion.div>
                {mode === "login" && (
                  <motion.div
                    className="flex items-center justify-between"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.85 }}
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                        className="border-white/30 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                      />
                      <Label htmlFor="remember" className="text-sm text-white/80 cursor-pointer">
                        Remember me
                      </Label>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="link"
                        className="px-0 text-sm text-indigo-400 hover:text-indigo-300"
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                      >
                        Forgot password?
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ willChange: "transform" }}
                  className="pt-2"
                >
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold text-lg shadow-lg shadow-indigo-500/50 border-0 transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      "⏳ Please wait..."
                    ) : (
                      <>
                        {mode === "login" ? "🚀 Sign In" : "✨ Create account"}
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.form>

              <AnimatePresence>
                {formError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
                  >
                    <AlertTriangle className="h-4 w-4 mt-0.5" />
                    <p>{formError}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.p
                className="text-sm text-center text-white/80 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                {mode === "login" ? "New here? " : "Already have an account? "}
                <motion.span whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="link"
                    className="px-1 text-indigo-400 hover:text-indigo-300 font-semibold underline-offset-4"
                    type="button"
                    onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  >
                    {mode === "login" ? "✨ Create an account" : "🔐 Sign in"}
                  </Button>
                </motion.span>
              </motion.p>
            </CardContent>
          </div>
        </Card>
      </motion.div>

      {/* Right Column - Benefits */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        style={{ willChange: "opacity, transform" }}
      >
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          style={{ willChange: "transform" }}
        >
          <Card className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-2 border-indigo-500/40 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/15 via-purple-500/15 to-pink-500/15 rounded-lg" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl flex items-center gap-3 text-white">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <span className="text-white">
                  Account Benefits
                </span>
              </CardTitle>
              <CardDescription className="text-white/80 text-base">
                Every sign-in unlocks synced progress, AI copilots, and personalized study paths.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  className="flex items-start gap-4 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-300 border border-slate-700/50"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                  whileHover={{ x: 5, scale: 1.01, borderColor: "rgba(99, 102, 241, 0.6)" }}
                  style={{ willChange: "transform" }}
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500/30 to-purple-500/30">
                    <benefit.icon className="h-6 w-6 text-indigo-300" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg mb-1">{benefit.title}</p>
                    <p className="text-sm text-white/80">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          style={{ willChange: "transform" }}
        >
          <Card className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-2 border-purple-500/40 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 via-pink-500/15 to-indigo-500/15 rounded-lg" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Rocket className="h-6 w-6 text-purple-300" />
                <span className="text-white">
                  Need an invitation?
                </span>
              </CardTitle>
              <CardDescription className="text-white/80 text-base">
                Enterprise admins can invite teammates directly from the dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 relative z-10">
              <p className="text-white/80 text-sm leading-relaxed">
                Looking for managed onboarding or SSO? Our enterprise success team will help you
                roll out CodeAcademy Pro across your organization.
              </p>
              <motion.div
                whileHover={{ scale: 1.05, x: 3 }}
                whileTap={{ scale: 0.97 }}
                style={{ willChange: "transform" }}
              >
                <Button
                  variant="outline"
                  className="self-start bg-slate-800/60 border-2 border-slate-700/50 text-white hover:bg-slate-700/60 hover:border-purple-500/50 font-semibold"
                  onClick={() => navigate("/contact")}
                >
                  💼 Talk to sales
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  </div>
);
};

export default SignIn;

