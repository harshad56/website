export type PhpDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface PhpTopic {
  id: string;
  title: string;
  content: string;
  duration: string;
  difficulty: PhpDifficulty;
  exercises: number;
}

export interface PhpModule {
  id: number;
  title: string;
  description: string;
  topics: PhpTopic[];
  duration: string;
  exercises: number;
  completed: boolean;
  codeExample: string;
}

export const phpModules: PhpModule[] = [
  {
    id: 1,
    title: "PHP Fundamentals",
    description: "Learn PHP syntax and how it powers dynamic web pages.",
    topics: [
      {
        id: "php-intro",
        title: "Introduction to PHP",
        content:
          "PHP is a server side scripting language that runs on a web server and generates HTML or JSON for browsers and clients. In this topic you will learn how a browser request reaches a PHP script, how PHP executes on the server, and how a response is sent back. You will see why PHP became popular for powering blogs, content management systems, and frameworks like WordPress and Laravel. You will also understand the basic request response model, including how each request starts with a fresh PHP process or context. By the end you will have a clear picture of where PHP code runs and how it fits into a typical web stack.",
        duration: "35 min",
        difficulty: "Beginner",
        exercises: 4
      },
      {
        id: "syntax-variables",
        title: "Syntax & Variables",
        content:
          "To write PHP you need to understand how to embed it into files and how variables work. In this topic you will learn about opening and closing PHP tags, and how PHP code can be mixed with HTML in the same file. You will declare variables using the dollar sign prefix and assign strings, integers, booleans, and arrays. You will also see how PHP performs weak typing by default and why it is important to be explicit when comparing values. You will practice echo and print statements, simple expressions, and operator precedence. After this lesson you will be comfortable reading and writing simple PHP scripts that output dynamic content.",
        duration: "45 min",
        difficulty: "Beginner",
        exercises: 6
      },
      {
        id: "control-flow",
        title: "Control Flow",
        content:
          "Web applications need to behave differently depending on user input or application state. In this topic you will use if, elseif, and else to branch on conditions such as query parameters or form values. You will write switch statements to handle multiple specific cases in a compact way. You will also use for, while, and foreach loops to iterate over arrays and repeat logic as needed. You will combine logical and comparison operators to build meaningful conditions. By the end you will be able to control how your PHP pages respond to many different situations using clear, structured flow.",
        duration: "45 min",
        difficulty: "Beginner",
        exercises: 6
      },
      {
        id: "superglobals",
        title: "_GET, _POST & Superglobals",
        content:
          "PHP exposes important request information through predefined superglobal arrays. In this topic you will read query parameters from the GET array, form data from the POST array, and environment and request metadata from the SERVER array. You will learn why all external input must be considered untrusted and how to perform basic validation and sanitization to protect against attacks like cross site scripting. You will also see how cookies and session IDs travel between client and server and where they appear in these superglobals. After this topic you will know how to safely access user input and request details in your PHP scripts.",
        duration: "50 min",
        difficulty: "Beginner",
        exercises: 6
      }
    ],
    duration: "3.0 hours",
    exercises: 22,
    completed: false,
    codeExample: `<?php
// index.php

$name = $_GET['name'] ?? 'Guest';
$visits = $_COOKIE['visits'] ?? 0;
$visits++;
setcookie('visits', (string) $visits, time() + 3600);

echo "Hello, " . htmlspecialchars($name) . "!<br>";
echo "You have visited this page {$visits} times.";`
  },
  {
    id: 2,
    title: "Functions, Arrays & Forms",
    description: "Organize code with functions and handle HTML form submissions.",
    topics: [
      {
        id: "functions",
        title: "User-Defined Functions",
        content:
          "Functions help you organize your PHP code into reusable building blocks. In this topic you will define simple functions that group related statements under a name and can be called from multiple places. You will add parameters so functions can act on different inputs, and return values so they can send results back to callers. You will use default parameter values for common cases and learn how PHP handles missing arguments. You will also discuss variable scope and how global variables differ from local ones. By the end you will be able to factor repeated logic into functions to keep your PHP files clean and maintainable.",
        duration: "50 min",
        difficulty: "Beginner",
        exercises: 6
      },
      {
        id: "arrays",
        title: "Arrays & Associative Arrays",
        content:
          "Arrays in PHP are very flexible and can act as both indexed lists and associative maps. In this topic you will learn how to build numeric indexed arrays to store ordered lists of values, and associative arrays to map keys like names or IDs to values. You will see common array functions to add, remove, and search for elements. You will iterate over arrays with foreach and understand how keys and values are accessed. You will also learn about multidimensional arrays for representing nested structures like tables or configuration. After this lesson you will be able to model most simple data sets in PHP using arrays alone.",
        duration: "55 min",
        difficulty: "Beginner",
        exercises: 7
      },
      {
        id: "form-handling",
        title: "Form Handling",
        content:
          "Processing HTML forms is a core use case for PHP. In this topic you will create a simple form and then write PHP code that receives its POST data. You will trim and validate user input, checking for required fields, proper formats, and acceptable values. When there are problems you will redisplay the form with helpful error messages while preserving what the user already typed. You will also learn how to protect against cross site request forgery by using tokens, and how to safely output user data using escaping functions. By the end you will be able to build a basic but secure form workflow from end to end.",
        duration: "60 min",
        difficulty: "Intermediate",
        exercises: 7
      },
      {
        id: "sessions",
        title: "Sessions & State",
        content:
          "Because HTTP is stateless, PHP applications need a way to remember users between requests. Sessions are one of the main tools for this. In this topic you will start and manage sessions using the built in session handling functions. You will store and retrieve values in the session array to track things like login status, shopping cart contents, or user preferences. You will also learn about session cookies, session IDs, and basic best practices for securing sessions, such as regenerating IDs after login. After this lesson you will be equipped to add simple authentication or persistent state to your PHP sites.",
        duration: "50 min",
        difficulty: "Intermediate",
        exercises: 6
      }
    ],
    duration: "3.5 hours",
    exercises: 26,
    completed: false,
    codeExample: `<?php
// functions.php

function sanitize(string $value): string {
    return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
}

function calculate_total(array $items): float {
    $total = 0.0;
    foreach ($items as $price) {
        $total += (float) $price;
    }
    return $total;
}

$cart = [9.99, 14.5, 3.25];
echo "Total: " . calculate_total($cart);`
  }
];


