export interface CodeResult {
  output: string;
  error?: string;
  executionTime: number;
  memoryUsage?: number;
  language: string;
  version: string;
}

export interface TestCase {
  input: string;
  expected: string;
  description: string;
  passed: boolean;
}

export interface CodeExecutionResult {
  result: CodeResult;
  testCases: TestCase[];
  allTestsPassed: boolean;
  score: number;
}

interface WorkerMessage {
  id: string;
  type: 'execute' | 'validate' | 'info' | 'result' | 'validation' | 'error' | 'ready';
  data: any;
}

import CodeWorker from '../workers/code-worker.js?worker';

class CodeExecutor {
  private worker: Worker | null = null;
  private messageHandlers: Map<string, (data: any) => void> = new Map();
  private isWorkerReady = false;
  private workerReadyPromise: Promise<void> | null = null;
  private resolveWorkerReady: (() => void) | null = null;

  constructor() {
    this.initializeWorker();
  }

  private initializeWorker() {
    if (typeof Worker === 'undefined') {
      return;
    }

    this.workerReadyPromise = new Promise((resolve) => {
      this.resolveWorkerReady = resolve;
    });

    try {
      this.worker = new CodeWorker();

      this.worker.onmessage = (event) => {
        const message: WorkerMessage = event.data;
        this.handleWorkerMessage(message);
      };

      this.worker.onerror = (error) => {
        console.error('Worker error:', error);
      };
    } catch (error) {
      console.error('Failed to initialize worker:', error);
    }
  }

  private handleWorkerMessage(message: WorkerMessage) {
    if (message.type === 'ready') {
      this.isWorkerReady = true;
      this.resolveWorkerReady?.();
      return;
    }

    const handler = this.messageHandlers.get(message.id);
    if (handler) {
      handler(message.data);
      this.messageHandlers.delete(message.id);
    }
  }

