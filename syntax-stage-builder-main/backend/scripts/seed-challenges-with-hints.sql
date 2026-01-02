-- Seed Challenges with Hints for Multiple Languages
-- Path: backend/scripts/seed-challenges-with-hints.sql

-- First, ensure the tables exist (from create-challenges-and-tutorials.sql)
-- Then insert or update challenges with hints

INSERT INTO challenges (title, description, problem_statement, difficulty, language, category, starter_code, solution_code, test_cases, hints, points)
VALUES
  (
    'Factorial Calculator', 
    'Calculate the factorial of a number.', 
    'Implement a method that takes an integer n and returns its factorial. Handle edge cases like 0 and negative numbers.', 
    'beginner', 
    'java', 
    'coding', 
    'public class FactorialCalculator {\n    public static int factorial(int n) {\n        // Write your code here\n        return 0;\n    }\n}', 
    '', 
    '[{"input": "5", "expected": "120", "description": "Factorial of 5"}, {"input": "0", "expected": "1", "description": "Factorial of 0"}]', 
    '["n! = n * (n-1) * ... * 1", "0! is 1"]', 
    50
  ),
  (
    'List Operations', 
    'Reverse a list and find max.', 
    'Implement functions to reverse a list and find the maximum element.', 
    'beginner', 
    'python', 
    'coding', 
    'def reverse_list(lst):\n    # Write your code here\n    pass\n\ndef find_max(lst):\n    # Write your code here\n    pass', 
    '', 
    '[{"input": "[1,2,3]", "expected": "[3,2,1]", "description": "Reverse list"}]', 
    '["Use lst[::-1] for reverse", "Use the built-in max() function"]', 
    50
  ),
  (
    'Array Transformation', 
    'Use map and filter.', 
    'Write functions to double numbers and filter even values.', 
    'beginner', 
    'javascript', 
    'coding', 
    'function transform(numbers) {\n    // Write your code here\n}', 
    '', 
    '[{"input": "[1,2,3,4]", "expected": "[4,8]", "description": "Double even numbers"}]', 
    '["Use numbers.filter() for evens", "Then use .map() to double them"]', 
    50
  ),
  (
    'Sum of Array', 
    'Calculate sum of integers.', 
    'Write a method that takes an array of integers and returns their sum.', 
    'beginner', 
    'csharp', 
    'coding', 
    'public class Calculator {\n    public int Sum(int[] numbers) {\n        // Write your code here\n        return 0;\n    }\n}', 
    '', 
    '[{"input": "[1,2,3]", "expected": "6", "description": "Sum of 1,2,3"}]', 
    '["Use a foreach loop", "Initialize a sum variable to 0"]', 
    50
  ),
  (
    'Personalized Greeting', 
    'Return a greeting string.', 
    'Write a function that takes a name and returns "Hello, [name]!".', 
    'beginner', 
    'swift', 
    'coding', 
    'func greet(name: String) -> String {\n    // Write your code here\n    return \"\"\n}', 
    '', 
    '[{"input": "Swift", "expected": "Hello, Swift!", "description": "Greet Swift"}]', 
    '["Use string interpolation \\(name)", "Return the literal string with the name"]', 
    50
  ),
  (
    'Find Minimum', 
    'Find the smallest number.', 
    'Write a function that takes two integers and returns the smaller one.', 
    'beginner', 
    'cpp', 
    'coding', 
    'int findMin(int a, int b) {\n    // Write your code here\n    return 0;\n}', 
    '', 
    '[{"input": "10, 5", "expected": "5", "description": "Min of 10 and 5"}]', 
    '["Use an if-else statement", "Or use the ternary operator ?: "]', 
    50
  ),
  (
    'String Length', 
    'Return string length.', 
    'Write a method that takes a string and returns its length.', 
    'beginner', 
    'ruby', 
    'coding', 
    'def get_length(str)\n    # Write your code here\nend', 
    '', 
    '[{"input": "\"hello\"", "expected": "5", "description": "Length of hello"}]', 
    '["Use the .length method", "Or use .size"]', 
    50
  ),
  (
    'Addition', 
    'Add two numbers.', 
    'Write a function that returns the sum of two numbers.', 
    'beginner', 
    'php', 
    'coding', 
    'function add($a, $b) {\n    // Write your code here\n}', 
    '', 
    '[{"input": "10, 20", "expected": "30", "description": "10 + 20"}]', 
    '["Use the + operator", "Return the result"]', 
    50
  )
ON CONFLICT (title, language) DO UPDATE SET 
  hints = EXCLUDED.hints,
  test_cases = EXCLUDED.test_cases,
  problem_statement = EXCLUDED.problem_statement,
  starter_code = EXCLUDED.starter_code;
