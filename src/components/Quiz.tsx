import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { completeQuiz } from "@/lib/gamification";
import RichText from "@/components/math-symbols/RichText";

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

interface QuizProps {
  title?: string;
  questions: QuizQuestion[];
  lessonPath?: string;
  nextLesson?: { path: string; title: string };
}

const Quiz = ({ title = "Проверь себя", questions, lessonPath, nextLesson }: QuizProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [submitted, setSubmitted] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const navigate = useNavigate();

  const selectAnswer = (qIdx: number, optIdx: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const score = questions.filter((q, i) => answers[i] === q.correctIndex).length;
  const allAnswered = questions.every((_, i) => answers[i] !== undefined && answers[i] !== null);
  const perfect = score === questions.length;

  const handleSubmit = () => {
    setSubmitted(true);
    if (lessonPath) {
      const result = completeQuiz(lessonPath, perfect);
      setXpGained(result.xp);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setXpGained(0);
  };

  return (
    <Card className="border-accent/30 mt-10">
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setIsOpen(prev => !prev)}
      >
        <CardTitle className="text-lg flex items-center gap-2">
          🧠 {title}
          <ChevronDown
            className={`w-5 h-5 ml-auto text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </CardTitle>
      </CardHeader>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <CardContent className="space-y-6">
            {questions.map((q, qIdx) => (
              <div key={qIdx} className="space-y-2">
                <p className="font-medium text-sm text-foreground">{qIdx + 1}. <RichText text={q.question} /></p>
                <div className="grid gap-2">
                  {q.options.map((opt, optIdx) => {
                    const selected = answers[qIdx] === optIdx;
                    const isCorrect = q.correctIndex === optIdx;
                    let cls = "border-border/50 hover:border-primary/50 hover:bg-primary/5";
                    if (submitted && selected && isCorrect) cls = "border-green-500 bg-green-500/10";
                    else if (submitted && selected && !isCorrect) cls = "border-destructive bg-destructive/10";
                    else if (submitted && isCorrect) cls = "border-green-500/50 bg-green-500/5";
                    else if (selected) cls = "border-primary bg-primary/10";

                    return (
                      <button
                        key={optIdx}
                        onClick={() => selectAnswer(qIdx, optIdx)}
                        className={`text-left p-3 rounded-lg border text-sm transition-all ${cls}`}
                      >
                        <div className="flex items-center gap-2">
                          {submitted && selected && isCorrect && <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />}
                          {submitted && selected && !isCorrect && <XCircle className="w-4 h-4 text-destructive shrink-0" />}
                          {submitted && !selected && isCorrect && <CheckCircle className="w-4 h-4 text-green-500/50 shrink-0" />}
                          <span className="text-muted-foreground"><RichText text={opt} /></span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {submitted && q.explanation && (
                  <div className="mt-2 p-3 rounded-lg bg-muted/30 border border-border/50 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Пояснение:</span> <RichText text={q.explanation} />
                  </div>
                )}
              </div>
            ))}

            {!submitted ? (
              <Button onClick={handleSubmit} disabled={!allAnswered} className="w-full bg-gradient-neon">
                Проверить ответы
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-card/80 border border-primary/20">
                  <div className="space-y-1">
                    <span className="font-semibold text-foreground">
                      Результат: {score}/{questions.length}
                    </span>
                    {xpGained > 0 && (
                      <div className="flex items-center gap-1 text-sm text-primary">
                        <Sparkles className="w-3.5 h-3.5" />
                        +{xpGained} XP
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={handleRetry}>
                    Попробовать снова
                  </Button>
                </div>

                {nextLesson && (
                  <Button
                    className="w-full bg-gradient-neon gap-2"
                    onClick={() => navigate(nextLesson.path)}
                  >
                    Перейти к: {nextLesson.title}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

export default Quiz;
