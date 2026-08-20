import BlogLayout from "@/components/BlogLayout";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import { blogPosts } from "@/pages/Blog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import LabPracticeSection from "@/components/LabPracticeSection";

const post = blogPosts.find((p) => p.slug === "onnx-sentis-pipeline")!;

const toc = [
  { id: "pipeline", title: "Полный pipeline (5 шагов)" },
  { id: "export", title: "Экспорт модели: UnityONNXWrapper" },
  { id: "inference", title: "Инференс в Unity (C#)" },
  { id: "errors", title: "Типичные ошибки и решения" },
  { id: "conclusion", title: "Заключение" },
];

const BlogOnnxSentis = () => (
  <BlogLayout post={post} toc={toc}>
    <section id="pipeline">
      <h2 className="text-2xl font-bold text-foreground mb-3">Полный pipeline (5 шагов)</h2>
      <ol className="space-y-4 text-muted-foreground">
        <li className="flex items-start gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm border border-primary/30">1</span>
          <div>
            <strong className="text-foreground">Обучение модели в PyTorch</strong>
            <p className="mt-1">Тренируем агента (PPO, SAC и т.д.) до нужного уровня reward. Сохраняем state_dict модели.</p>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm border border-primary/30">2</span>
          <div>
            <strong className="text-foreground">Обёртка UnityONNXWrapper</strong>
            <p className="mt-1">Оборачиваем модель для добавления метаданных ML-Agents: версия, тип действий, размеры observation/action.</p>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm border border-primary/30">3</span>
          <div>
            <strong className="text-foreground">Экспорт в ONNX</strong>
            <p className="mt-1">torch.onnx.export с opset_version=9 (требование ML-Agents). Проверяем onnx.checker.</p>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm border border-primary/30">4</span>
          <div>
            <strong className="text-foreground">Импорт в Unity Sentis</strong>
            <p className="mt-1">Перетаскиваем .onnx файл в Assets/Models/. Sentis автоматически распарсит граф.</p>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm border border-primary/30">5</span>
          <div>
            <strong className="text-foreground">Инференс в C#</strong>
            <p className="mt-1">Создаём Worker, загружаем модель, вызываем Execute() каждый кадр для получения действий агента.</p>
          </div>
        </li>
      </ol>
    </section>

    <section id="export">
      <h2 className="text-2xl font-bold text-foreground mb-3">Экспорт модели: UnityONNXWrapper</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Unity ML-Agents ожидает специфические метаданные в ONNX-модели. Обёртка
        <code className="text-primary"> UnityONNXWrapper</code> добавляет их автоматически.
      </p>
      <CyberCodeBlock language="python" filename="export_onnx.py">
{`import torch
import torch.nn as nn
import onnx

class UnityONNXWrapper(nn.Module):
    """Обёртка для экспорта PyTorch-модели в формат Unity ML-Agents."""
    def __init__(self, policy_net, obs_dim, action_dim,
                 continuous=True, version=3):
        super().__init__()
        self.policy = policy_net
        self.obs_dim = obs_dim
        self.action_dim = action_dim
        self.continuous = continuous
        self.version = version

    def forward(self, obs):
        # Unity ожидает: (batch, action_dim) для continuous
        # или (batch, num_branches) для discrete
        return self.policy(obs)

# Использование:
wrapper = UnityONNXWrapper(trained_policy, obs_dim=8, action_dim=2)
dummy_input = torch.randn(1, 8)

torch.onnx.export(
    wrapper,
    dummy_input,
    "model.onnx",
    opset_version=9,          # ML-Agents требует opset 9
    input_names=["obs_0"],
    output_names=["continuous_actions"],
    dynamic_axes={"obs_0": {0: "batch"}, "continuous_actions": {0: "batch"}},
)

# Проверка
model = onnx.load("model.onnx")
onnx.checker.check_model(model)
print("✅ Модель валидна")`}
      </CyberCodeBlock>
    </section>

    <section id="inference">
      <h2 className="text-2xl font-bold text-foreground mb-3">Инференс в Unity (C#)</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        После импорта .onnx в Unity используем Sentis для инференса.
        Ключевые классы: <code className="text-primary">ModelLoader</code>,
        <code className="text-primary"> IWorker</code>,
        <code className="text-primary"> TensorFloat</code>.
      </p>
      <CyberCodeBlock language="python" filename="SentisAgent.cs">
{`using Unity.Sentis;
using UnityEngine;

public class SentisAgent : MonoBehaviour
{
    [SerializeField] ModelAsset modelAsset;
    IWorker worker;
    Model runtimeModel;

    void Start()
    {
        runtimeModel = ModelLoader.Load(modelAsset);
        worker = WorkerFactory.CreateWorker(
            BackendType.GPUCompute, runtimeModel
        );
    }

    void Update()
    {
        // Подготовка входных данных
        float[] observations = CollectObservations(); // ваш метод
        var inputTensor = new TensorFloat(
            new TensorShape(1, observations.Length),
            observations
        );

        // Инференс
        worker.Execute(inputTensor);

        // Получение результата
        var output = worker.PeekOutput() as TensorFloat;
        output.CompleteAllPendingOperations();

        float[] actions = output.ToReadOnlyArray();
        ApplyActions(actions); // ваш метод

        inputTensor.Dispose();
    }

    void OnDestroy()
    {
        worker?.Dispose();
    }
}`}
      </CyberCodeBlock>
    </section>

    <section id="errors">
      <h2 className="text-2xl font-bold text-foreground mb-3">Типичные ошибки и решения</h2>
      <Accordion type="single" collapsible className="space-y-2">
        <AccordionItem value="opset" className="border border-border/30 rounded-lg px-4 bg-card/40">
          <AccordionTrigger className="text-foreground text-sm font-medium">
            Ошибка: «Unsupported opset version»
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-sm">
            Unity ML-Agents требует opset 9. При экспорте убедитесь, что используете
            <code className="text-primary"> opset_version=9</code> в torch.onnx.export().
            Sentis поддерживает больше opset-ов, но для совместимости с ML-Agents используйте 9.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="shapes" className="border border-border/30 rounded-lg px-4 bg-card/40">
          <AccordionTrigger className="text-foreground text-sm font-medium">
            Ошибка: «Input shape mismatch»
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-sm">
            Проверьте, что obs_dim в обёртке совпадает с VectorObservationSize в Unity.
            Используйте dynamic_axes для batch dimension. Входной тензор должен быть
            (1, obs_dim) для single agent.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="gpu" className="border border-border/30 rounded-lg px-4 bg-card/40">
          <AccordionTrigger className="text-foreground text-sm font-medium">
            Ошибка: «BackendType.GPUCompute not supported»
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-sm">
            Не все платформы поддерживают GPU Compute. Замените на
            <code className="text-primary"> BackendType.CPU</code> для универсальной совместимости.
            На мобильных устройствах используйте BackendType.GPUPixel (Sentis 1.3+).
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="nan" className="border border-border/30 rounded-lg px-4 bg-card/40">
          <AccordionTrigger className="text-foreground text-sm font-medium">
            Проблема: NaN в выходных данных
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-sm">
            Обычно вызвана ненормализованными входными данными. Убедитесь, что наблюдения
            нормализованы (mean=0, std=1) так же, как во время обучения. Добавьте нормализацию
            в CollectObservations() или используйте RunningMeanStd из ML-Agents.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>

    <section id="conclusion">
      <h2 className="text-2xl font-bold text-foreground mb-3">Заключение</h2>
      <p className="text-muted-foreground leading-relaxed">
        Pipeline PyTorch → ONNX → Unity Sentis — это стандартный путь деплоя RL-моделей в игры.
        Ключевые моменты: используйте opset 9, оборачивайте модель через UnityONNXWrapper,
        проверяйте формы тензоров и нормализацию. С практикой весь процесс занимает менее 30 минут.
      </p>
    </section>
  {/* Практика: собранная среда лаборатории для этой темы. */}
  <LabPracticeSection contextKey="/blog/onnx-sentis-pipeline" />

  </BlogLayout>
);

export default BlogOnnxSentis;
