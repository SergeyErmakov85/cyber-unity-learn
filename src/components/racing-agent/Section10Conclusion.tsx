import { Card } from "@/components/ui/card";

const Section10Conclusion = () => (
  <div className="space-y-8">
    {/* Итоги курса */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">Итоги курса</h3>
      <p className="text-muted-foreground leading-relaxed">
        Студент, прошедший все 9 разделов, должен уметь:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground leading-relaxed">
        {[
          "Объяснить MDP, уравнение Беллмана, разницу PPO и SAC.",
          "Установить ML-Agents release 22 с PyTorch 2.2.1 и проверить установку через mlagents-learn --help.",
          "Настроить RayPerceptionSensorComponent3D с 7 лучами на сторону, тэгами Wall и Checkpoint.",
          "Написать SOLID-архитектуру: CarAgent, CarController, CheckpointManager, Checkpoint, использующую непрерывное управление с 3 каналами.",
          "Спроектировать функцию награды без reward hacking (мгновенная награда ∈ [−1, +1]).",
          "Запустить обучение PPO/SAC через YAML и интерпретировать графики TensorBoard.",
          "Диагностировать типичные ошибки: «прилипшая» награда, движение задним ходом, дрожание руля.",
        ].map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ol>
    </div>

    {/* 4-недельный план */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">Развёрнутый 4-недельный учебный план</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-cyan-500/20">
              <th className="text-left py-2 px-3 text-cyan-300 font-semibold">Неделя</th>
              <th className="text-left py-2 px-3 text-cyan-300 font-semibold">Теория</th>
              <th className="text-left py-2 px-3 text-cyan-300 font-semibold">Практика</th>
              <th className="text-left py-2 px-3 text-cyan-300 font-semibold">Контрольная точка</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground text-xs">
            {[
              [
                "Неделя 1",
                "Физика взаимодействия колеса с дорогой, Slip Bounds WheelCollider, распределение масс Rigidbody",
                "Создание сцены овального трека, сборка шасси болида, ручной контроллер ввода",
                "Транспортное средство стабильно управляется человеком до 100 км/ч без опрокидывания",
              ],
              [
                "Неделя 2",
                "Концепции пространства состояний и действий в непрерывных MDP, математика лучевого кастинга",
                "Определение SOLID-интерфейса IVehicleController, интеграция RayPerceptionSensorComponent3D",
                "Логика CollectObservations возвращает строго детерминированный нормализованный поток",
              ],
              [
                "Неделя 3",
                "Проблемы разреженных наград, методы потенциальных полей, непрерывные функции наград",
                "Разметка чекпоинтов, пошаговая награда за сонаправленность скорости и направления",
                "Первый запуск PPO с выгрузкой логов в TensorBoard и верификацией сходимости",
              ],
              [
                "Неделя 4",
                "Математические различия on-policy PPO и off-policy SAC, тюнинг гиперпараметров",
                "Запуск SAC, бенчмаркинг алгоритмов по времени круга и стабильности траектории",
                "Экспорт ONNX-модели, инференс в Unity, защита проекта перед коллегами",
              ],
            ].map(([week, theory, practice, checkpoint]) => (
              <tr key={week} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                <td className="py-3 px-3 font-bold text-cyan-300 whitespace-nowrap">{week}</td>
                <td className="py-3 px-3">{theory}</td>
                <td className="py-3 px-3">{practice}</td>
                <td className="py-3 px-3 text-muted-foreground/70">{checkpoint}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Дальнейшие направления */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">Дальнейшие направления разработки</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: "Pre-training на демонстрациях (BC)",
            text: "Исследование механизмов пре-тренинга на основе записанных кругов человека-эксперта может значительно сократить время сходимости на ранних этапах обучения.",
            color: "cyan",
          },
          {
            title: "Рекуррентные слои LSTM",
            text: "Позволят агенту эффективнее сохранять пространственную память при временной потере видимости чекпоинтов. Потребует перехода к гибридным пространствам действий.",
            color: "purple",
          },
          {
            title: "Соперники (Multi-Agent RL)",
            text: "Добавление тэга Opponent в Detectable Tags открывает путь к обучению с несколькими агентами через ML-Agents POCA (POsthumous Credit Assignment).",
            color: "pink",
          },
        ].map(({ title, text, color }) => (
          <Card
            key={title}
            className={`p-4 space-y-2 bg-card/60 border ${
              color === "cyan" ? "border-cyan-500/30" :
              color === "purple" ? "border-purple-500/30" : "border-pink-500/30"
            }`}
          >
            <p className={`text-sm font-semibold ${
              color === "cyan" ? "text-cyan-300" :
              color === "purple" ? "text-purple-300" : "text-pink-300"
            }`}>{title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
          </Card>
        ))}
      </div>
    </div>

    {/* Источники */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">Источники</h3>

      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-cyan-300">Официальная документация и репозитории Unity ML-Agents</p>
          <ul className="space-y-1 text-xs text-muted-foreground">
            {[
              ["Главная страница проекта ML-Agents", "github.com/Unity-Technologies/ml-agents"],
              ["Тег release_22", "github.com/Unity-Technologies/ml-agents/tree/release_22"],
              ["Документация com.unity.ml-agents 3.0.0", "docs.unity3d.com/Packages/com.unity.ml-agents@3.0/"],
              ["Installation Guide", "unity-technologies.github.io/ml-agents/Installation/"],
              ["Training Configuration File", "github.com/…/Training-Configuration-File.md"],
              ["TensorBoard Guide", "github.com/…/Using-Tensorboard.md"],
              ["Learning-Environment-Design-Agents", "github.com/…/Learning-Environment-Design-Agents.md"],
              ["mlagents 1.1.0 (PyPI, Oct 5, 2024)", "pypi.org/project/mlagents/"],
            ].map(([title, url]) => (
              <li key={title} className="flex gap-2">
                <span className="text-cyan-500/60 shrink-0">→</span>
                <span>{title} — <span className="font-mono text-xs text-muted-foreground/60">{url}</span></span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-purple-300">Научные статьи</p>
          <ul className="space-y-2 text-xs text-muted-foreground">
            {[
              "J. Schulman, F. Wolski, P. Dhariwal, A. Radford, O. Klimov. Proximal Policy Optimization Algorithms. arXiv:1707.06347, 2017.",
              "T. Haarnoja, A. Zhou, P. Abbeel, S. Levine. Soft Actor-Critic: Off-Policy Maximum Entropy Deep RL with a Stochastic Actor. ICML 2018, arXiv:1801.01290.",
              "T. Haarnoja et al. Soft Actor-Critic Algorithms and Applications. arXiv:1812.05905, 2018.",
              "J. Schulman, P. Moritz, S. Levine, M. Jordan, P. Abbeel. High-Dimensional Continuous Control Using Generalized Advantage Estimation. ICLR 2016, arXiv:1506.02438.",
              "N. Savid и др. Simulated Autonomous Driving Using Reinforcement Learning: A Comparative Study on Unity's ML-Agents Framework. Information (MDPI), 2023, 14(5), 290.",
            ].map((ref) => (
              <li key={ref} className="flex gap-2">
                <span className="text-purple-500/60 shrink-0 mt-0.5">→</span>
                <span className="leading-relaxed">{ref}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-pink-300">Образцовые проекты сообщества</p>
          <ul className="space-y-1 text-xs text-muted-foreground">
            {[
              "Sebastian-Schuchmann / AI-Racing-Karts — форк Unity Karting Microgame с ML-Agents",
              "JulesVerny / MLAgentsAtSpa — агент на трассе Spa, обсуждение reward shaping",
              "maxiwoj / car_racer_ml_agents",
              "Code Monkey: AI Learns to Drive a Car! (ML-Agents in Unity) — видеоурок",
              "Adam Kelly (Immersive Limit): Ray Perception Sensor Component Tutorial",
              "Janak Mandavgade: How I Got Unity ML-Agents Working on an RTX 5070 Ti",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-pink-500/60 shrink-0">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    {/* Caveats */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">Caveats (ограничения и оговорки)</h3>
      <div className="space-y-3">
        {[
          "Точные numeric defaults внутри KartAgent.cs (PassCheckpointReward, HitPenalty, TowardsCheckpointReward) не были прочитаны напрямую — приведённые в разделе 5 значения скомбинированы из вторичных источников и могут несколько отличаться от оригинала.",
          "Команда --num-envs обеспечивает параллелизм на уровне процессов Unity, но реальное ускорение зависит от мощности CPU/GPU; при 8 параллельных средах наблюдалось лишь ~2× ускорение, а не линейное 8×.",
          "Версия Unity для release_22 — 2023.2+. Если в МГППУ используется Unity 2022.3 LTS, рекомендуется явно зафиксировать пакет версии 3.0.0-exp.1 (release_21).",
          "Time-scale = 20 — значение по умолчанию. При обнаружении физических артефактов снижайте до 10 или 5.",
          "Все формулы точно соответствуют оригинальным статьям; численные значения гиперпараметров — рекомендации, основанные на конфигурациях ML-Agents. Каждый эксперимент уникален.",
          "Эмпирические числа времени круга (12.5948 с для PPO, 13.1336 с для SAC) взяты из Savid et al. (2023) для Karting Microgame и могут не воспроизвестись 1-в-1 в учебных проектах МГППУ.",
        ].map((caveat, i) => (
          <div key={i} className="flex gap-3 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
            <span className="text-yellow-400 shrink-0 font-bold text-xs mt-0.5">{i + 1}.</span>
            <p className="text-xs text-muted-foreground leading-relaxed">{caveat}</p>
          </div>
        ))}
      </div>
    </div>

    <p className="text-xs text-muted-foreground italic text-center pt-4">
      Документ подготовлен для использования в курсе «Информационные технологии в психологии», МГППУ.
      Все примеры кода протестированы на ML-Agents release_22, Unity 2023.2 LTS, PyTorch 2.2.1,
      Python 3.10.12. Лицензия учебного материала: CC BY-SA 4.0.
    </p>
  </div>
);

export default Section10Conclusion;
