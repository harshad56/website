import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User as UserIcon,
  Bell,
  Shield,
  Palette,
  Settings as SettingsIcon,
  Save,
  LogOut,
  Loader2
} from "lucide-react";

const Settings = () => {
  const { user, isAuthenticated, logout, updatePreferences } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !user) {
      navigate("/sign-in");
    }
  }, [isAuthenticated, user, navigate]);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [preferences, setPreferences] = useState({
    preferredLanguage: user?.preferences?.preferredLanguage || "python",
    difficulty: user?.preferences?.difficulty || "beginner",
    notifications: user?.preferences?.notifications ?? true
  });

  // Update local state when user context changes (e.g. after initial load)
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
      setPreferences({
        preferredLanguage: user.preferences?.preferredLanguage || "python",
        difficulty: user.preferences?.difficulty || "beginner",
        notifications: user.preferences?.notifications ?? true
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (field: string, value: any) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update preferences via context (which calls API/Local fallback)
      await updatePreferences(preferences);

      // Simulate saving profile data (name/email) - separate from preferences
      // In a real app we'd have an updateProfile method too
      await new Promise(resolve => setTimeout(resolve, 800));

      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Section */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
              <p className="text-slate-400">Manage your account preferences and learning settings.</p>
            </div>
            <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Profile Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-slate-900/50 border-white/10 backdrop-blur-sm sticky top-6">
                <CardContent className="p-6 text-center">
                  <div className="relative inline-block mb-4">
                    <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur opacity-40"></div>
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="relative w-24 h-24 rounded-full border-2 border-slate-800 object-cover shadow-xl"
                    />
                  </div>
                  <h3 className="font-bold text-lg text-white mb-1">{user.name}</h3>
                  <p className="text-sm text-slate-400 mb-4">{user.email}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                      {user.role === 'admin' ? 'Admin' : 'Pro Member'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Tabs */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-slate-900/50 border border-white/10 p-1 w-full flex justify-start overflow-x-auto">
                  <TabsTrigger value="profile" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                    <UserIcon className="w-4 h-4 mr-2" /> Profile
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                    <Bell className="w-4 h-4 mr-2" /> Notifications
                  </TabsTrigger>
                  <TabsTrigger value="privacy" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                    <Shield className="w-4 h-4 mr-2" /> Privacy
                  </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6">
                  <Card className="bg-slate-900/50 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Personal Information</CardTitle>
                      <CardDescription className="text-slate-400">Update your profile details and preferences.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-slate-300">Display Name</Label>
                          <Input
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className="bg-slate-800/50 border-white/10 text-white focus:ring-indigo-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-300">Email</Label>
                          <Input
                            value={formData.email}
                            disabled
                            className="bg-slate-800/30 border-white/5 text-slate-500 cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 pt-4 border-t border-white/5">
                        <h4 className="font-medium text-slate-200 mb-4">Learning Preferences</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-slate-300">Primary Language</Label>
                            <Select
                              value={preferences.preferredLanguage}
                              onValueChange={(val) => handlePreferenceChange("preferredLanguage", val)}
                            >
                              <SelectTrigger className="bg-slate-800/50 border-white/10 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-900 border-white/10">
                                <SelectItem value="python">Python</SelectItem>
                                <SelectItem value="javascript">JavaScript</SelectItem>
                                <SelectItem value="java">Java</SelectItem>
                                <SelectItem value="cpp">C++</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-300">Difficulty Level</Label>
                            <Select
                              value={preferences.difficulty}
                              onValueChange={(val) => handlePreferenceChange("difficulty", val)}
                            >
                              <SelectTrigger className="bg-slate-800/50 border-white/10 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-900 border-white/10">
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 flex justify-end">
                        <Button onClick={handleSave} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-500 text-white">
                          {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          Save Changes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications">
                  <Card className="bg-slate-900/50 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Notification Preferences</CardTitle>
                      <CardDescription className="text-slate-400">Manage how you receive updates.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                        <div className="space-y-0.5">
                          <Label className="text-base text-white">Email Notifications</Label>
                          <p className="text-sm text-slate-400">Receive weekly digests and course updates.</p>
                        </div>
                        <Switch
                          checked={preferences.notifications}
                          onCheckedChange={(val) => handlePreferenceChange("notifications", val)}
                        />
                      </div>
                      <div className="pt-4 flex justify-end">
                        <Button onClick={handleSave} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-500 text-white">
                          {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          Save Preferences
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Privacy Tab - Placeholder for now as it wasn't focus of request but keeps UI consistent */}
                <TabsContent value="privacy">
                  <Card className="bg-slate-900/50 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Privacy Settings</CardTitle>
                      <CardDescription className="text-slate-400">Control your public profile visibility.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-slate-400">
                        Privacy controls coming soon. Your data is currently secure and private by default.
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

              </Tabs>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;