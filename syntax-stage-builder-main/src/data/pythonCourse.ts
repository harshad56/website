export type PythonDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface PythonTopic {
  id: string;
  title: string;
  content: string;
  duration: string;
  difficulty: PythonDifficulty;
  exercises: number;
}

export interface PythonModule {
  id: number;
  title: string;
  description: string;
  topics: PythonTopic[];
  duration: string;
  exercises: number;
  completed: boolean;
  codeExample: string;
}

export const pythonModules: PythonModule[] = [
    {
      id: 1,
      title: "Python Fundamentals",
      description: "Master the basics of Python programming language",
      topics: [
        {
          id: "python-intro",
          title: "Introduction to Python",
          content: "Python is a high-level, interpreted programming language known for its simplicity and readability. Created by Guido van Rossum in 1991, Python supports multiple programming paradigms including procedural, object-oriented, and functional programming. It's widely used in web development (Django, Flask), data science (Pandas, NumPy), machine learning (TensorFlow, PyTorch), automation, and artificial intelligence. Python uses dynamic typing and has a comprehensive standard library, making it ideal for beginners and professionals alike.",
          duration: "35 min",
          difficulty: "Beginner",
          exercises: 4
        },
        {
          id: "python-syntax",
          title: "Python Syntax & Structure",
          content: "Python's syntax is clean and resembles natural English, making it easy to read and write. Key features include: (1) Indentation-based code blocks - whitespace is significant and defines code structure, (2) Comments - using # for single-line and triple quotes for multi-line comments, (3) No semicolons required at line endings, (4) Dynamic typing - variable types are determined at runtime, (5) Case-sensitive - variable names distinguish between uppercase and lowercase letters.",
          duration: "40 min",
          difficulty: "Beginner",
          exercises: 5
        },
        {
          id: "variables-types",
          title: "Variables & Data Types",
          content: "Variables in Python don't require type declaration. Python supports these basic data types: (1) Integers (int) - whole numbers both positive and negative, (2) Floats (float) - decimal numbers, (3) Strings (str) - sequences of characters enclosed in quotes, (4) Booleans (bool) - True or False values, (5) None - represents absence of value. Use type() function to check data type of a variable. Type conversion can be done using int(), float(), str(), bool() functions. Python automatically handles type coercion in operations when appropriate.",
          duration: "45 min",
          difficulty: "Beginner",
          exercises: 6
        },
        {
          id: "operators-expressions",
          title: "Operators & Expressions",
          content: "Python supports various operators: (1) Arithmetic: +, -, *, /, //, %, ** for addition, subtraction, multiplication, division, floor division, modulus, exponentiation. (2) Comparison: ==, !=, <, >, <=, >= for equality and relational comparisons. (3) Logical: and, or, not for boolean operations. (4) Assignment: =, +=, -=, etc. for variable assignment. (5) Membership: in, not in for checking membership in sequences. (6) Identity: is, is not for comparing object identity. Expression evaluation follows operator precedence: parentheses, exponentiation, multiplication/division/modulus, addition/subtraction.",
          duration: "40 min",
          difficulty: "Beginner",
          exercises: 5
        }
      ],
      duration: "2.7 hours",
      exercises: 20,
      completed: false,
      codeExample: `# Your first Python program
print("Hello, World!")

# Variables and data types
name = "Alice"
age = 25
height = 5.6
is_student = True

# Basic operations
result = 10 + 5 * 2
print(f"Result: {result}")

# String formatting with f-strings
message = f"Welcome, {name}! You are {age} years old."
print(message)

# Type conversion
age_str = str(age)
age_int = int("25")

# Conditional statement
if age >= 18:
    print("You are an adult")
else:
    print("You are a minor")

# Multiple conditions
if age < 13:
    print("Child")
elif age < 20:
    print("Teenager")
else:
    print("Adult")`
    },
    {
      id: 2,
      title: "Control Flow & Functions",
      description: "Master conditional statements, loops, and function creation",
      topics: [
        {
          id: "conditionals",
          title: "Conditional Statements",
          content: "Conditional statements allow your program to execute different code based on different conditions. Python uses if, elif (else if), and else keywords for branching. Syntax: if condition: (execute if true), elif condition: (execute if previous false but this true), else: (execute if all above false). Conditions evaluate to boolean values. You can use comparison operators (<, >, ==, !=, <=, >=), logical operators (and, or, not), and membership operators (in, not in). Python also supports ternary operator: value_if_true if condition else value_if_false.",
          duration: "50 min",
          difficulty: "Beginner",
          exercises: 6
        },
        {
          id: "loops",
          title: "Loops & Iteration",
          content: "Loops allow you to execute a block of code repeatedly. (1) For loops - iterate over sequences (lists, tuples, strings, etc.) or use range(). Syntax: for item in sequence: block. (2) While loops - execute code while a condition is true. Syntax: while condition: block. (3) Loop control: break - exits loop immediately, continue - skips current iteration and goes to next, pass - does nothing. (4) else clause with loops - executes if loop completes without break. (5) Nested loops - loops inside loops for complex iterations.",
          duration: "55 min",
          difficulty: "Beginner",
          exercises: 7
        },
        {
          id: "functions-basic",
          title: "Function Basics",
          content: "Functions are reusable blocks of code that perform specific tasks. Define functions using def keyword: def function_name(parameters):. Parameters are input values; default parameters can be specified. Return statement sends value back to caller. Docstrings (triple-quoted strings) document function purpose and usage. Function scope: local variables exist only within function, global variables accessible everywhere. Call functions using function_name(arguments). Arguments can be positional or keyword-based. Functions can return multiple values as tuple: return value1, value2.",
          duration: "60 min",
          difficulty: "Beginner",
          exercises: 8
        },
        {
          id: "functions-advanced",
          title: "Advanced Functions",
          content: "Lambda functions are anonymous functions defined with lambda keyword for simple operations: lambda x: x ** 2. *args allows variable number of positional arguments, **kwargs for keyword arguments. List comprehensions create lists compactly: [expr for item in sequence if condition]. Decorators modify function behavior using @decorator syntax. Generators use yield keyword to produce values lazily, reducing memory usage. Functions are first-class objects - can be passed as arguments, returned from functions, and assigned to variables.",
          duration: "65 min",
          difficulty: "Intermediate",
          exercises: 9
        }
      ],
      duration: "3.8 hours",
      exercises: 30,
      completed: false,
      codeExample: `# Conditional statements
age = 18
if age >= 18:
    print("You can vote")
elif age >= 16:
    print("You can drive")
else:
    print("You're too young")

# For loops
fruits = ["apple", "banana", "orange"]
for fruit in fruits:
    print(fruit)

# Range function
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

for i in range(1, 6):
    print(i)  # 1, 2, 3, 4, 5

# While loops
count = 0
while count < 5:
    print(count)
    count += 1

# Function definition
def greet(name, age=18):
    """Greet a person with their name and age."""
    return f"Hello, {name}! You are {age} years old."

# Function call
message = greet("Alice", 25)
print(message)

# Lambda functions
square = lambda x: x ** 2
print(square(5))  # 25

# List comprehension
squares = [x**2 for x in range(10)]
print(squares)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# Generator
def count_up_to(max):
    count = 1
    while count <= max:
        yield count
        count += 1

for num in count_up_to(5):
    print(num)`
    },
    {
      id: 3,
      title: "Data Structures",
      description: "Work with lists, tuples, dictionaries, and sets",
      topics: [
        {
          id: "lists",
          title: "Lists & List Methods",
          content: "Lists are ordered, mutable sequences that can contain items of different types. Create with square brackets: [1, 2, 3] or list(). Access elements using index (0-based): list[0]. Methods include: append() - add to end, insert() - add at specific position, remove() - delete first occurrence, pop() - delete and return at index, clear() - remove all items, sort() - sort in place, reverse() - reverse order, index() - find position, count() - count occurrences, extend() - add multiple items, copy() - shallow copy. Lists are mutable - you can modify them after creation.",
          duration: "60 min",
          difficulty: "Beginner",
          exercises: 8
        },
        {
          id: "tuples",
          title: "Tuples",
          content: "Tuples are ordered, immutable sequences created with parentheses: (1, 2, 3) or tuple(). Access elements like lists using indexing. Because they're immutable, tuples are faster and safer for fixed data. Single-element tuple requires trailing comma: (1,). Tuple unpacking: a, b, c = (1, 2, 3). Methods are limited: count() - count occurrences, index() - find position. Use tuples as dictionary keys (since dicts require hashable keys), in sets, and for returning multiple values from functions. Tuple concatenation and repetition work similarly to strings.",
          duration: "40 min",
          difficulty: "Beginner",
          exercises: 5
        },
        {
          id: "dictionaries",
          title: "Dictionaries",
          content: "Dictionaries store key-value pairs using curly braces: {'key': 'value'}. Keys must be unique and immutable (strings, numbers, tuples). Access values with dict[key]. Methods include: keys() - get all keys, values() - get all values, items() - get key-value pairs, get() - safe access with default, pop() - remove and return value, update() - merge dictionaries, clear() - remove all, copy() - shallow copy. Iteration: for key in dict:, for key, value in dict.items():. Dictionary comprehensions create dictionaries compactly: {k: v for k, v in items}. Nested dictionaries organize complex hierarchical data.",
          duration: "55 min",
          difficulty: "Beginner",
          exercises: 7
        },
        {
          id: "sets",
          title: "Sets",
          content: "Sets are unordered collections of unique, immutable elements: {1, 2, 3} or set(). Duplicate values are automatically removed. Methods include: add() - add single element, update() - add multiple, remove() - remove element (error if missing), discard() - remove safely, clear() - remove all. Set operations: union (|, union()), intersection (&, intersection()), difference (-, difference()), symmetric_difference (^). Set comprehensions: {expr for item in sequence}. Use sets for membership testing (fast O(1) lookup) and eliminating duplicates from lists. Frozensets are immutable versions usable as dict keys.",
          duration: "45 min",
          difficulty: "Beginner",
          exercises: 6
        }
      ],
      duration: "3.3 hours",
      exercises: 26,
      completed: false,
      codeExample: `# Lists
fruits = ["apple", "banana", "orange"]
fruits.append("grape")
fruits.insert(1, "mango")
fruits.remove("banana")
print(fruits)

# List methods
numbers = [3, 1, 4, 1, 5, 9, 2, 6]
numbers.sort()
print(numbers)  # [1, 1, 2, 3, 4, 5, 6, 9]
numbers.reverse()
print(numbers)  # [9, 6, 5, 4, 3, 2, 1, 1]

# List comprehension
squares = [x**2 for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]

# Tuples
coordinates = (10, 20)
x, y = coordinates  # Unpacking
print(f"X: {x}, Y: {y}")

# Dictionaries
person = {
    "name": "Alice",
    "age": 25,
    "city": "New York"
}

# Accessing values
print(person["name"])
print(person.get("age", 0))  # Safe access with default

# Dictionary methods
person["email"] = "alice@example.com"
person.update({"country": "USA"})
print(person.keys())
print(person.values())
print(person.items())

# Dictionary comprehension
squares_dict = {x: x**2 for x in range(5)}
print(squares_dict)  # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# Sets
fruits_set = {"apple", "banana", "orange"}
fruits_set.add("grape")
fruits_set.remove("banana")

# Set operations
set1 = {1, 2, 3, 4}
set2 = {3, 4, 5, 6}
union = set1 | set2  # {1, 2, 3, 4, 5, 6}
intersection = set1 & set2  # {3, 4}
difference = set1 - set2  # {1, 2}`
    },
    {
      id: 4,
      title: "Object-Oriented Programming",
      description: "Learn classes, objects, inheritance, and polymorphism",
      topics: [
        {
          id: "classes-objects",
          title: "Classes & Objects",
          content: "Classes are blueprints for creating objects. Define class with class keyword: class ClassName:. Objects are instances of classes created with ClassName(). Attributes are variables attached to objects. Instance attributes are specific to each object, class attributes shared by all instances. Access attributes using dot notation: object.attribute. Everything in Python is an object with associated type, value, and methods. OOP principles: Encapsulation - bundling data and methods, Inheritance - creating hierarchies, Polymorphism - different objects responding to same interface, Abstraction - hiding complexity.",
          duration: "65 min",
          difficulty: "Intermediate",
          exercises: 8
        },
        {
          id: "methods-constructors",
          title: "Methods & Constructors",
          content: "__init__() is the constructor called when object is created. self refers to the instance. Instance methods operate on individual instances and receive self parameter. Class methods use @classmethod decorator and receive cls instead of self, operating on class level. Static methods use @staticmethod and don't receive self or cls, like regular functions but belong to class namespace. __del__() is the destructor called when object is destroyed. Methods can have default parameters. Use super() to call parent class methods in inheritance scenarios.",
          duration: "55 min",
          difficulty: "Intermediate",
          exercises: 7
        },
        {
          id: "inheritance",
          title: "Inheritance & Polymorphism",
          content: "Inheritance allows classes to inherit attributes and methods from parent classes. Syntax: class Child(Parent):. Method overriding - define method with same name in child to customize behavior. super() calls parent's methods. Multiple inheritance possible with class Child(Parent1, Parent2):. Polymorphism allows objects of different classes to be treated same way through common interface. isinstance() checks if object is instance of class. Method resolution order (MRO) determines method lookup sequence. Abstract base classes and interfaces enforce contracts for subclasses.",
          duration: "60 min",
          difficulty: "Intermediate",
          exercises: 8
        },
        {
          id: "special-methods",
          title: "Special Methods & Properties",
          content: "Magic methods (dunder methods) control object behavior: __str__() for string representation, __repr__() for formal representation, __len__() for length, __getitem__() for indexing, __setitem__() for assignment, __eq__() for equality, __lt__() for comparison. @property decorator makes method accessible as attribute: @property then method becomes getter. @method.setter creates setter. Properties enable controlled access to attributes with validation. Descriptors provide fine-grained attribute access control through __get__(), __set__(), __delete__() methods.",
          duration: "50 min",
          difficulty: "Intermediate",
          exercises: 6
        }
      ],
      duration: "3.8 hours",
      exercises: 29,
      completed: false,
      codeExample: `# Class definition
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def greet(self):
        return f"Hello, I'm {self.name}"
    
    def __str__(self):
        return f"Person(name={self.name}, age={self.age})"

# Creating objects
person1 = Person("Alice", 25)
print(person1.greet())
print(person1)

# Inheritance
class Student(Person):
    def __init__(self, name, age, student_id):
        super().__init__(name, age)
        self.student_id = student_id
    
    def study(self):
        return f"{self.name} is studying"
    
    def greet(self):  # Method overriding
        return f"Hello, I'm student {self.name} with ID {self.student_id}"

student = Student("Bob", 20, "S12345")
print(student.greet())
print(student.study())

# Class methods and static methods
class MathUtils:
    PI = 3.14159
    
    @classmethod
    def circle_area(cls, radius):
        return cls.PI * radius ** 2
    
    @staticmethod
    def add(a, b):
        return a + b

print(MathUtils.circle_area(5))
print(MathUtils.add(3, 4))

# Properties
class Temperature:
    def __init__(self, celsius):
        self._celsius = celsius
    
    @property
    def celsius(self):
        return self._celsius
    
    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Temperature below absolute zero")
        self._celsius = value
    
    @property
    def fahrenheit(self):
        return self._celsius * 9/5 + 32

temp = Temperature(25)
print(f"{temp.celsius}°C = {temp.fahrenheit}°F")`
    },
    {
      id: 5,
      title: "File Handling & Exception Handling",
      description: "Work with files and handle errors gracefully",
      topics: [
        {
          id: "file-operations",
          title: "File Operations",
          content: "Use open(filename, mode) to open files. Modes: 'r' - read, 'w' - write (overwrites), 'a' - append, 'rb' - read binary, 'wb' - write binary. Methods: read() - read entire file, readline() - read single line, readlines() - read all lines as list, write() - write string, writelines() - write list of strings. Always close files with close() or use context manager (with statement). Iteration: for line in file:. JSON module for structured data: json.load(), json.dump(). CSV module for comma-separated values. pickle module for Python object serialization.",
          duration: "55 min",
          difficulty: "Intermediate",
          exercises: 7
        },
        {
          id: "exception-handling",
          title: "Exception Handling",
          content: "Exceptions are errors that occur during execution. try-except blocks handle them: try: (risky code) except SpecificException: (handle). Multiple except blocks for different exceptions. except Exception as e: catches all exceptions, e contains error details. else: executes if no exception. finally: always executes, used for cleanup. raise keyword raises exceptions. Built-in exceptions: ValueError, TypeError, ZeroDivisionError, IndexError, KeyError, FileNotFoundError, etc. Create custom exceptions by inheriting from Exception class. Exception hierarchy allows catching related exceptions with parent class.",
          duration: "50 min",
          difficulty: "Intermediate",
          exercises: 6
        },
        {
          id: "context-managers",
          title: "Context Managers",
          content: "Context managers handle resource setup and cleanup automatically. with statement: with open(file) as f:. __enter__() called when entering context, __exit__() when exiting. Ensures resources are released even if exceptions occur. Custom context managers implement __enter__() and __exit__() methods or use @contextmanager decorator with generator. contextlib module provides utilities like ExitStack for nested contexts. Useful for files, database connections, locks, temporary changes to state.",
          duration: "45 min",
          difficulty: "Intermediate",
          exercises: 5
        },
        {
          id: "path-operations",
          title: "Path Operations",
          content: "pathlib.Path is modern object-oriented approach to file paths, superior to os.path. Create Path objects: Path('directory/file.txt'). Methods: exists() - check if exists, is_file() - is regular file, is_dir() - is directory, mkdir() - create directory, iterdir() - list directory contents, suffix - file extension, stem - filename without extension, parent - parent directory, parts - path components. os.path older style: os.path.join(), os.path.dirname(), os.path.basename(). os.listdir() lists directory contents. shutil module for high-level file operations: copy(), move(), rmtree().",
          duration: "40 min",
          difficulty: "Intermediate",
          exercises: 5
        }
      ],
      duration: "3.2 hours",
      exercises: 23,
      completed: false,
      codeExample: `# File reading
with open("data.txt", "r") as file:
    content = file.read()
    print(content)

# Reading line by line
with open("data.txt", "r") as file:
    for line in file:
        print(line.strip())

# File writing
with open("output.txt", "w") as file:
    file.write("Hello, World!\\n")
    file.write("This is a test file.\\n")

# Appending to file
with open("output.txt", "a") as file:
    file.write("This line is appended.\\n")

# Exception handling
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")
except Exception as e:
    print(f"An error occurred: {e}")
else:
    print("No errors occurred")
finally:
    print("This always executes")

# Custom exceptions
class CustomError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)

try:
    raise CustomError("This is a custom error")
except CustomError as e:
    print(f"Caught custom error: {e.message}")

# Context managers
class FileManager:
    def __init__(self, filename, mode):
        self.filename = filename
        self.mode = mode
        self.file = None
    
    def __enter__(self):
        self.file = open(self.filename, self.mode)
        return self.file
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.file:
            self.file.close()

# Using custom context manager
with FileManager("test.txt", "w") as f:
    f.write("Hello from context manager!")

# Path operations with pathlib
from pathlib import Path

path = Path("data.txt")
print(path.exists())
print(path.is_file())
print(path.suffix)  # .txt
print(path.stem)  # data

# Creating directories
new_dir = Path("new_folder")
new_dir.mkdir(exist_ok=True)`
    },
    {
      id: 6,
      title: "Advanced Python Features",
      description: "Master advanced Python concepts and modern features",
      topics: [
        {
          id: "decorators",
          title: "Decorators",
          content: "Decorators are functions that modify behavior of other functions/classes without permanently changing them. Syntax: @decorator_name above function definition. Function decorators wrap function and return wrapper. Can stack decorators: @dec1 @dec2 def func():. Decorators with parameters: @decorator(arg) requires additional layer. Common decorators: @property, @classmethod, @staticmethod, @lru_cache (memoization), @wraps (preserve metadata). Useful for logging, authentication, caching, timing, validation. Decorators are higher-order functions - take function as argument and return function.",
          duration: "60 min",
          difficulty: "Advanced",
          exercises: 7
        },
        {
          id: "generators-iterators",
          title: "Generators & Iterators",
          content: "Iterators implement __iter__() returning self and __next__() returning next value or raising StopIteration. for loop calls these methods implicitly. Generators are simpler iterators using yield keyword - function becomes iterator returning value each time called. Lazy evaluation - compute values on-demand, not upfront. Generator expressions: (expr for x in seq) similar to list comprehensions but lazy. Generator methods: send() - send value into generator, throw() - throw exception, close() - stop generator. Useful for memory efficiency with large datasets and infinite sequences.",
          duration: "55 min",
          difficulty: "Advanced",
          exercises: 6
        },
        {
          id: "modules-packages",
          title: "Modules & Packages",
          content: "Modules are .py files containing Python code. Import with import module, from module import name, import module as alias. __name__ == '__main__' checks if file is run directly. Packages are directories with __init__.py file, organized as namespaces. Relative imports: from . import sibling, from .. import parent. Standard library includes: sys, os, collections, itertools, functools, math, datetime, json, etc. Third-party packages installed with pip. __all__ list defines public API. Module search path controlled by sys.path.",
          duration: "50 min",
          difficulty: "Advanced",
          exercises: 6
        },
        {
          id: "async-programming",
          title: "Async Programming",
          content: "Asynchronous programming allows concurrent operations without threads. async def defines coroutine, await suspends execution until coroutine completes. asyncio module: asyncio.run() executes main coroutine, asyncio.gather() runs multiple concurrently, asyncio.sleep() async sleep. Event loop manages coroutine execution. Useful for I/O-bound tasks: network requests, file operations, database queries. async for for iterating async iterables. async with for async context managers. Tasks and futures for managing coroutines. Much more efficient than threads for I/O operations.",
          duration: "65 min",
          difficulty: "Advanced",
          exercises: 8
        }
      ],
      duration: "3.8 hours",
      exercises: 27,
      completed: false,
      codeExample: `# Decorators
def my_decorator(func):
    def wrapper(*args, **kwargs):
        print("Before function call")
        result = func(*args, **kwargs)
        print("After function call")
        return result
    return wrapper

@my_decorator
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")

# Decorator with parameters
def repeat(times):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def say_hello():
    print("Hello!")

say_hello()

# Generators
def fibonacci(n):
    a, b = 0, 1
    count = 0
    while count < n:
        yield a
        a, b = b, a + b
        count += 1

for num in fibonacci(10):
    print(num)

# Generator expressions
squares = (x**2 for x in range(10))
print(list(squares))

# Modules and packages
# math_utils.py
def add(a, b):
    return a + b

def multiply(a, b):
    return a * b

# main.py
# import math_utils
# from math_utils import add, multiply
# import math_utils as mu

# Async programming
import asyncio

async def fetch_data(url):
    # Simulate network request
    await asyncio.sleep(1)
    return f"Data from {url}"

async def main():
    tasks = [
        fetch_data("url1"),
        fetch_data("url2"),
        fetch_data("url3")
    ]
    results = await asyncio.gather(*tasks)
    print(results)

# Run async function
# asyncio.run(main())

# Context managers with contextlib
from contextlib import contextmanager

@contextmanager
def timer():
    import time
    start = time.time()
    try:
        yield
    finally:
        end = time.time()
        print(f"Elapsed time: {end - start:.2f} seconds")

with timer():
    # Your code here
    time.sleep(1)`
    }
  ];