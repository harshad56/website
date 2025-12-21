export type JavaScriptDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface JavaScriptTopic {
  id: string;
  title: string;
  content: string;
  duration: string;
  difficulty: JavaScriptDifficulty;
  exercises: number;
}

export interface JavaScriptModule {
  id: number;
  title: string;
  description: string;
  topics: JavaScriptTopic[];
  duration: string;
  exercises: number;
  completed: boolean;
  codeExample: string;
}

export const javascriptModules: JavaScriptModule[] = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    description:
      "Build a rock-solid foundation in modern JavaScript: syntax, execution model, data structures, and the tooling used by professional front-end engineers.",
    duration: "3.2 hours",
    exercises: 22,
    completed: false,
    codeExample: `// fundamentals-overview.js
const learner = "Future JS Engineer";
const modules = 6;
const averageHours = 32.5;

console.log(\`Welcome, \${learner}!\`);
console.log(\`This roadmap covers \${modules} modules (~\${averageHours} hours).\`);
console.log("Let's master the language of the web together.");

const environment = typeof window !== "undefined" ? "browser" : "node";
console.log(\`Currently running inside the \${environment} runtime.\`);`,
    topics: [
      {
        id: "1.1",
        title: "How JavaScript Runs Everywhere",
        duration: "40 min",
        difficulty: "Beginner",
        exercises: 4,
        content:
          "JavaScript started as a browser scripting tool but now powers full-stack applications via Node.js. Understand the ECMAScript specification, how engines like V8 or SpiderMonkey parse source into bytecode, and how the Call Stack + Heap form the runtime model. Learn why JavaScript is single-threaded but asynchronous, how the Event Loop interleaves tasks, and what changes when code runs in Node, Deno, Bun, or inside a browser tab."
      },
      {
        id: "1.2",
        title: "Syntax, Statements & Expressions",
        duration: "45 min",
        difficulty: "Beginner",
        exercises: 4,
        content:
          "Practice declaring variables, writing statements, and composing expressions. Learn when to use semicolons, understand automatic semicolon insertion (ASI) pitfalls, and get comfortable with block vs expression contexts. Review primitive literals, template literals, tagged templates, and how JavaScript coerces values when evaluating expressions."
      },
      {
        id: "1.3",
        title: "Variables, Scope & Hoisting",
        duration: "45 min",
        difficulty: "Beginner",
        exercises: 6,
        content:
          "Compare var, let, and const declarations. Study lexical scope, temporal dead zones, and how hoisting works for functions vs variables. Practice spotting scope leaks, understand when const still allows internal mutation, and trace how JavaScript resolves identifiers through scope chains."
      },
      {
        id: "1.4",
        title: "Data Types & Type Coercion",
        duration: "40 min",
        difficulty: "Beginner",
        exercises: 8,
        content:
          "Deep dive into the dynamic type system: strings, numbers, bigint, boolean, null, undefined, symbol, and objects. Understand typeof quirks, truthy/falsy evaluations, == vs ===, implicit coercion rules, and how to safely convert values using Number(), String(), Boolean(), and JSON utilities."
      }
    ]
  },
  {
    id: 2,
    title: "Control Flow & Functions",
    description:
      "Write expressive logic with branching, loops, reusable functions, and modern patterns like closures and higher-order utilities.",
    duration: "3.6 hours",
    exercises: 26,
    completed: false,
    codeExample: `// decisions-and-functions.js
function classifyScore(score) {
  if (score >= 90) return "Outstanding";
  if (score >= 75) return "Strong";
  if (score >= 60) return "Developing";
  return "Needs practice";
}

const learners = ["Riya", "Jose", "Amira", "Zhang"];
for (const [index, name] of learners.entries()) {
  console.log(\`\${index + 1}. \${name} — \${classifyScore(70 + index * 5)}\`);
}

const multiplier = (factor) => (value) => value * factor;
const double = multiplier(2);
console.log(double(21));`,
    topics: [
      {
        id: "2.1",
        title: "Conditional Logic & Pattern Matching",
        duration: "50 min",
        difficulty: "Beginner",
        exercises: 6,
        content:
          "Master if/else chains, switch statements, optional chaining (?.), nullish coalescing (??), and ternary expressions. Learn when to extract guard clauses, how to short-circuit evaluations for performance, and how to mimic pattern matching with object lookups."
      },
      {
        id: "2.2",
        title: "Iteration Strategies",
        duration: "55 min",
        difficulty: "Beginner",
        exercises: 6,
        content:
          "Compare traditional loops (for, while, do...while) with iterable-aware methods (for...of, for...in). Understand labeled loops, break/continue, and how to avoid off-by-one errors. Explore Array.prototype.forEach, map, filter, reduce, every, some, and when they are preferable over manual loops."
      },
      {
        id: "2.3",
        title: "Functions, Parameters & Return Values",
        duration: "40 min",
        difficulty: "Beginner",
        exercises: 6,
        content:
          "Write function declarations, expressions, and arrow functions. Use default parameters, rest parameters, and destructured arguments. Learn how return statements behave, what happens when you omit return, and how JavaScript handles function overloading via parameter inspection."
      },
      {
        id: "2.4",
        title: "Closures, Scope & Functional Patterns",
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 8,
        content:
          "Trace closures step-by-step to understand how inner functions retain access to lexical variables even after the outer function finishes. Implement memoization, once(), debounce(), throttle(), and other higher-order utilities. Learn how IIFEs, modules, and private state leverage closures."
      }
    ]
  },
  {
    id: 3,
    title: "Data Structures: Arrays & Objects",
    description:
      "Manipulate complex data with confidence using idiomatic array helpers, object utilities, JSON techniques, and modern destructuring syntax.",
    duration: "3.4 hours",
    exercises: 24,
    completed: false,
    codeExample: `// collections-lab.js
const learners = [
  { name: "Riya", track: "Frontend", points: 420 },
  { name: "Marco", track: "Backend", points: 390 },
  { name: "Alba", track: "Fullstack", points: 470 }
];

const leaderboard = learners
  .filter((entry) => entry.points >= 400)
  .sort((a, b) => b.points - a.points)
  .map((entry, index) => ({ rank: index + 1, ...entry }));

console.table(leaderboard);`,
    topics: [
      {
        id: "3.1",
        title: "Mastering Arrays",
        duration: "55 min",
        difficulty: "Beginner",
        exercises: 6,
        content:
          "Create arrays, understand sparse vs dense layouts, and leverage built-in methods (map, filter, reduce, flatMap, find, includes, slice, splice). Learn how immutability-friendly patterns prevent bugs and how to reason about array performance characteristics."
      },
      {
        id: "3.2",
        title: "Objects, Records & Identity",
        duration: "45 min",
        difficulty: "Beginner",
        exercises: 6,
        content:
          "Construct objects, use dynamic property keys, iterate with Object.keys/values/entries, and understand reference equality. Learn how to clone safely (structuredClone, JSON techniques, spread) and when to reach for Map/Set for better semantics."
      },
      {
        id: "3.3",
        title: "Destructuring, Spread & Rest",
        duration: "40 min",
        difficulty: "Intermediate",
        exercises: 6,
        content:
          "Use array and object destructuring to unpack data declaratively. Combine rest/spread operators to copy data, merge configurations, and craft flexible function signatures. Understand gotchas like default values, nested destructuring, and skipping items."
      },
      {
        id: "3.4",
        title: "JSON, Storage & Data Validation",
        duration: "50 min",
        difficulty: "Intermediate",
        exercises: 6,
        content:
          "Serialize and parse JSON safely, handle reviver/replacer callbacks, and persist data with localStorage/sessionStorage. Learn to validate payloads, sanitize user input, and structure error handling when parsing remote responses."
      }
    ]
  },
  {
    id: 4,
    title: "DOM, Events & Browser APIs",
    description:
      "Connect JavaScript to the visual layer: traverse the DOM, respond to user input, and harness modern browser capabilities responsibly.",
    duration: "3.1 hours",
    exercises: 23,
    completed: false,
    codeExample: `// dom-dashboard.js
document.addEventListener("DOMContentLoaded", () => {
  const counter = document.querySelector("#counter");
  const button = document.querySelector("#increment");
  let clicks = 0;

  button?.addEventListener("click", () => {
    clicks += 1;
    counter.textContent = \`\${clicks} clicks recorded\`;
  });
});`,
    topics: [
      {
        id: "4.1",
        title: "DOM Traversal & Selection",
        duration: "45 min",
        difficulty: "Beginner",
        exercises: 5,
        content:
          "Use querySelector, querySelectorAll, closest, matches, and traversal properties (parentNode, children, nextElementSibling) to navigate complex documents. Learn how live HTMLCollections differ from static NodeLists and how to minimize reflows."
      },
      {
        id: "4.2",
        title: "Creating & Updating the UI",
        duration: "50 min",
        difficulty: "Beginner",
        exercises: 6,
        content:
          "Create elements, set attributes, manage class lists, and update inline styles. Practice batching DOM writes, using DocumentFragment for performance, and sanitizing user-generated HTML to prevent XSS."
      },
      {
        id: "4.3",
        title: "Events, Delegation & Accessibility",
        duration: "40 min",
        difficulty: "Intermediate",
        exercises: 6,
        content:
          "Attach listeners, understand the capture/bubble phases, stop propagation responsibly, and use event delegation for dynamic lists. Incorporate keyboard accessibility, focus management, and ARIA attributes into interactive components."
      },
      {
        id: "4.4",
        title: "Browser APIs & Storage",
        duration: "45 min",
        difficulty: "Intermediate",
        exercises: 6,
        content:
          "Work with Fetch, URLSearchParams, History API, Clipboard API, and Web Storage. Learn how to detect feature support, handle permission prompts, and provide graceful fallbacks for older browsers."
      }
    ]
  },
  {
    id: 5,
    title: "ES6+ and Modern Patterns",
    description:
      "Adopt the language improvements introduced from ES2015 onward: modules, classes, iterables, symbols, and best-practice architecture patterns.",
    duration: "3.0 hours",
    exercises: 22,
    completed: false,
    codeExample: `// modern-javascript.mjs
export class Learner {
  #completedTopics = new Set();

  constructor(public name: string) {}

  complete(topic) {
    this.#completedTopics.add(topic);
  }

  get progress() {
    return this.#completedTopics.size;
  }
}

const learner = new Learner("Maya");
learner.complete("modules");
console.log(learner.progress);`,
    topics: [
      {
        id: "5.1",
        title: "Let/Const, Arrow Functions & this",
        duration: "40 min",
        difficulty: "Intermediate",
        exercises: 5,
        content:
          "Embrace block-scoped declarations, lexical this binding, implicit returns, and arrow function trade-offs. Learn when traditional function syntax is still required (constructors, dynamic this) and how to avoid common gotchas."
      },
      {
        id: "5.2",
        title: "Classes, Prototypes & Private Fields",
        duration: "50 min",
        difficulty: "Intermediate",
        exercises: 6,
        content:
          "Understand how the class syntax layers on top of prototypal inheritance. Implement constructors, getters/setters, static members, and truly private fields (#field). Compare classical inheritance vs composition and when to reach for mixins."
      },
      {
        id: "5.3",
        title: "Modules, Bundlers & Tooling",
        duration: "40 min",
        difficulty: "Intermediate",
        exercises: 6,
        content:
          "Use ES modules (import/export), dynamic imports, and namespace exports. Learn how bundlers (Vite, Webpack, Rollup) transform modules, how tree shaking works, and how to structure shared utilities for reusability."
      },
      {
        id: "5.4",
        title: "Iterables, Generators & Symbols",
        duration: "50 min",
        difficulty: "Advanced",
        exercises: 5,
        content:
          "Implement custom iterables with [Symbol.iterator], create generator functions for lazy sequences, and use async generators for streaming data. Learn how Symbols enable unique property keys and metadata hooks."
      }
    ]
  },
  {
    id: 6,
    title: "Async Programming & APIs",
    description:
      "Handle real-world data flows with callbacks, promises, async/await, AbortController, and resilience patterns that keep apps responsive.",
    duration: "3.3 hours",
    exercises: 24,
    completed: false,
    codeExample: `// async-roadmap.js
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchLessons() {
  await sleep(200);
  return ["Syntax", "DOM", "Asynchronous JS"];
}

async function main() {
  try {
    const lessons = await fetchLessons();
    console.log("Loaded lessons:", lessons.join(", "));
  } catch (error) {
    console.error("Failed to fetch lessons", error);
  }
}

main();`,
    topics: [
      {
        id: "6.1",
        title: "Callbacks, Events & Timers",
        duration: "45 min",
        difficulty: "Intermediate",
        exercises: 6,
        content:
          "Understand the historical callback pattern, manage nested asynchronous flows, and learn when to convert callbacks into promises. Use setTimeout, setInterval, and requestAnimationFrame effectively without leaking timers."
      },
      {
        id: "6.2",
        title: "Promises & Microtasks",
        duration: "50 min",
        difficulty: "Intermediate",
        exercises: 6,
        content:
          "Create promises, chain then/catch/finally handlers, and leverage Promise.all, allSettled, race, any. Learn how microtask queues differ from macrotasks, diagnose unhandled rejection warnings, and propagate errors intentionally."
      },
      {
        id: "6.3",
        title: "Async/Await, Fetch & AbortController",
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 6,
        content:
          "Rewrite promise chains with async/await, handle sequential vs parallel flows, and cancel pending work with AbortController. Implement robust fetch helpers with retry logic, exponential backoff, and JSON parsing guards."
      },
      {
        id: "6.4",
        title: "Realtime Patterns & WebSockets",
        duration: "45 min",
        difficulty: "Advanced",
        exercises: 6,
        content:
          "Stream data with WebSockets, Server-Sent Events, and Web Workers. Detect connectivity changes, buffer outbound messages, and design fallbacks that keep collaborative apps resilient when the network fluctuates."
      }
    ]
  }
];









