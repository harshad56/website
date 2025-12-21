import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { rModules, type RModule, type RTopic } from "@/data/rCourse";

const buildExercises = (title: string, count: number) => {
  const templates = [`Summarize the key ideas of "${title}".`, `Write R code demonstrating "${title}".`, `Create interview questions about "${title}".`, `Apply "${title}" to a real dataset.`, `Find best practices for "${title}" in R documentation.`];
  return Array.from({ length: Math.max(count, 3) }, (_, i) => templates[i % templates.length]);
};

const RTopicPage = () => {
  const { moduleId, topicId } = useParams();
  const navigate = useNavigate();
  const moduleNumber = moduleId ? Number(moduleId) : NaN;

  const currentModule = useMemo<RModule | null>(() => {
    if (Number.isFinite(moduleNumber)) return rModules.find((m) => m.id === moduleNumber) ?? null;
    if (topicId) return rModules.find((m) => m.topics.some((t) => t.id === topicId)) ?? null;
    return null;
  }, [moduleNumber, topicId]);

  const currentTopic = useMemo<RTopic | null>(() => currentModule?.topics.find((t) => t.id === topicId) ?? null, [currentModule, topicId]);

  const [userCode, setUserCode] = useState(currentModule?.codeExample ?? "");
  const [output, setOutput] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => { setUserCode(currentModule?.codeExample ?? ""); setOutput(""); setProgress(0); }, [currentModule, currentTopic]);

  const topics = currentModule?.topics ?? [];
  const currentIndex = currentTopic ? topics.findIndex((t) => t.id === currentTopic.id) : -1;
  const previousTopic = currentIndex > 0 ? topics[currentIndex - 1] : null;
  const nextTopic = currentIndex >= 0 && currentIndex < topics.length - 1 ? topics[currentIndex + 1] : null;
  const exercises = currentTopic ? buildExercises(currentTopic.title, currentTopic.exercises) : [];

  if (!currentModule || !currentTopic) {
    return (<div className="min-h-screen bg-background flex items-center justify-center"><div className="text-center space-y-4"><h1 className="text-2xl font-bold">Topic Not Found</h1><Link to="/r-learning"><Button>Back to R Course</Button></Link></div></div>);
  }

  const difficultyVariant = currentTopic.difficulty === "Beginner" ? "default" : currentTopic.difficulty === "Intermediate" ? "secondary" : "destructive";

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Link to={`/r-learning?module=${currentModule.id}`} replace><Button variant="outline" size="sm">← Back to Module</Button></Link>
              <div className="h-6 w-px bg-border" />
              <div><p className="text-sm text-muted-foreground uppercase">Module {currentModule.id}</p><h1 className="text-2xl font-bold">{currentModule.title}</h1></div>
            </div>
            <div className="flex items-center gap-3"><Badge variant={difficultyVariant}>{currentTopic.difficulty}</Badge><Badge variant="outline">{currentTopic.duration}</Badge></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card><CardHeader><CardTitle className="text-2xl">{currentTopic.title}</CardTitle><CardDescription>Duration: {currentTopic.duration} • Difficulty: {currentTopic.difficulty}</CardDescription></CardHeader><CardContent><div className="whitespace-pre-line leading-relaxed">{currentTopic.content}</div></CardContent></Card>
            <Card><CardHeader><CardTitle>💻 Code Example</CardTitle></CardHeader><CardContent><pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm"><code>{currentModule.codeExample}</code></pre><div className="flex gap-3 mt-4"><Button onClick={() => setOutput("Code executed!")}>▶ Run</Button><Button variant="outline" onClick={() => setUserCode(currentModule.codeExample)}>Load</Button></div></CardContent></Card>
            <Card><CardHeader><CardTitle>🧠 Practice Exercises</CardTitle></CardHeader><CardContent className="space-y-4">{exercises.map((ex, i) => (<div key={i} className="rounded-lg border p-4"><h4 className="font-semibold">Exercise {i + 1}</h4><p className="text-sm text-muted-foreground">{ex}</p></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle>🧪 Try It Yourself</CardTitle></CardHeader><CardContent><textarea className="w-full h-48 bg-muted font-mono text-sm rounded-lg p-4" value={userCode} onChange={(e) => setUserCode(e.target.value)} placeholder="Write R code..." /><div className="flex gap-3 mt-4"><Button onClick={() => setOutput("Executed!")}>▶ Run</Button><Button variant="outline" onClick={() => setUserCode("")}>Reset</Button></div>{output && <pre className="mt-4 bg-muted p-4 rounded-lg text-sm">{output}</pre>}</CardContent></Card>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <Card className="sticky top-8"><CardHeader><CardTitle>Module Topics</CardTitle></CardHeader><CardContent className="space-y-2">{topics.map((t) => (<button key={t.id} onClick={() => navigate(`/r-learning/topic/${currentModule.id}/${t.id}`)} className={`w-full rounded-lg border px-4 py-3 text-left transition ${t.id === currentTopic.id ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"}`}><span className="font-semibold">{t.title}</span><p className="text-xs mt-1">{t.duration}</p></button>))}</CardContent></Card>
            <Card><CardHeader><CardTitle>Your Progress</CardTitle></CardHeader><CardContent><Progress value={progress} className="h-2 mb-4" /><Button className="w-full" onClick={() => setProgress(100)} disabled={progress === 100}>{progress === 100 ? "✓ Completed" : "Mark complete"}</Button></CardContent></Card>
          </div>
        </div>
        <div className="flex justify-between mt-8">
          <Button variant="outline" disabled={!previousTopic} onClick={() => previousTopic && navigate(`/r-learning/topic/${currentModule.id}/${previousTopic.id}`)}>← Previous</Button>
          <Button disabled={!nextTopic} onClick={() => nextTopic && navigate(`/r-learning/topic/${currentModule.id}/${nextTopic.id}`)}>Next →</Button>
        </div>
      </div>
    </div>
  );
};

export default RTopicPage;




