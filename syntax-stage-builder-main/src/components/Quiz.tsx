import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trophy, 
  Brain, 
  Target,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Star,
  Timer,
  Award,
  BookOpen,
  Zap
} from "lucide-react";

interface Question {
  id: string;
  type: 'multiple-choice' | 'multiple-select' | 'true-false' | 'coding' | 'fill-blank';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  points: number;
  timeLimit?: number; // in seconds
}

interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeTaken: number;
  accuracy: number;
  grade: string;
  feedback: string;
}

const Quiz = () => {
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string | string[] }>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResult | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Sample quiz questions
  const questions: Question[] = [
    {
      id: "1",
      type: "multiple-choice",
      question: "What is the correct way to declare a variable in Java?",
      options: [
        "var x = 10;",
        "int x = 10;",
        "variable x = 10;",
        "let x = 10;"
      ],
      correctAnswer: "int x = 10;",
      explanation: "In Java, variables must be declared with their data type. 'int' is the correct keyword for integer variables.",
      difficulty: "easy",
      category: "Java Basics",
      points: 10
    },
    {
      id: "2",
      type: "multiple-select",
      question: "Which of the following are primitive data types in Java?",
      options: [
        "int",
        "String",
        "boolean",
        "double",
        "ArrayList"
      ],
      correctAnswer: ["int", "boolean", "double"],
      explanation: "int, boolean, and double are primitive data types. String and ArrayList are reference types.",
      difficulty: "medium",
      category: "Java Data Types",
      points: 15
    },
    {
      id: "3",
      type: "true-false",
      question: "Java is a compiled language that runs on the Java Virtual Machine (JVM).",
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "Java is compiled to bytecode which runs on the JVM, making it platform-independent.",
      difficulty: "easy",
      category: "Java Fundamentals",
      points: 10
    },
    {
      id: "4",
      type: "fill-blank",
      question: "Complete the following Java method declaration: public _____ void main(String[] args)",
      correctAnswer: "static",
      explanation: "The main method must be declared as static to be called by the JVM without creating an instance of the class.",
      difficulty: "medium",
      category: "Java Methods",
      points: 12
    },
    {
      id: "5",
      type: "coding",
      question: "Write a Java method that calculates the factorial of a given number. The method should be named 'factorial' and take an integer parameter.",
      correctAnswer: "public static int factorial(int n) { if (n <= 1) return 1; return n * factorial(n - 1); }",
      explanation: "This recursive implementation calculates factorial by multiplying n with factorial of (n-1) until reaching the base case.",
      difficulty: "hard",
      category: "Java Methods",
      points: 20
    },
    {
      id: "6",
      type: "multiple-choice",
      question: "What is the output of: System.out.println(5 / 2);",
      options: [
        "2.5",
        "2",
        "2.0",
        "Error"
      ],
      correctAnswer: "2",
      explanation: "Integer division in Java truncates the decimal part, so 5/2 = 2.",
      difficulty: "easy",
      category: "Java Operators",
      points: 10
    },
    {
      id: "7",
      type: "multiple-select",
      question: "Which of the following are valid loop constructs in Java?",
      options: [
        "for loop",
        "while loop",
        "do-while loop",
        "foreach loop",
        "repeat loop"
      ],
      correctAnswer: ["for loop", "while loop", "do-while loop", "foreach loop"],
      explanation: "Java supports for, while, do-while, and enhanced for (foreach) loops. There is no 'repeat' loop in Java.",
      difficulty: "medium",
      category: "Java Control Flow",
      points: 15
    },
    {
      id: "8",
      type: "true-false",
      question: "In Java, arrays have a fixed size that cannot be changed after creation.",
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "Java arrays have a fixed size. If you need a resizable array, use ArrayList instead.",
      difficulty: "medium",
      category: "Java Arrays",
      points: 12
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    if (isQuizStarted && !isQuizCompleted && timeLeft !== null && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmitQuiz();
    }
  }, [timeLeft, isQuizStarted, isQuizCompleted]);

  const startQuiz = () => {
    setIsQuizStarted(true);
    setStartTime(new Date());
    setTimeLeft(600); // 10 minutes
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
  };

  const handleAnswerSelect = (questionId: string, answer: string | string[]) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setIsQuizCompleted(true);
    const endTime = new Date();
    const timeTaken = startTime ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000) : 0;

    let correctAnswers = 0;
    let totalPoints = 0;

    questions.forEach(question => {
      const userAnswer = selectedAnswers[question.id];
      const correctAnswer = question.correctAnswer;

      if (Array.isArray(correctAnswer)) {
        // Multiple select question
        if (Array.isArray(userAnswer) && 
            userAnswer.length === correctAnswer.length &&
            correctAnswer.every(ans => userAnswer.includes(ans))) {
          correctAnswers++;
          totalPoints += question.points;
        }
      } else {
        // Single answer question
        if (userAnswer === correctAnswer) {
          correctAnswers++;
          totalPoints += question.points;
        }
      }
    });

    const score = Math.round((correctAnswers / questions.length) * 100);
    const accuracy = Math.round((correctAnswers / questions.length) * 100);

    let grade = "";
    let feedback = "";

    if (score >= 90) {
      grade = "A";
      feedback = "Excellent! You have a strong understanding of Java fundamentals.";
    } else if (score >= 80) {
      grade = "B";
      feedback = "Good job! You have a solid grasp of the concepts.";
    } else if (score >= 70) {
      grade = "C";
      feedback = "Not bad! Review the missed questions to improve your understanding.";
    } else if (score >= 60) {
      grade = "D";
      feedback = "You need more practice. Consider reviewing the Java basics.";
    } else {
      grade = "F";
      feedback = "You should spend more time studying Java fundamentals before retaking this quiz.";
    }

    const result: QuizResult = {
      totalQuestions: questions.length,
      correctAnswers,
      score,
      timeTaken,
      accuracy,
      grade,
      feedback
    };

    setQuizResults(result);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setIsQuizStarted(false);
    setIsQuizCompleted(false);
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeLeft(null);
    setStartTime(null);
    setQuizResults(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    const userAnswer = selectedAnswers[currentQuestion.id];

    switch (currentQuestion.type) {
      case 'multiple-choice':
        return (
          <RadioGroup
            value={userAnswer as string || ""}
            onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
          >
            {currentQuestion.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="text-base cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'multiple-select':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`option-${index}`}
                  checked={(userAnswer as string[] || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const currentAnswers = userAnswer as string[] || [];
                    if (checked) {
                      handleAnswerSelect(currentQuestion.id, [...currentAnswers, option]);
                    } else {
                      handleAnswerSelect(currentQuestion.id, currentAnswers.filter(ans => ans !== option));
                    }
                  }}
                />
                <Label htmlFor={`option-${index}`} className="text-base cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'true-false':
        return (
          <RadioGroup
            value={userAnswer as string || ""}
            onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
          >
            {currentQuestion.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="text-base cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'fill-blank':
        return (
          <div className="space-y-3">
            <Textarea
              placeholder="Enter your answer..."
              value={userAnswer as string || ""}
              onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        );

      case 'coding':
        return (
          <div className="space-y-3">
            <Textarea
              placeholder="Write your code here..."
              value={userAnswer as string || ""}
              onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
              className="min-h-[200px] font-mono"
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (!isQuizStarted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Java Programming Quiz</CardTitle>
          <CardDescription>
            Test your knowledge of Java programming fundamentals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">{questions.length} Questions</span>
            </div>
            <div className="flex items-center space-x-2">
              <Timer className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">10 Minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">Multiple Choice & Coding</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">Certificate Available</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Topics Covered:</h4>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(questions.map(q => q.category))).map((category, index) => (
                <Badge key={index} variant="outline">
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <Button onClick={startQuiz} className="w-full" size="lg">
            <Zap className="w-4 h-4 mr-2" />
            Start Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (showResults && quizResults) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            quizResults.score >= 80 ? 'bg-green-100' : 
            quizResults.score >= 60 ? 'bg-yellow-100' : 'bg-red-100'
          }`}>
            <Trophy className={`w-8 h-8 ${
              quizResults.score >= 80 ? 'text-green-600' : 
              quizResults.score >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`} />
          </div>
          <CardTitle className="text-2xl">Quiz Results</CardTitle>
          <CardDescription>
            {quizResults.feedback}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{quizResults.score}%</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-accent">{quizResults.grade}</div>
              <div className="text-sm text-muted-foreground">Grade</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-secondary">{quizResults.correctAnswers}/{quizResults.totalQuestions}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{formatTime(quizResults.timeTaken)}</div>
              <div className="text-sm text-muted-foreground">Time</div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Detailed Breakdown:</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Accuracy:</span>
                <span className="font-medium">{quizResults.accuracy}%</span>
              </div>
              <div className="flex justify-between">
                <span>Questions Answered:</span>
                <span className="font-medium">{Object.keys(selectedAnswers).length}/{quizResults.totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span>Average Time per Question:</span>
                <span className="font-medium">{Math.round(quizResults.timeTaken / quizResults.totalQuestions)}s</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button onClick={resetQuiz} variant="outline" className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Quiz
            </Button>
            <Button className="flex-1">
              <Award className="w-4 h-4 mr-2" />
              Get Certificate
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
            <CardDescription>
              {currentQuestion.category} • {currentQuestion.difficulty} • {currentQuestion.points} points
            </CardDescription>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Timer className="w-4 h-4" />
              <span className="font-mono">{timeLeft ? formatTime(timeLeft) : '--:--'}</span>
            </div>
            <Badge variant="outline">
              {currentQuestion.type.replace('-', ' ')}
            </Badge>
          </div>
        </div>
        <Progress value={progress} className="w-full" />
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
          {renderQuestion()}
        </div>

        <div className="flex items-center justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center space-x-2">
            {Array.from({ length: questions.length }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full cursor-pointer ${
                  i === currentQuestionIndex
                    ? 'bg-primary'
                    : selectedAnswers[questions[i].id]
                    ? 'bg-green-500'
                    : 'bg-muted'
                }`}
                onClick={() => setCurrentQuestionIndex(i)}
              />
            ))}
          </div>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button onClick={handleSubmitQuiz}>
              Submit Quiz
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={nextQuestion}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Quiz; 