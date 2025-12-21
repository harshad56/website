export type ScalaDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface ScalaTopic {
  id: string;
  title: string;
  content: string;
  duration: string;
  difficulty: ScalaDifficulty;
  exercises: number;
}

export interface ScalaModule {
  id: number;
  title: string;
  description: string;
  topics: ScalaTopic[];
  duration: string;
  exercises: number;
  completed: boolean;
  codeExample: string;
}

export const scalaModules: ScalaModule[] = [
  {
    id: 1,
    title: "Scala Basics & Hybrid Paradigm",
    description:
      "Discover Scala's blend of object-oriented and functional programming on top of the JVM.",
    topics: [
      {
        id: "scala-intro",
        title: "Why Scala? JVM Power with Expressiveness",
        content:
          "Scala is a modern language that combines object-oriented and functional programming in a single concise syntax. In this topic you will learn how Scala runs on the Java Virtual Machine, giving you access to the entire Java ecosystem while offering more expressive language features. We will explore where Scala is commonly used today: backend services, big data processing with Apache Spark, and distributed systems built with Akka.\n\nYou will set up a basic Scala toolchain using sbt or a simple build tool, run code from the REPL, and compile a small program. By the end of this lesson you will understand the advantages of Scala compared to plain Java and when teams choose it for real-world projects.",
        duration: "45 min",
        difficulty: "Beginner",
        exercises: 4
      },
      {
        id: "scala-syntax",
        title: "Syntax, Values, Variables & Types",
        content:
          "In this topic you will learn the core syntax of Scala: how to declare immutable values with val and mutable variables with var, how type inference works, and how expressions differ from statements. We will cover common primitive types, strings, and basic operations, all while emphasizing Scala's preference for immutability and expression-oriented code.\n\nYou will also get comfortable with defining simple methods, using blocks as expressions that return values, and reading type annotations when they are present. After working through examples you will be able to read and write basic Scala code and see how it improves on some of Java's verbosity.",
        duration: "55 min",
        difficulty: "Beginner",
        exercises: 6
      },
      {
        id: "scala-control",
        title: "Control Flow & Expressions",
        content:
          "Scala treats most constructs as expressions that evaluate to a value, which encourages a different style than imperative languages. In this topic you will learn how if/else, match expressions, and loops work. We will see how match provides powerful pattern matching that replaces many nested if/else chains.\n\nYou will practice rewriting traditional loops into more expression-based code using ranges, for-comprehensions, and collection methods. By the end of this lesson you will understand how to structure Scala code so that it is concise, side-effect aware, and easy to reason about.",
        duration: "60 min",
        difficulty: "Beginner",
        exercises: 7
      }
    ],
    duration: "3.2 hours",
    exercises: 17,
    completed: false,
    codeExample: `// HelloScala.scala

object HelloScala {
  def main(args: Array[String]): Unit = {
    val name        = "Scala learner"
    val visits: Int = 3

    val greeting =
      if (visits > 1) s"Welcome back, $name! Visit #$visits."
      else s"Welcome, $name! This is your first time here."

    println(greeting)

    for (i <- 1 to 3) {
      println(s"Iteration $i: Practicing Scala fundamentals.")
    }
  }
}`
  },
  {
    id: 2,
    title: "Collections, Functions & Immutability",
    description:
      "Work with Scala's rich collections library and embrace functions as first-class values.",
    topics: [
      {
        id: "scala-collections",
        title: "Immutable Collections",
        content:
          "Scala ships with a powerful standard library of immutable collections including List, Vector, Map, and Set. In this topic you will learn how immutable data structures differ from mutable ones and why they are often preferred in concurrent and functional code. You will practice using common combinators such as map, filter, flatMap, and fold to transform data step by step.\n\nWe will also look at how immutability works in practice: every transformation returns a new collection while leaving the original unchanged. After this lesson you will be able to confidently process lists and maps of data in a clear, composable style that is easy to test and reason about.",
        duration: "60 min",
        difficulty: "Intermediate",
        exercises: 7
      },
      {
        id: "scala-functions",
        title: "Functions, Lambdas & Higher-Order Methods",
        content:
          "In Scala, functions are first-class citizens. In this topic you will define named methods and anonymous function values, pass functions as parameters, and return them from other functions. We will explore common function types, how parameter lists and return types are written, and how syntactic sugar lets you write concise lambdas.\n\nYou will see how higher-order collection methods such as map and reduce take function arguments and apply them across an entire collection. By the end you will understand how functional programming ideas show up in day-to-day Scala code and how they help you express business logic in small, composable units.",
        duration: "65 min",
        difficulty: "Intermediate",
        exercises: 8
      },
      {
        id: "scala-options-either",
        title: "Option, Either & Safer Error Handling",
        content:
          "Instead of relying heavily on null and exceptions, Scala encourages using types like Option, Either, and Try to represent the presence or absence of values and possible failures. In this topic you will learn how to model optional data with Option, work with Some and None, and avoid null pointer errors. We will then explore Either for computations that can return either a successful result or an error value.\n\nThrough hands-on exercises you will practice chaining operations on these types using map and flatMap, and you will see how for-comprehensions can keep this style of code readable. By the end you will know how to express many error-handling scenarios in a type-safe, declarative way.",
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 6
      }
    ],
    duration: "3.6 hours",
    exercises: 21,
    completed: false,
    codeExample: `// CollectionsExample.scala

object CollectionsExample extends App {
  val scores = List(82, 95, 76, 90, 88)

  val passed = scores.filter(_ >= 80)
  val average = scores.sum.toDouble / scores.length

  println(s"Passed scores: $passed")
  println(f"Average score: $average%.1f")
}`
  },
  {
    id: 3,
    title: "Scala OOP, Case Classes & Concurrency",
    description:
      "Combine Scala's object model with pattern matching, case classes, and basic concurrency concepts.",
    topics: [
      {
        id: "scala-classes",
        title: "Classes, Objects & Traits",
        content:
          "Scala keeps familiar object-oriented concepts but makes them more flexible. In this topic you will define classes with constructor parameters, learn about companion objects, and use traits as powerful mixins for sharing behavior. We will see how traits differ from Java interfaces and how they can contain both abstract and concrete members.\n\nYou will practice designing small hierarchies using traits to capture capabilities instead of forcing deep inheritance trees. By the end you will be comfortable combining object-oriented and functional ideas to produce designs that are both modular and concise.",
        duration: "60 min",
        difficulty: "Intermediate",
        exercises: 7
      },
      {
        id: "scala-case-classes",
        title: "Case Classes & Pattern Matching",
        content:
          "Case classes are a signature Scala feature that make immutable data modeling extremely convenient. In this topic you will define case classes, see how they provide equals, hashCode, copy, and readable toString implementations automatically, and learn how they integrate with pattern matching. We will use match expressions to deconstruct case class instances and handle different variants of data in a clear way.\n\nYou will work through examples such as modeling user actions, API responses, or domain events, and handling them with pattern matches instead of large if/else blocks. By the end you will know how to represent complex data shapes in a way that plays nicely with the rest of the language.",
        duration: "65 min",
        difficulty: "Intermediate",
        exercises: 8
      },
      {
        id: "scala-concurrency",
        title: "Futures, Concurrency & Next Steps",
        content:
          "Scala provides multiple ways to work with concurrent and asynchronous code. In this high-level topic you will be introduced to Futures, which represent values that will be available later. You will see how to create Futures, register callbacks, and combine multiple asynchronous operations using for-comprehensions.\n\nWe will also briefly discuss libraries and frameworks such as Akka for actor-based concurrency and how they build on Scala's functional foundations. By the end of this lesson you will have the conceptual tools to start exploring concurrent Scala code and be prepared to dive deeper into frameworks commonly used in production.",
        duration: "55 min",
        difficulty: "Advanced",
        exercises: 6
      }
    ],
    duration: "3.5 hours",
    exercises: 21,
    completed: false,
    codeExample: `// CourseProgress.scala

final case class Course(title: String, completedLessons: Int, totalLessons: Int) {
  def progressPercentage: Double =
    if (totalLessons == 0) 0.0
    else completedLessons.toDouble / totalLessons * 100.0

  def summary: String =
    f"$title: \${progressPercentage}%.1f%% complete"
}

object CourseProgress extends App {
  val scalaCourse = Course("Scala Fundamentals", completedLessons = 5, totalLessons = 12)
  println(scalaCourse.summary)
}`
  }
];



