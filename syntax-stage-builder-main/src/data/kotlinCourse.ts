export type KotlinDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface KotlinTopic {
  id: string;
  title: string;
  content: string;
  duration: string;
  difficulty: KotlinDifficulty;
  exercises: number;
}

export interface KotlinModule {
  id: number;
  title: string;
  description: string;
  topics: KotlinTopic[];
  duration: string;
  exercises: number;
  completed: boolean;
  codeExample: string;
}

export const kotlinModules: KotlinModule[] = [
  {
    id: 1,
    title: "Kotlin Fundamentals",
    description: "Start building Android and backend apps with modern Kotlin syntax.",
    topics: [
      {
        id: "kotlin-intro",
        title: "Introduction to Kotlin",
        content:
          "Kotlin is a modern, concise language that runs on the Java Virtual Machine and is officially supported for Android development. In this topic you will learn why Google and many companies have adopted Kotlin as their primary language for mobile apps. You will see how Kotlin improves on Java with null safety, data classes, extension functions, and coroutines while still interoperating seamlessly with existing Java libraries. You will also hear about Kotlin Multiplatform and how it allows sharing business logic across Android, iOS, and other platforms. By the end you should understand where Kotlin fits in the ecosystem and why it is a strong choice for new JVM based projects.",
        duration: "35 min",
        difficulty: "Beginner",
        exercises: 4
      },
      {
        id: "variables-null-safety",
        title: "Variables & Null Safety",
        content:
          "Kotlin's approach to variables and null safety helps you avoid many common runtime crashes. In this topic you will use val for read only references and var for mutable ones, understanding why immutability is often preferred. You will see how Kotlin infers types from initializers so you rarely need to write them explicitly. Most importantly, you will work with nullable and non nullable types and learn how the compiler forces you to handle the absence of a value. You will practice using safe call operators, the Elvis operator, and explicit null checks to keep your code both safe and readable. After this lesson you will feel more confident that your Kotlin code will not crash unexpectedly due to null pointer exceptions.",
        duration: "45 min",
        difficulty: "Beginner",
        exercises: 6
      },
      {
        id: "control-flow",
        title: "Control Flow & When",
        content:
          "Kotlin offers familiar control flow constructs but adds an expressive when expression that often replaces traditional switch statements. In this topic you will write if and else chains to handle simple decisions and combine conditions with logical operators. You will use while, do while, and for loops to iterate over ranges and collections. You will explore when both as a statement and as an expression that returns values, matching on values, types, and ranges. You will also see how Kotlin encourages early returns and expression based style to keep code short and clear. By the end you will be able to express complex branching in Kotlin without deeply nested code.",
        duration: "50 min",
        difficulty: "Beginner",
        exercises: 6
      },
      {
        id: "functions-basics",
        title: "Functions & Lambdas",
        content:
          "Functions and lambdas are central to Kotlin's expressive style. In this topic you will define top level and member functions with clear parameter lists and return types. You will use default parameter values and named arguments so calls remain readable even with many parameters. You will create simple lambda expressions and pass them into higher order functions on collections, such as filter, map, and forEach. You will also see how Kotlin treats functions as first class values and how that enables powerful yet concise APIs. After this topic you will be comfortable using and creating small functional style utilities in Kotlin.",
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 7
      }
    ],
    duration: "3.1 hours",
    exercises: 23,
    completed: false,
      codeExample: `// kotlin-fundamentals.kt
fun main() {
    val course = "Kotlin Fundamentals"
    var completedModules = 2

    println("Welcome to $course")

    // Null safety
    var nickname: String? = null
    println("Nickname length: \${nickname?.length ?: 0}")

    // When expression
    val score = 82
    val grade = when (score) {
        in 90..100 -> "A"
        in 80..89 -> "B"
        in 70..79 -> "C"
        else -> "Keep practicing"
    }
    println("Grade: $grade")
}`
  },
  {
    id: 2,
    title: "Classes & Data Classes",
    description: "Model real-world entities with concise Kotlin classes.",
    topics: [
      {
        id: "classes",
        title: "Classes & Constructors",
        content:
          "Kotlin classes are designed to be concise while still very powerful. In this topic you will create classes with primary constructors that declare properties directly in the class header. You will explore secondary constructors for alternative initialization paths and see when they are useful. You will prefer val properties for immutability and use var only when actual mutation is needed. You will also examine initializer blocks and how they relate to constructor parameters. By the end you will know how to design simple Kotlin classes that clearly express their required data and invariants.",
        duration: "55 min",
        difficulty: "Beginner",
        exercises: 6
      },
      {
        id: "data-classes",
        title: "Data Classes",
        content:
          "Many domains need simple data carriers that mostly hold values and have little behavior. Kotlin data classes are built for this case. In this topic you will declare data classes and see how the compiler automatically generates equals, hashCode, toString, and copy implementations based on constructor properties. You will learn when it is appropriate to use data classes and how they pair nicely with immutable collections. You will also experiment with destructuring declarations to pull fields out of data class instances in a single line. After this lesson your code that models plain data will become much shorter and easier to work with.",
        duration: "50 min",
        difficulty: "Intermediate",
        exercises: 6
      },
      {
        id: "inheritance",
        title: "Inheritance & Interfaces",
        content:
          "Kotlin takes a careful approach to inheritance: classes are final by default and must be marked open to be extended. In this topic you will create class hierarchies by marking base classes as open and overriding methods in subclasses. You will define abstract classes that provide partial implementations and require subclasses to fill in the rest. You will implement interfaces to describe capabilities that multiple unrelated classes can share. You will also learn how Kotlin handles multiple inheritance of behavior via default interface methods. By the end you will be able to model polymorphic behavior in Kotlin in a controlled and explicit way.",
        duration: "60 min",
        difficulty: "Intermediate",
        exercises: 7
      },
      {
        id: "sealed",
        title: "Sealed Classes",
        content:
          "Sealed classes are a powerful way to model closed sets of related types, such as the possible states of a screen or the different results of an operation. In this topic you will define sealed class hierarchies with subclasses that represent specific cases. You will use when expressions to handle each subclass, and see how the compiler can check that you have covered all possibilities. You will compare sealed classes to enums and understand when each is more appropriate. After this topic you will be able to use sealed classes to write more robust, expression based state handling logic in your Kotlin apps.",
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 7
      }
    ],
    duration: "3.6 hours",
    exercises: 26,
    completed: false,
      codeExample: `// models.kt
data class Lesson(val title: String, val completed: Boolean)

sealed class Result {
    data class Success(val data: String): Result()
    data class Error(val message: String): Result()
    object Loading: Result()
}

fun handle(result: Result) = when (result) {
    is Result.Success -> println("Loaded: \${result.data}")
    is Result.Error -> println("Error: \${result.message}")
    Result.Loading -> println("Loading...")
}`
  }
];


