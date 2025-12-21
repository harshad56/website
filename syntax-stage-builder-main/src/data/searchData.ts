export interface SearchItem {
  id: string;
  title: string;
  path: string;
  category: 'language' | 'page' | 'feature' | 'keyword';
  keywords: string[];
  description?: string;
}

export const searchItems: SearchItem[] = [
  // Programming Languages
  {
    id: 'python',
    title: 'Python Programming',
    path: '/python-learning',
    category: 'language',
    keywords: ['python', 'py', 'programming', 'coding', 'learn python', 'python course'],
    description: 'Learn Python programming with interactive lessons'
  },
  {
    id: 'javascript',
    title: 'JavaScript Programming',
    path: '/javascript-learning',
    category: 'language',
    keywords: ['javascript', 'js', 'ecmascript', 'web development', 'frontend', 'nodejs'],
    description: 'Master JavaScript and modern web development'
  },
  {
    id: 'java',
    title: 'Java Programming',
    path: '/java-learning',
    category: 'language',
    keywords: ['java', 'oop', 'object oriented', 'enterprise', 'spring'],
    description: 'Learn Java programming and enterprise development'
  },
  {
    id: 'cpp',
    title: 'C++ Programming',
    path: '/cpp-learning',
    category: 'language',
    keywords: ['c++', 'cpp', 'cplusplus', 'systems programming', 'performance'],
    description: 'Master C++ for systems and performance programming'
  },
  {
    id: 'csharp',
    title: 'C# Programming',
    path: '/csharp-learning',
    category: 'language',
    keywords: ['c#', 'csharp', 'dotnet', '.net', 'microsoft'],
    description: 'Learn C# and .NET development'
  },
  {
    id: 'go',
    title: 'Go Programming',
    path: '/go-learning',
    category: 'language',
    keywords: ['go', 'golang', 'concurrent', 'backend', 'microservices'],
    description: 'Learn Go for modern backend development'
  },
  {
    id: 'rust',
    title: 'Rust Programming',
    path: '/rust-learning',
    category: 'language',
    keywords: ['rust', 'systems', 'memory safety', 'performance', 'webassembly'],
    description: 'Master Rust for safe systems programming'
  },
  {
    id: 'typescript',
    title: 'TypeScript Programming',
    path: '/typescript-learning',
    category: 'language',
    keywords: ['typescript', 'ts', 'typed javascript', 'angular', 'react'],
    description: 'Learn TypeScript for type-safe JavaScript'
  },
  {
    id: 'swift',
    title: 'Swift Programming',
    path: '/swift-learning',
    category: 'language',
    keywords: ['swift', 'ios', 'apple', 'mobile', 'macos'],
    description: 'Learn Swift for iOS and macOS development'
  },
  {
    id: 'kotlin',
    title: 'Kotlin Programming',
    path: '/kotlin-learning',
    category: 'language',
    keywords: ['kotlin', 'android', 'jvm', 'coroutines'],
    description: 'Master Kotlin for Android development'
  },
  {
    id: 'php',
    title: 'PHP Programming',
    path: '/php-learning',
    category: 'language',
    keywords: ['php', 'web', 'server', 'laravel', 'wordpress'],
    description: 'Learn PHP for web development'
  },
  {
    id: 'ruby',
    title: 'Ruby Programming',
    path: '/ruby-learning',
    category: 'language',
    keywords: ['ruby', 'rails', 'web', 'backend', 'ruby on rails'],
    description: 'Learn Ruby and Ruby on Rails'
  },
  {
    id: 'c',
    title: 'C Programming',
    path: '/c-learning',
    category: 'language',
    keywords: ['c', 'systems', 'low level', 'embedded'],
    description: 'Master C programming fundamentals'
  },
  {
    id: 'scala',
    title: 'Scala Programming',
    path: '/scala-learning',
    category: 'language',
    keywords: ['scala', 'functional', 'jvm', 'spark', 'big data'],
    description: 'Learn Scala for functional programming'
  },
  {
    id: 'dart',
    title: 'Dart Programming',
    path: '/dart-learning',
    category: 'language',
    keywords: ['dart', 'flutter', 'mobile', 'cross platform'],
    description: 'Learn Dart for Flutter development'
  },
  {
    id: 'r',
    title: 'R Programming',
    path: '/r-learning',
    category: 'language',
    keywords: ['r', 'statistics', 'data science', 'analytics', 'rstudio'],
    description: 'Learn R for data science and statistics'
  },
  {
    id: 'perl',
    title: 'Perl Programming',
    path: '/perl-learning',
    category: 'language',
    keywords: ['perl', 'scripting', 'text processing', 'regex'],
    description: 'Learn Perl for scripting and text processing'
  },
  {
    id: 'haskell',
    title: 'Haskell Programming',
    path: '/haskell-learning',
    category: 'language',
    keywords: ['haskell', 'functional', 'pure', 'lazy evaluation'],
    description: 'Master functional programming with Haskell'
  },
  {
    id: 'assembly',
    title: 'Assembly Programming',
    path: '/assembly-learning',
    category: 'language',
    keywords: ['assembly', 'asm', 'low level', 'machine code'],
    description: 'Learn assembly language programming'
  },
  {
    id: 'matlab',
    title: 'MATLAB Programming',
    path: '/matlab-learning',
    category: 'language',
    keywords: ['matlab', 'mathematical', 'engineering', 'simulink'],
    description: 'Learn MATLAB for engineering and mathematics'
  },
  
  // Pages and Features
  {
    id: 'learning-paths',
    title: 'Learning Paths',
    path: '/learning-paths',
    category: 'page',
    keywords: ['learning paths', 'roadmap', 'career', 'curriculum', 'guide'],
    description: 'Structured learning paths for your career'
  },
  {
    id: 'challenges',
    title: 'Coding Challenges',
    path: '/challenges',
    category: 'page',
    keywords: ['challenges', 'practice', 'problems', 'exercises', 'coding'],
    description: 'Practice coding with interactive challenges'
  },
  {
    id: 'algorithm-challenges',
    title: 'Algorithm Challenges',
    path: '/algorithm-challenges',
    category: 'page',
    keywords: ['algorithms', 'data structures', 'leetcode', 'competitive programming'],
    description: 'Sharpen your algorithm skills'
  },
  {
    id: 'code-playground',
    title: 'Code Playground',
    path: '/code-playground',
    category: 'page',
    keywords: ['playground', 'sandbox', 'editor', 'ide', 'code editor'],
    description: 'Write and test code in your browser'
  },
  {
    id: 'interactive-tutorials',
    title: 'Interactive Tutorials',
    path: '/interactive-tutorials',
    category: 'page',
    keywords: ['tutorials', 'guided', 'step by step', 'learn', 'interactive'],
    description: 'Follow guided interactive tutorials'
  },
  {
    id: 'project-library',
    title: 'Project Library',
    path: '/project-library',
    category: 'page',
    keywords: ['projects', 'portfolio', 'build', 'practice', 'real world'],
    description: 'Build real-world projects'
  },
  {
    id: 'real-projects',
    title: 'Real Projects',
    path: '/real-projects',
    category: 'page',
    keywords: ['projects', 'portfolio', 'applications', 'build'],
    description: 'Work on real-world projects'
  },
  {
    id: 'code-reviews',
    title: 'Code Reviews',
    path: '/code-reviews',
    category: 'page',
    keywords: ['code review', 'feedback', 'mentor', 'improve', 'learn'],
    description: 'Get expert code reviews and feedback'
  },
  {
    id: 'ai-tutor',
    title: 'AI Tutor',
    path: '/ai-tutor',
    category: 'page',
    keywords: ['ai', 'tutor', 'assistant', 'help', 'learn', 'chat'],
    description: 'Get help from AI-powered tutor'
  },
  {
    id: 'study-groups',
    title: 'Study Groups',
    path: '/study-groups',
    category: 'page',
    keywords: ['study groups', 'community', 'collaborate', 'learn together'],
    description: 'Join study groups and learn together'
  },
  {
    id: 'mentorship',
    title: 'Mentorship Program',
    path: '/mentorship',
    category: 'page',
    keywords: ['mentor', 'mentorship', 'guidance', 'career', 'advice'],
    description: 'Get mentorship from industry experts'
  },
  {
    id: 'jobs',
    title: 'Job Board',
    path: '/jobs',
    category: 'page',
    keywords: ['jobs', 'career', 'hiring', 'employment', 'opportunities'],
    description: 'Find programming jobs and opportunities'
  },
  {
    id: 'resume-builder',
    title: 'Resume Builder',
    path: '/resume-builder',
    category: 'page',
    keywords: ['resume', 'cv', 'builder', 'career', 'job application'],
    description: 'Build professional tech resumes'
  },
  {
    id: 'interview-practice',
    title: 'Interview Practice',
    path: '/interview-practice',
    category: 'page',
    keywords: ['interview', 'practice', 'preparation', 'mock', 'technical'],
    description: 'Practice for technical interviews'
  },
  {
    id: 'salary-guide',
    title: 'Salary Guide',
    path: '/salary-guide',
    category: 'page',
    keywords: ['salary', 'compensation', 'pay', 'income', 'earnings'],
    description: 'Compare programming salaries'
  },
  {
    id: 'careers',
    title: 'Careers',
    path: '/careers',
    category: 'page',
    keywords: ['careers', 'jobs', 'hiring', 'work', 'employment'],
    description: 'Explore career opportunities'
  },
  {
    id: 'blog',
    title: 'Developer Blog',
    path: '/blog',
    category: 'page',
    keywords: ['blog', 'articles', 'tutorials', 'resources', 'learn'],
    description: 'Read programming articles and tutorials'
  },
  {
    id: 'courses',
    title: 'Course Catalog',
    path: '/courses',
    category: 'page',
    keywords: ['courses', 'catalog', 'browse', 'learn', 'education'],
    description: 'Browse all available courses'
  },
  {
    id: 'pricing',
    title: 'Pricing',
    path: '/pricing',
    category: 'page',
    keywords: ['pricing', 'plans', 'subscription', 'cost', 'price'],
    description: 'View pricing plans'
  },
  {
    id: 'about',
    title: 'About Us',
    path: '/about',
    category: 'page',
    keywords: ['about', 'company', 'team', 'mission', 'story'],
    description: 'Learn about CodeAcademy Pro'
  },
  {
    id: 'contact',
    title: 'Contact',
    path: '/contact',
    category: 'page',
    keywords: ['contact', 'support', 'help', 'email', 'reach'],
    description: 'Get in touch with us'
  },
  
  // Keywords
  {
    id: 'web-development',
    title: 'Web Development',
    path: '/learning-paths',
    category: 'keyword',
    keywords: ['web', 'frontend', 'backend', 'full stack', 'html', 'css'],
    description: 'Learn web development'
  },
  {
    id: 'data-science',
    title: 'Data Science',
    path: '/learning-paths',
    category: 'keyword',
    keywords: ['data science', 'machine learning', 'ai', 'analytics', 'python'],
    description: 'Learn data science and analytics'
  },
  {
    id: 'mobile-development',
    title: 'Mobile Development',
    path: '/learning-paths',
    category: 'keyword',
    keywords: ['mobile', 'ios', 'android', 'react native', 'flutter'],
    description: 'Learn mobile app development'
  },
];

export const searchItemsByCategory = {
  language: searchItems.filter(item => item.category === 'language'),
  page: searchItems.filter(item => item.category === 'page'),
  feature: searchItems.filter(item => item.category === 'feature'),
  keyword: searchItems.filter(item => item.category === 'keyword'),
};



