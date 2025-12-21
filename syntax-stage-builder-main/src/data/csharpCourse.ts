export type CSharpDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CSharpTopic {
  id: string;
  title: string;
  content: string;
  duration: string;
  difficulty: CSharpDifficulty;
  exercises: number;
}

export interface CSharpModule {
  id: number;
  title: string;
  description: string;
  topics: CSharpTopic[];
  duration: string;
  exercises: number;
  completed: boolean;
  codeExample: string;
}

export const csharpModules: CSharpModule[] = [
  {
    id: 1,
    title: "C# Fundamentals",
    description: "Master the basics of C# programming language",
    topics: [
      {
        id: "csharp-intro",
        title: "Introduction to C#",
        content: `C# is a modern, object-oriented language created by Microsoft that runs on the .NET platform. 
It was designed to feel familiar if you know C, C++, or Java, but with a cleaner, safer syntax and a rich standard library.

In this topic you'll:
- Trace the history of C# from its first release with .NET Framework to modern cross‑platform .NET.
- See how C# fits into the broader **.NET ecosystem**, alongside languages like F# and VB.NET.
- Understand why C# is widely used in **enterprise backends**, **desktop apps**, **cloud services**, and **game development** (Unity).
- Learn at a high level how your code is compiled to **IL (Intermediate Language)** and executed by the **CLR (Common Language Runtime)**.
- Get familiar with core tooling: Visual Studio, VS Code + C# Dev Kit, the dotnet CLI, and package management with **NuGet**.

By the end of this lesson you should be able to explain to a beginner what C# is, where it is used in real products, and why a company might choose it over other languages.`,
        duration: "40 min",
        difficulty: "Beginner",
        exercises: 4
      },
      {
        id: "csharp-syntax",
        title: "C# Syntax & Structure",
        content: `C# organizes code into **namespaces** and **types** (primarily classes). Every console application begins execution inside a "Main" method.

Key concepts covered in this topic:
- The structure of a minimal program: using directives, a namespace, a class, and a static Main(string[] args) entry point.
- How using directives make types from namespaces like System (for example, Console) available without long fully qualified names.
- C# coding conventions: PascalCase for classes and methods, camelCase for local variables and parameters, and why consistency matters.
- The difference between statements (like if, for, return) and expressions (like 1 + 2 or name.Length > 0), and how they form the building blocks of your logic.
- How to create and run a project with the dotnet CLI (dotnet new console, dotnet run) and what files (.csproj, .cs) are generated.

You'll walk through a small multi‑method console program to see how C# code is typically structured and how control flows between methods.`,
        duration: "45 min",
        difficulty: "Beginner",
        exercises: 5
      },
      {
        id: "variables-types",
        title: "Variables & Data Types",
        content: `C# has a rich static type system that separates **value types** (typically stored on the stack) from **reference types** (stored on the heap). 
Understanding this model helps you reason about memory, performance, and behavior.

In this topic you'll:
- Learn the built‑in value types like int, double, decimal, bool, char and how they map to .NET types like System.Int32.
- See how reference types (like strings, class instances, and arrays) behave differently from value types when assigned or passed to methods.
- Use the var keyword for local type inference, understanding when it improves readability and when explicit types are clearer.
- Work with nullable value types (for example, int?) to safely represent "no value", and learn how this differs from null reference types.
- Explore common type conversion techniques: implicit vs explicit casts, Parse/TryParse, and utility methods in the Convert class.

You'll practice declaring variables for configuration values, user input, and computed results, then inspect how their types affect behavior in code.`,
        duration: "50 min",
        difficulty: "Beginner",
        exercises: 6
      },
      {
        id: "operators-expressions",
        title: "Operators & Expressions",
        content: `C# provides familiar arithmetic and logical operators, plus powerful features for working with nullable values safely.

In this topic you'll:
- Review arithmetic operators (+, -, *, /, %) and see how integer vs floating‑point division works in practice.
- Use comparison operators (==, !=, <, >, <=, >=) with both primitive types and reference types, and understand reference equality vs value equality.
- Combine conditions with logical operators (&&, ||, !) and learn how short‑circuit evaluation can protect you from NullReferenceException.
- Apply C#'s null‑coalescing operator (??) and null‑conditional operator (?.) to drastically simplify null checks.
- Understand operator precedence and associativity rules so you know when extra parentheses are needed to make code obvious.

By the end you'll be able to rewrite verbose if/else chains into cleaner expressions that express intent, while still being safe against null and type issues.`,
        duration: "45 min",
        difficulty: "Beginner",
        exercises: 5
      }
    ],
    duration: "3 hours",
    exercises: 20,
    completed: false,
    codeExample: `using System;

// Your first C# program
class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Hello, World!");
        
        // Variables and data types
        string name = "Alice";
        int age = 25;
        double height = 5.6;
        bool isStudent = true;
        
        // Basic operations
        int result = 10 + 5 * 2;
        Console.WriteLine($"Result: {result}");
        
        // String interpolation
        string message = $"Welcome, {name}! You are {age} years old.";
        Console.WriteLine(message);
        
        // Type conversion
        string ageStr = age.ToString();
        int ageInt = int.Parse("25");
        
        // Conditional statement
        if (age >= 18)
        {
            Console.WriteLine("You are an adult");
        }
        else
        {
            Console.WriteLine("You are a minor");
        }
    }
}`
  },
  {
    id: 2,
    title: "Control Flow & Methods",
    description: "Master conditional statements, loops, and method creation",
    topics: [
      {
        id: "conditionals",
        title: "Conditional Statements",
        content: `Conditional logic is how your program makes decisions. In C#, you express decisions primarily with if and else, the conditional operator, and switch expressions.

In this topic you will:
- Learn the basic if, else if, and else pattern and how conditions based on booleans, comparisons, and method calls control program flow.
- See real examples of validating user input, branching on configuration flags, and guarding against invalid states with early returns.
- Use the ternary conditional operator (condition ? valueIfTrue : valueIfFalse) to simplify simple decisions into single expressions.
- Explore modern switch expressions introduced in newer C# versions, which let you map values to results in a concise, expression-based style.

By the end you should be comfortable choosing between if chains, the conditional operator, and switch expressions to keep your decision logic clear and maintainable.`,
        duration: "55 min",
        difficulty: "Beginner",
        exercises: 6
      },
      {
        id: "loops",
        title: "Loops & Iteration",
        content: `Loops let you repeat work over collections, ranges, or until a condition is met. C# offers several loop constructs, each suited to different situations.

In this topic you will:
- Practice the classic for loop for counting and index-based access, including off-by-one patterns and iterating backwards.
- Use while and do-while loops when you want to keep running until some dynamic condition becomes false, such as user input or a network state.
- Learn how foreach makes it much cleaner to iterate over arrays, lists, and other enumerable collections without managing indices manually.
- Understand how break, continue, and return affect loop execution, and how they interact with nested loops.

You will rewrite repetitive copy-paste code into loops, iterate over arrays and lists, and compare different loop styles so you know which one to use in common scenarios.`,
        duration: "50 min",
        difficulty: "Beginner",
        exercises: 6
      },
      {
        id: "methods-basic",
        title: "Method Basics",
        content: `Methods are reusable blocks of code that take inputs, perform work, and optionally return results. Good method design makes programs easier to understand and maintain.

In this topic you will:
- Declare simple methods that return no value (void) and methods that return computed results such as numbers or strings.
- Define parameters to accept input, pass arguments by value, and see how call sites become more readable when parameters are well named.
- Learn how return statements work, including early returns when a method can exit as soon as it knows the answer.
- Use method overloading to provide multiple versions of a method with different parameter lists, like a Log method that accepts both strings and exceptions.

By the end you will be able to break a long Main method into many smaller methods, each focused on a single responsibility with clear inputs and outputs.`,
        duration: "60 min",
        difficulty: "Beginner",
        exercises: 7
      },
      {
        id: "methods-advanced",
        title: "Advanced Methods",
        content:
          `Once you are comfortable with basic methods, C# offers several powerful features that make method calls more expressive and flexible.

In this topic you will:
- Use optional parameters to provide sensible default values, so many callers can omit arguments while advanced callers still have full control.
- Call methods with named arguments to improve readability, especially when many boolean or numeric arguments would otherwise be confusing.
- Understand ref and out parameters for scenarios where methods need to modify variables supplied by the caller, and when this pattern is appropriate.
- Learn how extension methods let you "add" methods to existing types (such as string or IEnumerable) without modifying their original definitions.

You will design and call methods that use these features to reduce boilerplate and create APIs that feel pleasant and natural to use in real projects.`,
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 7
      }
    ],
    duration: "3.7 hours",
    exercises: 26,
    completed: false,
    codeExample: `using System;

class Program
{
    static void Main(string[] args)
    {
        // Conditional statements
        int age = 18;
        if (age >= 18)
        {
            Console.WriteLine("You can vote");
        }
        else if (age >= 16)
        {
            Console.WriteLine("You can drive");
        }
        else
        {
            Console.WriteLine("You're too young");
        }
        
        // Switch expression (C# 8.0+)
        string day = "Monday";
        string message = day switch
        {
            "Monday" => "Start of the week",
            "Friday" => "Weekend is coming!",
            _ => "Regular day"
        };
        Console.WriteLine(message);
        
        // For loop
        for (int i = 0; i < 5; i++)
        {
            Console.WriteLine($"Count: {i}");
        }
        
        // Foreach loop
        string[] fruits = { "apple", "banana", "orange" };
        foreach (string fruit in fruits)
        {
            Console.WriteLine(fruit);
        }
        
        // While loop
        int count = 0;
        while (count < 5)
        {
            Console.WriteLine(count);
            count++;
        }
        
        // Method definition
        int result = Add(5, 3);
        Console.WriteLine($"Sum: {result}");
        
        // Method with optional parameters
        Greet("Alice");
        Greet("Bob", "Good evening");
    }
    
    static int Add(int a, int b)
    {
        return a + b;
    }
    
    static void Greet(string name, string greeting = "Hello")
    {
        Console.WriteLine($"{greeting}, {name}!");
    }
}`
  },
  {
    id: 3,
    title: "Arrays & Collections",
    description: "Work with arrays, lists, and collection types",
    topics: [
      {
        id: "arrays",
        title: "Arrays",
        content: `Arrays are fixed-size, index-based collections that store multiple values of the same type in contiguous memory. They are one of the fundamental data structures in C#.

In this topic you will:
- Declare and initialize one-dimensional arrays using both the new keyword and array initializers.
- Access and modify elements by index, and understand what happens if you go out of bounds.
- Learn when multidimensional arrays (for example, a 2D grid) are useful and how they differ from jagged arrays (arrays of arrays).
- Iterate over arrays using for and foreach loops, and perform common operations such as searching, counting, and aggregating.

By the end you will know when arrays are a good fit, how they compare to lists, and how to build simple algorithms such as computing minimums, maximums, and averages over an array.`,
        duration: "60 min",
        difficulty: "Beginner",
        exercises: 7
      },
      {
        id: "lists",
        title: "Lists & Collections",
        content:
          `Most real applications need flexible, resizable collections, and C# provides a rich set of generic collection types in the System.Collections.Generic namespace.

In this topic you will:
- Work with List<T> as a dynamic array, adding, inserting, removing, and searching for elements efficiently.
- Use Dictionary<TKey, TValue> to map keys to values, such as usernames to profiles or product IDs to prices, and learn how to safely retrieve values.
- Explore HashSet<T> for storing unique items and quickly checking membership without duplicates.
- Compare these collections to arrays in terms of performance, flexibility, and typical use cases.

You will design small in-memory data models using these collections, such as a simple student registry or inventory system, and implement basic operations against them.`,
        duration: "65 min",
        difficulty: "Beginner",
        exercises: 8
      },
      {
        id: "linq-basics",
        title: "LINQ Basics",
        content:
          `Language Integrated Query (LINQ) lets you express queries over in-memory collections in a concise, declarative way using method chains or query syntax.

In this topic you will:
- Learn the purpose of LINQ and why it is often clearer than writing manual loops for filtering, projection, and aggregation.
- Use common LINQ operators such as Where, Select, OrderBy, ThenBy, and GroupBy on sequences of objects.
- See how deferred execution works and why LINQ methods typically operate on IEnumerable<T>.
- Combine multiple operators in a pipeline to express complex data transformations in a few readable lines.

By the end you will be able to replace many verbose foreach loops with simple, composable LINQ expressions that are easier to read and maintain.`,
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 7
      },
      {
        id: "generics",
        title: "Generics",
        content: `Generics let you write classes and methods that work with many different data types while still being type safe and efficient.

In this topic you will:
- See how generic type parameters turn a single implementation into a reusable building block for lists, repositories, and utility classes.
- Implement simple generic methods that operate on collections without having to duplicate code for each element type.
- Add constraints so that your generic types only accept arguments that support the operations you need, such as requiring a type to have a parameterless constructor or implement an interface.
- Understand how the compiler generates specialized code for each concrete type at compile time, avoiding the performance penalties of reflection-based approaches.

You will refactor repetitive, type-specific code into generic classes and methods, making your codebase smaller, safer, and easier to extend.`,
        duration: "50 min",
        difficulty: "Intermediate",
        exercises: 6
      }
    ],
    duration: "3.8 hours",
    exercises: 28,
    completed: false,
    codeExample: `using System;
using System.Collections.Generic;
using System.Linq;

class Program
{
    static void Main(string[] args)
    {
        // Arrays
        int[] numbers = { 1, 2, 3, 4, 5 };
        string[] names = new string[3];
        names[0] = "Alice";
        names[1] = "Bob";
        names[2] = "Charlie";
        
        // Multidimensional array
        int[,] matrix = new int[3, 3];
        matrix[0, 0] = 1;
        
        // Lists
        List<string> fruits = new List<string>();
        fruits.Add("apple");
        fruits.Add("banana");
        fruits.Add("orange");
        fruits.Remove("banana");
        
        // Dictionary
        Dictionary<string, int> ages = new Dictionary<string, int>();
        ages["Alice"] = 25;
        ages["Bob"] = 30;
        ages["Charlie"] = 28;
        
        foreach (var kvp in ages)
        {
            Console.WriteLine($"{kvp.Key}: {kvp.Value}");
        }
        
        // HashSet
        HashSet<int> uniqueNumbers = new HashSet<int> { 1, 2, 3, 3, 4 };
        Console.WriteLine($"Count: {uniqueNumbers.Count}"); // 4
        
        // LINQ
        var moreNumbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
        
        // Filter
        var evens = moreNumbers.Where(n => n % 2 == 0);
        
        // Transform
        var squares = moreNumbers.Select(n => n * n);
        
        // Order
        var sorted = moreNumbers.OrderByDescending(n => n);
        
        // Aggregate
        var sum = moreNumbers.Sum();
        var max = moreNumbers.Max();
        var avg = moreNumbers.Average();
        
        // Generics
        var box = new Box<string>();
        box.SetContent("Hello");
        string content = box.GetContent();
        Console.WriteLine(content);
    }
}

// Generic class
class Box<T>
{
    private T content;
    
    public void SetContent(T content)
    {
        this.content = content;
    }
    
    public T GetContent()
    {
        return content;
    }
}`
  },
  {
    id: 4,
    title: "Object-Oriented Programming",
    description: "Learn classes, objects, inheritance, and polymorphism",
    topics: [
      {
        id: "classes-objects",
        title: "Classes & Objects",
        content: `Classes are blueprints for objects, and objects are the concrete instances your program manipulates at runtime. Encapsulation is the principle of hiding internal details and exposing only what is necessary.

In this topic you will:
- Define simple classes with fields, properties, and methods that model real-world concepts like Customer, Order, or Product.
- Instantiate objects using the new keyword and understand the difference between a variable that holds a reference and the object in memory.
- Apply encapsulation by using access modifiers (public, private, internal) and by exposing behavior through methods instead of public fields.
- See how classes relate to namespaces and how they are organized across multiple files in a typical C# project.

You will practice designing small domain models in code and think about how to choose meaningful names and responsibilities for each class.`,
        duration: "65 min",
        difficulty: "Beginner",
        exercises: 8
      },
      {
        id: "constructors-properties",
        title: "Constructors & Properties",
        content:
          `Constructors and properties are the primary way you control how objects are created and how their data is exposed.

In this topic you will:
- Write constructors that require essential data up front, enforcing that objects are always in a valid initial state.
- Use overloaded constructors and optional parameters to support multiple ways of creating an object.
- Define full properties with backing fields when you need custom logic, and auto-properties when you just need simple getters and setters.
- Explore property initializers, object initializers, and how they make object creation more expressive and less verbose.

By the end you will be comfortable designing types that are easy to construct correctly and whose data is accessed and modified through well-defined properties.`,
        duration: "60 min",
        difficulty: "Beginner",
        exercises: 7
      },
      {
        id: "inheritance",
        title: "Inheritance & Polymorphism",
        content: `Inheritance and polymorphism are key object-oriented features that let you share behavior among related types and treat them through common interfaces.

In this topic you will:
- Create base classes that define common behavior, and derive subclasses that specialize or extend that behavior.
- Override virtual methods to provide different implementations in derived types while still using base references.
- Understand the difference between overriding and overloading, and when each is appropriate.
- See how polymorphism lets you write code that works with base types or interfaces while still invoking the correct implementation at runtime.

You will build a small class hierarchy (for example, different shapes or vehicles) and write code that operates on the abstract base type while runtime dispatch picks the concrete behavior.`,
        duration: "70 min",
        difficulty: "Intermediate",
        exercises: 9
      },
      {
        id: "interfaces-abstract",
        title: "Interfaces & Abstract Classes",
        content: `Interfaces and abstract classes both define contracts for behavior without necessarily providing full implementations, but they serve slightly different roles in design.

In this topic you will:
- Declare interfaces that specify methods and properties a type must implement, without any concrete code.
- Implement interfaces in multiple unrelated classes to express shared capabilities, such as logging or persistence.
- Use abstract classes to provide a partial implementation and shared state while still leaving certain members abstract.
- Compare when to choose an interface versus an abstract base class, considering factors like multiple inheritance and default implementations.

By the end you will be able to model capabilities and base behaviors in a flexible way, allowing your code to depend on abstractions rather than concrete types.`,
        duration: "65 min",
        difficulty: "Intermediate",
        exercises: 8
      }
    ],
    duration: "4.3 hours",
    exercises: 32,
    completed: false,
    codeExample: `using System;

// Class definition
class Person
{
    // Properties
    public string Name { get; set; }
    public int Age { get; set; }
    
    // Constructor
    public Person(string name, int age)
    {
        Name = name;
        Age = age;
    }
    
    // Method
    public virtual void Greet()
    {
        Console.WriteLine($"Hello, I'm {Name}");
    }
}

// Inheritance
class Student : Person
{
    public string StudentId { get; set; }
    
    public Student(string name, int age, string studentId) 
        : base(name, age)
    {
        StudentId = studentId;
    }
    
    // Method overriding
    public override void Greet()
    {
        Console.WriteLine($"Hello, I'm student {Name} with ID {StudentId}");
    }
    
    public void Study()
    {
        Console.WriteLine($"{Name} is studying");
    }
}

// Interface
interface IMovable
{
    void Move();
    void Stop();
}

// Abstract class
abstract class Vehicle : IMovable
{
    protected string Brand { get; set; }
    
    public abstract void StartEngine();
    
    public virtual void Move()
    {
        Console.WriteLine($"{Brand} is moving");
    }
    
    public virtual void Stop()
    {
        Console.WriteLine($"{Brand} has stopped");
    }
}

// Concrete class
class Car : Vehicle
{
    public Car(string brand)
    {
        Brand = brand;
    }
    
    public override void StartEngine()
    {
        Console.WriteLine($"{Brand} engine started");
    }
}

// Usage
class EntryPoint
{
    static void Main(string[] args)
    {
        Person person = new Person("Alice", 25);
        person.Greet();
        
        Student student = new Student("Bob", 20, "S12345");
        student.Greet();
        student.Study();
        
        Vehicle car = new Car("Toyota");
        car.StartEngine();
        car.Move();
        car.Stop();
    }
}`
  },
  {
    id: 5,
    title: "Advanced C# Features",
    description: "Explore LINQ, delegates, events, and async programming",
    topics: [
      {
        id: "delegates-events",
        title: "Delegates & Events",
        content: `Delegates and events power much of C sharp's event-driven programming model, from user interfaces to messaging systems.

In this topic you will:
- Learn what a delegate type is and how it represents a reference to a method with a specific signature.
- Create and use built-in delegate types such as Action, Func, and Predicate to pass behavior as parameters.
- Define and raise events on your own classes, and subscribe handlers that respond when something important happens.
- See how events help you decouple publishers from subscribers, so components can communicate without tight coupling.

By the end you will be able to build simple event-based systems where different parts of your application react to changes and notifications in a clean, testable way.`,
        duration: "70 min",
        difficulty: "Advanced",
        exercises: 8
      },
      {
        id: "async-await",
        title: "Async/Await",
        content: `Asynchronous programming with async and await lets your applications remain responsive while performing I O-bound work such as web requests or file operations.

In this topic you will:
- Understand the difference between synchronous, asynchronous, and parallel execution, and when each is appropriate.
- Mark methods as async and work with Task and Task of T to represent operations that complete in the future.
- Use await to write asynchronous code in a sequential style that is easier to read and reason about than callbacks.
- Learn best practices for error handling, cancellation, and avoiding deadlocks in asynchronous code.

You will convert blocking operations into asynchronous ones and see how this improves scalability and responsiveness without making your code hard to follow.`,
        duration: "65 min",
        difficulty: "Advanced",
        exercises: 7
      },
      {
        id: "exception-handling",
        title: "Exception Handling",
        content:
          `Exception handling is how C sharp reports and recovers from unexpected runtime errors such as invalid input, network failures, or file access problems.

In this topic you will:
- Use try, catch, and finally blocks to capture exceptions and ensure that cleanup code always runs.
- Catch specific exception types to handle different error conditions in targeted ways while still allowing unexpected errors to bubble up.
- Learn how to throw exceptions intentionally when your code encounters an unrecoverable situation or invalid state.
- Create custom exception types for domain-specific scenarios, making error messages clearer and easier to handle.

By the end you will know how to write robust code that fails gracefully and provides useful information when something goes wrong.`,
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 6
      },
      {
        id: "linq-advanced",
        title: "Advanced LINQ",
        content:
          `Once you know basic LINQ operators, you can combine them to express sophisticated data processing pipelines in only a few lines of code.

In this topic you will:
- Perform joins between sequences to combine related data from different sources, similar to database joins.
- Group data using GroupBy and then apply aggregations such as counts, sums, and averages on each group.
- Build multi-step queries that filter, project, sort, and aggregate data while keeping the intent clear.
- Understand when LINQ queries are evaluated and how deferred execution can impact performance and side effects.

You will implement non-trivial queries over in-memory collections and practice translating informal requirements into concise LINQ expressions.`,
        duration: "60 min",
        difficulty: "Advanced",
        exercises: 7
      }
    ],
    duration: "4.2 hours",
    exercises: 28,
    completed: false,
    codeExample: `using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// Delegates
delegate void Notify(string message);

class Program
{
    // Events
    public static event Notify OnNotify;
    
    static void Main(string[] args)
    {
        // Event subscription
        OnNotify += DisplayMessage;
        OnNotify?.Invoke("Event triggered!");
        
        // Delegate example
        Action<string> printAction = (msg) => Console.WriteLine(msg);
        printAction("Hello from delegate");
        
        Func<int, int, int> add = (a, b) => a + b;
        int result = add(5, 3);
        Console.WriteLine($"Sum: {result}");
        
        // Exception handling
        try
        {
            int divisor = 0;
            int resultDiv = 10 / divisor;
        }
        catch (DivideByZeroException ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Unexpected error: {ex.Message}");
        }
        finally
        {
            Console.WriteLine("Cleanup code here");
        }
        
        // Custom exception
        try
        {
            throw new CustomException("This is a custom error");
        }
        catch (CustomException ex)
        {
            Console.WriteLine($"Caught: {ex.Message}");
        }
        
        // Async/Await
        Task.Run(async () =>
        {
            await FetchDataAsync();
        }).Wait();
        
        // Advanced LINQ
        var people = new List<Person>
        {
            new Person("Alice", 25, "Engineer"),
            new Person("Bob", 30, "Designer"),
            new Person("Charlie", 25, "Engineer")
        };
        
        // Grouping
        var grouped = people.GroupBy(p => p.Profession);
        foreach (var group in grouped)
        {
            Console.WriteLine($"{group.Key}: {group.Count()} people");
        }
        
        // Joins
        var departments = new List<Department>
        {
            new Department("Engineer", "Engineering"),
            new Department("Designer", "Design")
        };
        
        var joined = from p in people
                     join d in departments on p.Profession equals d.Profession
                     select new { p.Name, d.DepartmentName };
    }
    
    static void DisplayMessage(string message)
    {
        Console.WriteLine(message);
    }
    
    static async Task<string> FetchDataAsync()
    {
        await Task.Delay(1000);
        return "Data fetched";
    }
}

// Custom exception
class CustomException : Exception
{
    public CustomException(string message) : base(message) { }
}

class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
    public string Profession { get; set; }
    
    public Person(string name, int age, string profession)
    {
        Name = name;
        Age = age;
        Profession = profession;
    }
}

class Department
{
    public string Profession { get; set; }
    public string DepartmentName { get; set; }
    
    public Department(string profession, string departmentName)
    {
        Profession = profession;
        DepartmentName = departmentName;
    }
}`
  },
  {
    id: 6,
    title: ".NET Framework & Libraries",
    description: "Work with .NET Framework and common libraries",
    topics: [
      {
        id: "file-io",
        title: "File I/O Operations",
        content:
          `Working with files is a common task in real applications, whether you are storing configuration, logs, or user data.

In this topic you will:
- Read and write text files using StreamReader, StreamWriter, and the convenience methods on the File class.
- Understand how file paths, directories, and relative versus absolute locations work on different operating systems.
- Learn to handle common errors such as missing files, permissions issues, and locked files gracefully.
- Use using statements or modern language constructs to ensure that streams and other unmanaged resources are disposed correctly.

By the end you will be comfortable performing basic file operations and building small utilities that persist and retrieve data on disk.`,
        duration: "60 min",
        difficulty: "Intermediate",
        exercises: 7
      },
      {
        id: "collections-advanced",
        title: "Advanced Collections",
        content:
          `Beyond lists and dictionaries, .NET provides additional collection types tuned for specific access patterns.

In this topic you will:
- Use queues to model first in, first out workflows such as job processing and message passing between components.
- Use stacks to model last in, first out scenarios such as undo stacks or expression evaluation.
- Explore linked lists and when their insertion and removal characteristics are preferable to arrays.
- See how these types implement common collection interfaces so they can be passed to methods that work with generic sequences.

You will design small scenarios that make good use of each collection type and understand how to pick the right tool for the job.`,
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 6
      },
      {
        id: "attributes-reflection",
        title: "Attributes & Reflection",
        content: `Attributes let you attach metadata to your code, and reflection lets you read that metadata at runtime to build flexible, configurable systems.

In this topic you will:
- Apply built-in attributes to classes, properties, and methods to influence frameworks such as serializers and ORMs.
- Create your own custom attributes to mark types with domain-specific information.
- Use reflection to inspect assemblies, types, members, and attribute values while your program is running.
- Discuss performance and safety considerations when using reflection and when it is better to avoid it.

By the end you will understand how attributes and reflection enable scenarios like plug-in architectures, dependency injection, and convention-based configuration.`,
        duration: "50 min",
        difficulty: "Advanced",
        exercises: 6
      },
      {
        id: "serialization",
        title: "Serialization",
        content: `Serialization is the process of converting objects into formats that can be stored or transmitted and then recreated later.

In this topic you will:
- Serialize and deserialize objects to and from JSON using modern .NET libraries.
- Understand when XML or binary formats are appropriate and what trade-offs they bring.
- Control which fields and properties are included in serialized output and how names and shapes are mapped.
- Handle versioning concerns so that your application can safely read data produced by older or newer versions of your types.

You will build small examples that save and load application state, demonstrating how serialization underpins web APIs, configuration systems, and caching.`,
        duration: "55 min",
        difficulty: "Advanced",
        exercises: 6
      }
    ],
    duration: "3.7 hours",
    exercises: 25,
    completed: false,
    codeExample: `using System;
using System.IO;
using System.Text.Json;
using System.Reflection;

class Program
{
    static void Main(string[] args)
    {
        // File I/O
        // Writing to file
        using (StreamWriter writer = new StreamWriter("data.txt"))
        {
            writer.WriteLine("Hello, World!");
            writer.WriteLine("This is a test file.");
        }
        
        // Reading from file
        using (StreamReader reader = new StreamReader("data.txt"))
        {
            string line;
            while ((line = reader.ReadLine()) != null)
            {
                Console.WriteLine(line);
            }
        }
        
        // File class methods
        string[] lines = File.ReadAllLines("data.txt");
        File.WriteAllText("output.txt", "New content");
        
        // Serialization (JSON)
        var person = new Person { Name = "Alice", Age = 25 };
        string json = JsonSerializer.Serialize(person);
        Console.WriteLine(json);
        
        Person deserialized = JsonSerializer.Deserialize<Person>(json);
        Console.WriteLine($"Name: {deserialized.Name}, Age: {deserialized.Age}");
        
        // Reflection
        Type type = typeof(Person);
        PropertyInfo[] properties = type.GetProperties();
        foreach (PropertyInfo prop in properties)
        {
            Console.WriteLine($"Property: {prop.Name}, Type: {prop.PropertyType.Name}");
        }
    }
}

class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
}`
  }
];


