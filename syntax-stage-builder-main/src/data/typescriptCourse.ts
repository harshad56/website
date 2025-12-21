export type TypeScriptDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface TypeScriptTopic {
  id: string;
  title: string;
  content: string;
  duration: string;
  difficulty: TypeScriptDifficulty;
  exercises: number;
}

export interface TypeScriptModule {
  id: number;
  title: string;
  description: string;
  topics: TypeScriptTopic[];
  duration: string;
  exercises: number;
  completed: boolean;
  codeExample: string;
}

export const typescriptModules: TypeScriptModule[] = [
  {
    id: 1,
    title: "TypeScript Fundamentals",
    description:
      "Understand what TypeScript adds on top of JavaScript and how static types improve reliability.",
    topics: [
      {
        id: "ts-intro",
        title: "Why TypeScript?",
        content:
          "TypeScript is a superset of JavaScript that adds a powerful static type system on top of the language you already know. In this topic you will understand why large teams and serious projects often choose TypeScript over plain JavaScript. You will see how types help you catch bugs earlier, document intent more clearly, and refactor with confidence. You will also learn how TypeScript integrates with modern editors to give you better autocomplete, navigation, and inline documentation. By the end of this lesson you should be able to explain when TypeScript is worth adding to a project and what benefits it brings to day to day development.",
        duration: "40 min",
        difficulty: "Beginner",
        exercises: 4
      },
      {
        id: "ts-setup",
        title: "Tooling & Project Setup",
        content:
          "Before you can write TypeScript you need a basic build setup. In this topic you will learn how to install the TypeScript compiler, create a configuration file, and compile code from a source folder to a build folder. You will see how compiler options such as strict type checking, module resolution, and target output affect the JavaScript that is generated. You will also explore how TypeScript plugs into common toolchains such as simple tsc scripts, bundlers like Vite and Webpack, and frameworks like React or Next. After working through this topic you will be comfortable creating a fresh TypeScript project and understanding what each configuration setting is doing.",
        duration: "45 min",
        difficulty: "Beginner",
        exercises: 5
      },
      {
        id: "basic-types",
        title: "Basic Types",
        content:
          "TypeScript lets you describe the shapes of values in your program using a rich set of built in types. In this topic you will work with primitive types for strings, numbers, booleans, null, and undefined. You will create arrays and tuples, and see how TypeScript can track exactly which positions hold which types. You will learn when enums are a good fit and how they compare to string literal unions. You will also look at special types like any, unknown, and never, and understand why they should be used sparingly and carefully. By the end you will be able to read and write type annotations for most basic data structures you use every day.",
        duration: "55 min",
        difficulty: "Beginner",
        exercises: 6
      },
      {
        id: "functions-basics",
        title: "Function Types",
        content:
          "Functions are a key part of TypeScript's type system. In this topic you will learn how to give every function a clear signature by annotating its parameters and return type. You will see how TypeScript infers many function types automatically, but also when it is worth writing the types explicitly for readability. You will practice typing callbacks, higher order functions, and methods on objects so that you get accurate autocomplete and error messages. You will also learn how to describe optional and default parameters, rest parameters, and overloads. When you finish this lesson you should be comfortable designing and using function types throughout an application.",
        duration: "50 min",
        difficulty: "Beginner",
        exercises: 6
      }
    ],
    duration: "3.1 hours",
    exercises: 21,
    completed: false,
    codeExample: `// basic-types.ts

// Explicit primitive types
let title: string = "TypeScript Fundamentals";
let lessons: number = 12;
let published: boolean = true;

// Array and tuple
const scores: number[] = [90, 85, 92];
const user: [string, number] = ["Harsh", 3]; // [name, completedModules]

// Enum
enum Difficulty {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
}

// Function with typed params and return
function formatProgress(name: string, completed: number, total: number): string {
  const ratio = ((completed / total) * 100).toFixed(1);
  return \`\${name} has finished \${ratio}% of the course.\`;
}

console.log(formatProgress("Harsh", 3, 12));`
  },
  {
    id: 2,
    title: "Objects, Interfaces & Classes",
    description:
      "Model rich data structures with interfaces, type aliases, and classes.",
    topics: [
      {
        id: "interfaces",
        title: "Interfaces & Type Aliases",
        content:
          "Most real applications need to describe the structure of complex objects. In this topic you will use interfaces and type aliases to model that structure. You will learn how to define required and optional properties, readonly properties, and index signatures for flexible key value maps. You will write types for objects that contain functions as methods, collections, and nested objects. You will compare interfaces and type aliases, seeing where they overlap and where each one offers unique capabilities such as declaration merging or union composition. After this topic you will know how to turn informal data ideas into precise, reusable TypeScript definitions.",
        duration: "55 min",
        difficulty: "Beginner",
        exercises: 6
      },
      {
        id: "classes",
        title: "Classes & Access Modifiers",
        content:
          "TypeScript adds a few conveniences on top of JavaScript classes to make object oriented patterns easier to express. In this topic you will create classes with constructors, instance properties, and methods. You will see how public, private, and protected modifiers control which members can be accessed from where, and how readonly properties help enforce invariants. You will practice using parameter properties in constructors to reduce boilerplate. You will also explore how TypeScript checks class compatibility based on structure rather than explicit inheritance alone. By the end you will be able to design simple class based APIs that work well with TypeScript's type system.",
        duration: "60 min",
        difficulty: "Intermediate",
        exercises: 7
      },
      {
        id: "interfaces-classes",
        title: "Implementing Interfaces",
        content:
          "Interfaces make great contracts for classes to implement. In this topic you will define interfaces that describe behavior and structure, and then implement them in different classes. You will see how this lets you swap one implementation for another without changing the code that depends on the interface. You will work through examples such as logging abstractions or repository patterns where different storage backends share the same interface. You will also learn how to have a single class implement multiple interfaces to model richer capabilities. After this lesson you will be comfortable using interfaces to separate concerns and keep your class designs flexible.",
        duration: "50 min",
        difficulty: "Intermediate",
        exercises: 6
      },
      {
        id: "type-narrowing",
        title: "Type Narrowing & Guards",
        content:
          "When values can be more than one possible type, you need a way to tell the compiler which case you are in. Type narrowing is how you do that in TypeScript. In this topic you will use operators like typeof, instanceof, and the in keyword to narrow union types down to specific branches. You will learn how control flow analysis follows your if statements, early returns, and switch cases to refine types automatically. You will also write custom type guard functions that encapsulate complex checks and make call sites simpler. By the end you will be able to work confidently with union types without needing unsafe casts.",
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 7
      }
    ],
    duration: "3.6 hours",
    exercises: 26,
    completed: false,
    codeExample: `// interfaces-and-classes.ts

interface Course {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  hours: number;
}

type UserId = string | number;

class Learner {
  constructor(
    public id: UserId,
    private name: string,
    readonly joinedAt: Date
  ) {}

  describe(): string {
    return \`\${this.name} (id: \${this.id}) joined at \${this.joinedAt.toISOString()}\`;
  }
}

const course: Course = {
  id: "ts-101",
  title: "TypeScript Fundamentals",
  difficulty: "Beginner",
  hours: 3.5,
};

const learner = new Learner(1, "Harsh", new Date());
console.log(learner.describe());`
  },
  {
    id: 3,
    title: "Generics & Advanced Types",
    description:
      "Use generics, utility types, and type operators to model complex scenarios.",
    topics: [
      {
        id: "generics",
        title: "Generics Basics",
        content:
          "Generics let you write functions and types that work over many different element types while still preserving strong typing. In this topic you will introduce type parameters to functions, interfaces, and classes so they can be reused across your codebase. You will see common generic patterns such as wrapping API responses, collections, and utilities that transform arrays or objects. You will learn how generics help you keep relationships between inputs and outputs, so that if you pass in a user you get a user shaped result back. After this topic you will start to recognize when a generic abstraction is better than duplicating code for each type.",
        duration: "60 min",
        difficulty: "Intermediate",
        exercises: 7
      },
      {
        id: "constraints",
        title: "Generic Constraints",
        content:
          "Generic type parameters often need some limitations so that your implementation can safely use certain operations. In this topic you will add constraints to your generics using extends and keyof. You will write functions that only accept objects with specific properties, or keys that are valid for a given object. You will learn how to use keyof and indexed access types to connect types together, enabling utilities like pick, omit, or pluck. You will also see how constraints improve error messages when callers pass the wrong kinds of values. By the end you will know how to design generic APIs that are both flexible and safe.",
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 7
      },
      {
        id: "utility-types",
        title: "Utility Types",
        content:
          "TypeScript includes a collection of built in utility types that save you from reinventing common type transformations. In this topic you will explore utilities such as Partial, Required, Readonly, Pick, Omit, Record, and others. You will learn how they are defined in terms of mapped types and how they can be composed together. You will see practical examples like building update payload types from full models, or maps from keys to configuration objects. After this lesson you will have a toolbox of utilities that let you express many complex types in just a few words.",
        duration: "50 min",
        difficulty: "Intermediate",
        exercises: 6
      },
      {
        id: "mapped-conditional",
        title: "Mapped & Conditional Types",
        content:
          "Mapped types and conditional types are advanced features that let you compute new types from existing ones. In this topic you will learn how to create mapped types that iterate over the keys of another type and transform each property in some way. You will use conditional types to express rules like if a property is optional make it required, or if a type is assignable to something then pick one branch otherwise pick another. You will see how these features combine to power many of the built in utility types and how you can create your own. By the end you will understand how TypeScript's type system can act like a small programming language of its own for shaping data models.",
        duration: "65 min",
        difficulty: "Advanced",
        exercises: 8
      }
    ],
    duration: "3.9 hours",
    exercises: 28,
    completed: false,
    codeExample: `// generics.ts

// Generic function
function identity<T>(value: T): T {
  return value;
}

// Generic interface
interface ApiResponse<T> {
  data: T;
  error?: string;
}

// Generic constraint
function pluck<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: "Harsh", active: true };
const name = pluck(user, "name");

// Utility type example
type UserPreview = Pick<typeof user, "id" | "name">;`
  },
  {
    id: 4,
    title: "TypeScript with React & Node",
    description:
      "Apply TypeScript in real-world frontend and backend projects.",
    topics: [
      {
        id: "react-props",
        title: "Typing React Components",
        content:
          "TypeScript works especially well with React because it can describe component props and state precisely. In this topic you will learn how to define prop types for function components and class components so that parents cannot pass invalid data. You will see how to type children, optional props, default props, and event handlers. You will also look at common patterns for typing useState, useReducer, and custom hooks so that your component logic is safe. After this lesson you should feel comfortable taking an existing JavaScript React component and migrating its public API to TypeScript.",
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 6
      },
      {
        id: "custom-hooks",
        title: "Custom Hooks & Context",
        content:
          "As your React applications grow you will likely extract logic into custom hooks and share state with context providers. In this topic you will build custom hooks with precise input and output types so that consumers get rich autocomplete and error checking. You will type React context values and provider components so that they cannot be misused. You will also explore patterns for representing loading states, errors, and data using discriminated unions. By the end you will be able to build a small but fully typed state management layer for a feature using hooks and context.",
        duration: "60 min",
        difficulty: "Intermediate",
        exercises: 7
      },
      {
        id: "node-apis",
        title: "Node APIs with TypeScript",
        content:
          "TypeScript is not just for the browser; it works very well on the server with Node. In this topic you will define types for HTTP request handlers, route parameters, and JSON payloads in a simple API built with frameworks like Express or Fastify. You will learn how to share data transfer object types between backend and frontend so you only describe your API contracts once. You will also see how TypeScript helps you refactor routes and services without accidentally breaking callers. After this topic you will be comfortable wiring up a small API in Node with end to end type safety.",
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 7
      },
      {
        id: "monorepos",
        title: "Shared Types & Monorepos",
        content:
          "Larger teams often adopt monorepo setups so that multiple applications and libraries live in a single codebase. In this topic you will learn how to organize shared TypeScript types and utilities across packages. You will see how to configure project references, path aliases, or workspaces so that code can be shared without duplication. You will explore strategies for publishing internal type libraries and controlling which modules are considered public. By the end you will know how to structure a monorepo so that frontends, backends, and shared packages can all benefit from a single source of truth for your core TypeScript models.",
        duration: "60 min",
        difficulty: "Advanced",
        exercises: 8
      }
    ],
    duration: "4.0 hours",
    exercises: 28,
    completed: false,
    codeExample: `// React component with typed props
import React from "react";

type ProgressProps = {
  course: string;
  completed: number;
  total: number;
};

export const ProgressBadge: React.FC<ProgressProps> = ({
  course,
  completed,
  total,
}) => {
  const ratio = total === 0 ? 0 : (completed / total) * 100;
  return <span>{course}: {ratio.toFixed(1)}%</span>;
};`
  }
];


