import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BackButton } from "@/components/BackButton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/ApiService";
import SEO from "@/components/SEO";
import {
  Clock, Users, Sparkles, Play, CheckCircle, X,
  TrendingUp, BookOpen, MessageSquare, Video, Calendar as CalendarIcon,
  Star, AlertCircle, Lightbulb, Target, Zap, Code, Shield, Settings
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Question {
  question: string;
  type: string;
  difficulty: string;
  tips?: string;
}

interface Feedback {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  overall: string;
}

interface Package {
  id: string;
  title: string;
  sessions: number;
  description: string;
  price: number;
  features: string[];
}

const InterviewPractice = () => {
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("practice");
  const [questionCategory, setQuestionCategory] = useState("behavioral");
  const [difficulty, setDifficulty] = useState("medium");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const [qaLanguages, setQaLanguages] = useState<any[]>([]);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Load packages on mount
  useEffect(() => {
    loadQaLanguages();
  }, [user]);





  const loadQaLanguages = async () => {
    try {
      setIsLoadingLanguages(true);
      const data = await apiService.getLanguages() as any;
      if (data.success) {
        setQaLanguages(data.languages);
      }
    } catch (error) {
      console.error('Error loading QA languages:', error);
    } finally {
      setIsLoadingLanguages(false);
    }
  };



  const generateQuestions = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`${apiUrl}/interview-practice/generate-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: questionCategory,
          difficulty: difficulty,
          count: 5,
          role: 'Software Engineer'
        }),
      });

      const data = await response.json();
      if (data.success && data.questions) {
        setQuestions(data.questions);
        setCurrentQuestionIndex(0);
        setUserAnswer("");
        setFeedback(null);
        toast({
          title: "Questions generated!",
          description: `Generated ${data.questions.length} ${questionCategory} questions.`,
        });
      } else {
        throw new Error(data.message || 'Failed to generate questions');
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        title: "Error",
        description: "Failed to generate questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const evaluateAnswer = async () => {
    if (!userAnswer.trim()) {
      toast({
        title: "Answer required",
        description: "Please provide an answer before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsEvaluating(true);
    try {
      const response = await fetch(`${apiUrl}/interview-practice/evaluate-answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: questions[currentQuestionIndex].question,
          answer: userAnswer,
          category: questionCategory
        }),
      });

      const data = await response.json();
      if (data.success && data.feedback) {
        setFeedback(data.feedback);
        toast({
          title: "Answer evaluated!",
          description: `Your score: ${data.feedback.score}/100`,
        });
      } else {
        throw new Error(data.message || 'Failed to evaluate answer');
      }
    } catch (error) {
      console.error('Error evaluating answer:', error);
      toast({
        title: "Error",
        description: "Failed to evaluate answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer("");
      setFeedback(null);
    }
  };



  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Interview Practice Studio - CodeAcademy Pro",
    "description": "AI-powered interview practice with real-time feedback, session booking, and mentor matching.",
    "provider": {
      "@type": "Organization",
      "name": "CodeAcademy Pro"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <SEO
        title="Interview Practice Studio - AI-Powered Interview Prep"
        description="Practice interviews with AI-powered questions, get real-time feedback, and book sessions with industry mentors. Prepare for your dream tech job."
        keywords="interview practice, interview prep, mock interview, AI interview, technical interview, behavioral interview, interview coaching"
        structuredData={structuredData}
      />

      {/* Header */}
      <div className="container mx-auto px-6 pt-6">
        <BackButton label="Back to Home" className="text-white" to="/" />
      </div>

      {/* Hero Section */}
      <motion.div
        className="bg-gradient-to-r from-violet-900/40 via-blue-900/40 to-violet-900/40 border-b border-white/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container mx-auto px-6 py-20 text-center">
          <Badge className="mb-4 bg-violet-500/20 text-violet-300 border-violet-500/30">
            <Sparkles className="w-3 h-3 mr-2" />
            AI-Powered Interview Practice
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Interview Practice Studio
          </h1>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            Practice with AI-generated questions, get instant feedback, and book sessions with real interviewers from top tech companies.
          </p>

          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              <Button
                onClick={() => navigate('/admin/interview-practice')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-lg shadow-indigo-500/20"
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin Mode (Manage Languages)
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      <div className="container mx-auto px-6 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="relative overflow-x-auto -mx-2 sm:mx-0 mb-8">
            <style>{`
              .interview-tabs-scroll {
                scrollbar-width: none;
                -ms-overflow-style: none;
              }
              .interview-tabs-scroll::-webkit-scrollbar {
                display: none;
              }
              .interview-tabs-scroll {
                scroll-behavior: smooth;
                -webkit-overflow-scrolling: touch;
              }
            `}</style>
            <TabsList className="flex overflow-x-auto sm:grid sm:grid-cols-5 bg-slate-800/50 border border-white/10 p-1 interview-tabs-scroll min-w-full w-max sm:w-full">
              <TabsTrigger value="practice" className="flex-shrink-0 min-w-[90px] sm:min-w-0 data-[state=active]:bg-violet-500 text-white/70 data-[state=active]:text-white text-xs sm:text-sm px-2 sm:px-3">
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="whitespace-nowrap">Practice</span>
              </TabsTrigger>
              <TabsTrigger value="languages" className="flex-shrink-0 min-w-[100px] sm:min-w-0 data-[state=active]:bg-violet-500 text-white/70 data-[state=active]:text-white text-xs sm:text-sm px-2 sm:px-3">
                <Code className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="whitespace-nowrap">Language Q&A</span>
              </TabsTrigger>

            </TabsList>
          </div>

          {/* Practice Tab */}
          <TabsContent value="practice" className="space-y-6">
            <Card className="bg-slate-900/70 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-violet-400" />
                  AI Interview Practice
                </CardTitle>
                <CardDescription className="text-white/60">
                  Generate questions and practice your answers with AI-powered feedback
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white/80">Question Category</Label>
                    <Select value={questionCategory} onValueChange={setQuestionCategory}>
                      <SelectTrigger className="bg-slate-800/50 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="behavioral">Behavioral</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="systemDesign">System Design</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/80">Difficulty</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger className="bg-slate-800/50 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  onClick={generateQuestions}
                  disabled={isGenerating}
                  className="w-full bg-violet-500 hover:bg-violet-600"
                >
                  {isGenerating ? (
                    "Generating Questions..."
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Questions
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Questions Display */}
            {questions.length > 0 && (
              <Card className="bg-slate-900/70 border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </CardTitle>
                    <Badge className="bg-violet-500/20 text-violet-300">
                      {questions[currentQuestionIndex].difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-white/10">
                    <p className="text-white text-lg font-medium">
                      {questions[currentQuestionIndex].question}
                    </p>
                    {questions[currentQuestionIndex].tips && (
                      <div className="mt-3 p-3 bg-violet-500/10 rounded border border-violet-500/20">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-violet-400 mt-0.5" />
                          <p className="text-violet-300 text-sm">{questions[currentQuestionIndex].tips}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white/80">Your Answer</Label>
                    <Textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      className="bg-slate-800/50 border-white/20 text-white min-h-[150px]"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={evaluateAnswer}
                      disabled={isEvaluating || !userAnswer.trim()}
                      className="flex-1 bg-violet-500 hover:bg-violet-600"
                    >
                      {isEvaluating ? "Evaluating..." : (
                        <>
                          <Target className="w-4 h-4 mr-2" />
                          Get Feedback
                        </>
                      )}
                    </Button>
                    {currentQuestionIndex < questions.length - 1 && (
                      <Button
                        onClick={nextQuestion}
                        variant="outline"
                        className="border-white/30 text-white bg-slate-700/50 hover:bg-slate-600/50"
                      >
                        Next Question
                      </Button>
                    )}
                  </div>

                  {/* Feedback Display */}
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 space-y-4"
                    >
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-white font-semibold">Your Score</span>
                          <Badge className={`${feedback.score >= 80 ? 'bg-green-500/20 text-green-300' :
                            feedback.score >= 60 ? 'bg-yellow-500/20 text-yellow-300' :
                              'bg-red-500/20 text-red-300'
                            }`}>
                            {feedback.score}/100
                          </Badge>
                        </div>
                        <p className="text-white/80 text-sm mb-4">{feedback.overall}</p>

                        {feedback.strengths.length > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-green-400 text-sm font-semibold">Strengths</span>
                            </div>
                            <ul className="list-disc list-inside text-white/70 text-sm space-y-1">
                              {feedback.strengths.map((strength, i) => (
                                <li key={i}>{strength}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {feedback.weaknesses.length > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertCircle className="w-4 h-4 text-yellow-400" />
                              <span className="text-yellow-400 text-sm font-semibold">Areas to Improve</span>
                            </div>
                            <ul className="list-disc list-inside text-white/70 text-sm space-y-1">
                              {feedback.weaknesses.map((weakness, i) => (
                                <li key={i}>{weakness}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {feedback.suggestions.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingUp className="w-4 h-4 text-violet-400" />
                              <span className="text-violet-400 text-sm font-semibold">Suggestions</span>
                            </div>
                            <ul className="list-disc list-inside text-white/70 text-sm space-y-1">
                              {feedback.suggestions.map((suggestion, i) => (
                                <li key={i}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Language Q&A Tab */}
          <TabsContent value="languages" className="space-y-6">
            <Card className="bg-slate-900/70 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Code className="w-5 h-5 text-violet-400" />
                  Programming Language Interview Q&A
                </CardTitle>
                <CardDescription className="text-white/60">
                  Click on any language to view interview questions and answers specific to that programming language
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {isLoadingLanguages ? (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center gap-4">
                      <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-white/40">Loading languages...</p>
                    </div>
                  ) : qaLanguages.length > 0 ? (
                    qaLanguages.map((lang) => (
                      <motion.div
                        key={lang.id}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="cursor-pointer"
                        onClick={() => navigate(`/interview-practice/languages/${lang.slug}`)}
                      >
                        <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-white/20 hover:border-violet-500/50 transition-all duration-300 overflow-hidden group h-full">
                          <div className={`absolute inset-0 bg-gradient-to-br ${lang.color_from} ${lang.color_to} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                          <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center text-center relative z-10 min-h-[120px] sm:min-h-[140px]">
                            <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">{lang.icon_emoji}</div>
                            <h3 className="text-white font-bold text-sm sm:text-base mb-1">{lang.name}</h3>
                            <p className="text-white/60 text-xs">Interview Q&A</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center">
                      <p className="text-white/40">No languages available yet.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Mentor Bench */}
        < Card className="bg-slate-900/70 border-white/10 mt-8" >
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-violet-400" />
              Mentor Bench
            </CardTitle>
            <CardDescription className="text-white/60">
              Real interviewers from top tech companies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {["Google", "Meta", "Stripe", "Atlassian", "Twilio", "Amazon", "Microsoft", "Apple"].map((company) => (
                <Badge key={company} variant="outline" className="border-white/20 text-white/60 px-4 py-2">
                  {company}
                </Badge>
              ))}
              <div className="ml-auto flex items-center gap-2 text-white/60 text-sm">
                <Clock className="h-4 w-4 text-violet-400" />
                Slots updated hourly
              </div>
            </div>
          </CardContent>
        </Card >
      </div >
    </div >
  );
};

export default InterviewPractice;
