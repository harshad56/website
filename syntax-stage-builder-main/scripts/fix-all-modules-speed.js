/**
 * Script to fix slow loading in all language learning modules
 * Makes course data lazy-loaded instead of blocking imports
 */

const fs = require('fs');
const path = require('path');

const modules = [
  'JavaScriptLearning',
  'JavaLearning',
  'CPPLearning',
  'CSharpLearning',
  'GoLearning',
  'RustLearning',
  'TypeScriptLearning',
  'SwiftLearning',
  'KotlinLearning',
  'PHPLearning',
  'RubyLearning',
  'CLearning',
  'ScalaLearning',
  'DartLearning',
  'RLearning',
  'PerlLearning',
  'HaskellLearning',
  'AssemblyLearning',
  'MatlabLearning',
];

const courseDataMap = {
  'JavaScriptLearning': { import: 'javascriptModules', file: 'javascriptCourse' },
  'JavaLearning': { import: 'javaModules', file: 'javaCourse' },
  'CPPLearning': { import: 'cppModules', file: 'cppCourse' },
  'CSharpLearning': { import: 'csharpModules', file: 'csharpCourse' },
  'GoLearning': { import: 'goModules', file: 'goCourse' },
  'RustLearning': { import: 'rustModules', file: 'rustCourse' },
  'TypeScriptLearning': { import: 'typescriptModules', file: 'typescriptCourse' },
  'SwiftLearning': { import: 'swiftModules', file: 'swiftCourse' },
  'KotlinLearning': { import: 'kotlinModules', file: 'kotlinCourse' },
  'PHPLearning': { import: 'phpModules', file: 'phpCourse' },
  'RubyLearning': { import: 'rubyModules', file: 'rubyCourse' },
  'CLearning': { import: 'cModules', file: 'cCourse' },
  'ScalaLearning': { import: 'scalaModules', file: 'scalaCourse' },
  'DartLearning': { import: 'dartModules', file: 'dartCourse' },
  'RLearning': { import: 'rModules', file: 'rCourse' },
  'PerlLearning': { import: 'perlModules', file: 'perlCourse' },
  'HaskellLearning': { import: 'haskellModules', file: 'haskellCourse' },
  'AssemblyLearning': { import: 'assemblyModules', file: 'assemblyCourse' },
  'MatlabLearning': { import: 'matlabModules', file: 'matlabCourse' },
};

modules.forEach(moduleName => {
  const filePath = path.join(__dirname, `../src/pages/${moduleName}.tsx`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${moduleName} - file not found`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const courseData = courseDataMap[moduleName];
  
  if (!courseData) {
    console.log(`Skipping ${moduleName} - no course data mapping`);
    return;
  }

  // Remove blocking import
  const importPattern = new RegExp(`import\\s+\\{[^}]*${courseData.import}[^}]*\\}\\s+from\\s+['"]@/data/${courseData.file}['"];?\\s*\\n`, 'g');
  content = content.replace(importPattern, '');

  // Add lazy loading state
  if (!content.includes('const [isLoadingModules, setIsLoadingModules]')) {
    const useStateImport = content.match(/import.*useState.*from/);
    if (useStateImport) {
      // Add state after useState imports
      const afterImports = content.indexOf('const ' + moduleName.replace('Learning', '') + ' =');
      if (afterImports > 0) {
        const beforeState = content.substring(0, afterImports);
        const afterState = content.substring(afterImports);
        
        const lazyLoadCode = `
  // Lazy load course data - don't block initial render
  const [${courseData.import.toLowerCase()}, set${courseData.import}] = useState<any[]>([]);
  const [isLoadingModules, setIsLoadingModules] = useState(true);

  useEffect(() => {
    // Load course data asynchronously
    const loadModules = async () => {
      try {
        const idleCallback = (window as any).requestIdleCallback || ((cb: () => void) => {
          setTimeout(cb, 0);
        });
        
        idleCallback(async () => {
          const { ${courseData.import}: modules } = await import('@/data/${courseData.file}');
          set${courseData.import}(modules);
          setIsLoadingModules(false);
        });
      } catch (error) {
        console.error('Failed to load course data:', error);
        setIsLoadingModules(false);
      }
    };
    
    loadModules();
  }, []);

`;
        content = beforeState + lazyLoadCode + afterState;
      }
    }
  }

  // Update modules usage
  const modulesUsagePattern = new RegExp(`const\\s+modules\\s*=\\s*${courseData.import}`, 'g');
  content = content.replace(modulesUsagePattern, `const modules = ${courseData.import.toLowerCase()}`);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Fixed ${moduleName}`);
});

console.log('All modules updated!');


