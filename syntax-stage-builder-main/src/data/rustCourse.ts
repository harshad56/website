export type RustDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface RustTopic {
  id: string;
  title: string;
  content: string;
  duration: string;
  difficulty: RustDifficulty;
  exercises: number;
}

export interface RustModule {
  id: number;
  title: string;
  description: string;
  topics: RustTopic[];
  duration: string;
  exercises: number;
  completed: boolean;
  codeExample: string;
}

export const rustModules: RustModule[] = [
  {
    id: 1,
    title: "Rust Fundamentals",
    description: "Master the basics of Rust programming language",
    topics: [
      {
        id: "rust-intro",
        title: "Introduction to Rust",
        content: `Rust is a systems programming language that aims to combine **C/C++‑level performance** with strong guarantees about memory safety and concurrency.

In this topic you'll:
- Learn why Rust was created and which long‑standing C/C++ problems it set out to solve (buffer overflows, use‑after‑free, data races).
- Explore where Rust is used today: CLIs, web servers (Actix, Axum), game engines, operating system components, and embedded systems.
- Get a high‑level view of the Rust toolchain: the \`rustc\` compiler, \`cargo\` (build, test, dependency management), and crates.io as the public package registry.
- Understand how Rust can avoid a **garbage collector** while still preventing most memory errors at compile time using its **ownership model**.
- Compare Rust with languages like C++, Go, and Java in terms of performance, safety, and ecosystem maturity.

By the end, you'll have a clear mental picture of why teams choose Rust and what kinds of projects benefit the most from it.`,
        duration: "40 min",
        difficulty: "Beginner",
        exercises: 4
      },
      {
        id: "rust-syntax",
        title: "Rust Syntax & Structure",
        content: `Rust code is organized into **crates** (library or binary) and **modules** (for grouping related items). A binary crate has a \`main\` function that acts as the entry point.

In this topic you'll:
- Create a new project with \`cargo new\` and understand the roles of \`Cargo.toml\` and \`src/main.rs\`.
- Learn how \`use\` statements bring functions, types, and traits into scope, and how modules help you structure larger programs.
- See how Rust's expression‑based syntax lets many constructs, including \`if\` and blocks, return values.
- Discover the pattern of writing a small \`fn main()\` that delegates real work to other functions and modules, improving testability and clarity.
- Build and run the project with \`cargo build\` and \`cargo run\`, and learn when to use debug vs release builds.

You'll follow a small multi‑function example that shows how code is split into functions and modules, and how control flows at runtime.`,
        duration: "45 min",
        difficulty: "Beginner",
        exercises: 5
      },
      {
        id: "variables-types",
        title: "Variables & Data Types",
        content: `Rust's type system is strict but ergonomic thanks to **type inference**. By default, variables are **immutable**, which encourages safer designs and fewer accidental mutations.

In this topic you'll:
- Declare immutable bindings with \`let\` and mutable ones with \`let mut\`, and learn when each is appropriate.
- Explore Rust's primitive types: booleans, integer sizes (\`i8\`–\`i128\`, \`u8\`–\`u128\`), \`isize\`/\`usize\`, floats (\`f32\`, \`f64\`), \`char\`, and string slices.
- Understand **shadowing**, where you can re‑declare a name with a new type or value, and how it differs from mutability.
- See how type inference works in practice and when adding explicit type annotations improves readability or error messages.
- Perform basic conversions using the \`as\` keyword, and discuss the risks of narrowing conversions and integer overflow.

You'll write small snippets that declare and print different primitive types, then refactor them to use immutability and shadowing effectively.`,
        duration: "50 min",
        difficulty: "Beginner",
        exercises: 6
      },
      {
        id: "functions-basic",
        title: "Functions & Control Flow",
        content: `Rust builds everything on top of **expressions**. Functions frequently compute and return values rather than mutating global state.

In this topic you'll:
- Declare functions with parameters and return types using Rust's arrow syntax, e.g. \`fn add(a: i32, b: i32) -> i32\`.
- Use \`if\` as an expression that can produce a value, and compare it to the more statement‑heavy style in languages like C or Java.
- Work with \`loop\`, \`while\`, and \`for\` constructs, and see how they pair with iterators to make iteration safe and expressive.
- Get comfortable with \`match\` for exhaustive pattern matching on integers, enums, and more, and learn how it can replace long chains of \`if/else if\`.
- Organize code into helper functions and call them from \`main\`, making your programs easier to read and test.

By the end, you'll be able to read and write small Rust programs that use idiomatic control flow and functions to express complex logic clearly.`,
        duration: "55 min",
        difficulty: "Beginner",
        exercises: 6
      }
    ],
    duration: "3.2 hours",
    exercises: 21,
    completed: false,
    codeExample: `// Your first Rust program
fn main() {
    println!("Hello, World!");
    
    // Variables and data types
    let name = "Alice";  // Immutable by default
    let mut age = 25;    // Mutable variable
    let height: f64 = 5.6;
    let is_student: bool = true;
    
    // Shadowing
    let x = 5;
    let x = x + 1;  // New variable shadows the previous one
    let x = x * 2;
    println!("x is: {}", x);
    
    // Basic operations
    let result = 10 + 5 * 2;
    println!("Result: {}", result);
    
    // String formatting
    let message = format!("Welcome, {}! You are {} years old.", name, age);
    println!("{}", message);
    
    // Type conversion
    let age_float = age as f64;
    let age_int = age_float as i32;
    
    // Conditional expression
    let status = if age >= 18 {
        "adult"
    } else {
        "minor"
    };
    println!("You are an {}", status);
    
    // Match expression
    let number = 5;
    match number {
        1 => println!("One"),
        2 => println!("Two"),
        3..=5 => println!("Three to five"),
        _ => println!("Something else"),
    }
}`
  },
  {
    id: 2,
    title: "Ownership & Borrowing",
    description: "Understand Rust's unique memory management system",
    topics: [
      {
        id: "ownership",
        title: "Ownership Rules",
        content: `Ownership is the core concept that makes Rust's memory model safe without a garbage collector. Instead of relying on runtime checks, Rust enforces rules at compile time.

In this topic you will:
- Learn the three basic ownership rules: each value has a single owner, ownership can be moved, and values are dropped when their owner goes out of scope.
- See how moves work when you assign or pass values like String, and why the compiler prevents you from using a value after it has been moved.
- Compare stack vs heap allocations conceptually and understand which kinds of values typically live where.
- Use the Clone and Copy traits to explicitly duplicate data when you need separate, independent values.

By the end you will be able to read compiler errors about moves and ownership and understand why Rust is protecting you from use-after-free bugs.`,
        duration: "75 min",
        difficulty: "Intermediate",
        exercises: 9
      },
      {
        id: "borrowing",
        title: "Borrowing & References",
        content:
          `Borrowing lets you access data without taking ownership of it. Rust's borrowing rules are strict, but they guarantee memory safety without runtime overhead.

In this topic you will:
- Use shared references (&T) to read data without moving it, and see how many shared borrows can coexist.
- Use mutable references (&mut T) when you need to modify data in place while still avoiding multiple writers at once.
- Learn Rust's rule that you can have many immutable references or one mutable reference, but not both at the same time.
- Understand how the compiler tracks lifetimes of borrows so references can never outlive the data they point to.

You will write small examples that pass references into functions, modify values through mutable references, and see how the compiler enforces safe access patterns.`,
        duration: "70 min",
        difficulty: "Intermediate",
        exercises: 8
      },
      {
        id: "slices",
        title: "Slices",
        content: `Slices are views into contiguous sequences of elements. They let you work with parts of strings or arrays without copying data.

In this topic you will:
- Work with string slices (&str) and array slices (&[T]) and see how they reference sections of existing data.
- Use range syntax to create slices that refer to parts of a collection, like the first word of a string or a sub-range of a list.
- Understand why slicing must be done at valid UTF-8 boundaries for strings, and what happens when indices are out of bounds.
- Learn how slices are used extensively in the standard library APIs for efficient, zero-copy operations.

By the end you will be comfortable using slices to write flexible functions that operate on borrowed views of data rather than owning collections outright.`,
        duration: "60 min",
        difficulty: "Intermediate",
        exercises: 7
      },
      {
        id: "lifetimes",
        title: "Lifetimes",
        content:
          `Lifetimes are Rust's way of describing how long references are valid. Most of the time the compiler infers them for you, but understanding them is key to advanced Rust.

In this topic you will:
- Learn what a lifetime is conceptually and how it relates to the scope of variables and borrows.
- See the common cases where the compiler can infer lifetimes automatically (lifetime elision rules) and when you must add explicit annotations.
- Write simple generic functions that take and return references with lifetime parameters, such as functions that return the longer of two string slices.
- Understand lifetime errors from the compiler and how they help you avoid dangling references.

You will practice reading and writing small code snippets with lifetime annotations so that they feel less mysterious and more like another part of the type system.`,
        duration: "65 min",
        difficulty: "Advanced",
        exercises: 7
      }
    ],
    duration: "4.5 hours",
    exercises: 31,
    completed: false,
    codeExample: `fn main() {
    // Ownership
    let s1 = String::from("hello");
    let s2 = s1;  // s1 is moved to s2
    // println!("{}", s1);  // Error! s1 is no longer valid
    
    // Clone (deep copy)
    let s3 = String::from("hello");
    let s4 = s3.clone();
    println!("s3: {}, s4: {}", s3, s4);
    
    // Borrowing (references)
    let s = String::from("hello");
    let len = calculate_length(&s);  // Borrow s
    println!("The length of '{}' is {}.", s, len);
    
    // Mutable reference
    let mut s = String::from("hello");
    change(&mut s);
    println!("{}", s);
    
    // Slices
    let s = String::from("hello world");
    let hello = &s[0..5];
    let world = &s[6..11];
    println!("{} {}", hello, world);
    
    // String slices
    let s = "Hello, world!";
    let word = first_word(&s);
    println!("First word: {}", word);
    
    // Array slices
    let a = [1, 2, 3, 4, 5];
    let slice = &a[1..3];
    println!("Slice: {:?}", slice);
}

// Function with reference parameter
fn calculate_length(s: &String) -> usize {
    s.len()
}  // s goes out of scope, but nothing happens because it's a reference

// Function with mutable reference
fn change(some_string: &mut String) {
    some_string.push_str(", world");
}

// Function returning string slice
fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    
    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }
    
    &s[..]
}`
  },
  {
    id: 3,
    title: "Structs & Enums",
    description: "Work with custom data types and pattern matching",
    topics: [
      {
        id: "structs",
        title: "Structs",
        content: `Structs in Rust let you define your own data types by grouping related fields together. They are central to modeling real-world concepts in Rust applications.

In this topic you will:
- Declare struct types with named fields and create instances using struct literals.
- Use update syntax and field shorthand to make initialization concise and expressive.
- Implement methods on structs with impl blocks, passing &self or &mut self as appropriate.
- Write associated functions (like constructors) that create instances with sensible defaults or perform validation.

By the end you will be able to define and work with your own composite types that encapsulate both data and behavior.`,
        duration: "65 min",
        difficulty: "Beginner",
        exercises: 7
      },
      {
        id: "enums",
        title: "Enums",
        content:
          `Enums in Rust are algebraic data types, which means each variant can carry different associated data. This makes them much more powerful than simple numeric enums in many other languages.

In this topic you will:
- Declare enums with simple variants and variants that hold data, such as messages in a protocol or states in a state machine.
- Use the built-in Option and Result enums to represent nullable values and fallible operations in a type-safe way.
- Match on enums using match expressions to handle each possible case explicitly.
- Learn patterns for modeling complex domains with enums rather than scattered booleans and integers.

You will create your own enums and write match expressions that handle each variant, making your code more robust and self-documenting.`,
        duration: "70 min",
        difficulty: "Intermediate",
        exercises: 8
      },
      {
        id: "pattern-matching",
        title: "Pattern Matching",
        content:
          `Pattern matching is one of Rust's most expressive features. It lets you concisely destructure data, test shapes, and handle many cases at once.

In this topic you will:
- Use match to handle enum variants, primitive values, and ranges with clear, exhaustive branches.
- Destructure structs, tuples, and enums directly in match arms to bind fields to local variables.
- Learn the if let and while let shortcuts for handling only certain patterns without writing full match expressions.
- Combine patterns with guards to express more complex conditions while keeping code readable.

By the end you will be comfortable using pattern matching as a core tool in your Rust code, not just a niche feature.`,
        duration: "75 min",
        difficulty: "Intermediate",
        exercises: 9
      },
      {
        id: "methods",
        title: "Methods & Associated Functions",
        content:
          `Methods and associated functions live inside impl blocks and let you attach behavior directly to your types.

In this topic you will:
- Implement methods on structs and enums that take &self or &mut self, similar to instance methods in object-oriented languages.
- Write associated functions that do not take self and are called on the type itself, often used as constructors or helpers.
- Split impl blocks across files or modules for organization, and learn how trait implementations fit alongside inherent impls.
- Understand how method syntax (value.method()) is essentially sugar for function calls that take self as the first argument.

You will refactor free functions into methods on your types and create clear initialization functions that construct valid instances.`,
        duration: "60 min",
        difficulty: "Intermediate",
        exercises: 7
      }
    ],
    duration: "4.5 hours",
    exercises: 31,
    completed: false,
    codeExample: `// Struct definition
struct Person {
    name: String,
    age: u32,
    city: String,
}

// Struct with methods
impl Person {
    // Associated function (like constructor)
    fn new(name: String, age: u32, city: String) -> Person {
        Person { name, age, city }
    }
    
    // Method
    fn greet(&self) {
        println!("Hello, I'm {}", self.name);
    }
}

// Enum
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

impl Message {
    fn call(&self) {
        match self {
            Message::Quit => println!("Quit"),
            Message::Move { x, y } => println!("Move to ({}, {})", x, y),
            Message::Write(text) => println!("Write: {}", text),
            Message::ChangeColor(r, g, b) => println!("Color: RGB({}, {}, {})", r, g, b),
        }
    }
}`
  },
  {
    id: 4,
    title: "Collections & Error Handling",
    description: "Work with vectors, hash maps, and handle errors",
    topics: [
      {
        id: "vectors",
        title: "Vectors",
        content:
          `Vectors (Vec<T>) are Rust's growable, heap-allocated arrays. They are the most common collection type used in everyday Rust code.

In this topic you will:
- Create vectors using macros and the new function, and learn how push, pop, and insert work.
- Access elements safely with indexing and get, and understand the difference between panicking and Option-based access.
- Iterate over vectors using for loops, iter, iter_mut, and into_iter, depending on whether you need read-only, mutable, or consuming iteration.
- Use common helper methods like len, is_empty, sort, retain, and extend to manage vector contents.

By the end you will be comfortable using vectors as your default dynamic collection type and know how to perform common operations idiomatically.`,
        duration: "60 min",
        difficulty: "Beginner",
        exercises: 7
      },
      {
        id: "strings",
        title: "Strings",
        content:
          `Strings in Rust come in two primary forms: owned String and borrowed string slices (&str). Understanding how they relate is crucial for text processing.

In this topic you will:
- Learn when to use String versus &str and how to convert between them.
- Build strings using push_str, push, and the format! macro, and see how these operations allocate and copy data.
- Iterate over strings as bytes and as Unicode scalar values (chars), and understand why indexing into strings by position is not straightforward.
- Handle common tasks like trimming whitespace, splitting on delimiters, and searching for substrings.

You will write small utilities that read, transform, and display text, making sure to manage ownership and borrowing correctly along the way.`,
        duration: "65 min",
        difficulty: "Intermediate",
        exercises: 7
      },
      {
        id: "hashmaps",
        title: "Hash Maps",
        content:
          `HashMap<K, V> lets you associate keys with values, providing fast lookup for many common data modeling scenarios.

In this topic you will:
- Create hash maps, insert key-value pairs, and retrieve values using get.
- Iterate over all entries in a map and perform operations like counting and grouping.
- Use the entry API to insert a default value if a key is missing, or update an existing entry in-place.
- Discuss when hash maps are appropriate compared to vectors or other data structures.

By the end you will be able to use hash maps to build simple indexes and configuration tables in your Rust programs.`,
        duration: "60 min",
        difficulty: "Intermediate",
        exercises: 6
      },
      {
        id: "error-handling",
        title: "Error Handling",
        content:
          `Rust does not use exceptions for typical errors. Instead, it uses the Result type to represent operations that may succeed or fail.

In this topic you will:
- Learn the shape of Result<T, E> and how to use match to handle both Ok and Err cases explicitly.
- Use convenience methods like unwrap and expect carefully, understanding when panicking is acceptable (for example, in tests or prototypes).
- Apply the ? operator to propagate errors up the call stack in a concise, readable way.
- See how error handling composes in real-world examples like file I/O and parsing.

You will refactor code that panics into safer, Result-based code and get comfortable returning errors to callers instead of crashing the program.`,
        duration: "70 min",
        difficulty: "Intermediate",
        exercises: 8
      }
    ],
    duration: "4.3 hours",
    exercises: 28,
    completed: false,
    codeExample: `use std::collections::HashMap;

fn main() {
    // Vectors
    let mut v: Vec<i32> = Vec::new();
    v.push(1);
    v.push(2);
    v.push(3);
    
    // Vector macro
    let v2 = vec![1, 2, 3, 4, 5];
    
    // Accessing elements
    let third = &v[2];
    println!("Third element: {}", third);
    
    // Safe access
    match v.get(2) {
        Some(third) => println!("Third element: {}", third),
        None => println!("No third element"),
    }
    
    // Iterating
    for i in &v {
        println!("{}", i);
    }
    
    // Mutable iteration
    for i in &mut v {
        *i += 50;
    }
    
    // Hash Maps
    let mut scores = HashMap::new();
    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Yellow"), 50);
    
    for (key, value) in &scores {
        println!("{}: {}", key, value);
    }
}`
  },
  {
    id: 5,
    title: "Traits & Generics",
    description: "Learn traits, generics, and trait bounds",
    topics: [
      {
        id: "traits",
        title: "Traits",
        content: `Traits define shared behavior that different types can implement. They are central to Rust's approach to polymorphism and generic code.

In this topic you will:
- Declare simple traits with method signatures and implement them for your own types.
- Learn how traits can be used to express capabilities such as displayable, comparable, or serializable.
- Use trait bounds on generic functions so they only accept types that implement specific traits.
- Get an overview of trait objects (dyn Trait) for runtime polymorphism when you need heterogeneous collections or plugin-like architectures.

By the end you will understand how traits let you write flexible code that is generic over behavior rather than concrete types.`,
        duration: "75 min",
        difficulty: "Intermediate",
        exercises: 8
      },
      {
        id: "generics",
        title: "Generics",
        content:
          `Generics allow you to write functions and types that work with many concrete types while still being checked and optimized at compile time.

In this topic you will:
- Write generic functions with type parameters that work for different input types.
- Define generic structs and enums, such as containers and result types, that can hold various inner types.
- Add trait bounds to generic parameters so the compiler knows which operations are allowed.
- Learn how monomorphization works under the hood, generating efficient concrete code for each set of type arguments.

You will refactor duplicated functions into generic versions and see how performance remains strong even when using high-level abstractions.`,
        duration: "70 min",
        difficulty: "Intermediate",
        exercises: 7
      },
      {
        id: "trait-bounds",
        title: "Trait Bounds",
        content:
          `Trait bounds let you specify which traits a generic type must implement, so the compiler knows which operations are valid.

In this topic you will:
- Add basic trait bounds to generic functions and types so they only accept types that support required behavior.
- Rewrite function signatures to use where clauses when bounds become long or complex, improving readability.
- Combine multiple trait bounds on a single type parameter and understand how this affects usable methods.
- See how trait bounds enable powerful constraints while still keeping your APIs flexible and generic.

By the end you will be able to design generic APIs that clearly express their requirements using trait bounds.`,
        duration: "65 min",
        difficulty: "Advanced",
        exercises: 7
      },
      {
        id: "lifetimes-generics",
        title: "Lifetimes with Generics",
        content:
          `Lifetimes and generics often appear together in advanced Rust code, especially when you are writing reusable libraries.

In this topic you will:
- Write generic structs and functions that take references with explicit lifetime parameters.
- Understand how lifetime parameters relate to generic type parameters and when they are needed.
- See common patterns for building wrapper types and helper functions that borrow data rather than owning it.
- Practice reading and simplifying complex type signatures that combine generics, lifetimes, and trait bounds.

You will gain confidence in working with code that mixes lifetimes and generics, which is a key step toward mastering idiomatic Rust.`,
        duration: "60 min",
        difficulty: "Advanced",
        exercises: 6
      }
    ],
    duration: "4.5 hours",
    exercises: 28,
    completed: false,
    codeExample: `// Trait definition
trait Summary {
    fn summarize(&self) -> String;
}

// Struct implementing trait
struct NewsArticle {
    headline: String,
    location: String,
    author: String,
    content: String,
}

impl Summary for NewsArticle {
    fn summarize(&self) -> String {
        format!("{}, by {} ({})", self.headline, self.author, self.location)
    }
}`
  },
  {
    id: 6,
    title: "Advanced Rust Features",
    description: "Master advanced Rust concepts and modern features",
    topics: [
      {
        id: "closures",
        title: "Closures",
        content: `Closures are anonymous functions that can capture values from their surrounding environment, making them ideal for short, inline behaviors.

In this topic you will:
- Write simple closures with and without explicit type annotations and see how inference works.
- Observe how closures capture variables by reference, mutable reference, or by move depending on how they are used.
- Use closures with iterator adapters such as map, filter, and for_each to express data transformations succinctly.
- Learn when to store closures in variables, pass them as function parameters, or return them from functions.

By the end you will be comfortable using closures to make your code more expressive and to encapsulate small pieces of behavior.`,
        duration: "70 min",
        difficulty: "Advanced",
        exercises: 8
      },
      {
        id: "iterators",
        title: "Iterators",
        content:
          `Iterators are a central abstraction in Rust for processing sequences of values lazily and efficiently.

In this topic you will:
- Use built-in iterators from collections like vectors, strings, and ranges.
- Chain iterator adapters such as map, filter, take, skip, and collect to perform complex processing in a single pipeline.
- Understand how ownership works with iter, iter_mut, and into_iter, and how it affects what you can do inside an iterator chain.
- Implement your own iterator types by implementing the Iterator trait on custom structs.

You will replace many explicit loops with iterator-based code that is both concise and highly readable.`,
        duration: "75 min",
        difficulty: "Advanced",
        exercises: 8
      },
      {
        id: "smart-pointers",
        title: "Smart Pointers",
        content: `Smart pointers in Rust provide additional behavior on top of normal references, such as heap allocation, shared ownership, or interior mutability.

In this topic you will:
- Use Box to allocate values on the heap and work with recursive data structures that cannot live on the stack alone.
- Learn how Rc enables multiple owners of immutable data, and how reference counting is managed at runtime.
- Use RefCell to enforce borrowing rules at runtime instead of compile time, enabling interior mutability patterns.
- Discuss when these tools are appropriate and how to avoid common pitfalls like reference cycles.

By the end you will understand how and when to reach for smart pointers to handle more complex ownership scenarios safely.`,
        duration: "80 min",
        difficulty: "Advanced",
        exercises: 9
      },
      {
        id: "concurrency",
        title: "Concurrency",
        content:
          `Rust's concurrency model combines zero-cost abstractions with strong compile-time guarantees to help you write safe, efficient parallel code.

In this topic you will:
- Spawn threads and move data into them safely without data races, thanks to Rust's Send and Sync traits.
- Communicate between threads using channels and see how message passing avoids some shared-state pitfalls.
- Use Mutex and Arc together to manage shared mutable state when message passing is not enough.
- Understand how the type system prevents you from accidentally sharing non-thread-safe types across threads.

You will build small concurrent examples that demonstrate Rust's strengths in catching concurrency bugs at compile time.`,
        duration: "75 min",
        difficulty: "Advanced",
        exercises: 8
      }
    ],
    duration: "5 hours",
    exercises: 33,
    completed: false,
    codeExample: `use std::thread;
use std::sync::{mpsc, Mutex, Arc};
use std::time::Duration;

fn main() {
    let handle = thread::spawn(|| {
        for i in 1..10 {
            println!("hi number {} from the spawned thread!", i);
            thread::sleep(Duration::from_millis(1));
        }
    });
    
    for i in 1..5 {
        println!("hi number {} from the main thread!", i);
        thread::sleep(Duration::from_millis(1));
    }
    
    handle.join().unwrap();
    
    // Channels
    let (tx, rx) = mpsc::channel();
    
    thread::spawn(move || {
        let val = String::from("hi");
        tx.send(val).unwrap();
    });
    
    let received = rx.recv().unwrap();
    println!("Got: {}", received);
    
    // Mutex
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];
    
    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();
            *num += 1;
        });
        handles.push(handle);
    }
    
    for handle in handles {
        handle.join().unwrap();
    }
    
    println!("Result: {}", *counter.lock().unwrap());
}`
  }
];


