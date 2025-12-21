// SEO data for different programming language courses
export const getCourseSEO = (language: string) => {
  const seoData: Record<string, {
    title: string;
    description: string;
    keywords: string;
    structuredData: object;
  }> = {
    java: {
      title: "Java Programming Course - Learn Java Online",
      description: "Master Java programming with interactive lessons covering OOP, collections, multithreading, and enterprise development. Build real-world applications.",
      keywords: "Java, Java programming, learn Java, Java course, Java tutorial, object-oriented programming, Java development, enterprise Java",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Java Programming Course",
        "description": "Master Java programming with object-oriented concepts, collections, multithreading, and enterprise development.",
        "provider": {
          "@type": "Organization",
          "name": "CodeAcademy Pro"
        },
        "courseCode": "JAVA-101",
        "educationalLevel": "Beginner to Advanced"
      }
    },
    cpp: {
      title: "C++ Programming Course - Learn C++ Online",
      description: "Master C++ programming with interactive lessons covering memory management, STL, templates, and system programming. Build high-performance applications.",
      keywords: "C++, C++ programming, learn C++, C++ course, C++ tutorial, systems programming, STL, templates, memory management",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "C++ Programming Course",
        "description": "Master C++ programming with memory management, STL, templates, and system programming.",
        "provider": {
          "@type": "Organization",
          "name": "CodeAcademy Pro"
        },
        "courseCode": "CPP-101",
        "educationalLevel": "Intermediate to Advanced"
      }
    },
    csharp: {
      title: "C# Programming Course - Learn C# Online",
      description: "Master C# programming with interactive lessons covering .NET framework, LINQ, async/await, and desktop/web development.",
      keywords: "C#, C# programming, learn C#, C# course, C# tutorial, .NET, ASP.NET, Windows development",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "C# Programming Course",
        "description": "Master C# programming with .NET framework, LINQ, async/await, and desktop/web development.",
        "provider": {
          "@type": "Organization",
          "name": "CodeAcademy Pro"
        },
        "courseCode": "CSHARP-101"
      }
    },
    go: {
      title: "Go Programming Course - Learn Go (Golang) Online",
      description: "Master Go programming with interactive lessons covering concurrency, goroutines, channels, and cloud-native development.",
      keywords: "Go, Golang, Go programming, learn Go, Go course, Go tutorial, concurrency, goroutines, cloud development",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Go Programming Course",
        "description": "Master Go programming with concurrency, goroutines, channels, and cloud-native development.",
        "provider": {
          "@type": "Organization",
          "name": "CodeAcademy Pro"
        },
        "courseCode": "GO-101"
      }
    },
    rust: {
      title: "Rust Programming Course - Learn Rust Online",
      description: "Master Rust programming with interactive lessons covering memory safety, ownership, lifetimes, and systems programming.",
      keywords: "Rust, Rust programming, learn Rust, Rust course, Rust tutorial, systems programming, memory safety, ownership",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Rust Programming Course",
        "description": "Master Rust programming with memory safety, ownership, lifetimes, and systems programming.",
        "provider": {
          "@type": "Organization",
          "name": "CodeAcademy Pro"
        },
        "courseCode": "RUST-101"
      }
    },
    typescript: {
      title: "TypeScript Programming Course - Learn TypeScript Online",
      description: "Master TypeScript programming with interactive lessons covering types, interfaces, generics, and modern web development.",
      keywords: "TypeScript, TS, TypeScript programming, learn TypeScript, TypeScript course, TypeScript tutorial, type safety, web development",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "TypeScript Programming Course",
        "description": "Master TypeScript programming with types, interfaces, generics, and modern web development.",
        "provider": {
          "@type": "Organization",
          "name": "CodeAcademy Pro"
        },
        "courseCode": "TS-101"
      }
    },
    swift: {
      title: "Swift Programming Course - Learn Swift Online",
      description: "Master Swift programming with interactive lessons covering iOS development, optionals, protocols, and Apple ecosystem.",
      keywords: "Swift, Swift programming, learn Swift, Swift course, Swift tutorial, iOS development, Apple development, mobile apps",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Swift Programming Course",
        "description": "Master Swift programming for iOS development, optionals, protocols, and Apple ecosystem.",
        "provider": {
          "@type": "Organization",
          "name": "CodeAcademy Pro"
        },
        "courseCode": "SWIFT-101"
      }
    },
    kotlin: {
      title: "Kotlin Programming Course - Learn Kotlin Online",
      description: "Master Kotlin programming with interactive lessons covering Android development, coroutines, null safety, and modern JVM development.",
      keywords: "Kotlin, Kotlin programming, learn Kotlin, Kotlin course, Kotlin tutorial, Android development, JVM, coroutines",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Kotlin Programming Course",
        "description": "Master Kotlin programming for Android development, coroutines, null safety, and modern JVM development.",
        "provider": {
          "@type": "Organization",
          "name": "CodeAcademy Pro"
        },
        "courseCode": "KOTLIN-101"
      }
    },
    php: {
      title: "PHP Programming Course - Learn PHP Online",
      description: "Master PHP programming with interactive lessons covering web development, Laravel, database integration, and server-side scripting.",
      keywords: "PHP, PHP programming, learn PHP, PHP course, PHP tutorial, web development, Laravel, server-side scripting",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "PHP Programming Course",
        "description": "Master PHP programming for web development, Laravel, database integration, and server-side scripting.",
        "provider": {
          "@type": "Organization",
          "name": "CodeAcademy Pro"
        },
        "courseCode": "PHP-101"
      }
    },
    ruby: {
      title: "Ruby Programming Course - Learn Ruby Online",
      description: "Master Ruby programming with interactive lessons covering Rails, metaprogramming, blocks, and elegant web development.",
      keywords: "Ruby, Ruby programming, learn Ruby, Ruby course, Ruby tutorial, Ruby on Rails, web development, scripting",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Ruby Programming Course",
        "description": "Master Ruby programming with Rails, metaprogramming, blocks, and elegant web development.",
        "provider": {
          "@type": "Organization",
          "name": "CodeAcademy Pro"
        },
        "courseCode": "RUBY-101"
      }
    },
    c: {
      title: "C Programming Course - Learn C Online",
      description: "Master C programming with interactive lessons covering pointers, memory management, data structures, and system programming.",
      keywords: "C, C programming, learn C, C course, C tutorial, systems programming, pointers, memory management",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "C Programming Course",
        "description": "Master C programming with pointers, memory management, data structures, and system programming.",
        "provider": {
          "@type": "Organization",
          "name": "CodeAcademy Pro"
        },
        "courseCode": "C-101"
      }
    },
    scala: {
      title: "Scala Programming Course - Learn Scala Online",
      description: "Master Scala programming with interactive lessons covering functional programming, Akka, Spark, and JVM development.",
      keywords: "Scala, Scala programming, learn Scala, Scala course, Scala tutorial, functional programming, Akka, Spark",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Scala Programming Course",
        "description": "Master Scala programming with functional programming, Akka, Spark, and JVM development.",
        "provider": {
          "@type": "Organization",
          "name": "CodeAcademy Pro"
        },
        "courseCode": "SCALA-101"
      }
    },
    dart: {
      title: "Dart Programming Course - Learn Dart Online",
      description: "Master Dart programming with interactive lessons covering Flutter, mobile development, async programming, and modern app development.",
      keywords: "Dart, Dart programming, learn Dart, Dart course, Dart tutorial, Flutter, mobile development, app development",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Dart Programming Course",
        "description": "Master Dart programming with Flutter, mobile development, async programming, and modern app development.",
        "provider": {
          "@type": "Organization",
          "name": "CodeAcademy Pro"
        },
        "courseCode": "DART-101"
      }
    },
    r: {
      title: "R Programming Course - Learn R Online",
      description: "Master R programming with interactive lessons covering data analysis, statistics, ggplot2, tidyverse, and data science.",
      keywords: "R, R programming, learn R, R course, R tutorial, data science, statistics, data analysis, ggplot2",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "R Programming Course",
        "description": "Master R programming for data analysis, statistics, ggplot2, tidyverse, and data science.",
        "provider": {
          "@type": "Organization",
          "name": "CodeAcademy Pro"
        },
        "courseCode": "R-101"
      }
    },
    perl: {
      title: "Perl Programming Course - Learn Perl Online",
      description: "Master Perl programming with interactive lessons covering text processing, regex, CPAN modules, and system administration.",
      keywords: "Perl, Perl programming, learn Perl, Perl course, Perl tutorial, text processing, regex, scripting",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Perl Programming Course",
        "description": "Master Perl programming for text processing, regex, CPAN modules, and system administration.",
        "provider": {
          "@type": "Organization",
          "name": "CodeAcademy Pro"
        },
        "courseCode": "PERL-101"
      }
    },
    haskell: {
      title: "Haskell Programming Course - Learn Haskell Online",
      description: "Master Haskell programming with interactive lessons covering functional programming, monads, functors, and elegant code design.",
      keywords: "Haskell, Haskell programming, learn Haskell, Haskell course, Haskell tutorial, functional programming, monads, pure functions",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Haskell Programming Course",
        "description": "Master Haskell programming with functional programming, monads, functors, and elegant code design.",
        "provider": {
          "@type": "Organization",
          "name": "CodeAcademy Pro"
        },
        "courseCode": "HASKELL-101"
      }
    },
    assembly: {
      title: "Assembly Programming Course - Learn Assembly Online",
      description: "Master Assembly programming with interactive lessons covering CPU architecture, registers, low-level programming, and system internals.",
      keywords: "Assembly, Assembly programming, learn Assembly, Assembly course, Assembly tutorial, low-level programming, CPU architecture, system programming",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Assembly Programming Course",
        "description": "Master Assembly programming with CPU architecture, registers, low-level programming, and system internals.",
        "provider": {
          "@type": "Organization",
          "name": "CodeAcademy Pro"
        },
        "courseCode": "ASM-101"
      }
    },
    matlab: {
      title: "MATLAB Programming Course - Learn MATLAB Online",
      description: "Master MATLAB programming with interactive lessons covering numerical computing, data visualization, signal processing, and engineering applications.",
      keywords: "MATLAB, MATLAB programming, learn MATLAB, MATLAB course, MATLAB tutorial, numerical computing, data visualization, engineering",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "MATLAB Programming Course",
        "description": "Master MATLAB programming for numerical computing, data visualization, signal processing, and engineering applications.",
        "provider": {
          "@type": "Organization",
          "name": "CodeAcademy Pro"
        },
        "courseCode": "MATLAB-101"
      }
    }
  };

  return seoData[language.toLowerCase()] || {
    title: `${language} Programming Course - Learn ${language} Online`,
    description: `Master ${language} programming with interactive lessons, hands-on exercises, and real-world projects.`,
    keywords: `${language}, ${language} programming, learn ${language}, ${language} course, ${language} tutorial`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": `${language} Programming Course`,
      "provider": {
        "@type": "Organization",
        "name": "CodeAcademy Pro"
      }
    }
  };
};


