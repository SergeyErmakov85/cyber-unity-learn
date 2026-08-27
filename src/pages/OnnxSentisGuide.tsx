import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import SEOHead from "@/components/SEOHead";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ScrollToTop from "@/components/ScrollToTop";
import LabPracticeSection from "@/components/LabPracticeSection";

const TOC_ITEMS = [
  { id: "prepare-model", label: "1. Подготовка модели PyTorch" },
  { id: "export-onnx", label: "2. Экспорт в ONNX" },
  { id: "unity-wrapper", label: "3. UnityONNXWrapper" },
  { id: "import-sentis", label: "4. Импорт в Unity Sentis" },
  { id: "inference-csharp", label: "5. Инференс в C#" },
  { id: "debug-errors", label: "6. Отладка и ошибки" },
];

const OnnxSentisGuide = () => {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );
    TOC_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="ONNX → Unity Sentis: Деплой RL-модели | RL Platform"
        description="Пошаговый гайд по экспорту PyTorch модели в ONNX и инференсу через Unity Sentis."
        path="/advanced/onnx-sentis"
      />
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
              Гайд
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold">
            <span className="bg-gradient-neon bg-clip-text text-transparent">
              ONNX + Unity Sentis: полный пайплайн
            </span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            Экспорт PyTorch-модели в ONNX, обёртка для совместимости с ML-Agents, импорт в Unity Sentis и инференс в C#.
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="container mx-auto px-4 py-12 flex gap-8">
        {/* Sticky sidebar TOC */}
        <aside className="hidden lg:block w-64 shrink-0">
          <nav className="sticky top-24 space-y-1">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Содержание
            </h2>
            {TOC_ITEMS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors cursor-pointer border-l-2 ${
                  activeId === id
                    ? "border-primary text-primary bg-primary/10 font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 space-y-12">
          {/* 1. Подготовка модели */}
          <section id="prepare-model">
            <h2 className="text-2xl font-bold text-primary mb-4">1. Подготовка модели PyTorch</h2>
            <p className="text-muted-foreground mb-4">
              Определите архитектуру политики и загрузите обученные веса. Убедитесь, что модель переведена в режим <code className="text-primary">eval()</code> перед экспортом.
            </p>
            <Card className="border-primary/20 bg-card/60 backdrop-blur-sm">
              <CardContent className="p-0">
                <CyberCodeBlock language="python" filename="prepare_model.py">
{`import torch
import torch.nn as nn

class PolicyNet(nn.Module):
    def __init__(self, obs_dim=64, action_dim=3):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(obs_dim, 128),
            nn.Tanh(),
            nn.Linear(128, 64),
            nn.Tanh(),
            nn.Linear(64, action_dim)
        )

    def forward(self, obs):
        return self.net(obs)

model = PolicyNet()
model.load_state_dict(torch.load("policy_checkpoint.pt"))
model.eval()`}
                </CyberCodeBlock>
              </CardContent>
            </Card>
          </section>

          {/* 2. Экспорт в ONNX */}
          <section id="export-onnx">
            <h2 className="text-2xl font-bold text-primary mb-4">2. Экспорт в ONNX</h2>
            <p className="text-muted-foreground mb-4">
              Используйте <code className="text-primary">torch.onnx.export</code> с <code className="text-primary">opset_version=9</code> — это требование Barracuda / Sentis для корректного импорта.
            </p>
            <Card className="border-primary/20 bg-card/60 backdrop-blur-sm">
              <CardContent className="p-0">
                <CyberCodeBlock language="python" filename="export_onnx.py">
{`# Простой экспорт (без обёртки)
dummy = torch.zeros(1, 64)

torch.onnx.export(
    model,
    dummy,
    "policy_raw.onnx",
    opset_version=9,
    input_names=["obs_0"],
    output_names=["continuous_actions"],
    dynamic_axes={"obs_0": {0: "batch_size"}},
)
print("✓ Базовый экспорт: policy_raw.onnx")`}
                </CyberCodeBlock>
              </CardContent>
            </Card>
          </section>

          {/* 3. UnityONNXWrapper */}
          <section id="unity-wrapper">
            <h2 className="text-2xl font-bold text-primary mb-4">3. UnityONNXWrapper</h2>
            <p className="text-muted-foreground mb-4">
              Unity ML-Agents ожидает дополнительные метаданные в выходах модели: <code className="text-primary">version_number</code>, <code className="text-primary">memory_size</code> и <code className="text-primary">is_continuous_control</code>. Обёртка добавляет их автоматически.
            </p>
            <Card className="border-primary/20 bg-card/60 backdrop-blur-sm">
              <CardContent className="p-0">
                <CyberCodeBlock language="python" filename="unity_onnx_wrapper.py">
{`# Обёртка для совместимости с Unity ML-Agents / Barracuda
class UnityONNXWrapper(nn.Module):
    """Добавляет версионные метаданные, требуемые Unity."""
    VERSION_NUMBER = torch.Tensor([3.0])
    MEMORY_SIZE = torch.Tensor([0])
    IS_CONTINUOUS = torch.Tensor([1])  # 1=continuous, 0=discrete

    def __init__(self, policy: nn.Module):
        super().__init__()
        self.policy = policy

    def forward(self, obs: torch.Tensor):
        action = self.policy(obs)
        return (
            action,
            self.VERSION_NUMBER,
            self.MEMORY_SIZE,
            self.IS_CONTINUOUS,
        )

wrapper = UnityONNXWrapper(model)
dummy = torch.zeros(1, 64)  # batch_size=1, obs_dim=64

torch.onnx.export(
    wrapper,
    dummy,
    "policy.onnx",
    opset_version=9,  # Barracuda требует opset 9
    input_names=["obs_0"],
    output_names=[
        "continuous_actions",
        "version_number",
        "memory_size",
        "is_continuous_control",
    ],
    dynamic_axes={"obs_0": {0: "batch_size"}},
)
print("✓ Экспорт завершён: policy.onnx")`}
                </CyberCodeBlock>
              </CardContent>
            </Card>
          </section>

          {/* 4. Импорт в Unity Sentis */}
          <section id="import-sentis">
            <h2 className="text-2xl font-bold text-primary mb-4">4. Импорт в Unity Sentis</h2>
            <p className="text-muted-foreground mb-4">
              Перетащите <code className="text-primary">.onnx</code> файл в Assets Unity. Sentis автоматически создаст <code className="text-primary">ModelAsset</code>, который можно назначить через Inspector.
            </p>
            <Card className="border-primary/20 bg-card/60 backdrop-blur-sm">
              <CardContent className="p-6 space-y-3">
                <ol className="list-decimal list-inside text-muted-foreground space-y-2">
                  <li>Установите пакет <code className="text-primary">com.unity.sentis</code> через Package Manager</li>
                  <li>Перетащите <code className="text-primary">policy.onnx</code> в папку <code className="text-primary">Assets/Models/</code></li>
                  <li>Unity создаст <code className="text-primary">ModelAsset</code> — назначьте его в Inspector компоненту агента</li>
                  <li>Выберите бэкенд: <code className="text-primary">GPUCompute</code> (быстро) или <code className="text-primary">CPU</code> (совместимо)</li>
                </ol>
              </CardContent>
            </Card>
          </section>

          {/* 5. Инференс в C# */}
          <section id="inference-csharp">
            <h2 className="text-2xl font-bold text-primary mb-4">5. Инференс в C#</h2>
            <p className="text-muted-foreground mb-4">
              Загрузите модель через <code className="text-primary">ModelLoader</code>, создайте Worker и запустите инференс. Не забудьте вызвать <code className="text-primary">Dispose()</code> при уничтожении объекта.
            </p>
            <Card className="border-primary/20 bg-card/60 backdrop-blur-sm">
              <CardContent className="p-0">
                <CyberCodeBlock language="csharp" filename="AgentInference.cs">
{`using Unity.Sentis;
using UnityEngine;

public class AgentInference : MonoBehaviour
{
    [SerializeField] private ModelAsset modelAsset;
    private IWorker worker;
    private Model runtimeModel;

    void Start()
    {
        runtimeModel = ModelLoader.Load(modelAsset);
        worker = WorkerFactory.CreateWorker(
            BackendType.GPUCompute, runtimeModel
        );
    }

    public float[] RunInference(float[] observation)
    {
        using var input = new TensorFloat(
            new TensorShape(1, observation.Length),
            observation
        );
        worker.Execute(
            new Dictionary<string, Tensor> { { "obs_0", input } }
        );
        using var output =
            worker.PeekOutput("continuous_actions") as TensorFloat;
        output.MakeReadable();
        return output.ToReadOnlyArray();
    }

    void OnDestroy() => worker?.Dispose();
}`}
                </CyberCodeBlock>
              </CardContent>
            </Card>
          </section>

          {/* 6. Отладка и типичные ошибки */}
          <section id="debug-errors">
            <h2 className="text-2xl font-bold text-primary mb-4">6. Отладка и типичные ошибки</h2>
            <p className="text-muted-foreground mb-4">
              Наиболее частые проблемы при интеграции ONNX-моделей с Unity и способы их решения.
            </p>
            <Card className="border-primary/20 bg-card/60 backdrop-blur-sm">
              <CardContent className="p-4">
                <Accordion type="multiple" className="w-full">
                  <AccordionItem value="opset" className="border-primary/20">
                    <AccordionTrigger className="text-foreground hover:text-primary">
                      <span className="text-left"><code className="text-destructive mr-2">opset version not supported</code></span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Barracuda / Sentis поддерживают ограниченный набор opset. Используйте <code className="text-primary">opset_version=9</code> при вызове <code className="text-primary">torch.onnx.export</code>. Более новые opset могут содержать операторы, не реализованные в рантайме Unity.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="shape" className="border-primary/20">
                    <AccordionTrigger className="text-foreground hover:text-primary">
                      <span className="text-left"><code className="text-destructive mr-2">Input shape mismatch</code></span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Проверьте <code className="text-primary">dynamic_axes</code> в экспорте — batch-размерность должна быть динамической. Если используется GridSensor, убедитесь что тензор reshape-ится из 4D <code className="text-primary">(B, C, H, W)</code> в плоский вектор перед FC-слоями.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="version" className="border-primary/20">
                    <AccordionTrigger className="text-foreground hover:text-primary">
                      <span className="text-left"><code className="text-destructive mr-2">Output 'version_number' not found</code></span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      ML-Agents ожидает метаданные в выходах модели. Оберните модель в <code className="text-primary">UnityONNXWrapper</code> (см. секцию 3), чтобы добавить <code className="text-primary">version_number</code>, <code className="text-primary">memory_size</code> и <code className="text-primary">is_continuous_control</code>.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="nan" className="border-primary/20">
                    <AccordionTrigger className="text-foreground hover:text-primary">
                      <span className="text-left"><code className="text-destructive mr-2">NaN в инференсе</code></span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Нормализация наблюдений должна быть идентична тренировке. Если при обучении использовался running mean/std, те же параметры нужно применять в Unity. Проверьте также, что веса модели не содержат NaN после загрузки чекпоинта.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </section>

          {/* Практика: собранная среда лаборатории для этой темы. */}
          <LabPracticeSection contextKey="/advanced/onnx-sentis" />

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-border/50">
            <Button variant="ghost" onClick={() => navigate("/advanced")} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Продвинутые темы
            </Button>
            <Button variant="ghost" onClick={() => navigate("/unity-projects/food-collector")} className="gap-2">
              FoodCollector проект <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </main>
      </div>

      <ScrollToTop />
    </div>
  );
};

export default OnnxSentisGuide;
