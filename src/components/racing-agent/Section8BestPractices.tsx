import { Card } from "@/components/ui/card";
import CyberCodeBlock from "@/components/CyberCodeBlock";

const Section8BestPractices = () => (
  <div className="space-y-8">
    {/* 8.1 Параллельные арены */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">8.1. Параллельные тренировочные арены</h3>
      <p className="text-muted-foreground leading-relaxed">
        Разместите в сцене <strong className="text-foreground">8–16 копий</strong> овальной трассы
        (training area replicator появился в release 22) и добавьте на каждый автомобиль одинаковый{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">CarAgent</code> с одним и тем же{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">Behavior Name = "RacingCar"</code>.
        PPO агрегирует опыт со всех агентов в общий буфер и обучает одну общую модель.
      </p>
      <p className="text-sm text-muted-foreground">
        Из официальной документации ML-Agents: «Combining multiple training areas within the same scene,
        with concurrent Unity instances, effectively gives you two levels of parallelism to speed up training.»
        Пользователи на форумах Unity Discussions сообщают о <strong className="text-foreground">~2× ускорении
        при 8 параллельных средах</strong>; в идеальных условиях ускорение может быть линейным.
      </p>
    </div>

    {/* 8.2 Time scale */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">8.2. Time scale и физика</h3>
      <p className="text-muted-foreground leading-relaxed">
        ML-Agents по умолчанию выставляет{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">time_scale: 20</code> при обучении.
        Это <strong className="text-foreground">ускоряет симуляцию в 20 раз</strong>, но может ломать физику:
      </p>
      <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground leading-relaxed">
        <li>
          Если автомобиль «проваливается» сквозь стены — снизьте{" "}
          <code className="bg-muted/50 px-1 text-xs">--time-scale=10</code> или меньше
        </li>
        <li>
          Различия между обучением (time_scale = 20) и инференсом (time_scale = 1) — классический симптом
          проблем с фиксированным шагом физики
        </li>
        <li>
          Установите{" "}
          <code className="bg-muted/50 px-1 text-xs">Time.fixedDeltaTime = 0.02</code> в{" "}
          <strong className="text-foreground">Project Settings → Time</strong> и используйте{" "}
          <code className="bg-muted/50 px-1 text-xs">Continuous</code> коллизии на Rigidbody автомобиля
        </li>
      </ul>
    </div>

    {/* 8.3 Curriculum learning */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">8.3. Curriculum Learning</h3>
      <p className="text-muted-foreground leading-relaxed">
        Если на сложной трассе агент учится медленно, используйте подход из JulesVerny/MLAgentsAtSpa:{" "}
        начинать с короткой подтрассы (один-два чекпоинта) и постепенно увеличивать длину. В ML-Agents
        реализуется через секцию{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">environment_parameters</code> с{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">curriculum</code> в YAML.
      </p>
    </div>

    {/* 8.4 Imitation Learning */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">8.4. Imitation Learning для холодного старта</h3>
      <p className="text-muted-foreground leading-relaxed">
        Запишите 5–10 демонстраций ручного управления через Heuristic + Demo Recorder, затем включите
        Behavioral Cloning:
      </p>
      <CyberCodeBlock language="pseudo" filename="config/ppo_with_bc.yaml (фрагмент)">
{`behavioral_cloning:
  demo_path: Demos/HumanLaps.demo
  strength: 0.1                       # Не > 0.5: иначе агент копирует ошибки человека
  steps: 150000
  batch_size: 512
  num_epoch: 3`}
      </CyberCodeBlock>
      <p className="text-sm text-muted-foreground">
        Savid et al. 2023 показали, что для Karting Microgame{" "}
        <code className="bg-muted/50 px-1 text-xs">strength: 0.1</code> обгоняет{" "}
        <code className="bg-muted/50 px-1 text-xs">strength: 1.0</code> по итоговой награде.
      </p>
    </div>

    {/* 8.5 Расположение чекпоинтов */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">8.5. Расположение чекпоинтов</h3>
      <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground leading-relaxed">
        <li>
          <strong className="text-foreground">Расстояние между чекпоинтами:</strong> 5–15 м на овале.
          Слишком редкие → разреженная награда; слишком частые → reward hacking.
        </li>
        <li>
          <strong className="text-foreground">Ориентация чекпоинтов:</strong> forward-вектор каждого должен
          совпадать с правильным направлением движения. Используется в{" "}
          <code className="bg-muted/50 px-1 text-xs">GetNextCheckpointForward()</code> и косвенно — в
          dot-product-наблюдении.
        </li>
      </ul>
    </div>

    {/* 8.6 Decision Period */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">8.6. Decision Period</h3>
      <p className="text-muted-foreground leading-relaxed">
        Параметр{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">Decision Period</code> компонента{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">DecisionRequester</code> контролирует,
        как часто запрашивается решение.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-500/20 bg-red-500/5 p-4">
          <p className="text-sm font-semibold text-red-300 mb-1">Decision Period = 1</p>
          <p className="text-xs text-muted-foreground">
            Агент часто переключает руль — «дрожание» управления
          </p>
        </Card>
        <Card className="border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="text-sm font-semibold text-emerald-300 mb-1">Decision Period = 3–5</p>
          <p className="text-xs text-muted-foreground">
            Оптимально для гонок: агент видит результат предыдущего действия
          </p>
        </Card>
        <Card className="border-orange-500/20 bg-orange-500/5 p-4">
          <p className="text-sm font-semibold text-orange-300 mb-1">Decision Period = 10</p>
          <p className="text-xs text-muted-foreground">
            Реакция запаздывает на резких поворотах
          </p>
        </Card>
      </div>
    </div>
  </div>
);

export default Section8BestPractices;
