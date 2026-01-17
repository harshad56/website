import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  FileCode,
  Copy,
  Languages,
  FolderPlus,
  FilePlus,
  ChevronRight,
  ChevronDown,
  Folder,
  File,
  X,
  MoreVertical,
  Plus
} from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import SEO from "@/components/SEO";

interface VFSFile {
  name: string;
  content: string;
  language: string;
  path: string;
}

interface VFSFolder {
  name: string;
  path: string;
  children: (VFSFile | VFSFolder)[];
  isOpen?: boolean;
}

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
  },
  csharp: {
    name: "C#",
    extension: "cs",
    starter: `// Welcome to C# Playground!
using System;

public class Program {
    public static void Main() {
        Console.WriteLine("Hello from C#!");
        
        int[] numbers = {1, 2, 3, 4, 5};
        int sum = 0;
        foreach (int n in numbers) sum += n;
        
        Console.WriteLine($"Sum: {sum}");
    }
}`,
    icon: "🎯"
  },
  php: {
    name: "PHP",
    extension: "php",
    starter: `<?php
echo "Hello from PHP!\\n";

$numbers = [1, 2, 3, 4, 5];
$sum = array_sum($numbers);

echo "Sum: " . $sum . "\\n";
?>`,
    icon: "🐘"
  },
  ruby: {
    name: "Ruby",
    extension: "rb",
    starter: `# Welcome to Ruby Playground!
puts "Hello from Ruby!"

numbers = [1, 2, 3, 4, 5]
sum = numbers.sum

puts "Sum: #{sum}"`,
    icon: "💎"
  },
  swift: {
    name: "Swift",
    extension: "swift",
    starter: `// Welcome to Swift Playground!
print("Hello from Swift!")

let numbers = [1, 2, 3, 4, 5]
let sum = numbers.reduce(0, +)

print("Sum: \\(sum)")`,
    icon: "🍎"
  },
  kotlin: {
    name: "Kotlin",
    extension: "kt",
    starter: `// Welcome to Kotlin Playground!
fun main() {
    println("Hello from Kotlin!")
    
    val numbers = listOf(1, 2, 3, 4, 5)
    val sum = numbers.sum()
    
    println("Sum: $sum")
}`,
    icon: "🏝️"
  },
  typescript: {
    name: "TypeScript",
    extension: "ts",
    starter: `// Welcome to TypeScript Playground!
interface User {
  id: number;
  name: string;
}

const user: User = { id: 1, name: "Antigravity" };
console.log(\`Hello from TypeScript, \${user.name}!\`);`,
    icon: "🟦"
  },
  html: {
    name: "HTML",
    extension: "html",
    starter: `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: sans-serif; text-align: center; background: #0f172a; color: white; padding: 2rem; }
        .box { background: #6366f1; padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
    </style>
</head>
<body>
    <div class="box">
        <h1>Hello from HTML!</h1>
        <p>This is a live preview.</p>
        <button onclick="greet()">Click Me</button>
    </div>
    <script>
        function greet() {
            alert("Hello from the component!");
        }
    </script>
</body>
</html>`,
    icon: "🌐"
  },
  css: {
    name: "CSS",
    extension: "css",
    starter: `/* Test your CSS here */
body {
  background: linear-gradient(135deg, #6366f1, #a855f7);
  height: 100vh;
  margin: 0;
  display: grid;
  place-items: center;
}`,
    icon: "🎨"
  }
};

