-- Create programming_languages table
CREATE TABLE IF NOT EXISTS programming_languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon_emoji VARCHAR(10),
  color_from VARCHAR(50),
  color_to VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create language_interview_questions table
CREATE TABLE IF NOT EXISTS language_interview_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language_id UUID NOT NULL REFERENCES programming_languages(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  code_example TEXT,
  difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
  category VARCHAR(100),
  tags TEXT[],
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_languages_slug ON programming_languages(slug);
CREATE INDEX IF NOT EXISTS idx_languages_active ON programming_languages(is_active);
CREATE INDEX IF NOT EXISTS idx_questions_language_id ON language_interview_questions(language_id);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON language_interview_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_active ON language_interview_questions(is_active);

-- Insert initial programming languages
INSERT INTO programming_languages (name, slug, description, icon_emoji, color_from, color_to, display_order) VALUES
('Python', 'python', 'High-level programming language known for its simplicity and versatility', '🐍', 'from-blue-500', 'to-yellow-500', 1),
('JavaScript', 'javascript', 'The programming language of the web', '⚡', 'from-yellow-400', 'to-yellow-600', 2),
('Java', 'java', 'Object-oriented programming language used for enterprise applications', '☕', 'from-red-500', 'to-orange-500', 3),
('C++', 'cpp', 'Powerful systems programming language', '⚙️', 'from-blue-600', 'to-purple-600', 4),
('C#', 'csharp', 'Modern object-oriented language from Microsoft', '#️⃣', 'from-purple-500', 'to-purple-700', 5),
('TypeScript', 'typescript', 'Typed superset of JavaScript', '📘', 'from-blue-500', 'to-blue-700', 6),
('Go', 'go', 'Fast and efficient language from Google', '🔷', 'from-cyan-400', 'to-blue-500', 7),
('Rust', 'rust', 'Systems programming language focused on safety', '🦀', 'from-orange-500', 'to-red-600', 8),
('Swift', 'swift', 'Apple''s modern programming language for iOS', '🍎', 'from-orange-400', 'to-red-500', 9),
('Kotlin', 'kotlin', 'Modern language for Android development', '🎯', 'from-purple-500', 'to-pink-500', 10),
('Ruby', 'ruby', 'Dynamic, elegant programming language', '💎', 'from-red-500', 'to-pink-500', 11),
('PHP', 'php', 'Server-side scripting language', '🐘', 'from-indigo-500', 'to-purple-600', 12),
('C', 'c', 'Foundational systems programming language', '©️', 'from-blue-500', 'to-blue-700', 13),
('Scala', 'scala', 'Functional and object-oriented language', '🔺', 'from-red-600', 'to-red-800', 14),
('Dart', 'dart', 'Language for building Flutter apps', '🎯', 'from-blue-400', 'to-cyan-500', 15),
('R', 'r', 'Statistical computing language', '📊', 'from-blue-600', 'to-blue-800', 16),
('Perl', 'perl', 'Powerful text processing language', '🐪', 'from-blue-500', 'to-indigo-600', 17),
('Haskell', 'haskell', 'Pure functional programming language', 'λ', 'from-purple-600', 'to-purple-800', 18),
('MATLAB', 'matlab', 'Numerical computing environment', '📐', 'from-orange-500', 'to-orange-700', 19),
('Assembly', 'assembly', 'Low-level programming language', '⚡', 'from-gray-600', 'to-gray-800', 20)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample interview questions for Python
INSERT INTO language_interview_questions (language_id, question, answer, difficulty, category) VALUES
(
  (SELECT id FROM programming_languages WHERE slug = 'python'),
  'What is the difference between a list and a tuple in Python?',
  'Lists are mutable (can be changed after creation) while tuples are immutable (cannot be changed). Lists use square brackets [] while tuples use parentheses (). Lists are generally used for homogeneous data while tuples are used for heterogeneous data. Tuples are faster than lists and can be used as dictionary keys.',
  'easy',
  'Data Structures'
),
(
  (SELECT id FROM programming_languages WHERE slug = 'python'),
  'Explain Python decorators and provide an example.',
  'Decorators are a way to modify or enhance functions without changing their source code. They are callable objects that take a function as input and return a new function. Example:\n\n```python\ndef my_decorator(func):\n    def wrapper():\n        print("Before function")\n        func()\n        print("After function")\n    return wrapper\n\n@my_decorator\ndef say_hello():\n    print("Hello!")\n```',
  'medium',
  'Advanced Concepts'
),
(
  (SELECT id FROM programming_languages WHERE slug = 'python'),
  'What is the Global Interpreter Lock (GIL) in Python?',
  'The GIL is a mutex that protects access to Python objects, preventing multiple threads from executing Python bytecode simultaneously. This means that even on multi-core systems, only one thread can execute Python code at a time. The GIL exists because Python''s memory management is not thread-safe. To achieve true parallelism, you can use multiprocessing instead of multithreading.',
  'hard',
  'Concurrency'
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_programming_languages_updated_at BEFORE UPDATE ON programming_languages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_language_interview_questions_updated_at BEFORE UPDATE ON language_interview_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
