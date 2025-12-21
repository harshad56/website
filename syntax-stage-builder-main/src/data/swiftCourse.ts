export type SwiftDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface SwiftTopic {
  id: string;
  title: string;
  content: string;
  duration: string;
  difficulty: SwiftDifficulty;
  exercises: number;
}

export interface SwiftModule {
  id: number;
  title: string;
  description: string;
  topics: SwiftTopic[];
  duration: string;
  exercises: number;
  completed: boolean;
  codeExample: string;
}

export const swiftModules: SwiftModule[] = [
  {
    id: 1,
    title: "Swift Fundamentals",
    description: "Learn the basics of Swift syntax and Swift Playgrounds.",
    topics: [
      {
        id: "swift-intro",
        title: "Introduction to Swift",
        content:
          "Swift is Apple's modern programming language designed to be safe, fast, and expressive. In this topic you will see where Swift is used today, from building iOS and macOS apps to server-side backends and even scripts. You will learn how Swift was introduced as a successor to Objective C and why its syntax feels familiar to many developers while removing many sources of bugs. You will also get a quick tour of the Swift toolchain, Xcode, and Swift Playgrounds so you know how developers write and run Swift code. By the end you should be able to explain why Swift is the main choice for native Apple platform development.",
        duration: "35 min",
        difficulty: "Beginner",
        exercises: 4
      },
      {
        id: "swift-syntax",
        title: "Syntax & Constants/Variables",
        content:
          "Every language has its own style and Swift emphasizes clarity and safety. In this topic you will learn the basic building blocks of Swift syntax, including statements, expressions, and how code is grouped into functions and types. You will see how let declares constants, var declares variables, and why Swift encourages you to prefer immutability when possible. You will practice using type inference so you do not have to write explicit types everywhere, while still understanding when explicit annotation makes code clearer. You will also get familiar with naming conventions and how Swift uses optionals and generics syntax at a glance. After this topic, simple Swift code samples will feel much less mysterious.",
        duration: "40 min",
        difficulty: "Beginner",
        exercises: 5
      },
      {
        id: "optionals",
        title: "Optionals & Safe Unwrapping",
        content:
          "One of Swift's biggest features is how it handles values that may or may not be present. Instead of using raw nulls everywhere, Swift introduces optionals to make absence explicit in the type system. In this topic you will learn what it means when a value is optional, how question mark syntax indicates this, and why trying to use a nil value without checking is unsafe. You will practice safely unwrapping optionals using if let, guard let, optional chaining, and the nil coalescing operator. You will also see when force unwrapping is appropriate and why it should be used sparingly. By the end you will be confident reading and writing code that deals with missing values in a controlled, expressive way.",
        duration: "50 min",
        difficulty: "Beginner",
        exercises: 6
      },
      {
        id: "control-flow",
        title: "Control Flow",
        content:
          "Control flow in Swift will feel familiar if you have seen other modern languages, but Swift brings some extra power through pattern matching. In this topic you will write if and else chains to make decisions, and use switch statements that can match values, ranges, and even patterns instead of just simple integers. You will use for in loops over collections, ranges, and sequences, and while loops for conditions that are checked each iteration. You will also see how break, continue, and fallthrough work in Swift's version of switch. After this topic you will be able to express complex branching logic while keeping your code clean and readable.",
        duration: "45 min",
        difficulty: "Beginner",
        exercises: 6
      }
    ],
    duration: "3.0 hours",
    exercises: 21,
    completed: false,
    codeExample: `// swift-fundamentals.swift
import Foundation

let courseName = "Swift Fundamentals"
var completedLessons = 3

print("Welcome to \\(courseName)")

// Optionals
var nickname: String? = nil
if let name = nickname {
    print("Nickname: \\(name)")
} else {
    print("No nickname yet")
}

// Switch
let score = 85
switch score {
case 90...100:
    print("Excellent")
case 75..<90:
    print("Good")
default:
    print("Keep practicing")
}`
  },
  {
    id: 2,
    title: "Collections & Functions",
    description: "Use arrays, dictionaries, sets, and define reusable functions.",
    topics: [
      {
        id: "arrays",
        title: "Arrays & Dictionaries",
        content:
          "Collections are core to Swift development, and arrays and dictionaries are the most frequently used. In this topic you will learn how to create arrays that hold ordered lists of values and dictionaries that map keys to values. You will see both literal syntax and initializer methods, and how generics describe the element or key and value types. You will practice iterating with for in loops, using methods like map, filter, and reduce, and safely accessing elements with optional results. By the end you will know how to choose between arrays and dictionaries to model simple data sets in your apps.",
        duration: "55 min",
        difficulty: "Beginner",
        exercises: 6
      },
      {
        id: "sets",
        title: "Sets & Collection Operations",
        content:
          "Sets in Swift store unique values with no defined order, which makes them ideal for membership checks and mathematical style operations. In this topic you will create sets, add and remove elements, and check whether a given value is contained in the set. You will learn how to compute unions, intersections, and differences between sets to answer questions like which items are shared or unique. You will also compare performance and use cases of sets versus arrays when dealing with lookups. After this lesson you will recognize when sets are a better fit than lists and how to use them effectively.",
        duration: "45 min",
        difficulty: "Beginner",
        exercises: 5
      },
      {
        id: "functions",
        title: "Functions & Parameters",
        content:
          "Functions in Swift are very expressive, especially when it comes to parameter labels and default values. In this topic you will declare functions with clearly named parameters that read almost like natural language at the call site. You will see how external and internal parameter names can differ and why that improves readability. You will use default parameter values to simplify common calls while still allowing customization when needed. You will also get a first look at return types, including functions that return tuples. By the end you will be comfortable designing Swift functions that are both clear to call and easy to understand inside.",
        duration: "55 min",
        difficulty: "Beginner",
        exercises: 6
      },
      {
        id: "closures",
        title: "Closures Basics",
        content:
          "Closures in Swift are self-contained blocks of functionality that you can pass around and execute later. They are heavily used in APIs that operate on collections or handle asynchronous callbacks. In this topic you will write inline closures, see how Swift can infer parameter and return types, and learn the shorthand syntax for closure arguments. You will practice using closures with map, filter, sorted, and other higher order functions to transform and select data. You will also learn how closures capture values from their surrounding scope and what that means for memory and lifetimes. After this lesson you will have the foundation needed to understand many modern Swift APIs that are closure based.",
        duration: "60 min",
        difficulty: "Intermediate",
        exercises: 7
      }
    ],
    duration: "3.5 hours",
    exercises: 24,
    completed: false,
    codeExample: `// collections.swift
let scores = [72, 88, 95, 63]
let passed = scores.filter { $0 >= 70 }
print("Passed: \\(passed)")

let userAges: [String: Int] = ["Alice": 25, "Bob": 30]
if let age = userAges["Alice"] {
    print("Alice is \\(age)")
}`
  }
];


