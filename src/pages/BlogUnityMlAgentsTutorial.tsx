import BlogLayout from "@/components/BlogLayout";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import { blogPosts } from "@/pages/Blog";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const post = blogPosts.find((p) => p.slug === "unity-ml-agents-tutorial")!;

const toc = [
  { id: "what-is", title: "Что такое Unity ML-Agents" },
  { id: "requirements", title: "Требования и версии" },
  { id: "install", title: "Шаг 1. Установка PyTorch и ML-Agents" },
  { id: "unity-setup", title: "Шаг 2. Настройка Unity-проекта" },
  { id: "agent-script", title: "Шаг 3. Скрипт агента на C#" },
  { id: "reward", title: "Шаг 4. Reward shaping" },
  { id: "config", title: "Шаг 5. Конфиг обучения (PPO)" },
  { id: "training", title: "Шаг 6. Запуск обучения" },
  { id: "tensorboard", title: "Шаг 7. Чтение метрик" },
  { id: "inference", title: "Шаг 8. Инференс обученной модели" },
  { id: "troubleshooting", title: "Типичные ошибки" },
  { id: "next", title: "Что дальше" },
];

const Step = ({ n, title, children }: { n: number; title: string; children: React.ReactNode }) => (
  <div className="flex items-start gap-3">
    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm border border-primary/30">
      {n}
    </span>
    <div>
      <strong className="text-foreground">{title}</strong>
      <div className="mt-1 text-muted-foreground">{children}</div>
    </div>
  </div>
);

