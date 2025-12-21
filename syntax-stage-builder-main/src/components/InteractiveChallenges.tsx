import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const InteractiveChallenges = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("java");
  const [selectedDifficulty, setSelectedDifficulty] = useState("basic");
  const [userCode, setUserCode] = useState("");
  const [output, setOutput] = useState("");
  const [testResults, setTestResults] = useState<any[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState(0);

  const challenges = {
    java: {
      basic: [
        {
          title: "Factorial Calculator",
          description: "Write a function to calculate the factorial of a number. The factorial of n is the product of all positive integers less than or equal to n.",
          problem: "Implement a method that takes an integer n and returns its factorial. Handle edge cases like 0 and negative numbers.",
          starterCode: `public class FactorialCalculator {
    public static int factorial(int n) {
        // Write your code here
        return 0;
    }
    
    public static void main(String[] args) {
        // Test your function
        System.out.println("Factorial of 5: " + factorial(5));
        System.out.println("Factorial of 0: " + factorial(0));
    }
}`,
          solution: `public class FactorialCalculator {
    public static int factorial(int n) {
        if (n < 0) {
            throw new IllegalArgumentException("Factorial is not defined for negative numbers");
        }
        if (n == 0 || n == 1) {
            return 1;
        }
        return n * factorial(n - 1);
    }
    
    public static void main(String[] args) {
        System.out.println("Factorial of 5: " + factorial(5));
        System.out.println("Factorial of 0: " + factorial(0));
    }
}`,
          testCases: [
            { input: "5", expected: "120", description: "Factorial of 5" },
            { input: "0", expected: "1", description: "Factorial of 0" },
            { input: "1", expected: "1", description: "Factorial of 1" },
            { input: "3", expected: "6", description: "Factorial of 3" }
          ],
          hints: [
            "Use recursion or iteration to calculate factorial",
            "Remember that factorial of 0 is 1",
            "Handle negative numbers appropriately"
          ]
        },
        {
          title: "Palindrome Checker",
          description: "Write a function to check if a string is a palindrome (reads the same forwards and backwards).",
          problem: "Implement a method that takes a string and returns true if it's a palindrome, false otherwise. Ignore case and non-alphanumeric characters.",
          starterCode: `public class PalindromeChecker {
    public static boolean isPalindrome(String str) {
        // Write your code here
        return false;
    }
    
    public static void main(String[] args) {
        // Test your function
        System.out.println("'racecar' is palindrome: " + isPalindrome("racecar"));
        System.out.println("'hello' is palindrome: " + isPalindrome("hello"));
    }
}`,
          solution: `public class PalindromeChecker {
    public static boolean isPalindrome(String str) {
        if (str == null) return false;
        
        // Remove non-alphanumeric characters and convert to lowercase
        String cleaned = str.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
        
        int left = 0;
        int right = cleaned.length() - 1;
        
        while (left < right) {
            if (cleaned.charAt(left) != cleaned.charAt(right)) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }
    
    public static void main(String[] args) {
        System.out.println("'racecar' is palindrome: " + isPalindrome("racecar"));
        System.out.println("'hello' is palindrome: " + isPalindrome("hello"));
    }
}`,
          testCases: [
            { input: "racecar", expected: "true", description: "Simple palindrome" },
            { input: "hello", expected: "false", description: "Non-palindrome" },
            { input: "A man a plan a canal Panama", expected: "true", description: "Palindrome with spaces" },
            { input: "", expected: "true", description: "Empty string" }
          ],
          hints: [
            "Remove non-alphanumeric characters and convert to lowercase",
            "Use two pointers approach",
            "Compare characters from both ends"
          ]
        }
      ],
      intermediate: [
        {
          title: "Longest Palindrome Substring",
          description: "Find the longest palindromic substring in a given string.",
          problem: "Implement a method that finds and returns the longest palindromic substring. If there are multiple palindromes of the same length, return the first one.",
          starterCode: `public class LongestPalindrome {
    public static String longestPalindrome(String s) {
        // Write your code here
        return "";
    }
    
    public static void main(String[] args) {
        System.out.println("Longest palindrome in 'babad': " + longestPalindrome("babad"));
        System.out.println("Longest palindrome in 'cbbd': " + longestPalindrome("cbbd"));
    }
}`,
          solution: `public class LongestPalindrome {
    public static String longestPalindrome(String s) {
        if (s == null || s.length() < 2) return s;
        
        int start = 0;
        int maxLength = 1;
        
        for (int i = 0; i < s.length(); i++) {
            // Check for odd length palindromes
            int len1 = expandAroundCenter(s, i, i);
            // Check for even length palindromes
            int len2 = expandAroundCenter(s, i, i + 1);
            
            int len = Math.max(len1, len2);
            if (len > maxLength) {
                start = i - (len - 1) / 2;
                maxLength = len;
            }
        }
        
        return s.substring(start, start + maxLength);
    }
    
    private static int expandAroundCenter(String s, int left, int right) {
        while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
            left--;
            right++;
        }
        return right - left - 1;
    }
    
    public static void main(String[] args) {
        System.out.println("Longest palindrome in 'babad': " + longestPalindrome("babad"));
        System.out.println("Longest palindrome in 'cbbd': " + longestPalindrome("cbbd"));
    }
}`,
          testCases: [
            { input: "babad", expected: "bab", description: "Basic test case" },
            { input: "cbbd", expected: "bb", description: "Even length palindrome" },
            { input: "a", expected: "a", description: "Single character" },
            { input: "ac", expected: "a", description: "No palindrome longer than 1" }
          ],
          hints: [
            "Use the expand around center approach",
            "Consider both odd and even length palindromes",
            "Keep track of the longest palindrome found"
          ]
        }
      ],
      advanced: [
        {
          title: "Java Chat Application",
          description: "Build a simple console-based chat application using Java networking.",
          problem: "Create a basic chat application with client-server architecture. The server should handle multiple clients and broadcast messages.",
          starterCode: `import java.io.*;
import java.net.*;
import java.util.*;

public class ChatServer {
    private static final int PORT = 8080;
    private static Set<PrintWriter> clients = new HashSet<>();
    
    public static void main(String[] args) {
        // Implement the server logic here
        System.out.println("Chat Server starting...");
    }
}

public class ChatClient {
    private static final String SERVER_IP = "localhost";
    private static final int SERVER_PORT = 8080;
    
    public static void main(String[] args) {
        // Implement the client logic here
        System.out.println("Chat Client starting...");
    }
}`,
          solution: `import java.io.*;
import java.net.*;
import java.util.*;

public class ChatServer {
    private static final int PORT = 8080;
    private static Set<PrintWriter> clients = new HashSet<>();
    
    public static void main(String[] args) {
        System.out.println("Chat Server starting on port " + PORT);
        
        try (ServerSocket serverSocket = new ServerSocket(PORT)) {
            while (true) {
                Socket clientSocket = serverSocket.accept();
                System.out.println("New client connected: " + clientSocket.getInetAddress());
                
                ClientHandler handler = new ClientHandler(clientSocket);
                new Thread(handler).start();
            }
        } catch (IOException e) {
            System.out.println("Server error: " + e.getMessage());
        }
    }
    
    static class ClientHandler implements Runnable {
        private Socket socket;
        private PrintWriter out;
        private BufferedReader in;
        
        public ClientHandler(Socket socket) {
            this.socket = socket;
        }
        
        public void run() {
            try {
                out = new PrintWriter(socket.getOutputStream(), true);
                in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                
                clients.add(out);
                
                String message;
                while ((message = in.readLine()) != null) {
                    broadcast(message);
                }
            } catch (IOException e) {
                System.out.println("Client error: " + e.getMessage());
            } finally {
                clients.remove(out);
                try {
                    socket.close();
                } catch (IOException e) {
                    System.out.println("Error closing socket: " + e.getMessage());
                }
            }
        }
        
        private void broadcast(String message) {
            for (PrintWriter client : clients) {
                client.println(message);
            }
        }
    }
}

public class ChatClient {
    private static final String SERVER_IP = "localhost";
    private static final int SERVER_PORT = 8080;
    
    public static void main(String[] args) {
        try (Socket socket = new Socket(SERVER_IP, SERVER_PORT);
             PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
             BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
             BufferedReader userInput = new BufferedReader(new InputStreamReader(System.in))) {
            
            System.out.println("Connected to chat server!");
            System.out.println("Type your messages (type 'quit' to exit):");
            
            // Start a thread to read messages from server
            Thread readerThread = new Thread(() -> {
                try {
                    String message;
                    while ((message = in.readLine()) != null) {
                        System.out.println("Received: " + message);
                    }
                } catch (IOException e) {
                    System.out.println("Error reading from server: " + e.getMessage());
                }
            });
            readerThread.start();
            
            // Read user input and send to server
            String userMessage;
            while ((userMessage = userInput.readLine()) != null) {
                if ("quit".equalsIgnoreCase(userMessage)) {
                    break;
                }
                out.println(userMessage);
            }
            
        } catch (IOException e) {
            System.out.println("Client error: " + e.getMessage());
        }
    }
}`,
          testCases: [
            { input: "Server Start", expected: "Server started successfully", description: "Server initialization" },
            { input: "Client Connect", expected: "Client connected successfully", description: "Client connection" },
            { input: "Message Broadcast", expected: "Message sent to all clients", description: "Message broadcasting" }
          ],
          hints: [
            "Use ServerSocket for the server",
            "Use Socket for the client",
            "Implement multi-threading for handling multiple clients",
            "Use PrintWriter and BufferedReader for communication"
          ]
        }
      ]
    },
    python: {
      basic: [
        {
          title: "List Operations",
          description: "Implement common list operations in Python.",
          problem: "Write functions to reverse a list, find the maximum element, and remove duplicates.",
          starterCode: `def reverse_list(lst):
    # Write your code here
    pass

def find_max(lst):
    # Write your code here
    pass

def remove_duplicates(lst):
    # Write your code here
    pass

# Test your functions
numbers = [1, 2, 3, 4, 5]
print("Original:", numbers)
print("Reversed:", reverse_list(numbers))
print("Max:", find_max(numbers))
print("No duplicates:", remove_duplicates([1, 2, 2, 3, 3, 4]))`,
          solution: `def reverse_list(lst):
    return lst[::-1]

def find_max(lst):
    if not lst:
        return None
    return max(lst)

def remove_duplicates(lst):
    return list(dict.fromkeys(lst))

# Test your functions
numbers = [1, 2, 3, 4, 5]
print("Original:", numbers)
print("Reversed:", reverse_list(numbers))
print("Max:", find_max(numbers))
print("No duplicates:", remove_duplicates([1, 2, 2, 3, 3, 4]))`,
          testCases: [
            { input: "[1,2,3,4,5]", expected: "[5,4,3,2,1]", description: "Reverse list" },
            { input: "[1,2,3,4,5]", expected: "5", description: "Find maximum" },
            { input: "[1,2,2,3,3,4]", expected: "[1,2,3,4]", description: "Remove duplicates" }
          ],
          hints: [
            "Use list slicing for reversal",
            "Use the max() function",
            "Use dict.fromkeys() to remove duplicates"
          ]
        }
      ]
    },
    javascript: {
      basic: [
        {
          title: "Array Methods",
          description: "Implement common array methods in JavaScript.",
          problem: "Write functions to filter, map, and reduce arrays.",
          starterCode: `// Custom filter function
function customFilter(arr, callback) {
    // Write your code here
}

// Custom map function
function customMap(arr, callback) {
    // Write your code here
}

// Custom reduce function
function customReduce(arr, callback, initialValue) {
    // Write your code here
}

// Test your functions
const numbers = [1, 2, 3, 4, 5, 6];
console.log("Filtered (even):", customFilter(numbers, x => x % 2 === 0));
console.log("Mapped (doubled):", customMap(numbers, x => x * 2));
console.log("Reduced (sum):", customReduce(numbers, (acc, curr) => acc + curr, 0));`,
          solution: `// Custom filter function
function customFilter(arr, callback) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        if (callback(arr[i], i, arr)) {
            result.push(arr[i]);
        }
    }
    return result;
}

// Custom map function
function customMap(arr, callback) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        result.push(callback(arr[i], i, arr));
    }
    return result;
}

// Custom reduce function
function customReduce(arr, callback, initialValue) {
    let accumulator = initialValue !== undefined ? initialValue : arr[0];
    const startIndex = initialValue !== undefined ? 0 : 1;
    
    for (let i = startIndex; i < arr.length; i++) {
        accumulator = callback(accumulator, arr[i], i, arr);
    }
    return accumulator;
}

// Test your functions
const numbers = [1, 2, 3, 4, 5, 6];
console.log("Filtered (even):", customFilter(numbers, x => x % 2 === 0));
console.log("Mapped (doubled):", customMap(numbers, x => x * 2));
console.log("Reduced (sum):", customReduce(numbers, (acc, curr) => acc + curr, 0));`,
          testCases: [
            { input: "[1,2,3,4,5,6]", expected: "[2,4,6]", description: "Filter even numbers" },
            { input: "[1,2,3,4,5]", expected: "[2,4,6,8,10]", description: "Map to double" },
            { input: "[1,2,3,4,5]", expected: "15", description: "Reduce to sum" }
          ],
          hints: [
            "Use a for loop to iterate through the array",
            "Apply the callback function to each element",
            "Build up the result array or value"
          ]
        }
      ]
    }
  };

  const currentChallenges = challenges[selectedLanguage as keyof typeof challenges]?.[selectedDifficulty as keyof typeof challenges.java] || [];

  const runTests = () => {
    if (!currentChallenges[currentChallenge]) return;

    const challenge = currentChallenges[currentChallenge];
    const results = challenge.testCases.map((testCase, index) => {
      // Simulate test execution
      const isCorrect = Math.random() > 0.3; // Simulate 70% success rate
      return {
        testCase: index + 1,
        input: testCase.input,
        expected: testCase.expected,
        actual: isCorrect ? testCase.expected : "incorrect output",
        passed: isCorrect,
        description: testCase.description
      };
    });

    setTestResults(results);
    
    const passedTests = results.filter(r => r.passed).length;
    const totalTests = results.length;
    
    if (passedTests === totalTests) {
      setOutput(`🎉 All tests passed! (${passedTests}/${totalTests})\n\nGreat job! Your solution is correct.`);
    } else {
      setOutput(`❌ Some tests failed. (${passedTests}/${totalTests})\n\nCheck your implementation and try again.`);
    }
  };

  const resetCode = () => {
    if (currentChallenges[currentChallenge]) {
      setUserCode(currentChallenges[currentChallenge].starterCode);
    }
    setOutput("");
    setTestResults([]);
  };

  const showHint = () => {
    if (currentChallenges[currentChallenge]?.hints) {
      const hints = currentChallenges[currentChallenge].hints;
      const currentHint = hints[Math.floor(Math.random() * hints.length)];
      alert(`💡 Hint: ${currentHint}`);
    }
  };

  return (
    <section id="coding-challenges" className="py-24 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Interactive</span> Coding Challenges
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Test your programming skills with real-world coding challenges. 
            Write code, run tests, and get instant feedback on your solutions.
          </p>
        </div>

        {/* Language and Difficulty Selection */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Programming Language</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="java">☕ Java</SelectItem>
                  <SelectItem value="python">🐍 Python</SelectItem>
                  <SelectItem value="javascript">⚡ JavaScript</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Difficulty Level</label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">🟢 Basic</SelectItem>
                  <SelectItem value="intermediate">🟡 Intermediate</SelectItem>
                  <SelectItem value="advanced">🔴 Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {currentChallenges.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Challenge Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Challenge Navigation */}
                <div className="flex flex-wrap gap-2">
                  {currentChallenges.map((challenge, index) => (
                    <Button
                      key={index}
                      variant={currentChallenge === index ? "default" : "outline"}
                      onClick={() => {
                        setCurrentChallenge(index);
                        setUserCode(challenge.starterCode);
                        setOutput("");
                        setTestResults([]);
                      }}
                      className="transition-all duration-300"
                    >
                      Challenge {index + 1}
                    </Button>
                  ))}
                </div>

                {/* Current Challenge */}
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Badge variant="secondary">{selectedDifficulty.toUpperCase()}</Badge>
                      {currentChallenges[currentChallenge]?.title}
                    </CardTitle>
                    <CardDescription className="text-lg">
                      {currentChallenges[currentChallenge]?.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Problem Statement:</h4>
                      <p className="text-muted-foreground">
                        {currentChallenges[currentChallenge]?.problem}
                      </p>
                    </div>

                    {/* Code Editor */}
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Your Solution:</h4>
                      <div className="bg-code-bg p-4 rounded-lg">
                        <textarea
                          className="w-full h-64 bg-transparent text-code-foreground resize-none outline-none font-mono text-sm leading-relaxed"
                          value={userCode}
                          onChange={(e) => setUserCode(e.target.value)}
                          placeholder="Write your code here..."
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4">
                      <Button onClick={runTests} className="flex-1">
                        🧪 Run Tests
                      </Button>
                      <Button variant="outline" onClick={resetCode}>
                        🔄 Reset Code
                      </Button>
                      <Button variant="secondary" onClick={showHint}>
                        💡 Get Hint
                      </Button>
                    </div>

                    {/* Output */}
                    {output && (
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Results:</h4>
                        <pre className="text-sm whitespace-pre-wrap">{output}</pre>
                      </div>
                    )}

                    {/* Test Results */}
                    {testResults.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Test Results:</h4>
                        <div className="space-y-2">
                          {testResults.map((result, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-lg border ${
                                result.passed
                                  ? "bg-green-50 border-green-200"
                                  : "bg-red-50 border-red-200"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium">
                                  Test {result.testCase}: {result.description}
                                </span>
                                <Badge variant={result.passed ? "default" : "destructive"}>
                                  {result.passed ? "PASS" : "FAIL"}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                Input: {result.input} | Expected: {result.expected} | Actual: {result.actual}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Challenge Info */}
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle>Challenge Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Available Challenges:</h4>
                        <div className="space-y-2">
                          {currentChallenges.map((challenge, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setCurrentChallenge(index);
                                setUserCode(challenge.starterCode);
                                setOutput("");
                                setTestResults([]);
                              }}
                              className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                                currentChallenge === index
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-muted"
                              }`}
                            >
                              <div className="font-medium">{challenge.title}</div>
                              <div className="text-sm opacity-80">{challenge.description}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tips */}
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle>💡 Tips for Success</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Read the problem statement carefully</li>
                      <li>• Plan your solution before coding</li>
                      <li>• Test with edge cases</li>
                      <li>• Use the hints if you're stuck</li>
                      <li>• Check the test cases for expected output</li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Leaderboard */}
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle>🏆 Leaderboard</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">1. John Doe</span>
                        <Badge variant="secondary">95%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">2. Jane Smith</span>
                        <Badge variant="secondary">88%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">3. Bob Johnson</span>
                        <Badge variant="secondary">82%</Badge>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => alert("🏆 Submit your solution to compete on the leaderboard!")}
                    >
                      Submit Solution
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* More Challenges */}
        <div className="mt-16 text-center">
          <Card className="border-border bg-card max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">🚀 Ready for More Challenges?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Explore our extensive collection of coding challenges across multiple programming languages and difficulty levels.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline"
                  onClick={() => alert("📚 Algorithm Challenges\n\n• Sorting and Searching\n• Dynamic Programming\n• Graph Algorithms\n• String Manipulation\n• Data Structures\n\nComing soon!")}
                >
                  🧮 Algorithms
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => alert("🌐 Web Development\n\n• DOM Manipulation\n• API Integration\n• State Management\n• Component Architecture\n• Performance Optimization\n\nComing soon!")}
                >
                  🌐 Web Dev
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => alert("🤖 Machine Learning\n\n• Data Preprocessing\n• Model Training\n• Feature Engineering\n• Model Evaluation\n• Deployment\n\nComing soon!")}
                >
                  🤖 ML/AI
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default InteractiveChallenges; 