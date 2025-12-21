export type RubyDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface RubyTopic {
  id: string;
  title: string;
  content: string;
  duration: string;
  difficulty: RubyDifficulty;
  exercises: number;
}

export interface RubyModule {
  id: number;
  title: string;
  description: string;
  topics: RubyTopic[];
  duration: string;
  exercises: number;
  completed: boolean;
  codeExample: string;
}

export const rubyModules: RubyModule[] = [
  {
    id: 1,
    title: "Ruby Fundamentals & Syntax",
    description:
      "Learn what makes Ruby expressive and developer-friendly: clean syntax, objects everywhere, and a powerful standard library.",
    topics: [
      {
        id: "ruby-intro",
        title: "Getting Started with Ruby",
        content:
          "Ruby is a dynamic, object-oriented language designed to make developers happy. In this topic you will explore Ruby's philosophy of readability and developer ergonomics, and how that shapes the way you write code. You will learn how to install Ruby using common version managers, run scripts from the command line, and use irb or pry as interactive consoles. We will also cover how Ruby is used in the real world, from scripting and automation to full-stack web applications with Ruby on Rails.\n\nBy the end of this lesson you will understand where Ruby fits in the ecosystem, what kinds of projects it excels at, and how to create and run your first simple Ruby program on your own machine.",
        duration: "40 min",
        difficulty: "Beginner",
        exercises: 4
      },
      {
        id: "ruby-basics",
        title: "Syntax, Variables & Types",
        content:
          "Ruby syntax is intentionally close to natural language. In this topic you will learn how to declare local variables, constants, and how Ruby treats everything as an object, including numbers and booleans. You will see how dynamic typing works in Ruby and why explicit type annotations are not required. We will also look at strings, numbers, symbols, and booleans in detail, exploring useful methods from Ruby's core classes.\n\nYou will practice writing small expressions, combining operators, and understanding how method calls work with and without parentheses. By the end you should feel comfortable reading simple Ruby code and recognizing the core data types that appear in most scripts.",
        duration: "55 min",
        difficulty: "Beginner",
        exercises: 6
      },
      {
        id: "ruby-control-flow",
        title: "Control Flow & Blocks",
        content:
          "Ruby provides several ways to control the flow of your program: if/elsif/else, unless, case expressions, loops, and iterators. In this topic you will first work with traditional conditionals and loops such as while, until, and for, then quickly move on to more idiomatic Ruby patterns. You will learn how methods like each, map, select, and reject use blocks to iterate over collections in a concise way.\n\nWe will also discuss truthiness in Ruby, how only nil and false are treated as falsey, and how to write guard clauses that keep your code clean. By the end of this lesson you will be able to model decisions and repetition in Ruby using both classic control structures and expressive block-based iterators.",
        duration: "60 min",
        difficulty: "Beginner",
        exercises: 7
      }
    ],
    duration: "3.1 hours",
    exercises: 17,
    completed: false,
    codeExample: `# hello_ruby.rb

message = "Welcome to Ruby!"
visits  = 3

if visits > 1
  puts "\#{message} You have visited this course \#{visits} times."
else
  puts "\#{message} This is your first visit."
end

3.times do |i|
  puts "Iteration \#{i + 1}: Ruby makes programming joyful."
end`
  },
  {
    id: 2,
    title: "Collections, Blocks & Iterators",
    description:
      "Work fluently with arrays, hashes, and Ruby's powerful block-based iteration patterns.",
    topics: [
      {
        id: "arrays-hashes",
        title: "Arrays & Hashes",
        content:
          "Arrays and hashes are the backbone of most Ruby programs. In this topic you will learn how to create and manipulate arrays using literal syntax, push and pop elements, slice ranges, and combine arrays. You will then explore hashes (Ruby's key-value maps), including both string keys and symbol keys, default values, and common operations such as merging and transforming keys.\n\nWe will also cover nested collections, where arrays and hashes are combined to model richer data structures like API responses or configuration objects. After working through several examples, you will be able to choose the right collection type for a given problem and use Ruby's concise methods to transform data with very little code.",
        duration: "60 min",
        difficulty: "Beginner",
        exercises: 7
      },
      {
        id: "blocks-iterators",
        title: "Blocks, Iterators & Enumerable",
        content:
          "Blocks are one of Ruby's most distinctive features. In this topic you will understand how blocks work as anonymous chunks of code that can be passed to methods and executed later. You will use iterators like each, map, select, reduce, and many others defined in the Enumerable module to process collections in a declarative style.\n\nWe will compare traditional loops to iterator-based code and see how blocks help you write compact, expressive transformations. You will also learn about do...end versus {...} block syntax, and when Rubyists prefer each style. By the end of this lesson you will be able to chain multiple Enumerable methods together to implement non-trivial data processing pipelines.",
        duration: "65 min",
        difficulty: "Intermediate",
        exercises: 8
      },
      {
        id: "ruby-io",
        title: "Files, I/O & Command Line Scripts",
        content:
          "Many Ruby scripts read from files, write reports, or interact with the operating system. In this topic you will learn how to open files safely using File and IO classes, iterate over lines, and ensure resources are closed using Ruby's block patterns. You will write small command-line utilities that accept arguments, print colored output, and handle basic errors.\n\nWe will also touch on environment variables and how Ruby scripts can integrate with existing command-line workflows. By the end of this topic you will be comfortable writing Ruby programs that interact with the outside world, not just the console.",
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 6
      }
    ],
    duration: "3.4 hours",
    exercises: 21,
    completed: false,
    codeExample: `# enumerable_example.rb

scores = [82, 95, 76, 90, 88]

passed_scores = scores.select { |score| score >= 80 }
average        = scores.sum(0.0) / scores.size

puts "Passed scores: \#{passed_scores.inspect}"
puts "Average score: \#{average.round(1)}"`
  },
  {
    id: 3,
    title: "Ruby OOP, Modules & Rails Ecosystem",
    description:
      "Dive into Ruby's object model, modules, and how these ideas power frameworks like Rails.",
    topics: [
      {
        id: "ruby-classes",
        title: "Classes, Objects & Inheritance",
        content:
          "Ruby is a purely object-oriented language: almost everything you work with is an object. In this topic you will create your own classes with initialize methods, instance variables, and accessors. You will learn how inheritance works, when to use super, and how to override methods without breaking behavior.\n\nWe will also discuss Ruby's flexible approach to objects, where duck typing is often preferred over strict hierarchies. By the end you will be comfortable designing small class-based models that encapsulate behavior and data in a Ruby-friendly way.",
        duration: "60 min",
        difficulty: "Intermediate",
        exercises: 7
      },
      {
        id: "modules-mixins",
        title: "Modules, Mixins & Namespaces",
        content:
          "Modules in Ruby serve multiple roles: they allow you to group related methods, share behavior across classes using mixins, and create namespaces to avoid constant name collisions. In this topic you will write modules that define reusable methods, include them into classes, and understand the difference between include, extend, and prepend.\n\nWe will also examine Ruby's constant lookup rules and how nested modules are used as namespaces in larger applications and gems. After this lesson you will be able to apply mixins to keep your classes small and focused, while still sharing common functionality across your codebase.",
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 6
      },
      {
        id: "rails-overview",
        title: "From Ruby to Rails",
        content:
          "Ruby on Rails is the framework that made Ruby famous. In this high-level topic you will see how the Ruby concepts you have learned map directly onto Rails conventions. We will discuss models, views, and controllers, how routes map URLs to controller actions, and how Rails uses Ruby's metaprogramming features to generate a lot of behavior for you.\n\nYou will not build a full Rails app here, but you will understand what it looks like, how configuration and conventions work together, and which Ruby skills to strengthen before diving into Rails tutorials. By the end you will have a clear roadmap from Ruby language fundamentals to full-stack Ruby on Rails development.",
        duration: "50 min",
        difficulty: "Intermediate",
        exercises: 5
      }
    ],
    duration: "3.2 hours",
    exercises: 18,
    completed: false,
    codeExample: `# course_progress.rb

class Course
  attr_reader :title, :completed_lessons, :total_lessons

  def initialize(title, completed_lessons, total_lessons)
    @title            = title
    @completed_lessons = completed_lessons
    @total_lessons     = total_lessons
  end

  def progress_percentage
    return 0 if total_lessons.zero?
    (completed_lessons.to_f / total_lessons * 100).round(1)
  end

  def summary
    "\#{title}: \#{progress_percentage}% complete"
  end
end

ruby_course = Course.new("Ruby Fundamentals", 5, 12)
puts ruby_course.summary`
  }
];






