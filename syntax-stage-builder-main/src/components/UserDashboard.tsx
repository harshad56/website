import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import {
  Trophy,
  Target,
  Calendar,
  TrendingUp,
  BookOpen,
  Code,
  Star,
  Award,
  Zap,
  Users,
  Clock,
  Clock,
  CheckCircle,
  LogOut
} from "lucide-react";

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <div className="text-4xl mb-4">👤</div>
            <h2 className="text-2xl font-bold mb-2">Please Sign In</h2>
            <p className="text-muted-foreground mb-4">
              Sign in to access your personalized dashboard
            </p>
            <Button>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const achievements = [
    { id: "first_completion", name: "First Steps", description: "Completed your first module", icon: "🎯", unlocked: true },
    { id: "week_streak", name: "Week Warrior", description: "7-day learning streak", icon: "🔥", unlocked: true },
    { id: "python_master", name: "Python Master", description: "Complete Python fundamentals", icon: "🐍", unlocked: false },
    { id: "java_expert", name: "Java Expert", description: "Complete Java advanced topics", icon: "☕", unlocked: false },
    { id: "challenge_king", name: "Challenge King", description: "Solve 50 coding challenges", icon: "👑", unlocked: false },
    { id: "community_hero", name: "Community Hero", description: "Help 10 other learners", icon: "🤝", unlocked: false }
  ];

  const recentActivity = [
    { type: "module_completed", title: "Java Module 1", description: "Completed Introduction to Java", time: "2 hours ago", icon: CheckCircle },
    { type: "challenge_solved", title: "Factorial Calculator", description: "Solved coding challenge", time: "1 day ago", icon: Code },
    { type: "streak_continued", title: "Learning Streak", description: "Day 7 of your streak", time: "2 days ago", icon: Zap },
    { type: "achievement_unlocked", title: "First Steps", description: "Unlocked new achievement", time: "3 days ago", icon: Trophy }
  ];

  const learningPaths = [
    { id: "fullstack", name: "Full-Stack Web Development", progress: 65, totalModules: 12, completedModules: 8 },
    { id: "datascience", name: "Data Science & ML", progress: 30, totalModules: 15, completedModules: 4 },
    { id: "mobile", name: "Mobile App Development", progress: 0, totalModules: 10, completedModules: 0 }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>
                <p className="text-muted-foreground">Ready to continue your learning journey?</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="px-3 py-1 text-sm bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                {user.progress.totalPoints} points
              </Badge>
              <Button
                variant="ghost"
                onClick={logout}
                className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.progress.totalPoints}</div>
                  <p className="text-xs text-muted-foreground">
                    +150 this week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.progress.currentStreak} days</div>
                  <p className="text-xs text-muted-foreground">
                    Keep it up! 🔥
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Modules Completed</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.progress.completedModules.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {user.progress.completedTopics.length} topics completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.progress.achievements.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {achievements.filter(a => a.unlocked).length} unlocked
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Learning Paths Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Paths Progress</CardTitle>
                <CardDescription>Track your progress across different career paths</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {learningPaths.map((path) => (
                    <div key={path.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{path.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {path.completedModules}/{path.totalModules} modules
                        </span>
                      </div>
                      <Progress value={path.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Progress</CardTitle>
                <CardDescription>Your learning journey in detail</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Language Progress */}
                  <div>
                    <h3 className="font-semibold mb-4">Language Progress</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Java</span>
                          <span className="text-sm font-medium">75%</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Python</span>
                          <span className="text-sm font-medium">45%</span>
                        </div>
                        <Progress value={45} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">JavaScript</span>
                          <span className="text-sm font-medium">20%</span>
                        </div>
                        <Progress value={20} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">C++</span>
                          <span className="text-sm font-medium">0%</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>
                    </div>
                  </div>

                  {/* Recent Completions */}
                  <div>
                    <h3 className="font-semibold mb-4">Recent Completions</h3>
                    <div className="space-y-3">
                      {user.progress.completedTopics.slice(-5).map((topic, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <div className="font-medium">{topic}</div>
                            <div className="text-sm text-muted-foreground">Completed recently</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>Unlock achievements by completing milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement) => (
                    <Card
                      key={achievement.id}
                      className={`transition-all duration-300 ${achievement.unlocked
                        ? 'border-green-200 bg-green-50'
                        : 'border-muted bg-muted/30'
                        }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                            {achievement.icon}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">{achievement.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {achievement.description}
                            </div>
                          </div>
                          {achievement.unlocked && (
                            <Badge variant="secondary" className="text-xs">
                              Unlocked
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest learning activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        <activity.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{activity.title}</div>
                        <div className="text-sm text-muted-foreground">{activity.description}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard; 