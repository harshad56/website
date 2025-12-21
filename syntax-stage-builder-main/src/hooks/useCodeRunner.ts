import { useCallback, useState } from "react";
import { codeExecutor } from "@/services/CodeExecutor";

interface UseCodeRunnerOptions {
  initialCode?: string;
}

export const useCodeRunner = (language: string, options: UseCodeRunnerOptions = {}) => {
  const [code, setCode] = useState(options.initialCode ?? "");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const runCode = useCallback(async () => {
    if (!code.trim()) {
      setOutput("Please write some code before running.");
      return;
    }

    setIsRunning(true);

    try {
      const result = await codeExecutor.executeCode(language, code);
      const { error, output: executorOutput } = result.result;

      if (error) {
        setOutput(`Error: ${error}`);
        return;
      }

      setOutput(executorOutput?.trim() || "Code executed successfully, but there was no console output.");
    } catch (err) {
      setOutput(`Error: ${err instanceof Error ? err.message : "Execution failed"}`);
    } finally {
      setIsRunning(false);
    }
  }, [code, language]);

  return {
    code,
    setCode,
    output,
    setOutput,
    isRunning,
    runCode
  };
};


