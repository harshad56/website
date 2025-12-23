import { useEffect, useMemo, useState } from "react";
import { BackButton } from "@/components/BackButton";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { perlModules, type PerlModule, type PerlTopic } from "@/data/perlCourse";

const buildExercises = (title: string, count: number) => Array.from({ length: Math.max(count, 3) }, (_, i) => [`Explain "${title}".`, `Write Perl code for "${title}".`, `Create questions about "${title}".`][i % 3]);

const PerlTopicPage = () => {
  const { moduleId, topicId } = useParams();
  const navigate = useNavigate();
  const currentModule = useMemo<PerlModule | null>(() => perlModules.find((m) => m.id === Number(moduleId)) ?? perlModules.find((m) => m.topics.some((t) => t.id === topicId)) ?? null, [moduleId, topicId]);
  const currentTopic = useMemo<PerlTopic | null>(() => currentModule?.topics.find((t) => t.id === topicId) ?? null, [currentModule, topicId]);
  const [userCode, setUserCode] = useState(currentModule?.codeExample ?? "");
  const [output, setOutput] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => { setUserCode(currentModule?.codeExample ?? ""); setOutput(""); setProgress(0); }, [currentModule, currentTopic]);

  if (!currentModule || !currentTopic) return <div className="min-h-screen flex items-center justify-center"><Link to="/perl-learning"><Button>Back to Perl Course</Button></Link></div>;

  const topics = currentModule.topics;
  const idx = topics.findIndex((t) => t.id === currentTopic.id);
  const prev = idx > 0 ? topics[idx - 1] : null;
  const next = idx < topics.length - 1 ? topics[idx + 1] : null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b"><div className="container mx-auto px-6 py-4 flex justify-between items-center"><div className="flex items-center gap-4">
        <BackButton label="Back to Module" fallback="/perl-learning" className="mb-0" /><h1 className="text-xl font-bold">{currentModule.title}</h1></div><Badge>{currentTopic.difficulty}</Badge></div></header>
      <div className="container mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card><CardHeader><CardTitle>{currentTopic.title}</CardTitle><CardDescription>{currentTopic.duration}</CardDescription></CardHeader><CardContent><div className="whitespace-pre-line">{currentTopic.content}</div></CardContent></Card>
          <Card><CardHeader><CardTitle>Code Example</CardTitle></CardHeader><CardContent><pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto"><code>{currentModule.codeExample}</code></pre></CardContent></Card>
          <Card><CardHeader><CardTitle>Exercises</CardTitle></CardHeader><CardContent>{buildExercises(currentTopic.title, currentTopic.exercises).map((ex, i) => <div key={i} className="border rounded-lg p-4 mb-2"><strong>Exercise {i + 1}:</strong> {ex}</div>)}</CardContent></Card>
          <Card><CardHeader><CardTitle>Try It</CardTitle></CardHeader><CardContent><textarea className="w-full h-48 bg-muted p-4 rounded-lg font-mono" value={userCode} onChange={(e) => setUserCode(e.target.value)} /><Button className="mt-4" onClick={() => setOutput("Executed!")}>Run</Button>{output && <pre className="mt-4 bg-muted p-4 rounded-lg">{output}</pre>}</CardContent></Card>
        </div>
        <div className="space-y-6">
          <Card><CardHeader><CardTitle>Topics</CardTitle></CardHeader><CardContent>{topics.map((t) => <button key={t.id} onClick={() => navigate(`/perl-learning/topic/${currentModule.id}/${t.id}`)} className={`w-full text-left p-3 rounded-lg border mb-2 ${t.id === currentTopic.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>{t.title}</button>)}</CardContent></Card>
          <Card><CardHeader><CardTitle>Progress</CardTitle></CardHeader><CardContent><Progress value={progress} className="mb-4" /><Button className="w-full" onClick={() => setProgress(100)} disabled={progress === 100}>{progress === 100 ? "✓ Done" : "Complete"}</Button></CardContent></Card>
        </div>
      </div>
      <div className="container mx-auto px-6 pb-8 flex justify-between"><Button variant="outline" disabled={!prev} onClick={() => prev && navigate(`/perl-learning/topic/${currentModule.id}/${prev.id}`)}>← Prev</Button><Button disabled={!next} onClick={() => next && navigate(`/perl-learning/topic/${currentModule.id}/${next.id}`)}>Next →</Button></div>
    </div>
  );
};

export default PerlTopicPage;




