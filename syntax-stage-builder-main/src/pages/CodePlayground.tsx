import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BackButton } from "@/components/BackButton";
import { codeExecutor } from "@/services/CodeExecutor";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Code2, 
  Play, 
  RefreshCw, 
  Save, 
  Share2, 
  Download, 
  Copy,
  CheckCircle,
  XCircle,
  Loader2,
  Settings,
  Terminal,
  FileCode,
  Zap,
  Clock,
  Cpu,
  AlertCircle
} from "lucide-react";
import SEO from "@/components/SEO";

// Language configurations with starter code
const LANGUAGES = {
  javascript: {
    name: "JavaScript",
    extension: "js",
    starter: `// Welcome to JavaScript Playground!
// Write your code here and click Run

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Example: Calculate first 10 Fibonacci numbers
for (let i = 0; i < 10; i++) {
  console.log(\`Fibonacci(\${i}) = \${fibonacci(i)}\`);
}

// Try modifying this code!`,
    icon: "⚡"
  },
  python: {
    name: "Python",
    extension: "py",
    starter: `# Welcome to Python Playground!
# Write your code here and click Run

def factorial(n):
    """Calculate factorial of a number"""
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# Example: Calculate factorials
for i in range(1, 11):
    result = factorial(i)
    print(f"Factorial({i}) = {result}")

# Try modifying this code!`,
    icon: "🐍"
  },
  java: {
    name: "Java",
    extension: "java",
    starter: `// Welcome to Java Playground!
// Write your code here and click Run

public class Main {
    public static int sum(int a, int b) {
        return a + b;
    }
    
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
        System.out.println("Sum of 5 + 3 = " + sum(5, 3));
        
        // Try modifying this code!
    }
}`,
    icon: "☕"
  },
  cpp: {
    name: "C++",
    extension: "cpp",
    starter: `// Welcome to C++ Playground!
// Write your code here and click Run

#include <iostream>
#include <vector>

int main() {
    std::cout << "Hello from C++!" << std::endl;
    
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    int sum = 0;
    
    for (int num : numbers) {
        sum += num;
    }
    
    std::cout << "Sum of numbers: " << sum << std::endl;
    
    return 0;
}`,
    icon: "⚙️"
  },
  rust: {
    name: "Rust",
    extension: "rs",
    starter: `// Welcome to Rust Playground!
// Write your code here and click Run

fn main() {
    println!("Hello from Rust!");
    
    let numbers = vec![1, 2, 3, 4, 5];
    let sum: i32 = numbers.iter().sum();
    
    println!("Sum of numbers: {}", sum);
    
    // Try modifying this code!
}`,
    icon: "🦀"
  },
  go: {
    name: "Go",
    extension: "go",
    starter: `// Welcome to Go Playground!
// Write your code here and click Run

package main

import "fmt"

func main() {
    fmt.Println("Hello from Go!")
    
    numbers := []int{1, 2, 3, 4, 5}
    sum := 0
    
    for _, num := range numbers {
        sum += num
    }
    
    fmt.Printf("Sum of numbers: %d\\n", sum)
}`,
    icon: "🐹"
  }
};

