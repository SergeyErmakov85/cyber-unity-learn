import BlogLayout from "@/components/BlogLayout";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import { blogPosts } from "@/pages/Blog";

const post = blogPosts.find((p) => p.slug === "jupyter-to-unity")!;

const toc = [
  { id: "intro", title: "Введение" },
  { id: "step1", title: "Шаг 1: Обучение модели в PyTorch" },
  { id: "step2", title: "Шаг 2: Экспорт в ONNX" },
  { id: "step3", title: "Шаг 3: Импорт в Unity" },
  { id: "step4", title: "Шаг 4: Настройка Agent" },
  { id: "step5", title: "Шаг 5: Тест и сборка" },
  { id: "troubleshooting", title: "Частые проблемы" },
  { id: "conclusion", title: "Заключение" },
];

const BlogJupyterToUnity = () => (
  <BlogLayout post={post} toc={toc}>
    <section id="intro">
      <h2 className="text-2xl font-bold text-foreground mb-3">Введение</h2>
      <p className="text-muted-foreground leading-relaxed">
        Вы обучили модель в Jupyter Notebook, графики reward выглядят отлично, агент решает задачу
        в симуляции. Что дальше? Как перенести это в реальную Unity-игру, чтобы NPC действительно
        использовал обученную нейросеть? Этот гайд проведёт вас через весь пайплайн за 30 минут:
        от файла .pth в PyTorch до работающей сборки Unity с интеллектуальным NPC. Никакой магии —
        только конкретные шаги с примерами кода.
      </p>
    </section>

    <section id="step1">
      <h2 className="text-2xl font-bold text-foreground mb-3">Шаг 1: Обучение модели в PyTorch (у вас уже есть)</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Предполагаем, что у вас есть обученная модель. Убедитесь, что вы сохранили веса
        и знаете точную архитектуру: размер входа (observations), размер выхода (actions),
        количество и размер скрытых слоёв. Это критически важно для корректного экспорта.
      </p>
      <CyberCodeBlock language="python" filename="save_model.py">
{`import torch
import torch.nn as nn

class PolicyNetwork(nn.Module):
    def __init__(self, obs_size=8, action_size=2, hidden=256):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(obs_size, hidden),
            nn.ReLU(),
            nn.Linear(hidden, hidden),
            nn.ReLU(),
            nn.Linear(hidden, action_size),
            nn.Tanh(),  # для непрерывных действий [-1, 1]
        )

    def forward(self, x):
        return self.net(x)

# Сохраняем обученную модель
model = PolicyNetwork()
# ... обучение ...
torch.save(model.state_dict(), "trained_policy.pth")
print(f"Model saved. Parameters: {sum(p.numel() for p in model.parameters()):,}")`}
      </CyberCodeBlock>
    </section>

    <section id="step2">
      <h2 className="text-2xl font-bold text-foreground mb-3">Шаг 2: Экспорт в ONNX (~5 минут)</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        ONNX (Open Neural Network Exchange) — универсальный формат для нейросетей.
        Unity Sentis (ранее Barracuda) понимает ONNX, поэтому экспорт — это мост между
        Python и C#. Главное правило: имена входов и выходов должны совпадать с ожиданиями
        ML-Agents.
      </p>
      <CyberCodeBlock language="python" filename="export_onnx.py">
{`import torch

# Загружаем обученную модель
model = PolicyNetwork(obs_size=8, action_size=2, hidden=256)
model.load_state_dict(torch.load("trained_policy.pth"))
model.eval()

# Dummy input для трассировки графа
dummy = torch.randn(1, 8)

# Экспорт
torch.onnx.export(
    model,
    dummy,
    "npc_policy.onnx",
    input_names=["obs_0"],              # ВАЖНО: ML-Agents ожидает "obs_0"
    output_names=["continuous_actions"], # или "discrete_actions"
    opset_version=15,
    dynamic_axes={
        "obs_0": {0: "batch_size"},
        "continuous_actions": {0: "batch_size"},
    }
)

# Верификация
import onnxruntime as ort
import LabPracticeSection from "@/components/LabPracticeSection";
sess = ort.InferenceSession("npc_policy.onnx")
test_input = torch.randn(1, 8).numpy()
result = sess.run(None, {"obs_0": test_input})
print(f"✅ ONNX export OK. Output shape: {result[0].shape}")
print(f"   Sample output: {result[0][0]}")`}
      </CyberCodeBlock>
      <p className="text-muted-foreground leading-relaxed mt-3">
        <strong className="text-foreground">Важно:</strong> если вы обучали через mlagents-learn,
        ONNX-файл уже создан автоматически в <code className="text-primary">results/run-id/BehaviorName.onnx</code>.
        Ручной экспорт нужен только для кастомных PyTorch-моделей.
      </p>
    </section>

    <section id="step3">
      <h2 className="text-2xl font-bold text-foreground mb-3">Шаг 3: Импорт в Unity (~5 минут)</h2>
      <p className="text-muted-foreground leading-relaxed">
        Создайте папку <code className="text-primary">Assets/ML-Models/</code> в вашем Unity-проекте
        и перетащите туда файл <code>npc_policy.onnx</code>. Unity автоматически импортирует его
        и создаст NNModel asset. Убедитесь, что установлены пакеты ML-Agents (com.unity.ml-agents)
        и Sentis (com.unity.sentis) через Package Manager.
      </p>
      <p className="text-muted-foreground leading-relaxed mt-3">
        После импорта кликните на .onnx файл в Project window. В Inspector вы увидите
        информацию о модели: входы, выходы, размеры тензоров. Убедитесь, что всё совпадает
        с вашей архитектурой.
      </p>
    </section>

    <section id="step4">
      <h2 className="text-2xl font-bold text-foreground mb-3">Шаг 4: Настройка Agent (~10 минут)</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Создайте C# скрипт для вашего NPC. Наблюдения (CollectObservations) должны точно
        соответствовать тому, что модель ожидает на входе. Действия (OnActionReceived) —
        тому, что модель возвращает.
      </p>
      <CyberCodeBlock language="csharp" filename="NPCAgent.cs">
{`using Unity.MLAgents;
using Unity.MLAgents.Actuators;
using Unity.MLAgents.Sensors;
using UnityEngine;

public class NPCAgent : Agent
{
    public float moveSpeed = 5f;
    public Transform target;
    private Rigidbody rb;

    public override void Initialize()
    {
        rb = GetComponent<Rigidbody>();
    }

    public override void CollectObservations(VectorSensor sensor)
    {
        // ВАЖНО: тот же порядок и количество, что при обучении!
        sensor.AddObservation(transform.localPosition);  // 3 float
        sensor.AddObservation(rb.velocity);               // 3 float
        sensor.AddObservation(
            (target.localPosition - transform.localPosition).normalized
        );                                                // 2 float (без Y)
        // Итого: 8 float = obs_size при обучении
    }

    public override void OnActionReceived(ActionBuffers actions)
    {
        float moveX = actions.ContinuousActions[0];
        float moveZ = actions.ContinuousActions[1];
        rb.AddForce(new Vector3(moveX, 0, moveZ) * moveSpeed);
    }
}`}
      </CyberCodeBlock>
      <p className="text-muted-foreground leading-relaxed mt-3">
        В Inspector на объекте NPC настройте компонент <strong className="text-foreground">Behavior Parameters</strong>:
        Behavior Type → <code className="text-primary">Inference Only</code>, Model → перетащите ваш NNModel,
        Inference Device → GPU (или CPU для мобильных).
      </p>
    </section>

    <section id="step5">
      <h2 className="text-2xl font-bold text-foreground mb-3">Шаг 5: Тест и сборка (~10 минут)</h2>
      <p className="text-muted-foreground leading-relaxed">
        Нажмите Play в Unity Editor. NPC должен начать действовать согласно обученной политике.
        Если он стоит на месте или ведёт себя странно — проверьте порядок наблюдений и масштаб
        действий. Когда всё работает — File → Build Settings → выберите платформу → Build.
      </p>
      <p className="text-muted-foreground leading-relaxed mt-3">
        Для мобильных платформ рекомендуется квантизация модели (Float16) для уменьшения
        размера и ускорения инференса. Для WebGL используйте CPU-бекенд Sentis.
        Для PC/Mac — GPU-бекенд для максимальной производительности.
      </p>
    </section>

    <section id="troubleshooting">
      <h2 className="text-2xl font-bold text-foreground mb-3">Частые проблемы</h2>
      <div className="space-y-4">
        <div className="p-4 rounded-lg border border-border/30 bg-card/40">
          <h4 className="font-semibold text-accent mb-1">❌ «The model does not match the brains»</h4>
          <p className="text-sm text-muted-foreground">
            Размер наблюдений в C# не совпадает с obs_size модели. Пересчитайте AddObservation:
            каждый Vector3 = 3 float, каждый float = 1. Сумма должна совпадать.
          </p>
        </div>
        <div className="p-4 rounded-lg border border-border/30 bg-card/40">
          <h4 className="font-semibold text-accent mb-1">❌ NPC не двигается</h4>
          <p className="text-sm text-muted-foreground">
            Проверьте: Behavior Type = Inference Only (не Heuristic), Model назначена,
            Decision Requester добавлен с Decision Period = 5.
          </p>
        </div>
        <div className="p-4 rounded-lg border border-border/30 bg-card/40">
          <h4 className="font-semibold text-accent mb-1">❌ NPC ведёт себя хаотично</h4>
          <p className="text-sm text-muted-foreground">
            Порядок наблюдений в C# отличается от порядка при обучении. CollectObservations
            должен добавлять данные в точно том же порядке.
          </p>
        </div>
      </div>
    </section>

    <section id="conclusion">
      <h2 className="text-2xl font-bold text-foreground mb-3">Заключение</h2>
      <p className="text-muted-foreground leading-relaxed">
        Деплой RL-модели — это не rocket science. PyTorch → ONNX → Unity Sentis → Build — четыре
        шага, 30 минут. Самое важное — аккуратно следить за соответствием наблюдений и действий
        между Python и C#. Когда пайплайн настроен один раз, итерации становятся быстрыми:
        переобучили модель → заменили .onnx файл → готово. Теперь ваши NPC по-настоящему умны.
      </p>
    </section>
  {/* Практика: собранная среда лаборатории для этой темы. */}
  <LabPracticeSection contextKey="/blog/jupyter-to-unity" />

  </BlogLayout>
);

export default BlogJupyterToUnity;
