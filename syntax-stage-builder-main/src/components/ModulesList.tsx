import { memo, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ModuleCard } from "./ModuleCard";

interface Module {
  id: number;
  title: string;
  description: string;
  topics: Array<{ id: string; title: string }>;
  duration: string;
  exercises: number;
  completed?: boolean;
}

interface ModulesListProps {
  modules: Module[];
  currentModule: number;
  onStartModule: (id: number) => void;
  initialVisible?: number;
}

export const ModulesList = memo(({ 
  modules, 
  currentModule, 
  onStartModule,
  initialVisible = 6
}: ModulesListProps) => {
  const [visibleCount, setVisibleCount] = useState(initialVisible);
  const visibleModules = useMemo(() => modules.slice(0, visibleCount), [modules, visibleCount]);
  const hasMore = modules.length > visibleCount;

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {visibleModules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            isCurrent={currentModule === module.id}
            onStart={onStartModule}
          />
        ))}
      </div>
      {hasMore && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setVisibleCount(prev => Math.min(prev + 6, modules.length))}
          >
            Load More Modules ({modules.length - visibleCount} remaining)
          </Button>
        </div>
      )}
    </div>
  );
});

ModulesList.displayName = 'ModulesList';



