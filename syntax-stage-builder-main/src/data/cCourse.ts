export type CDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface CTopic {
  id: string;
  title: string;
  content: string;
  duration: string;
  difficulty: CDifficulty;
  exercises: number;
}

export interface CModule {
  id: number;
  title: string;
  description: string;
  topics: CTopic[];
  duration: string;
  exercises: number;
  completed: boolean;
  codeExample: string;
}

export const cModules: CModule[] = [
  {
    id: 1,
    title: "C Language Basics & Program Structure",
    description:
      "Learn how C programs are structured, compiled, and executed, along with fundamental syntax and data types.",
    topics: [
      {
        id: "c-intro",
        title: "Introduction to C & Tooling",
        content:
          "C is one of the most influential programming languages ever created. In this topic you will learn about its history, why it is still widely used in systems programming, embedded development, operating systems, and performance-critical code. You will install a C compiler such as GCC or Clang and set up a simple development workflow using the command line or an IDE.\n\nYou will write, compile, and run a classic hello world program, and examine how source files, object files, and executables relate to one another. By the end of this lesson you will understand the basic compile-link-run cycle and how C fits into modern software stacks.",
        duration: "45 min",
        difficulty: "Beginner",
        exercises: 4
      },
      {
        id: "c-syntax",
        title: "Syntax, Variables & Data Types",
        content:
          "In this topic you will learn the essential building blocks of C syntax: statements, blocks, and function definitions. You will declare variables with fundamental data types such as int, float, double, char, and understand the difference between signed and unsigned. We will discuss how C does not have a built-in boolean type in older standards and how modern code uses stdbool.h for clarity.\n\nYou will also learn about type ranges, integer overflow, and how the size of types can vary between platforms. Practical exercises will have you declare and initialize variables, perform arithmetic, and print formatted output using printf, getting comfortable with format specifiers and the standard I/O library.",
        duration: "60 min",
        difficulty: "Beginner",
        exercises: 6
      },
      {
        id: "c-control-flow",
        title: "Control Flow & Functions",
        content:
          "C provides classic structured control flow: if/else, switch, while, do-while, and for loops. In this topic you will practice using each of these constructs to express decisions and repetition. You will learn how switch statements compare to long chains of if/else and when they are a good fit.\n\nYou will also define your own functions, pass arguments by value, and return results. We will discuss header files, function prototypes, and why declarations must be visible before use. By the end you will be able to break larger problems into reusable C functions and understand how the compiler checks function signatures.",
        duration: "65 min",
        difficulty: "Beginner",
        exercises: 7
      }
    ],
    duration: "3.3 hours",
    exercises: 17,
    completed: false,
    codeExample: `/* hello.c */
#include <stdio.h>

int main(void) {
    int visits = 3;

    if (visits > 1) {
        printf("Welcome back! You have visited %d times.\\n", visits);
    } else {
        printf("Welcome to your first C program!\\n");
    }

    for (int i = 0; i < 3; ++i) {
        printf("Iteration %d: Practicing C fundamentals.\\n", i + 1);
    }

    return 0;
}`
  },
  {
    id: 2,
    title: "Pointers, Arrays & Memory",
    description:
      "Understand how C represents memory, works with arrays, and uses pointers for powerful low-level control.",
    topics: [
      {
        id: "c-arrays",
        title: "Arrays & Strings",
        content:
          "Arrays in C are contiguous blocks of memory, which makes them very efficient but also easy to misuse if you are not careful. In this topic you will declare and use one-dimensional and multi-dimensional arrays, work with array indices, and understand how arrays decay to pointers in many expressions. You will also learn how C strings are represented as null-terminated arrays of char.\n\nWe will practice using functions from string.h to copy, concatenate, and compare strings safely, and discuss common pitfalls such as buffer overflows. By the end of this lesson you will be able to manipulate arrays and C strings with a solid understanding of what is happening in memory.",
        duration: "60 min",
        difficulty: "Intermediate",
        exercises: 7
      },
      {
        id: "c-pointers",
        title: "Pointers & Addresses",
        content:
          "Pointers are central to C programming and a source of both power and bugs. In this topic you will learn how to declare pointers, take the address of variables with the & operator, and dereference pointers to access the underlying values. We will explore pointer arithmetic, how it interacts with arrays, and why const-correctness matters when passing pointers to functions.\n\nYou will practice writing functions that modify caller-provided data via pointers, such as swapping two variables or filling buffers. We will also highlight common errors like using uninitialized pointers and dereferencing null. After this lesson you will have a clear mental model of how pointers relate to memory addresses and data.",
        duration: "70 min",
        difficulty: "Intermediate",
        exercises: 8
      },
      {
        id: "c-dynamic-memory",
        title: "Dynamic Memory Management",
        content:
          "Sometimes you cannot know the required size of an array at compile time. In this topic you will learn how to allocate and free memory dynamically using malloc, calloc, realloc, and free from stdlib.h. We will discuss how the heap differs from the stack and why every allocation must eventually be paired with a corresponding free.\n\nThrough examples you will learn to build dynamic arrays, linked lists, and buffers that grow as needed. We will also cover memory leaks, double frees, and tools such as valgrind that help you detect memory issues. By the end you will be able to manage dynamic memory in small to medium sized C programs with confidence.",
        duration: "65 min",
        difficulty: "Intermediate",
        exercises: 7
      }
    ],
    duration: "3.6 hours",
    exercises: 22,
    completed: false,
    codeExample: `/* pointers.c */
#include <stdio.h>

void increment(int *value) {
    if (value != NULL) {
        (*value)++;
    }
}

int main(void) {
    int counter = 0;
    increment(&counter);
    increment(&counter);

    printf("Counter is now %d.\\n", counter);
    return 0;
}`
  },
  {
    id: 3,
    title: "Structs, Files & Debugging",
    description:
      "Model structured data with structs, work with files, and learn practical debugging techniques.",
    topics: [
      {
        id: "c-structs",
        title: "Structs & Custom Types",
        content:
          "Structs allow you to group related pieces of data into a single composite type. In this topic you will define structs for concepts like points, students, or configuration records. You will learn how to declare variables and pointers to structs, access fields with the . and -> operators, and pass structs to functions by value or by pointer.\n\nWe will also discuss typedef and how it can create more readable aliases for complex struct declarations. By the end of this topic you will be comfortable modeling real-world entities as C structs and working with them throughout your program.",
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 6
      },
      {
        id: "c-files",
        title: "File I/O & Error Handling",
        content:
          "Reading from and writing to files is a common task in C programs. In this topic you will use the FILE type and functions like fopen, fclose, fprintf, fscanf, fread, and fwrite to perform both text and binary I/O. You will learn how to check for errors, handle end-of-file conditions, and avoid resource leaks by always closing files in every code path.\n\nWe will work through examples that read configuration files, write logs, and copy data from one file to another. You will also see how errno and perror can be used to print user-friendly error messages. By the end you will be able to safely interact with the filesystem from your own C programs.",
        duration: "60 min",
        difficulty: "Intermediate",
        exercises: 7
      },
      {
        id: "c-debugging",
        title: "Debugging & Best Practices",
        content:
          "Debugging C programs requires a solid grasp of how your code maps to machine behavior. In this topic you will learn how to use tools like gdb or LLDB to set breakpoints, inspect variables, and step through code line by line. We will also discuss compiling with debug symbols and using compiler warnings to catch potential problems early.\n\nYou will practice common debugging workflows, such as tracking down segmentation faults, off-by-one errors in loops, and memory issues. We will end with a short checklist of best practices: initializing variables, checking all return values, and using small functions to make bugs easier to isolate. After this lesson you will feel more confident diagnosing and fixing issues in C.",
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 6
      }
    ],
    duration: "3.2 hours",
    exercises: 19,
    completed: false,
    codeExample: `/* course_struct.c */
#include <stdio.h>

typedef struct {
    const char *title;
    int completed_lessons;
    int total_lessons;
} Course;

double progress_percentage(const Course *course) {
    if (course == NULL || course->total_lessons == 0) {
        return 0.0;
    }
    return (double)course->completed_lessons / course->total_lessons * 100.0;
}

int main(void) {
    Course c_course = {"C Fundamentals", 5, 12};
    double progress = progress_percentage(&c_course);
    printf("%s: %.1f%% complete\\n", c_course.title, progress);
    return 0;
}`
  }
];






