import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target, 
  Award, 
  Trophy,
  BookOpen,
  Code,
  CheckCircle,
  Play,
  Pause,
  Star,
  Users,
  BarChart3,
  Activity,
  Zap,
  Flame,
  Brain,
  Heart,
  Eye,
  MessageCircle,
  Share2,
  Download,
  Filter,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";

const ProgressTracking = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");

  // Mock user progress data
  const userProgress = {
    overallProgress: 68,
    totalCourses: 12,
    completedCourses: 8,
    totalHours: 156,
    thisWeekHours: 12.5,
    lastWeekHours: 10.2,
    streak: 15,
    longestStreak: 23,
    achievements: 24,
    totalAchievements: 50,
    rank: "Advanced Learner",
    level: 8,
    experiencePoints: 2840,
    nextLevelXP: 3200,
    weeklyGoal: 15,
    weeklyProgress: 12.5,
    monthlyGoal: 60,
    monthlyProgress: 45.2
  };

  const courseProgress = [
    {
      id: 1,
      title: "Complete Python Bootcamp",
      progress: 85,
      totalLessons: 45,
      completedLessons: 38,
      timeSpent: 28.5,
      lastAccessed: "2 hours ago",
      nextLesson: "Advanced OOP Concepts",
      category: "Python",
      difficulty: "Intermediate",
      estimatedCompletion: "3 days"
    },
    {
      id: 2,
      title: "React - The Complete Guide",
      progress: 62,
      totalLessons: 52,
      completedLessons: 32,
      timeSpent: 42.3,
      lastAccessed: "1 day ago",
      nextLesson: "Redux State Management",
      category: "React",
      difficulty: "Advanced",
      estimatedCompletion: "1 week"
    },
    {
      id: 3,
      title: "JavaScript Fundamentals",
      progress: 100,
      totalLessons: 30,
      completedLessons: 30,
      timeSpent: 25.8,
      lastAccessed: "3 days ago",
      nextLesson: "Completed",
      category: "JavaScript",
      difficulty: "Beginner",
      estimatedCompletion: "Completed"
    },
    {
      id: 4,
      title: "Data Science with Python",
      progress: 45,
      totalLessons: 40,
      completedLessons: 18,
      timeSpent: 22.1,
      lastAccessed: "5 days ago",
      nextLesson: "Data Visualization",
      category: "Data Science",
      difficulty: "Intermediate",
      estimatedCompletion: "2 weeks"
    }
  ];

  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first lesson",
      icon: "🎯",
      unlocked: true,
      unlockedDate: "2024-01-15",
      rarity: "Common"
    },
    {
      id: 2,
      title: "Week Warrior",
      description: "Study for 7 consecutive days",
      icon: "🔥",
      unlocked: true,
      unlockedDate: "2024-01-22",
      rarity: "Rare"
    },
    {
      id: 3,
      title: "Course Master",
      description: "Complete 5 courses",
      icon: "🏆",
      unlocked: true,
      unlockedDate: "2024-01-28",
      rarity: "Epic"
    },
    {
      id: 4,
      title: "Speed Learner",
      description: "Complete a course in under 2 weeks",
      icon: "⚡",
      unlocked: false,
      progress: 75,
      rarity: "Legendary"
    },
    {
      id: 5,
      title: "Social Butterfly",
      description: "Participate in 10 community discussions",
      icon: "🦋",
      unlocked: false,
      progress: 40,
      rarity: "Rare"
    }
  ];

  const learningStats = {
    dailyAverage: 2.1,
    weeklyAverage: 14.7,
    monthlyAverage: 58.3,
    totalStudyDays: 45,
    consistency: 78,
    favoriteTime: "Evening (7-9 PM)",
    favoriteDay: "Wednesday",
    mostProductiveHour: "8 PM"
  };

  const recentActivity = [
    {
      id: 1,
      type: "lesson_completed",
      title: "Completed: Advanced OOP Concepts",
      course: "Complete Python Bootcamp",
      time: "2 hours ago",
      icon: CheckCircle,
      color: "text-green-500"
    },
    {
      id: 2,
      type: "quiz_passed",
      title: "Passed: JavaScript Quiz #5",
      course: "JavaScript Fundamentals",
      time: "1 day ago",
      icon: Award,
      color: "text-blue-500"
    },
    {
      id: 3,
      type: "achievement_unlocked",
      title: "Unlocked: Course Master Achievement",
      course: "General",
      time: "2 days ago",
      icon: Trophy,
      color: "text-yellow-500"
    },
    {
      id: 4,
      type: "streak_milestone",
      title: "15 Day Learning Streak!",
      course: "General",
      time: "3 days ago",
      icon: Flame,
      color: "text-orange-500"
    }
  ];

  const timeframes = [
    { id: "week", name: "This Week", icon: Calendar },
    { id: "month", name: "This Month", icon: Calendar },
    { id: "quarter", name: "This Quarter", icon: Calendar },
    { id: "year", name: "This Year", icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-b border-border">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Progress Tracking
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Monitor your learning journey, track achievements, and stay motivated with detailed analytics.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
                  <p className="text-2xl font-bold">{userProgress.overallProgress}%</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
              </div>
              <Progress value={userProgress.overallProgress} className="mt-4" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Learning Streak</p>
                  <p className="text-2xl font-bold">{userProgress.streak} days</p>
                </div>
                <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center">
                  <Flame className="w-6 h-6 text-orange-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Longest: {userProgress.longestStreak} days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                  <p className="text-2xl font-bold">{userProgress.totalHours}h</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                This week: {userProgress.thisWeekHours}h
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Level</p>
                  <p className="text-2xl font-bold">{userProgress.level}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {userProgress.experiencePoints}/{userProgress.nextLevelXP} XP
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Weekly Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Weekly Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Study Hours</span>
                      <span className="text-sm text-muted-foreground">
                        {userProgress.weeklyProgress}/{userProgress.weeklyGoal}h
                      </span>
                    </div>
                    <Progress value={(userProgress.weeklyProgress / userProgress.weeklyGoal) * 100} />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Lessons Completed</span>
                      <span className="text-sm text-muted-foreground">12/15</span>
                    </div>
                    <Progress value={80} />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Quizzes Passed</span>
                      <span className="text-sm text-muted-foreground">8/10</span>
                    </div>
                    <Progress value={80} />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => {
                      const Icon = activity.icon;
                      return (
                        <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center ${activity.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{activity.title}</p>
                            <p className="text-sm text-muted-foreground">{activity.course}</p>
                          </div>
                          <span className="text-sm text-muted-foreground">{activity.time}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Learning Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Learning Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{learningStats.dailyAverage}h</p>
                    <p className="text-sm text-muted-foreground">Daily Average</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-500">{learningStats.consistency}%</p>
                    <p className="text-sm text-muted-foreground">Consistency</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-500">{learningStats.totalStudyDays}</p>
                    <p className="text-sm text-muted-foreground">Study Days</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-500">{learningStats.favoriteTime}</p>
                    <p className="text-sm text-muted-foreground">Peak Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {courseProgress.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{course.title}</h3>
                          <Badge variant="outline">{course.category}</Badge>
                          <Badge variant="secondary">{course.difficulty}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Progress</p>
                            <p className="text-lg font-semibold">{course.progress}%</p>
                            <Progress value={course.progress} className="mt-2" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Lessons</p>
                            <p className="text-lg font-semibold">{course.completedLessons}/{course.totalLessons}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Time Spent</p>
                            <p className="text-lg font-semibold">{course.timeSpent}h</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            <p>Next: {course.nextLesson}</p>
                            <p>Estimated completion: {course.estimatedCompletion}</p>
                          </div>
                          <Button>
                            Continue Learning
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={`${achievement.unlocked ? '' : 'opacity-60'}`}>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{achievement.icon}</div>
                    <h3 className="font-semibold mb-2">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{achievement.description}</p>
                    
                    {achievement.unlocked ? (
                      <div>
                        <Badge className="mb-2">{achievement.rarity}</Badge>
                        <p className="text-xs text-muted-foreground">
                          Unlocked: {achievement.unlockedDate}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <Badge variant="outline" className="mb-2">{achievement.rarity}</Badge>
                        <Progress value={achievement.progress} className="mt-2" />
                        <p className="text-xs text-muted-foreground mt-2">
                          {achievement.progress}% complete
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Time Tracking */}
              <Card>
                <CardHeader>
                  <CardTitle>Study Time Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Daily Average</span>
                      <span className="font-semibold">{learningStats.dailyAverage}h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Weekly Average</span>
                      <span className="font-semibold">{learningStats.weeklyAverage}h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Monthly Average</span>
                      <span className="font-semibold">{learningStats.monthlyAverage}h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Most Productive Hour</span>
                      <span className="font-semibold">{learningStats.mostProductiveHour}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Favorite Study Day</span>
                      <span className="font-semibold">{learningStats.favoriteDay}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Progress Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>This Week vs Last Week</span>
                      <div className="flex items-center gap-1">
                        <ArrowUp className="w-4 h-4 text-green-500" />
                        <span className="text-green-500 font-semibold">+22.5%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Course Completion Rate</span>
                      <div className="flex items-center gap-1">
                        <ArrowUp className="w-4 h-4 text-green-500" />
                        <span className="text-green-500 font-semibold">+15%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Quiz Performance</span>
                      <div className="flex items-center gap-1">
                        <Minus className="w-4 h-4 text-yellow-500" />
                        <span className="text-yellow-500 font-semibold">0%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Learning Streak</span>
                      <div className="flex items-center gap-1">
                        <ArrowUp className="w-4 h-4 text-green-500" />
                        <span className="text-green-500 font-semibold">+5 days</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProgressTracking; 