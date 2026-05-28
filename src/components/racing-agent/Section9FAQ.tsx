import { useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  q: string;
  a: string | ReactNode;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    q: "Q1: mlagents-learn падает с ошибкой UnityEnvironment took too long to respond.",
    a: (
      <>
        Проверьте, что <code className="bg-muted/50 px-1 text-xs">Behavior Name</code> в инспекторе
        совпадает с ключом в YAML (<code className="bg-muted/50 px-1 text-xs">RacingCar</code>).
        Если используете билд — проверьте путь к{" "}
        <code className="bg-muted/50 px-1 text-xs">.exe</code>. Также убедитесь, что Python и Unity
        совместимы по версиям коммуникатора.
      </>
    ),
  },
  {
    q: "Q2: Cumulative Reward всё время около −1.0.",
    a: (
      <>
        Time penalty доминирует над всеми позитивными сигналами. Уменьшите{" "}
        <code className="bg-muted/50 px-1 text-xs">_timePenalty</code> до{" "}
        <code className="bg-muted/50 px-1 text-xs">-0.0001</code> или временно отключите его.
        Диагностический признак: 1000 шагов × −0.001 = −1.000 → ваш штраф слишком велик.
      </>
    ),
  },
  {
    q: "Q3: Агент ездит задом наперёд по трассе.",
    a: (
      <>
        Не хватает сигнала ориентации. Добавьте в{" "}
        <code className="bg-muted/50 px-1 text-xs">CollectObservations()</code> dot-product между
        forward машины и направлением на следующий чекпоинт, а в{" "}
        <code className="bg-muted/50 px-1 text-xs">OnCheckpointPassed</code> — штраф −0.1 за
        прохождение «неправильного» чекпоинта.
      </>
    ),
  },
  {
    q: "Q4: TensorBoard не показывает графики.",
    a: (
      <>
        Запустите <code className="bg-muted/50 px-1 text-xs">tensorboard --logdir results</code> именно
        из той папки, где лежит каталог{" "}
        <code className="bg-muted/50 px-1 text-xs">results/</code>. Убедитесь, что в YAML установлен{" "}
        <code className="bg-muted/50 px-1 text-xs">summary_freq: 10000</code> (или меньше) — иначе
        первая запись появится только через 10000 шагов.
      </>
    ),
  },
  {
    q: "Q5: Машина «дрожит» рулём.",
    a: (
      <>
        Увеличьте <code className="bg-muted/50 px-1 text-xs">Decision Period</code> в{" "}
        <code className="bg-muted/50 px-1 text-xs">DecisionRequester</code> до 5; либо включите
        smoothness penalty, но не превышайте{" "}
        <code className="bg-muted/50 px-1 text-xs">ρ = 0.0005</code>.
      </>
    ),
  },
  {
    q: "Q6: Что выбрать — PPO или SAC?",
    a: (
      <>
        Для овальной трассы и студенческого проекта —{" "}
        <strong className="text-foreground">PPO</strong>: стабильнее, проще настраивать, идеально
        масштабируется при параллельных аренах. Эмпирически (Savid et al. 2023) PPO быстрее
        (12.59 с/круг), SAC стабильнее (0 вылетов против 1).
      </>
    ),
  },
  {
    q: "Q7: Какая версия Unity и Python нужна?",
    a: (
      <>
        Для <strong className="text-foreground">release_22 (com.unity.ml-agents 3.0.0 final)</strong> —
        Unity 2023.2+. Для Unity 2022.3 LTS используйте{" "}
        <strong className="text-foreground">release_21 (3.0.0-exp.1)</strong>. Python во всех случаях —{" "}
        <strong className="text-foreground">3.10.12</strong>, PyTorch —{" "}
        <strong className="text-foreground">2.2.1</strong>. Для современных GPU RTX 50-й серии —
        расширенная спецификация (раздел 2).
      </>
    ),
  },
  {
    q: "Q8: ONNX-модель не работает после обучения.",
    a: (
      <>
        Скопируйте <code className="bg-muted/50 px-1 text-xs">RacingCar.onnx</code> из{" "}
        <code className="bg-muted/50 px-1 text-xs">results/{"<"}run-id{">"}/</code> в папку{" "}
        <code className="bg-muted/50 px-1 text-xs">Assets/ML-Models/</code>. В инспекторе{" "}
        <code className="bg-muted/50 px-1 text-xs">Behavior Parameters</code> укажите её в поле{" "}
        <code className="bg-muted/50 px-1 text-xs">Model</code>, переключите{" "}
        <code className="bg-muted/50 px-1 text-xs">Behavior Type</code> на{" "}
        <code className="bg-muted/50 px-1 text-xs">Inference Only</code>. Нажмите Play.
      </>
    ),
  },
  {
    q: "Q9: Можно ли использовать смешанные действия (continuous + discrete)?",
    a: (
      <>
        Технически — да: в Actions укажите и{" "}
        <code className="bg-muted/50 px-1 text-xs">Continuous Actions Size {">"} 0</code>, и{" "}
        <code className="bg-muted/50 px-1 text-xs">Discrete Branches {">"} 0</code>. Однако для
        нашей задачи (овал, плавное вождение){" "}
        <strong className="text-foreground">рекомендуется только continuous</strong> — это требование
        задания и физически правильнее.
      </>
    ),
  },
  {
    q: "Q10: Машина «улетает» в небо при ускорении.",
    a: (
      <>
        Типичная проблема при высоком{" "}
        <code className="bg-muted/50 px-1 text-xs">time_scale</code> и недостаточной массе.
        Опустите <code className="bg-muted/50 px-1 text-xs">centerOfMass</code> в{" "}
        <code className="bg-muted/50 px-1 text-xs">Awake</code> (как в{" "}
        <code className="bg-muted/50 px-1 text-xs">CarController.cs</code>), увеличьте массу
        Rigidbody до 1500 кг, добавьте угловое сопротивление{" "}
        <code className="bg-muted/50 px-1 text-xs">angularDrag = 5</code>.
      </>
    ),
  },
  {
    q: "Q11: При установке вылетает ошибка opset23 not found.",
    a: (
      <>
        Конфликт нового динамического экспортера PyTorch с парсером ML-Agents. Откройте файл{" "}
        <code className="bg-muted/50 px-1 text-xs">model_serialization.py</code> (раздел 2.7),
        найдите вызов{" "}
        <code className="bg-muted/50 px-1 text-xs">torch.onnx.export(...)</code> и добавьте
        аргумент <code className="bg-muted/50 px-1 text-xs">dynamo=False</code>.
      </>
    ),
  },
  {
    q: "Q12: Сыпятся ошибки Protobuf или StrictVersion.",
    a: (
      <>
        Закрепите версии:{" "}
        <code className="bg-muted/50 px-1 text-xs">pip install protobuf==3.20.3</code> и{" "}
        <code className="bg-muted/50 px-1 text-xs">pip install setuptools==65.5.0</code>.
      </>
    ),
  },
];

const FAQEntry = ({ item, defaultOpen = false }: { item: FAQItem; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        className="w-full text-left px-5 py-4 flex items-center justify-between gap-3 hover:bg-white/3 transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-foreground leading-snug">{item.q}</span>
        <ChevronDown
          className={`w-4 h-4 text-cyan-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-white/5 pt-3">
          {item.a}
        </div>
      )}
    </div>
  );
};

const Section9FAQ = () => (
  <div className="space-y-3">
    {FAQ_ITEMS.map((item, i) => (
      <FAQEntry key={i} item={item} defaultOpen={i === 0} />
    ))}
  </div>
);

export default Section9FAQ;
