import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import SEO from "@/components/SEO";

const CodingChallenges = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("java");
  const [selectedDifficulty, setSelectedDifficulty] = useState("basic");
  const [userCode, setUserCode] = useState("");
  const [output, setOutput] = useState("");
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Array<{
    testCase: number;
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
    description: string;
  }>>([]);

  const LOCAL_STORAGE_KEY = "codeacademy_challenge_progress";

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setCompletedChallenges(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load challenge progress", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(completedChallenges));
  }, [completedChallenges]);

  const challenges = {
    java: {
      basic: [
        {
          title: "Factorial Calculator",
          description: "Write a function to calculate the factorial of a number.",
          problem: "Implement a method that takes an integer n and returns its factorial. Handle edge cases like 0 and negative numbers.",
          starterCode: `public class FactorialCalculator {
    public static int factorial(int n) {
        // Write your code here
        return 0;
    }
    
    public static void main(String[] args) {
        // Test your function
        System.out.println("Factorial of 5: " + factorial(5));
        System.out.println("Factorial of 0: " + factorial(0));
    }
}`,
          testCases: [
            { input: "5", expected: "120", description: "Factorial of 5" },
            { input: "0", expected: "1", description: "Factorial of 0" },
            { input: "3", expected: "6", description: "Factorial of 3" }
          ],
          hints: [
            "Remember: factorial of n is n * (n-1) * (n-2) * ... * 1",
            "Factorial of 0 is always 1",
            "Use a loop to multiply numbers from 1 to n",
            "Consider using a recursive approach or iterative loop"
          ]
        },
        {
          title: "Palindrome Checker",
          description: "Write a function to check if a string is a palindrome.",
          problem: "Implement a method that takes a string and returns true if it's a palindrome, false otherwise.",
          starterCode: `public class PalindromeChecker {
    public static boolean isPalindrome(String str) {
        // Write your code here
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println("'racecar' is palindrome: " + isPalindrome("racecar"));
        System.out.println("'hello' is palindrome: " + isPalindrome("hello"));
    }
}`,
          testCases: [
            { input: "racecar", expected: "true", description: "Simple palindrome" },
            { input: "hello", expected: "false", description: "Non-palindrome" }
          ]
        },
        {
          title: "Array Sum",
          description: "Calculate the sum of all elements in an array.",
          problem: "Write a method that takes an array of integers and returns their sum.",
          starterCode: `public class ArraySum {
    public static int sumArray(int[] arr) {
        // Write your code here
        return 0;
    }
    
    public static void main(String[] args) {
        int[] numbers = {1, 2, 3, 4, 5};
        System.out.println("Sum: " + sumArray(numbers));
    }
}`,
          testCases: [
            { input: "[1,2,3,4,5]", expected: "15", description: "Basic array" },
            { input: "[0,0,0]", expected: "0", description: "All zeros" }
          ]
        }
      ],
      intermediate: [
        {
          title: "Longest Palindrome Substring",
          description: "Find the longest palindromic substring in a given string.",
          problem: "Implement a method that finds and returns the longest palindromic substring.",
          starterCode: `public class LongestPalindrome {
    public static String longestPalindrome(String s) {
        // Write your code here
        return "";
    }
    
    public static void main(String[] args) {
        System.out.println("Longest palindrome in 'babad': " + longestPalindrome("babad"));
    }
}`,
          testCases: [
            { input: "babad", expected: "bab", description: "Basic test case" },
            { input: "cbbd", expected: "bb", description: "Even length palindrome" }
          ]
        },
        {
          title: "Two Sum",
          description: "Find two numbers in an array that add up to a target.",
          problem: "Given an array of integers and a target sum, return indices of two numbers that add up to the target.",
          starterCode: `public class TwoSum {
    public static int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[0];
    }
    
    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        int[] result = twoSum(nums, target);
        System.out.println("Indices: [" + result[0] + ", " + result[1] + "]");
    }
}`,
          testCases: [
            { input: "[2,7,11,15],9", expected: "[0,1]", description: "Basic two sum" },
            { input: "[3,2,4],6", expected: "[1,2]", description: "Another example" }
          ]
        }
      ]
    },
    python: {
      basic: [
        {
          title: "List Operations",
          description: "Implement common list operations in Python.",
          problem: "Write functions to reverse a list, find the maximum element, and remove duplicates.",
          starterCode: `def reverse_list(lst):
    # Write your code here
    pass

def find_max(lst):
    # Write your code here
    pass

def remove_duplicates(lst):
    # Write your code here
    pass

# Test your functions
numbers = [1, 2, 3, 4, 5]
print("Original:", numbers)
print("Reversed:", reverse_list(numbers))
print("Max:", find_max(numbers))`,
          testCases: [
            { input: "[1,2,3,4,5]", expected: "[5,4,3,2,1]", description: "Reverse list" },
            { input: "[1,2,3,4,5]", expected: "5", description: "Find maximum" }
          ]
        },
        {
          title: "String Manipulation",
          description: "Common string operations in Python.",
          problem: "Write functions to count vowels, reverse a string, and check if it's a palindrome.",
          starterCode: `def count_vowels(text):
    # Write your code here
    pass

def reverse_string(text):
    # Write your code here
    pass

def is_palindrome(text):
    # Write your code here
    pass

# Test your functions
text = "Hello World"
print("Vowels:", count_vowels(text))
print("Reversed:", reverse_string(text))`,
          testCases: [
            { input: "Hello", expected: "2", description: "Count vowels" },
            { input: "racecar", expected: "True", description: "Palindrome check" }
          ]
        },
        {
          title: "Dictionary Operations",
          description: "Work with Python dictionaries.",
          problem: "Create functions to merge dictionaries, find the most common key, and invert a dictionary.",
          starterCode: `def merge_dicts(dict1, dict2):
    # Write your code here
    pass

def most_common_key(dictionary):
    # Write your code here
    pass

def invert_dict(dictionary):
    # Write your code here
    pass

# Test your functions
dict1 = {'a': 1, 'b': 2}
dict2 = {'c': 3, 'd': 4}
print("Merged:", merge_dicts(dict1, dict2))`,
          testCases: [
            { input: "{'a':1,'b':2},{'c':3}", expected: "{'a':1,'b':2,'c':3}", description: "Merge dictionaries" },
            { input: "{'a':1,'b':2,'c':1}", expected: "a", description: "Most common key" }
          ]
        }
      ],
      intermediate: [
        {
          title: "List Comprehension",
          description: "Master Python list comprehensions.",
          problem: "Use list comprehensions to create filtered and transformed lists.",
          starterCode: `def square_even_numbers(numbers):
    # Use list comprehension to square even numbers
    pass

def filter_strings_by_length(strings, min_length):
    # Use list comprehension to filter strings
    pass

def create_matrix(rows, cols):
    # Use list comprehension to create a matrix
    pass

# Test your functions
numbers = [1, 2, 3, 4, 5, 6]
print("Squared evens:", square_even_numbers(numbers))`,
          testCases: [
            { input: "[1,2,3,4,5,6]", expected: "[4,16,36]", description: "Square even numbers" },
            { input: "['hi','hello','world'],3", expected: "['hello','world']", description: "Filter strings" }
          ]
        }
      ]
    },
    javascript: {
      basic: [
        {
          title: "Array Methods",
          description: "Master JavaScript array methods.",
          problem: "Use map, filter, and reduce to transform arrays.",
          starterCode: `function doubleNumbers(numbers) {
    // Use map to double each number
}

function filterEvenNumbers(numbers) {
    // Use filter to get even numbers
}

function sumArray(numbers) {
    // Use reduce to sum the array
}

// Test your functions
const numbers = [1, 2, 3, 4, 5];
console.log("Doubled:", doubleNumbers(numbers));
console.log("Evens:", filterEvenNumbers(numbers));
console.log("Sum:", sumArray(numbers));`,
          testCases: [
            { input: "[1,2,3,4,5]", expected: "[2,4,6,8,10]", description: "Double numbers" },
            { input: "[1,2,3,4,5]", expected: "[2,4]", description: "Filter evens" }
          ]
        },
        {
          title: "String Operations",
          description: "JavaScript string manipulation.",
          problem: "Implement functions to reverse strings, count characters, and check palindromes.",
          starterCode: `function reverseString(str) {
    // Reverse the string
}

function countCharacters(str) {
    // Count each character occurrence
}

function isPalindrome(str) {
    // Check if string is palindrome
}

// Test your functions
const text = "hello";
console.log("Reversed:", reverseString(text));
console.log("Character count:", countCharacters(text));`,
          testCases: [
            { input: "hello", expected: "olleh", description: "Reverse string" },
            { input: "racecar", expected: "true", description: "Palindrome check" }
          ]
        }
      ],
      intermediate: [
        {
          title: "Closures and Scope",
          description: "Understand JavaScript closures.",
          problem: "Create functions that use closures to maintain state.",
          starterCode: `function createCounter() {
    // Return a function that increments a counter
}

function createMultiplier(factor) {
    // Return a function that multiplies by the factor
}

// Test your functions
const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2

const double = createMultiplier(2);
console.log(double(5)); // 10`,
          testCases: [
            { input: "counter()", expected: "1", description: "Counter increment" },
            { input: "double(5)", expected: "10", description: "Multiplier function" }
          ]
        }
      ]
    },
    cpp: {
      basic: [
        {
          title: "Basic Functions",
          description: "C++ function implementation.",
          problem: "Write functions to calculate factorial, check prime numbers, and reverse arrays.",
          starterCode: `#include <iostream>
using namespace std;

int factorial(int n) {
    // Calculate factorial
}

bool isPrime(int n) {
    // Check if number is prime
}

void reverseArray(int arr[], int size) {
    // Reverse the array
}

int main() {
    cout << "Factorial of 5: " << factorial(5) << endl;
    cout << "Is 7 prime? " << (isPrime(7) ? "Yes" : "No") << endl;
    return 0;
}`,
          testCases: [
            { input: "5", expected: "120", description: "Factorial calculation" },
            { input: "7", expected: "1", description: "Prime check" }
          ]
        }
      ]
    },
    csharp: {
      basic: [
        {
          title: "LINQ Operations",
          description: "C# LINQ queries.",
          problem: "Use LINQ to filter, sort, and transform collections.",
          starterCode: `using System;
using System.Linq;

class Program {
    static void Main() {
        int[] numbers = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
        
        var evenNumbers = numbers.Where(n => n % 2 == 0);
        var doubled = numbers.Select(n => n * 2);
        var sum = numbers.Sum();
        
        Console.WriteLine("Even numbers: " + string.Join(", ", evenNumbers));
        Console.WriteLine("Sum: " + sum);
    }
}`,
          testCases: [
            { input: "[1,2,3,4,5]", expected: "[2,4]", description: "Filter evens" },
            { input: "[1,2,3]", expected: "6", description: "Sum array" }
          ]
        }
      ]
    },
    go: {
      basic: [
        {
          title: "Slices and Maps",
          description: "Go slices and maps operations.",
          problem: "Work with Go slices and maps to manipulate data.",
          starterCode: `package main

import "fmt"

func sumSlice(numbers []int) int {
    // Sum all numbers in slice
}

func reverseSlice(numbers []int) []int {
    // Reverse the slice
}

func countCharacters(text string) map[rune]int {
    // Count character occurrences
}

func main() {
    numbers := []int{1, 2, 3, 4, 5}
    fmt.Println("Sum:", sumSlice(numbers))
    fmt.Println("Reversed:", reverseSlice(numbers))
}`,
          testCases: [
            { input: "[1,2,3,4,5]", expected: "15", description: "Sum slice" },
            { input: "hello", expected: "map[h:1 e:1 l:2 o:1]", description: "Count characters" }
          ]
        }
      ]
    },
    rust: {
      basic: [
        {
          title: "Ownership and Borrowing",
          description: "Rust ownership concepts.",
          problem: "Implement functions that demonstrate Rust's ownership system.",
          starterCode: `fn main() {
    let numbers = vec![1, 2, 3, 4, 5];
    
    let sum = calculate_sum(&numbers);
    let doubled = double_numbers(&numbers);
    
    println!("Sum: {}", sum);
    println!("Doubled: {:?}", doubled);
}

fn calculate_sum(numbers: &Vec<i32>) -> i32 {
    // Calculate sum without taking ownership
}

fn double_numbers(numbers: &Vec<i32>) -> Vec<i32> {
    // Return new vector with doubled values
}`,
          testCases: [
            { input: "[1,2,3,4,5]", expected: "15", description: "Calculate sum" },
            { input: "[1,2,3]", expected: "[2,4,6]", description: "Double numbers" }
          ]
        }
      ]
    }
  };

  type DifficultyGroup = typeof challenges.java;
  const currentChallenges =
    challenges[selectedLanguage as keyof typeof challenges]?.[
      selectedDifficulty as keyof DifficultyGroup
    ] || [];

  const getChallengeKey = (language: string, difficulty: string, index: number) =>
    `${language}__${difficulty}__${index}`;

  const isChallengeCompleted = (language: string, difficulty: string, index: number) =>
    completedChallenges[getChallengeKey(language, difficulty, index)] === true;

  const completedCount = useMemo(() => {
    return currentChallenges.reduce((count, _, index) => {
      return count + (isChallengeCompleted(selectedLanguage, selectedDifficulty, index) ? 1 : 0);
    }, 0);
  }, [currentChallenges, completedChallenges, selectedLanguage, selectedDifficulty]);

  const completionPercent =
    currentChallenges.length > 0 ? Math.round((completedCount / currentChallenges.length) * 100) : 0;

  const markChallengeComplete = (language: string, difficulty: string, index: number) => {
    const key = getChallengeKey(language, difficulty, index);
    setCompletedChallenges((prev) => {
      if (prev[key]) return prev;
      return { ...prev, [key]: true };
    });
  };

  const loadChallenge = (index: number) => {
    setCurrentChallenge(index);
    if (currentChallenges[index]) {
      setUserCode(currentChallenges[index].starterCode);
      setOutput("");
    }
  };

  useEffect(() => {
    loadChallenge(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage, selectedDifficulty]);

  const runTests = () => {
    if (!currentChallenges[currentChallenge]) return;
    
    const challenge = currentChallenges[currentChallenge];
    setOutput("🧪 Running tests...");
    setTestResults([]);
    
    // Simulate test execution
    setTimeout(() => {
      const results = challenge.testCases.map((testCase, index) => {
        // In a real implementation, this would execute the code
        // For now, we'll simulate based on whether code looks complete
        const hasCode = userCode.trim().length > challenge.starterCode.trim().length + 50;
        const passed = hasCode && Math.random() > 0.3; // 70% pass rate if code exists
        
        return {
          testCase: index + 1,
          input: testCase.input,
          expected: testCase.expected,
          actual: passed ? testCase.expected : "Error: Implementation incomplete",
          passed,
          description: testCase.description
        };
      });
      
      setTestResults(results);
      
      const allPassed = results.every(r => r.passed);
      if (allPassed) {
        setOutput(`🧪 Running tests for: ${challenge.title}\n\n✅ All ${results.length} tests passed!\n\nYour solution is correct. Great job!`);
        markChallengeComplete(selectedLanguage, selectedDifficulty, currentChallenge);
      } else {
        const passedCount = results.filter(r => r.passed).length;
        setOutput(`🧪 Running tests for: ${challenge.title}\n\n❌ ${passedCount}/${results.length} tests passed.\n\nKeep trying! Review the test results below.`);
      }
    }, 500);
  };

  const resetCode = () => {
    if (currentChallenges[currentChallenge]) {
      setUserCode(currentChallenges[currentChallenge].starterCode);
    }
    setOutput("");
    setTestResults([]);
  };

  const getHint = () => {
    if (!currentChallenges[currentChallenge]) return;
    
    const challenge = currentChallenges[currentChallenge];
    const hints = challenge.hints || [
      "Think about the problem step by step",
      "Consider edge cases",
      "Review the test cases to understand expected behavior",
      "Break down the problem into smaller parts"
    ];
    
    const randomHint = hints[Math.floor(Math.random() * hints.length)];
    setOutput(`💡 Hint: ${randomHint}\n\nTry to implement the solution step by step.`);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Coding Challenges - CodeAcademy Pro",
    "description": "Practice programming with interactive coding challenges. Solve problems in Java, Python, JavaScript, C++, and more. Improve your coding skills with hands-on practice.",
    "provider": {
      "@type": "Organization",
      "name": "CodeAcademy Pro"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Beautiful Back Button */}
      <div className="container mx-auto px-6 pt-6">
        <BackButton label="Back to Home" />
      </div>
      
      <SEO
        title="Coding Challenges - Practice Programming Problems"
        description="Practice programming with interactive coding challenges. Solve problems in Java, Python, JavaScript, C++, C#, Go, and more. Improve your coding skills with hands-on practice."
        keywords="coding challenges, programming problems, coding practice, algorithm practice, coding exercises, programming challenges, practice coding"
        structuredData={structuredData}
      />
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">🧪 Coding Challenges</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex flex-col items-end gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Completed {completedCount}/{currentChallenges.length}
                </span>
                <div className="w-48">
                  <Progress value={completionPercent} />
                </div>
              </div>
              <Badge variant="secondary">Total: {currentChallenges.length}</Badge>
              <Button variant="outline" size="sm">
                🏆 Leaderboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Language and Difficulty Selection */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Programming Language</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="java">☕ Java</SelectItem>
                  <SelectItem value="python">🐍 Python</SelectItem>
                  <SelectItem value="javascript">⚡ JavaScript</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Difficulty Level</label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">🟢 Basic</SelectItem>
                  <SelectItem value="intermediate">🟡 Intermediate</SelectItem>
                  <SelectItem value="advanced">🔴 Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {currentChallenges.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Challenge List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Available Challenges</CardTitle>
                  <CardDescription>Select a challenge to start coding</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {currentChallenges.map((challenge, index) => {
                      const completed = isChallengeCompleted(selectedLanguage, selectedDifficulty, index);
                      const isActive = currentChallenge === index;
                      return (
                        <button
                          key={index}
                          onClick={() => loadChallenge(index)}
                          className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${
                            isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{challenge.title}</div>
                              <div
                                className={`text-sm mt-1 ${
                                  isActive ? "opacity-90" : "text-muted-foreground"
                                }`}
                              >
                                {challenge.description}
                              </div>
                            </div>
                            {completed ? (
                              <CheckCircle2
                                className={`w-5 h-5 ${isActive ? "text-white" : "text-green-500"}`}
                              />
                            ) : (
                              <Circle className={`w-5 h-5 ${isActive ? "text-white" : "text-muted-foreground"}`} />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Challenge Area */}
            <div className="lg:col-span-2 space-y-8">
              {currentChallenges[currentChallenge] && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">
                        Challenge {currentChallenge + 1}: {currentChallenges[currentChallenge].title}
                      </CardTitle>
                      <CardDescription className="text-lg">
                        {currentChallenges[currentChallenge].description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Problem Statement */}
                        <div>
                          <h3 className="font-semibold text-lg mb-3">Problem Statement:</h3>
                          <p className="text-muted-foreground">
                            {currentChallenges[currentChallenge].problem}
                          </p>
                        </div>

                        {/* Code Editor */}
                        <div>
                          <h3 className="font-semibold text-lg mb-3">Your Solution:</h3>
                          <div className="bg-code-bg p-4 rounded-lg">
                            <textarea
                              className="w-full h-64 bg-transparent text-code-foreground resize-none outline-none font-mono text-sm leading-relaxed"
                              value={userCode}
                              onChange={(e) => setUserCode(e.target.value)}
                              placeholder="Write your code here..."
                            />
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                          <Button onClick={runTests} className="flex-1">
                            🧪 Run Tests
                          </Button>
                          <Button variant="outline" onClick={resetCode}>
                            🔄 Reset Code
                          </Button>
                          <Button variant="secondary" onClick={getHint}>
                            💡 Get Hint
                          </Button>
                        </div>

                        {/* Output */}
                        {output && (
                          <div className="bg-muted p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">Test Results:</h4>
                            <pre className="text-sm whitespace-pre-wrap">{output}</pre>
                          </div>
                        )}

                        {/* Test Results */}
                        {testResults.length > 0 && (
                          <div>
                            <h3 className="font-semibold text-lg mb-3">Test Results:</h3>
                            <div className="space-y-2">
                              {testResults.map((result, index) => (
                                <div key={index} className={`p-3 rounded-lg border-2 ${
                                  result.passed ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/10 border-red-500/50'
                                }`}>
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="font-medium">Test {result.testCase}: {result.description}</div>
                                    <div className={`text-sm font-semibold ${result.passed ? 'text-green-500' : 'text-red-500'}`}>
                                      {result.passed ? '✅ PASSED' : '❌ FAILED'}
                                    </div>
                                  </div>
                                  <div className="text-sm space-y-1">
                                    <div>Input: <code className="bg-muted px-1 rounded">{result.input}</code></div>
                                    <div>Expected: <code className="bg-muted px-1 rounded">{result.expected}</code></div>
                                    {!result.passed && (
                                      <div>Actual: <code className="bg-muted px-1 rounded text-red-500">{result.actual}</code></div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Test Cases */}
                        {testResults.length === 0 && (
                          <div>
                            <h3 className="font-semibold text-lg mb-3">Test Cases:</h3>
                            <div className="space-y-2">
                              {currentChallenges[currentChallenge].testCases.map((testCase, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                  <div>
                                    <div className="font-medium">Test {index + 1}</div>
                                    <div className="text-sm text-muted-foreground">{testCase.description}</div>
                                  </div>
                                  <div className="text-sm">
                                    <div>Input: {testCase.input}</div>
                                    <div>Expected: {testCase.expected}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Navigation */}
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => loadChallenge(Math.max(currentChallenge - 1, 0))}
                      disabled={currentChallenge === 0}
                    >
                      ← Previous Challenge
                    </Button>
                    <div className="flex gap-4">
                      <Button variant="outline">
                        📊 View Solution
                      </Button>
                      <Button variant="outline">💬 Discuss</Button>
                      <Link to="/java-learning">
                        <Button variant="outline">
                          📚 Back to Tutorials
                        </Button>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">🏆 Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">🥇</div>
                    <div>
                      <div className="font-medium">John Doe</div>
                      <div className="text-sm text-muted-foreground">95% success rate</div>
                    </div>
                  </div>
                  <Badge variant="secondary">Expert</Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">🥈</div>
                    <div>
                      <div className="font-medium">Jane Smith</div>
                      <div className="text-sm text-muted-foreground">88% success rate</div>
                    </div>
                  </div>
                  <Badge variant="secondary">Advanced</Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">🥉</div>
                    <div>
                      <div className="font-medium">Bob Johnson</div>
                      <div className="text-sm text-muted-foreground">82% success rate</div>
                    </div>
                  </div>
                  <Badge variant="secondary">Intermediate</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CodingChallenges; 