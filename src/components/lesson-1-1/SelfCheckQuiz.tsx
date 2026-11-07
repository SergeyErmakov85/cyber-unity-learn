import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, RotateCcw, Brain } from "lucide-react";

interface Q {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUESTIONS: Q[] = [
  {
    question: "Что лучше всего описывает обучение с подкреплением (Reinforcement Learning)?",
    options: [
      "Обучение на размеченных парах «вход — правильный ответ»",
      "Поиск скрытых кластеров в данных без меток",
      "Агент учится методом проб и ошибок, максимизируя суммарную награду от среды",
      "Заучивание правил, заданных экспертом вручную",
    ],
    correct: 2,
    explanation:
      "В RL нет готовых правильных ответов: агент действует в среде, получает награду и постепенно улучшает стратегию, чтобы суммарная награда была максимальной.",
  },
  {
    question: "Из каких элементов состоит марковский процесс принятия решений (MDP)?",
    options: [
      "Состояния, действия, вероятности переходов, награды и коэффициент дисконтирования",
      "Обучающая, валидационная и тестовая выборки",
      "Слои нейросети, функция активации и оптимизатор",
      "Только состояния и награды",
    ],
    correct: 0,
    explanation:
      "MDP задаётся пятёркой (S, A, P, R, γ): состояния, действия, переходы, награды и дисконт. Это формальная модель задачи RL.",
  },
  {
    question: "Что означает марковское свойство?",
    options: [
      "Награда всегда положительна",
      "Следующее состояние зависит только от текущего состояния и действия, а не от всей истории",
      "Агент знает все будущие состояния заранее",
      "Действия выбираются случайно",
    ],
    correct: 1,
    explanation:
      "Текущее состояние содержит всю нужную информацию о прошлом — историю хранить не нужно.",
  },
  {
    question: "Какой пример относится к дискретному пространству действий?",
    options: [
      "Угол поворота руля от −30° до +30°",
      "Сила нажатия на педаль газа от 0 до 1",
      "Выбор одного из ходов: вверх, вниз, влево, вправо",
      "Крутящий момент в суставах робота",
    ],
    correct: 2,
    explanation:
      "Дискретное пространство — конечный набор вариантов. Движение в одну из четырёх сторон в сеточном мире — классический пример.",
  },
  {
    question: "Когда пространство действий называют непрерывным?",
    options: [
      "Когда действие — вещественное число (или вектор) из диапазона, например сила или скорость",
      "Когда эпизод никогда не заканчивается",
      "Когда агент действует без остановки",
      "Когда действий больше десяти",
    ],
    correct: 0,
    explanation:
      "Непрерывное действие принимает любое значение из интервала — как управление рулём или моторами в Unity ML-Agents.",
  },
];

const SelfCheckQuiz = () => {
  const [answers, setAnswers] = useState<(number | null)[]>(() => QUESTIONS.map(() => null));
  const [checked, setChecked] = useState(false);

  const score = answers.filter((a, i) => a === QUESTIONS[i].correct).length;
  const allAnswered = answers.every((a) => a !== null);

  const reset = () => {
    setAnswers(QUESTIONS.map(() => null));
    setChecked(false);
    document.getElementById("self-check")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="self-check" className="scroll-mt-24 mt-12">
      <Card className="bg-card/60 backdrop-blur-sm border-primary/30">
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl border border-primary/40 bg-primary/10 flex items-center justify-center shadow-glow-cyan">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Проверь себя
              </h2>
              <p className="text-sm text-muted-foreground">
                {QUESTIONS.length} вопросов по материалу урока
              </p>
            </div>
          </div>

          <ol className="space-y-6">
            {QUESTIONS.map((q, qi) => {
              const userAns = answers[qi];
              const isRight = userAns === q.correct;
              return (
                <li key={qi} className="rounded-xl border border-primary/15 bg-background/40 p-5 space-y-3">
                  <p className="font-semibold text-foreground">
                    <span className="text-primary mr-2">{qi + 1}.</span>
                    {q.question}
                  </p>
                  <div className="grid gap-2">
                    {q.options.map((opt, oi) => {
                      const selected = userAns === oi;
                      let cls = "border-border/50 hover:border-primary/50 hover:bg-primary/5";
                      if (!checked && selected) cls = "border-primary bg-primary/10 shadow-glow-cyan";
                      if (checked) {
                        if (oi === q.correct) cls = "border-green-400/70 bg-green-500/10";
                        else if (selected) cls = "border-destructive/70 bg-destructive/10";
                        else cls = "border-border/30 opacity-60";
                      }
                      return (
                        <button
                          key={oi}
                          type="button"
                          disabled={checked}
                          onClick={() =>
                            setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)))
                          }
                          className={`flex items-center gap-3 text-left text-sm rounded-lg border px-4 py-3 transition-all ${cls} disabled:cursor-default`}
                        >
                          <span className="font-mono text-xs text-secondary">
                            {String.fromCharCode(65 + oi)}
                          </span>
                          <span className="flex-1 text-foreground">{opt}</span>
                          {checked && oi === q.correct && <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />}
                          {checked && selected && oi !== q.correct && <XCircle className="w-5 h-5 text-destructive shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                  {checked && (
                    <p className={`text-sm rounded-lg p-3 border ${isRight ? "border-green-400/30 bg-green-500/5" : "border-destructive/30 bg-destructive/5"} text-muted-foreground`}>
                      <strong className={isRight ? "text-green-400" : "text-destructive"}>
                        {userAns === null ? "Нет ответа. " : isRight ? "Верно! " : "Неверно. "}
                      </strong>
                      {q.explanation}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {checked ? (
              <p className="text-lg font-semibold text-foreground">
                Ваш результат:{" "}
                <span className={score === QUESTIONS.length ? "text-green-400" : score >= 3 ? "text-primary" : "text-accent"}>
                  {score} из {QUESTIONS.length}
                </span>
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {allAnswered ? "Все ответы выбраны — можно проверять." : "Выберите ответ в каждом вопросе."}
              </p>
            )}
            {checked ? (
              <Button onClick={reset} variant="outline" className="border-secondary/40 hover:shadow-glow-purple">
                <RotateCcw className="w-4 h-4 mr-2" />
                Пройти заново
              </Button>
            ) : (
              <Button
                onClick={() => setChecked(true)}
                disabled={!allAnswered}
                className="bg-gradient-to-r from-primary via-secondary to-accent text-primary-foreground font-semibold hover:shadow-glow-cyan"
              >
                Проверить
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default SelfCheckQuiz;
