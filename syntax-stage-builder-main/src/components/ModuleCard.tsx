import { memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

interface Module {
  id: number;
  title: string;
  description: string;
  topics: Array<{ id: string; title: string }>;
  duration: string;
  exercises: number;
  completed?: boolean;
}

interface ModuleCardProps {
  module: Module;
  isCurrent: boolean;
  onStart: (id: number) => void;
}

export const ModuleCard = memo(({ module, isCurrent, onStart }: ModuleCardProps) => {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              {module.completed && <CheckCircle className="w-5 h-5 text-green-500 mr-2" />}
              Module {module.id}: {module.title}
            </CardTitle>
            <CardDescription>{module.description}</CardDescription>
          </div>
          <Button 
            onClick={() => onStart(module.id)}
            variant={isCurrent ? "default" : "outline"}
          >
            {isCurrent ? "Current" : "Start"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{module.topics.length}</div>
            <div className="text-xs text-muted-foreground">Topics</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{module.duration}</div>
            <div className="text-xs text-muted-foreground">Duration</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{module.exercises}</div>
            <div className="text-xs text-muted-foreground">Exercises</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">Beginner</div>
            <div className="text-xs text-muted-foreground">Level</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Topics:</h4>
          <div className="flex flex-wrap gap-2">
            {module.topics.slice(0, 5).map((topic, index) => (
              <Badge key={topic.id || index} variant="secondary" className="text-xs">
                {topic.title}
              </Badge>
            ))}
            {module.topics.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{module.topics.length - 5} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ModuleCard.displayName = 'ModuleCard';



