export type CPPDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CPPTopic {
  id: string;
  title: string;
  content: string;
  duration: string;
  difficulty: CPPDifficulty;
  exercises: number;
}

export interface CPPModule {
  id: number;
  title: string;
  description: string;
  topics: CPPTopic[];
  duration: string;
  exercises: number;
  completed: boolean;
  codeExample: string;
}

export const cppModules: CPPModule[] = [
  {
    id: 1,
    title: "C++ Fundamentals",
    description: "Master the basics of C++ programming language",
    topics: [
      {
        id: "cpp-intro",
        title: "Introduction to C++",
        content: `C++ is a compiled, statically-typed language that grew out of C in the early 1980s, adding **classes, templates, and strong type checking** while staying close to the hardware.

In this topic you will:
- See how C++ evolved from C and why it is still heavily used for game engines, operating systems, browsers, finance, and embedded systems.
- Understand where C++ sits in the ecosystem compared to Java, C#, Rust, and Go.
- Learn what "zero-cost abstractions" means and how C++ lets you write both high-level and low-level code.
- Get a big-picture view of the **compile → link → run** pipeline (source files, headers, object files, libraries, and executables).
- Explore modern C++ standards (C++11, 14, 17, 20, 23) and why most new code targets at least C++17.

By the end of this lesson you should be able to explain when C++ is the right tool, what problems it excels at, and why performance‑critical products (databases, game engines, real‑time systems) often rely on it.`,
        duration: "40 min",
        difficulty: "Beginner",
        exercises: 4
      },
      {
        id: "cpp-syntax",
        title: "C++ Syntax & Structure",
        content: `Every C++ program starts from a **\`main\` function** inside one or more translation units (source files). In this topic you learn how the building blocks fit together.

Key ideas:
- The structure of a minimal program: \`#include\` directives, the \`std\` namespace, and the \`int main()\` entry point.
- How header files (\`.h/.hpp\`) declare functions, classes, and templates, while source files (\`.cpp\`) provide definitions.
- Why **namespaces** exist, how to use \`std::\` prefix correctly, and why \`using namespace std;\` is dangerous in headers.
- Statement vs expression syntax, semicolons, blocks \`{ }\`, comments, and formatting conventions that improve readability.
- How to compile a single-file program with common toolchains (GCC, Clang, MSVC) and what common compiler flags mean (\`-std=c++17\`, \`-O2\`, \`-Wall\`).

You will walk through a typical "Hello World" refactor into separate header and source files so you see real‑world C++ layout from day one.`,
        duration: "50 min",
        difficulty: "Beginner",
        exercises: 6
      },
      {
        id: "variables-types",
        title: "Variables & Data Types",
        content: `C++ exposes both **built-in primitive types** and rich user-defined types. To write correct and fast code, you must understand how values are stored and converted.

In this lesson you will learn:
- The core built-in types: \`bool\`, integer types (\`short\`, \`int\`, \`long\`, \`long long\`), floating‑point types (\`float\`, \`double\`, \`long double\`), and \`char\`.
- Type modifiers like \`signed\`, \`unsigned\`, \`const\`, and how they affect range and mutability.
- How initialization styles differ: **copy initialization** (\`int x = 5;\`), **direct initialization** (\`int x(5);\`), and **uniform initialization** with braces (\`int x{5};\`).
- The role of \`auto\` type deduction, when it’s helpful, and when it can hide dangerous implicit conversions.
- Safe vs unsafe casts: implicit promotions/demotions, \`static_cast\`, \`reinterpret_cast\`, and why C‑style casts should be avoided in new code.

You will practice choosing the right type for counters, IDs, money, and flags, and see how small type mistakes can lead to overflow or subtle bugs.`,
        duration: "55 min",
        difficulty: "Beginner",
        exercises: 6
      },
      {
        id: "io-operations",
        title: "Input/Output Operations",
        content: `Real programs talk to users and files. C++ uses **streams** for text and binary I/O, which provide a unified way to read and write data.

What you cover:
- The standard streams: \`std::cin\` (input), \`std::cout\` (normal output), \`std::cerr\` (errors), and \`std::clog\`.
- Extracting and inserting data with the \`>>\` and \`<<\` operators, including common pitfalls with whitespace and mixing \`std::getline\` with formatted extraction.
- Using manipulators like \`std::fixed\`, \`std::setprecision\`, \`std::setw\`, and \`std::left/right\` to create nicely formatted console tables.
- Basic file I/O with \`std::ifstream\`, \`std::ofstream\`, and \`std::fstream\`: opening, closing, checking \`.good()\`/\`.fail()\` flags, and handling errors gracefully.
- The difference between buffered and unbuffered I/O, and why flushing output matters when building interactive tools.

By the end you will be comfortable building a simple console application that prompts the user, validates input, and writes a small report to a text file.`,
        duration: "45 min",
        difficulty: "Beginner",
        exercises: 5
      }
    ],
    duration: "3.2 hours",
    exercises: 21,
    completed: false,
    codeExample: `#include <iostream>
#include <string>
using namespace std;

// Your first C++ program
int main() {
    cout << "Hello, World!" << endl;
    
    // Variables and data types
    string name = "Alice";
    int age = 25;
    double height = 5.6;
    bool isStudent = true;
    
    // Basic operations
    int result = 10 + 5 * 2;
    cout << "Result: " << result << endl;
    
    // String concatenation
    cout << "Welcome, " << name << "! You are " << age << " years old." << endl;
    
    // Type conversion
    int ageInt = static_cast<int>(25.5);
    double ageDouble = static_cast<double>(age);
    
    // Input
    cout << "Enter your name: ";
    cin >> name;
    cout << "Hello, " << name << "!" << endl;
    
    // Conditional statement
    if (age >= 18) {
        cout << "You are an adult" << endl;
    } else {
        cout << "You are a minor" << endl;
    }
    
    return 0;
}`
  },
  {
    id: 2,
    title: "Control Structures & Functions",
    description: "Master conditional statements, loops, and function creation",
    topics: [
      {
        id: "conditionals",
        title: "Conditional Statements",
        content: `Conditional logic lets your program take different paths depending on data. In C++ you combine **\`if/else\`**, **\`switch\`**, and conditional expressions to express decisions clearly.

In this topic you will:
- Review the syntax of \`if\`, \`else if\`, and \`else\`, and how conditions are evaluated as booleans (including what counts as "true" and "false").
- Learn best practices for writing readable branching logic: early returns, avoiding deeply nested ladders, and grouping related checks.
- Understand when to use \`switch\` on integral or enum values, how \`case\` labels work, why you almost always need \`break\`, and how C++17’s \`switch\` + \`enum class\` combine well.
- Use the **ternary operator** \`condition ? a : b\` for small value‑level decisions while avoiding overuse that hurts readability.
- See common bugs like using \`=\` instead of \`==\` in conditions, accidental fall‑through in \`switch\`, and missing default branches.

You will refactor verbose, repetitive \`if\` chains into cleaner \`switch\` statements and small helper functions.`,
        duration: "55 min",
        difficulty: "Beginner",
        exercises: 6
      },
      {
        id: "loops",
        title: "Loops & Iteration",
        content: `Loops let you process arrays, containers, and streams of data efficiently. C++ offers several loop forms, each suited to different patterns.

Key concepts:
- Classic \`for\` loops with an index, and when to prefer **range‑based for loops** (\`for (auto &x : container)\`) for clarity and safety.
- \`while\` loops for situations where the number of iterations is not known in advance, and \`do { } while()\` when you must run the body at least once.
- Loop control statements: \`break\`, \`continue\`, and how to manage multiple nested loops without confusing control flow.
- Off‑by‑one errors, infinite loops, and techniques like "loop invariants" to reason about correctness.
- How to iterate over raw arrays vs STL containers (\`std::vector\`, \`std::array\`, etc.), and why iterators are the foundation of most modern C++ loops.

You will implement small patterns like summing a series, searching arrays, and scanning input until EOF, building confidence with each loop construct.`,
        duration: "60 min",
        difficulty: "Beginner",
        exercises: 7
      },
      {
        id: "functions-basic",
        title: "Function Basics",
        content: `Functions break complex logic into **small, reusable building blocks**. In C++ they also participate in overload resolution and templates, so getting the basics right is essential.

In this lesson you will:
- Define and call functions with parameters and return values, including \`void\` vs non‑\`void\` functions.
- Understand the difference between **declarations** (prototypes) and **definitions**, and how they interact with header/source separation.
- Learn how arguments are passed (by value vs by reference vs by pointer) and how this affects performance and mutability of data.
- Use **default arguments** in function parameters to reduce boilerplate when many calls share common values.
- See how **function overloading** works: same name, different parameter types/arity, and what rules the compiler uses to choose the best match.

You will design a small utility library of math/helper functions and practice splitting declarations into headers and implementations into \`.cpp\` files.`,
        duration: "65 min",
        difficulty: "Beginner",
        exercises: 8
      },
      {
        id: "functions-advanced",
        title: "Advanced Functions",
        content: `Beyond basic functions, C++ gives you powerful tools for performance and abstraction.

Topics covered:
- **Inline functions** and when the \`inline\` keyword is appropriate (ODR, multiple definitions across translation units) vs when the optimizer inlines automatically.
- Function pointers and callable types: how to store and pass behaviour around, and why modern C++ often prefers \`std::function\` or templates instead.
- Overview of **lambda expressions** as anonymous, inline functions you can pass to algorithms like \`std::sort\` and \`std::for_each\`.
- \`constexpr\` functions and compile‑time evaluation: when it’s useful to shift work from runtime to compile time.
- The basics of recursion, tail recursion, and when iterative solutions are safer or more efficient in C++.

After this topic you’ll be comfortable reading and writing function declarations in real codebases, including APIs that use callbacks or small lambda predicates.`,
        duration: "60 min",
        difficulty: "Intermediate",
        exercises: 7
      }
    ],
    duration: "4 hours",
    exercises: 28,
    completed: false,
    codeExample: `#include <iostream>
using namespace std;

// Function declaration
int add(int a, int b);
void greet(string name);

int main() {
    // Conditional statements
    int age = 18;
    if (age >= 18) {
        cout << "You can vote" << endl;
    } else if (age >= 16) {
        cout << "You can drive" << endl;
    } else {
        cout << "You're too young" << endl;
    }
    
    // Switch statement
    int day = 1;
    switch (day) {
        case 1:
            cout << "Monday" << endl;
            break;
        case 2:
            cout << "Tuesday" << endl;
            break;
        default:
            cout << "Other day" << endl;
    }
    
    // For loop
    for (int i = 0; i < 5; i++) {
        cout << "Count: " << i << endl;
    }
    
    // While loop
    int count = 0;
    while (count < 5) {
        cout << count << endl;
        count++;
    }
    
    // Do-while loop
    int num = 0;
    do {
        cout << num << endl;
        num++;
    } while (num < 5);
    
    // Function call
    int result = add(5, 3);
    cout << "Sum: " << result << endl;
    greet("Alice");
    
    // Function overloading
    cout << add(5, 3) << endl;
    cout << add(5.5, 3.2) << endl;
    
    return 0;
}

// Function definition
int add(int a, int b) {
    return a + b;
}

double add(double a, double b) {
    return a + b;
}

void greet(string name) {
    cout << "Hello, " << name << "!" << endl;
}

// Function with default parameters
void printInfo(string name, int age = 18) {
    cout << name << " is " << age << " years old" << endl;
}`
  },
  {
    id: 3,
    title: "Arrays, Strings & Pointers",
    description: "Work with arrays, strings, and understand pointers",
    topics: [
      {
        id: "arrays",
        title: "Arrays",
        content: "Create and manipulate arrays, multidimensional arrays, and array operations.",
        duration: "65 min",
        difficulty: "Beginner",
        exercises: 7
      },
      {
        id: "strings",
        title: "Strings",
        content: "Work with C-style strings and C++ string class, string operations and methods.",
        duration: "60 min",
        difficulty: "Beginner",
        exercises: 7
      },
      {
        id: "pointers-basic",
        title: "Pointers Basics",
        content: "Understand pointers, pointer arithmetic, and pointer operations.",
        duration: "70 min",
        difficulty: "Intermediate",
        exercises: 8
      },
      {
        id: "references",
        title: "References",
        content: "Use references, understand reference vs pointer, and pass by reference.",
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 6
      }
    ],
    duration: "4.2 hours",
    exercises: 28,
    completed: false,
    codeExample: `#include <iostream>
#include <string>
using namespace std;

int main() {
    // Arrays
    int numbers[5] = {1, 2, 3, 4, 5};
    int arr[3][3] = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
    
    // Accessing array elements
    cout << numbers[0] << endl;
    numbers[0] = 10;
    
    // Iterating through array
    for (int i = 0; i < 5; i++) {
        cout << numbers[i] << " ";
    }
    cout << endl;
    
    // Strings
    string str = "Hello, World!";
    cout << str.length() << endl;
    cout << str.substr(0, 5) << endl;  // "Hello"
    
    // String operations
    string name = "Alice";
    string greeting = "Hello, " + name + "!";
    cout << greeting << endl;
    
    // Pointers
    int x = 10;
    int* ptr = &x;  // Pointer to x
    cout << "Value: " << *ptr << endl;  // Dereference
    cout << "Address: " << ptr << endl;
    
    // Pointer arithmetic
    int arr2[5] = {1, 2, 3, 4, 5};
    int* p = arr2;
    for (int i = 0; i < 5; i++) {
        cout << *(p + i) << " ";
    }
    cout << endl;
    
    // Dynamic memory allocation
    int* dynamic = new int[5];
    for (int i = 0; i < 5; i++) {
        dynamic[i] = i * 2;
    }
    delete[] dynamic;  // Free memory
    
    // References
    int value = 10;
    int& ref = value;  // Reference to value
    ref = 20;  // Changes value
    cout << value << endl;  // 20
    
    return 0;
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
        content: "Create classes, instantiate objects, and understand encapsulation.",
        duration: "70 min",
        difficulty: "Intermediate",
        exercises: 8
      },
      {
        id: "constructors-destructors",
        title: "Constructors & Destructors",
        content: "Learn about constructors, destructors, copy constructors, and move constructors.",
        duration: "65 min",
        difficulty: "Intermediate",
        exercises: 7
      },
      {
        id: "inheritance",
        title: "Inheritance & Polymorphism",
        content: "Create class hierarchies, inherit from base classes, and use virtual functions.",
        duration: "75 min",
        difficulty: "Intermediate",
        exercises: 9
      },
      {
        id: "operator-overloading",
        title: "Operator Overloading",
        content: "Overload operators to work with custom types and create intuitive interfaces.",
        duration: "60 min",
        difficulty: "Advanced",
        exercises: 7
      }
    ],
    duration: "4.5 hours",
    exercises: 31,
    completed: false,
    codeExample: `#include <iostream>
#include <string>
using namespace std;

// Class definition
class Person {
private:
    string name;
    int age;
    
public:
    // Constructor
    Person(string n, int a) : name(n), age(a) {
        cout << "Person created: " << name << endl;
    }
    
    // Destructor
    ~Person() {
        cout << "Person destroyed: " << name << endl;
    }
    
    // Copy constructor
    Person(const Person& other) : name(other.name), age(other.age) {
        cout << "Person copied" << endl;
    }
    
    // Getters
    string getName() const { return name; }
    int getAge() const { return age; }
    
    // Setters
    void setName(string n) { name = n; }
    void setAge(int a) { age = a; }
    
    // Method
    virtual void display() const {
        cout << "Name: " << name << ", Age: " << age << endl;
    }
};

// Inheritance
class Student : public Person {
private:
    string studentId;
    
public:
    Student(string n, int a, string id) : Person(n, a), studentId(id) {}
    
    // Method overriding
    void display() const override {
        Person::display();
        cout << "Student ID: " << studentId << endl;
    }
    
    void study() {
        cout << getName() << " is studying" << endl;
    }
};

// Operator overloading
class Vector {
private:
    int x, y;
    
public:
    Vector(int x, int y) : x(x), y(y) {}
    
    // Operator overloading
    Vector operator+(const Vector& other) const {
        return Vector(x + other.x, y + other.y);
    }
    
    Vector operator-(const Vector& other) const {
        return Vector(x - other.x, y - other.y);
    }
    
    bool operator==(const Vector& other) const {
        return x == other.x && y == other.y;
    }
    
    friend ostream& operator<<(ostream& os, const Vector& v) {
        os << "(" << v.x << ", " << v.y << ")";
        return os;
    }
};

int main() {
    // Creating objects
    Person person("Alice", 25);
    person.display();
    
    Student student("Bob", 20, "S12345");
    student.display();
    student.study();
    
    // Operator overloading
    Vector v1(1, 2);
    Vector v2(3, 4);
    Vector v3 = v1 + v2;
    cout << v3 << endl;
    
    return 0;
}`
  },
  {
    id: 5,
    title: "STL & Templates",
    description: "Work with Standard Template Library and template programming",
    topics: [
      {
        id: "stl-containers",
        title: "STL Containers",
        content: "Use vector, list, deque, map, set, and other STL containers.",
        duration: "70 min",
        difficulty: "Intermediate",
        exercises: 8
      },
      {
        id: "stl-algorithms",
        title: "STL Algorithms",
        content: "Use STL algorithms like sort, find, transform, and accumulate.",
        duration: "65 min",
        difficulty: "Intermediate",
        exercises: 7
      },
      {
        id: "function-templates",
        title: "Function Templates",
        content: "Create generic functions using templates and template specialization.",
        duration: "60 min",
        difficulty: "Advanced",
        exercises: 6
      },
      {
        id: "class-templates",
        title: "Class Templates",
        content: "Create generic classes using templates and template parameters.",
        duration: "65 min",
        difficulty: "Advanced",
        exercises: 7
      }
    ],
    duration: "4.3 hours",
    exercises: 28,
    completed: false,
    codeExample: `#include <iostream>
#include <vector>
#include <list>
#include <map>
#include <set>
#include <algorithm>
#include <numeric>
using namespace std;

// Function template
template<typename T>
T maximum(T a, T b) {
    return (a > b) ? a : b;
}

// Class template
template<typename T>
class Stack {
private:
    vector<T> elements;
    
public:
    void push(const T& element) {
        elements.push_back(element);
    }
    
    void pop() {
        if (!elements.empty()) {
            elements.pop_back();
        }
    }
    
    T top() const {
        return elements.back();
    }
    
    bool empty() const {
        return elements.empty();
    }
};

int main() {
    // Vector
    vector<int> numbers = {3, 1, 4, 1, 5, 9, 2, 6};
    numbers.push_back(5);
    numbers.pop_back();
    
    // Iterating
    for (auto it = numbers.begin(); it != numbers.end(); ++it) {
        cout << *it << " ";
    }
    cout << endl;
    
    // Range-based for loop
    for (int num : numbers) {
        cout << num << " ";
    }
    cout << endl;
    
    // List
    list<string> fruits = {"apple", "banana", "orange"};
    fruits.push_front("grape");
    fruits.remove("banana");
    
    // Map
    map<string, int> ages;
    ages["Alice"] = 25;
    ages["Bob"] = 30;
    ages["Charlie"] = 28;
    
    for (const auto& pair : ages) {
        cout << pair.first << ": " << pair.second << endl;
    }
    
    // Set
    set<int> uniqueNumbers = {1, 2, 3, 3, 4, 4, 5};
    for (int num : uniqueNumbers) {
        cout << num << " ";
    }
    cout << endl;
    
    // STL Algorithms
    vector<int> nums = {3, 1, 4, 1, 5, 9, 2, 6};
    
    // Sort
    sort(nums.begin(), nums.end());
    
    // Find
    auto it = find(nums.begin(), nums.end(), 5);
    if (it != nums.end()) {
        cout << "Found: " << *it << endl;
    }
    
    // Transform
    vector<int> doubled;
    transform(nums.begin(), nums.end(), back_inserter(doubled),
              [](int x) { return x * 2; });
    
    // Accumulate
    int sum = accumulate(nums.begin(), nums.end(), 0);
    cout << "Sum: " << sum << endl;
    
    // Count
    int count = count_if(nums.begin(), nums.end(),
                        [](int x) { return x % 2 == 0; });
    cout << "Even numbers: " << count << endl;
    
    // Function template
    cout << maximum(5, 10) << endl;
    cout << maximum(5.5, 3.2) << endl;
    cout << maximum(string("apple"), string("banana")) << endl;
    
    // Class template
    Stack<int> intStack;
    intStack.push(1);
    intStack.push(2);
    intStack.push(3);
    
    while (!intStack.empty()) {
        cout << intStack.top() << " ";
        intStack.pop();
    }
    cout << endl;
    
    return 0;
}`
  },
  {
    id: 6,
    title: "Advanced C++ Features",
    description: "Master advanced C++ concepts and modern C++ features",
    topics: [
      {
        id: "smart-pointers",
        title: "Smart Pointers",
        content: "Use unique_ptr, shared_ptr, weak_ptr for automatic memory management.",
        duration: "70 min",
        difficulty: "Advanced",
        exercises: 8
      },
      {
        id: "lambda-expressions",
        title: "Lambda Expressions",
        content: "Create lambda functions, capture variables, and use with STL algorithms.",
        duration: "60 min",
        difficulty: "Advanced",
        exercises: 7
      },
      {
        id: "move-semantics",
        title: "Move Semantics",
        content: "Understand rvalue references, move constructors, and perfect forwarding.",
        duration: "65 min",
        difficulty: "Advanced",
        exercises: 7
      },
      {
        id: "multithreading",
        title: "Multithreading",
        content: "Create threads, use mutexes, condition variables, and async operations.",
        duration: "75 min",
        difficulty: "Advanced",
        exercises: 8
      }
    ],
    duration: "4.5 hours",
    exercises: 30,
    completed: false,
    codeExample: `#include <iostream>
#include <memory>
#include <thread>
#include <mutex>
#include <vector>
#include <algorithm>
using namespace std;

// Smart pointers
void smartPointerExample() {
    // unique_ptr
    unique_ptr<int> ptr1 = make_unique<int>(10);
    cout << *ptr1 << endl;
    
    // shared_ptr
    shared_ptr<int> ptr2 = make_shared<int>(20);
    shared_ptr<int> ptr3 = ptr2;  // Shared ownership
    cout << "Reference count: " << ptr2.use_count() << endl;
    
    // weak_ptr
    weak_ptr<int> weak = ptr2;
    if (auto shared = weak.lock()) {
        cout << "Value: " << *shared << endl;
    }
}

// Lambda expressions
void lambdaExample() {
    vector<int> numbers = {1, 2, 3, 4, 5};
    
    // Simple lambda
    auto square = [](int x) { return x * x; };
    cout << square(5) << endl;
    
    // Lambda with capture
    int multiplier = 3;
    auto multiply = [multiplier](int x) { return x * multiplier; };
    
    // Lambda with STL
    for_each(numbers.begin(), numbers.end(),
             [](int n) { cout << n << " "; });
    cout << endl;
    
    // Lambda with capture by reference
    int sum = 0;
    for_each(numbers.begin(), numbers.end(),
             [&sum](int n) { sum += n; });
    cout << "Sum: " << sum << endl;
}

// Move semantics
class Resource {
private:
    int* data;
    
public:
    Resource(int size) {
        data = new int[size];
        cout << "Resource created" << endl;
    }
    
    // Move constructor
    Resource(Resource&& other) noexcept : data(other.data) {
        other.data = nullptr;
        cout << "Resource moved" << endl;
    }
    
    // Move assignment
    Resource& operator=(Resource&& other) noexcept {
        if (this != &other) {
            delete[] data;
            data = other.data;
            other.data = nullptr;
        }
        return *this;
    }
    
    ~Resource() {
        delete[] data;
        cout << "Resource destroyed" << endl;
    }
};

// Multithreading
mutex mtx;

void printNumber(int num) {
    lock_guard<mutex> lock(mtx);
    cout << "Thread " << this_thread::get_id() 
         << " printing: " << num << endl;
}

void multithreadingExample() {
    vector<thread> threads;
    
    for (int i = 0; i < 5; i++) {
        threads.emplace_back(printNumber, i);
    }
    
    for (auto& t : threads) {
        t.join();
    }
}

int main() {
    smartPointerExample();
    lambdaExample();
    
    Resource res1(10);
    Resource res2 = move(res1);  // Move semantics
    
    multithreadingExample();
    
    return 0;
}`
  }
];


