import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BackButton } from "@/components/BackButton";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import { 
  Send, 
  Code, 
  Lightbulb, 
  BookOpen, 
  Target, 
  TrendingUp,
  MessageCircle,
  FileText,
  Play,
  CheckCircle,
  AlertCircle,
  Zap,
  Brain,
  User,
  Bot,
  Clock,
  Star
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  code?: string;
  language?: string;
  suggestions?: string[];
}

interface LearningRecommendation {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  category: string;
  completed: boolean;
}

const AITutor = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI programming tutor. I can help you with:\n\n• Code explanations and debugging\n• Learning recommendations\n• Practice exercises\n• Concept explanations\n• Best practices and tips\n\nWhat would you like to learn today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock AI responses based on user input
  const generateAIResponse = async (userMessage: string): Promise<Message> => {
    setIsTyping(true);
    
    // Simulate AI processing time - reduced delay for faster response
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
    
    const lowerMessage = userMessage.toLowerCase();
    let response = "";
    let code = "";
    let language = "";
    let suggestions: string[] = [];

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      response = "Hello! How can I help you with your programming journey today?";
    } else if (lowerMessage.includes("loop") || lowerMessage.includes("for")) {
      response = "Great question! Loops are fundamental programming concepts. Here's a comprehensive explanation:";
      code = `// For Loop Example
for (int i = 0; i < 5; i++) {
    System.out.println("Iteration: " + i);
}

// While Loop Example
int count = 0;
while (count < 3) {
    System.out.println("Count: " + count);
    count++;
}

// For-Each Loop (Java)
String[] fruits = {"Apple", "Banana", "Orange"};
for (String fruit : fruits) {
    System.out.println(fruit);
}`;
      language = "java";
      suggestions = [
        "Practice: Create a loop that prints numbers 1 to 10",
        "Challenge: Use a loop to calculate the sum of first 100 numbers",
        "Advanced: Implement nested loops to create a multiplication table"
      ];
    } else if (lowerMessage.includes("array") || lowerMessage.includes("list")) {
      response = "Arrays and lists are essential data structures. Here's how to work with them:";
      code = `// Array Declaration and Initialization
int[] numbers = {1, 2, 3, 4, 5};

// Accessing Elements
System.out.println("First element: " + numbers[0]);

// Iterating through Array
for (int i = 0; i < numbers.length; i++) {
    System.out.println(numbers[i]);
}

// Enhanced for loop
for (int number : numbers) {
    System.out.println(number);
}`;
      language = "java";
      suggestions = [
        "Practice: Find the maximum value in an array",
        "Challenge: Reverse an array in-place",
        "Advanced: Implement binary search on a sorted array"
      ];
    } else if (lowerMessage.includes("function") || lowerMessage.includes("method")) {
      response = "Functions/methods help organize code and make it reusable. Here's a detailed explanation:";
      code = `// Method Declaration
public static int add(int a, int b) {
    return a + b;
}

// Method with different return types
public static void printMessage(String message) {
    System.out.println(message);
}

// Method with multiple parameters
public static double calculateArea(double length, double width) {
    return length * width;
}

// Using methods
public static void main(String[] args) {
    int result = add(5, 3);
    printMessage("Sum is: " + result);
    
    double area = calculateArea(10.5, 5.2);
    System.out.println("Area: " + area);
}`;
      language = "java";
      suggestions = [
        "Practice: Create a method to calculate factorial",
        "Challenge: Implement a method to check if a number is prime",
        "Advanced: Create a recursive method to calculate Fibonacci numbers"
      ];
    } else if (lowerMessage.includes("error") || lowerMessage.includes("bug") || lowerMessage.includes("problem")) {
      response = "Let me help you debug! Here are some common debugging strategies:";
      code = `// Common Debugging Techniques

// 1. Print Statements
System.out.println("Debug: Variable value = " + variable);

// 2. Try-Catch for Exception Handling
try {
    int result = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Error: " + e.getMessage());
}

// 3. Input Validation
if (input == null || input.isEmpty()) {
    System.out.println("Error: Invalid input");
    return;
}`;
      language = "java";
      suggestions = [
        "Check for null pointers before accessing objects",
        "Validate user input before processing",
        "Use try-catch blocks for exception handling"
      ];
    } else if (lowerMessage.includes("object") || lowerMessage.includes("class")) {
      response = "Object-Oriented Programming is a powerful paradigm. Here's how classes and objects work:";
      code = `// Class Definition
public class Student {
    // Instance variables
    private String name;
    private int age;
    private String major;
    
    // Constructor
    public Student(String name, int age, String major) {
        this.name = name;
        this.age = age;
        this.major = major;
    }
    
    // Getter methods
    public String getName() {
        return name;
    }
    
    public int getAge() {
        return age;
    }
    
    // Method
    public void study() {
        System.out.println(name + " is studying " + major);
    }
}

// Creating and using objects
Student student1 = new Student("Alice", 20, "Computer Science");
student1.study();`;
      language = "java";
      suggestions = [
        "Practice: Create a Rectangle class with area and perimeter methods",
        "Challenge: Implement inheritance with a Person and Employee class",
        "Advanced: Create an abstract class for different shapes"
      ];
    } else {
      response = "I understand you're asking about programming! While I can provide general guidance, for specific questions, try asking about:\n\n• Loops and control structures\n• Arrays and data structures\n• Functions and methods\n• Object-oriented programming\n• Error handling and debugging\n• Best practices\n\nWhat specific programming concept would you like to explore?";
    }

    setIsTyping(false);
    
    return {
      id: Date.now().toString(),
      type: 'ai',
      content: response,
      timestamp: new Date(),
      code: code || undefined,
      language: language || undefined,
      suggestions: suggestions.length > 0 ? suggestions : undefined
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    const aiResponse = await generateAIResponse(inputMessage);
    setMessages(prev => [...prev, aiResponse]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const learningRecommendations: LearningRecommendation[] = [
    {
      id: '1',
      title: 'Java Fundamentals',
      description: 'Master basic Java syntax, variables, and control structures',
      difficulty: 'beginner',
      estimatedTime: '2-3 hours',
      category: 'Java',
      completed: false
    },
    {
      id: '2',
      title: 'Object-Oriented Programming',
      description: 'Learn classes, objects, inheritance, and polymorphism',
      difficulty: 'intermediate',
      estimatedTime: '4-5 hours',
      category: 'Java',
      completed: false
    },
    {
      id: '3',
      title: 'Data Structures',
      description: 'Understand arrays, lists, maps, and their implementations',
      difficulty: 'intermediate',
      estimatedTime: '3-4 hours',
      category: 'Algorithms',
      completed: false
    },
    {
      id: '4',
      title: 'Python Basics',
      description: 'Start with Python syntax and basic programming concepts',
      difficulty: 'beginner',
      estimatedTime: '2-3 hours',
      category: 'Python',
      completed: false
    },
    {
      id: '5',
      title: 'Web Development Fundamentals',
      description: 'Learn HTML, CSS, and JavaScript basics',
      difficulty: 'beginner',
      estimatedTime: '3-4 hours',
      category: 'Web Development',
      completed: false
    }
  ];

  const quickQuestions = [
    "How do I create a loop in Java?",
    "What's the difference between arrays and lists?",
    "How do I handle errors in my code?",
    "Can you explain object-oriented programming?",
    "What are the best practices for naming variables?",
    "How do I debug my code effectively?"
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalService",
    "name": "AI Programming Tutor",
    "description": "Get instant help with programming questions from our AI tutor. Learn coding concepts, debug code, and improve your skills with personalized guidance.",
    "provider": {
      "@type": "Organization",
      "name": "CodeAcademy Pro"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-6 pt-6">
        <BackButton />
      </div>
      
      <SEO
        title="AI Tutor - Get Programming Help from AI | CodeAcademy Pro"
        description="Get instant help with programming questions from our AI tutor. Learn coding concepts, debug code, and improve your skills with personalized guidance. 24/7 available."
        keywords="AI tutor, programming tutor, coding help, AI coding assistant, programming help, code tutor, learn programming, coding questions"
        structuredData={structuredData}
      />
      {/* Header */}
      <header className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-b border-border">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              AI Programming Tutor
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get personalized help with your programming questions, code reviews, and learning recommendations. 
              Your AI tutor is here to guide you through your programming journey.
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <Brain className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle>AI Tutor</CardTitle>
                      <CardDescription>
                        {isTyping ? "AI is typing..." : "Online - Ready to help"}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-muted-foreground">Active</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                    <TabsTrigger value="code">Code Analysis</TabsTrigger>
                    <TabsTrigger value="learning">Learning Path</TabsTrigger>
                  </TabsList>

                  <TabsContent value="chat" className="flex-1 flex flex-col">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                            <div className={`flex items-start space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                              }`}>
                                {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                              </div>
                              <div className={`rounded-lg p-3 ${
                                message.type === 'user' 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-muted'
                              }`}>
                                <div className="whitespace-pre-wrap">{message.content}</div>
                                {message.code && (
                                  <div className="mt-3">
                                    <div className="bg-code-bg p-3 rounded-lg">
                                      <pre className="text-code-foreground font-mono text-sm overflow-x-auto">
                                        <code>{message.code}</code>
                                      </pre>
                                    </div>
                                    {message.language && (
                                      <Badge variant="outline" className="mt-2">
                                        {message.language}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                                {message.suggestions && (
                                  <div className="mt-3 space-y-2">
                                    <div className="text-sm font-medium">Suggestions:</div>
                                    {message.suggestions.map((suggestion, index) => (
                                      <div key={index} className="text-sm bg-accent/50 p-2 rounded">
                                        💡 {suggestion}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <div className="text-xs opacity-70 mt-2">
                                  {message.timestamp.toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="flex items-center space-x-2 bg-muted rounded-lg p-3">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <span className="text-sm text-muted-foreground">AI is thinking...</span>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Questions */}
                    <div className="mb-4">
                      <div className="text-sm font-medium mb-2">Quick Questions:</div>
                      <div className="flex flex-wrap gap-2">
                        {quickQuestions.map((question, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => setInputMessage(question)}
                            className="text-xs"
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Input */}
                    <div className="flex space-x-2">
                      <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything about programming..."
                        className="flex-1"
                        disabled={isTyping}
                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isTyping}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="code" className="flex-1 flex flex-col">
                    <div className="flex-1 p-4">
                      <div className="text-center py-8">
                        <Code className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Code Analysis</h3>
                        <p className="text-muted-foreground mb-4">
                          Paste your code here for analysis, debugging help, and improvement suggestions.
                        </p>
                        <div className="space-y-4">
                          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                            <SelectTrigger className="w-full max-w-xs mx-auto">
                              <SelectValue placeholder="Select programming language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Languages</SelectItem>
                              <SelectItem value="java">Java</SelectItem>
                              <SelectItem value="python">Python</SelectItem>
                              <SelectItem value="javascript">JavaScript</SelectItem>
                              <SelectItem value="cpp">C++</SelectItem>
                              <SelectItem value="csharp">C#</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button className="w-full max-w-xs">
                            <FileText className="w-4 h-4 mr-2" />
                            Upload Code File
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="learning" className="flex-1 flex flex-col">
                    <div className="flex-1 p-4 overflow-y-auto">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Personalized Learning Recommendations</h3>
                          <Badge variant="outline">
                            {learningRecommendations.filter(r => !r.completed).length} remaining
                          </Badge>
                        </div>
                        
                        {learningRecommendations.map((recommendation) => (
                          <Card key={recommendation.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <h4 className="font-semibold">{recommendation.title}</h4>
                                    <Badge variant={
                                      recommendation.difficulty === 'beginner' ? 'default' :
                                      recommendation.difficulty === 'intermediate' ? 'secondary' : 'destructive'
                                    }>
                                      {recommendation.difficulty}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {recommendation.description}
                                  </p>
                                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                    <span className="flex items-center">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {recommendation.estimatedTime}
                                    </span>
                                    <span>{recommendation.category}</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {recommendation.completed ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                  ) : (
                                    <Button size="sm">
                                      <Play className="w-4 h-4 mr-1" />
                                      Start
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Progress */}
            {isAuthenticated && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Your Progress</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Java Fundamentals</span>
                        <span>75%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Python Basics</span>
                        <span>45%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-accent h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <Button variant="outline" size="sm" className="w-full">
                        View Full Progress
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Capabilities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>AI Capabilities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Code Analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Debugging Help</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Learning Paths</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Best Practices</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Concept Explanations</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5" />
                  <span>Session Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Questions Asked</span>
                    <span className="text-sm font-medium">{messages.filter(m => m.type === 'user').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Topics Covered</span>
                    <span className="text-sm font-medium">6</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Learning Streak</span>
                    <span className="text-sm font-medium">7 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITutor; 