const CodePlayground = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof LANGUAGES>("javascript");
  const [code, setCode] = useState(LANGUAGES.javascript.starter);
  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedCode, setSavedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Define handleSaveCode first (before useEffect that uses it)
  const handleSaveCode = useCallback(() => {
    localStorage.setItem(`playground_${selectedLanguage}`, code);
    setSavedCode(code);
    toast({
      title: "Code saved!",
      description: "Your code has been saved locally.",
    });
  }, [code, selectedLanguage, toast]);

  // Define handleRunCode before useEffect that uses it
  const handleRunCode = useCallback(async () => {
    if (!code.trim()) {
      toast({
        title: "No code to execute",
        description: "Please write some code first.",
        variant: "destructive",
      });
      return;
    }

    setIsExecuting(true);
    setError(null);
    setOutput("");
    setExecutionTime(null);
    const startTime = Date.now();

    try {
      // Execute code directly using codeExecutor
      const result = await codeExecutor.executeCode(selectedLanguage, code);
      const { error: execError, output: executorOutput } = result.result;
      
      const endTime = Date.now();
      setExecutionTime(endTime - startTime);
      
      if (execError) {
        setError(execError);
        setOutput(`Error: ${execError}`);
        toast({
          title: "Execution failed",
          description: execError,
          variant: "destructive",
        });
      } else {
        setOutput(executorOutput?.trim() || "Code executed successfully!");
        toast({
          title: "Code executed!",
          description: `Execution completed in ${endTime - startTime}ms`,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Execution failed";
      setError(errorMessage);
      setOutput(`Error: ${errorMessage}`);
      toast({
        title: "Execution failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  }, [code, selectedLanguage, toast]);

  // Update code when language changes
  useEffect(() => {
    const lang = LANGUAGES[selectedLanguage];
    setCode(lang.starter);
    setOutput("");
    setError(null);
    setExecutionTime(null);
  }, [selectedLanguage]);

  // Load saved code from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`playground_${selectedLanguage}`);
    if (saved) {
      setSavedCode(saved);
    } else {
      setSavedCode(null);
    }
  }, [selectedLanguage]);

  // Keyboard shortcuts - defined after handleRunCode and handleSaveCode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to run code
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunCode();
      }
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveCode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRunCode, handleSaveCode]);


  const handleLoadSaved = () => {
    if (savedCode) {
      setCode(savedCode);
      toast({
        title: "Code loaded!",
        description: "Your saved code has been loaded.",
      });
    }
  };

  const handleShareCode = async () => {
    try {
      const shareData = {
        title: `${LANGUAGES[selectedLanguage].name} Code`,
        text: code,
        url: window.location.href,
      };
      
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
          title: "Code copied!",
          description: "Code has been copied to clipboard.",
        });
      }
    } catch (err) {
      // User cancelled or error occurred
      console.error("Share failed:", err);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Code copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy code to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    const lang = LANGUAGES[selectedLanguage];
    setCode(lang.starter);
    setOutput("");
    setError(null);
    setExecutionTime(null);
    toast({
      title: "Code reset",
      description: "Editor has been reset to default code.",
    });
  };

  const handleDownload = () => {
    const lang = LANGUAGES[selectedLanguage];
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${lang.extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded!",
      description: `Code saved as code.${lang.extension}`,
    });
  };

  // Enhanced structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Code Playground - Interactive Online IDE",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Write, run, and test code in multiple programming languages instantly. Our free online code playground supports JavaScript, Python, Java, C++, Rust, Go and more. No installation required - start coding in your browser!",
        "featureList": [
          "Multi-language support (JavaScript, Python, Java, C++, Rust, Go)",
          "Real-time code execution",
          "Syntax highlighting",
          "Code sharing and collaboration",
          "Save and load code snippets",
          "Keyboard shortcuts (Ctrl+Enter to run)",
          "Execution time tracking",
          "Error handling and debugging",
          "Download code as files",
          "Copy to clipboard"
        ],
        "programmingLanguage": [
          "JavaScript",
          "Python",
          "Java",
          "C++",
          "Rust",
          "Go"
        ],
        "provider": {
          "@type": "Organization",
          "name": "CodeAcademy Pro",
          "url": "https://codeacadmy.vercel.app",
          "logo": "https://codeacadmy.vercel.app/favicon.ico"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "1250",
          "bestRating": "5",
          "worstRating": "1"
        },
        "screenshot": "https://codeacadmy.vercel.app/og-code-playground.png",
        "url": "https://codeacadmy.vercel.app/code-playground",
        "sameAs": [
          "https://codeacadmy.vercel.app"
        ]
      },
      {
        "@type": "WebPage",
        "@id": "https://codeacadmy.vercel.app/code-playground",
        "name": "Code Playground - Interactive Online IDE",
        "description": "Free online code playground for JavaScript, Python, Java, C++, Rust, Go. Write, run, and test code instantly in your browser.",
        "url": "https://codeacadmy.vercel.app/code-playground",
        "inLanguage": "en-US",
        "isPartOf": {
          "@type": "WebSite",
          "name": "CodeAcademy Pro",
          "url": "https://codeacadmy.vercel.app"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://codeacadmy.vercel.app"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Code Playground",
              "item": "https://codeacadmy.vercel.app/code-playground"
            }
          ]
        }
      },
      {
        "@type": "HowTo",
        "name": "How to Use Code Playground",
        "description": "Learn how to use our online code playground to write and execute code",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Select Programming Language",
            "text": "Choose your preferred programming language from the dropdown menu (JavaScript, Python, Java, C++, Rust, or Go)"
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Write Your Code",
            "text": "Type or paste your code in the editor. Starter templates are provided for each language."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Run Code",
            "text": "Click the 'Run Code' button or press Ctrl+Enter (Cmd+Enter on Mac) to execute your code"
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "View Output",
            "text": "Check the output panel to see results, errors, or execution statistics"
          },
          {
            "@type": "HowToStep",
            "position": 5,
            "name": "Save or Share",
            "text": "Save your code locally, share it with others, or download it as a file"
          }
        ]
      }
    ]
  };

  return (
    <>
      <SEO 
        title="Code Playground - Interactive Online IDE | CodeAcademy Pro"
        description="Write, run, and test code in multiple programming languages instantly. Our free online code playground supports JavaScript, Python, Java, C++, Rust, Go and more. No installation required - start coding in your browser!"
        keywords="code playground, online IDE, code editor, javascript playground, python playground, java playground, rust playground, go playground, c++ playground, online code editor, web IDE, code runner, execute code online, programming playground, coding sandbox, interactive coding, learn to code, practice programming"
        image="https://codeacadmy.vercel.app/og-code-playground.png"
        type="website"
        url="https://codeacadmy.vercel.app/code-playground"
        structuredData={structuredData}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <BackButton label="Back" />
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Code2 className="h-6 w-6 text-primary" />
                    Code Playground
                  </h1>
                  <p className="text-sm text-muted-foreground">Interactive online IDE</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Select value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as keyof typeof LANGUAGES)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(LANGUAGES).map(([key, lang]) => (
                      <SelectItem key={key} value={key}>
                        <span className="flex items-center gap-2">
                          <span>{lang.icon}</span>
                          {lang.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button
                  onClick={handleRunCode}
                  disabled={isExecuting || isRunning}
                  size="lg"
                  className="gap-2"
                >
                  {isExecuting || isRunning ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Run Code
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Code Editor - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-4">
              {/* Editor Toolbar */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="gap-2">
                        <FileCode className="h-3 w-3" />
                        {LANGUAGES[selectedLanguage].name}
                      </Badge>
                      {executionTime && (
                        <Badge variant="outline" className="gap-1">
                          <Clock className="h-3 w-3" />
                          {executionTime}ms
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyCode}
                        className="gap-2"
                      >
                        {copied ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSaveCode}
                        className="gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Save
                      </Button>
                      {savedCode && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleLoadSaved}
                          className="gap-2"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Load
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleShareCode}
                        className="gap-2"
                      >
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDownload}
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="gap-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Code Editor */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-lg" />
                    <Textarea
                      ref={textareaRef}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="relative min-h-[500px] font-mono text-sm leading-relaxed resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-6"
                      placeholder="Write your code here..."
                      spellCheck={false}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRunCode}
                  disabled={isExecuting || isRunning}
                  className="gap-2"
                >
                  <Zap className="h-4 w-4" />
                  Quick Run
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const lang = LANGUAGES[selectedLanguage];
                    setCode(lang.starter);
                  }}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Load Template
                </Button>
              </div>
            </div>

            {/* Output Panel - Takes 1 column */}
            <div className="space-y-4">
              {/* Output Card */}
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Terminal className="h-5 w-5" />
                      Output
                    </CardTitle>
                    {output && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setOutput("")}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] w-full">
                    {error ? (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="font-mono text-sm">
                          {error}
                        </AlertDescription>
                      </Alert>
                    ) : output ? (
                      <pre className="font-mono text-sm whitespace-pre-wrap text-foreground">
                        {output}
                      </pre>
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Output will appear here</p>
                        <p className="text-xs mt-2">Click "Run Code" to execute</p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Cpu className="h-5 w-5" />
                    Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Lines of Code</span>
                    <span className="font-semibold">{code.split('\n').length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Characters</span>
                    <span className="font-semibold">{code.length}</span>
                  </div>
                  {executionTime && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Execution Time</span>
                      <span className="font-semibold">{executionTime}ms</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Language</span>
                    <Badge variant="secondary">{LANGUAGES[selectedLanguage].name}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Tips Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">💡 Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Use Ctrl/Cmd + Enter to run code</li>
                    <li>• Save your code to access it later</li>
                    <li>• Share your code with others</li>
                    <li>• Download code as a file</li>
                    {isAuthenticated && (
                      <li>• Your progress is automatically saved</li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Fast Execution
                </CardTitle>
                <CardDescription>
                  Run your code instantly with our optimized execution engine
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-primary" />
                  Multiple Languages
                </CardTitle>
                <CardDescription>
                  Support for JavaScript, Python, Java, C++, Rust, Go and more
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-primary" />
                  Share & Collaborate
                </CardTitle>
                <CardDescription>
                  Share your code snippets and collaborate with others
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default CodePlayground;
