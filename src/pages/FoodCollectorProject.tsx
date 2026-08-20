import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, ArrowRight, AlertTriangle, CheckCircle, Download, Brain, Code, FlaskConical, BarChart3, Network } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import SEOHead from "@/components/SEOHead";
import LabPracticeSection from "@/components/LabPracticeSection";

const FoodCollectorProject = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="FoodCollector REINFORCE | Unity ML-Agents PyTorch Проект"
        description="Полный пайплайн обучения агента REINFORCE в среде FoodCollector: гибридные действия, GridSensor, ONNX для Unity Sentis."
        path="/unity-projects/food-collector"
      />
      {/* 1. Заголовок */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/unity-projects")} className="text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Unity Проекты
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-accent/10 text-accent">★ Флагманский проект</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold">
            <span className="bg-gradient-neon bg-clip-text text-transparent">FoodCollector: REINFORCE с гибридным пространством действий</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            Полный пайплайн обучения агента в среде FoodCollector: кастомная реализация REINFORCE на PyTorch с гибридным пространством действий (непрерывные + дискретные), GridSensor, экспорт ONNX для Unity Sentis.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-12">
        {/* 2. Стек технологий */}
        <div className="flex flex-wrap gap-2">
          {["Python", "PyTorch", "Unity ML-Agents", "REINFORCE", "GridSensor", "ONNX", "Sentis"].map((tech) => (
            <span key={tech} className="text-xs px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary font-medium">
              {tech}
            </span>
          ))}
        </div>

        {/* 3. Архитектура HybridPolicyNetwork */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" /> Архитектура HybridPolicyNetwork
          </h2>
          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 space-y-4">
              <div className="bg-background/60 rounded-lg p-4 border border-border/50">
                <p className="text-sm text-muted-foreground font-mono text-center">
                  Input (GridSensor 4D) → <span className="text-primary">CNN</span> → Flatten → <span className="text-primary">FC</span> → [<span className="text-secondary">ContinuousHead</span> | <span className="text-accent">DiscreteHead</span>]
                </p>
              </div>
              <CyberCodeBlock language="python" filename="hybrid_policy.py">
{`class HybridPolicyNetwork(nn.Module):
    """Политика с непрерывными и дискретными головами."""
    def __init__(self, obs_size: int, n_continuous: int, n_discrete: int):
        super().__init__()
        self.shared = nn.Sequential(
            nn.Linear(obs_size, 256),
            nn.ReLU(),
            nn.Linear(256, 128),
            nn.ReLU(),
        )
        # Непрерывные действия: μ и log_σ
        self.continuous_mean = nn.Linear(128, n_continuous)
        self.continuous_log_std = nn.Parameter(torch.zeros(n_continuous))
        # Дискретные действия: logits
        self.discrete_logits = nn.Linear(128, n_discrete)

    def forward(self, obs):
        features = self.shared(obs)
        mean = self.continuous_mean(features)
        log_std = self.continuous_log_std.expand_as(mean)
        discrete = self.discrete_logits(features)
        return mean, log_std, discrete`}
              </CyberCodeBlock>
            </CardContent>
          </Card>
        </section>

        {/* 4. Ключевые проблемы и решения */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-primary" /> Ключевые проблемы и решения
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {[
              {
                problem: "GridSensor возвращает 4D тензор (B, C, H, W)",
                solution: "Патч порядка каналов + reshape перед FC-слоями",
              },
              {
                problem: "Нестабильное обучение REINFORCE",
                solution: "Нормализация advantage + entropy bonus (0.01) + gradient clipping (0.5)",
              },
              {
                problem: "ONNX экспорт: несовместимость opset",
                solution: "opset=9, legacy TorchScript экспортёр + UnityONNXWrapper",
              },
            ].map((item, i) => (
              <Card key={i} className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs text-yellow-400 font-medium uppercase">Проблема</span>
                      <p className="text-sm text-foreground mt-1">{item.problem}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs text-green-400 font-medium uppercase">Решение</span>
                      <p className="text-sm text-muted-foreground mt-1">{item.solution}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 5. Ссылка на Jupyter ноутбук */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Code className="w-6 h-6 text-primary" /> Jupyter-ноутбук
          </h2>
          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-foreground font-medium">Полный ноутбук: FoodCollector_REINFORCE_v3.ipynb</p>
                <p className="text-sm text-muted-foreground mt-1">Скачай — запусти — получи результат. Все зависимости внутри.</p>
              </div>
              <a href="/FoodCollector_REINFORCE_v3.ipynb" download>
                <Button variant="cyber">
                  <Download className="w-4 h-4 mr-2" /> Скачать .ipynb
                </Button>
              </a>
            </CardContent>
          </Card>
        </section>

        {/* 5b. Обученная нейронная сеть */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Network className="w-6 h-6 text-secondary" /> Обученная нейронная сеть
          </h2>
          <Card className="bg-card/60 backdrop-blur-sm border-secondary/20 overflow-hidden">
            <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Neural network icon */}
                <div className="relative w-16 h-16 shrink-0 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-center shadow-[0_0_20px_hsl(var(--secondary)/0.2)]">
                  <Network className="w-8 h-8 text-secondary" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-secondary animate-pulse" />
                </div>
                <div>
                  <p className="text-foreground font-medium">FoodCollector_REINFORCE_3.0.onnx</p>
                  <p className="text-sm text-muted-foreground mt-1">Готовая модель ONNX — загрузи в Unity Sentis и запусти агента.</p>
                </div>
              </div>
              <a href="/FoodCollector_REINFORCE_3.0.onnx" download>
                <Button variant="secondary" className="shrink-0">
                  <Download className="w-4 h-4 mr-2" /> Скачать .onnx
                </Button>
              </a>
            </CardContent>
          </Card>
        </section>

        {/* 6. Результаты обучения */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" /> Результаты обучения
          </h2>
          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-foreground">Метрика</TableHead>
                    <TableHead className="text-foreground">Значение</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow><TableCell>Алгоритм</TableCell><TableCell className="text-primary">REINFORCE с baseline</TableCell></TableRow>
                  <TableRow><TableCell>Эпизоды обучения</TableCell><TableCell>5 000</TableCell></TableRow>
                  <TableRow><TableCell>Среда</TableCell><TableCell>FoodCollector (Unity ML-Agents)</TableCell></TableRow>
                  <TableRow><TableCell>Экспорт</TableCell><TableCell>ONNX opset 9 (Barracuda / Sentis)</TableCell></TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        {/* Практика: собранная среда лаборатории для этой темы. */}
        <LabPracticeSection contextKey="/unity-projects/food-collector" />

        {/* 7. Навигация */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
          <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10" onClick={() => navigate("/unity-projects")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Unity Projects
          </Button>
          <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10" onClick={() => navigate("/courses/3-5")}>
            Урок 3-5: Деплой ONNX <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FoodCollectorProject;
