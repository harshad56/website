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
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User as UserIcon,
  Bell,
  Shield,
  Palette,
  Settings as SettingsIcon,
  Save,
  LogOut,
  Loader2,
  ChevronLeft,
  Lock
} from "lucide-react";

const Settings = () => {
  const { user, isAuthenticated, logout, updatePreferences, changePassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Support deep linking to specific tabs (e.g. from header)
  const defaultTab = (location.state as any)?.defaultTab || "profile";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isSaving, setIsSaving] = useState(false);

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

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

  // Update local state when user context changes
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

  const handlePasswordChangeInput = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updatePreferences(preferences);
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

  const handlePasswordSubmit = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please ensure your new password matches the confirmation.",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to change password",
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
          {/* Header Section with Back Button */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="rounded-full bg-slate-900/50 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 shadow-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-slate-400">Manage your account preferences and learning settings.</p>
              </div>
            </div>
            {/* Redundant Sign Out removed as requested */}
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
                  <TabsTrigger value="security" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                    <Lock className="w-4 h-4 mr-2" /> Security
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
                              <SelectContent className="bg-slate-900 border-white/10 text-white">
                                <SelectItem value="python" className="focus:bg-indigo-600 focus:text-white cursor-pointer">Python</SelectItem>
                                <SelectItem value="javascript" className="focus:bg-indigo-600 focus:text-white cursor-pointer">JavaScript</SelectItem>
                                <SelectItem value="java" className="focus:bg-indigo-600 focus:text-white cursor-pointer">Java</SelectItem>
                                <SelectItem value="cpp" className="focus:bg-indigo-600 focus:text-white cursor-pointer">C++</SelectItem>
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
                              <SelectContent className="bg-slate-900 border-white/10 text-white">
                                <SelectItem value="beginner" className="focus:bg-indigo-600 focus:text-white cursor-pointer">Beginner</SelectItem>
                                <SelectItem value="intermediate" className="focus:bg-indigo-600 focus:text-white cursor-pointer">Intermediate</SelectItem>
                                <SelectItem value="advanced" className="focus:bg-indigo-600 focus:text-white cursor-pointer">Advanced</SelectItem>
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

                {/* Security Tab (Password Change) */}
                <TabsContent value="security" className="space-y-6">
                  <Card className="bg-slate-900/50 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Security Settings</CardTitle>
                      <CardDescription className="text-slate-400">Manage your password and account security.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-slate-300">Current Password</Label>
                          <Input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => handlePasswordChangeInput("currentPassword", e.target.value)}
                            className="bg-slate-800/50 border-white/10 text-white focus:ring-indigo-500"
                            placeholder="Enter current password"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-slate-300">New Password</Label>
                            <Input
                              type="password"
                              value={passwordData.newPassword}
                              onChange={(e) => handlePasswordChangeInput("newPassword", e.target.value)}
                              className="bg-slate-800/50 border-white/10 text-white focus:ring-indigo-500"
                              placeholder="Min. 6 characters"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-300">Confirm New Password</Label>
                            <Input
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={(e) => handlePasswordChangeInput("confirmPassword", e.target.value)}
                              className="bg-slate-800/50 border-white/10 text-white focus:ring-indigo-500"
                              placeholder="Re-enter new password"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="pt-4 flex justify-end">
                        <Button
                          onClick={handlePasswordSubmit}
                          disabled={isSaving || !passwordData.currentPassword || !passwordData.newPassword}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white"
                        >
                          {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          Update Password
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

                {/* Privacy Tab */}
                <TabsContent value="privacy">
                  <Card className="bg-slate-900/50 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Privacy Settings</CardTitle>
                      <CardDescription className="text-slate-400">Control your public profile visibility.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-slate-400 p-4 rounded-lg border border-dashed border-white/10 text-center">
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