export type GoDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface GoTopic {
  id: string;
  title: string;
  content: string;
  duration: string;
  difficulty: GoDifficulty;
  exercises: number;
}

export interface GoModule {
  id: number;
  title: string;
  description: string;
  topics: GoTopic[];
  duration: string;
  exercises: number;
  completed: boolean;
  codeExample: string;
}

export const goModules: GoModule[] = [
  {
    id: 1,
    title: "Go Fundamentals",
    description: "Master the basics of Go programming language",
    topics: [
      {
        id: "go-intro",
        title: "Introduction to Go",
        content: `Go (often called Golang) is a compiled language created at Google to make building networked and concurrent services simpler and more reliable.

In this topic you'll:
- Learn the story behind Go's design: fast compilation, simple syntax, and great tooling for large codebases.
- See where Go is used in the real world: cloud‑native microservices, CLIs, DevOps tools (Docker, Kubernetes), and high‑performance backends.
- Understand how Go binaries are **statically linked**, producing a single executable that's very easy to deploy.
- Get a high‑level tour of the Go toolchain: \`go run\`, \`go build\`, \`go test\`, and modern **Go modules** instead of the old GOPATH‑only workflow.
- Compare Go to languages like Java, Node.js, and Python in terms of performance, deployment, and concurrency model.

After this lesson you should be able to explain to a beginner what problems Go was built to solve and why it became the default choice for many cloud and infrastructure teams.`,
        duration: "35 min",
        difficulty: "Beginner",
        exercises: 4
      },
      {
        id: "go-syntax",
        title: "Go Syntax & Structure",
        content: `Go keeps its syntax deliberately small and opinionated so that all Go code tends to look similar, no matter who wrote it.

Key ideas in this topic:
- Every executable program starts in the **\`main\` package** with a **\`main()\` function**; all other code lives in packages you create.
- How **\`import\`** works, and the convention of grouping standard library imports separately from third‑party modules.
- Declaring functions with the \`func\` keyword, specifying parameter types and return types, and returning multiple values.
- The importance of **brace style** in Go (\`if cond {\`), and how \`gofmt\` enforces a single canonical formatting style.
- Using the Go workspace layout: where source files go, how the module name in \`go.mod\` relates to import paths, and how to run a multi‑file project.

You’ll walk through a small example project with a few helper functions to see how Go source files, packages, and the entry point fit together.`,
        duration: "40 min",
        difficulty: "Beginner",
        exercises: 5
      },
      {
        id: "variables-types",
        title: "Variables & Data Types",
        content: `Go has a static type system designed to catch many errors at compile time while still staying convenient through type inference.

In this topic you'll:
- Learn the basic built‑in types: **booleans**, numeric types (\`int\`, \`int64\`, \`float64\`), **strings**, and the **\`rune\`** type for Unicode characters.
- Understand **zero values** — every variable always has a defined starting value such as \`0\`, \`""\`, or \`nil\`, which helps avoid "uninitialized variable" bugs.
- Declare variables using both \`var\` and the short declaration \`:=\`, and learn when each form is idiomatic.
- See how Go does **type inference** from the right‑hand side, yet still enforces strict type safety (e.g. no implicit int–float mixing).
- Get a preview of composite types like arrays, slices, maps, and structs, so you know which building blocks to use when modeling data.

You'll practice declaring and printing variables for configuration, counters, and messages using \`fmt.Printf\` with format specifiers.`,
        duration: "45 min",
        difficulty: "Beginner",
        exercises: 6
      },
      {
        id: "operators-expressions",
        title: "Operators & Expressions",
        content: `Go's operators look familiar if you know C‑style languages, but Go enforces some strict rules that prevent subtle bugs.

In this topic you'll:
- Use arithmetic operators and see how Go **does not perform implicit numeric widening**, forcing you to convert between types explicitly.
- Work with comparison operators on numbers, strings, and booleans, and learn when comparisons are allowed or forbidden.
- Combine conditions with logical operators \`&&\`, \`||\`, and \`!\` and see how **short‑circuiting** operates in chained if conditions.
- Explore assignment operators like \`+=\`, \`-=\`, and \`*=\` in the context of loops and counters.
- Understand operator precedence and best practice of adding parentheses when it clarifies intent for future readers.

By the end you'll feel comfortable writing clear conditional logic and arithmetic expressions that the Go compiler can reason about safely.`,
        duration: "40 min",
        difficulty: "Beginner",
        exercises: 5
      }
    ],
    duration: "2.7 hours",
    exercises: 20,
    completed: false,
    codeExample: `package main

import "fmt"

// Your first Go program
func main() {
    fmt.Println("Hello, World!")
    
    // Variables and data types
    var name string = "Alice"
    age := 25  // Short variable declaration
    var height float64 = 5.6
    isStudent := true
    
    // Basic operations
    result := 10 + 5*2
    fmt.Printf("Result: %d\\n", result)
    
    // String formatting
    message := fmt.Sprintf("Welcome, %s! You are %d years old.", name, age)
    fmt.Println(message)
    
    // Type conversion
    ageFloat := float64(age)
    ageInt := int(ageFloat)
    fmt.Printf("Age as float: %.1f, as int: %d\\n", ageFloat, ageInt)
    
    // Conditional statement
    if age >= 18 {
        fmt.Println("You are an adult")
    } else {
        fmt.Println("You are a minor")
    }
    
    // Multiple conditions
    if age < 13 {
        fmt.Println("Child")
    } else if age < 20 {
        fmt.Println("Teenager")
    } else {
        fmt.Println("Adult")
    }
}`
  },
  {
    id: 2,
    title: "Control Flow & Functions",
    description: "Master conditional statements, loops, and function creation",
    topics: [
      {
        id: "conditionals",
        title: "Conditional Statements",
        content:
          `Branching logic in Go is primarily expressed with if, else, and switch. Go keeps these constructs small and consistent so they are easy to read.

In this topic you will:
- Write simple if, else if, and else chains to validate inputs, guard against invalid states, and choose between code paths.
- Use switch with and without an explicit value to match on many cases, including ranges and conditions, in a compact way.
- See how Go's switch differs from C-style switch (for example, automatic break and support for multiple values per case).
- Learn patterns like early returns and guard clauses that keep your conditional logic shallow and readable.

By the end you will be able to express common decision logic clearly using Go's idiomatic conditional constructs.`,
        duration: "50 min",
        difficulty: "Beginner",
        exercises: 6
      },
      {
        id: "loops",
        title: "Loops & Iteration",
        content:
          `Go has a single loop keyword, for, but it can be used in several different forms to cover all common looping scenarios.

In this topic you will:
- Use the three-part for loop (initialization; condition; post) for classic counter-based loops.
- Write while-style loops using for with only a condition, which is useful when reading from streams or waiting on states.
- Iterate over slices, arrays, maps, and strings using for range, getting both index and value when needed.
- Learn how break and continue shape loop flow, and how labels can control nested loops when absolutely necessary.

You will refactor repetitive code into for loops, iterate over collections, and understand how Go's single loop construct replaces many loop forms from other languages.`,
        duration: "55 min",
        difficulty: "Beginner",
        exercises: 7
      },
      {
        id: "functions-basic",
        title: "Function Basics",
        content:
          `Functions are first-class citizens in Go and are used extensively to organize logic and manage errors.

In this topic you will:
- Declare functions with parameters and return types, following Go's convention of placing the type after the name.
- Call functions and handle returned values, seeing how Go encourages explicit error handling instead of exceptions.
- Use multiple return values to return both results and errors, which is a core idiom in Go code.
- Understand scope rules for variables declared inside and outside of functions.

By the end you will be comfortable writing and calling simple functions that encapsulate small units of behavior and integrate with Go's error-first style.`,
        duration: "60 min",
        difficulty: "Beginner",
        exercises: 8
      },
      {
        id: "functions-advanced",
        title: "Advanced Functions",
        content:
          `Beyond basic functions, Go offers powerful features like variadic parameters, function types, closures, and defer.

In this topic you will:
- Write variadic functions that accept a flexible number of arguments, such as functions that sum or log multiple values.
- Treat functions as values: assign them to variables, pass them as arguments, and return them from other functions.
- Use closures that capture surrounding variables, enabling patterns like configurable handlers and simple dependency injection.
- Understand defer for scheduling cleanup work (closing files, unlocking mutexes) that runs when a function returns.

You will build small utilities using these advanced features and see how they simplify resource management and callback-style logic in Go.`,
        duration: "65 min",
        difficulty: "Intermediate",
        exercises: 8
      }
    ],
    duration: "3.8 hours",
    exercises: 29,
    completed: false,
    codeExample: `package main

import "fmt"

func main() {
    // Conditional statements
    age := 18
    if age >= 18 {
        fmt.Println("You can vote")
    } else if age >= 16 {
        fmt.Println("You can drive")
    } else {
        fmt.Println("You're too young")
    }
    
    // Switch statement
    day := "Monday"
    switch day {
    case "Monday":
        fmt.Println("Start of the week")
    case "Friday":
        fmt.Println("Weekend is coming!")
    default:
        fmt.Println("Regular day")
    }
    
    // Switch without condition
    switch {
    case age < 13:
        fmt.Println("Child")
    case age < 20:
        fmt.Println("Teenager")
    default:
        fmt.Println("Adult")
    }
    
    // For loop (traditional)
    for i := 0; i < 5; i++ {
        fmt.Printf("Count: %d\\n", i)
    }
    
    // For loop (while style)
    count := 0
    for count < 5 {
        fmt.Println(count)
        count++
    }
    
    // Range loop
    fruits := []string{"apple", "banana", "orange"}
    for index, fruit := range fruits {
        fmt.Printf("%d: %s\\n", index, fruit)
    }
    
    // Function call
    result := add(5, 3)
    fmt.Printf("Sum: %d\\n", result)
    
    // Multiple return values
    quotient, remainder := divide(10, 3)
    fmt.Printf("Quotient: %d, Remainder: %d\\n", quotient, remainder)
    
    // Variadic function
    sum := addAll(1, 2, 3, 4, 5)
    fmt.Printf("Sum: %d\\n", sum)
    
    // Defer statement
    deferExample()
}

// Function definition
func add(a, b int) int {
    return a + b
}

// Multiple return values
func divide(a, b int) (int, int) {
    return a / b, a % b
}

// Named return values
func calculate(a, b int) (sum, product int) {
    sum = a + b
    product = a * b
    return
}

// Variadic function
func addAll(numbers ...int) int {
    total := 0
    for _, num := range numbers {
        total += num
    }
    return total
}

// Defer example
func deferExample() {
    defer fmt.Println("This runs last")
    fmt.Println("This runs first")
    fmt.Println("This runs second")
}`
  },
  {
    id: 3,
    title: "Data Structures",
    description: "Work with slices, maps, structs, and pointers",
    topics: [
      {
        id: "arrays-slices",
        title: "Arrays & Slices",
        content:
          `Arrays and slices are core data structures in Go. Arrays have fixed length, while slices provide a powerful, dynamic view over arrays.

In this topic you will:
- Declare fixed-length arrays and understand how their size is part of the type.
- Create and grow slices using literals, slicing operations, and the make function while reasoning about length and capacity.
- Use slicing expressions to share underlying data between slices and understand when modifications affect multiple views.
- Perform common operations like appending, copying, and trimming data from slices.

By the end you will know when to use arrays directly and when slices are the better choice for flexible, idiomatic Go collections.`,
        duration: "65 min",
        difficulty: "Beginner",
        exercises: 8
      },
      {
        id: "maps",
        title: "Maps",
        content: `Maps in Go are hash tables that associate keys with values, giving you fast lookups and updates for many everyday tasks.

In this topic you will:
- Declare and initialize maps with make and with map literals.
- Insert, update, and delete entries, and check whether a key exists using the value, ok pattern.
- Iterate over maps with for range, noting that iteration order is not guaranteed and why that matters.
- Discuss common use cases such as counting occurrences, indexing by ID, and implementing simple caches.

By the end you will feel comfortable modeling key based lookups and aggregations using Go maps.`,
        duration: "60 min",
        difficulty: "Beginner",
        exercises: 7
      },
      {
        id: "structs",
        title: "Structs",
        content:
          `Structs are Go's way of defining custom record types that bundle related fields together. They are the building blocks for most domain models in Go programs.

In this topic you will:
- Declare simple structs to represent entities like users, products, or configuration values.
- Initialize structs with composite literals and update fields after creation.
- Embed one struct inside another to achieve a form of composition and reuse without inheritance.
- Define methods on struct types using value and pointer receivers, and decide which receiver type is appropriate.

You will design a small set of related structs and methods to represent a domain, then use those types from a main function or other packages.`,
        duration: "70 min",
        difficulty: "Intermediate",
        exercises: 8
      },
      {
        id: "pointers",
        title: "Pointers",
        content:
          `Pointers in Go let you refer to the memory address of a value, which is essential for sharing and modifying data efficiently without copying.

In this topic you will:
- Learn how to obtain a pointer to a value using the & operator and how to dereference it with *.
- Understand when Go passes values by copy and when you need pointers to modify data inside functions.
- See how pointers interact with structs and slices, and why pointer receivers are often used for methods that mutate state.
- Discuss safety: Go does not have pointer arithmetic like C, which greatly reduces the risk of certain classes of bugs.

By the end you will be able to use pointers confidently to share and update data without introducing confusing aliasing or unsafe memory access.`,
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 6
      }
    ],
    duration: "4.2 hours",
    exercises: 29,
    completed: false,
    codeExample: `package main

import "fmt"

func main() {
    // Arrays (fixed size)
    var numbers [5]int
    numbers[0] = 1
    numbers[1] = 2
    
    // Array literal
    primes := [5]int{2, 3, 5, 7, 11}
    
    // Slices (dynamic)
    fruits := []string{"apple", "banana", "orange"}
    fruits = append(fruits, "grape")
    
    // Slice operations
    nums := []int{1, 2, 3, 4, 5}
    fmt.Println(nums[1:3])  // [2, 3]
    fmt.Println(nums[:3])   // [1, 2, 3]
    fmt.Println(nums[2:])   // [3, 4, 5]
    
    // Make slice
    slice := make([]int, 5)      // length 5
    slice2 := make([]int, 5, 10) // length 5, capacity 10
    fmt.Println(slice, slice2)
    
    // Maps
    ages := make(map[string]int)
    ages["Alice"] = 25
    ages["Bob"] = 30
    
    // Map literal
    scores := map[string]int{
        "Alice": 95,
        "Bob":   87,
        "Charlie": 92,
    }
    
    // Map operations
    value, exists := ages["Alice"]
    if exists {
        fmt.Printf("Alice is %d years old\\n", value)
    }
    
    delete(ages, "Bob")
    
    // Iterating maps
    for name, age := range ages {
        fmt.Printf("%s: %d\\n", name, age)
    }
}
`
  },
  {
    id: 4,
    title: "Interfaces & Methods",
    description: "Learn interfaces, method sets, and type assertions",
    topics: [
      {
        id: "interfaces",
        title: "Interfaces",
        content:
          `Interfaces in Go describe behavior through method sets. Any type that implements the required methods automatically satisfies the interface, with no explicit declaration.

In this topic you will:
- Declare simple interfaces that represent capabilities, such as types that can be written to or closed.
- Implement interfaces on your own types by defining the appropriate methods without tagging them explicitly.
- Use interfaces as function parameters and return types to accept a wide range of concrete implementations.
- Understand how small, focused interfaces lead to flexible and testable designs.

You will refactor functions to depend on interfaces instead of concrete types and see how this makes your code easier to extend and mock.`,
        duration: "70 min",
        difficulty: "Intermediate",
        exercises: 8
      },
      {
        id: "methods",
        title: "Methods & Receivers",
        content:
          `Methods in Go are functions with a special receiver parameter that lets you associate behavior with types.

In this topic you will:
- Define methods with value receivers and see how they work on copies of values.
- Define methods with pointer receivers when you need to modify the receiver or avoid copying large structs.
- Learn how the choice of receiver affects which interfaces a type implements.
- Understand method sets and how they influence method calls through values versus pointers.

By the end you will be comfortable attaching meaningful behavior to your types and choosing receiver types that match your design goals.`,
        duration: "65 min",
        difficulty: "Intermediate",
        exercises: 7
      },
      {
        id: "type-assertions",
        title: "Type Assertions & Type Switches",
        content:
          `Type assertions and type switches let you work with concrete types behind interface values when necessary.

In this topic you will:
- Use single-value and two-value type assertions to safely retrieve the underlying concrete type from an interface.
- Write type switches that handle multiple possible concrete types in a clear, centralized way.
- Understand when it is appropriate to rely on specific concrete types and when it is better to stay abstract.
- See how these tools are used to implement generic-like behavior prior to language level generics.

You will practice writing small utilities that accept interface values and then branch on their concrete types when needed.`,
        duration: "60 min",
        difficulty: "Intermediate",
        exercises: 6
      },
      {
        id: "empty-interface",
        title: "Empty Interface & Reflection",
        content:
          `The empty interface in Go can hold values of any type, which can be powerful but must be used carefully. Reflection lets you inspect and manipulate values at runtime.

In this topic you will:
- Work with the empty interface to accept arbitrary values in functions and data structures.
- Use type assertions and type switches to recover concrete types from empty interface values.
- Get a gentle introduction to the reflect package and how it exposes type and value information at runtime.
- Discuss the trade-offs of using empty interface and reflection compared to using concrete types and generics.

By the end you will understand when dynamic typing patterns are appropriate in Go and how to use them without losing too much clarity.`,
        duration: "55 min",
        difficulty: "Advanced",
        exercises: 6
      }
    ],
    duration: "4.2 hours",
    exercises: 27,
    completed: false,
    codeExample: `package main

import "fmt"

// Interface definition
type Shape interface {
    Area() float64
    Perimeter() float64
}

// Struct implementing interface
type Rectangle struct {
    Width  float64
    Height float64
}

// Methods with value receiver
func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}

func (r Rectangle) Perimeter() float64 {
    return 2 * (r.Width + r.Height)
}

// Another struct implementing interface
type Circle struct {
    Radius float64
}

func (c Circle) Area() float64 {
    return 3.14159 * c.Radius * c.Radius
}

func (c Circle) Perimeter() float64 {
    return 2 * 3.14159 * c.Radius
}

// Method with pointer receiver
type Counter struct {
    value int
}

func (c *Counter) Increment() {
    c.value++
}

func (c *Counter) GetValue() int {
    return c.value
}

func main() {
    // Using interfaces
    var shape Shape
    
    shape = Rectangle{Width: 5, Height: 3}
    fmt.Printf("Rectangle Area: %.2f\\n", shape.Area())
    
    shape = Circle{Radius: 5}
    fmt.Printf("Circle Area: %.2f\\n", shape.Area())
}
`
  },
  {
    id: 5,
    title: "Concurrency",
    description: "Learn goroutines, channels, and concurrent programming",
    topics: [
      {
        id: "goroutines",
        title: "Goroutines",
        content:
          `Goroutines are lightweight threads managed by the Go runtime. They make it easy to run functions concurrently.

In this topic you will:
- Learn how to start new goroutines and understand that they execute independently from the main goroutine.
- Distinguish between concurrency and parallelism and see examples of each in Go.
- Understand the lifecycle of a goroutine, including when it starts, when it ends, and how leaks can occur.
- Use wait groups or other synchronization primitives to ensure your program waits for goroutines to finish when necessary.

You will write small concurrent programs that spin up many goroutines and coordinate their work safely.`,
        duration: "75 min",
        difficulty: "Intermediate",
        exercises: 8
      },
      {
        id: "channels",
        title: "Channels",
        content:
          `Channels are typed conduits that allow goroutines to communicate by sending and receiving values.

In this topic you will:
- Create unbuffered and buffered channels and learn how they synchronize senders and receivers.
- Use channels to pass data between goroutines instead of sharing memory with explicit locks, following Go's "do not communicate by sharing memory" philosophy.
- Understand channel closing semantics and how to signal completion or termination.
- Explore common patterns such as fan-in, fan-out, and worker pools built using channels.

By the end you will be able to design simple concurrent pipelines that use channels to coordinate work between goroutines.`,
        duration: "70 min",
        difficulty: "Intermediate",
        exercises: 8
      },
      {
        id: "select",
        title: "Select Statements",
        content:
          `The select statement lets a goroutine wait on multiple channel operations at once, enabling more advanced concurrency patterns.

In this topic you will:
- Write basic select statements that respond to whichever channel operation becomes ready first.
- Implement timeouts and cancellation by combining select with time based channels or context cancellation.
- Use default cases to implement non-blocking channel operations when you cannot wait.
- Combine select with loops to build robust, responsive concurrent services.

You will create examples where goroutines multiplex input from several sources and handle timeouts gracefully.`,
        duration: "65 min",
        difficulty: "Advanced",
        exercises: 7
      },
      {
        id: "sync-package",
        title: "Sync Package",
        content: `While channels cover many concurrency needs, sometimes you must protect shared state directly. The sync package provides primitives for this.

In this topic you will:
- Use Mutex to guard critical sections and prevent race conditions when multiple goroutines access shared data.
- Coordinate groups of goroutines using WaitGroup so the main goroutine can wait for them to complete.
- Get an overview of other primitives such as Once and Cond and when they are useful.
- Discuss when to prefer channels and when mutexes are more appropriate or simpler.

You will refactor simple examples to use Mutex and WaitGroup correctly and understand the importance of avoiding data races.`,
        duration: "70 min",
        difficulty: "Advanced",
        exercises: 8
      }
    ],
    duration: "4.5 hours",
    exercises: 31,
    completed: false,
    codeExample: `package main

import (
    "fmt"
    "sync"
    "time"
)

func main() {
    // Goroutine
    go sayHello("World")
    time.Sleep(100 * time.Millisecond)
}

func sayHello(name string) {
    fmt.Printf("Hello, %s!\\n", name)
}
`
  },
  {
    id: 6,
    title: "Error Handling & Advanced Topics",
    description: "Handle errors gracefully and explore advanced Go features",
    topics: [
      {
        id: "error-handling",
        title: "Error Handling",
        content:
          `Go's approach to error handling emphasizes explicit checks and simple control flow instead of exceptions.

In this topic you will:
- Use the conventional pattern of returning an error value as the last return from functions that may fail.
- Check and handle errors at each call site, deciding when to recover and when to propagate the error upwards.
- Create custom error types that carry additional context, such as error codes or wrapped inner errors.
- Learn about error wrapping and unwrapping to build error chains that preserve root causes.

By the end you will feel comfortable writing code that handles errors consistently without hidden control flow.`,
        duration: "65 min",
        difficulty: "Intermediate",
        exercises: 7
      },
      {
        id: "defer-panic-recover",
        title: "Defer, Panic & Recover",
        content:
          `Defer, panic, and recover form Go's low-level mechanism for handling unexpected failures while still guaranteeing cleanup.

In this topic you will:
- Use defer to schedule functions that should run when the surrounding function returns, such as closing files or unlocking mutexes.
- Understand when panic is appropriate for unrecoverable programmer errors versus normal error conditions.
- Write recover handlers that prevent panics from crashing the entire program in carefully controlled scenarios.
- See how defer, panic, and recover interact and why they should be used sparingly compared to normal error handling.

You will add deferred cleanup to existing code and experiment with controlled panics to understand their behavior.`,
        duration: "60 min",
        difficulty: "Intermediate",
        exercises: 6
      },
      {
        id: "testing",
        title: "Testing & Benchmarking",
        content:
          `Testing is built into Go's standard toolchain, making it easy to adopt test-first or test-driven approaches.

In this topic you will:
- Write basic unit tests using the testing package and run them with the go test command.
- Use table-driven tests to cover many scenarios with minimal boilerplate and clear intent.
- Add benchmarks to measure the performance of critical code paths.
- Generate code coverage reports to see which parts of your code are exercised by tests.

By the end you will be able to set up a simple but effective test suite for a Go package and integrate it into your development workflow.`,
        duration: "70 min",
        difficulty: "Advanced",
        exercises: 8
      },
      {
        id: "packages-modules",
        title: "Packages & Modules",
        content:
          `As your Go projects grow, proper organization into packages and modules becomes essential for clarity and reuse.

In this topic you will:
- Create reusable packages with their own files and exported identifiers.
- Understand how import paths relate to module paths defined in go.mod.
- Manage dependencies with Go modules, including adding, upgrading, and tidying requirements.
- Learn best practices for package boundaries, naming, and organizing code into internal and public APIs.

You will restructure a small project into multiple packages and configure its module properly so that it remains easy to navigate and maintain.`,
        duration: "65 min",
        difficulty: "Advanced",
        exercises: 7
      }
    ],
    duration: "4.3 hours",
    exercises: 28,
    completed: false,
    codeExample: `package main

import (
    "errors"
    "fmt"
)

// Custom error
type CustomError struct {
    Message string
    Code    int
}

func (e *CustomError) Error() string {
    return fmt.Sprintf("Error %d: %s", e.Code, e.Message)
}

func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

func main() {
    result, err := divide(10, 0)
    if err != nil {
        fmt.Printf("Error: %v\\n", err)
    } else {
        fmt.Printf("Result: %.2f\\n", result)
    }
}`
  }
];


