import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/ApiService";
import { CheckCircle, AlertCircle, ShieldCheck, ArrowLeft, Lock, Loader2 } from "lucide-react";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!token) {
      setError("The reset link is missing or invalid.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please make sure both password fields match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiService.resetPassword(token, password);
      setIsSuccess(true);
      toast({
        title: "Password updated",
        description: response.message || "Your password has been reset successfully.",
        variant: "default",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "We couldn't reset your password. Try again.";
      setError(errorMessage);
      toast({
        title: "Reset failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl shadow-2xl text-center p-6 sm:p-8 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                <CardContent className="pt-6 flex flex-col items-center space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                    className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </motion.div>

                  <div className="space-y-2">
                    <CardTitle className="text-3xl font-bold text-white">Success!</CardTitle>
                    <CardDescription className="text-slate-400 text-lg">
                      Your password has been reset successfully.
                    </CardDescription>
                  </div>

                  <p className="text-slate-500 text-sm">
                    Security is our priority. Your authentication credentials have been updated.
                  </p>

                  <Button
                    className="w-full h-12 bg-green-600 hover:bg-green-500 text-white font-bold transition-all duration-300 shadow-lg shadow-green-900/20"
                    onClick={() => navigate("/sign-in")}
                  >
                    Back to Login
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

                <CardHeader className="space-y-4 pt-8 text-center">
                  <div className="mx-auto w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 rotate-3 transition-transform hover:rotate-0 duration-300">
                    <ShieldCheck className="w-8 h-8 text-indigo-400" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-white tracking-tight">Set New Password</CardTitle>
                    <CardDescription className="text-slate-400">
                      Almost there! Choose a secure password for your account.
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="p-6 sm:px-8 sm:pb-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle className="font-bold">Security Notice</AlertTitle>
                          <AlertDescription className="text-xs">{error}</AlertDescription>
                        </Alert>
                      </motion.div>
                    )}

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-slate-300 flex items-center gap-2">
                          <Lock className="w-3 h-3" /> New Password
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          className="bg-slate-800/50 border-white/10 focus:border-indigo-500/50 text-white h-11 transition-all"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <div className="bg-slate-950/50 p-3 rounded-lg border border-white/5 mt-2">
                          <p className="text-[10px] text-slate-500 leading-relaxed">
                            <span className="text-indigo-400 font-bold uppercase tracking-widest block mb-1">Requirement</span>
                            8+ characters, uppercase, lowercase, numbers, and symbols (@$!%*?&).
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-slate-300 flex items-center gap-2">
                          <Lock className="w-3 h-3" /> Confirm Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          className="bg-slate-800/50 border-white/10 focus:border-indigo-500/50 text-white h-11 transition-all"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold transition-all duration-300 shadow-xl shadow-indigo-500/20 group"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                          </span>
                        ) : (
                          "Reset Password"
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full hover:bg-white/5 text-slate-400 hover:text-white flex items-center justify-center gap-2 text-sm transition-colors"
                        onClick={() => navigate(-1)}
                      >
                        <ArrowLeft className="w-4 h-4" /> Cancel & Return
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Brand */}
        <p className="text-center mt-8 text-slate-600 text-xs tracking-widest uppercase">
          Powered by CodeAcademy Pro Security
        </p>
      </motion.div >
    </div >
  );
};

export default ResetPassword;
