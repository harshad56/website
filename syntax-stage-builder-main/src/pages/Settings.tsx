import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Download,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Mail,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Settings as SettingsIcon,
  Key,
  CreditCard,
  HelpCircle,
  LogOut,
  AlertTriangle,
  CheckCircle,
  X
} from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [theme, setTheme] = useState("system");
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("UTC");
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Mock user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    joinDate: "January 2024",
    lastLogin: "2 hours ago",
    subscription: "Pro",
    memberSince: "3 months"
  };

  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    bio: "Passionate software developer learning new technologies.",
    location: "San Francisco, CA",
    website: "https://johndoe.dev",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    courseUpdates: true,
    achievementAlerts: true,
    weeklyReports: true,
    marketingEmails: false,
    communityUpdates: true,
    newCourseAlerts: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showProgress: true,
    showAchievements: true,
    allowMessages: true,
    dataSharing: false,
    analyticsTracking: true
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePrivacyChange = (field: string, value: string | boolean) => {
    setPrivacy(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (section?: string) => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const sectionName = section || "settings";
      toast({
        title: "Settings saved! ✅",
        description: `Your ${sectionName} have been successfully updated.`,
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Account deletion initiated",
        description: "Your account will be permanently deleted. This action cannot be undone.",
        variant: "destructive",
      });
      
      setShowDeleteDialog(false);
      
      // In a real app, this would log out and redirect
      setTimeout(() => {
        toast({
          title: "Account deleted",
          description: "Your account has been permanently deleted.",
        });
      }, 2000);
    } catch (error) {
      toast({
        title: "Error deleting account",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handlePasswordChange = async () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast({
        title: "Missing information",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirm password must match.",
        variant: "destructive",
      });
      return;
    }

    if (formData.newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Password changed! ✅",
        description: "Your password has been successfully updated.",
      });
      
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    } catch (error) {
      toast({
        title: "Error changing password",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-b border-border">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Settings
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Manage your account preferences, privacy settings, and learning experience.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <Badge variant="secondary" className="mt-1">{user.subscription}</Badge>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Member since: {user.memberSince}</p>
                  <p>Last login: {user.lastLogin}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Privacy
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger value="account" className="flex items-center gap-2">
                  <SettingsIcon className="w-4 h-4" />
                  Account
                </TabsTrigger>
              </TabsList>

              {/* Profile Settings */}
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal information and profile details.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={formData.website}
                          onChange={(e) => handleInputChange("website", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end mt-6">
                      <Button onClick={() => handleSave("profile")} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Profile"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Update your password to keep your account secure.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={formData.currentPassword}
                          onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={formData.newPassword}
                          onChange={(e) => handleInputChange("newPassword", e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end mt-6">
                      <Button onClick={handlePasswordChange} disabled={isSaving}>
                        <Key className="w-4 h-4 mr-2" />
                        {isSaving ? "Changing..." : "Change Password"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notification Settings */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Choose how and when you want to be notified.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="emailNotifications">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications via email
                          </p>
                        </div>
                        <Switch
                          id="emailNotifications"
                          checked={notifications.emailNotifications}
                          onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="pushNotifications">Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive push notifications in your browser
                          </p>
                        </div>
                        <Switch
                          id="pushNotifications"
                          checked={notifications.pushNotifications}
                          onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium">Learning Notifications</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="courseUpdates">Course Updates</Label>
                            <p className="text-sm text-muted-foreground">
                              New lessons and course content
                            </p>
                          </div>
                          <Switch
                            id="courseUpdates"
                            checked={notifications.courseUpdates}
                            onCheckedChange={(checked) => handleNotificationChange("courseUpdates", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="achievementAlerts">Achievement Alerts</Label>
                            <p className="text-sm text-muted-foreground">
                              When you unlock new achievements
                            </p>
                          </div>
                          <Switch
                            id="achievementAlerts"
                            checked={notifications.achievementAlerts}
                            onCheckedChange={(checked) => handleNotificationChange("achievementAlerts", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="weeklyReports">Weekly Progress Reports</Label>
                            <p className="text-sm text-muted-foreground">
                              Summary of your weekly learning progress
                            </p>
                          </div>
                          <Switch
                            id="weeklyReports"
                            checked={notifications.weeklyReports}
                            onCheckedChange={(checked) => handleNotificationChange("weeklyReports", checked)}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium">Community & Marketing</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="communityUpdates">Community Updates</Label>
                            <p className="text-sm text-muted-foreground">
                              Forum discussions and community events
                            </p>
                          </div>
                          <Switch
                            id="communityUpdates"
                            checked={notifications.communityUpdates}
                            onCheckedChange={(checked) => handleNotificationChange("communityUpdates", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="newCourseAlerts">New Course Alerts</Label>
                            <p className="text-sm text-muted-foreground">
                              When new courses are available
                            </p>
                          </div>
                          <Switch
                            id="newCourseAlerts"
                            checked={notifications.newCourseAlerts}
                            onCheckedChange={(checked) => handleNotificationChange("newCourseAlerts", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="marketingEmails">Marketing Emails</Label>
                            <p className="text-sm text-muted-foreground">
                              Promotional content and special offers
                            </p>
                          </div>
                          <Switch
                            id="marketingEmails"
                            checked={notifications.marketingEmails}
                            onCheckedChange={(checked) => handleNotificationChange("marketingEmails", checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Privacy Settings */}
              <TabsContent value="privacy" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy & Security</CardTitle>
                    <CardDescription>
                      Control your privacy settings and data sharing preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="profileVisibility">Profile Visibility</Label>
                        <Select
                          value={privacy.profileVisibility}
                          onValueChange={(value) => handlePrivacyChange("profileVisibility", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                            <SelectItem value="friends">Friends Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="showProgress">Show Learning Progress</Label>
                            <p className="text-sm text-muted-foreground">
                              Allow others to see your course progress
                            </p>
                          </div>
                          <Switch
                            id="showProgress"
                            checked={privacy.showProgress}
                            onCheckedChange={(checked) => handlePrivacyChange("showProgress", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="showAchievements">Show Achievements</Label>
                            <p className="text-sm text-muted-foreground">
                              Display your unlocked achievements
                            </p>
                          </div>
                          <Switch
                            id="showAchievements"
                            checked={privacy.showAchievements}
                            onCheckedChange={(checked) => handlePrivacyChange("showAchievements", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="allowMessages">Allow Direct Messages</Label>
                            <p className="text-sm text-muted-foreground">
                              Let other users send you messages
                            </p>
                          </div>
                          <Switch
                            id="allowMessages"
                            checked={privacy.allowMessages}
                            onCheckedChange={(checked) => handlePrivacyChange("allowMessages", checked)}
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h4 className="font-medium">Data & Analytics</h4>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="dataSharing">Data Sharing</Label>
                            <p className="text-sm text-muted-foreground">
                              Share anonymous usage data to improve the platform
                            </p>
                          </div>
                          <Switch
                            id="dataSharing"
                            checked={privacy.dataSharing}
                            onCheckedChange={(checked) => handlePrivacyChange("dataSharing", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="analyticsTracking">Analytics Tracking</Label>
                            <p className="text-sm text-muted-foreground">
                              Help us understand how you use the platform
                            </p>
                          </div>
                          <Switch
                            id="analyticsTracking"
                            checked={privacy.analyticsTracking}
                            onCheckedChange={(checked) => handlePrivacyChange("analyticsTracking", checked)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-6">
                      <Button onClick={() => handleSave("privacy")} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Privacy"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Appearance Settings */}
              <TabsContent value="appearance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance & Display</CardTitle>
                    <CardDescription>
                      Customize how the platform looks and feels.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="theme">Theme</Label>
                        <Select value={theme} onValueChange={setTheme}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="language">Language</Label>
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="zh">Chinese</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select value={timezone} onValueChange={setTimezone}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="EST">Eastern Time</SelectItem>
                            <SelectItem value="PST">Pacific Time</SelectItem>
                            <SelectItem value="GMT">GMT</SelectItem>
                            <SelectItem value="CET">Central European Time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end mt-6">
                      <Button onClick={() => handleSave("appearance")} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Appearance"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Account Settings */}
              <TabsContent value="account" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Management</CardTitle>
                    <CardDescription>
                      Manage your account settings and subscription.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Subscription</h4>
                          <p className="text-sm text-muted-foreground">
                            Current plan: {user.subscription}
                          </p>
                        </div>
                        <Button variant="outline">Manage Subscription</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Data Export</h4>
                          <p className="text-sm text-muted-foreground">
                            Download your learning data and progress
                          </p>
                        </div>
                        <Button variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Export Data
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Help & Support</h4>
                          <p className="text-sm text-muted-foreground">
                            Get help with your account or learning
                          </p>
                        </div>
                        <Button variant="outline">
                          <HelpCircle className="w-4 h-4 mr-2" />
                          Contact Support
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium text-destructive">Danger Zone</h4>
                      <div className="flex items-center justify-between p-4 border border-destructive rounded-lg">
                        <div>
                          <h4 className="font-medium text-destructive">Delete Account</h4>
                          <p className="text-sm text-muted-foreground">
                            Permanently delete your account and all data. This action cannot be undone.
                          </p>
                        </div>
                        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Account
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove all your data from our servers. All your progress, projects,
                                and achievements will be lost forever.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDeleteAccount}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Yes, delete my account
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 