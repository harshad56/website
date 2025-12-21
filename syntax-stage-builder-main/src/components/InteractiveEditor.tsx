import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { codeExecutor, type TestCase } from "@/services/CodeExecutor";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle, Play, AlertCircle } from "lucide-react";

const InteractiveEditor = () => {
  const [activeLanguage, setActiveLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [syntaxErrors, setSyntaxErrors] = useState<string[]>([]);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const examples = {
    python: {
      name: "Python",
      starter: `# Welcome to Python!
# Try modifying this code and click Run

def greet(name):
    return f"Hello, {name}! Welcome to programming!"

def calculate_age_in_days(age_years):
    return age_years * 365

# Your turn - try these:
name = "Programmer"
age = 25

greeting = greet(name)
days_lived = calculate_age_in_days(age)

print(greeting)
print(f"You've lived approximately {days_lived} days!")

# Challenge: Add a function to calculate hours lived!`,
      
      challenge: "Create a function that calculates hours lived and add it to the code above."
    },
    javascript: {
      name: "JavaScript", 
      starter: `// Welcome to JavaScript!
// Modify this code and see the results

function createCounter() {
    let count = 0;
    return {
        increment: () => ++count,
        decrement: () => --count,
        getValue: () => count
    };
}

const counter = createCounter();

console.log("Initial value:", counter.getValue());
console.log("After increment:", counter.increment());
console.log("After increment:", counter.increment());
console.log("After decrement:", counter.decrement());

// Challenge: Add a reset() method to the counter!`,
      
      challenge: "Add a reset() method that sets the counter back to 0."
    },
    java: {
      name: "Java",
      starter: `// Welcome to Java!
// Object-oriented programming example

public class Student {
    private String name;
    private int age;
    private double gpa;
    
    public Student(String name, int age) {
        this.name = name;
        this.age = age;
        this.gpa = 0.0;
    }
    
    public void setGPA(double gpa) {
        this.gpa = Math.max(0.0, Math.min(4.0, gpa));
    }
    
    public String getStatus() {
        if (gpa >= 3.5) return "Dean's List";
        if (gpa >= 2.0) return "Good Standing";
        return "Academic Probation";
    }
    
    public static void main(String[] args) {
        Student student = new Student("Alice", 20);
        student.setGPA(3.8);
        
        System.out.println("Student: " + student.name);
        System.out.println("Status: " + student.getStatus());
    }
}

// Challenge: Add a method to calculate years until graduation!`,
      
      challenge: "Add a method yearsUntilGraduation() assuming 4-year degree and current year of study."
    }
  };

  useEffect(() => {
    setCode(examples[activeLanguage as keyof typeof examples].starter);
  }, []); // initialize editor with default snippet

  const executeCode = async () => {
    if (!code.trim()) {
      toast({
        title: "No code to execute",
        description: "Please write some code first.",
        variant: "destructive",
      });
      return;
    }

    setIsExecuting(true);
    setSyntaxErrors([]);
    setExecutionResult(null);

    try {
      // Validate syntax first
      const syntaxCheck = codeExecutor.validateSyntax(activeLanguage, code);
      if (!syntaxCheck.isValid) {
        setSyntaxErrors(syntaxCheck.errors);
        toast({
          title: "Syntax errors found",
          description: "Please fix the syntax errors before running.",
          variant: "destructive",
        });
        return;
      }

      // Execute code with test cases
      const testCases: TestCase[] = [
        {
          input: "5",
          expected: "120",
          description: "Factorial of 5",
          passed: false
        },
        {
          input: "0",
          expected: "1",
          description: "Factorial of 0",
          passed: false
        }
      ];

      const result = await codeExecutor.executeCode(activeLanguage, code, testCases);
      setExecutionResult(result);
      setOutput(result.result.output || "Code executed successfully!");
      
      if (result.allTestsPassed) {
        toast({
          title: "All tests passed! 🎉",
          description: `Score: ${result.score}% - Great job!`,
        });
      } else {
        toast({
          title: "Some tests failed",
          description: `Score: ${result.score}% - Keep trying!`,
          variant: "destructive",
        });
      }

      // Update user progress if authenticated
      if (isAuthenticated && result.allTestsPassed) {
        // This would update user progress in a real app
        toast({
          title: "Progress updated!",
          description: "+50 points for successful completion!",
        });
      }

    } catch (error) {
      setOutput("Error: " + (error instanceof Error ? error.message : "Execution failed"));
      toast({
        title: "Execution failed",
        description: "There was an error running your code.",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <section id="practice" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Interactive</span> Code Playground
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn by doing! Write code, run it instantly, and see results in real-time. 
            No setup required - just pure learning.
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {Object.entries(examples).map(([key, lang]) => (
              <Button
                key={key}
                variant={activeLanguage === key ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setActiveLanguage(key);
                  setCode(lang.starter);
                  setOutput("");
                }}
                className="transition-all duration-300"
              >
                {lang.name}
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Code Editor */}
            <div className="lg:col-span-2">
              <Card className="border-border bg-card h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Code Editor</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{examples[activeLanguage as keyof typeof examples].name}</Badge>
                    <Button 
                      variant="cta" 
                      size="sm" 
                      onClick={executeCode}
                      disabled={isExecuting}
                    >
                      {isExecuting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Running...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Run Code
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="code-block min-h-[400px]">
                    <textarea
                      className="w-full h-full bg-transparent text-code-foreground resize-none outline-none font-mono text-sm leading-relaxed"
                      value={code || examples[activeLanguage as keyof typeof examples].starter}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Start typing your code here..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Output & Challenge */}
            <div className="space-y-6">
              {/* Output Panel */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg">Output</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Syntax Errors */}
                    {syntaxErrors.length > 0 && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="font-semibold mb-2">Syntax Errors:</div>
                          <ul className="list-disc list-inside space-y-1">
                            {syntaxErrors.map((error, index) => (
                              <li key={index} className="text-sm">{error}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Test Results */}
                    {executionResult && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Test Results:</span>
                          <Badge variant={executionResult.allTestsPassed ? "default" : "destructive"}>
                            {executionResult.score}% Score
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {executionResult.testCases.map((test: any, index: number) => (
                            <div key={index} className="flex items-center space-x-2 p-2 rounded border">
                              {test.passed ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <div className="flex-1">
                                <div className="text-sm font-medium">{test.description}</div>
                                <div className="text-xs text-muted-foreground">
                                  Expected: {test.expected}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Code Output */}
                    <div className="code-block min-h-[120px] bg-code-bg p-4">
                      <pre className="text-code-foreground text-sm whitespace-pre-wrap">
                        {output || "Click 'Run Code' to see output here..."}
                      </pre>
                    </div>

                    {/* Execution Stats */}
                    {executionResult && (
                      <div className="text-xs text-muted-foreground">
                        Execution time: {executionResult.result.executionTime.toFixed(2)}ms
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Challenge */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg">💡 Challenge</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {examples[activeLanguage as keyof typeof examples].challenge}
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Get Hint
                  </Button>
                </CardContent>
              </Card>
              
              {/* Quick Stats */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg">Your Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Challenges Completed</span>
                    <span className="font-semibold">23/50</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-primary h-2 rounded-full" style={{width: '46%'}}></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Current Streak</span>
                    <span className="font-semibold">🔥 7 days</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <div className="bg-card border border-border rounded-xl p-8 shadow-elegant max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">🚀 Ready for More Advanced Challenges?</h3>
              <p className="text-muted-foreground mb-6">
                Join our coding challenges platform with 500+ problems, from easy to expert level. 
                Compete with other learners and build your portfolio.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/algorithm-challenges" className="w-full sm:w-auto">
                  <Button variant="hero" size="lg" className="w-full">
                    View All Challenges
                  </Button>
                </Link>
                <Link to="/code-playground" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full">
                    Practice Problems
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveEditor;