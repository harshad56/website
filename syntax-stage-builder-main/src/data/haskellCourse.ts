export type HaskellDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface HaskellTopic {
  id: string;
  title: string;
  content: string;
  duration: string;
  difficulty: HaskellDifficulty;
  exercises: number;
}

export interface HaskellModule {
  id: number;
  title: string;
  description: string;
  topics: HaskellTopic[];
  duration: string;
  exercises: number;
  completed: boolean;
  codeExample: string;
}

export const haskellModules: HaskellModule[] = [
  {
    id: 1,
    title: "Haskell Fundamentals",
    description: "Learn the basics of pure functional programming with Haskell.",
    topics: [
      {
        id: "haskell-intro",
        title: "Introduction to Haskell",
        content:
          "Haskell is a purely functional programming language known for its strong static typing, lazy evaluation, and mathematical elegance. In this topic you will learn about Haskell's history, its influence on other languages, and why functional programming matters. You will install GHC (Glasgow Haskell Compiler) and GHCi (the interactive interpreter).\n\nBy the end you will understand what makes Haskell unique and be ready to explore functional programming concepts.",
        duration: "45 min",
        difficulty: "Beginner",
        exercises: 4
      },
      {
        id: "haskell-types",
        title: "Types & Type Inference",
        content:
          "Haskell's type system is one of its greatest strengths. In this topic you will learn about basic types like Int, Integer, Float, Double, Bool, and Char. You will understand type signatures, type inference, and how the compiler catches errors at compile time.\n\nYou will also explore type classes like Eq, Ord, Show, and Num. By the end you will appreciate how types help you write correct programs.",
        duration: "55 min",
        difficulty: "Beginner",
        exercises: 6
      },
      {
        id: "haskell-functions",
        title: "Functions & Currying",
        content:
          "Functions are the heart of Haskell. In this topic you will define functions, understand partial application and currying, and use higher-order functions. You will learn about function composition with the (.) operator and the $ operator for avoiding parentheses.\n\nBy the end you will be comfortable thinking in terms of functions and function transformations.",
        duration: "60 min",
        difficulty: "Beginner",
        exercises: 7
      },
      {
        id: "haskell-lists",
        title: "Lists & Recursion",
        content:
          "Lists are the fundamental data structure in Haskell. In this topic you will create lists, use list operations like head, tail, and cons (:), and work with list comprehensions. You will understand recursion as the primary way to process lists and implement common patterns.\n\nBy the end you will be able to write elegant recursive solutions for list processing problems.",
        duration: "55 min",
        difficulty: "Beginner",
        exercises: 6
      }
    ],
    duration: "3.6 hours",
    exercises: 23,
    completed: false,
    codeExample: `-- Haskell Fundamentals

-- Type signatures
greet :: String -> String
greet name = "Hello, " ++ name ++ "!"

-- Function with multiple arguments (curried)
add :: Int -> Int -> Int
add x y = x + y

-- Partial application
addFive :: Int -> Int
addFive = add 5

-- List operations
doubleAll :: [Int] -> [Int]
doubleAll xs = [x * 2 | x <- xs]

-- Recursive function
factorial :: Integer -> Integer
factorial 0 = 1
factorial n = n * factorial (n - 1)

-- Higher-order function
applyTwice :: (a -> a) -> a -> a
applyTwice f x = f (f x)

-- Main function
main :: IO ()
main = do
    putStrLn (greet "Haskell Learner")
    print (doubleAll [1, 2, 3, 4, 5])
    print (factorial 10)
    print (applyTwice (+3) 10)`
  },
  {
    id: 2,
    title: "Algebraic Data Types",
    description: "Model data with custom types, pattern matching, and type classes.",
    topics: [
      {
        id: "haskell-adt",
        title: "Defining Data Types",
        content:
          "Algebraic data types (ADTs) let you create custom types that model your domain precisely. In this topic you will define sum types (alternatives) and product types (combinations) using the data keyword. You will create types like Maybe, Either, and custom domain types.\n\nBy the end you will understand how ADTs help you represent data accurately and catch errors at compile time.",
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 6
      },
      {
        id: "haskell-pattern-matching",
        title: "Pattern Matching",
        content:
          "Pattern matching is how you deconstruct data in Haskell. In this topic you will match on constructors, use wildcards and as-patterns, and handle all cases exhaustively. You will see how the compiler warns about incomplete patterns.\n\nBy the end you will be able to write clear, safe code that handles all possible cases of your data types.",
        duration: "50 min",
        difficulty: "Intermediate",
        exercises: 6
      },
      {
        id: "haskell-typeclasses",
        title: "Type Classes",
        content:
          "Type classes provide ad-hoc polymorphism in Haskell. In this topic you will understand built-in type classes like Eq, Ord, Show, Read, and Num. You will derive instances automatically and write custom instances for your types.\n\nBy the end you will understand how type classes enable polymorphic functions while maintaining type safety.",
        duration: "60 min",
        difficulty: "Intermediate",
        exercises: 7
      },
      {
        id: "haskell-records",
        title: "Records & Modules",
        content:
          "Records provide named fields for product types. In this topic you will define record types, use record syntax for construction and pattern matching, and understand record update syntax. You will also organize code into modules with exports and imports.\n\nBy the end you will be able to structure larger Haskell programs with proper modularity.",
        duration: "50 min",
        difficulty: "Intermediate",
        exercises: 5
      }
    ],
    duration: "3.6 hours",
    exercises: 24,
    completed: false,
    codeExample: `-- Algebraic Data Types

-- Sum type (enumeration)
data Status = NotStarted | InProgress | Completed
    deriving (Show, Eq)

-- Product type with record syntax
data Course = Course
    { courseTitle :: String
    , courseDuration :: Int
    , courseStatus :: Status
    } deriving (Show)

-- Parameterized type
data Result a = Success a | Failure String
    deriving (Show)

-- Pattern matching
describeStatus :: Status -> String
describeStatus NotStarted = "You haven't started yet"
describeStatus InProgress = "Keep going!"
describeStatus Completed = "Congratulations!"

-- Working with Maybe
safeDivide :: Int -> Int -> Maybe Int
safeDivide _ 0 = Nothing
safeDivide x y = Just (x \`div\` y)

-- Type class instance
instance Eq Course where
    c1 == c2 = courseTitle c1 == courseTitle c2

main :: IO ()
main = do
    let course = Course "Haskell" 20 InProgress
    putStrLn (describeStatus (courseStatus course))
    print (safeDivide 10 2)
    print (safeDivide 10 0)`
  },
  {
    id: 3,
    title: "Functors, Applicatives & Monads",
    description: "Master Haskell's powerful abstractions for composing computations.",
    topics: [
      {
        id: "haskell-functors",
        title: "Functors",
        content:
          "Functors represent types that can be mapped over. In this topic you will understand the Functor type class and its fmap function. You will see how Maybe, Either, lists, and IO are all functors. You will learn the functor laws and why they matter.\n\nBy the end you will recognize the functor pattern and use it to transform values in context.",
        duration: "50 min",
        difficulty: "Intermediate",
        exercises: 5
      },
      {
        id: "haskell-applicatives",
        title: "Applicative Functors",
        content:
          "Applicatives extend functors to allow applying functions that are also in a context. In this topic you will learn about the Applicative type class with pure and <*>. You will see how applicatives enable combining multiple effectful values.\n\nBy the end you will understand when to use applicatives versus functors and how they simplify common patterns.",
        duration: "55 min",
        difficulty: "Advanced",
        exercises: 6
      },
      {
        id: "haskell-monads",
        title: "Monads",
        content:
          "Monads are Haskell's way of sequencing computations with effects. In this topic you will understand the Monad type class with return and >>= (bind). You will see how Maybe, Either, IO, and lists are monads. You will learn the monad laws and use do-notation.\n\nBy the end you will understand monads well enough to use them effectively, even if the full theory takes time to internalize.",
        duration: "65 min",
        difficulty: "Advanced",
        exercises: 7
      },
      {
        id: "haskell-io",
        title: "IO & Side Effects",
        content:
          "Haskell separates pure functions from side effects using the IO monad. In this topic you will perform input/output operations, understand how IO maintains purity, and combine IO actions. You will read and write files, handle command-line arguments, and work with exceptions.\n\nBy the end you will be able to write practical Haskell programs that interact with the outside world.",
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 6
      }
    ],
    duration: "3.8 hours",
    exercises: 24,
    completed: false,
    codeExample: `-- Functors, Applicatives, Monads

import Control.Applicative
import Control.Monad

-- Functor example
incrementMaybe :: Maybe Int -> Maybe Int
incrementMaybe = fmap (+1)

-- Applicative example
addMaybes :: Maybe Int -> Maybe Int -> Maybe Int
addMaybes mx my = (+) <$> mx <*> my

-- Monad example with do-notation
safeDivideChain :: Int -> Int -> Int -> Maybe Int
safeDivideChain x y z = do
    result1 <- safeDivide x y
    result2 <- safeDivide result1 z
    return result2
  where
    safeDivide _ 0 = Nothing
    safeDivide a b = Just (a \`div\` b)

-- IO Monad
greetUser :: IO ()
greetUser = do
    putStrLn "What is your name?"
    name <- getLine
    putStrLn ("Hello, " ++ name ++ "!")

-- Combining IO actions
countdown :: Int -> IO ()
countdown 0 = putStrLn "Liftoff!"
countdown n = do
    print n
    countdown (n - 1)

main :: IO ()
main = do
    print (incrementMaybe (Just 5))
    print (addMaybes (Just 3) (Just 4))
    print (safeDivideChain 100 5 2)
    countdown 5`
  },
  {
    id: 4,
    title: "Advanced Haskell",
    description: "Explore advanced topics like lazy evaluation, concurrency, and real-world applications.",
    topics: [
      {
        id: "haskell-lazy",
        title: "Lazy Evaluation",
        content:
          "Haskell evaluates expressions lazily, computing values only when needed. In this topic you will understand lazy evaluation, infinite data structures, and thunks. You will learn about strictness annotations and when laziness can cause space leaks.\n\nBy the end you will understand how to leverage laziness and when to force strict evaluation.",
        duration: "55 min",
        difficulty: "Advanced",
        exercises: 6
      },
      {
        id: "haskell-transformers",
        title: "Monad Transformers",
        content:
          "Real programs often need to combine multiple monadic effects. In this topic you will learn about monad transformers like StateT, ReaderT, and ExceptT. You will stack transformers to create custom monads for your application.\n\nBy the end you will be able to manage complex effect stacks in practical Haskell applications.",
        duration: "60 min",
        difficulty: "Advanced",
        exercises: 6
      },
      {
        id: "haskell-concurrency",
        title: "Concurrency & Parallelism",
        content:
          "Haskell offers powerful abstractions for concurrent and parallel programming. In this topic you will use forkIO for lightweight threads, MVars and STM for communication, and the async library for structured concurrency. You will also explore parallel strategies.\n\nBy the end you will understand Haskell's approach to safe, composable concurrency.",
        duration: "60 min",
        difficulty: "Advanced",
        exercises: 6
      },
      {
        id: "haskell-practical",
        title: "Building Real Applications",
        content:
          "Haskell is used in production for web servers, compilers, and financial systems. In this topic you will explore the Haskell ecosystem: build tools (Cabal, Stack), web frameworks (Servant, Yesod), and testing libraries. You will structure a small application with proper project layout.\n\nBy the end you will be ready to build real-world Haskell applications.",
        duration: "55 min",
        difficulty: "Advanced",
        exercises: 5
      }
    ],
    duration: "3.8 hours",
    exercises: 23,
    completed: false,
    codeExample: `-- Advanced Haskell

import Control.Concurrent
import Control.Concurrent.STM
import Control.Monad

-- Infinite list (lazy evaluation)
fibs :: [Integer]
fibs = 0 : 1 : zipWith (+) fibs (tail fibs)

-- Take first 10 Fibonacci numbers
firstTenFibs :: [Integer]
firstTenFibs = take 10 fibs

-- STM example: shared counter
type Counter = TVar Int

newCounter :: IO Counter
newCounter = newTVarIO 0

increment :: Counter -> STM ()
increment counter = modifyTVar counter (+1)

getCount :: Counter -> STM Int
getCount = readTVar

-- Concurrent increment
concurrentDemo :: IO ()
concurrentDemo = do
    counter <- newCounter
    
    -- Spawn 100 threads, each incrementing 100 times
    forM_ [1..100] $ \\_ -> forkIO $
        replicateM_ 100 $ atomically $ increment counter
    
    threadDelay 1000000  -- Wait for threads
    
    finalCount <- atomically $ getCount counter
    putStrLn $ "Final count: " ++ show finalCount

main :: IO ()
main = do
    print firstTenFibs
    concurrentDemo`
  }
];




