import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, GraduationCap, Users, Eye, Swords, Cpu } from "lucide-react";
import { Link } from "react-router-dom";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import LabPracticeSection from "@/components/LabPracticeSection";

const codeBlock = (code: string, lang = "yaml") => (
  <pre className="bg-card/80 border border-primary/20 rounded-lg p-4 overflow-x-auto text-xs md:text-sm font-mono leading-relaxed">
    <code>{code}</code>
  </pre>
);

const AdvancedTopics = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hash = location.hash.replace("#", "");
  const validTabs = ["curriculum", "multiagent", "imitation", "selfplay", "onnx"];
  const defaultTab = validTabs.includes(hash) ? hash : "curriculum";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> На главную
        </Button>

        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-neon bg-clip-text text-transparent">
          Продвинутые темы
        </h1>
        <p className="text-muted-foreground mb-8">
          Curriculum Learning, Multi-Agent RL, Imitation Learning и Self-Play
        </p>

        <Tabs defaultValue={defaultTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
            <TabsTrigger value="curriculum"><GraduationCap className="w-4 h-4 mr-1" /> Curriculum</TabsTrigger>
            <TabsTrigger value="multiagent"><Users className="w-4 h-4 mr-1" /> Multi-Agent</TabsTrigger>
            <TabsTrigger value="imitation"><Eye className="w-4 h-4 mr-1" /> Imitation</TabsTrigger>
            <TabsTrigger value="selfplay"><Swords className="w-4 h-4 mr-1" /> Self-Play</TabsTrigger>
            <TabsTrigger value="onnx"><Cpu className="w-4 h-4 mr-1" /> ONNX/Sentis</TabsTrigger>
          </TabsList>

          {/* Curriculum Learning */}
          <TabsContent id="curriculum" value="curriculum">
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="text-2xl">Curriculum Learning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Концепция</h3>
                  <p className="text-muted-foreground">
                    Постепенное усложнение задачи во время обучения. Агент начинает с простых задач и по мере освоения переходит к более сложным,
                    что значительно ускоряет обучение и повышает финальное качество (Урок 3.3 — <CrossLinkToLesson lessonId="3-3" lessonPath="/courses/3-3" lessonTitle="Curriculum Learning" lessonLevel={3} />).
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Пример: обучение прыжкам</h3>
                  <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                    <li><strong>Lesson 1:</strong> Прыжок на 1 блок (легко)</li>
                    <li><strong>Lesson 2:</strong> Прыжок на 2 блока (средне)</li>
                    <li><strong>Lesson 3:</strong> Прыжок на 3 блока (сложно)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Конфигурация ML-Agents (YAML)</h3>
                  {codeBlock(`environment_parameters:
  lesson_difficulty:
    curriculum:
      - name: Lesson1
        completion_criteria:
          measure: reward
          behavior: MyAgent
          signal_smoothing: true
          min_lesson_length: 100
          threshold: 0.8
        value: 0.0
      - name: Lesson2
        completion_criteria:
          measure: reward
          behavior: MyAgent
          signal_smoothing: true
          min_lesson_length: 100
          threshold: 0.9
        value: 0.5
      - name: Lesson3
        value: 1.0`)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Multi-Agent */}
          <TabsContent id="multiagent" value="multiagent">
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="text-2xl">Multi-Agent RL (MAPOCA) (<CrossLinkToLesson lessonId="3-2" lessonPath="/courses/3-2" lessonTitle="Multi-Agent RL и Self-Play" lessonLevel={3} />)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Типы взаимодействий</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { title: "Cooperative", desc: "Агенты работают вместе для общей цели", icon: "🤝" },
                      { title: "Competitive", desc: "Агенты противостоят друг другу", icon: "⚔️" },
                      { title: "Mixed", desc: "Комбинация кооперации и конкуренции", icon: "🔄" },
                    ].map(t => (
                      <div key={t.title} className="p-4 rounded-lg bg-card/80 border border-primary/20 text-center">
                        <div className="text-2xl mb-2">{t.icon}</div>
                        <h4 className="font-semibold mb-1">{t.title}</h4>
                        <p className="text-xs text-muted-foreground">{t.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Реализация (C#)</h3>
                  {codeBlock(`// Настройка группового поведения
public class TeamAgent : Agent {
    public override void Initialize() {
        var groupId = gameObject.GetInstanceID();
        GroupRegister(groupId);
    }

    public override void OnActionReceived(ActionBuffers actions) {
        // Индивидуальная награда
        SetReward(individualReward);
        // Групповая награда (делится между всеми)
        AddGroupReward(teamReward);
    }
}`, "csharp")}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Imitation Learning */}
          <TabsContent id="imitation" value="imitation">
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="text-2xl">Imitation Learning (BC + GAIL) (<CrossLinkToLesson lessonId="3-4" lessonPath="/courses/3-4" lessonTitle="Imitation Learning: BC и GAIL" lessonLevel={3} />)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-card/80 border border-primary/20">
                    <h4 className="font-semibold text-primary mb-2">Behavioral Cloning</h4>
                    <p className="text-sm text-muted-foreground">
                      Обучение на демонстрациях эксперта. Агент напрямую копирует действия из записанных данных.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-card/80 border border-primary/20">
                    <h4 className="font-semibold text-accent mb-2">GAIL</h4>
                    <p className="text-sm text-muted-foreground">
                      Generative Adversarial Imitation Learning — использование GAN для имитации поведения эксперта.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Запись и обучение</h3>
                  {codeBlock(`# Запись демонстраций
mlagents-learn config/imitation.yaml --run-id=bc_run

# Обучение с GAIL
mlagents-learn config/gail.yaml --run-id=gail_run`, "bash")}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Self-Play */}
          <TabsContent id="selfplay" value="selfplay">
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="text-2xl">Self-Play</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Концепция</h3>
                  <p className="text-muted-foreground">
                    Агент играет против копий самого себя. Применяется для настольных игр, файтингов и стратегий (<CrossLinkToLesson lessonId="3-2" lessonPath="/courses/3-2" lessonTitle="Multi-Agent RL и Self-Play" lessonLevel={3} />).
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Конфигурация ML-Agents</h3>
                  {codeBlock(`behaviors:
  FighterAgent:
    trainer_type: ppo
    self_play:
      save_steps: 50000
      swap_steps: 2000
      team_change: 100000
      window: 10
      play_against_latest_model_ratio: 0.5`)}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Применение</h3>
                  <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                    <li>Настольные игры (шахматы, го)</li>
                    <li>Fighting games</li>
                    <li>Стратегии в реальном времени</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="onnx">
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="text-2xl">Деплой через ONNX → Unity Sentis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Экспорт обученной PyTorch-модели в ONNX и запуск инференса прямо в Unity через Sentis (бывший Barracuda).
                </p>
                <Button variant="cyber" asChild>
                  <Link to="/advanced/onnx-sentis">Открыть полный мастер-класс →</Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Практика: собранная среда лаборатории для этой темы. */}
        <LabPracticeSection contextKey="/advanced" />
      </div>
    </div>
  );
};

export default AdvancedTopics;
