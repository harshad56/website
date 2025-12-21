export type JavaDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface JavaTopic {
  id: string;
  title: string;
  content: string;
  duration: string;
  difficulty: JavaDifficulty;
  exercises: string[];
  codeExample: string;
}

export interface JavaModule {
  id: number;
  title: string;
  description: string;
  duration: string;
  exercises: number;
  completed: boolean;
  codeExample: string;
  topics: JavaTopic[];
}

export const javaModules: JavaModule[] = [
  {
    id: 1,
    title: "Java Fundamentals",
    description: "Build a rock-solid foundation in the language, tooling, and mindset of professional Java developers.",
    duration: "3.5 hours",
    exercises: 24,
    completed: false,
    codeExample: `public class FundamentalsOverview {
    public static void main(String[] args) {
        String learner = "Future Java Engineer";
        int modules = 6;
        double hours = 42.5;

        System.out.printf("Welcome, %s!%n", learner);
        System.out.printf("This roadmap covers %d modules (~%.1f hours).%n", modules, hours);
        System.out.println("Let's master the fundamentals together.");
    }
}`,
    topics: [
      {
        id: "1.1",
        title: "Java Ecosystem & Tooling",
        difficulty: "Beginner",
        duration: "45 min",
        content: `Java has dominated enterprise development since 1995 thanks to the JVM, a mature standard library, and a thriving tooling ecosystem.

What you learn:
- How the JVM loads, verifies, and executes bytecode
- Why JDK vs JRE matters for developers and deployments
- Key tooling: javac, jar, jshell, Maven, Gradle, IDE debuggers
- Understanding LTS releases (Java 8, 11, 17, 21) vs feature releases
- Navigating ecosystem pillars: Spring, Jakarta EE, Android, big data

By the end, you can articulate why teams pick Java for high-availability systems and how "write once, run anywhere" is achieved in practice.`,
        exercises: [
          "Install two different JDK distributions (Temurin, Oracle) and compare the folder layout.",
          "Use `jshell` to evaluate expressions and inspect the generated scratch class file.",
          "List five popular Java frameworks, the problems they solve, and when you would adopt each."
        ],
        codeExample: `public class JavaStory {
    public static void main(String[] args) {
        String vendor = System.getProperty("java.vendor");
        String version = System.getProperty("java.version");
        String vm = System.getProperty("java.vm.name");

        System.out.printf("Vendor : %s%nVersion: %s%nVM     : %s%n", vendor, version, vm);
    }
}`
      },
      {
        id: "1.2",
        title: "Syntax, Project Layout & Build Flow",
        difficulty: "Beginner",
        duration: "50 min",
        content: `Java code is structured into packages, classes, and methods. The compiler enforces strict file-to-class mapping, making large codebases predictable.

Key skills:
- Translating pseudocode into class/method structure
- Understanding package naming, access modifiers, and import resolution
- Differentiating src/main/java vs src/test/java in Maven/Gradle layouts
- Running compilation pipeline: source -> bytecode -> classpath -> execution
- Integrating formatting (Spotless), static analysis (Checkstyle), and tests (JUnit)

This mirrors the setup you see on GeeksforGeeks tutorials but expands it to production-grade builds.`,
        exercises: [
          "Create a Maven project from scratch, add a dependency, and print dependency tree.",
          "Write a class with package-private helper methods and observe compiler errors when accessed from another package.",
          "Add a Checkstyle or SpotBugs plugin to the project and fix at least three reported issues."
        ],
        codeExample: `package com.academy.bootstrap;

public class EntryPoint {
    private static final String APP_NAME = "CodeAcademy Pro";

    public static void main(String[] args) {
        printBanner();
        System.out.println("Arguments:");
        for (int i = 0; i < args.length; i++) {
            System.out.printf("  [%d] %s%n", i, args[i]);
        }
    }

    static void printBanner() {
        System.out.printf("======== %s ========%n", APP_NAME);
    }
}`
      },
      {
        id: "1.3",
        title: "Variables, Data Types & Memory",
        difficulty: "Beginner",
        duration: "60 min",
        content: `Java is statically typed, yet offers both primitive types (stored on the stack) and reference types (pointing into the heap). Mastering both is critical for writing efficient code.

Highlights:
- Primitive ranges, default values, literal syntax, and boxing/unboxing
- Reference semantics, null pitfalls, and how the garbage collector frees objects
- Understanding stack frames, method invocation, and pass-by-value semantics
- Type inference with `var`, though the declared type is still static
- Immutability patterns with final fields and defensive copies`,
        exercises: [
          "Create a table that lists all eight primitive types, their range, default value, and common use-case.",
          "Demonstrate how auto-boxing can allocate unnecessary objects in a tight loop and fix it.",
          "Write a SmallMutable vs Immutable data holder class and benchmark copying behavior."
        ],
        codeExample: `public class DataPlayground {
    public static void main(String[] args) {
        int students = 42;
        double completionRate = 0.975;
        boolean betaFeatureEnabled = Boolean.parseBoolean("true");

        var courseName = "Java Fundamentals";
        var cohort = new Cohort(courseName, students, completionRate, betaFeatureEnabled);
        System.out.println(cohort.summary());
    }

    record Cohort(String name, int size, double completion, boolean beta) {
        String summary() {
            return "%s: %d learners, %.1f%% completion, beta=%s"
                .formatted(name, size, completion * 100, beta);
        }
    }
}`
      },
      {
        id: "1.4",
        title: "Input/Output, Formatting & CLI UX",
        difficulty: "Beginner",
        duration: "55 min",
        content: `Real applications talk to users, files, and networks. Java's java.io, java.nio, and java.util.Scanner make it straightforward once you understand buffering and character encodings.

You will cover:
- Reading from standard input with Scanner and Console
- Differentiating println, printf, and String.format
- Writing colored CLI menus inspired by GeeksforGeeks interactive tutorials
- Using Paths, Files, and charset handling to avoid mojibake
- Safely closing resources with try-with-resources`,
        exercises: [
          "Build a CLI quiz that reads user answers, validates input, and saves scores to a file.",
          "Format a tabular progress report with printf, adding alignment and thousand separators.",
          "Read a UTF-8 file plus a UTF-16 file and normalize their content before printing."
        ],
        codeExample: `import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Scanner;

public class StudyLogger {
    public static void main(String[] args) throws IOException {
        try (Scanner scanner = new Scanner(System.in)) {
            System.out.print("Topic studied: ");
            String topic = scanner.nextLine();
            System.out.print("Minutes spent: ");
            int minutes = Integer.parseInt(scanner.nextLine());

            logSession(topic, minutes);
        }
    }

    private static void logSession(String topic, int minutes) throws IOException {
        Path file = Path.of("study-log.txt");
        try (BufferedWriter writer = Files.newBufferedWriter(file)) {
            writer.write("Topic: " + topic + " | Minutes: " + minutes);
            writer.newLine();
        }
        System.out.println("Session stored at " + file.toAbsolutePath());
    }
}`
      }
    ]
  },
  {
    id: 2,
    title: "Object-Oriented Programming",
    description: "Design expressive object models, reuse behavior safely, and master encapsulation like a senior engineer.",
    duration: "4.1 hours",
    exercises: 32,
    completed: false,
    codeExample: `public interface Exportable {
    String export();
}

public abstract class Report implements Exportable {
    protected final String title;
    protected Report(String title) {
        this.title = title;
    }
}

public final class PdfReport extends Report {
    public PdfReport(String title) {
        super(title);
    }

    @Override
    public String export() {
        return "Generating PDF for " + title;
    }
}`,
    topics: [
      {
        id: "2.1",
        title: "Classes, Objects & Encapsulation",
        difficulty: "Beginner",
        duration: "60 min",
        content: `Classes model real-world entities while enforcing invariants via encapsulation. We mimic GeeksforGeeks style diagrams but push further into design heuristics.

Core ideas:
- Designing cohesive classes with single responsibility
- Exposing behavior via methods while protecting state via private fields
- Using records, builders, and telescoping constructors
- Managing object identity vs value equality (equals/hashCode)`,
        exercises: [
          "Model a `Course` class with modules, instructors, and derived progress metrics.",
          "Refactor a DTO with public fields into an encapsulated object and discuss benefits.",
          "Override equals/hashCode for a `StudentId` value object and test in a HashSet."
        ],
        codeExample: `public class Course {
    private final String code;
    private String title;
    private int durationHours;

    public Course(String code, String title, int durationHours) {
        this.code = code;
        this.title = title;
        this.durationHours = durationHours;
    }

    public void rename(String newTitle) {
        this.title = newTitle;
    }

    @Override
    public String toString() {
        return "%s - %s (%dh)".formatted(code, title, durationHours);
    }
}`
      },
      {
        id: "2.2",
        title: "Constructors, Static Members & Method Design",
        difficulty: "Beginner",
        duration: "55 min",
        content: `Master constructor overloading, factory methods, static convenience helpers, and fluent APIs that feel great to use.

What we cover:
- Chaining constructors with this() and super()
- Static initialization blocks and caching
- Designing fluent setters vs immutable builders
- Method contracts, defensive programming, and JavaDoc`,
        exercises: [
          "Implement a `ProjectBuilder` with fluent setters and a build() method.",
          "Create a utility class with private constructor and static helpers (similar to Collections).",
          "Design a method signature list for a `PaymentGateway` and document preconditions."
        ],
        codeExample: `public class ApiClient {
    private final String baseUrl;
    private final int timeoutSeconds;

    private ApiClient(Builder builder) {
        this.baseUrl = builder.baseUrl;
        this.timeoutSeconds = builder.timeoutSeconds;
    }

    public static Builder builder(String baseUrl) {
        return new Builder(baseUrl);
    }

    public static final class Builder {
        private final String baseUrl;
        private int timeoutSeconds = 30;

        private Builder(String baseUrl) {
            this.baseUrl = baseUrl;
        }

        public Builder timeout(int seconds) {
            this.timeoutSeconds = seconds;
            return this;
        }

        public ApiClient build() {
            return new ApiClient(this);
        }
    }
}`
      },
      {
        id: "2.3",
        title: "Inheritance, Composition & Polymorphism",
        difficulty: "Intermediate",
        duration: "75 min",
        content: `Inheritance allows behavior reuse, but composition often yields better modularity. We compare both strategies and illustrate polymorphism with strategy patterns.

Focus areas:
- Abstract classes vs interfaces vs composition
- Using super() correctly and understanding method overriding
- Liskov Substitution Principle and how to spot violations
- Strategy, decorator, and template method patterns`,
        exercises: [
          "Refactor an inheritance-heavy hierarchy into composition plus interfaces.",
          "Implement a polymorphic `PaymentProcessor` that swaps algorithms at runtime.",
          "Create a template method that handles report generation with different exporters."
        ],
        codeExample: `public interface PaymentStrategy {
    void charge(double amount);
}

public final class PaypalStrategy implements PaymentStrategy {
    @Override
    public void charge(double amount) {
        System.out.println("PayPal charged $" + amount);
    }
}

public final class CheckoutService {
    private PaymentStrategy strategy;

    public CheckoutService(PaymentStrategy strategy) {
        this.strategy = strategy;
    }

    public void setStrategy(PaymentStrategy strategy) {
        this.strategy = strategy;
    }

    public void checkout(double amount) {
        strategy.charge(amount);
    }
}`
      },
      {
        id: "2.4",
        title: "Interfaces, Abstract Classes & SOLID Architecture",
        difficulty: "Intermediate",
        duration: "70 min",
        content: `Interfaces enable multiple inheritance of type, default methods, and functional-style hooks. Abstract classes bundle shared state. We map each SOLID principle to Java idioms.

Topics:
- Interface segregation and avoiding "god" interfaces
- Default vs static methods on interfaces (Java 8+)
- Abstract classes with protected helpers vs template methods
- Real-world SOLID refactors inspired by GeeksforGeeks case studies`,
        exercises: [
          "Split a bloated `Repository` interface into focused interfaces and adapters.",
          "Implement a default method on an interface and override selectively.",
          "Create an abstract base test class that enforces a test contract for multiple subclasses."
        ],
        codeExample: `public interface Auditable {
    default void audit(String action) {
        System.out.println("Audit -> " + action);
    }
}

public abstract class BaseRepository<T> implements Auditable {
    protected abstract void persist(T entity);
}

public final class UserRepository extends BaseRepository<String> {
    @Override
    protected void persist(String entity) {
        audit("Saving user " + entity);
    }
}`
      }
    ]
  },
  {
    id: 3,
    title: "Data Structures & Collections",
    description: "Manipulate arrays, generics, collections, and streams with confidence.",
    duration: "3.8 hours",
    exercises: 28,
    completed: false,
    codeExample: `import java.util.*;

public class CollectionsShowcase {
    public static void main(String[] args) {
        List<String> backlog = new ArrayList<>(List.of("Arrays", "Generics", "Streams"));
        backlog.replaceAll(String::toUpperCase);

        Map<String, Integer> velocity = Map.of("Week1", 12, "Week2", 18);
        velocity.forEach((week, points) -> System.out.println(week + " -> " + points));
    }
}`,
    topics: [
      {
        id: "3.1",
        title: "Arrays, ArrayList & Performance Trade-offs",
        difficulty: "Beginner",
        duration: "60 min",
        content: `Arrays are contiguous, fixed-length structures; ArrayLists wrap them with resizing semantics. Learn how memory layout impacts CPU cache friendliness and algorithmic complexity.`,
        exercises: [
          "Implement a circular buffer using a plain int[] and compare to ArrayDeque.",
          "Benchmark ArrayList add/remove at head vs tail vs LinkedList for 100k elements.",
          "Write a utility that converts between primitive arrays and List wrappers without autoboxing penalties."
        ],
        codeExample: `public class ArrayPlay {
    public static void main(String[] args) {
        int[] scores = {90, 85, 98, 76};
        int best = Arrays.stream(scores).max().orElseThrow();
        System.out.println("Best : " + best);

        List<Integer> scoreList = new ArrayList<>();
        for (int score : scores) {
            scoreList.add(score);
        }
        scoreList.removeIf(s -> s < 80);
        System.out.println(scoreList);
    }
}`
      },
      {
        id: "3.2",
        title: "Collections Framework Deep Dive",
        difficulty: "Intermediate",
        duration: "70 min",
        content: `Explore List, Set, Queue, Map, and specialized implementations (LinkedHashMap, TreeSet, PriorityQueue). Understand ordering guarantees, null policies, concurrent views, and fail-fast iterators.`,
        exercises: [
          "Build a frequency counter with HashMap, then switch to TreeMap to sort by key.",
          "Simulate an ISP routing table with PriorityQueue and show how comparator impacts ordering.",
          "Demonstrate how LinkedHashMap enables LRU caches by overriding removeEldestEntry."
        ],
        codeExample: `Map<String, Integer> lru = new LinkedHashMap<>(16, 0.75f, true) {
    @Override
    protected boolean removeEldestEntry(Map.Entry<String, Integer> eldest) {
        return size() > 3;
    }
};

List.of("A", "B", "C", "D", "B").forEach(key -> lru.put(key, key.charAt(0)));
System.out.println(lru);`
      },
      {
        id: "3.3",
        title: "Generics, Wildcards & Type Safety",
        difficulty: "Intermediate",
        duration: "55 min",
        content: `Generics remove casting boilerplate, but bounded type parameters, PECS (Producer Extends, Consumer Super), and type erasure can be confusing. We demystify it with diagrams and scenarios.`,
        exercises: [
          "Write a generic Pair<T, U> class with factory methods and equals/hashCode.",
          "Create a utility that copies elements between lists using wildcard captures.",
          "Explain why you cannot create new T() inside a generic class and present workarounds."
        ],
        codeExample: `public final class Pair<L, R> {
    private final L left;
    private final R right;

    private Pair(L left, R right) {
        this.left = left;
        this.right = right;
    }

    public static <L, R> Pair<L, R> of(L left, R right) {
        return new Pair<>(left, right);
    }

    public L left() { return left; }
    public R right() { return right; }
}`
      },
      {
        id: "3.4",
        title: "Iterators, Streams & Functional Pipelines",
        difficulty: "Intermediate",
        duration: "65 min",
        content: `Streams provide declarative data pipelines, parallel processing, and lazy evaluation. Learn to combine filter-map-reduce, custom collectors, and peek for debugging.`,
        exercises: [
          "Rewrite nested loops with stream pipelines and compare readability/performance.",
          "Implement a custom Collector that partitions learners into pass/fail lists.",
          "Use parallelStream responsibly and measure speedups vs overhead."
        ],
        codeExample: `List<String> badges = List.of("Java", "Python", "Go", "Rust");

String summary = badges.stream()
        .filter(b -> b.length() > 3)
        .map(String::toUpperCase)
        .sorted()
        .collect(Collectors.joining(", "));

System.out.println(summary);`
      }
    ]
  },
  {
    id: 4,
    title: "Exception Handling & I/O",
    description: "Write resilient programs that deal gracefully with files, networks, and unexpected conditions.",
    duration: "3.4 hours",
    exercises: 26,
    completed: false,
    codeExample: `try (BufferedReader reader = Files.newBufferedReader(Path.of("notes.txt"))) {
    reader.lines().forEach(System.out::println);
} catch (IOException ex) {
    throw new UncheckedIOException(ex);
}`,
    topics: [
      {
        id: "4.1",
        title: "Checked vs Unchecked Exceptions",
        difficulty: "Intermediate",
        duration: "60 min",
        content: `Java forces you to acknowledge recoverable errors. Understand when to throw checked exceptions, wrap them, or convert to domain-specific types. Learn best practices used in enterprise services.`,
        exercises: [
          "Refactor legacy code that swallows exceptions into meaningful error propagation.",
          "Design a hierarchy of custom exceptions for an e-commerce checkout flow.",
          "Implement retry logic with exponential backoff when encountering transient failures."
        ],
        codeExample: `public class ResourceFetcher {
    public String fetch(String url) throws IOException {
        if (url == null) {
            throw new IllegalArgumentException("url must not be null");
        }
        // simulate I/O
        return "OK";
    }
}`
      },
      {
        id: "4.2",
        title: "Modern File I/O (java.nio)",
        difficulty: "Intermediate",
        duration: "55 min",
        content: `java.nio provides non-blocking channels, buffers, and a powerful Files API. You will process huge files efficiently and avoid pitfalls like charset mismatches.`,
        exercises: [
          "Write a log analyzer that streams large files without loading them entirely in memory.",
          "Traverse a directory tree with Files.walk and filter for specific extensions.",
          "Compare buffered vs unbuffered file copy speeds on your machine."
        ],
        codeExample: `try (var lines = Files.lines(Path.of("server.log"))) {
    long errors = lines.filter(line -> line.contains("ERROR")).count();
    System.out.println("Errors found: " + errors);
}`
      },
      {
        id: "4.3",
        title: "Serialization, JSON & Data Formats",
        difficulty: "Intermediate",
        duration: "45 min",
        content: `Understand Java's built-in serialization, its security trade-offs, and modern alternatives (Jackson, Gson, record-based mapping).`,
        exercises: [
          "Serialize and deserialize a record using ObjectOutputStream/ObjectInputStream.",
          "Use Jackson to map JSON into immutable DTOs with validation.",
          "Design a migration strategy from Java serialization to JSON for an existing codebase."
        ],
        codeExample: `record Learner(String name, int progress) implements Serializable {}

var learner = new Learner("Harsh", 92);
try (var out = new ObjectOutputStream(Files.newOutputStream(Path.of("learner.bin")))) {
    out.writeObject(learner);
}`
      },
      {
        id: "4.4",
        title: "Logging, Resource Management & Observability",
        difficulty: "Intermediate",
        duration: "50 min",
        content: `Logging frameworks (SLF4J, Logback) provide context, structured events, and correlation IDs. Combine them with try-with-resources, MDC, and metrics to gain production insight.`,
        exercises: [
          "Replace System.out.println with SLF4J and add MDC entries for request IDs.",
          "Instrument a method with start/end logs plus execution time measurement.",
          "Integrate a metrics library (Micrometer) to emit counters on each exception."
        ],
        codeExample: `try (var scope = MDC.putCloseable("requestId", UUID.randomUUID().toString())) {
    log.info("Processing request");
    // business logic
    log.info("Request completed");
}`
      }
    ]
  },
  {
    id: 5,
    title: "Concurrency & Performance",
    description: "Use threads, executors, and concurrent collections to build highly responsive services.",
    duration: "4.2 hours",
    exercises: 30,
    completed: false,
    codeExample: `ExecutorService pool = Executors.newFixedThreadPool(4);
IntStream.range(0, 10).forEach(i -> pool.submit(() -> System.out.println("Task " + i)));
pool.shutdown();`,
    topics: [
      {
        id: "5.1",
        title: "Thread Lifecycle & Coordination",
        difficulty: "Advanced",
        duration: "70 min",
        content: `Understand how threads are created, scheduled, interrupted, and terminated. Write code that avoids race conditions using join, wait/notify, latches, and phasers.`,
        exercises: [
          "Implement a countdown latch that waits for three parallel tasks to finish.",
          "Simulate a producer/consumer queue with wait/notify and contrast with BlockingQueue.",
          "Handle thread interruption gracefully during blocking I/O."
        ],
        codeExample: `class Worker extends Thread {
    @Override
    public void run() {
        System.out.println(getName() + " running");
    }
}

new Worker().start();`
      },
      {
        id: "5.2",
        title: "Synchronization, Locks & Atomics",
        difficulty: "Advanced",
        duration: "65 min",
        content: `Use synchronized blocks, ReentrantLock, ReadWriteLock, and atomic classes to manage shared state. Learn about visibility (volatile), happens-before relationships, and lock contention.`,
        exercises: [
          "Create a thread-safe counter using synchronized, then using AtomicLong, and compare throughput.",
          "Implement a cache guarded by ReadWriteLock to allow concurrent reads.",
          "Detect and fix a deadlock scenario by reordering lock acquisition."
        ],
        codeExample: `public class Counter {
    private final AtomicLong value = new AtomicLong();
    public void increment() {
        value.incrementAndGet();
    }
}`
      },
      {
        id: "5.3",
        title: "Concurrent Collections & Reactive Patterns",
        difficulty: "Advanced",
        duration: "55 min",
        content: `Harness ConcurrentHashMap, CopyOnWriteArrayList, and concurrent queues. Understand fork/join, CompletableFuture, and structured concurrency for modern systems.`,
        exercises: [
          "Build a leaderboard backed by ConcurrentSkipListMap and update it from multiple threads.",
          "Combine CompletableFuture stages to load course data and recommendations in parallel.",
          "Use an ExecutorCompletionService to process tasks and handle the quickest results first."
        ],
        codeExample: `CompletableFuture<Integer> points = CompletableFuture.supplyAsync(() -> 42);
points.thenApply(p -> p * 2)
      .thenAccept(p -> System.out.println("Total points " + p));`
      },
      {
        id: "5.4",
        title: "Profiling, Benchmarking & JVM Tuning",
        difficulty: "Advanced",
        duration: "65 min",
        content: `Performance is holistic. Learn to benchmark with JMH, analyze flame graphs, tweak garbage collectors, and choose heap sizes for production traffic.`,
        exercises: [
          "Write a micro-benchmark with JMH comparing String concatenation strategies.",
          "Capture a CPU profile with Java Flight Recorder on a running service.",
          "Experiment with different GC algorithms (G1, ZGC) and note latency/throughput effects."
        ],
        codeExample: `@Benchmark
public void concatWithStringBuilder() {
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < 100; i++) {
        sb.append(i);
    }
}`
      }
    ]
  },
  {
    id: 6,
    title: "Modern Java & Architecture Patterns",
    description: "Adopt the latest language features and build production-ready backend services.",
    duration: "4 hours",
    exercises: 27,
    completed: false,
    codeExample: `record Lesson(String title, boolean completed) {}

var lesson = new Lesson("Records in Java", true);
System.out.println(lesson);`,
    topics: [
      {
        id: "6.1",
        title: "Functional Java (Lambdas, Streams, Optional)",
        difficulty: "Advanced",
        duration: "70 min",
        content: `Modern Java embraces functional constructs. Use lambdas, method references, Optional, and advanced stream collectors to write expressive data transformations.`,
        exercises: [
          "Refactor imperative code into lambda-based pipelines and measure readability gains.",
          "Create utility methods that return Optional instead of null and propagate errors elegantly.",
          "Build a custom collector that groups lessons by difficulty and flattens exercises."
        ],
        codeExample: `Optional<String> topic = Optional.of("Streams");
topic.filter(t -> t.length() > 5)
     .map(String::toUpperCase)
     .ifPresent(System.out::println);`
      },
      {
        id: "6.2",
        title: "Modules, JPMS & Multi-Module Builds",
        difficulty: "Advanced",
        duration: "60 min",
        content: `The Java Platform Module System (JPMS) provides strong encapsulation. Learn module-info syntax, exports, requires, and services directives. Build multi-module projects with Maven/Gradle.`,
        exercises: [
          "Modularize an existing monolithic JAR into three modules with clear boundaries.",
          "Use provides/uses clauses to implement service provider interfaces.",
          "Diagnose a split package issue and resolve it via module refactoring."
        ],
        codeExample: `module com.codeacademy.content {
    exports com.codeacademy.content.api;
    requires transitive java.sql;
}`
      },
      {
        id: "6.3",
        title: "RESTful APIs, Spring Boot & Testing",
        difficulty: "Advanced",
        duration: "55 min",
        content: `Learn modern backend patterns: dependency injection, REST controllers, validation, DTO mapping, and integration testing with Spring Boot and Testcontainers.`,
        exercises: [
          "Create a Spring Boot REST API for course modules with validation and error handling.",
          "Write integration tests that spin up PostgreSQL via Testcontainers.",
          "Add caching and pagination to an endpoint and document it with OpenAPI."
        ],
        codeExample: `@RestController
@RequestMapping("/api/modules")
public class ModuleController {
    @GetMapping
    public List<ModuleSummary> list() {
        return service.getModules();
    }
}`
      },
      {
        id: "6.4",
        title: "Deployment, Cloud & Observability",
        difficulty: "Advanced",
        duration: "55 min",
        content: `Ship Java services with Docker, Kubernetes, and CI/CD. Instrument applications with Micrometer, Prometheus, and tracing. Address configuration, secrets, and blue/green deployments.`,
        exercises: [
          "Containerize a Spring Boot service, add health checks, and configure readiness probes.",
          "Publish custom Micrometer metrics to Prometheus and visualize them in Grafana.",
          "Design a rollout strategy (blue/green or canary) and script it with GitHub Actions."
        ],
        codeExample: `FROM eclipse-temurin:17-jre
COPY target/app.jar /app/app.jar
ENTRYPOINT ["java","-jar","/app/app.jar"]`
      }
    ]
  }
];
