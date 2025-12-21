import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { swiftModules, type SwiftModule, type SwiftTopic } from "@/data/swiftCourse";

const MIN_EXERCISES = 3;

const buildExercises = (title: string, count: number) => {
  const templates = [
    `Explain the main ideas of "${title}" using a simple Swift example.`,
    `Write a small Swift snippet that demonstrates "${title}" in an iOS-style context.`,
    `Create three practice tasks around "${title}" and solve them.`,
    `Compare how "${title}" works in Swift versus another language you know.`,
    `Review the Swift documentation for "${title}" and summarize two key tips.`,
  ];
  const length = Math.max(count, MIN_EXERCISES);
  return Array.from({ length }, (_, index) => templates[index % templates.length]);
};

const SwiftTopicPage = () => {
  const { moduleId, topicId } = useParams();
  const navigate = useNavigate();
  const moduleNumber = moduleId ? Number(moduleId) : Number.NaN;

  const currentModule = useMemo<SwiftModule | null>(() => {
    if (Number.isFinite(moduleNumber)) {
      const match = swiftModules.find((module) => module.id === moduleNumber);
      if (match) return match;
    }

    if (topicId) {
      return swiftModules.find((module) => module.topics.some((topic) => topic.id === topicId)) ?? null;
    }

    return null;
  }, [moduleNumber, topicId]);

  const currentTopic = useMemo<SwiftTopic | null>(() => {
    if (!currentModule || !topicId) return null;
    return currentModule.topics.find((topic) => topic.id === topicId) ?? null;
  }, [currentModule, topicId]);

  const [userCode, setUserCode] = useState(currentModule?.codeExample ?? "");
  const [output, setOutput] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setUserCode(currentModule?.codeExample ?? "");
    setOutput("");
    setProgress(0);
  }, [currentModule, currentTopic]);

  const topics = currentModule?.topics ?? [];
  const currentIndex = currentTopic ? topics.findIndex((topic) => topic.id === currentTopic.id) : -1;
  const previousTopic = currentIndex > 0 ? topics[currentIndex - 1] : null;
  const nextTopic =
    currentIndex >= 0 && currentIndex < topics.length - 1 ? topics[currentIndex + 1] : null;

  const exercises = currentTopic ? buildExercises(currentTopic.title, currentTopic.exercises) : [];

  const runExample = () => {
    setOutput("Code executed successfully! (Run this Swift code in Xcode or Playgrounds to see real output.)");
  };

  const difficultyVariant =
    currentTopic?.difficulty === "Beginner"
      ? "default"
      : currentTopic?.difficulty === "Intermediate"
        ? "secondary"
        : "destructive";

  if (!currentModule || !currentTopic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Topic Not Found</h1>
          <p className="text-muted-foreground">Choose a topic from the Swift learning path to continue.</p>
          <Link to="/swift-learning">
            <Button>Back to Swift Course</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Link to={`/swift-learning?module=${currentModule.id}`} replace>
                <Button variant="outline" size="sm">
                  ← Back to Module
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">
                  Module {currentModule.id}
                </p>
                <h1 className="text-2xl font-bold">{currentModule.title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={difficultyVariant}>{currentTopic.difficulty}</Badge>
              <Badge variant="outline">{currentTopic.duration}</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{currentTopic.title}</CardTitle>
                <CardDescription>
                  Duration: {currentTopic.duration} • Difficulty: {currentTopic.difficulty}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-line leading-relaxed text-foreground">
                  {currentTopic.content}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>💻 Code Example</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-code-bg rounded-lg p-4 mb-4 overflow-x-auto">
                  <pre className="text-sm font-mono text-code-foreground">
                    <code>{currentModule.codeExample}</code>
                  </pre>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={runExample}>▶ Run Example</Button>
                  <Button variant="outline" onClick={() => setUserCode(currentModule.codeExample)}>
                    Load into editor
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🧠 Practice Exercises</CardTitle>
                <CardDescription>Reinforce the lesson with hands-on practice.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {exercises.map((exercise, idx) => (
                  <div key={idx} className="rounded-lg border p-4">
                    <h4 className="font-semibold mb-1">Exercise {idx + 1}</h4>
                    <p className="text-sm text-muted-foreground">{exercise}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🧪 Try It Yourself</CardTitle>
                <CardDescription>Use this sandbox to experiment with Swift code.</CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  className="w-full h-48 bg-code-bg text-code-foreground font-mono text-sm rounded-lg p-4 outline-none resize-none"
                  value={userCode}
                  onChange={(event) => setUserCode(event.target.value)}
                  placeholder="Write your Swift code here..."
                />
                <div className="flex gap-3 mt-4">
                  <Button onClick={() => setOutput("Code executed successfully! (simulate output)")}>
                    ▶ Run Code
                  </Button>
                  <Button variant="outline" onClick={() => setUserCode("")}>
                    Reset
                  </Button>
                </div>
                {output && (
                  <div className="mt-4 rounded-lg bg-muted p-4">
                    <h4 className="font-semibold mb-2">Output</h4>
                    <pre className="text-sm whitespace-pre-wrap">{output}</pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Module Topics</CardTitle>
                <CardDescription>Jump to any topic in this module.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => navigate(`/swift-learning/topic/${currentModule.id}/${topic.id}`)}
                    className={`w-full rounded-lg border px-4 py-3 text-left transition ${topic.id === currentTopic.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{topic.title}</span>
                      <Badge variant="outline" className="text-xs">
                        {topic.difficulty}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{topic.duration}</p>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2 text-sm font-medium">
                    <span>Topic mastery</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                <Button
                  className="w-full"
                  onClick={() => setProgress((prev) => (prev === 100 ? prev : 100))}
                  disabled={progress === 100}
                >
                  {progress === 100 ? "✓ Completed" : "Mark as complete"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mt-8">
          <Button
            variant="outline"
            disabled={!previousTopic}
            onClick={() => {
              if (previousTopic) {
                navigate(`/swift-learning/topic/${currentModule.id}/${previousTopic.id}`);
              }
            }}
          >
            ← Previous Topic
          </Button>

          <div className="flex gap-3">
            <Link to="/coding-challenges">
              <Button variant="outline">💡 Practice Challenges</Button>
            </Link>
            <Button
              disabled={!nextTopic}
              onClick={() => {
                if (nextTopic) {
                  navigate(`/swift-learning/topic/${currentModule.id}/${nextTopic.id}`);
                }
              }}
            >
              Next Topic →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwiftTopicPage;



