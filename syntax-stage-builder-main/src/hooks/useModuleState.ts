import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to persist module state in sessionStorage for fast back navigation
 * @param storageKey Unique key for this module's state
 * @param defaultModule Default module ID
 * @param moduleParam Module ID from URL params (optional)
 * @returns [currentModule, setCurrentModule, activeTab, setActiveTab]
 */
export const useModuleState = (
  storageKey: string,
  defaultModule: number,
  moduleParam: string | null
) => {
  const getInitialState = useCallback(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only restore if module param matches or no module param
        if (!moduleParam || parsed.currentModule === Number(moduleParam)) {
          return parsed;
        }
      }
    } catch (e) {
      // Ignore errors (e.g., private browsing mode)
    }
    return {
      currentModule: moduleParam ? Number(moduleParam) : defaultModule,
      activeTab: moduleParam ? "current" : "overview"
    };
  }, [storageKey, moduleParam, defaultModule]);

  const initialState = getInitialState();
  const [currentModule, setCurrentModule] = useState(initialState.currentModule);
  const [activeTab, setActiveTab] = useState(initialState.activeTab);

  // Save state to sessionStorage when it changes
  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({
        currentModule,
        activeTab
      }));
    } catch (e) {
      // Ignore errors
    }
  }, [storageKey, currentModule, activeTab]);

  // Update when moduleParam changes
  useEffect(() => {
    if (moduleParam) {
      const moduleNum = Number(moduleParam);
      setCurrentModule(moduleNum);
      setActiveTab("current");
    }
  }, [moduleParam]);

  return [currentModule, setCurrentModule, activeTab, setActiveTab] as const;
};