  private sendMessage(type: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error('Worker not available'));
        return;
      }

      const messageId = `msg_${Date.now()}_${Math.random()}`;

      this.messageHandlers.set(messageId, (responseData) => {
        resolve(responseData);
      });

      // Set timeout for message handling
      setTimeout(() => {
        if (this.messageHandlers.has(messageId)) {
          this.messageHandlers.delete(messageId);
          reject(new Error('Worker message timeout'));
        }
      }, 30000); // 30 second timeout

      this.worker.postMessage({
        id: messageId,
        type,
        data
      });
    });
  }

  private async waitForWorkerReady() {
    if (this.isWorkerReady) {
      return;
    }

    if (!this.workerReadyPromise) {
      this.workerReadyPromise = new Promise((resolve) => {
        this.resolveWorkerReady = resolve;
      });
    }

    await this.workerReadyPromise;
  }

  private async executeInWorker(language: string, code: string, input = '') {
    await this.waitForWorkerReady();
    return this.sendMessage('execute', { language, code, input });
  }

  private normalizeOutput(output?: string) {
    return (output || '').replace(/\r\n/g, '\n').trim();
  }

  public warmUp() {
    if (typeof Worker === 'undefined') {
      return;
    }
    if (!this.worker) {
      this.initializeWorker();
    }
    this.waitForWorkerReady().catch((error) => {
      console.error('Code executor warm-up failed:', error);
    });
  }

  async executeCode(language: string, code: string, testCases?: TestCase[]): Promise<CodeExecutionResult> {
    const startTime = performance.now();

    try {
      const result = await this.executeInWorker(language, code, testCases?.[0]?.input || '');

      const codeResult: CodeResult = {
        output: result.output,
        error: result.error,
        executionTime: result.executionTime,
        memoryUsage: result.memoryUsage,
        language: result.language,
        version: result.version
      };

      // Run test cases if provided
      let testResults: TestCase[] = [];
      let allTestsPassed = true;
      let score = 0;

      if (testCases && testCases.length > 0) {
        testResults = await this.runTestCases(language, code, testCases);
        allTestsPassed = testResults.every(test => test.passed);
        score = (testResults.filter(test => test.passed).length / testResults.length) * 100;
      }

      return {
        result: codeResult,
        testCases: testResults,
        allTestsPassed,
        score
      };
    } catch (error) {
      return {
        result: {
          output: '',
          error: error instanceof Error ? error.message : 'Execution failed',
          executionTime: performance.now() - startTime,
          memoryUsage: 0,
          language,
          version: 'unknown'
        },
        testCases: [],
        allTestsPassed: false,
        score: 0
      };
    }
  }

  private async simulateExecution(language: string, code: string): Promise<{ output: string; error?: string }> {
    // Simulate different language behaviors
    switch (language.toLowerCase()) {
      case 'python':
        return this.simulatePythonExecution(code);
      case 'javascript':
        return this.simulateJavaScriptExecution(code);
      case 'java':
        return this.simulateJavaExecution(code);
      case 'cpp':
        return this.simulateCppExecution(code);
      default:
        return { output: 'Language not supported yet' };
    }
  }

  private async simulatePythonExecution(code: string): Promise<{ output: string; error?: string }> {
    // Basic Python syntax validation and execution simulation
    if (code.includes('print(')) {
      const printStatements = code.match(/print\([^)]*\)/g) || [];
      const output = printStatements
        .map(stmt => {
          const content = stmt.match(/print\(([^)]*)\)/)?.[1] || '';
          return content.replace(/['"]/g, '');
        })
        .join('\n');

      return { output };
    }

    if (code.includes('def ')) {
      // Simulate function execution
      return { output: 'Function defined successfully' };
    }

    return { output: 'Code executed successfully' };
  }

  private async simulateJavaScriptExecution(code: string): Promise<{ output: string; error?: string }> {
    // Basic JavaScript execution simulation
    if (code.includes('console.log(')) {
      const logStatements = code.match(/console\.log\([^)]*\)/g) || [];
      const output = logStatements
        .map(stmt => {
          const content = stmt.match(/console\.log\(([^)]*)\)/)?.[1] || '';
          return content.replace(/['"]/g, '');
        })
        .join('\n');

      return { output };
    }

    if (code.includes('function ') || code.includes('=>')) {
      return { output: 'Function defined successfully' };
    }

    return { output: 'Code executed successfully' };
  }

  private async simulateJavaExecution(code: string): Promise<{ output: string; error?: string }> {
    // Basic Java execution simulation
    if (code.includes('System.out.println(')) {
      const printStatements = code.match(/System\.out\.println\([^)]*\)/g) || [];
      const output = printStatements
        .map(stmt => {
          const content = stmt.match(/System\.out\.println\(([^)]*)\)/)?.[1] || '';
          return content.replace(/['"]/g, '');
        })
        .join('\n');

      return { output };
    }

    if (code.includes('public class ')) {
      return { output: 'Class compiled successfully' };
    }

    return { output: 'Code executed successfully' };
  }

  private async simulateCppExecution(code: string): Promise<{ output: string; error?: string }> {
    // Basic C++ execution simulation
    if (code.includes('cout <<')) {
      const outputStatements = code.match(/cout << [^;]*;/g) || [];
      const output = outputStatements
        .map(stmt => {
          const content = stmt.match(/cout << ([^;]*);/)?.[1] || '';
          return content.replace(/['"]/g, '').replace(/endl/g, '\n');
        })
        .join('\n');

      return { output };
    }

    return { output: 'Code executed successfully' };
  }

  private async runTestCases(language: string, code: string, testCases: TestCase[]): Promise<TestCase[]> {
    const results: TestCase[] = [];

    for (const testCase of testCases) {
      try {
        const singleResult = await this.executeInWorker(language, code, testCase.input);
        const actualOutput = this.normalizeOutput(singleResult.output);
        const expectedOutput = this.normalizeOutput(testCase.expected);
        const passed =
          actualOutput.includes(expectedOutput) ||
          actualOutput === expectedOutput;

        results.push({
          ...testCase,
          passed
        });
      } catch (error) {
        results.push({
          ...testCase,
          passed: false
        });
      }
    }

    return results;
  }

  validateSyntax(language: string, code: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    switch (language.toLowerCase()) {
      case 'python':
        return this.validatePythonSyntax(code);
      case 'javascript':
        return this.validateJavaScriptSyntax(code);
      case 'java':
        return this.validateJavaSyntax(code);
      case 'cpp':
        return this.validateCppSyntax(code);
      default:
        return { isValid: true, errors: [] };
    }
  }

  private validatePythonSyntax(code: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Basic Python syntax checks
    if (code.includes('print(') && !code.includes(')')) {
      errors.push('Missing closing parenthesis in print statement');
    }

    if (code.includes('def ') && !code.includes(':')) {
      errors.push('Function definition missing colon');
    }

    if (code.includes('if ') && !code.includes(':')) {
      errors.push('If statement missing colon');
    }

    return { isValid: errors.length === 0, errors };
  }

  private validateJavaScriptSyntax(code: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Basic JavaScript syntax checks
    if (code.includes('console.log(') && !code.includes(')')) {
      errors.push('Missing closing parenthesis in console.log');
    }

    if (code.includes('function ') && !code.includes('{')) {
      errors.push('Function missing opening brace');
    }

    return { isValid: errors.length === 0, errors };
  }

  private validateJavaSyntax(code: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Basic Java syntax checks
    if (code.includes('System.out.println(') && !code.includes(')')) {
      errors.push('Missing closing parenthesis in System.out.println');
    }

    if (code.includes('public class ') && !code.includes('{')) {
      errors.push('Class missing opening brace');
    }

    return { isValid: errors.length === 0, errors };
  }

  private validateCppSyntax(code: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Basic C++ syntax checks
    if (code.includes('#include') && !code.includes('<') && !code.includes('"')) {
      errors.push('Invalid include statement');
    }

    if (code.includes('cout <<') && !code.includes(';')) {
      errors.push('Missing semicolon in cout statement');
    }

    return { isValid: errors.length === 0, errors };
  }

  async getLanguageSupport(): Promise<string[]> {
    try {
      const result = await this.sendMessage('validate', { language: 'all' });
      return result.supportedLanguages || [];
    } catch (error) {
      // Fallback to basic support
      return ['python', 'javascript', 'java', 'cpp', 'csharp', 'go', 'rust'];
    }
  }

  async getLanguageInfo(language: string) {
    try {
      const result = await this.sendMessage('info', { language });
      return result.languageInfo;
    } catch (error) {
      // Fallback language info
      const fallbackInfo = {
        python: {
          name: 'Python',
          version: '3.11',
          features: ['Object-oriented', 'Dynamic typing', 'Extensive libraries'],
          extensions: ['.py']
        },
        javascript: {
          name: 'JavaScript',
          version: 'ES2022',
          features: ['Dynamic typing', 'Prototype-based', 'Event-driven'],
          extensions: ['.js', '.mjs']
        },
        java: {
          name: 'Java',
          version: '17',
          features: ['Object-oriented', 'Platform independent', 'Strong typing'],
          extensions: ['.java']
        },
        cpp: {
          name: 'C++',
          version: 'C++20',
          features: ['Object-oriented', 'Low-level', 'High performance'],
          extensions: ['.cpp', '.cc', '.cxx']
        }
      };

      return fallbackInfo[language as keyof typeof fallbackInfo] || null;
    }
  }
}

export const codeExecutor = new CodeExecutor(); 