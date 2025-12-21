export type DartDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface DartTopic {
  id: string;
  title: string;
  content: string;
  duration: string;
  difficulty: DartDifficulty;
  exercises: number;
}

export interface DartModule {
  id: number;
  title: string;
  description: string;
  topics: DartTopic[];
  duration: string;
  exercises: number;
  completed: boolean;
  codeExample: string;
}

export const dartModules: DartModule[] = [
  {
    id: 1,
    title: "Dart Fundamentals",
    description:
      "Learn the core syntax, types, and control flow of the Dart language used by Flutter.",
    topics: [
      {
        id: "dart-intro",
        title: "Introduction to Dart",
        content:
          "Dart is a modern, object-oriented language developed by Google, primarily known as the language behind Flutter for cross-platform mobile, web, and desktop development. In this topic you will learn about Dart's history, its design goals of being easy to learn while remaining powerful, and how it compiles to native code or JavaScript. You will set up the Dart SDK, run your first program from the command line, and explore the DartPad online editor for quick experimentation.\n\nBy the end of this lesson you will understand why Dart was created, how it fits into the Flutter ecosystem, and how to write and execute simple Dart scripts.",
        duration: "40 min",
        difficulty: "Beginner",
        exercises: 4
      },
      {
        id: "dart-variables",
        title: "Variables & Data Types",
        content:
          "Dart is a statically typed language with type inference, meaning you can let the compiler figure out types or declare them explicitly. In this topic you will work with fundamental types such as int, double, String, bool, and dynamic. You will learn the difference between var, final, and const for variable declarations and when to use each.\n\nYou will also explore Dart's null safety features, understanding how nullable and non-nullable types help you avoid null reference errors at compile time. By the end you will be comfortable declaring variables, using type annotations, and leveraging Dart's sound null safety.",
        duration: "50 min",
        difficulty: "Beginner",
        exercises: 5
      },
      {
        id: "dart-control-flow",
        title: "Control Flow & Operators",
        content:
          "Control flow in Dart includes familiar constructs like if-else, switch, for, while, and do-while loops. In this topic you will practice writing conditional logic and iterating over ranges and collections. You will learn about Dart's operators including arithmetic, relational, logical, and the cascade operator (..) for chaining method calls.\n\nYou will also see how Dart's switch statement works with enums and how to use assert for debugging. By the end you will be able to write clear, readable control flow logic in Dart programs.",
        duration: "45 min",
        difficulty: "Beginner",
        exercises: 5
      },
      {
        id: "dart-functions",
        title: "Functions & Closures",
        content:
          "Functions are first-class citizens in Dart, meaning you can assign them to variables, pass them as arguments, and return them from other functions. In this topic you will define functions with positional, named, and optional parameters. You will learn about arrow syntax for concise one-expression functions and how to use anonymous functions (lambdas) for callbacks.\n\nYou will also explore closures and how they capture variables from their surrounding scope. By the end you will be comfortable writing reusable functions and using higher-order functions effectively.",
        duration: "55 min",
        difficulty: "Beginner",
        exercises: 6
      }
    ],
    duration: "3.2 hours",
    exercises: 20,
    completed: false,
    codeExample: `// Dart Fundamentals Example
void main() {
  // Variables and types
  String courseName = "Dart Fundamentals";
  int lessons = 12;
  double progress = 0.75;
  bool isCompleted = false;
  
  // Null safety
  String? nickname;
  nickname = "Learner";
  
  // Control flow
  if (progress >= 0.5) {
    print("You're halfway through $courseName!");
  }
  
  // Functions
  String greet(String name) => "Welcome, $name!";
  print(greet(nickname));
  
  // List and iteration
  var topics = ["Variables", "Control Flow", "Functions"];
  for (var topic in topics) {
    print("Topic: $topic");
  }
}`
  },
  {
    id: 2,
    title: "Collections & Object-Oriented Programming",
    description:
      "Master Dart's collection types and build robust applications with classes and objects.",
    topics: [
      {
        id: "dart-collections",
        title: "Lists, Sets & Maps",
        content:
          "Dart provides three core collection types: List (ordered, indexed), Set (unordered, unique elements), and Map (key-value pairs). In this topic you will create, modify, and iterate over each collection type. You will learn about collection literals, spread operators, and collection-if/for for building collections conditionally.\n\nYou will also explore common methods like map, where, reduce, and fold for transforming and aggregating data. By the end you will be able to choose the right collection for your use case and manipulate data efficiently.",
        duration: "55 min",
        difficulty: "Beginner",
        exercises: 6
      },
      {
        id: "dart-classes",
        title: "Classes & Objects",
        content:
          "Dart is a purely object-oriented language where everything is an object. In this topic you will define classes with constructors, instance variables, and methods. You will learn about named constructors, factory constructors, and initializer lists for flexible object creation.\n\nYou will also explore getters, setters, and computed properties for encapsulating data. By the end you will be comfortable designing classes that model real-world entities and behaviors.",
        duration: "60 min",
        difficulty: "Intermediate",
        exercises: 7
      },
      {
        id: "dart-inheritance",
        title: "Inheritance & Mixins",
        content:
          "Dart supports single inheritance with the extends keyword and code reuse through mixins. In this topic you will create class hierarchies, override methods, and use the super keyword to call parent implementations. You will learn how mixins differ from inheritance and when to use each approach.\n\nYou will also explore abstract classes for defining contracts and the implements keyword for interface-like behavior. By the end you will understand how to structure code for maximum reuse and flexibility.",
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 6
      },
      {
        id: "dart-generics",
        title: "Generics",
        content:
          "Generics allow you to write type-safe, reusable code that works with multiple types. In this topic you will create generic classes, methods, and functions. You will learn about type constraints using extends and how generics interact with Dart's type system.\n\nYou will see practical examples like building a generic cache, a result wrapper, and type-safe collections. By the end you will be able to design flexible APIs that maintain type safety.",
        duration: "50 min",
        difficulty: "Intermediate",
        exercises: 6
      }
    ],
    duration: "3.7 hours",
    exercises: 25,
    completed: false,
    codeExample: `// Collections and OOP Example
class Course {
  final String title;
  final int lessons;
  int _completedLessons = 0;
  
  Course(this.title, this.lessons);
  
  // Named constructor
  Course.beginner(String title) : this(title, 10);
  
  // Getter
  double get progress => _completedLessons / lessons;
  
  // Method
  void completeLesson() {
    if (_completedLessons < lessons) {
      _completedLessons++;
      print("Completed lesson $_completedLessons of $lessons");
    }
  }
}

// Mixin example
mixin Printable {
  void printInfo();
}

class DartCourse extends Course with Printable {
  DartCourse(String title, int lessons) : super(title, lessons);
  
  @override
  void printInfo() {
    print("$title: \${(progress * 100).toStringAsFixed(1)}% complete");
  }
}

void main() {
  var course = DartCourse("Dart Basics", 12);
  course.completeLesson();
  course.completeLesson();
  course.printInfo();
  
  // Collections
  var scores = <int>[85, 92, 78, 95];
  var average = scores.reduce((a, b) => a + b) / scores.length;
  print("Average score: \${average.toStringAsFixed(1)}");
}`
  },
  {
    id: 3,
    title: "Asynchronous Programming",
    description:
      "Handle async operations with Futures, Streams, and async/await patterns.",
    topics: [
      {
        id: "dart-futures",
        title: "Futures & Async/Await",
        content:
          "Dart uses Futures to represent values that will be available in the future, such as data from a network request or file read. In this topic you will create and consume Futures using then/catchError and the cleaner async/await syntax. You will learn how to handle errors with try-catch in async functions.\n\nYou will also explore Future.wait for running multiple async operations in parallel and Future.delayed for simulating delays. By the end you will be comfortable writing non-blocking code that handles asynchronous operations gracefully.",
        duration: "60 min",
        difficulty: "Intermediate",
        exercises: 7
      },
      {
        id: "dart-streams",
        title: "Streams & Stream Controllers",
        content:
          "Streams represent a sequence of asynchronous events, like data arriving over time from a WebSocket or user input events. In this topic you will consume streams using listen, await for, and stream transformers. You will create your own streams using StreamController and understand the difference between single-subscription and broadcast streams.\n\nYou will also learn about stream methods like map, where, and take for transforming stream data. By the end you will be able to build reactive applications that respond to data as it arrives.",
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 6
      },
      {
        id: "dart-isolates",
        title: "Isolates & Concurrency",
        content:
          "Dart uses isolates for true parallelism, where each isolate has its own memory heap and communicates via message passing. In this topic you will understand why Dart chose isolates over shared-memory threads and when to use them. You will spawn isolates, send and receive messages, and use the compute function for simple parallel tasks.\n\nYou will also learn about the event loop and how Dart schedules microtasks and events. By the end you will understand Dart's concurrency model and how to offload heavy computation.",
        duration: "50 min",
        difficulty: "Advanced",
        exercises: 5
      },
      {
        id: "dart-error-handling",
        title: "Error Handling Patterns",
        content:
          "Robust applications need comprehensive error handling. In this topic you will work with Dart's exception system, throwing and catching exceptions, and creating custom exception classes. You will learn patterns for handling errors in async code and how to use the Result pattern for explicit error handling.\n\nYou will also explore assertions for development-time checks and how to structure error handling across your application. By the end you will be able to write resilient code that handles failures gracefully.",
        duration: "45 min",
        difficulty: "Intermediate",
        exercises: 5
      }
    ],
    duration: "3.5 hours",
    exercises: 23,
    completed: false,
    codeExample: `// Async Programming Example
import 'dart:async';

Future<String> fetchUserData(int userId) async {
  // Simulate network delay
  await Future.delayed(Duration(seconds: 1));
  return "User $userId: Dart Developer";
}

Stream<int> countDown(int from) async* {
  for (var i = from; i >= 0; i--) {
    await Future.delayed(Duration(milliseconds: 500));
    yield i;
  }
}

void main() async {
  print("Fetching user data...");
  
  try {
    var userData = await fetchUserData(42);
    print(userData);
  } catch (e) {
    print("Error: $e");
  }
  
  // Stream example
  print("\\nCountdown:");
  await for (var count in countDown(5)) {
    print(count);
  }
  print("Liftoff!");
  
  // Parallel futures
  var results = await Future.wait([
    fetchUserData(1),
    fetchUserData(2),
    fetchUserData(3),
  ]);
  print("\\nAll users: $results");
}`
  },
  {
    id: 4,
    title: "Flutter Foundations",
    description:
      "Apply Dart skills to build beautiful cross-platform apps with Flutter.",
    topics: [
      {
        id: "dart-flutter-intro",
        title: "Flutter & Widget Basics",
        content:
          "Flutter is Google's UI toolkit for building natively compiled applications from a single codebase. In this topic you will understand Flutter's architecture, the widget tree, and how everything in Flutter is a widget. You will learn the difference between StatelessWidget and StatefulWidget and when to use each.\n\nYou will set up a Flutter project, explore the project structure, and build your first simple UI. By the end you will understand how Flutter renders UI and how Dart code translates to beautiful interfaces.",
        duration: "60 min",
        difficulty: "Intermediate",
        exercises: 6
      },
      {
        id: "dart-flutter-state",
        title: "State Management Basics",
        content:
          "Managing state is crucial in Flutter applications. In this topic you will start with setState for local state, then explore InheritedWidget for sharing state down the widget tree. You will understand the concept of lifting state up and how to structure your app for maintainability.\n\nYou will also get an overview of popular state management solutions like Provider, Riverpod, and Bloc. By the end you will be able to choose appropriate state management strategies for different scenarios.",
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 6
      },
      {
        id: "dart-flutter-navigation",
        title: "Navigation & Routing",
        content:
          "Flutter apps often have multiple screens that users navigate between. In this topic you will learn about Navigator 1.0 with push/pop operations and named routes. You will pass data between screens and handle the back button properly.\n\nYou will also explore Navigator 2.0 for more complex routing needs and deep linking. By the end you will be able to implement intuitive navigation flows in your Flutter apps.",
        duration: "50 min",
        difficulty: "Intermediate",
        exercises: 5
      },
      {
        id: "dart-flutter-http",
        title: "HTTP & JSON",
        content:
          "Most apps need to communicate with backend services. In this topic you will use the http package to make GET, POST, PUT, and DELETE requests. You will parse JSON responses into Dart objects using manual parsing and code generation with json_serializable.\n\nYou will also handle loading states, errors, and display data in your UI. By the end you will be able to build Flutter apps that consume REST APIs and display dynamic data.",
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 6
      }
    ],
    duration: "3.7 hours",
    exercises: 23,
    completed: false,
    codeExample: `// Flutter Widget Example (conceptual)
import 'package:flutter/material.dart';

class CourseCard extends StatelessWidget {
  final String title;
  final double progress;
  final VoidCallback onTap;
  
  const CourseCard({
    Key? key,
    required this.title,
    required this.progress,
    required this.onTap,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: Theme.of(context).textTheme.headline6,
              ),
              SizedBox(height: 8),
              LinearProgressIndicator(value: progress),
              SizedBox(height: 4),
              Text("\${(progress * 100).toInt()}% complete"),
            ],
          ),
        ),
      ),
    );
  }
}`
  }
];




