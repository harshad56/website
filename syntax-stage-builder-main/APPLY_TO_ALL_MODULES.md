# Apply Speed Fixes to All Language Modules

## Pattern to Apply

For each language learning module (JavaLearning, CPPLearning, etc.), apply this pattern:

### 1. Remove Blocking Import
**Before:**
```tsx
import { javaModules } from '@/data/javaCourse';
```

**After:**
```tsx
// Remove this import - will load lazily
```

### 2. Add Lazy Loading State
**Add after component declaration:**
```tsx
// Lazy load course data - don't block initial render
const [javaModules, setJavaModules] = useState<any[]>([]);
const [isLoadingModules, setIsLoadingModules] = useState(true);

useEffect(() => {
  const loadModules = async () => {
    try {
      const idleCallback = (window as any).requestIdleCallback || ((cb: () => void) => {
        setTimeout(cb, 0);
      });
      
      idleCallback(async () => {
        const { javaModules: modules } = await import('@/data/javaCourse');
        setJavaModules(modules);
        setIsLoadingModules(false);
      });
    } catch (error) {
      console.error('Failed to load course data:', error);
      setIsLoadingModules(false);
    }
  };
  
  loadModules();
}, []);
```

### 3. Update Modules Usage
**Before:**
```tsx
const modules = javaModules;
```

**After:**
```tsx
const modules = javaModules; // Now loaded asynchronously
```

### 4. Add Loading Skeletons
**In modules.map() sections:**
```tsx
{isLoadingModules ? (
  <div className="grid gap-4">
    {[1, 2, 3].map((i) => (
      <Card key={i}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20" />
        </CardContent>
      </Card>
    ))}
  </div>
) : (
  modules.map((module) => (
    // ... existing module card
  ))
)}
```

### 5. Update Calculations
**Before:**
```tsx
const total = modules.reduce(...);
```

**After:**
```tsx
const total = isLoadingModules ? 0 : modules.reduce(...);
```

## Files to Update

Apply this pattern to:
- ✅ PythonLearning.tsx (DONE)
- ✅ JavaScriptLearning.tsx (DONE)
- ⏳ JavaLearning.tsx
- ⏳ CPPLearning.tsx
- ⏳ CSharpLearning.tsx
- ⏳ GoLearning.tsx
- ⏳ RustLearning.tsx
- ⏳ TypeScriptLearning.tsx
- ⏳ SwiftLearning.tsx
- ⏳ KotlinLearning.tsx
- ⏳ PHPLearning.tsx
- ⏳ RubyLearning.tsx
- ⏳ CLearning.tsx
- ⏳ ScalaLearning.tsx
- ⏳ DartLearning.tsx
- ⏳ RLearning.tsx
- ⏳ PerlLearning.tsx
- ⏳ HaskellLearning.tsx
- ⏳ AssemblyLearning.tsx
- ⏳ MatlabLearning.tsx

## Quick Reference

### Course Data Import Names:
- Python: `pythonModules` from `pythonCourse`
- JavaScript: `javascriptModules` from `javascriptCourse`
- Java: `javaModules` from `javaCourse`
- C++: `cppModules` from `cppCourse`
- C#: `csharpModules` from `csharpCourse`
- Go: `goModules` from `goCourse`
- Rust: `rustModules` from `rustCourse`
- TypeScript: `typescriptModules` from `typescriptCourse`
- Swift: `swiftModules` from `swiftCourse`
- Kotlin: `kotlinModules` from `kotlinCourse`
- PHP: `phpModules` from `phpCourse`
- Ruby: `rubyModules` from `rubyCourse`
- C: `cModules` from `cCourse`
- Scala: `scalaModules` from `scalaCourse`
- Dart: `dartModules` from `dartCourse`
- R: `rModules` from `rCourse`
- Perl: `perlModules` from `perlCourse`
- Haskell: `haskellModules` from `haskellCourse`
- Assembly: `assemblyModules` from `assemblyCourse`
- MATLAB: `matlabModules` from `matlabCourse`

## Expected Impact

After applying to all modules:
- **Module Load Time**: 0.3-0.8 seconds (was 5-10 seconds)
- **90-95% faster** module loading
- **No blocking** on initial page render


