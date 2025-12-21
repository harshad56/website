export type PerlDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface PerlTopic {
  id: string;
  title: string;
  content: string;
  duration: string;
  difficulty: PerlDifficulty;
  exercises: number;
}

export interface PerlModule {
  id: number;
  title: string;
  description: string;
  topics: PerlTopic[];
  duration: string;
  exercises: number;
  completed: boolean;
  codeExample: string;
}

export const perlModules: PerlModule[] = [
  {
    id: 1,
    title: "Perl Fundamentals",
    description: "Learn the basics of Perl programming for text processing and scripting.",
    topics: [
      {
        id: "perl-intro",
        title: "Introduction to Perl",
        content:
          "Perl is a high-level, general-purpose programming language known for its powerful text processing capabilities. In this topic you will learn about Perl's history, its motto 'There's more than one way to do it' (TIMTOWTDI), and why it remains relevant for system administration, web development, and bioinformatics.\n\nYou will install Perl, write your first script, and understand the basic execution model. By the end you will appreciate Perl's flexibility and be ready to explore its unique features.",
        duration: "40 min",
        difficulty: "Beginner",
        exercises: 4
      },
      {
        id: "perl-scalars",
        title: "Scalars & Variables",
        content:
          "Perl uses sigils to identify variable types. In this topic you will work with scalars ($), which hold single values like strings and numbers. You will learn about Perl's dynamic typing, string interpolation, and the difference between single and double quotes.\n\nYou will also explore special variables like $_ (the default variable) and understand context sensitivity. By the end you will be comfortable declaring and using scalar variables.",
        duration: "50 min",
        difficulty: "Beginner",
        exercises: 5
      },
      {
        id: "perl-arrays-hashes",
        title: "Arrays & Hashes",
        content:
          "Arrays (@) store ordered lists and hashes (%) store key-value pairs. In this topic you will create, access, and modify arrays and hashes. You will learn about array slices, hash slices, and common operations like push, pop, shift, and unshift.\n\nYou will also explore the keys, values, and each functions for hashes. By the end you will be able to work with Perl's core data structures effectively.",
        duration: "55 min",
        difficulty: "Beginner",
        exercises: 6
      },
      {
        id: "perl-control",
        title: "Control Structures",
        content:
          "Perl offers flexible control structures with multiple syntax options. In this topic you will use if-elsif-else, unless, while, until, for, and foreach loops. You will learn about statement modifiers for concise one-liners and loop control with next, last, and redo.\n\nBy the end you will be able to write clear control flow logic using Perl's various syntactic options.",
        duration: "45 min",
        difficulty: "Beginner",
        exercises: 5
      }
    ],
    duration: "3.2 hours",
    exercises: 20,
    completed: false,
    codeExample: `#!/usr/bin/perl
use strict;
use warnings;

# Scalars
my $name = "Perl Learner";
my $score = 95;
print "Hello, $name! Your score is $score.\\n";

# Arrays
my @languages = ("Perl", "Python", "Ruby");
push @languages, "JavaScript";
print "Languages: @languages\\n";

# Hashes
my %course = (
    title => "Perl Fundamentals",
    duration => "3 hours",
    level => "Beginner"
);

print "Course: $course{title}\\n";

# Control structures
foreach my $lang (@languages) {
    print "Learning $lang...\\n" if length($lang) > 4;
}

# Default variable $_
for (@languages) {
    print "Language: $_\\n";
}`
  },
  {
    id: 2,
    title: "Regular Expressions",
    description: "Master Perl's legendary regex capabilities for text processing.",
    topics: [
      {
        id: "perl-regex-basics",
        title: "Regex Fundamentals",
        content:
          "Perl is famous for its powerful regular expression support, integrated directly into the language. In this topic you will learn regex syntax: character classes, quantifiers, anchors, and grouping. You will use the match operator (m//) and understand the binding operators =~ and !~.\n\nYou will practice matching patterns in strings and extracting matched portions. By the end you will understand the building blocks of regular expressions.",
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 6
      },
      {
        id: "perl-regex-substitution",
        title: "Search & Replace",
        content:
          "The substitution operator (s///) is one of Perl's most powerful features. In this topic you will perform search and replace operations with various modifiers like global (g), case-insensitive (i), and multiline (m). You will use captured groups and backreferences for complex transformations.\n\nBy the end you will be able to transform text data efficiently using Perl's substitution capabilities.",
        duration: "50 min",
        difficulty: "Intermediate",
        exercises: 6
      },
      {
        id: "perl-regex-advanced",
        title: "Advanced Regex Features",
        content:
          "Perl's regex engine includes advanced features not found in many other languages. In this topic you will explore lookahead and lookbehind assertions, non-greedy quantifiers, and named captures. You will learn about the /x modifier for readable regex patterns.\n\nYou will also understand when to use qr// for precompiled patterns. By the end you will be able to write sophisticated patterns for complex text processing tasks.",
        duration: "60 min",
        difficulty: "Advanced",
        exercises: 7
      },
      {
        id: "perl-text-processing",
        title: "Text Processing Patterns",
        content:
          "Perl excels at processing text files and log data. In this topic you will read files line by line, parse structured text, and extract data using regex. You will learn about split and join for breaking apart and reassembling strings.\n\nYou will work through practical examples like parsing log files, extracting data from reports, and transforming file formats. By the end you will be able to tackle real-world text processing challenges.",
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 6
      }
    ],
    duration: "3.7 hours",
    exercises: 25,
    completed: false,
    codeExample: `#!/usr/bin/perl
use strict;
use warnings;

my $text = "The quick brown fox jumps over the lazy dog. Email: user@example.com";

# Basic matching
if ($text =~ /quick/) {
    print "Found 'quick'!\\n";
}

# Capture groups
if ($text =~ /(\\w+)@(\\w+\\.\\w+)/) {
    print "Email found: $1 at $2\\n";
}

# Substitution
my $modified = $text;
$modified =~ s/fox/cat/g;
print "Modified: $modified\\n";

# Split and join
my @words = split /\\s+/, $text;
print "Word count: " . scalar(@words) . "\\n";

# Process each word
my @long_words = grep { length($_) > 4 } @words;
print "Long words: @long_words\\n";

# Extract all words with regex
my @all_words = ($text =~ /(\\w+)/g);
print "All words: @all_words\\n";`
  },
  {
    id: 3,
    title: "Subroutines & References",
    description: "Build modular code with functions and understand Perl's reference system.",
    topics: [
      {
        id: "perl-subs",
        title: "Subroutines",
        content:
          "Subroutines are Perl's functions for organizing reusable code. In this topic you will define subroutines with the sub keyword, pass arguments via @_, and return values. You will learn about lexical scoping with my, and understand the difference between my, local, and our.\n\nBy the end you will be able to write clean, modular Perl code with well-organized subroutines.",
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 6
      },
      {
        id: "perl-references",
        title: "References & Dereferencing",
        content:
          "References allow you to create complex data structures in Perl. In this topic you will create references to scalars, arrays, and hashes using the backslash operator. You will dereference using sigils and arrow notation, and understand anonymous references.\n\nBy the end you will be able to work with references to build nested data structures and pass complex data to subroutines.",
        duration: "60 min",
        difficulty: "Intermediate",
        exercises: 7
      },
      {
        id: "perl-data-structures",
        title: "Complex Data Structures",
        content:
          "With references, you can build arrays of arrays, hashes of hashes, and mixed structures. In this topic you will create and navigate multi-dimensional data structures. You will use Data::Dumper to visualize complex structures and understand autovivification.\n\nBy the end you will be able to model complex data relationships using Perl's flexible reference system.",
        duration: "55 min",
        difficulty: "Advanced",
        exercises: 6
      },
      {
        id: "perl-oop",
        title: "Object-Oriented Perl",
        content:
          "Perl supports object-oriented programming through its reference and package system. In this topic you will create classes as packages, define constructors with bless, and implement methods. You will understand inheritance with @ISA and explore modern OO with Moose or Moo.\n\nBy the end you will be able to design and implement object-oriented Perl programs.",
        duration: "60 min",
        difficulty: "Advanced",
        exercises: 6
      }
    ],
    duration: "3.8 hours",
    exercises: 25,
    completed: false,
    codeExample: `#!/usr/bin/perl
use strict;
use warnings;
use Data::Dumper;

# Subroutine with arguments
sub greet {
    my ($name, $greeting) = @_;
    $greeting //= "Hello";
    return "$greeting, $name!";
}

print greet("Perl Learner"), "\\n";
print greet("World", "Greetings"), "\\n";

# References
my @array = (1, 2, 3);
my $array_ref = \\@array;
print "First element: $array_ref->[0]\\n";

# Complex data structure
my $course = {
    title => "Perl Programming",
    modules => [
        { name => "Basics", lessons => 5 },
        { name => "Regex", lessons => 4 },
        { name => "OOP", lessons => 3 }
    ],
    stats => {
        students => 1500,
        rating => 4.8
    }
};

print "Course: $course->{title}\\n";
print "First module: $course->{modules}[0]{name}\\n";
print Dumper($course);`
  },
  {
    id: 4,
    title: "Modules & CPAN",
    description: "Leverage Perl's vast module ecosystem and create your own modules.",
    topics: [
      {
        id: "perl-modules",
        title: "Using Modules",
        content:
          "Perl's strength lies in its extensive module ecosystem. In this topic you will learn to use modules with use and require, understand @INC and module paths, and work with common core modules like File::Find, Getopt::Long, and JSON.\n\nBy the end you will be able to find, install, and use modules to extend Perl's capabilities.",
        duration: "50 min",
        difficulty: "Intermediate",
        exercises: 5
      },
      {
        id: "perl-cpan",
        title: "CPAN & Module Management",
        content:
          "CPAN (Comprehensive Perl Archive Network) is one of the largest collections of freely available software. In this topic you will search CPAN for modules, install them using cpan or cpanm, and manage dependencies. You will learn about local::lib for per-user installations.\n\nBy the end you will be comfortable leveraging CPAN to solve problems without reinventing the wheel.",
        duration: "45 min",
        difficulty: "Intermediate",
        exercises: 5
      },
      {
        id: "perl-create-modules",
        title: "Creating Modules",
        content:
          "Creating your own modules promotes code reuse and organization. In this topic you will create a module with package declarations, export functions using Exporter, and write proper documentation with POD. You will understand module versioning and testing.\n\nBy the end you will be able to create professional-quality Perl modules for your own use or to share with others.",
        duration: "55 min",
        difficulty: "Advanced",
        exercises: 6
      },
      {
        id: "perl-testing",
        title: "Testing Perl Code",
        content:
          "Testing ensures your code works correctly. In this topic you will write tests using Test::More, understand the TAP protocol, and organize tests in a t/ directory. You will learn about test-driven development and code coverage.\n\nBy the end you will be able to write comprehensive tests for your Perl code and modules.",
        duration: "50 min",
        difficulty: "Intermediate",
        exercises: 5
      }
    ],
    duration: "3.3 hours",
    exercises: 21,
    completed: false,
    codeExample: `#!/usr/bin/perl
use strict;
use warnings;

# Using core modules
use File::Basename;
use Getopt::Long;
use JSON;

# Command line options
my $verbose = 0;
my $output = "result.txt";
GetOptions(
    "verbose" => \\$verbose,
    "output=s" => \\$output
);

# JSON handling
my $data = {
    course => "Perl Modules",
    topics => ["CPAN", "Testing", "Documentation"],
    completed => JSON::false
};

my $json = encode_json($data);
print "JSON: $json\\n";

my $decoded = decode_json($json);
print "Course: $decoded->{course}\\n";

# File operations
my $path = "/home/user/scripts/example.pl";
print "Basename: " . basename($path) . "\\n";
print "Directory: " . dirname($path) . "\\n";

print "Verbose mode enabled\\n" if $verbose;`
  }
];




