import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Circle,
  Terminal,
  Play,
  RotateCcw,
  Lightbulb,
  Trophy,
  MessageSquare,
  ChevronRight,
  Code2,
  Zap,
  XCircle
} from "lucide-react";
import { BackButton } from "@/components/BackButton";
import SEO from "@/components/SEO";
import { apiService } from "@/services/ApiService";
import { useAuth } from "@/contexts/AuthContext";

// Challenge Data Structure (Fallback for dev)
const CHALLENGES_DATA = {
  java: {
    beginner: [
      {
        id: "java-fact",
        title: "Factorial Calculator",
        description: "Calculate the factorial of a number.",
        problem: "Implement a method that takes an integer n and returns its factorial. Handle edge cases like 0 and negative numbers.",
        starterCode: `public class FactorialCalculator {\n    public static int factorial(int n) {\n        // Write your code here\n        return 0;\n    }\n}`,
        testCases: [
          { input: "5", expected: "120", description: "Factorial of 5" },
          { input: "0", expected: "1", description: "Factorial of 0" }
        ],
        hints: ["n! = n * (n-1) * ... * 1", "0! is 1"]
      },
      {
        id: "java-palin",
        title: "Palindrome Checker",
        description: "Check if a string is a palindrome.",
        problem: "Implement a method that returns true if a string reads the same forwards and backwards.",
        starterCode: `public class PalindromeChecker {\n    public static boolean isPalindrome(String str) {\n        // Write your code here\n        return false;\n    }\n}`,
        hints: ["Use a loop or split/reverse/join", "Check if the string is equal to its reverse"],
        testCases: [
          { input: "racecar", expected: "true", description: "Basic palindrome" }
        ]
      }
    ],
    intermediate: [],
    advanced: []
  },
  python: {
    beginner: [
      {
        id: "py-list",
        title: "List Operations",
        description: "Reverse a list and find max.",
        problem: "Implement functions to reverse a list and find the maximum element.",
        starterCode: `def reverse_list(lst):\n    # Write your code here\n    pass\n\ndef find_max(lst):\n    # Write your code here\n    pass`,
        hints: ["Use lst[::-1] for reverse", "Use the built-in max() function"],
        testCases: [
          { input: "[1,2,3]", expected: "[3,2,1]", description: "Reverse list" }
        ]
      }
    ],
    intermediate: [],
    advanced: []
  },
  javascript: {
    beginner: [
      {
        id: "js-array",
        title: "Array Transformation",
        description: "Use map and filter.",
        problem: "Write functions to double numbers and filter even values.",
        starterCode: `function transform(numbers) {\n    // Write your code here\n}`,
        hints: ["Use numbers.filter() for evens", "Then use .map() to double them"],
        testCases: [
          { input: "[1,2,3,4]", expected: "[4,8]", description: "Double even numbers" }
        ]
      }
    ],
    intermediate: [],
    advanced: []
  },
  csharp: {
    beginner: [
      {
        id: "cs-sum",
        title: "Sum of Array",
        description: "Calculate sum of integers.",
        problem: "Write a method that takes an array of integers and returns their sum.",
        starterCode: `public class Calculator {\n    public int Sum(int[] numbers) {\n        // Write your code here\n        return 0;\n    }\n}`,
        hints: ["Use a foreach loop", "Initialize a sum variable to 0"],
        testCases: [
          { input: "[1,2,3]", expected: "6", description: "Sum of 1,2,3" }
        ]
      }
    ],
    intermediate: [],
    advanced: []
  },
  swift: {
    beginner: [
      {
        id: "sw-greeting",
        title: "Personalized Greeting",
        description: "Return a greeting string.",
        problem: "Write a function that takes a name and returns 'Hello, [name]!'.",
        starterCode: `func greet(name: String) -> String {\n    // Write your code here\n    return \"\"\n}`,
        hints: ["Use string interpolation \\(name)", "Return the literal string with the name"],
        testCases: [
          { input: "Swift", expected: "Hello, Swift!", description: "Greet Swift" }
        ]
      }
    ],
    intermediate: [],
    advanced: []
  },
  cpp: {
    beginner: [
      {
        id: "cpp-min",
        title: "Find Minimum",
        description: "Find the smallest number.",
        problem: "Write a function that takes two integers and returns the smaller one.",
        starterCode: `int findMin(int a, int b) {\n    // Write your code here\n    return 0;\n}`,
        hints: ["Use an if-else statement", "Or use the ternary operator ?: "],
        testCases: [
          { input: "10, 5", expected: "5", description: "Min of 10 and 5" }
        ]
      }
    ],
    intermediate: [],
    advanced: []
  },
  ruby: {
    beginner: [
      {
        id: "rb-len",
        title: "String Length",
        description: "Return string length.",
        problem: "Write a method that takes a string and returns its length.",
        starterCode: `def get_length(str)\n    # Write your code here\nend`,
        hints: ["Use the .length method", "Or use .size"],
        testCases: [
          { input: "\"hello\"", expected: "5", description: "Length of hello" }
        ]
      }
    ],
    intermediate: [],
    advanced: []
  },
  php: {
    beginner: [
      {
        id: "php-add",
        title: "Addition",
        description: "Add two numbers.",
        problem: "Write a function that returns the sum of two numbers.",
        starterCode: `function add($a, $b) {\n    // Write your code here\n}`,
        hints: ["Use the + operator", "Return the result"],
        testCases: [
          { input: "10, 20", expected: "30", description: "10 + 20" }
        ]
      }
    ],
    intermediate: [],
    advanced: []
  },
  rust: {
    beginner: [
      {
        id: "rs-print",
        title: "Print Line",
        description: "Print to console.",
        problem: "Write a function that prints 'Hello, Rust!' to the standard output.",
        starterCode: `fn main() {\n    // Write your code here\n}`,
        hints: ["Useprintln!() macro", "Remember the semicolon"],
        testCases: [
          { input: "", expected: "Hello, Rust!", description: "Check output" }
        ]
      }
    ],
    intermediate: [],
    advanced: []
  },
  go: {
    beginner: [
      {
        id: "go-sum",
        title: "Simple Sum",
        description: "Add two integers.",
        problem: "Write a function that takes two integers and returns their sum.",
        starterCode: `func Sum(a, b int) int {\n    // Write your code here\n    return 0\n}`,
        hints: ["Return a + b", "Go uses func keyword"],
        testCases: [
          { input: "1, 2", expected: "3", description: "1 + 2" }
        ]
      }
    ],
    intermediate: [],
    advanced: []
  },
  typescript: {
    beginner: [
      {
        id: "ts-greet",
        title: "Typed Greeting",
        description: "Greeting with types.",
        problem: "Write a function that takes a name (string) and returns a greeting.",
        starterCode: `function greet(name: string): string {\n    // Write your code here\n    return \"\";\n}`,
        hints: ["Use template literals", "Type the return value"],
        testCases: [
          { input: "TS", expected: "Hello, TS!", description: "Greet TS" }
        ]
      }
    ],
    intermediate: [],
    advanced: []
  }
};

