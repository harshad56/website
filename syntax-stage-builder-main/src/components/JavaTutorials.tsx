import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const JavaTutorials = () => {
  const [currentModule, setCurrentModule] = useState(1);
  const [progress, setProgress] = useState(0);
  const [userCode, setUserCode] = useState("");
  const [output, setOutput] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});

  const modules = [
    {
      id: 1,
      title: "Introduction to Java",
      description: "Learn the basics of Java syntax and setup",
      topics: [
        "Java Syntax Basics",
        "Hello World Program",
        "Setting up Java Environment",
        "Basic Program Structure"
      ],
      exercises: [
        {
          title: "Hello World",
          description: "Write a program that prints 'Hello, World!' to the console",
          starterCode: `public class HelloWorld {
    public static void main(String[] args) {
        // Write your code here
        
    }
}`,
          solution: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
          testCases: [
            { input: "", expected: "Hello, World!" }
          ]
        },
        {
          title: "Simple Calculator",
          description: "Create a program that adds two numbers",
          starterCode: `public class Calculator {
    public static void main(String[] args) {
        int a = 5;
        int b = 3;
        // Calculate the sum
        
    }
}`,
          solution: `public class Calculator {
    public static void main(String[] args) {
        int a = 5;
        int b = 3;
        int sum = a + b;
        System.out.println("Sum: " + sum);
    }
}`,
          testCases: [
            { input: "", expected: "Sum: 8" }
          ]
        }
      ],
      quiz: [
        {
          question: "What is the entry point of a Java program?",
          options: ["main() method", "start() method", "run() method", "execute() method"],
          correct: 0
        },
        {
          question: "Which keyword is used to declare a class in Java?",
          options: ["class", "type", "struct", "object"],
          correct: 0
        }
      ]
    },
    {
      id: 2,
      title: "Data Types and Variables",
      description: "Master Java's primitive types and variable declaration",
      topics: [
        "Primitive Data Types",
        "Variable Declaration",
        "Type Conversion",
        "Constants and Literals"
      ],
      exercises: [
        {
          title: "Variable Declaration",
          description: "Declare variables of different types and print them",
          starterCode: `public class Variables {
    public static void main(String[] args) {
        // Declare variables here
        // int age = 
        // String name = 
        // double salary = 
        
        // Print the variables
        
    }
}`,
          solution: `public class Variables {
    public static void main(String[] args) {
        int age = 25;
        String name = "John Doe";
        double salary = 50000.0;
        
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Salary: " + salary);
    }
}`,
          testCases: [
            { input: "", expected: "Name: John Doe\nAge: 25\nSalary: 50000.0" }
          ]
        }
      ],
      quiz: [
        {
          question: "Which data type is used for whole numbers in Java?",
          options: ["float", "int", "double", "String"],
          correct: 1
        },
        {
          question: "What is the default value of an int variable?",
          options: ["null", "0", "undefined", "1"],
          correct: 1
        }
      ]
    },
    {
      id: 3,
      title: "Control Flow and Loops",
      description: "Learn conditional statements and loop structures",
      topics: [
        "If-Else Statements",
        "Switch Statements",
        "For Loops",
        "While and Do-While Loops"
      ],
      exercises: [
        {
          title: "Number Checker",
          description: "Write a program that checks if a number is positive, negative, or zero",
          starterCode: `public class NumberChecker {
    public static void main(String[] args) {
        int number = 10;
        
        // Write your conditional logic here
        
    }
}`,
          solution: `public class NumberChecker {
    public static void main(String[] args) {
        int number = 10;
        
        if (number > 0) {
            System.out.println("Positive number");
        } else if (number < 0) {
            System.out.println("Negative number");
        } else {
            System.out.println("Zero");
        }
    }
}`,
          testCases: [
            { input: "10", expected: "Positive number" },
            { input: "-5", expected: "Negative number" },
            { input: "0", expected: "Zero" }
          ]
        },
        {
          title: "Sum Calculator",
          description: "Calculate the sum of numbers from 1 to n using a loop",
          starterCode: `public class SumCalculator {
    public static void main(String[] args) {
        int n = 5;
        int sum = 0;
        
        // Use a loop to calculate sum from 1 to n
        
        System.out.println("Sum: " + sum);
    }
}`,
          solution: `public class SumCalculator {
    public static void main(String[] args) {
        int n = 5;
        int sum = 0;
        
        for (int i = 1; i <= n; i++) {
            sum += i;
        }
        
        System.out.println("Sum: " + sum);
    }
}`,
          testCases: [
            { input: "5", expected: "Sum: 15" }
          ]
        }
      ],
      quiz: [
        {
          question: "Which loop executes at least once?",
          options: ["for loop", "while loop", "do-while loop", "if statement"],
          correct: 2
        },
        {
          question: "What is the purpose of the break statement?",
          options: ["To continue the loop", "To exit the loop", "To skip an iteration", "To pause execution"],
          correct: 1
        }
      ]
    },
    {
      id: 4,
      title: "Object-Oriented Programming Basics",
      description: "Understand classes, objects, methods, and inheritance",
      topics: [
        "Classes and Objects",
        "Methods and Constructors",
        "Inheritance",
        "Encapsulation"
      ],
      exercises: [
        {
          title: "Student Class",
          description: "Create a Student class with properties and methods",
          starterCode: `public class Student {
    // Declare properties
    // private String name;
    // private int age;
    // private double gpa;
    
    // Create constructor
    
    // Create getter and setter methods
    
    // Create a method to display student info
    
}

public class Main {
    public static void main(String[] args) {
        // Create a Student object and test it
        
    }
}`,
          solution: `public class Student {
    private String name;
    private int age;
    private double gpa;
    
    public Student(String name, int age, double gpa) {
        this.name = name;
        this.age = age;
        this.gpa = gpa;
    }
    
    public String getName() { return name; }
    public int getAge() { return age; }
    public double getGpa() { return gpa; }
    
    public void displayInfo() {
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("GPA: " + gpa);
    }
}

public class Main {
    public static void main(String[] args) {
        Student student = new Student("Alice", 20, 3.8);
        student.displayInfo();
    }
}`,
          testCases: [
            { input: "", expected: "Name: Alice\nAge: 20\nGPA: 3.8" }
          ]
        }
      ],
      quiz: [
        {
          question: "What is the relationship between a class and an object?",
          options: ["Class is an instance of object", "Object is an instance of class", "They are the same", "No relationship"],
          correct: 1
        },
        {
          question: "Which keyword is used for inheritance in Java?",
          options: ["extends", "implements", "inherits", "super"],
          correct: 0
        }
      ]
    },
    {
      id: 5,
      title: "Exception Handling",
      description: "Learn to handle errors and exceptions gracefully",
      topics: [
        "Try-Catch Blocks",
        "Exception Types",
        "Finally Block",
        "Custom Exceptions"
      ],
      exercises: [
        {
          title: "Division Calculator",
          description: "Create a program that handles division by zero exception",
          starterCode: `public class DivisionCalculator {
    public static void main(String[] args) {
        int a = 10;
        int b = 0;
        
        // Handle division by zero exception
        
    }
}`,
          solution: `public class DivisionCalculator {
    public static void main(String[] args) {
        int a = 10;
        int b = 0;
        
        try {
            int result = a / b;
            System.out.println("Result: " + result);
        } catch (ArithmeticException e) {
            System.out.println("Error: Division by zero is not allowed");
        }
    }
}`,
          testCases: [
            { input: "", expected: "Error: Division by zero is not allowed" }
          ]
        }
      ],
      quiz: [
        {
          question: "Which block is always executed regardless of exception?",
          options: ["try block", "catch block", "finally block", "throw block"],
          correct: 2
        },
        {
          question: "What is the parent class of all exceptions?",
          options: ["Error", "Exception", "Throwable", "RuntimeException"],
          correct: 2
        }
      ]
    }
  ];

  const currentModuleData = modules.find(m => m.id === currentModule);

  const runCode = () => {
    // Simulate code execution
    const currentExercise = currentModuleData?.exercises[0];
    if (currentExercise) {
      if (userCode.includes(currentExercise.solution.split('\n')[2])) {
        setOutput("✅ Correct! Your code executed successfully.\n" + currentExercise.testCases[0].expected);
        setProgress(prev => Math.min(prev + 10, 100));
      } else {
        setOutput("❌ Try again. Check your code logic.");
      }
    }
  };

  const submitQuiz = (moduleId: number) => {
    const module = modules.find(m => m.id === moduleId);
    if (module) {
      let correctAnswers = 0;
      module.quiz.forEach((q, index) => {
        if (quizAnswers[moduleId * 10 + index] === q.options[q.correct]) {
          correctAnswers++;
        }
      });
      const score = (correctAnswers / module.quiz.length) * 100;
      alert(`Quiz Score: ${score}% (${correctAnswers}/${module.quiz.length} correct)`);
      if (score >= 80) {
        setProgress(prev => Math.min(prev + 15, 100));
      }
    }
  };

  const nextModule = () => {
    if (currentModule < modules.length) {
      setCurrentModule(currentModule + 1);
      setUserCode("");
      setOutput("");
    }
  };

  const prevModule = () => {
    if (currentModule > 1) {
      setCurrentModule(currentModule - 1);
      setUserCode("");
      setOutput("");
    }
  };

  return (
    <section id="java-tutorials" className="py-24 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Java Programming</span> Tutorials
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Master Java programming with interactive tutorials, hands-on exercises, and real-world projects. 
            From basics to advanced concepts, learn at your own pace.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Course Progress</span>
            <span className="text-sm text-muted-foreground">{progress}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Module Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {modules.map((module) => (
            <Button
              key={module.id}
              variant={currentModule === module.id ? "default" : "outline"}
              onClick={() => setCurrentModule(module.id)}
              className="transition-all duration-300"
            >
              Module {module.id}: {module.title}
            </Button>
          ))}
        </div>

        {currentModuleData && (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Module Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Module Header */}
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Badge variant="secondary">Module {currentModuleData.id}</Badge>
                      {currentModuleData.title}
                    </CardTitle>
                    <CardDescription className="text-lg">
                      {currentModuleData.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Topics Covered:</h4>
                      <ul className="space-y-2">
                        {currentModuleData.topics.map((topic, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="text-primary">✓</span>
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Interactive Code Editor */}
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-xl">💻 Interactive Code Editor</CardTitle>
                    <CardDescription>
                      Practice coding with real-time feedback
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-code-bg p-4 rounded-lg">
                      <textarea
                        className="w-full h-48 bg-transparent text-code-foreground resize-none outline-none font-mono text-sm leading-relaxed"
                        value={userCode || currentModuleData.exercises[0]?.starterCode || ""}
                        onChange={(e) => setUserCode(e.target.value)}
                        placeholder="Write your Java code here..."
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button onClick={runCode} className="flex-1">
                        ▶ Run Code
                      </Button>
                      <Button variant="outline" onClick={() => setUserCode(currentModuleData.exercises[0]?.starterCode || "")}>
                        Reset Code
                      </Button>
                    </div>
                    {output && (
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Output:</h4>
                        <pre className="text-sm whitespace-pre-wrap">{output}</pre>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quiz Section */}
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-xl">🧠 Knowledge Check</CardTitle>
                    <CardDescription>
                      Test your understanding with interactive quizzes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {currentModuleData.quiz.map((question, index) => (
                      <div key={index} className="space-y-3">
                        <h4 className="font-semibold">
                          Question {index + 1}: {question.question}
                        </h4>
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => (
                            <label key={optIndex} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`quiz-${currentModuleData.id}-${index}`}
                                value={option}
                                onChange={(e) => setQuizAnswers({
                                  ...quizAnswers,
                                  [currentModuleData.id * 10 + index]: e.target.value
                                })}
                                className="text-primary"
                              />
                              <span>{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Button 
                      onClick={() => submitQuiz(currentModuleData.id)}
                      className="w-full"
                    >
                      Submit Quiz
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Module Navigation */}
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle>Course Modules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {modules.map((module) => (
                        <button
                          key={module.id}
                          onClick={() => setCurrentModule(module.id)}
                          className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                            currentModule === module.id
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                        >
                          <div className="font-medium">Module {module.id}</div>
                          <div className="text-sm opacity-80">{module.title}</div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="outline" 
                      onClick={prevModule}
                      disabled={currentModule === 1}
                      className="w-full"
                    >
                      ← Previous Module
                    </Button>
                    <Button 
                      onClick={nextModule}
                      disabled={currentModule === modules.length}
                      className="w-full"
                    >
                      Next Module →
                    </Button>
                    <Button 
                      variant="secondary"
                      onClick={() => alert("📚 Additional Java resources and advanced topics will be available soon!")}
                      className="w-full"
                    >
                      📚 More Resources
                    </Button>
                  </CardContent>
                </Card>

                {/* Capstone Project */}
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle>🎯 Capstone Project</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Build a complete Java application to apply all your knowledge.
                    </p>
                    <Button 
                      variant="hero"
                      onClick={() => alert("🚀 Capstone Project: Contact Manager\n\nBuild a complete contact management system with:\n• Add/Edit/Delete contacts\n• Search functionality\n• Data persistence\n• Exception handling\n• OOP principles\n\nThis project will be available after completing all modules!")}
                      className="w-full"
                    >
                      Start Capstone Project
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Career Information */}
        <div className="mt-16 text-center">
          <Card className="border-border bg-card max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">💼 Java Career Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">$85K</div>
                  <div className="text-sm text-muted-foreground">Average Java Developer Salary</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">92%</div>
                  <div className="text-sm text-muted-foreground">Job Placement Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary mb-2">6-12</div>
                  <div className="text-sm text-muted-foreground">Months to Job</div>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Popular Java Career Paths:</h4>
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge variant="outline">Backend Developer</Badge>
                  <Badge variant="outline">Android Developer</Badge>
                  <Badge variant="outline">Enterprise Developer</Badge>
                  <Badge variant="outline">Full-Stack Developer</Badge>
                  <Badge variant="outline">DevOps Engineer</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default JavaTutorials; 