const BlogUnityMlAgentsTutorial = () => (
  <BlogLayout post={post} toc={toc}>
    <section id="what-is">
      <h2 className="text-2xl font-bold text-foreground mb-3">Что такое Unity ML-Agents</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Unity ML-Agents Toolkit — это связка между игровой сценой Unity и Python-обучением
        на PyTorch. Unity выступает средой (environment): каждый шаг она отдаёт агенту
        наблюдения и награду, а получает обратно действия. Python-часть держит нейросеть
        и обновляет её алгоритмом PPO или SAC. После обучения сеть экспортируется
        в <code className="text-primary">.onnx</code> и работает уже внутри билда — Python не нужен.
      </p>
      <div className="grid gap-3 md:grid-cols-3 mb-2">
        {[
          { t: "Unity (C#)", d: "Сцена, физика, сенсоры, награды. Компоненты Agent, Behavior Parameters, Decision Requester." },
          { t: "Python (PyTorch)", d: "Пакет mlagents: PPO/SAC, буфер траекторий, оптимизация политики, логи TensorBoard." },
          { t: "ONNX", d: "Результат обучения. Инференс через Unity Inference Engine прямо в билде игры." },
        ].map((c) => (
          <Card key={c.t} className="bg-card/60 backdrop-blur-sm border-primary/30 hover:shadow-glow-cyan transition-all">
            <CardContent className="p-4">
              <h3 className="font-semibold text-primary mb-1">{c.t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.d}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>

    <section id="requirements">
      <h2 className="text-2xl font-bold text-foreground mb-3">Требования и версии</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Несовпадение версий — причина большинства ошибок на старте. Рабочая связка:
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-primary/20 rounded-lg overflow-hidden">
          <thead className="bg-primary/10">
            <tr>
              <th className="text-left p-3 text-foreground">Компонент</th>
              <th className="text-left p-3 text-foreground">Версия</th>
              <th className="text-left p-3 text-foreground">Комментарий</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            {[
              ["Unity Editor", "2022.3 LTS или новее", "LTS стабильнее для长 обучения"],
              ["ML-Agents (Unity package)", "com.unity.ml-agents 4.0.x", "ставится через Package Manager"],
              ["ML-Agents (Python)", "mlagents 1.1.x", "pip, строго в отдельном окружении"],
              ["Python", "3.10.x", "3.11+ часто ломает зависимости mlagents"],
              ["PyTorch", "2.x", "ставится ДО mlagents"],
              ["Инференс в билде", "com.unity.ai.inference", "бывший Barracuda → Sentis"],
            ].map((r) => (
              <tr key={r[0]} className="border-t border-primary/10">
                <td className="p-3 text-foreground">{r[0]}</td>
                <td className="p-3 font-mono text-primary">{r[1]}</td>
                <td className="p-3">{r[2].replace("长 ", "долгого ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <section id="install">
      <h2 className="text-2xl font-bold text-foreground mb-3">Шаг 1. Установка PyTorch и ML-Agents</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Всегда отдельное окружение conda и PyTorch <strong className="text-foreground">до</strong> mlagents:
        иначе pip подтянет CPU-сборку torch поверх вашей CUDA-версии.
      </p>
      <CyberCodeBlock language="bash" filename="setup.sh">
{`# 1. Отдельное окружение
conda create -n mlagents python=3.10 -y
conda activate mlagents

# 2. Сначала PyTorch (CUDA 12.1; для CPU уберите --index-url)
pip install torch --index-url https://download.pytorch.org/whl/cu121

# 3. Потом ML-Agents
pip install mlagents==1.1.0

# 4. Проверка
mlagents-learn --help
python -c "import torch; print(torch.__version__, torch.cuda.is_available())"`}
      </CyberCodeBlock>
      <p className="text-muted-foreground leading-relaxed mt-4">
        Подробный разбор окружения и частых конфликтов зависимостей — в разделе{" "}
        <Link to="/unity-ml-agents" className="text-primary hover:underline">Unity ML-Agents</Link>,
        база по PyTorch — в{" "}
        <Link to="/pytorch/cheatsheet" className="text-primary hover:underline">шпаргалке PyTorch</Link>.
      </p>
    </section>

    <section id="unity-setup">
      <h2 className="text-2xl font-bold text-foreground mb-3">Шаг 2. Настройка Unity-проекта</h2>
      <div className="space-y-4 mb-4">
        <Step n={1} title="Создайте 3D-проект">
          Unity Hub → New Project → 3D (Built-in или URP — обе работают).
        </Step>
        <Step n={2} title="Добавьте пакет ML-Agents">
          Window → Package Manager → «+» → Add package by name →{" "}
          <code className="text-primary">com.unity.ml-agents</code>.
        </Step>
        <Step n={3} title="Соберите сцену">
          Plane (пол), Cube с Rigidbody (агент), Sphere (цель). Агенту добавьте
          компоненты <em>Behavior Parameters</em>, <em>Decision Requester</em> и ваш скрипт.
        </Step>
        <Step n={4} title="Заполните Behavior Parameters">
          Behavior Name = <code className="text-primary">RollerBall</code>, Space Size = 8,
          Continuous Actions = 2. Эти числа должны точно совпадать с кодом агента.
        </Step>
      </div>
    </section>

    <section id="agent-script">
      <h2 className="text-2xl font-bold text-foreground mb-3">Шаг 3. Скрипт агента на C#</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Агент реализует три метода: <code className="text-primary">OnEpisodeBegin</code> (сброс эпизода),{" "}
        <code className="text-primary">CollectObservations</code> (что видит агент) и{" "}
        <code className="text-primary">OnActionReceived</code> (что он делает и какую награду получает).
      </p>
      <CyberCodeBlock language="csharp" filename="RollerAgent.cs">
{`using UnityEngine;
using Unity.MLAgents;
using Unity.MLAgents.Actuators;
using Unity.MLAgents.Sensors;

public class RollerAgent : Agent
{
    public Transform target;
    public float forceMultiplier = 10f;

    private Rigidbody rb;

    public override void Initialize()
    {
        rb = GetComponent<Rigidbody>();
    }

    public override void OnEpisodeBegin()
    {
        // Агент упал с платформы — сбрасываем физику и позицию
        if (transform.localPosition.y < 0f)
        {
            rb.angularVelocity = Vector3.zero;
            rb.velocity = Vector3.zero;
            transform.localPosition = new Vector3(0f, 0.5f, 0f);
        }

        // Цель — в случайной точке платформы (рандомизация против переобучения)
        target.localPosition = new Vector3(
            Random.value * 8f - 4f, 0.5f, Random.value * 8f - 4f);
    }

    public override void CollectObservations(VectorSensor sensor)
    {
        sensor.AddObservation(target.localPosition);  // 3
        sensor.AddObservation(transform.localPosition); // 3
        sensor.AddObservation(rb.velocity.x);           // 1
        sensor.AddObservation(rb.velocity.z);           // 1
        // Итого 8 — ровно Space Size в Behavior Parameters
    }

    public override void OnActionReceived(ActionBuffers actions)
    {
        var move = new Vector3(
            actions.ContinuousActions[0], 0f, actions.ContinuousActions[1]);
        rb.AddForce(move * forceMultiplier);

        float distance = Vector3.Distance(
            transform.localPosition, target.localPosition);

        if (distance < 1.42f)          // достиг цели
        {
            SetReward(1.0f);
            EndEpisode();
        }
        else if (transform.localPosition.y < 0f)  // упал
        {
            SetReward(-1.0f);
            EndEpisode();
        }
        else
        {
            AddReward(-0.001f);        // штраф за время
        }
    }

    // Ручное управление для отладки среды без обучения
    public override void Heuristic(in ActionBuffers actionsOut)
    {
        var c = actionsOut.ContinuousActions;
        c[0] = Input.GetAxis("Horizontal");
        c[1] = Input.GetAxis("Vertical");
    }
}`}
      </CyberCodeBlock>
      <p className="text-muted-foreground leading-relaxed mt-4">
        Перед обучением поставьте Behavior Type = <em>Heuristic Only</em> и поиграйте
        клавишами: если среда не проходима руками, нейросеть её тоже не решит.
      </p>
    </section>

    <section id="reward">
      <h2 className="text-2xl font-bold text-foreground mb-3">Шаг 4. Reward shaping</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Награда — это спецификация задачи. Правила, которые экономят дни обучения:
      </p>
      <ul className="space-y-2 text-muted-foreground mb-4 list-disc pl-5">
        <li><strong className="text-foreground">Держите награды в диапазоне [-1, 1].</strong> Большие значения раскачивают value-функцию.</li>
        <li><strong className="text-foreground">Один терминальный сигнал.</strong> +1 за успех, −1 за провал, всё остальное — мелкие подсказки.</li>
        <li><strong className="text-foreground">Штраф за время</strong> порядка <code className="text-primary">-1 / MaxStep</code>: агент учится решать быстрее, а не стоять.</li>
        <li><strong className="text-foreground">Осторожно с dense-наградой за сближение.</strong> Награда за уменьшение дистанции ускоряет старт, но провоцирует «кружение» рядом с целью.</li>
        <li><strong className="text-foreground">Не смешивайте SetReward и AddReward</strong> в одном кадре: SetReward перезаписывает накопленное за шаг.</li>
      </ul>
      <CyberCodeBlock language="csharp" filename="ShapedReward.cs">
{`// Dense-подсказка: награда за прогресс к цели, а не за близость
float d = Vector3.Distance(transform.localPosition, target.localPosition);
AddReward((prevDistance - d) * 0.05f);   // прогресс
AddReward(-1f / MaxStep);                // штраф за время
prevDistance = d;`}
      </CyberCodeBlock>
    </section>

    <section id="config">
      <h2 className="text-2xl font-bold text-foreground mb-3">Шаг 5. Конфиг обучения (PPO)</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Файл YAML описывает алгоритм и гиперпараметры. Имя поведения в конфиге обязано
        совпадать с Behavior Name в Unity.
      </p>
      <CyberCodeBlock language="yaml" filename="config/rollerball.yaml">
{`behaviors:
  RollerBall:
    trainer_type: ppo
    hyperparameters:
      batch_size: 1024
      buffer_size: 10240      # кратно batch_size
      learning_rate: 3.0e-4
      beta: 5.0e-3            # вес энтропии (исследование)
      epsilon: 0.2            # clipping PPO
      lambd: 0.95             # GAE
      num_epoch: 3
      learning_rate_schedule: linear
    network_settings:
      normalize: true         # обязательно для непрерывных наблюдений
      hidden_units: 128
      num_layers: 2
    reward_signals:
      extrinsic:
        gamma: 0.99
        strength: 1.0
    max_steps: 500000
    time_horizon: 64
    summary_freq: 10000`}
      </CyberCodeBlock>
      <p className="text-muted-foreground leading-relaxed mt-4">
        В ML-Agents 4.0.x поле <code className="text-primary">encoding_size</code> удалено — если оно
        осталось от старого гайда, обучение упадёт на валидации конфига. При использовании
        памяти (LSTM) <code className="text-primary">memory_size</code> должен делиться на 2.
        Теория PPO с выводом clipped objective — в разделе{" "}
        <Link to="/algorithms/ppo" className="text-primary hover:underline">PPO</Link>.
      </p>
    </section>

    <section id="training">
      <h2 className="text-2xl font-bold text-foreground mb-3">Шаг 6. Запуск обучения</h2>
      <CyberCodeBlock language="bash" filename="train.sh">
{`# 1. Запускаем тренер и ждём подключения редактора
mlagents-learn config/rollerball.yaml --run-id=roller_01

# 2. Нажимаем Play в Unity — обучение стартует

# Продолжить прерванный запуск
mlagents-learn config/rollerball.yaml --run-id=roller_01 --resume

# Перезаписать существующий run-id
mlagents-learn config/rollerball.yaml --run-id=roller_01 --force

# Быстрее в разы: обучение на собранном билде без окна редактора
mlagents-learn config/rollerball.yaml --run-id=roller_02 \\
  --env=builds/RollerBall --num-envs=8 --no-graphics --time-scale=20`}
      </CyberCodeBlock>
      <p className="text-muted-foreground leading-relaxed mt-4">
        Обучение в редакторе удобно для отладки, но медленно. Как только среда работает,
        собирайте билд и запускайте параллельные среды — на CPU это даёт кратное ускорение.
      </p>
    </section>

    <section id="tensorboard">
      <h2 className="text-2xl font-bold text-foreground mb-3">Шаг 7. Чтение метрик</h2>
      <CyberCodeBlock language="bash" filename="tensorboard.sh">
{`tensorboard --logdir results --port 6006`}
      </CyberCodeBlock>
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-sm border border-secondary/30 rounded-lg overflow-hidden">
          <thead className="bg-secondary/10">
            <tr>
              <th className="text-left p-3 text-foreground">Метрика</th>
              <th className="text-left p-3 text-foreground">Что значит</th>
              <th className="text-left p-3 text-foreground">Норма</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            {[
              ["Environment/Cumulative Reward", "Средняя награда за эпизод", "Устойчиво растёт"],
              ["Environment/Episode Length", "Длина эпизода", "Падает, если задача — «дойти быстрее»"],
              ["Losses/Policy Loss", "Изменение политики", "Небольшие колебания около нуля"],
              ["Losses/Value Loss", "Ошибка предсказания ценности", "Растёт в начале, затем снижается"],
              ["Policy/Entropy", "Степень исследования", "Плавно падает; резкий обвал = преждевременная сходимость"],
            ].map((r) => (
              <tr key={r[0]} className="border-t border-secondary/20">
                <td className="p-3 font-mono text-secondary text-xs">{r[0]}</td>
                <td className="p-3">{r[1]}</td>
                <td className="p-3">{r[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-muted-foreground leading-relaxed mt-4">
        Разбор диагностики по графикам — в уроке{" "}
        <Link to="/courses/2-6" className="text-primary hover:underline">2.6 «Мониторинг обучения»</Link>.
      </p>
    </section>

    <section id="inference">
      <h2 className="text-2xl font-bold text-foreground mb-3">Шаг 8. Инференс обученной модели</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        После обучения файл появится в{" "}
        <code className="text-primary">results/roller_01/RollerBall.onnx</code>. Перетащите его
        в <code className="text-primary">Assets/Models/</code>, укажите в поле Model компонента
        Behavior Parameters и переключите Behavior Type в <em>Inference Only</em>. Python больше
        не нужен: модель исполняется через Unity Inference Engine (<code className="text-primary">com.unity.ai.inference</code>).
      </p>
      <CyberCodeBlock language="python" filename="export_check.py">
{`import onnx

model = onnx.load("results/roller_01/RollerBall.onnx")
onnx.checker.check_model(model)
print("opset:", model.opset_import[0].version)   # 9 или 11 для ML-Agents
print("inputs:", [i.name for i in model.graph.input])
print("outputs:", [o.name for o in model.graph.output])`}
      </CyberCodeBlock>
      <p className="text-muted-foreground leading-relaxed mt-4">
        Полный пайплайн экспорта своей PyTorch-модели (не обученной тренером ML-Agents) —
        в статье{" "}
        <Link to="/blog/onnx-sentis-pipeline" className="text-primary hover:underline">
          PyTorch → ONNX → Unity Sentis
        </Link>.
      </p>
    </section>

    <section id="troubleshooting">
      <h2 className="text-2xl font-bold text-foreground mb-3">Типичные ошибки</h2>
      <Accordion type="single" collapsible className="w-full">
        {[
          {
            q: "Couldn't connect to trainer on port 5004",
            a: "Тренер не запущен или уже занят другим процессом. Запустите mlagents-learn ДО нажатия Play; если порт занят, добавьте --base-port=5010.",
          },
          {
            q: "Vector observation size mismatch",
            a: "Число значений в CollectObservations не совпадает со Space Size в Behavior Parameters. Пересчитайте: Vector3 = 3 значения, float = 1.",
          },
          {
            q: "Unknown field 'encoding_size' in config",
            a: "Поле удалено в ML-Agents 4.0.x. Уберите его из YAML — размер сети задаётся hidden_units и num_layers.",
          },
          {
            q: "Награда стоит на месте с самого старта",
            a: "Проверьте среду в Heuristic Only: возможно, цель недостижима, эпизод не завершается или MaxStep равен нулю. Затем поднимите beta — агенту не хватает исследования.",
          },
          {
            q: "Обучение идёт, но агент «дрожит» на месте",
            a: "Классический признак dense-награды за близость к цели. Замените её наградой за прогресс (разность дистанций) и добавьте штраф за время.",
          },
          {
            q: "Обучение очень медленное",
            a: "Не обучайтесь в редакторе: соберите билд и запустите с --num-envs=8 --no-graphics --time-scale=20.",
          },
        ].map((item) => (
          <AccordionItem key={item.q} value={item.q} className="border-primary/20">
            <AccordionTrigger className="text-left text-foreground hover:text-primary">{item.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>

    <section id="next">
      <h2 className="text-2xl font-bold text-foreground mb-3">Что дальше</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {[
          { to: "/courses/1-1", t: "Курс с нуля", d: "Уровень 1: MDP, награды, первый агент шаг за шагом." },
          { to: "/unity-ml-agents", t: "Раздел Unity ML-Agents", d: "Установка, сенсоры, конфиги, версии пакетов." },
          { to: "/unity-projects/food-collector", t: "Проект Food Collector", d: "Готовая среда: REINFORCE, ONNX-экспорт, разбор кода." },
          { to: "/algorithms/ppo", t: "Теория PPO", d: "Clipped objective, GAE, подбор гиперпараметров." },
        ].map((c) => (
          <Link key={c.to} to={c.to}>
            <Card className="h-full bg-card/60 backdrop-blur-sm border-secondary/30 hover:shadow-glow-purple transition-all">
              <CardContent className="p-4">
                <h3 className="font-semibold text-secondary mb-1">{c.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.d}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  </BlogLayout>
);

export default BlogUnityMlAgentsTutorial;
