import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Code2,
  Play,
  RefreshCw,
  Save,
  Share2,
  Download,
  CheckCircle,
  AlertCircle,
  Loader2,
  Terminal,
  Cpu,
  Lightbulb,
  Maximize2,
  Trash2,
  FileCode
} from "lucide-react";
import SEO from "@/components/SEO";

// Language configurations
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
  const [activeTab, setActiveTab] = useState("output");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleSaveCode = useCallback(() => {
    localStorage.setItem(`playground_${selectedLanguage}`, code);
    setSavedCode(code);
    toast({
      title: "Code saved!",
      description: "Your code has been saved locally.",
    });
  }, [code, selectedLanguage, toast]);

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
    setActiveTab("output");
    const startTime = Date.now();

    try {
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
    setSavedCode(saved || null);
  }, [selectedLanguage]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunCode();
      }
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
      toast({ title: "Code loaded!", description: "Your saved code has been loaded." });
    }
  };

  const handleShareCode = async () => {
    const shareData = {
      title: `${LANGUAGES[selectedLanguage].name} Code`,
      text: code,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "Code copied!", description: "Code has been copied to clipboard." });
    }
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
    toast({ title: "Downloaded!", description: `Code saved as code.${lang.extension}` });
  };

  const handleReset = () => {
    const lang = LANGUAGES[selectedLanguage];
    setCode(lang.starter);
    setOutput("");
    setError(null);
    setExecutionTime(null);
    toast({ title: "Code reset", description: "Editor has been reset to default code." });
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Code Playground",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "programmingLanguage": Object.keys(LANGUAGES),
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <SEO
        title="Code Playground - Interactive Online IDE | CodeAcademy Pro"
        description="Write, run, and test code in multiple programming languages instantly. Our free online code playground supports JavaScript, Python, Java, C++, Rust, Go and more. No installation required - start coding in your browser!"
        keywords="code playground, online IDE, code editor, javascript playground, python playground, java playground, rust playground, go playground, c++ playground, online code editor, web IDE, code runner, execute code online, programming playground, coding sandbox, interactive coding, learn to code, practice programming"
        image="https://codeacadmy.vercel.app/og-code-playground.png"
        type="website"
        url="https://codeacadmy.vercel.app/code-playground"
        structuredData={structuredData}
      />

      {/* Header Toolbar */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <BackButton label="Home" className="mr-2" />
          <div className="hidden md:flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            <h1 className="font-semibold text-lg">Playground</h1>
          </div>
          <div className="h-6 w-px bg-border hidden md:block" />

          <Select value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as keyof typeof LANGUAGES)}>
            <SelectTrigger className="w-[180px] h-9">
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
            disabled={isExecuting}
            size="sm"
            className="gap-2 font-semibold shadow-sm"
          >
            {isExecuting ? (
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

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => {
            const lang = LANGUAGES[selectedLanguage];
            setCode(lang.starter);
          }} title="Reset Code">
            <RefreshCw className="h-4 w-4" />
          </Button>
          {savedCode && (
            <Button variant="ghost" size="icon" onClick={handleLoadSaved} title="Load Saved">
              <FileCode className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={handleSaveCode} title="Save">
            <Save className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShareCode} title="Share">
            {copied ? <CheckCircle className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDownload} title="Download">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full rounded-none border-0">

          {/* Editor Panel */}
          <ResizablePanel defaultSize={60} minSize={30}>
            <div className="h-full flex flex-col bg-slate-950">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
                <span className="text-xs text-slate-400 font-mono flex items-center gap-2">
                  <FileCode className="h-3 w-3" />
                  main.{LANGUAGES[selectedLanguage].extension}
                </span>
                <span className="text-xs text-slate-500">
                  {code.length} chars
                </span>
              </div>
              <Textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 p-4 font-mono text-sm leading-relaxed resize-none border-0 bg-transparent text-slate-100 focus-visible:ring-0 rounded-none focus-visible:ring-offset-0"
                placeholder="Write your code here..."
                spellCheck={false}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Tools Panel */}
          <ResizablePanel defaultSize={40} minSize={20}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="border-b px-2 bg-muted/30">
                <TabsList className="h-9">
                  <TabsTrigger value="output" className="text-xs gap-2">
                    <Terminal className="h-3 w-3" /> Output
                  </TabsTrigger>
                  <TabsTrigger value="stats" className="text-xs gap-2">
                    <Cpu className="h-3 w-3" /> Stats
                  </TabsTrigger>
                  <TabsTrigger value="tips" className="text-xs gap-2">
                    <Lightbulb className="h-3 w-3" /> Tips
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-hidden bg-background">
                <TabsContent value="output" className="h-full m-0 p-0 border-0 data-[state=active]:flex flex-col">
                  <div className="flex items-center justify-between px-4 py-2 border-b">
                    <h3 className="text-sm font-medium">Console Output</h3>
                    {output && (
                      <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setOutput("")}>
                        <Trash2 className="h-3 w-3 mr-1" /> Clear
                      </Button>
                    )}
                  </div>
                  <ScrollArea className="flex-1 w-full bg-slate-950/5 p-4">
                    {error ? (
                      <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="font-mono text-xs whitespace-pre-wrap">{error}</AlertDescription>
                      </Alert>
                    ) : null}
                    {output ? (
                      <pre className="font-mono text-sm whitespace-pre-wrap text-foreground">{output}</pre>
                    ) : (
                      <div className="text-center text-muted-foreground py-12">
                        <Terminal className="h-10 w-10 mx-auto mb-3 opacity-20" />
                        <p className="text-sm">Run code to see output</p>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="stats" className="h-full m-0 p-4">
                  <div className="grid gap-4">
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm font-medium">Execution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between py-1">
                          <span className="text-sm text-muted-foreground">Status</span>
                          <Badge variant={error ? "destructive" : "default"}>
                            {isExecuting ? "Running" : error ? "Failed" : "Idle"}
                          </Badge>
                        </div>
                        {executionTime !== null && (
                          <div className="flex items-center justify-between py-1 mt-2">
                            <span className="text-sm text-muted-foreground">Time</span>
                            <span className="font-mono font-medium">{executionTime}ms</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm font-medium">Code Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between py-1">
                          <span className="text-sm text-muted-foreground">Language</span>
                          <span className="font-medium">{LANGUAGES[selectedLanguage].name}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 mt-2">
                          <span className="text-sm text-muted-foreground">Lines</span>
                          <span className="font-mono font-medium">{code.split('\n').length}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 mt-2">
                          <span className="text-sm text-muted-foreground">Characters</span>
                          <span className="font-mono font-medium">{code.length}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="tips" className="h-full m-0 p-4">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border bg-muted/50">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Maximize2 className="h-4 w-4" /> Keyboard Shortcuts
                      </h4>
                      <ul className="text-sm space-y-2 text-muted-foreground">
                        <li className="flex items-center justify-between">
                          <span>Run Code</span>
                          <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100"><span className="text-xs">⌘</span>Enter</kbd>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>Save Code</span>
                          <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100"><span className="text-xs">⌘</span>S</kbd>
                        </li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-lg border bg-muted/50">
                      <h4 className="font-medium mb-2">About {LANGUAGES[selectedLanguage].name}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {LANGUAGES[selectedLanguage].name} files use the
                        <code className="mx-1 px-1 py-0.5 rounded bg-muted-foreground/20 font-mono text-xs">
                          .{LANGUAGES[selectedLanguage].extension}
                        </code>
                        extension.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default CodePlayground;
