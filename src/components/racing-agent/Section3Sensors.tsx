import { Card } from "@/components/ui/card";
import Math from "@/components/Math";
import HubLink from "@/components/math-rl/HubLink";

const Section3Sensors = () => (
  <div className="space-y-8">
    {/* 3.1 Что такое RayPerceptionSensorComponent3D */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">3.1. Что такое RayPerceptionSensorComponent3D</h3>
      <p className="text-muted-foreground leading-relaxed">
        <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">RayPerceptionSensorComponent3D</code> —
        компонент, испускающий из объекта агента набор <strong className="text-foreground">лучей</strong>{" "}
        (raycasts) в заданных углах. Каждый луч возвращает: (1) попал ли он в объект с одним из
        «detectable tags», (2) на какой нормированной дистанции{" "}
        <Math display={false}>{String.raw`\in[0,1]`}</Math>, (3) one-hot вектор обнаруженного тэга.
        Это — основа восприятия гоночного агента, виртуальный «LIDAR» автомобиля.
      </p>
      <p className="text-muted-foreground leading-relaxed">
        Размер вектора наблюдений, генерируемого RayPerceptionSensor:
      </p>
      <Math>{String.raw`\text{ObsSize} = (\text{ObservationStacks}) \times (1 + 2 \cdot \text{RaysPerDirection}) \times (\text{NumDetectableTags} + 2).`}</Math>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Каждый луч сенсора генерирует набор признаков, включающий <strong className="text-foreground">расстояние до
        точки контакта</strong> (нормализованное от 0 до 1), <strong className="text-foreground">факт обнаружения
        объекта</strong> с определённым тегом (one-hot) и нормаль поверхности столкновения.
      </p>
    </div>

    {/* 3.2 Учебный профиль */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">
        3.2. Рекомендуемая настройка для овальной трассы (учебный профиль)
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-cyan-500/20">
              <th className="text-left py-2 px-3 text-cyan-300 font-semibold">Параметр</th>
              <th className="text-left py-2 px-3 text-cyan-300 font-semibold">Значение</th>
              <th className="text-left py-2 px-3 text-cyan-300 font-semibold">Обоснование</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            {[
              ["Rays Per Direction",     "7",               "1 центральный + 7 слева + 7 справа = 15 лучей"],
              ["Max Ray Degrees",        "90",              "Сектор 180° впереди (по 90° в каждую сторону)"],
              ["Sphere Cast Radius",     "0.5",             "Сферический луч толерантнее к тонким мешам стен"],
              ["Ray Length",             "20.0",            "Достаточно, чтобы агент «увидел» поворот заранее"],
              ["Start Vertical Offset",  "0.5",             "Лучи стартуют чуть выше центра кузова"],
              ["End Vertical Offset",    "0.0",             "Лучи идут параллельно земле"],
              ["Detectable Tags",        "Wall, Checkpoint","Стены и чекпоинты"],
              ["Stacked Raycasts",       "3",               "Стек кадров даёт временной контекст"],
            ].map(([param, val, note]) => (
              <tr key={param} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                <td className="py-2 px-3 font-medium text-foreground/80 font-mono text-xs">{param}</td>
                <td className="py-2 px-3 font-bold text-cyan-300">{val}</td>
                <td className="py-2 px-3">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Card className="border-purple-500/20 bg-purple-500/5 p-4">
        <p className="text-sm text-purple-200">
          <strong>Пояснение по углам</strong> (Adam Kelly, immersivelimit.com):{" "}
          «Max Ray Degrees specifies the angle at which to spread out the raycasts. A value of 60 degrees
          will result in rays spread over 30 degrees to the left and right of the center line.»
          При значении 90° сектор покрывает по 45° в каждую сторону.
        </p>
      </Card>
    </div>

    {/* 3.3 Высокоскоростной профиль */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">
        3.3. Альтернативная высокоскоростная конфигурация (продвинутый профиль)
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        Для гоночных сценариев с высокими скоростями ({">"}100 км/ч) и наличием соперников на трассе
        разработана специализированная пространственная конфигурация, оптимизированная под упреждающее
        планирование траектории и контроль в заносе:
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-cyan-500/20">
              <th className="text-left py-2 px-3 text-cyan-300 font-semibold">Параметр</th>
              <th className="text-left py-2 px-3 text-cyan-300 font-semibold">Значение</th>
              <th className="text-left py-2 px-3 text-cyan-300 font-semibold">Функциональное обоснование</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            {[
              ["Detectable Tags",      "Barrier, Checkpoint, Opponent", "Физические границы, триггеры круга, соперники"],
              ["Rays Per Direction",   "6",                             "Генерирует 13 лучей (1 центральный + по 6 с каждого борта)"],
              ["Max Ray Degrees",      "75.0",                          "Равномерная веерная развёртка в секторе 150°"],
              ["Sphere Cast Radius",   "0.25",                          "Предотвращает пропуски тонких швов коллайдеров"],
              ["Ray Length",           "45.0",                          "Дальнодействие для упреждающего торможения"],
              ["Observation Stacks",   "2",                             "Два кадра для улавливания динамики изменения расстояний"],
              ["Start Vertical Offset","0.1",                           "Исключает ложные срабатывания от дорожного полотна"],
              ["End Vertical Offset",  "0.0",                           "Направление сканирования параллельно плоскости трека"],
            ].map(([param, val, note]) => (
              <tr key={param} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                <td className="py-2 px-3 font-medium text-foreground/80 font-mono text-xs">{param}</td>
                <td className="py-2 px-3 font-bold text-cyan-300 text-xs">{val}</td>
                <td className="py-2 px-3">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Выбор <strong className="text-foreground">13 лучей с угловой развёрткой 75°</strong> обеспечивает
        плотность сканирования с шагом 12.5°. Использование{" "}
        <strong className="text-foreground">сферического кастинга радиусом 0.25 м</strong> гарантирует,
        что на высоких скоростях физический движок Unity не пропустит пересечение с угловыми элементами
        геометрии ограждений за один расчётный кадр. Накопление двух временных шагов в стек позволяет
        сети оценивать производную сближения с барьером без ручного вычисления скоростей.
      </p>
    </div>

    {/* 3.4 VectorSensor */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">3.4. VectorSensor: скорость и ориентация</h3>
      <p className="text-muted-foreground leading-relaxed">
        Помимо лучей, в{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">CollectObservations()</code>{" "}
        добавляются векторные наблюдения:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-muted-foreground leading-relaxed">
        <li>
          <strong className="text-foreground">Локальная скорость</strong> автомобиля (3 float,
          нормированы на <Math display={false}>{String.raw`\enfVar{v}_{\max}`}</Math>)
        </li>
        <li>
          <strong className="text-foreground">Угловая скорость</strong> (1 float,{" "}
          <Math display={false}>{String.raw`y`}</Math>-компонент{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">Rigidbody.angularVelocity</code>,
          нормирован)
        </li>
        <li>
          <strong className="text-foreground">Dot product</strong> между forward автомобиля и
          направлением на следующий чекпоинт (1 float,{" "}
          <Math display={false}>{String.raw`\in[-1,+1]`}</Math>) — критически важный сигнал
          «правильного курса»
        </li>
        <li>
          <strong className="text-foreground">Нормированное расстояние</strong> до следующего
          чекпоинта (1 float,{" "}
          <Math display={false}>{String.raw`\in[0,1]`}</Math>)
        </li>
      </ol>
      <p className="text-sm text-muted-foreground">
        Итого: 6 векторных + 15 raycast × 4 ≈ <strong className="text-foreground">81 наблюдение</strong>{" "}
        на один шаг (без стекинга).
      </p>
    </div>

    {/* 3.5 Нормализация */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">3.5. Принципы нормализации</h3>
      <p className="text-muted-foreground leading-relaxed">
        Нейросети с активациями tanh/ReLU работают эффективнее, когда входы лежат в{" "}
        <Math display={false}>{String.raw`[-1, 1]`}</Math> с центром около нуля:
      </p>
      <Math>{String.raw`\tilde{\enfVar{v}} = \frac{\enfVar{v}}{\enfVar{v}_{\max}}, \quad \tilde{\omega} = \frac{\omega}{\omega_{\max}}, \quad \enfVar{d}_{\text{cp}}^{\text{norm}} = \min\!\left(\frac{\enfVar{d}_{\text{cp}}}{\enfVar{d}_{\max}},\, 1\right).`}</Math>
      <p className="text-muted-foreground leading-relaxed">
        {/* TODO(HubLink): target -> hub "math-rl" или "algorithms", anchor "нормализация" */}
        Нормализация: (1) ускоряет сходимость SGD/Adam (равномерные градиенты по осям входа);
        (2) предотвращает раннюю насыщенность нелинейностей;
        (3) стабилизирует value loss, поскольку целевые{" "}
        <Math display={false}>{String.raw`\enfOp{V}^\pi(\enfVar{s})`}</Math> ограничены.
      </p>
      <p className="text-sm text-muted-foreground">
        RayPerceptionSensor нормализует дистанции автоматически. В YAML-конфиге также включается{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">network_settings.normalize: true</code> —
        внутренний running-mean/std-нормализатор векторных наблюдений.
      </p>
    </div>

    <Card className="border-cyan-500/20 bg-cyan-500/5 p-4">
      <p className="text-sm text-cyan-200 font-medium">
        Ключевые моменты раздела 3: в учебном профиле — 7 лучей × 90°, длина 20 м, тэги{" "}
        <code className="bg-muted/50 px-1 text-xs">Wall</code> и{" "}
        <code className="bg-muted/50 px-1 text-xs">Checkpoint</code>. В высокоскоростном профиле —
        6 лучей × 75°, длина 45 м, тэги{" "}
        <code className="bg-muted/50 px-1 text-xs">Barrier, Checkpoint, Opponent</code>, стек 2 кадра.
        Все векторные наблюдения нормируются вручную, raycast — автоматически.
      </p>
    </Card>
  </div>
);

export default Section3Sensors;