const CodePlayground = () => {
  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedCode, setSavedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("output");
  const [previewCode, setPreviewCode] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const highlighterRef = useRef<HTMLDivElement>(null);

  // VFS State
  const [vfs, setVfs] = useState<(VFSFile | VFSFolder)[]>(() => {
    const saved = localStorage.getItem('playground_vfs');
    if (saved) return JSON.parse(saved);
    return [
      {
        name: "src",
        path: "/src",
        children: [
          { name: "App.js", path: "/src/App.js", content: LANGUAGES.javascript.starter, language: "javascript" }
        ],
        isOpen: true
      }
    ];
  });

  const [activeFile, setActiveFile] = useState<VFSFile>(() => {
    const findFirstFile = (items: (VFSFile | VFSFolder)[]): VFSFile | null => {
      for (const item of items) {
        if ('content' in item) return item;
        const found = findFirstFile((item as VFSFolder).children);
        if (found) return found;
      }
      return null;
    };
    return findFirstFile(vfs) || { name: "index.js", path: "/index.js", content: "", language: "javascript" };
  });

  const [explorerWidth, setExplorerWidth] = useState(250);
  const [isExplorerVisible, setIsExplorerVisible] = useState(!isMobile);

  const syncScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (highlighterRef.current) {
      highlighterRef.current.scrollTop = e.currentTarget.scrollTop;
      highlighterRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const setCode = (content: string) => {
    setActiveFile(prev => ({ ...prev, content }));
    // Update content in VFS
    const updateVFS = (items: (VFSFile | VFSFolder)[]): (VFSFile | VFSFolder)[] => {
      return items.map(item => {
        if (item.path === activeFile.path) {
          return { ...item, content };
        }
        if ('children' in item) {
          return { ...item, children: updateVFS(item.children) };
        }
        return item;
      });
    };
    setVfs(prev => {
      const next = updateVFS(prev);
      localStorage.setItem('playground_vfs', JSON.stringify(next));
      return next;
    });
  };

  const handleMessage = useCallback((e: MessageEvent) => {
    if (e.data.type === 'console') {
      const { args } = e.data;
      setOutput(prev => prev + (prev ? '\n' : '') + args.join(' '));
    }
  }, []);

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

  const code = activeFile.content;
  const selectedLanguage = activeFile.language as keyof typeof LANGUAGES;

  const setSelectedLanguage = (lang: keyof typeof LANGUAGES) => {
    setActiveFile(prev => ({ ...prev, language: lang, content: LANGUAGES[lang].starter }));
    const updateVFS = (items: (VFSFile | VFSFolder)[]): (VFSFile | VFSFolder)[] => {
      return items.map(item => {
        if (item.path === activeFile.path) {
          return { ...item, language: lang, content: LANGUAGES[lang].starter };
        }
        if ('children' in item) {
          return { ...item, children: updateVFS(item.children) };
        }
        return item;
      });
    };
    setVfs(prev => {
      const next = updateVFS(prev);
      localStorage.setItem('playground_vfs', JSON.stringify(next));
      return next;
    });
  };

  const handleCreateFolder = () => {
    const name = prompt("Enter folder name:");
    if (!name) return;
    const newFolder: VFSFolder = {
      name,
      path: `/src/${name}`,
      children: [],
      isOpen: true
    };

    const addToSrc = (items: (VFSFile | VFSFolder)[]): (VFSFile | VFSFolder)[] => {
      let srcFound = false;
      const next = items.map(item => {
        if (item.name === "src" && 'children' in item) {
          srcFound = true;
          return { ...item, children: [...item.children, newFolder], isOpen: true };
        }
        if (item.path === activeFile.path.split('/').slice(0, -1).join('/')) {
          // Special case: create in current folder
          return { ...item, children: [...(item as VFSFolder).children, newFolder], isOpen: true };
        }
        return item;
      });
      if (!srcFound && items.length > 0 && !('children' in items[0])) {
        return [...items, newFolder];
      }
      return next;
    };

    setVfs(prev => {
      const next = addToSrc(prev);
      localStorage.setItem('playground_vfs', JSON.stringify(next));
      return next;
    });
  };

  const handleNewProject = (type: 'react' | 'html' | 'standard') => {
    let newVfs: (VFSFile | VFSFolder)[] = [];
    if (type === 'react') {
      newVfs = [
        {
          name: "src", path: "/src", isOpen: true, children: [
            { name: "App.js", path: "/src/App.js", language: "javascript" as const, content: `import React from 'https://esm.sh/react';\n\nexport default function App() {\n  return <h1>Hello from React!</h1>;\n}` },
            { name: "index.js", path: "/src/index.js", language: "javascript" as const, content: `import React from 'https://esm.sh/react';\nimport ReactDOM from 'https://esm.sh/react-dom';\nimport App from './App.js';\n\nReactDOM.render(<App />, document.getElementById('root'));` }
          ]
        },
        { name: "index.html", path: "/index.html", language: "html" as const, content: `<!DOCTYPE html>\n<html>\n<body>\n  <div id="root"></div>\n  <script type="module" src="./src/index.js"></script>\n</body>\n</html>` }
      ];
    } else if (type === 'html') {
      newVfs = [
        { name: "index.html", path: "/index.html", language: "html" as const, content: LANGUAGES.html.starter },
        { name: "style.css", path: "/style.css", language: "css" as const, content: LANGUAGES.css.starter },
        { name: "script.js", path: "/script.js", language: "javascript" as const, content: LANGUAGES.javascript.starter }
      ];
    } else {
      newVfs = [
        { name: "main.js", path: "/main.js", language: "javascript" as const, content: LANGUAGES.javascript.starter }
      ];
    }
    setVfs(newVfs);
    localStorage.setItem('playground_vfs', JSON.stringify(newVfs));

    const findFirstFile = (items: (VFSFile | VFSFolder)[]): VFSFile | null => {
      for (const item of items) {
        if ('content' in item) return item as VFSFile;
        const found = findFirstFile((item as VFSFolder).children);
        if (found) return found;
      }
      return null;
    };
    const first = findFirstFile(newVfs);
    if (first) setActiveFile(first);
    toast({ title: "Project Created", description: `New ${type} project started.` });
  };

  const loadJSZip = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if ((window as any).JSZip) return resolve((window as any).JSZip);
      const script = document.createElement('script');
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
      script.onload = () => resolve((window as any).JSZip);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const handleDownloadZip = async () => {
    try {
      const JSZip = await loadJSZip();
      const zip = new JSZip();

      const addToZip = (items: (VFSFile | VFSFolder)[], path = "") => {
        for (const item of items) {
          if ('content' in item) {
            zip.file(path + item.name, item.content);
          } else {
            addToZip(item.children, path + item.name + "/");
          }
        }
      };

      addToZip(vfs);
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "project.zip";
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Project Exported", description: "Your project has been downloaded as project.zip" });
    } catch (err) {
      toast({ title: "Export Failed", description: "Could not generate ZIP file.", variant: "destructive" });
    }
  };

  const handleImportZip = async (file: File) => {
    try {
      const JSZip = await loadJSZip();
      const zip = await JSZip.loadAsync(file);
      const newVfs: (VFSFile | VFSFolder)[] = [];
      const folders: Record<string, VFSFolder> = {};

      for (const [path, zipEntry] of Object.entries(zip.files) as [string, any][]) {
        if (zipEntry.dir) {
          const parts = path.split('/').filter(Boolean);
          let currentPath = "";
          for (const part of parts) {
            const parentPath = currentPath;
            currentPath += (currentPath ? "/" : "") + part;
            if (!folders[currentPath]) {
              const folder: VFSFolder = { name: part, path: "/" + currentPath, children: [], isOpen: true };
              folders[currentPath] = folder;
              if (parentPath) folders[parentPath].children.push(folder);
              else newVfs.push(folder);
            }
          }
        } else {
          const content = await zipEntry.async("string");
          const extension = path.split('.').pop();
          let language = "javascript";
          for (const [key, lang] of Object.entries(LANGUAGES)) {
            if (lang.extension === extension) { language = key; break; }
          }
          const name = path.split('/').pop() || "file";
          const fileObj: VFSFile = { name, path: "/" + path, content, language };

          const dirPath = path.split('/').slice(0, -1).join('/');
          if (dirPath && folders[dirPath]) {
            folders[dirPath].children.push(fileObj);
          } else {
            newVfs.push(fileObj);
          }
        }
      }

      setVfs(newVfs);
      localStorage.setItem('playground_vfs', JSON.stringify(newVfs));
      const first = (function findFirst(items: (VFSFile | VFSFolder)[]): VFSFile | null {
        for (const i of items) {
          if ('content' in i) return i;
          const f = findFirst(i.children);
          if (f) return f;
        }
        return null;
      })(newVfs);
      if (first) setActiveFile(first);
      toast({ title: "Project Imported", description: "Project state restored from ZIP." });
    } catch (err) {
      toast({ title: "Import Failed", description: "Could not read ZIP file.", variant: "destructive" });
    }
  };

  const handleCreateFile = () => {
    const name = prompt("Enter file name (e.g., main.js):");
    if (!name) return;
    const extension = name.split('.').pop();
    let language = "javascript";
    for (const [key, lang] of Object.entries(LANGUAGES)) {
      if (lang.extension === extension) {
        language = key;
        break;
      }
    }
    const newFile: VFSFile = {
      name,
      path: `/src/${name}`,
      content: "",
      language
    };

    const addToSrc = (items: (VFSFile | VFSFolder)[]): (VFSFile | VFSFolder)[] => {
      let srcFound = false;
      const next = items.map(item => {
        if (item.name === "src" && 'children' in item) {
          srcFound = true;
          return { ...item, children: [...item.children, newFile], isOpen: true };
        }
        return item;
      });
      if (!srcFound) {
        // Fallback: Add to root if src doesn't exist
        return [...items, newFile];
      }
      return next;
    };

    setVfs(prev => {
      const next = addToSrc(prev);
      localStorage.setItem('playground_vfs', JSON.stringify(next));
      return next;
    });
    setActiveFile(newFile);
  };

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
      if (selectedLanguage === 'html' || selectedLanguage === 'css' || selectedLanguage === 'javascript') {
        const getAllFiles = (items: (VFSFile | VFSFolder)[]): VFSFile[] => {
          let files: VFSFile[] = [];
          for (const item of items) {
            if ('content' in item) files.push(item);
            else files = [...files, ...getAllFiles(item.children)];
          }
          return files;
        };
        const allFiles = getAllFiles(vfs);
        const htmlFile = allFiles.find(f => f.name.endsWith('.html')) || activeFile;
        const cssFiles = allFiles.filter(f => f.name.endsWith('.css'));
        const jsFiles = allFiles.filter(f => f.name.endsWith('.js') && f.path !== htmlFile.path);

        const consoleBridge = `
          <script>
            (function() {
              const originalLog = console.log;
              const originalError = console.error;
              const originalWarn = console.warn;
              
              const sendToParent = (method, args) => {
                window.parent.postMessage({ type: 'console', method, args: args.map(a => {
                    try { return typeof a === 'object' ? JSON.stringify(a) : String(a); }
                    catch(e) { return String(a); }
                })}, '*');
              };

              console.log = (...args) => { sendToParent('log', args); originalLog.apply(console, args); };
              console.error = (...args) => { sendToParent('error', args); originalError.apply(console, args); };
              console.warn = (...args) => { sendToParent('warn', args); originalWarn.apply(console, args); };
              
              window.onerror = (msg, url, line, col, error) => {
                sendToParent('error', [msg + ' (line ' + line + ')']);
              };
            })();
          </script>
        `;

        let combinedContent = "";
        let shouldContinueToWorker = false;
        if (selectedLanguage === 'html' || htmlFile.name.endsWith('.html')) {
          combinedContent = htmlFile.content.replace('<head>', `<head>${consoleBridge}${cssFiles.map(f => `<style>${f.content}</style>`).join('')}`);
          combinedContent = combinedContent.replace('</body>', `${jsFiles.map(f => `<script>${f.content}</script>`).join('')}</body>`);
          if (!combinedContent.includes('<head>')) combinedContent = consoleBridge + combinedContent;
        } else if (selectedLanguage === 'css') {
          combinedContent = `<html><head>${consoleBridge}<style>${code}</style></head><body><div class="p-8 text-white">CSS Preview Mode</div></body></html>`;
        } else {
          shouldContinueToWorker = true;
        }

        if (!shouldContinueToWorker) {
          setPreviewCode(combinedContent);
          setActiveTab("preview");
          setOutput("Rendering preview...");
          setIsExecuting(false);
          return;
        }
      }

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
  }, [code, vfs, activeFile, selectedLanguage, toast, isMobile]);



  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && textareaRef.current === document.activeElement) {
        e.preventDefault();
        const start = textareaRef.current?.selectionStart || 0;
        const end = textareaRef.current?.selectionEnd || 0;
        const newCode = code.substring(0, start) + "    " + code.substring(end);
        setCode(newCode);
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
          }
        }, 0);
        return;
      }
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

  const FileItem = ({ file, level }: { file: VFSFile; level: number }) => (
    <div
      className={`flex items-center gap-2 px-3 py-1 cursor-pointer hover:bg-white/5 group ${activeFile.path === file.path ? 'bg-primary/20 text-primary border-l-2 border-primary' : 'text-slate-400'}`}
      style={{ paddingLeft: `${level * 12 + 12}px` }}
      onClick={() => setActiveFile(file)}
    >
      <File className="w-4 h-4" />
      <span className="text-xs truncate flex-1">{file.name}</span>
      <button
        className="opacity-0 group-hover:opacity-100 h-4 w-4 text-slate-500 hover:text-red-400 p-0.5 rounded hover:bg-white/10"
        onClick={(e) => {
          e.stopPropagation();
          if (confirm(`Delete ${file.name}?`)) {
            const deleteFromVFS = (items: (VFSFile | VFSFolder)[]): (VFSFile | VFSFolder)[] => {
              return items.filter(item => item.path !== file.path).map(item => {
                if ('children' in item) {
                  return { ...item, children: deleteFromVFS(item.children) };
                }
                return item;
              });
            };
            setVfs(prev => {
              const next = deleteFromVFS(prev);
              localStorage.setItem('playground_vfs', JSON.stringify(next));
              return next;
            });
          }
        }}
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  );

  const FolderItem = ({ folder, level }: { folder: VFSFolder; level: number }) => {
    const toggleFolder = () => {
      const updateVFS = (items: (VFSFile | VFSFolder)[]): (VFSFile | VFSFolder)[] => {
        return items.map(item => {
          if (item.path === folder.path) {
            return { ...item, isOpen: !(item as VFSFolder).isOpen };
          }
          if ('children' in item) {
            return { ...item, children: updateVFS(item.children) };
          }
          return item;
        });
      };
      setVfs(updateVFS);
    };

    return (
      <div>
        <div
          className="flex items-center gap-2 px-3 py-1 cursor-pointer hover:bg-white/5 text-slate-300"
          style={{ paddingLeft: `${level * 12 + 12}px` }}
          onClick={toggleFolder}
        >
          {folder.isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <Folder className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-medium truncate">{folder.name}</span>
        </div>
        {folder.isOpen && (
          <div>
            {folder.children.map((child, i) => (
              'children' in child ?
                <FolderItem key={i} folder={child as VFSFolder} level={level + 1} /> :
                <FileItem key={i} file={child as VFSFile} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden selection:bg-primary/30">
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
          <BackButton label={isMobile ? "" : "Home"} className="h-8 md:h-9 px-2 md:px-3 bg-slate-800 border-slate-700 hover:bg-slate-700" />
          <div className="hidden md:flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            <h1 className="font-semibold text-lg">Playground</h1>
          </div>
          <div className="hidden md:block h-6 w-px bg-border" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="sm" className="gap-2 h-8 md:h-9 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                <Plus className="h-4 w-4" />
                <span>New Project</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-900 border-slate-800 text-slate-200">
              <DropdownMenuItem onClick={() => handleNewProject('react')} className="focus:bg-primary/20 focus:text-primary">
                React Project
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNewProject('html')} className="focus:bg-primary/20 focus:text-primary">
                HTML/CSS/JS Project
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNewProject('standard')} className="focus:bg-primary/20 focus:text-primary">
                Blank Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={handleDownloadZip} title="Download Project (ZIP)">
            <Download className="h-4 w-4" />
          </Button>
          <div className="relative">
            <input
              type="file"
              accept=".zip"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImportZip(file);
              }}
              title="Open Local Project (.zip)"
            />
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <FileCode className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full rounded-none border-0"
        >
          {/* File Explorer Sidebar */}
          {isExplorerVisible && (
            <>
              <ResizablePanel
                defaultSize={20}
                minSize={15}
                maxSize={40}
                className="bg-[#252526] border-r border-[#1e1e1e] flex flex-col"
              >
                <div className="p-3 border-b border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Explorer</span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="w-7 h-7 hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="New File" onClick={handleCreateFile}>
                      <FilePlus className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-7 h-7 hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="New Folder" onClick={handleCreateFolder}>
                      <FolderPlus className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-7 h-7 md:hidden text-slate-400 hover:text-white" onClick={() => setIsExplorerVisible(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <ScrollArea className="flex-1">
                  <div className="py-2">
                    {vfs.map((item, i) => (
                      'children' in item ?
                        <FolderItem key={i} folder={item as VFSFolder} level={0} /> :
                        <FileItem key={i} file={item as VFSFile} level={0} />
                    ))}
                  </div>
                </ScrollArea>
              </ResizablePanel>
              <ResizableHandle withHandle className="bg-[#1e1e1e] border-[#1e1e1e] w-0.5 hover:bg-primary/50 transition-colors" />
            </>
          )}

          <ResizablePanel defaultSize={80} minSize={30}>
            <ResizablePanelGroup
              direction={isMobile ? "vertical" : "horizontal"}
              className="h-full rounded-none border-0"
            >

              {/* Editor Panel */}
              <ResizablePanel defaultSize={isMobile ? 50 : 60} minSize={30}>
                <div className="h-full flex flex-col bg-[#1e1e1e]">
                  <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-white/5">
                    <span className="text-[10px] md:text-xs text-slate-400 font-mono flex items-center gap-2">
                      <FileCode className="h-3 w-3" />
                      main.{LANGUAGES[selectedLanguage].extension}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-[10px] text-slate-400 hover:text-white hover:bg-white/5 gap-1"
                        onClick={() => {
                          navigator.clipboard.writeText(code);
                          toast({ title: "Copied!", description: "Code copied to clipboard." });
                        }}
                      >
                        <Copy className="h-3 w-3" />
                        Copy
                      </Button>
                      <span className="text-[10px] md:text-xs text-slate-500 font-mono">
                        {code.split('\n').length} L | {code.length} C
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 relative overflow-hidden font-mono text-sm md:text-base">
                    {/* Syntax Highlighting Layer */}
                    <div
                      ref={highlighterRef}
                      className="absolute inset-0 pointer-events-none select-none scrollbar-hide overflow-auto"
                    >
                      <SyntaxHighlighter
                        language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage === 'csharp' ? 'csharp' : selectedLanguage}
                        style={vscDarkPlus}
                        showLineNumbers={true}
                        lineNumberStyle={{ minWidth: '3.5em', paddingRight: '1em', color: '#858585', textAlign: 'right', userSelect: 'none' }}
                        customStyle={{
                          margin: 0,
                          padding: '1rem',
                          paddingLeft: '0',
                          background: 'transparent',
                          fontSize: 'inherit',
                          fontFamily: 'inherit',
                          lineHeight: '1.5',
                          overflow: 'visible',
                          minHeight: '100%',
                        }}
                      >
                        {code + (code.endsWith('\n') ? ' ' : '')}
                      </SyntaxHighlighter>
                    </div>

                    {/* Invisible Editable Layer */}
                    <textarea
                      ref={textareaRef}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      onScroll={syncScroll}
                      onKeyDown={(e) => {
                        if (e.key === 'Tab') {
                          e.preventDefault();
                          const start = e.currentTarget.selectionStart;
                          const end = e.currentTarget.selectionEnd;
                          const newCode = code.substring(0, start) + "    " + code.substring(end);
                          setCode(newCode);
                          setTimeout(() => {
                            e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 4;
                          }, 0);
                        }
                      }}
                      className="absolute inset-0 w-full h-full p-4 pl-[4.5rem] bg-transparent text-transparent caret-white outline-none resize-none font-mono text-sm md:text-base scrollbar-thin scrollbar-thumb-white/10"
                      style={{ lineHeight: '1.5', whiteSpace: 'pre', overflowX: 'auto' }}
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
                      {(selectedLanguage === 'html' || selectedLanguage === 'css' || previewCode) && (
                        <TabsTrigger value="preview" className="text-xs gap-2 px-4 data-[state=active]:bg-white/5 data-[state=active]:text-primary rounded-none border-b-2 border-transparent data-[state=active]:border-primary transition-all">
                          <Code2 className="h-3.5 w-3.5" /> Preview
                        </TabsTrigger>
                      )}
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

                    <TabsContent value="preview" className="h-full m-0 p-0 overflow-hidden bg-white">
                      {previewCode ? (
                        <iframe
                          srcDoc={previewCode}
                          title="Preview"
                          className="w-full h-full border-0 bg-white"
                          sandbox="allow-scripts allow-modals"
                        />
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 bg-slate-950/30">
                          <Code2 className="h-10 w-10 mb-3 opacity-10" />
                          <p className="text-xs">Click Run to see preview</p>
                        </div>
                      )}
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
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default CodePlayground;
