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
import { useIsMobile } from "@/hooks/use-mobile";
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
  const isMobile = useIsMobile();

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
    if (isMobile) {
      setActiveTab("output"); // Switch to output tab on mobile run
    }
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
  }, [code, selectedLanguage, toast, isMobile]);

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
        <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
          <BackButton label={isMobile ? "" : "Home"} className="h-8 md:h-9 px-2 md:px-3 bg-indigo-500/10 border-indigo-500/20" />
          <div className="hidden md:flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            <h1 className="font-semibold text-lg">Playground</h1>
          </div>
          <div className="hidden md:block h-6 w-px bg-border" />

          <Select value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as keyof typeof LANGUAGES)}>
            <SelectTrigger className="w-[120px] md:w-[150px] h-8 md:h-9 text-xs md:text-sm bg-slate-100/10 border-white/10 dark:bg-slate-900/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(LANGUAGES).map(([key, lang]) => (
                <SelectItem key={key} value={key}>
                  <span className="flex items-center gap-2">
                    <span>{lang.icon}</span>
                    <span className="truncate">{lang.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleRunCode}
            disabled={isExecuting}
            size="sm"
            className="gap-1 md:gap-2 font-semibold shadow-sm h-8 md:h-9 px-3 text-xs md:text-sm ml-auto md:ml-0 bg-primary hover:bg-primary/90"
          >
            {isExecuting ? (
              <>
                <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
                <span className="hidden sm:inline">Running...</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3 md:h-4 md:w-4 fill-current" />
                <span className="sm:inline">Run</span>
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center gap-1 md:gap-2 ml-2">
          <div className="hidden sm:flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => {
              const lang = LANGUAGES[selectedLanguage];
              setCode(lang.starter);
            }} title="Reset Code">
              <RefreshCw className="h-4 w-4" />
            </Button>
            {savedCode && (
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={handleLoadSaved} title="Load Saved">
                <FileCode className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="h-6 w-px bg-border hidden sm:block mx-1" />
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={handleSaveCode} title="Save">
            <Save className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={handleShareCode} title="Share">
            {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={handleDownload} title="Download">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup
          direction={isMobile ? "vertical" : "horizontal"}
          className="h-full rounded-none border-0"
        >

          {/* Editor Panel */}
          <ResizablePanel defaultSize={isMobile ? 50 : 60} minSize={30}>
            <div className="h-full flex flex-col bg-slate-950">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-white/5">
                <span className="text-[10px] md:text-xs text-slate-400 font-mono flex items-center gap-2">
                  <FileCode className="h-3 w-3" />
                  main.{LANGUAGES[selectedLanguage].extension}
                </span>
                <span className="text-[10px] md:text-xs text-slate-500 font-mono">
                  {code.split('\n').length} L | {code.length} C
                </span>
              </div>
              <div className="flex-1 relative group">
                <Textarea
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="absolute inset-0 p-4 md:p-6 font-mono text-sm md:text-base leading-relaxed resize-none border-0 bg-transparent text-slate-200 focus-visible:ring-0 rounded-none focus-visible:ring-offset-0 scrollbar-thin scrollbar-thumb-white/10"
                  placeholder="Write your code here..."
                  spellCheck={false}
                />
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-slate-800 border-slate-700 hover:bg-primary/50 transition-colors" />

          {/* Tools Panel */}
          <ResizablePanel defaultSize={isMobile ? 50 : 40} minSize={20}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col bg-slate-900 text-slate-200">
              <div className="border-b border-white/5 px-2 bg-slate-950/20">
                <TabsList className="h-10 w-full justify-start bg-transparent border-0 rounded-none overflow-x-auto scrollbar-hide">
                  <TabsTrigger value="output" className="text-xs gap-2 px-4 data-[state=active]:bg-white/5 data-[state=active]:text-primary rounded-none border-b-2 border-transparent data-[state=active]:border-primary transition-all">
                    <Terminal className="h-3.5 w-3.5" /> Output
                  </TabsTrigger>
                  <TabsTrigger value="stats" className="text-xs gap-2 px-4 data-[state=active]:bg-white/5 data-[state=active]:text-primary rounded-none border-b-2 border-transparent data-[state=active]:border-primary transition-all">
                    <Cpu className="h-3.5 w-3.5" /> Stats
                  </TabsTrigger>
                  <TabsTrigger value="tips" className="text-xs gap-2 px-4 data-[state=active]:bg-white/5 data-[state=active]:text-primary rounded-none border-b-2 border-transparent data-[state=active]:border-primary transition-all">
                    <Lightbulb className="h-3.5 w-3.5" /> Tips
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="output" className="h-full m-0 p-0 border-0 data-[state=active]:flex flex-col bg-slate-950/30">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-slate-900/40">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Console</h3>
                    {output && (
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] text-slate-500 hover:text-slate-200 hover:bg-white/5" onClick={() => setOutput("")}>
                        <Trash2 className="h-3 w-3 mr-1" /> Clear
                      </Button>
                    )}
                  </div>
                  <ScrollArea className="flex-1 w-full p-4">
                    {error ? (
                      <div className="mb-4 p-3 rounded border border-red-500/20 bg-red-500/10 text-red-400">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-xs font-bold uppercase">Runtime Error</span>
                        </div>
                        <pre className="font-mono text-xs whitespace-pre-wrap">{error}</pre>
                      </div>
                    ) : null}
                    {output ? (
                      <pre className="font-mono text-sm whitespace-pre-wrap text-slate-300 animate-in fade-in duration-300">{output}</pre>
                    ) : (
                      <div className="h-40 flex flex-col items-center justify-center text-slate-600">
                        <Terminal className="h-10 w-10 mb-3 opacity-10" />
                        <p className="text-xs">No output to display</p>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="stats" className="h-full m-0 p-4 overflow-y-auto bg-slate-950/30">
                  <div className="grid gap-4 max-w-md mx-auto">
                    <div className="bg-slate-900/50 rounded-xl border border-white/5 p-4">
                      <h4 className="text-xs font-bold uppercase text-slate-500 mb-4 flex items-center gap-2">
                        <Cpu className="h-3 w-3" /> Performance
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Execution Status</span>
                          <Badge variant="outline" className={`${error ? "border-red-500/50 text-red-400" : "border-green-500/50 text-green-400"} bg-transparent`}>
                            {isExecuting ? "Processing..." : error ? "Execution Failed" : "Success"}
                          </Badge>
                        </div>
                        {executionTime !== null && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400">Execution Time</span>
                            <span className="font-mono text-sm text-primary">{executionTime}ms</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-900/50 rounded-xl border border-white/5 p-4">
                      <h4 className="text-xs font-bold uppercase text-slate-500 mb-4 flex items-center gap-2">
                        <Code2 className="h-3 w-3" /> Code Metrics
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Language</span>
                          <span className="text-sm font-medium">{LANGUAGES[selectedLanguage].name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Lines of Code</span>
                          <span className="font-mono text-sm text-slate-300">{code.split('\n').length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Total Characters</span>
                          <span className="font-mono text-sm text-slate-300">{code.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="tips" className="h-full m-0 p-4 overflow-y-auto bg-slate-950/30">
                  <div className="space-y-4 max-w-md mx-auto text-[10px] md:text-sm">
                    <div className="p-4 rounded-xl border border-white/5 bg-slate-900/50">
                      <h4 className="font-bold uppercase text-slate-500 mb-3 flex items-center gap-2">
                        <Maximize2 className="h-4 w-4" /> Shortcuts
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Run Code</span>
                          <kbd className="h-5 px-1.5 bg-slate-800 border border-slate-700 rounded text-[10px]">⌘ + Enter</kbd>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Save Project</span>
                          <kbd className="h-5 px-1.5 bg-slate-800 border border-slate-700 rounded text-[10px]">⌘ + S</kbd>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-white/5 bg-slate-900/50">
                      <h4 className="font-bold uppercase text-slate-500 mb-2">Editor Info</h4>
                      <p className="text-slate-400 leading-relaxed text-xs">
                        This is a sandboxed environment for testing small snippets of {LANGUAGES[selectedLanguage].name} code.
                        Files are treated as <code className="text-primary">main.{LANGUAGES[selectedLanguage].extension}</code>.
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
