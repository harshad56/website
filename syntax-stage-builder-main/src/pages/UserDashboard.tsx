import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const UserDashboard = () => {
  const { user, isAuthenticated, logout, updatePreferences } = useAuth();
  const navigate = useNavigate();
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferences.preferredLanguage || "java");
  const [difficulty, setDifficulty] = useState(user?.preferences.difficulty || "beginner");
  const [notifications, setNotifications] = useState(user?.preferences.notifications ?? true);

  if (!isAuthenticated) {
    navigate("/", { replace: true });
    return null;
  }

  const handleSave = () => {
    updatePreferences({ preferredLanguage, difficulty, notifications });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background py-12">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-xl border border-border/60 backdrop-blur-sm">
            <CardHeader>
              <motion.div
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img src={user?.avatar} alt="avatar" className="w-16 h-16 rounded-full border" />
                </motion.div>
                <div>
                  <CardTitle>{user?.name}</CardTitle>
                  <CardDescription>{user?.email}</CardDescription>
                  <motion.div
                    className="flex items-center space-x-2 mt-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Badge variant="secondary">{user?.progress.totalPoints} pts</Badge>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Badge variant="outline">{user?.progress.currentStreak} day streak</Badge>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </CardHeader>
          <CardContent className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h3 className="font-semibold mb-2">Achievements</h3>
              <div className="flex flex-wrap gap-2">
                {user?.progress.achievements.length ? (
                  user.progress.achievements.map((ach, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 200 }}
                      whileHover={{ scale: 1.1, rotate: 5, y: -3 }}
                    >
                      <Badge variant="outline">{ach}</Badge>
                    </motion.div>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm">No achievements yet.</span>
                )}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <h3 className="font-semibold mb-2">Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  whileFocus={{ scale: 1.02 }}
                >
                  <Label>Preferred Language</Label>
                  <Input
                    value={preferredLanguage}
                    onChange={e => setPreferredLanguage(e.target.value)}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                  whileFocus={{ scale: 1.02 }}
                >
                  <Label>Difficulty</Label>
                  <select
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value)}
                    className="w-full border rounded p-2 transition-all duration-300 focus:ring-2 focus:ring-primary"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </motion.div>
                <motion.div
                  className="col-span-2 flex items-center space-x-2 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.4 }}
                >
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={e => setNotifications(e.target.checked)}
                    className="cursor-pointer"
                  />
                  <Label>Enable notifications</Label>
                </motion.div>
              </div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4"
              >
                <Button onClick={handleSave}>Save Preferences</Button>
              </motion.div>
            </motion.div>
            <motion.div
              className="pt-4 border-t"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.4 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" onClick={logout}>Sign Out</Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;