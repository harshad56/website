/**
 * Utility to lazy load course data - prevents blocking initial render
 * Course data files can be large, so we load them asynchronously
 */

export const lazyLoadCourseData = async (courseName: string) => {
  try {
    switch (courseName.toLowerCase()) {
      case 'python':
        const python = await import('@/data/pythonCourse');
        return python.pythonModules;
      case 'javascript':
        const js = await import('@/data/javascriptCourse');
        return js.javascriptModules;
      case 'java':
        const java = await import('@/data/javaCourse');
        return java.javaModules;
      case 'cpp':
      case 'c++':
        const cpp = await import('@/data/cppCourse');
        return cpp.cppModules;
      case 'csharp':
      case 'c#':
        const csharp = await import('@/data/csharpCourse');
        return csharp.csharpModules;
      case 'go':
        const go = await import('@/data/goCourse');
        return go.goModules;
      case 'rust':
        const rust = await import('@/data/rustCourse');
        return rust.rustModules;
      case 'typescript':
        const ts = await import('@/data/typescriptCourse');
        return ts.typescriptModules;
      case 'swift':
        const swift = await import('@/data/swiftCourse');
        return swift.swiftModules;
      case 'kotlin':
        const kotlin = await import('@/data/kotlinCourse');
        return kotlin.kotlinModules;
      case 'php':
        const php = await import('@/data/phpCourse');
        return php.phpModules;
      case 'ruby':
        const ruby = await import('@/data/rubyCourse');
        return ruby.rubyModules;
      case 'c':
        const c = await import('@/data/cCourse');
        return c.cModules;
      case 'scala':
        const scala = await import('@/data/scalaCourse');
        return scala.scalaModules;
      case 'dart':
        const dart = await import('@/data/dartCourse');
        return dart.dartModules;
      case 'r':
        const r = await import('@/data/rCourse');
        return r.rModules;
      case 'perl':
        const perl = await import('@/data/perlCourse');
        return perl.perlModules;
      case 'haskell':
        const haskell = await import('@/data/haskellCourse');
        return haskell.haskellModules;
      case 'assembly':
        const assembly = await import('@/data/assemblyCourse');
        return assembly.assemblyModules;
      case 'matlab':
        const matlab = await import('@/data/matlabCourse');
        return matlab.matlabModules;
      default:
        throw new Error(`Unknown course: ${courseName}`);
    }
  } catch (error) {
    console.error(`Failed to load course data for ${courseName}:`, error);
    return [];
  }
};