const CodingChallenges = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [selectedDifficulty, setSelectedDifficulty] = useState("beginner");
  const [userCode, setUserCode] = useState("");
  const [output, setOutput] = useState("");
  const [currentChallengeIdx, setCurrentChallengeIdx] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dbChallenges, setDbChallenges] = useState<any[]>([]);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>(["javascript", "python", "java", "csharp", "swift", "cpp", "ruby", "php", "rust", "go", "typescript"]);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userStats, setUserStats] = useState<any>(null);

  // Fetch Challenges and Progress
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch available languages
        const langRes = await apiService.getChallengeLanguages();
        if (langRes.success && langRes.data) {
          setAvailableLanguages(langRes.data);
        }

        // 2. Fetch Leaderboard
        const lbRes = await apiService.getLeaderboard();
        if (lbRes.success && lbRes.data) {
          setLeaderboardData(lbRes.data);
        }

        // 3. Fetch Challenges
        const challengesRes = await apiService.getChallenges({
          language: selectedLanguage,
          difficulty: selectedDifficulty
        });

        if (challengesRes.success && challengesRes.data && challengesRes.data.length > 0) {
          // Map snake_case from DB to camelCase for frontend
          const mapped = challengesRes.data.map((c: any) => ({
            ...c,
            starterCode: c.starter_code || c.starterCode,
            problem: c.problem_statement || c.problem || c.description,
            testCases: c.test_cases || c.testCases || []
          }));
          setDbChallenges(mapped);
        } else {
          // Fallback to local data
          const local = CHALLENGES_DATA[selectedLanguage as keyof typeof CHALLENGES_DATA];
          setDbChallenges(local?.[selectedDifficulty as keyof typeof local] || []);
        }

        // 4. Fetch User Progress if logged in
        if (user && localStorage.getItem('token')) {
          try {
            const progressRes = await apiService.getUserChallengesProgress();
            if (progressRes.success && progressRes.data) {
              const completedMap: Record<string, boolean> = {};
              progressRes.data.forEach((p: any) => {
                if (p.status === 'completed') completedMap[p.challenge_id] = true;
              });
              setCompletedChallenges(completedMap);
            }
          } catch (progressError) {
            console.log('User progress not available (not signed in or token expired)');
            // This is fine - user just isn't signed in
          }
        }
      } catch (error) {
        console.error("Failed to fetch coding challenges:", error);
        // Fallback on error
        const local = CHALLENGES_DATA[selectedLanguage as keyof typeof CHALLENGES_DATA];
        setDbChallenges(local?.[selectedDifficulty as keyof typeof local] || []);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedLanguage, selectedDifficulty, user]);

  const currentChallenges = dbChallenges;
  const challenge = currentChallenges[currentChallengeIdx];

  useEffect(() => {
    if (challenge) {
      // Replace literal \n with actual newlines
      const formattedCode = (challenge.starterCode || "").replace(/\\n/g, '\n');
      setUserCode(formattedCode);
      setOutput("");
      setTestResults([]);
    }
  }, [challenge]);

  const completedCount = useMemo(() => {
    return currentChallenges.filter(c => completedChallenges[c.id]).length;
  }, [currentChallenges, completedChallenges]);

  const progressPercent = currentChallenges.length > 0 ? (completedCount / currentChallenges.length) * 100 : 0;

  const runTests = async () => {
    if (!challenge) return;
    setIsRunning(true);
    setOutput("🚀 Executing your code...");
    setTestResults([]);

    try {
      // Call the real backend code execution API
      const response = await apiService.executeCode(
        challenge.language || selectedLanguage,
        userCode,
        challenge.testCases
      );

      if (response.success && response.data) {
        const results = response.data.testResults || [];
        setTestResults(results);
        setIsRunning(false);

        const allPassed = results.every((r: any) => r.passed);

        if (allPassed) {
          setCompletedChallenges(prev => ({ ...prev, [challenge.id]: true }));
          setOutput("✅ Success! All tests passed. Your solution is optimized.");

          // Save progress to backend
          if (user) {
            try {
              await apiService.updateChallengeProgress(challenge.id, {
                status: 'completed',
                submitted_code: userCode,
                attempts_count: 1
              });

              // Fetch updated user stats and REFRESH leaderboard
              const [lbRes, progressRes] = await Promise.all([
                apiService.getLeaderboard(),
                apiService.getUserChallengesProgress()
              ]);

              if (lbRes.success && lbRes.data) {
                // Update leaderboard data immediately
                setLeaderboardData(lbRes.data);

                const userRank = lbRes.data.findIndex((entry: any) => entry.user_id === user.id) + 1;
                const userEntry = lbRes.data.find((entry: any) => entry.user_id === user.id);
                const totalUsers = lbRes.data.length;
                const completedCount = progressRes.success ? progressRes.data.filter((p: any) => p.status === 'completed').length : 0;

                setUserStats({
                  rank: userRank || '?',
                  totalPoints: userEntry?.total_points || 0,
                  challengesCompleted: completedCount,
                  totalUsers: totalUsers,
                  pointsEarned: challenge.points || 50
                });

                setShowSuccessModal(true);
              }
            } catch (error) {
              console.error('Failed to update progress:', error);
            }
          } else {
            // Not logged in - just show basic success
            setShowSuccessModal(true);
          }
        } else {
          setOutput("❌ FAILED: Some test cases did not pass. Review the errors below.");
        }
      } else {
        setOutput("❌ ERROR: Code execution failed. Check your syntax.");
        setIsRunning(false);
      }
    } catch (error) {
      console.error('Code execution error:', error);
      setOutput("❌ ERROR: Failed to execute code. Please try again.");
      setIsRunning(false);
    }
  };

  const showHints = () => {
    if (!challenge || !challenge.hints || challenge.hints.length === 0) {
      setOutput("💡 No hints available for this challenge.");
      return;
    }

    const hintText = challenge.hints.map((hint: string, idx: number) =>
      `💡 Hint ${idx + 1}: ${hint}`
    ).join('\n\n');

    setOutput(hintText);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden">
      <SEO
        title="Coding Challenges | CodeAcademy Pro"
        description="Master programming with our curated, interactive coding challenges."
      />

      {/* Background Animated Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-4">
            <BackButton />
            <div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight">
                Coding <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Challenges</span>
              </h1>
              <p className="text-slate-400 mt-2 text-lg">Master algorithms and syntax through hands-on practice.</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-3xl min-w-[300px]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold uppercase tracking-widest text-slate-500">Global Progress</span>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                {completedCount}/{currentChallenges.length} Done
              </Badge>
            </div>
            <Progress value={progressPercent} className="h-2 bg-slate-800" />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Challenge Selector - Left Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12 text-white">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white">
                    {availableLanguages.map((lang) => (
                      <SelectItem key={lang} value={lang} className="capitalize">{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12 text-white">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white">
                    <SelectItem value="beginner">Beginner (Easy)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (Medium)</SelectItem>
                    <SelectItem value="advanced">Advanced (Hard)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Card className="bg-white/5 border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-white/5 py-4">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Available Challenges
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="space-y-1">
                    {currentChallenges.map((c, idx) => (
                      <button
                        key={c.id}
                        onClick={() => setCurrentChallengeIdx(idx)}
                        className={`w-full group flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${currentChallengeIdx === idx
                          ? "bg-blue-600/20 text-blue-400"
                          : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          {completedChallenges[c.id] ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Circle className={`w-4 h-4 ${currentChallengeIdx === idx ? "text-blue-400" : "text-slate-600"}`} />
                          )}
                          <span className="font-medium text-sm truncate max-w-[140px]">{c.title}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform ${currentChallengeIdx === idx ? "rotate-90" : "group-hover:translate-x-1"}`} />
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Button
                variant="outline"
                className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-2xl h-14 font-bold text-lg group transition-all duration-300"
                onClick={() => setShowLeaderboard(true)}
              >
                <Trophy className="w-5 h-5 mr-3 text-yellow-500 group-hover:scale-120 transition-transform" />
                View Leaderboard
              </Button>
            </div>
          </aside>

          {/* Editor Area - Main Content */}
          <main className="lg:col-span-9 space-y-6">
            <AnimatePresence mode="wait">
              {challenge ? (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Problem Description */}
                  <Card className="bg-white/5 border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4 mb-2">
                        <Badge className="bg-blue-600/20 text-blue-300 border-none">Challenge #{currentChallengeIdx + 1}</Badge>
                        <Badge className="bg-white/5 text-slate-400 border-white/10 uppercase tracking-widest text-[10px]">{selectedDifficulty}</Badge>
                      </div>
                      <CardTitle className="text-3xl font-black">{challenge.title}</CardTitle>
                      <CardDescription className="text-slate-400 text-lg">{challenge.problem}</CardDescription>
                    </CardHeader>
                  </Card>

                  {/* Code Editor Console */}
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                    <div className="xl:col-span-8 space-y-4">
                      {/* Terminal Styled Editor */}
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative bg-[#0d1117] rounded-xl border border-white/10 shadow-2xl overflow-hidden">
                          <div className="bg-white/5 px-4 py-2 flex items-center justify-between border-b border-white/5">
                            <div className="flex gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-red-500/50" />
                              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                              <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest flex items-center gap-2">
                              <Code2 className="w-3 h-3" />
                              {selectedLanguage} Editor
                            </div>
                            <div className="w-12" />
                          </div>
                          <textarea
                            className="w-full h-[400px] bg-transparent text-blue-50 p-6 font-mono text-sm resize-none outline-none focus:ring-0 selection:bg-blue-500/30"
                            value={userCode}
                            onChange={(e) => setUserCode(e.target.value)}
                            spellCheck={false}
                          />
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex flex-wrap gap-4">
                        <Button
                          onClick={runTests}
                          disabled={isRunning}
                          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold h-14 rounded-2xl shadow-lg shadow-blue-900/20 transition-all active:scale-95"
                        >
                          {isRunning ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="mr-2">
                              <Zap className="w-5 h-5" />
                            </motion.div>
                          ) : (
                            <Play className="w-5 h-5 mr-2 fill-current" />
                          )}
                          {isRunning ? "Executing..." : "Submit Solution"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setUserCode(challenge.starterCode)}
                          className="px-6 border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white rounded-2xl h-14"
                        >
                          <RotateCcw className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={showHints}
                          className="px-6 border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white rounded-2xl h-14"
                        >
                          <Lightbulb className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Output/Tests Console */}
                    <div className="xl:col-span-4 space-y-6">
                      <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden h-full">
                        <CardHeader className="bg-white/5 py-3 border-b border-white/5">
                          <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                            <Terminal className="w-3 h-3" />
                            System Output
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                          <pre className={`text-sm font-mono whitespace-pre-wrap ${isRunning ? "animate-pulse" : ""} ${output.startsWith("✅") ? "text-emerald-400" : output.startsWith("❌") ? "text-rose-400" : "text-blue-300"}`}>
                            {output || "Waiting for execution..."}
                          </pre>

                          {testResults.length > 0 && (
                            <div className="space-y-4">
                              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Test Results</h4>
                              {testResults.map((result, idx) => (
                                <div
                                  key={idx}
                                  className={`p-4 rounded-2xl border ${result.passed
                                    ? "bg-green-500/5 border-green-500/20"
                                    : "bg-red-500/5 border-red-500/20"
                                    } transition-all duration-300`}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-mono text-slate-400 capitalize">{result.description || `Case #${idx + 1}`}</span>
                                    {result.passed ? (
                                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    ) : (
                                      <XCircle className="w-4 h-4 text-red-500" />
                                    )}
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 text-[10px] font-mono">
                                    <div>
                                      <div className="text-slate-500 mb-1">INPUT</div>
                                      <div className="text-slate-300 bg-black/20 p-2 rounded-lg truncate">{result.input}</div>
                                    </div>
                                    <div>
                                      <div className="text-slate-500 mb-1">EXPECTED</div>
                                      <div className="text-blue-400 bg-black/20 p-2 rounded-lg truncate">{result.expected}</div>
                                    </div>
                                  </div>
                                  {!result.passed && (
                                    <div className="mt-3 pt-3 border-t border-white/5">
                                      <div className="text-[10px] text-slate-500 mb-1 font-mono uppercase">ACTUAL</div>
                                      <div className="text-red-400 font-mono text-xs">{result.actual || "No output returned"}</div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 p-6 rounded-3xl border border-white/10">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-2 bg-indigo-500 rounded-xl">
                            <MessageSquare className="w-5 h-5 text-white" />
                          </div>
                          <h4 className="font-bold">Need Help?</h4>
                        </div>
                        <p className="text-sm text-slate-400 mb-4">Stuck on this logic? Our AI Tutor can guide you without giving the answer away.</p>
                        <Button
                          onClick={() => {
                            // Navigate to AI Tutor with challenge context
                            const challengeContext = `I'm working on: ${challenge.title}\n\nProblem: ${challenge.problem}\n\nLanguage: ${challenge.language || selectedLanguage}\n\nCan you help me understand this without giving away the answer?`;
                            // Store context in sessionStorage so AI Tutor can use it
                            sessionStorage.setItem('aiTutorContext', challengeContext);
                            sessionStorage.setItem('aiTutorChallenge', JSON.stringify({
                              title: challenge.title,
                              problem: challenge.problem,
                              language: challenge.language || selectedLanguage,
                              starterCode: challenge.starterCode
                            }));
                            // Navigate to AI Tutor
                            window.location.href = '/ai-tutor';
                          }}
                          className="w-full bg-white text-indigo-600 font-bold rounded-xl hover:bg-slate-100"
                        >
                          Ask AI Tutor ✨
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="p-6 bg-white/5 rounded-full border border-white/10">
                    <Zap className="w-12 h-12 text-slate-600" />
                  </div>
                  <h3 className="text-2xl font-bold">No Challenges Found</h3>
                  <p className="text-slate-500">Try changing the language or difficulty level.</p>
                </div>
              )}
            </AnimatePresence>
          </main>
        </div>

        {/* Footer Actions */}
        <footer className="mt-20 flex flex-col items-center text-center space-y-8">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 px-8 h-12 rounded-full" onClick={() => navigate('/learning-paths')}>
              Explore All Paths
            </Button>
            <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 px-8 h-12 rounded-full" onClick={() => navigate('/study-groups')}>
              Community Forum
            </Button>
            <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 px-8 h-12 rounded-full" onClick={() => navigate('/success-stories')}>
              Success Stories
            </Button>
          </div>
          <p className="text-slate-600 text-[10px] uppercase tracking-[0.3em] font-medium">
            © 2025 CodeAcademy Pro • Built for the next generation of engineers
          </p>
        </footer>
      </div>
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-800 border border-green-500/20 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              {/* Celebration Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 blur-3xl" />

              <div className="relative z-10 p-8">
                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center border-4 border-green-500/30 animate-pulse">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-3xl font-black text-white text-center mb-2">Challenge Completed!</h2>
                <p className="text-slate-400 text-center mb-8">Outstanding work! You've earned points.</p>

                {user && userStats ? (
                  <>
                    {/* Points Earned */}
                    <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-white/10">
                      <div className="text-center">
                        <div className="text-5xl font-black text-green-500 mb-2">+{userStats.pointsEarned}</div>
                        <div className="text-slate-400 text-sm uppercase tracking-widest">Points Earned</div>
                      </div>
                    </div>

                    {/* User Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
                        <div className="text-2xl font-black text-blue-400">#{userStats.rank}</div>
                        <div className="text-slate-500 text-xs uppercase tracking-widest mt-1">Your Rank</div>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
                        <div className="text-2xl font-black text-yellow-400">{userStats.totalPoints}</div>
                        <div className="text-slate-500 text-xs uppercase tracking-widest mt-1">Total Points</div>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
                        <div className="text-2xl font-black text-purple-400">{userStats.challengesCompleted}</div>
                        <div className="text-slate-500 text-xs uppercase tracking-widest mt-1">Completed</div>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
                        <div className="text-2xl font-black text-pink-400">{userStats.totalUsers}</div>
                        <div className="text-slate-500 text-xs uppercase tracking-widest mt-1">Total Users</div>
                      </div>
                    </div>

                    {/* Leaderboard CTA */}
                    <Button
                      onClick={() => {
                        setShowSuccessModal(false);
                        setShowLeaderboard(true);
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold h-14 rounded-2xl mb-3"
                    >
                      <Trophy className="w-5 h-5 mr-2" />
                      View Full Leaderboard
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-slate-400 mb-6">Sign in to track your progress and compete on the leaderboard!</p>
                    <Button
                      onClick={() => setShowSuccessModal(false)}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 px-8 rounded-2xl"
                    >
                      Continue Coding
                    </Button>
                  </div>
                )}

                {/* Close Button */}
                <Button
                  variant="ghost"
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl h-12 mt-2"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Leaderboard Modal */}
      <AnimatePresence>
        {showLeaderboard && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLeaderboard(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center border border-yellow-500/20">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">Global Ranking</h2>
                    <p className="text-slate-500 text-sm font-medium">Top performing syntax builders</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowLeaderboard(false)}
                  className="rounded-full hover:bg-white/5 text-slate-400"
                >
                  <ChevronRight className="w-6 h-6 rotate-90" />
                </Button>
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="space-y-4">
                  {leaderboardData.length > 0 ? leaderboardData.map((entry, idx) => {
                    const isCurrentUser = user && entry.user_id === user.id;

                    return (
                      <div
                        key={entry.user_id}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${isCurrentUser
                          ? 'bg-blue-500/20 border-blue-500/50 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/20'
                          : 'bg-white/5 border-white/5 hover:bg-white/10'
                          }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${idx === 0 ? "bg-yellow-500 text-slate-950" :
                            idx === 1 ? "bg-slate-300 text-slate-950" :
                              idx === 2 ? "bg-amber-600 text-slate-950" :
                                isCurrentUser ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-400"
                            }`}>
                            {idx + 1}
                          </div>
                          <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 bg-slate-800">
                            {entry.users?.avatar ? (
                              <img src={entry.users.avatar} alt={entry.users.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                                {entry.users?.name?.[0] || "?"}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className={`font-bold text-lg flex items-center gap-2 ${isCurrentUser ? 'text-blue-400' : 'text-white'}`}>
                              {entry.users?.name || "Anonymous"}
                              {isCurrentUser && (
                                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">YOU</Badge>
                              )}
                            </div>
                            <div className="text-slate-500 text-xs font-mono uppercase tracking-widest">{entry.total_points} EXP</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <Badge variant="outline" className={`${idx === 0 ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' :
                            idx < 3 ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' :
                              'border-slate-500/30 text-slate-400 bg-slate-500/10'
                            }`}>
                            {idx === 0 ? "Master" : idx < 3 ? "Pro" : "Student"}
                          </Badge>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 border border-white/5">
                        <Trophy className="w-8 h-8 text-slate-600" />
                      </div>
                      <p className="text-slate-500 font-medium">No rankings available yet.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 bg-white/5 border-t border-white/5 text-center">
                <p className="text-slate-500 text-sm">Keep solving challenges to climb the ranks!</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CodingChallenges;
