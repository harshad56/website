import React, { useState, useEffect, useRef, useCallback } from "react";
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
  const [babelStatus, setBabelStatus] = useState<string>("Initializing...");
  const [savedCode, setSavedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("output");
  const [previewCode, setPreviewCode] = useState("");
  const [editorViewMode, setEditorViewMode] = useState<'practice' | 'project'>(() => {
    return (localStorage.getItem('playground_view_mode') as 'practice' | 'project') || 'project';
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const highlighterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadBabel = async () => {
      if ((window as any).Babel) {
        setBabelStatus("Ready");
        return;
      }
      setBabelStatus("Loading Babel...");
      const script = document.createElement('script');
      script.src = "https://unpkg.com/@babel/standalone/babel.min.js";
      script.onload = () => setBabelStatus("Ready");
      script.onerror = () => setBabelStatus("Babel failed to load");
      document.head.appendChild(script);
    };
    loadBabel();
  }, []);

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

  const [activeFilePath, setActiveFilePath] = useState<string>(() => {
    const findFirstFile = (items: (VFSFile | VFSFolder)[]): string | null => {
      for (const item of items) {
        if ('content' in item) return item.path;
        const found = findFirstFile((item as VFSFolder).children);
        if (found) return found;
      }
      return null;
    };
    return findFirstFile(vfs) || "/index.js";
  });

  const getActiveFile = useCallback((items: (VFSFile | VFSFolder)[]): VFSFile => {
    const findByPath = (nodes: (VFSFile | VFSFolder)[]): VFSFile | null => {
      for (const node of nodes) {
        if (node.path === activeFilePath && 'content' in node) return node as VFSFile;
        if ('children' in node) {
          const found = findByPath(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findByPath(items) || { name: "index.js", path: "/index.js", content: LANGUAGES.javascript.starter, language: "javascript" };
  }, [activeFilePath]);

  const activeFile = getActiveFile(vfs);

  const [explorerWidth, setExplorerWidth] = useState(250);
  const [isExplorerVisible, setIsExplorerVisible] = useState(!isMobile);

  const syncScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (highlighterRef.current) {
      highlighterRef.current.scrollTop = e.currentTarget.scrollTop;
      highlighterRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const setCode = (content: string) => {
    setVfs(prev => {
      const updateNode = (items: (VFSFile | VFSFolder)[]): (VFSFile | VFSFolder)[] => {
        return items.map(item => {
          if (item.path === activeFilePath) {
            return { ...item, content };
          }
          if ('children' in item) {
            return { ...item, children: updateNode(item.children) };
          }
          return item;
        });
      };
      const next = updateNode(prev);
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

  const handleModeSwitch = (mode: 'practice' | 'project') => {
    setEditorViewMode(mode);
    localStorage.setItem('playground_view_mode', mode);
    if (mode === 'practice') {
      const lang = (selectedLanguage in LANGUAGES) ? selectedLanguage : 'javascript';
      const practiceFile: VFSFile = {
        name: `practice.${LANGUAGES[lang].extension}`,
        path: `/practice.${LANGUAGES[lang].extension}`,
        content: LANGUAGES[lang].starter,
        language: lang
      };
      setVfs([practiceFile]);
      setActiveFilePath(practiceFile.path);
      setIsExplorerVisible(false);
      localStorage.setItem('playground_vfs', JSON.stringify([practiceFile]));
    } else {
      setIsExplorerVisible(!isMobile);
    }
  };

  const setSelectedLanguage = (lang: keyof typeof LANGUAGES) => {
    if (editorViewMode === 'practice') {
      const practiceFile: VFSFile = {
        name: `practice.${LANGUAGES[lang].extension}`,
        path: `/practice.${LANGUAGES[lang].extension}`,
        content: LANGUAGES[lang].starter,
        language: lang
      };
      setVfs([practiceFile]);
      setActiveFilePath(practiceFile.path);
      localStorage.setItem('playground_vfs', JSON.stringify([practiceFile]));
      return;
    }

    setVfs(prev => {
      const updateNode = (items: (VFSFile | VFSFolder)[]): (VFSFile | VFSFolder)[] => {
        return items.map(item => {
          if (item.path === activeFilePath && !('children' in item)) {
            // Update both language and starter code if it became empty
            return { ...item, language: lang, content: (item as VFSFile).content || LANGUAGES[lang].starter };
          }
          if ('children' in item) {
            return { ...item, children: updateNode(item.children) };
          }
          return item;
        });
      };
      const next = updateNode(prev);
      localStorage.setItem('playground_vfs', JSON.stringify(next));
      return next;
    });
  };

  const handleCreateFolder = () => {
    const name = prompt("Enter folder name:");
    if (!name) return;

    const parentPath = activeFile.path.split('/').slice(0, -1).join('/') || "";
    const newPath = `${parentPath}/${name}`.replace(/\/+/g, '/');

    const newFolder: VFSFolder = {
      name,
      path: newPath,
      children: [],
      isOpen: true
    };

    const addItemToVFS = (items: (VFSFile | VFSFolder)[]): (VFSFile | VFSFolder)[] => {
      if (parentPath === "" || parentPath === "/") {
        return [...items, newFolder];
      }
      return items.map(item => {
        if (item.path === parentPath && 'children' in item) {
          return { ...item, children: [...item.children, newFolder], isOpen: true };
        }
        if ('children' in item) {
          return { ...item, children: addItemToVFS(item.children) };
        }
        return item;
      });
    };

    setVfs(prev => {
      const next = addItemToVFS(prev);
      localStorage.setItem('playground_vfs', JSON.stringify(next));
      return next;
    });
  };

  const handleNewProject = (type: 'react' | 'html' | 'standard') => {
    setEditorViewMode('project');
    localStorage.setItem('playground_view_mode', 'project');
    setIsExplorerVisible(!isMobile);
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
    if (first) setActiveFilePath(first.path);
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
      if (first) setActiveFilePath(first.path);
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
    const parentPath = activeFile.path.split('/').slice(0, -1).join('/') || "";
    const newPath = `${parentPath}/${name}`.replace(/\/+/g, '/');

    const newFile: VFSFile = {
      name,
      path: newPath,
      content: "",
      language
    };

    const addItemToVFS = (items: (VFSFile | VFSFolder)[]): (VFSFile | VFSFolder)[] => {
      if (parentPath === "" || parentPath === "/") {
        return [...items, newFile];
      }
      return items.map(item => {
        if (item.path === parentPath && 'children' in item) {
          return { ...item, children: [...item.children, newFile], isOpen: true };
        }
        if ('children' in item) {
          return { ...item, children: addItemToVFS(item.children) };
        }
        return item;
      });
    };

    setVfs(prev => {
      const next = addItemToVFS(prev);
      localStorage.setItem('playground_vfs', JSON.stringify(next));
      return next;
    });
    setActiveFilePath(newFile.path);
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
    // Ensure Babel is loaded for transpilation
    if (!(window as any).Babel && (selectedLanguage === 'javascript' || (selectedLanguage as string) === 'typescript' || activeFile.name.endsWith('.jsx') || activeFile.name.endsWith('.tsx'))) {
      let retryCount = 0;
      while (retryCount < 50 && !(window as any).Babel) {
        await new Promise(r => setTimeout(r, 100));
        retryCount++;
      }
      if (!(window as any).Babel) {
        toast({ title: "Compiler not ready", description: "Babel is still loading. Please wait a moment.", variant: "destructive" });
        setIsExecuting(false);
        return;
      }
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
      const langKey = selectedLanguage as string;
      if (langKey === 'html' || langKey === 'css' || langKey === 'javascript' || langKey === 'typescript') {
        const getAllFiles = (items: (VFSFile | VFSFolder)[]): VFSFile[] => {
          let files: VFSFile[] = [];
          for (const item of items) {
            if ('content' in item) files.push(item);
            else files = [...files, ...getAllFiles(item.children)];
          }
          return files;
        };
        const allFiles = getAllFiles(vfs);
        const htmlFile = allFiles.find(f => f.name === 'index.html') || allFiles.find(f => f.name.endsWith('.html')) || activeFile;
        const cssFiles = allFiles.filter(f => f.name.endsWith('.css'));

        // Load Babel on demand if needed
        if (!((window as any).Babel)) {
          setOutput("Loading transpiler (Babel)...");
          const script = document.createElement('script');
          script.src = "https://unpkg.com/@babel/standalone/babel.min.js";
          document.head.appendChild(script);
          for (let i = 0; i < 20; i++) {
            if ((window as any).Babel) break;
            await new Promise(r => setTimeout(r, 200));
          }
        }

        const transpile = (code: string, fileName: string) => {
          if (!((window as any).Babel)) return code;
          try {
            const ext = fileName.split('.').pop()?.toLowerCase();
            const isJSX = ext === 'jsx' || ext === 'tsx' || code.includes('React.') || code.includes('</');
            const isTS = ext === 'ts' || ext === 'tsx';
            if (!isJSX && !isTS) return code;

            return (window as any).Babel.transform(code, {
              presets: ['react', ['typescript', { isTSX: true }], ['env', { modules: false }]],
              filename: fileName
            }).code;
          } catch (err) {
            console.error("Transpilation error for", fileName, err);
            return code;
          }
        };

        // Generate Import Map for ES Modules with Transpiled Blobs
        const imports: Record<string, string> = {};
        allFiles.forEach(f => {
          if (f.name.endsWith('.js') || f.name.endsWith('.jsx') || f.name.endsWith('.ts') || f.name.endsWith('.tsx')) {
            const transpiledContent = transpile(f.content, f.name);
            const blob = new Blob([transpiledContent], { type: 'text/javascript' });
            const url = URL.createObjectURL(blob);

            // Map every possible way this file could be referenced
            const absPath = f.path.startsWith('/') ? f.path : '/' + f.path;
            const relPathStr = absPath.substring(1);
            const name = f.name;
            const nameNoExt = name.replace(/\.[^/.]+$/, "");
            const pathNoExt = absPath.replace(/\.[^/.]+$/, "");

            imports[absPath] = url;
            imports[relPathStr] = url;
            imports[`./${relPathStr}`] = url;
            imports[pathNoExt] = url;
            imports[`./${relPathStr.replace(/\.[^/.]+$/, "")}`] = url;

            // Specifically handling the most common relative patterns
            if (absPath === "/src/index.js") imports["./src/index.js"] = url;
            if (absPath === "/src/App.js") imports["./App.js"] = url;

            if (!relPathStr.includes('/')) {
              imports[name] = url;
              imports[`./${name}`] = url;
              imports[nameNoExt] = url;
              imports[`./${nameNoExt}`] = url;
            }
          }
        });

        const importMap = `<script type="importmap">${JSON.stringify({ imports })}</script>`;
        const baseTag = `<base href="${window.location.origin}/">`;

        const consoleBridge = `
          <script>
            (function() {
              const sendToParent = (method, args) => {
                window.parent.postMessage({ 
                  type: 'console', 
                  method, 
                  args: args.map(a => {
                    try {
                      if (a instanceof Error) return a.message;
                      return typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a);
                    } catch(e) { return String(a); }
                  })
                }, '*');
              };

              console.log = (...args) => sendToParent('log', args);
              console.error = (...args) => sendToParent('error', args);
              console.warn = (...args) => sendToParent('warn', args);
              
              window.onerror = (msg, url, line, col, error) => {
                sendToParent('error', [\`\${msg} (\${line}:\${col})\`]);
              };
              window.onunhandledrejection = (event) => {
                sendToParent('error', [\`Unhandled Rejection: \${event.reason}\`]);
              };
            })();
          </script>
        `;

        let combinedContent = "";
        if (htmlFile.name.endsWith('.html')) {
          combinedContent = htmlFile.content;
          const injection = `\n${baseTag}\n${importMap}\n${consoleBridge}\n${cssFiles.map(f => `<style>${f.content}</style>`).join('')}`;

          if (combinedContent.includes('<head>')) {
            combinedContent = combinedContent.replace('<head>', `<head>${injection}`);
          } else {
            combinedContent = injection + combinedContent;
          }

          // Force active file to run as module if JS/TS and not in HTML
          if ((selectedLanguage === 'javascript' || (selectedLanguage as string) === 'typescript') && !combinedContent.includes(activeFile.name)) {
            const transpiledCode = transpile(activeFile.content, activeFile.name);
            combinedContent = combinedContent.replace('</body>', `<script type="module">${transpiledCode}</script>\n</body>`);
          }
        } else if (selectedLanguage === 'css') {
          combinedContent = `<html><head>${baseTag}${consoleBridge}<style>${activeFile.content}</style></head><body><div style="padding: 2rem; color: white; font-family: sans-serif;">CSS Preview Mode</div></body></html>`;
        } else if (selectedLanguage === 'javascript' || (selectedLanguage as string) === 'typescript') {
          const transpiledCode = transpile(activeFile.content, activeFile.name);
          combinedContent = `<!DOCTYPE html><html><head>${baseTag}${importMap}${consoleBridge}</head><body><div id="root"></div><script type="module">${transpiledCode}</script></body></html>`;
        }

        if (combinedContent) {
          setPreviewCode(combinedContent);
          setActiveTab("preview");
          setOutput("Building and rendering preview...");
          setIsExecuting(false);
          return;
        }
      }

      // Ensure proper tab focus in Practice mode or for console-based languages
      if (editorViewMode === 'practice' || !(langKey === 'html' || langKey === 'css' || langKey === 'javascript' || langKey === 'typescript')) {
        setActiveTab("output");
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

  const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js': return <FileCode className="w-4 h-4 text-yellow-400" />;
      case 'jsx': return <FileCode className="w-4 h-4 text-blue-400" />;
      case 'ts': return <FileCode className="w-4 h-4 text-blue-500" />;
      case 'tsx': return <FileCode className="w-4 h-4 text-blue-600" />;
      case 'html': return <File className="w-4 h-4 text-orange-500" />;
      case 'css': return <File className="w-4 h-4 text-blue-300" />;
      case 'json': return <FileCode className="w-4 h-4 text-yellow-600" />;
      case 'py': return <FileCode className="w-4 h-4 text-green-500" />;
      default: return <File className="w-4 h-4 text-slate-400" />;
    }
  };

  const FileItem = ({ file, level }: { file: VFSFile; level: number }) => (
    <div
      className={`flex items-center gap-2 px-3 py-1 cursor-pointer hover:bg-white/5 group ${activeFilePath === file.path ? 'bg-primary/20 text-primary border-l-2 border-primary' : 'text-slate-400'}`}
      style={{ paddingLeft: `${level * 12 + 12}px` }}
      onClick={() => setActiveFilePath(file.path)}
    >
      {getFileIcon(file.name)}
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
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 selection:bg-primary/30 overflow-hidden font-sans">
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
      <div className="h-14 border-b border-white/5 bg-slate-900/50 backdrop-blur px-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <BackButton label={isMobile ? "" : "Home"} className="h-9 px-3 bg-slate-800 border-slate-700 hover:bg-slate-700" />
          <div className="hidden md:flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg tracking-tight">SyntaxStage</span>
          </div>

          <div className="h-6 w-px bg-white/10 hidden md:block" />

          <div className="flex bg-slate-800/80 p-1 rounded-lg border border-white/5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleModeSwitch('practice')}
              className={`h-7 px-3 text-[10px] items-center gap-1 font-bold uppercase tracking-wider transition-all ${editorViewMode === 'practice' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Lightbulb className="h-3 w-3" /> Practice
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleModeSwitch('project')}
              className={`h-7 px-3 text-[10px] items-center gap-1 font-bold uppercase tracking-wider transition-all ${editorViewMode === 'project' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Cpu className="h-3 w-3" /> Professional
            </Button>
          </div>

          <div className="h-6 w-px bg-white/10 hidden lg:block" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="sm" className="gap-2 h-9 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Project</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-900 border-slate-800 text-slate-200 w-48">
              <DropdownMenuItem onClick={() => handleNewProject('react')} className="gap-2 focus:bg-primary/20 focus:text-primary">
                <Code2 className="h-4 w-4" /> React Project
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNewProject('html')} className="gap-2 focus:bg-primary/20 focus:text-primary">
                <Languages className="h-4 w-4" /> HTML/CSS/JS Project
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNewProject('standard')} className="gap-2 focus:bg-primary/20 focus:text-primary">
                <FileCode className="h-4 w-4" /> Blank Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {editorViewMode === 'practice' && (
            <Select value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as keyof typeof LANGUAGES)}>
              <SelectTrigger className="w-[120px] md:w-[160px] h-9 bg-slate-800/50 border-white/5 hover:border-white/20 transition-all text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-base">{LANGUAGES[selectedLanguage].icon}</span>
                  <span className="truncate">{LANGUAGES[selectedLanguage].name}</span>
                </div>
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800">
                {Object.entries(LANGUAGES).map(([key, lang]) => (
                  <SelectItem key={key} value={key} className="focus:bg-primary/20 focus:text-primary">
                    <span className="flex items-center gap-2">
                      <span className="text-base">{lang.icon}</span>
                      <span className="truncate font-medium">{lang.name}</span>
                    </span >
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isExplorerVisible && (
            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-white" onClick={() => setIsExplorerVisible(true)}>
              <Maximize2 className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="default"
            onClick={handleRunCode}
            disabled={isExecuting}
            size="sm"
            className="gap-2 font-bold shadow-lg shadow-primary/20 h-9 px-4 bg-primary hover:bg-primary/90"
          >
            {isExecuting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Running...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                <span>Run</span>
              </>
            )}
          </Button>

          <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block" />

          <div className="hidden sm:flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-white" onClick={handleSaveCode} title="Save">
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-white" onClick={handleShareCode} title="Share">
              {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-white" onClick={handleDownloadZip} title="Download ZIP">
              <Download className="h-4 w-4" />
            </Button>
          </div>
          {babelStatus !== "Ready" && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-800/80 rounded-full border border-white/5 animate-pulse">
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
              <span className="text-[10px] text-slate-400 font-medium">{babelStatus}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Workbench */}
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Sidebar / Explorer */}
          {isExplorerVisible && editorViewMode === 'project' && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={40} className="border-r border-white/5 bg-slate-900/30 flex flex-col">
                <div className="h-10 px-4 border-b border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Explorer</span>
                  <div className="flex items-center gap-0.5">
                    <Button variant="ghost" size="icon" className="w-6 h-6 hover:bg-white/5 text-slate-500 hover:text-white" onClick={handleCreateFile}>
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-6 h-6 hover:bg-white/5 text-slate-500 hover:text-white" onClick={() => setIsExplorerVisible(false)}>
                      <X className="w-3.5 h-3.5" />
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
              <ResizableHandle withHandle className="bg-white/5 w-px hover:bg-primary/50 transition-colors" />
            </>
          )}

          {/* Main Editor + Tools area */}
          <ResizablePanel defaultSize={80}>
            <ResizablePanelGroup direction={isMobile ? "vertical" : "horizontal"} className="h-full">
              {/* Editor Section */}
              <ResizablePanel defaultSize={60} className="flex flex-col bg-slate-950">
                <div className="flex-1 flex flex-col min-h-0">
                  {/* Breadcrumbs & File Header */}
                  <div className="flex flex-col border-b border-white/5 bg-slate-900/30">
                    {editorViewMode === 'project' && (
                      <div className="h-8 flex items-center gap-1 px-4 text-[10px] text-slate-500 bg-slate-950/40 border-b border-white/5">
                        {activeFile.path.split('/').filter(Boolean).map((part, i, arr) => (
                          <React.Fragment key={i}>
                            <span className={i === arr.length - 1 ? "text-primary/80 font-semibold" : ""}>{part}</span>
                            {i < arr.length - 1 && <ChevronRight className="h-3 w-3 mx-0.5 opacity-50" />}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                    {/* Editor Header */}
                    <div className="h-11 flex items-center justify-between px-4">
                      <div className="flex items-center gap-4">
                        {editorViewMode === 'project' ? (
                          <div className="flex items-center gap-2">
                            {getFileIcon(activeFile.name)}
                            <span className="text-sm font-semibold text-slate-200 tracking-tight">{activeFile.name}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary text-[10px] font-bold px-2 py-0">PRACTICE MODE</Badge>
                            <span className="text-sm font-semibold text-slate-200 tracking-tight">{LANGUAGES[selectedLanguage].name} Playground</span>
                          </div>
                        )}
                        <div className="h-4 w-px bg-white/10" />
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                          {code.split('\n').length} lines
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1 px-2 border border-white/5 text-slate-400 hover:text-white"
                        onClick={() => {
                          navigator.clipboard.writeText(code);
                          toast({ title: "Copied!" });
                        }}>
                        <Copy className="h-3.5 w-3.5" /> Copy
                      </Button>
                    </div>
                  </div>

                  {/* Editor Layers */}
                  <div className="flex-1 relative overflow-hidden bg-slate-950">
                    <div ref={highlighterRef} className="absolute inset-0 pointer-events-none select-none scrollbar-hide overflow-auto">
                      <SyntaxHighlighter
                        language={selectedLanguage === 'cpp' ? 'cpp' : (selectedLanguage as string) === 'csharp' ? 'csharp' : selectedLanguage}
                        style={vscDarkPlus}
                        showLineNumbers={true}
                        lineNumberStyle={{ minWidth: '3.5rem', paddingRight: '1rem', color: '#333', textAlign: 'right', fontSize: '11px' }}
                        customStyle={{
                          margin: 0,
                          padding: '1rem',
                          background: 'transparent',
                          fontSize: isMobile ? '12px' : '14px',
                          lineHeight: '1.6',
                        }}
                      >
                        {code + (code.endsWith('\n') ? ' ' : '')}
                      </SyntaxHighlighter>
                    </div>
                    <textarea
                      ref={textareaRef}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      onScroll={syncScroll}
                      className="absolute inset-0 w-full h-full p-4 pl-[4.5rem] bg-transparent text-transparent caret-primary outline-none resize-none font-mono text-sm md:text-base leading-[1.6] scrollbar-thin scrollbar-thumb-white/5 selection:bg-primary/30"
                      placeholder="Write your code here..."
                      spellCheck={false}
                    />
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle className="bg-white/5 hover:bg-primary/50 transition-colors" />

              {/* Tools Section (Output/Preview) */}
              <ResizablePanel defaultSize={40} className="bg-slate-900/50">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                  <div className="h-10 border-b border-white/5 px-2 bg-slate-950/20">
                    <TabsList className="h-full w-full justify-start bg-transparent border-0 rounded-none overflow-x-auto scrollbar-hide">
                      <TabsTrigger value="output" className="h-full text-[11px] gap-2 px-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-none border-b-2 border-transparent data-[state=active]:border-primary transition-all uppercase font-bold tracking-widest">
                        <Terminal className="h-3.5 w-3.5" /> Output
                      </TabsTrigger>
                      {(selectedLanguage === 'html' || selectedLanguage === 'css' || previewCode) && (
                        <TabsTrigger value="preview" className="h-full text-[11px] gap-2 px-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-none border-b-2 border-transparent data-[state=active]:border-primary transition-all uppercase font-bold tracking-widest">
                          <Maximize2 className="h-3.5 w-3.5" /> Preview
                        </TabsTrigger>
                      )}
                      <TabsTrigger value="stats" className="h-full text-[11px] gap-2 px-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-none border-b-2 border-transparent data-[state=active]:border-primary transition-all uppercase font-bold tracking-widest">
                        <Cpu className="h-3.5 w-3.5" /> Stats
                      </TabsTrigger>
                      <TabsTrigger value="tips" className="h-full text-[11px] gap-2 px-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-none border-b-2 border-transparent data-[state=active]:border-primary transition-all uppercase font-bold tracking-widest">
                        <Lightbulb className="h-3.5 w-3.5" /> Tips
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="flex-1 overflow-hidden relative">
                    <TabsContent value="output" className="absolute inset-0 m-0 flex flex-col bg-slate-950/40">
                      <ScrollArea className="flex-1 p-4">
                        {error && (
                          <div className="mb-4 p-4 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400">
                            <div className="flex items-center gap-2 font-bold text-xs uppercase mb-2">
                              <AlertCircle className="h-4 w-4" /> Runtime Error
                            </div>
                            <pre className="font-mono text-xs whitespace-pre-wrap leading-relaxed">{error}</pre>
                          </div>
                        )}
                        {output ? (
                          <pre className="font-mono text-sm whitespace-pre-wrap text-slate-300 leading-relaxed font-medium">{output}</pre>
                        ) : !error && (
                          <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-30 mt-20">
                            <Terminal className="h-12 w-12 mb-4" />
                            <p className="text-xs font-bold uppercase tracking-widest">Ready to execute</p>
                          </div>
                        )}
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="preview" className="absolute inset-0 m-0 bg-white">
                      {previewCode ? (
                        <iframe srcDoc={previewCode} className="w-full h-full border-0" sandbox="allow-scripts allow-modals" />
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600 bg-slate-950/20">
                          <Maximize2 className="h-10 w-10 mb-2 opacity-10" />
                          <p className="text-xs">Run your code to see result</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="stats" className="absolute inset-0 m-0 p-6 bg-slate-950/40 overflow-y-auto">
                      <div className="grid gap-6">
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-1">Performance</h4>
                          <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-400">Execution Status</span>
                              <Badge variant="outline" className={error ? "border-red-500/30 text-red-500" : "border-green-500/30 text-green-500"}>
                                {error ? "Failed" : "Success"}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-400">Execution Time</span>
                              <span className="font-mono text-primary font-bold">{executionTime || 0}ms</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-1">Code Metrics</h4>
                          <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 space-y-4 text-xs">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Language</span>
                              <span className="font-bold">{LANGUAGES[selectedLanguage].name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Total Lines</span>
                              <span className="font-mono text-slate-200">{code.split('\n').length}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="tips" className="absolute inset-0 m-0 p-6 bg-slate-950/40 overflow-y-auto">
                      <div className="space-y-6">
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/20 to-indigo-500/5 border border-primary/20">
                          <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                            <Lightbulb className="h-4 w-4" /> Pro Tip
                          </h4>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            Use <kbd className="bg-slate-800 px-1 rounded text-primary">Ctrl + Enter</kbd> to quickly run your code without clicking the button.
                          </p>
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Editor Information</h4>
                          <p className="text-xs text-slate-400 leading-relaxed px-1">
                            Your code is transpiled and executed locally in a sandboxed environment. Modern ES modules are supported for JS/React projects.
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
