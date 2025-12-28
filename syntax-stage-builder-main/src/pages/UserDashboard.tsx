import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Zap } from "lucide-react";

const UserDashboard = () => {
  const { user, isAuthenticated, logout, updatePreferences } = useAuth();
  const navigate = useNavigate();
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferences?.preferredLanguage || "java");
  const [difficulty, setDifficulty] = useState(user?.preferences?.difficulty || "beginner");
  const [notifications, setNotifications] = useState(user?.preferences?.notifications ?? true);

  if (!isAuthenticated) {
    navigate("/", { replace: true });
    return null;
  }

  const handleSave = () => {
    updatePreferences({ preferredLanguage, difficulty, notifications });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-2xl border-0 bg-slate-900/50 backdrop-blur-xl ring-1 ring-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />

            <CardHeader className="relative border-b border-white/5 pb-8">
              <motion.div
                className="flex flex-col sm:flex-row items-center sm:items-start gap-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500" />
                  <img
                    src={user?.avatar}
                    alt="avatar"
                    className="relative w-24 h-24 rounded-full border-2 border-slate-800 object-cover shadow-xl"
                  />
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-slate-900 rounded-full" />
                </motion.div>

                <div className="text-center sm:text-left space-y-2 flex-1">
                  <div>
                    <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                      {user?.name}
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-base mt-1">
                      {user?.email}
                    </CardDescription>
                  </div>

                  <motion.div
                    className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Badge variant="secondary" className="px-3 py-1 bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20 transition-colors">
                        🏆 {user?.progress?.totalPoints || 0} Points
                      </Badge>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Badge variant="outline" className="px-3 py-1 border-white/10 text-slate-300 hover:bg-white/5 transition-colors">
                        🔥 {user?.progress?.currentStreak || 0} Day Streak
                      </Badge>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </CardHeader>

            <CardContent className="relative space-y-8 pt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="bg-slate-800/50 rounded-xl p-6 border border-white/5"
              >
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400"><Zap className="w-4 h-4" /></span>
                  Preferences
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    className="space-y-2"
                    whileFocus={{ scale: 1.02 }}
                  >
                    <Label className="text-slate-300">Preferred Language</Label>
                    <Input
                      value={preferredLanguage}
                      onChange={e => setPreferredLanguage(e.target.value)}
                      className="bg-slate-900/50 border-white/10 text-white focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
                      placeholder="e.g. Python, Java..."
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    whileFocus={{ scale: 1.02 }}
                  >
                    <Label className="text-slate-300">Difficulty Level</Label>
                    <select
                      value={difficulty}
                      onChange={e => setDifficulty(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-white/10 bg-slate-900/50 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none appearance-none cursor-pointer hover:bg-slate-900/70"
                    >
                      <option value="beginner" className="bg-slate-900">Beginner</option>
                      <option value="intermediate" className="bg-slate-900">Intermediate</option>
                      <option value="advanced" className="bg-slate-900">Advanced</option>
                    </select>
                  </motion.div>

                  <motion.div
                    className="col-span-1 md:col-span-2 flex items-center p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => setNotifications(!notifications)}
                  >
                    <input
                      type="checkbox"
                      checked={notifications}
                      onChange={e => setNotifications(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-slate-900 text-indigo-500 focus:ring-indigo-500/50 cursor-pointer"
                    />
                    <Label className="ml-3 cursor-pointer text-slate-300 select-none flex-1">
                      Enable email notifications for updates and reminders
                    </Label>
                  </motion.div>
                </div>

                <motion.div
                  className="mt-6 flex justify-end"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleSave}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 px-6"
                  >
                    Save Changes
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                className="pt-4 flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <Button
                  variant="ghost"
                  onClick={logout}
                  className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 gap-2 group"
                >
                  <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  Sign Out of Account
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;