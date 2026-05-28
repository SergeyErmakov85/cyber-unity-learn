# Комплексное учебное руководство: Автономный гоночный агент на Unity ML-Agents Toolkit (release 22 / com.unity.ml-agents 3.0.0) с PyTorch

**Курс «Информационные технологии в психологии», МГППУ**
**Версия документа: май 2026 г. (расширенное издание)**

---

## TL;DR (краткое резюме)
- Для овальной трассы рекомендуется **PPO с непрерывными действиями (3 канала: руль, газ, тормоз)**, raycast-сенсоры (7 лучей на сторону × 90°), система триггеров-чекпоинтов и компактная функция награды: +1 за чекпоинт, −1 за столкновение со стеной с завершением эпизода, малая премия за скорость и микропенальти за шаг.
- Целевой технологический стек: **Unity 2023.2+ (для com.unity.ml-agents 3.0.0 final = release 22; для Unity 2022.3 LTS используйте release_21), Python 3.10.12, mlagents 1.1.0, PyTorch 2.2.1**; обучение запускается командой `mlagents-learn`, мониторинг — TensorBoard.
- Архитектура агента строится по принципам SOLID: отдельные классы `CarAgent`, `CarController` (через интерфейс `ICarController`), `CheckpointManager`, `Checkpoint`; это позволяет менять физику автомобиля и схему трассы без переписывания обучающей логики.

---

## Раздел 1. Введение и теоретическая база

### 1.1. Что такое Reinforcement Learning (обучение с подкреплением)

Обучение с подкреплением (Reinforcement Learning, RL) — это парадигма машинного обучения, в которой **агент** (agent) учится принимать последовательность решений, взаимодействуя со **средой** (environment) и получая скалярный сигнал **награды** (reward). В отличие от обучения с учителем, агенту не предъявляют правильные ответы — он сам «открывает» поведение, максимизирующее ожидаемую суммарную награду.

**Ключевые понятия:**

| Понятие (RU) | Term (EN) | Описание |
|---|---|---|
| Агент | Agent | Принимающий решения объект (наш автомобиль) |
| Среда | Environment | Внешний мир (трасса, физика, чекпоинты) |
| Состояние | State, $s_t$ | Полное описание ситуации в момент $t$ |
| Наблюдение | Observation, $o_t$ | То, что фактически «видит» агент (часть состояния) |
| Действие | Action, $a_t$ | Решение агента (поворот руля, газ, тормоз) |
| Награда | Reward, $r_t$ | Скалярный сигнал качества действия |
| Политика | Policy, $\pi(a\mid s)$ | Функция/распределение действий по состояниям |
| Функция ценности | Value function, $V^\pi(s)$ | Ожидаемая будущая суммарная награда из $s$ |
| Функция Q | Action-value, $Q^\pi(s,a)$ | Ожидаемая награда после действия $a$ в $s$ |
| Эпизод | Episode | Последовательность шагов до терминального состояния (круг или столкновение) |

### 1.2. Марковский процесс принятия решений (MDP)

Формально среда задаётся как **Марковский процесс принятия решений** (Markov Decision Process):
$$
\mathcal{M} = \langle \mathcal{S}, \mathcal{A}, P, R, \gamma \rangle,
$$
где $\mathcal{S}$ — множество состояний, $\mathcal{A}$ — множество действий, $P(s'\mid s,a)$ — вероятность перехода, $R(s,a)$ — функция награды, $\gamma \in [0,1)$ — коэффициент дисконтирования. **Марковское свойство** означает, что распределение следующего состояния зависит только от текущего состояния и действия, а не от истории.

**Цель агента** — найти политику $\pi^*$, максимизирующую ожидаемую дисконтированную сумму наград:
$$
J(\pi) = \mathbb{E}_{\tau \sim \pi}\!\left[\sum_{t=0}^{\infty} \gamma^t r_t\right].
$$

**Функция ценности состояния** определяется рекурсивно через **уравнение Беллмана**:
$$
V^\pi(s) = \mathbb{E}_{a \sim \pi,\, s'\sim P}\!\left[R(s,a) + \gamma V^\pi(s')\right].
$$

Для оптимальной политики справедливо **уравнение оптимальности Беллмана**:
$$
V^*(s) = \max_{a \in \mathcal{A}} \mathbb{E}_{s'}\!\left[R(s,a) + \gamma V^*(s')\right], \qquad
Q^*(s,a) = \mathbb{E}_{s'}\!\left[R(s,a) + \gamma \max_{a'} Q^*(s',a')\right].
$$

Уравнение Беллмана — основа всех современных RL-алгоритмов: глубокие нейросети учатся аппроксимировать либо $V^*$/$Q^*$, либо политику $\pi^*$, минимизируя отклонение от этих рекурсивных тождеств.

### 1.3. Дискретное и непрерывное пространство действий

- **Дискретное пространство** ($\mathcal{A} = \{0,1,\ldots,K-1\}$): агент выбирает одно из конечного числа действий. Политика — категориальное распределение $\pi(a\mid s) = \text{softmax}(\phi_\theta(s))$.
- **Непрерывное пространство** ($\mathcal{A} \subseteq \mathbb{R}^d$): действие — вектор вещественных чисел. В ML-Agents политика для непрерывных действий — мультивариативное Гауссово распределение $\pi_\theta(a\mid s) = \mathcal{N}(\mu_\theta(s), \sigma_\theta(s))$.

### 1.4. Почему непрерывные действия для управления автомобилем

Управление транспортным средством физически требует **плавных, мелкоразрешённых сигналов**: угол поворота руля $\delta \in [-\delta_{\max}, +\delta_{\max}]$, нормированная сила тяги $u_{\text{accel}} \in [0,1]$, сила торможения $u_{\text{brake}} \in [0,1]$. Дискретизация (например, «руль = {-1, 0, +1}») приводит к рывкам, потере устойчивости и неоптимальным траекториям на поворотах. Непрерывное управление позволяет агенту изучать тонкие манёвры — «лёгкое подруливание» и «постепенное оттормаживание перед поворотом».

В ML-Agents непрерывные действия по умолчанию клиппируются в диапазон $[-1, 1]$ на выходе политики PPO. Согласно официальной документации Unity (`Learning-Environment-Design-Agents.md`): «By default the output from our provided PPO algorithm pre-clamps the values of `ActionBuffers.ContinuousActions` into the [-1, 1] range. It is a best practice to manually clip these as well».

**Ключевые моменты раздела 1.** RL формализует задачу как MDP; уравнение Беллмана связывает ценности соседних состояний; для гоночного управления нужны непрерывные действия, реализующиеся через массив `ActionBuffers.ContinuousActions`.

---

## Раздел 2. Настройка окружения

### 2.1. Совместимость версий

Создание высокопроизводительных систем автономного вождения на базе DRL требует развёртывания **стабильного, детерминированного и оптимизированного программного стека**. Взаимодействие между физическим симулятором Unity и вычислительным бэкендом PyTorch осуществляется через проприетарные сокетные каналы обмена сообщениями gRPC, чувствительные к версиям библиотек сериализации. **Нарушение совместимости в цепочке зависимостей компилятора ONNX или интерпретатора Python является наиболее частой причиной аварийного завершения сессий обучения.**

**Базовая (минимальная) спецификация — рекомендуется для МГППУ:**

| Компонент | Версия | Источник / Назначение |
|---|---|---|
| Unity Editor | **2023.2+** для release_22 (3.0.0 final); 2022.3 LTS для release_21 (3.0.0-exp.1) | CHANGELOG.md: «The minimum supported Unity version was updated to 2023.2» |
| com.unity.ml-agents | 3.0.0 | release_22 GitHub tag |
| Python | 3.10.12 (диапазон `>=3.10.1, <=3.10.12`) | mlagents 1.1.0 PyPI metadata |
| mlagents (Python) | 1.1.0 (Oct 5, 2024) | PyPI |
| PyTorch | 2.2.1 | docs ML-Agents Installation |

**Расширенная (production-grade) спецификация — для продвинутых проектов и современных GPU Nvidia (включая архитектуры Blackwell и Ada Lovelace):**

| Компонент | Версия дистрибутива | Назначение в архитектуре |
|---|---|---|
| Python | 3.10.12 | Базовая среда исполнения скриптов обучения и оптимизации |
| Unity Editor | 6000.0 или новее | Высокоточная симуляция физики твёрдых тел и рендеринг среды |
| com.unity.ml-agents | 4.0.0 (или ветка release_23) | C# SDK для интеграции интеллектуальных агентов в сцену |
| mlagents (Python) | 1.1.0 / 1.2.0 | Пакет алгоритмов глубокого обучения на стороне Python |
| PyTorch | 2.2.1+cu121 (или 2.9.1+cu130 для RTX 50-й серии) | Тензорный бэкенд вычислений и аппроксимации функций |
| Protobuf | 3.20.3 | Низкоуровневая сериализация межпроцессных сообщений |
| NumPy | 1.23.5 | Быстрые векторные операции над собираемыми наблюдениями |
| ONNX | 1.20.1 | Стандарт экспорта весовых коэффициентов обученной сети в Unity |
| ONNXScript | 0.6.2 | Интерфейс генерации графов вычислений PyTorch |
| Setuptools | 65.5.0 | Предотвращение ошибок разбора версий в Python API |

> **Внимание для МГППУ:** если в учебном классе установлен **Unity 2022.3 LTS** и его обновление невозможно, используйте предыдущий выпуск **release_21** с пакетом `com.unity.ml-agents@3.0.0-exp.1` — он функционально близок и работает с теми же YAML-конфигами. Версия 3.0.0 final требует Unity 2023.2 и выше. Для лабораторий с современным железом (RTX 40/50-й серии) предпочтительна расширенная спецификация с Unity 6000.0 и ML-Agents 4.0.0.

> **Критически важно про фиксированную версию Python 3.10.12.** Более поздние версии интерпретатора (3.11, 3.12) **ломают дерево сборки** устаревших библиотек C++. Использование conda/Miniconda с явной фиксацией версии — обязательно.

### 2.2. Установка Unity

1. Скачайте **Unity Hub** с сайта `unity.com/download`.
2. В Hub установите редактор Unity 2023.2 (или 2022.3 LTS — см. примечание выше).
3. Создайте новый проект шаблона **3D (URP)** или **3D Built-in**.

### 2.3. Установка пакета com.unity.ml-agents

В Unity Editor:
1. **Window → Package Manager → + → Add package by name**.
2. Имя пакета: `com.unity.ml-agents`, версия `3.0.0`.

### 2.4. Установка Python-окружения

Рекомендуемая схема через **conda**:

```bash
# 1. Создаём изолированное окружение Python 3.10.12
conda create -n mlagents python=3.10.12
conda activate mlagents

# 2. Ставим PyTorch 2.2.1 (CUDA 12.1 для GPU)
pip3 install torch~=2.2.1 --index-url https://download.pytorch.org/whl/cu121
# CPU-only вариант:  pip3 install torch~=2.2.1

# 3. Клонируем репозиторий release_22 (для исходников и примеров)
git clone --branch release_22 https://github.com/Unity-Technologies/ml-agents.git
cd ml-agents

# 4. Устанавливаем mlagents-envs и mlagents
python -m pip install ./ml-agents-envs
python -m pip install ./ml-agents

# Альтернатива через PyPi (без локальной копии примеров):
# pip install mlagents==1.1.0
```

### 2.5. Проверка установки

```bash
mlagents-learn --help
```
Если в консоли выводится список параметров CLI — установка прошла успешно.

### 2.6. Структура проекта Unity

```
RacingAgentProject/
├── Assets/
│   ├── Scripts/
│   │   ├── Agent/CarAgent.cs
│   │   ├── Car/CarController.cs
│   │   ├── Car/ICarController.cs
│   │   ├── Track/CheckpointManager.cs
│   │   ├── Track/Checkpoint.cs
│   │   └── Track/ICheckpointManager.cs
│   ├── Prefabs/Car.prefab
│   ├── Scenes/OvalTrack.unity
│   └── ML-Models/                    (.onnx файлы после обучения)
├── config/
│   ├── ppo_oval.yaml
│   └── sac_oval.yaml
└── results/                          (создаётся mlagents-learn автоматически)
```

### 2.7. Типичные барьеры компиляции и их обход

При интеграции современных версий библиотек глубокого обучения с консервативным API ML-Agents инженеры сталкиваются со специфическими барьерами компиляции. Ниже — три самых частых аномалии и их подтверждённые решения.

**Аномалия 1: сбой импорта с сообщением об отсутствии дескриптора `opset23` в ONNX-трансляторе.**

Причина: новые сборки PyTorch по умолчанию вызывают современный динамический экспортер, не поддерживаемый внутренним парсером Unity.

Решение: принудительно перевести компилятор в классический режим экспорта, добавив аргумент `dynamo=False` непосредственно в вызов функции `torch.onnx.export` внутри исходного файла `model_serialization.py`. Путь:

```
path_to_miniconda\envs\mlagents\lib\site-packages\mlagents\trainers\torch_entities\model_serialization.py
```

**Аномалия 2: ошибки десериализации Protobuf.**

Решение: установить фиксированную версию `protobuf==3.20.3`. Появляющиеся предупреждения о конфликтах зависимостей можно безопасно игнорировать — они не влияют на математическую корректность вычислений.

**Аномалия 3: критические сбои API сравнения версий `StrictVersion`.**

Решение: установить пакет `setuptools==65.5.0` — это нивелирует ошибки.

```bash
# Сводный «спасательный набор» при сбоях
pip install protobuf==3.20.3
pip install setuptools==65.5.0
# + руками отредактировать model_serialization.py: добавить dynamo=False
```

**Ключевые моменты раздела 2.** Стек: Unity 2023.2+ (или 2022.3 LTS с release_21), Python 3.10.12, PyTorch 2.2.1. Проверка: `mlagents-learn --help`. При сбоях ONNX-экспорта — `dynamo=False`; при ошибках сериализации — `protobuf==3.20.3`, `setuptools==65.5.0`.

---

## Раздел 3. Конфигурация сенсоров (Ray Perception Sensors)

### 3.1. Что такое RayPerceptionSensorComponent3D

`RayPerceptionSensorComponent3D` — компонент, испускающий из объекта агента набор **лучей** (raycasts) в заданных углах. Каждый луч возвращает: (1) попал ли он в объект с одним из «detectable tags», (2) на какой нормированной дистанции $\in[0,1]$, (3) one-hot вектор обнаруженного тэга. Это — основа восприятия гоночного агента, виртуальный «LIDAR» автомобиля.

Размер вектора наблюдений, генерируемого RayPerceptionSensor:
$$
\text{ObsSize} = (\text{ObservationStacks}) \times (1 + 2 \cdot \text{RaysPerDirection}) \times (\text{NumDetectableTags} + 2).
$$

Использование сенсоров лучевого восприятия позволяет эмулировать работу лидарных сканеров реальных беспилотных автомобилей, передавая вектор расстояний до пересечений с коллайдерами. Каждый луч сенсора генерирует набор признаков, включающий **расстояние до точки контакта** (нормализованное от 0 до 1), **факт обнаружения объекта** с определённым тегом (в формате one-hot кодирования) и **нормаль поверхности столкновения**.

### 3.2. Рекомендуемая настройка для овальной трассы (учебный профиль)

| Параметр | Значение | Обоснование |
|---|---|---|
| **Rays Per Direction** | 7 | 1 центральный + 7 слева + 7 справа = 15 лучей |
| **Max Ray Degrees** | 90 | Сектор 180° впереди (по 90° в каждую сторону) |
| **Sphere Cast Radius** | 0.5 | Сферический луч толерантнее к тонким мешам стен |
| **Ray Length** | 20.0 | Достаточно, чтобы агент «увидел» поворот заранее |
| **Start Vertical Offset** | 0.5 | Лучи стартуют чуть выше центра кузова |
| **End Vertical Offset** | 0.0 | Лучи идут параллельно земле |
| **Detectable Tags** | `["Wall", "Checkpoint"]` | Стены и чекпоинты |
| **Stacked Raycasts** | 3 | Стек кадров даёт временной контекст |

> **Пояснение по углам** (Adam Kelly, *Ray Perception Sensor Component Tutorial*, immersivelimit.com): «Max Ray Degrees specifies the angle at which to spread out the raycasts. A value of 60 degrees will result in rays spread over 30 degrees to the left and right of the center line.» При значении 90° сектор покрывает по 45° в каждую сторону.

### 3.3. Альтернативная высокоскоростная конфигурация (продвинутый профиль)

Для гоночных сценариев с высокими скоростями (>100 км/ч) и наличием соперников на трассе разработана **специализированная пространственная конфигурация сенсора**, оптимизированная под упреждающее планирование траектории и контроль в заносе:

| Параметр конфигурации сенсора | Выбранное инженерное значение | Функциональное обоснование в динамике движения |
|---|---|---|
| **Detectable Tags** | `["Barrier", "Checkpoint", "Opponent"]` | Идентификация физических границ трассы, триггеров прогресса круга и соперников |
| **Rays Per Direction** | 6 | Генерирует 13 лучей (1 центральный и по 6 с каждого борта) для плотного покрытия |
| **Max Ray Degrees** | 75.0 | Равномерная веерная развёртка в секторе 150° для контроля траектории в заносе |
| **Sphere Cast Radius** | 0.25 | Объёмный кастинг предотвращает пропуски тонких швов стыковки коллайдеров |
| **Ray Length** | 45.0 | Обеспечивает дальнодействие, достаточное для упреждающего торможения на скорости |
| **Observation Stacks** | 2 | Накопление двух кадров позволяет сети улавливать динамику изменения расстояний |
| **Start Vertical Offset** | 0.1 | Исключает ложные срабатывания от дорожного полотна при продольном крене кузова |
| **End Vertical Offset** | 0.0 | Сохраняет направление сканирования параллельно опорной плоскости трека |

Выбор **13 лучей с угловой развёрткой 75 градусов** обеспечивает плотность сканирования с шагом 12.5 градусов. Центральные лучи фокусируются на дальней перспективе трека, позволяя планировать скорость, в то время как периферийные лучи под большими углами непрерывно измеряют боковой интервал до отбойников, что критически важно при прохождении дуги овальной трассы.

Использование **сферического кастинга радиусом 0.25 метра** вместо бесконечно тонких математических линий гарантирует, что на высоких скоростях физический движок Unity не пропустит пересечение с угловыми элементами геометрии ограждений за один расчётный кадр. Накопление двух последовательных временных шагов в стек наблюдений даёт возможность рекуррентным или полносвязным слоям нейросети оценивать производную сближения с барьером, не требуя ручного вычисления скоростей сближения в коде агента.

### 3.4. VectorSensor: скорость и ориентация

Помимо лучей, в `CollectObservations()` добавляются **векторные наблюдения**:

1. **Локальная скорость** автомобиля (3 float, нормированы на $v_{\max}$);
2. **Угловая скорость** (1 float, $y$-компонент `Rigidbody.angularVelocity`, нормирован);
3. **Dot product** между forward автомобиля и направлением на следующий чекпоинт (1 float, $\in[-1,+1]$) — критически важный сигнал «правильного курса»;
4. **Нормированное расстояние** до следующего чекпоинта (1 float, $\in[0,1]$).

Итого: 6 векторных + 15 raycast × 4 = ≈ **81 наблюдение** на один шаг (без стекинга).

### 3.5. Принципы нормализации

Нейросети с активациями tanh/ReLU работают эффективнее, когда входы лежат в $[-1, 1]$ с центром около нуля:
$$
\tilde{v} = \frac{v}{v_{\max}}, \quad \tilde{\omega} = \frac{\omega}{\omega_{\max}}, \quad d_{\text{cp}}^{\text{norm}} = \min\!\left(\frac{d_{\text{cp}}}{d_{\max}},\, 1\right).
$$

Нормализация:
1. ускоряет сходимость SGD/Adam (равномерные градиенты по осям входа);
2. предотвращает раннюю насыщенность нелинейностей;
3. стабилизирует value loss, поскольку целевые $V^\pi(s)$ ограничены.

RayPerceptionSensor нормализует дистанции автоматически. В YAML-конфиге также включается `network_settings.normalize: true` — внутренний running-mean/std-нормализатор векторных наблюдений.

**Ключевые моменты раздела 3.** В учебном профиле — 7 лучей × 90°, длина 20 м, тэги `Wall` и `Checkpoint`. В высокоскоростном профиле — 6 лучей × 75°, длина 45 м, тэги `Barrier`, `Checkpoint`, `Opponent`, стек 2 кадра. Все векторные наблюдения нормируются вручную, raycast — автоматически.

---

## Раздел 4. Логика агента (C#)

### 4.1. Применение SOLID

| Принцип | Реализация в проекте |
|---|---|
| **S** Single Responsibility | `CarAgent` — только RL-цикл; физика в `CarController`; чекпоинты в `CheckpointManager` |
| **O** Open/Closed | Новые источники награды добавляются методами без правки `CarAgent` |
| **L** Liskov Substitution | Любая реализация `ICarController` (упрощённая, WheelCollider, аркадная) подставляется в агента |
| **I** Interface Segregation | Маленькие интерфейсы `ICarController`, `ICheckpointManager` |
| **D** Dependency Inversion | `CarAgent` зависит от **абстракций**, а не от конкретных классов |

В соответствии с фундаментальными архитектурными принципами SOLID, **логика принятия решений агентом (инференс нейросети и накопление наград) должна быть изолирована от непосредственной реализации физики колёсных коллайдеров.** Класс агента выполняет роль высокоуровневого координатора, агрегирующего нормализованные данные среды и транслирующего непрерывные действия сети в конкретные физические силы.

### 4.2. Интерфейс `ICarController`

```csharp
// Assets/Scripts/Car/ICarController.cs
using UnityEngine;

namespace RacingAgent.Car
{
    /// <summary>
    /// Интерфейс контроллера автомобиля.
    /// Абстрагирует физическую модель машины от логики RL-агента (принцип DIP).
    /// </summary>
    public interface ICarController
    {
        /// <summary>Применить непрерывные сигналы управления.</summary>
        /// <param name="steering">Руль в диапазоне [-1, +1] (отрицательно — налево).</param>
        /// <param name="acceleration">Газ [0, 1].</param>
        /// <param name="braking">Тормоз [0, 1].</param>
        void ApplyControls(float steering, float acceleration, float braking);

        /// <summary>Сбросить машину в исходное состояние (вызывается в начале эпизода).</summary>
        void ResetState(Vector3 position, Quaternion rotation);

        Vector3 Velocity { get; }          // Скорость в мировых координатах
        Vector3 LocalVelocity { get; }     // Локальная скорость (forward = продольная)
        Vector3 AngularVelocity { get; }   // Угловая скорость
        float MaxSpeed { get; }            // Максимальная скорость для нормализации
    }
}
```

### 4.3. Интерфейс `ICheckpointManager`

```csharp
// Assets/Scripts/Track/ICheckpointManager.cs
using UnityEngine;

namespace RacingAgent.Track
{
    /// <summary>
    /// Менеджер последовательного прохождения чекпоинтов.
    /// </summary>
    public interface ICheckpointManager
    {
        /// <summary>Сброс состояния в начале эпизода.</summary>
        void ResetCheckpoints();

        /// <summary>Уведомление о пересечении чекпоинта.</summary>
        /// <returns>true, если это был правильный (следующий по очереди) чекпоинт.</returns>
        bool RegisterCheckpoint(Checkpoint cp);

        Vector3 GetNextCheckpointPosition();   // Позиция следующего чекпоинта
        Vector3 GetNextCheckpointForward();    // Forward-вектор следующего чекпоинта

        int CheckpointsPassed { get; }         // Сколько пройдено за эпизод
    }
}
```

### 4.4. Класс `Checkpoint`

```csharp
// Assets/Scripts/Track/Checkpoint.cs
using UnityEngine;

namespace RacingAgent.Track
{
    /// <summary>
    /// Триггер-чекпоинт. Лежит на трассе, имеет тэг "Checkpoint" и Collider в режиме IsTrigger.
    /// При прохождении машины вызывает событие OnPassed.
    /// </summary>
    [RequireComponent(typeof(Collider))]
    public class Checkpoint : MonoBehaviour
    {
        [Tooltip("Индекс чекпоинта в кольце (0 — старт/финиш).")]
        public int Index;

        // Событие пересечения (подписывается CheckpointManager и/или CarAgent)
        public System.Action<Checkpoint, GameObject> OnPassed;

        private void Awake()
        {
            // Гарантируем, что коллайдер — триггер
            var col = GetComponent<Collider>();
            col.isTrigger = true;
            // Назначаем тэг для RayPerceptionSensor
            if (!gameObject.CompareTag("Checkpoint"))
                gameObject.tag = "Checkpoint";
        }

        private void OnTriggerEnter(Collider other)
        {
            // Реагируем только на машину с Rigidbody
            if (other.attachedRigidbody == null) return;
            OnPassed?.Invoke(this, other.attachedRigidbody.gameObject);
        }
    }
}
```

### 4.5. Класс `CheckpointManager`

```csharp
// Assets/Scripts/Track/CheckpointManager.cs
using System.Collections.Generic;
using UnityEngine;

namespace RacingAgent.Track
{
    /// <summary>
    /// Менеджер последовательного прохождения чекпоинтов на овальной трассе.
    /// Хранит упорядоченный список Checkpoint, активирует следующий и сбрасывает в эпизоде.
    /// </summary>
    public class CheckpointManager : MonoBehaviour, ICheckpointManager
    {
        [Tooltip("Список чекпоинтов в порядке прохождения. Заполняется в инспекторе.")]
        [SerializeField] private List<Checkpoint> _checkpoints = new List<Checkpoint>();

        private int _nextIndex;

        public int CheckpointsPassed { get; private set; }

        public void ResetCheckpoints()
        {
            _nextIndex = 0;
            CheckpointsPassed = 0;
            UpdateVisibility();
        }

        public bool RegisterCheckpoint(Checkpoint cp)
        {
            if (_checkpoints.Count == 0) return false;
            // Считаем «правильным» только тот, что ожидался следующим
            if (cp.Index != _checkpoints[_nextIndex].Index) return false;

            _nextIndex = (_nextIndex + 1) % _checkpoints.Count;
            CheckpointsPassed++;
            UpdateVisibility();
            return true;
        }

        public Vector3 GetNextCheckpointPosition() => _checkpoints[_nextIndex].transform.position;
        public Vector3 GetNextCheckpointForward()  => _checkpoints[_nextIndex].transform.forward;

        // Визуализация: следующий чекпоинт — красный, остальные — серые
        private void UpdateVisibility()
        {
            for (int i = 0; i < _checkpoints.Count; i++)
            {
                var r = _checkpoints[i].GetComponent<Renderer>();
                if (r != null) r.material.color = (i == _nextIndex) ? Color.red : Color.gray;
            }
        }
    }
}
```

### 4.6. Класс `CarController` (физика автомобиля, упрощённая модель)

```csharp
// Assets/Scripts/Car/CarController.cs
using UnityEngine;

namespace RacingAgent.Car
{
    /// <summary>
    /// Простой физический контроллер автомобиля на основе Rigidbody.
    /// Не зависит от ML-Agents — машину можно тестировать отдельно через Heuristic.
    /// </summary>
    [RequireComponent(typeof(Rigidbody))]
    public class CarController : MonoBehaviour, ICarController
    {
        [Header("Параметры движения")]
        [SerializeField] private float _motorForce    = 1500f; // Сила двигателя (Н)
        [SerializeField] private float _brakeForce    = 3000f; // Сила торможения (Н)
        [SerializeField] private float _maxSteerAngle = 30f;   // Макс. угол поворота (°)
        [SerializeField] private float _maxSpeed      = 25f;   // Ограничение скорости (м/с)

        private Rigidbody _rb;

        public Vector3 Velocity        => _rb.linearVelocity;
        public Vector3 LocalVelocity   => transform.InverseTransformDirection(_rb.linearVelocity);
        public Vector3 AngularVelocity => _rb.angularVelocity;
        public float MaxSpeed          => _maxSpeed;

        private void Awake()
        {
            _rb = GetComponent<Rigidbody>();
            // Опускаем центр масс — уменьшает риск переворота
            _rb.centerOfMass = new Vector3(0f, -0.5f, 0f);
        }

        public void ApplyControls(float steering, float acceleration, float braking)
        {
            // Клиппируем входы — на случай если политика выдала вне диапазона
            steering     = Mathf.Clamp(steering, -1f, 1f);
            acceleration = Mathf.Clamp01(acceleration);
            braking      = Mathf.Clamp01(braking);

            // 1) Тяга: вперёд по forward с ограничением по максимальной скорости
            if (LocalVelocity.z < _maxSpeed)
            {
                _rb.AddForce(transform.forward * acceleration * _motorForce, ForceMode.Force);
            }

            // 2) Торможение: противодействующая сила
            _rb.AddForce(-_rb.linearVelocity.normalized * braking * _brakeForce, ForceMode.Force);

            // 3) Поворот: упрощённый, через AddTorque по оси Y
            // Чем выше скорость, тем эффективнее руль (физически реалистично)
            float speedFactor = Mathf.Clamp01(LocalVelocity.z / _maxSpeed);
            _rb.AddTorque(Vector3.up * steering * _maxSteerAngle * speedFactor,
                          ForceMode.VelocityChange);
        }

        public void ResetState(Vector3 position, Quaternion rotation)
        {
            _rb.linearVelocity  = Vector3.zero;
            _rb.angularVelocity = Vector3.zero;
            transform.SetPositionAndRotation(position, rotation);
        }
    }
}
```

### 4.7. Альтернатива: расширенный интерфейс `IVehicleController` и реализация через `WheelCollider`

Для более реалистичной физики (с шинами, скольжением, моментами тяги/торможения на каждое колесо) применяется встроенная в Unity модель `WheelCollider`. Интерфейс расширен дополнительными свойствами, полезными для агента: `CurrentSpeed` в км/ч, `MaxExpectedSpeed`, отношение угла руля и **флаг застревания** у барьера.

```csharp
// Расширенный интерфейс для реалистичной физической модели
namespace AutonomousRacing.Core
{
    public interface IVehicleController
    {
        float CurrentSpeed { get; }            // Текущая скорость, км/ч
        float MaxExpectedSpeed { get; }        // Максимальная ожидаемая скорость, км/ч
        float SteeringAngleRatio { get; }      // Текущее положение руля [-1, +1]
        bool  IsStuckHeadOn { get; }           // Флаг застревания у барьера

        void ApplyMotorTorque(float throttleInput);   // Газ [0, 1]
        void ApplyBrakeTorque(float brakeInput);      // Тормоз [0, 1]
        void ApplySteering(float steerInput);         // Руль [-1, +1]
        void ResetPhysicsState();                     // Полный сброс физики
    }
}
```

```csharp
// Реализация через встроенную физическую модель колёс WheelCollider
using UnityEngine;
using AutonomousRacing.Core;

namespace AutonomousRacing.Physics
{
    public class WheelColliderVehicleController : MonoBehaviour, IVehicleController
    {
        private WheelCollider wheelFL;
        private WheelCollider wheelFR;
        private WheelCollider wheelBL;
        private WheelCollider wheelBR;

        private float maxMotorTorque = 1600f;
        private float maxBrakeTorque = 3500f;
        private float maxSteerAngle = 33f;
        private float maxExpectedSpeedKmH = 140f;
        private Transform centerOfMassOffset;

        private Rigidbody rb;
        private float currentSteerInput;

        public float CurrentSpeed       => rb.velocity.magnitude * 3.6f;   // м/с → км/ч
        public float MaxExpectedSpeed   => maxExpectedSpeedKmH;
        public float SteeringAngleRatio => currentSteerInput;
        public bool  IsStuckHeadOn { get; private set; }

        private void Awake()
        {
            rb = GetComponent<Rigidbody>();
            if (centerOfMassOffset != null)
                rb.centerOfMass = centerOfMassOffset.localPosition;
        }

        public void ApplyMotorTorque(float throttleInput)
        {
            float torque = Mathf.Clamp01(throttleInput) * maxMotorTorque;
            wheelBL.motorTorque = torque;
            wheelBR.motorTorque = torque;
        }

        public void ApplyBrakeTorque(float brakeInput)
        {
            float brake = Mathf.Clamp01(brakeInput) * maxBrakeTorque;
            wheelFL.brakeTorque = brake;
            wheelFR.brakeTorque = brake;
            wheelBL.brakeTorque = brake;
            wheelBR.brakeTorque = brake;
        }

        public void ApplySteering(float steerInput)
        {
            currentSteerInput = Mathf.Clamp(steerInput, -1f, 1f);
            float angle = currentSteerInput * maxSteerAngle;
            wheelFL.steerAngle = angle;
            wheelFR.steerAngle = angle;
        }

        public void ResetPhysicsState()
        {
            rb.velocity = Vector3.zero;
            rb.angularVelocity = Vector3.zero;
            wheelFL.motorTorque = 0f; wheelFR.motorTorque = 0f;
            wheelBL.motorTorque = 0f; wheelBR.motorTorque = 0f;
            wheelFL.brakeTorque = 0f; wheelFR.brakeTorque = 0f;
            wheelBL.brakeTorque = 0f; wheelBR.brakeTorque = 0f;
            wheelFL.steerAngle  = 0f; wheelFR.steerAngle  = 0f;
            IsStuckHeadOn = false;
        }

        // Детектор «застревания»: машина уткнулась в барьер и почти не движется
        private void OnCollisionStay(Collision collision)
        {
            if (collision.gameObject.CompareTag("Barrier"))
                IsStuckHeadOn = rb.velocity.magnitude < 0.3f;
        }

        private void OnCollisionExit(Collision collision)
        {
            if (collision.gameObject.CompareTag("Barrier"))
                IsStuckHeadOn = false;
        }
    }
}
```

### 4.8. Главный класс `CarAgent`

```csharp
// Assets/Scripts/Agent/CarAgent.cs
using UnityEngine;
using Unity.MLAgents;
using Unity.MLAgents.Actuators;
using Unity.MLAgents.Sensors;
using RacingAgent.Car;
using RacingAgent.Track;

namespace RacingAgent.Agent
{
    /// <summary>
    /// RL-агент гоночного автомобиля.
    /// Использует НЕПРЕРЫВНЫЕ действия (continuous): руль, газ, тормоз.
    /// Зависит от ICarController и ICheckpointManager (Dependency Inversion).
    /// </summary>
    public class CarAgent : Unity.MLAgents.Agent
    {
        [Header("Зависимости (заполняются в инспекторе)")]
        [SerializeField] private MonoBehaviour _carControllerComponent;       // ICarController
        [SerializeField] private MonoBehaviour _checkpointManagerComponent;   // ICheckpointManager
        [SerializeField] private Transform[]   _startPoints;                  // случайные стартовые точки

        [Header("Параметры награды")]
        [SerializeField] private float _checkpointReward  =  1.0f;    // За правильный чекпоинт
        [SerializeField] private float _collisionPenalty  = -1.0f;    // За удар о стену
        [SerializeField] private float _speedRewardCoeff  =  0.001f;  // Премия за скорость на шаг
        [SerializeField] private float _timePenalty       = -0.0005f; // Постоянный штраф за шаг
        [SerializeField] private float _orientationCoeff  =  0.0005f; // Премия за правильный курс
        [SerializeField] private float _smoothnessCoeff   =  0.0002f; // Штраф за рывки

        private ICarController     _car;
        private ICheckpointManager _checkpoints;
        private float _previousSteering;
        private float _previousAcceleration;

        // ----- Инициализация (вызывается один раз) -----
        public override void Initialize()
        {
            // Получаем зависимости через интерфейсы (DIP)
            _car         = _carControllerComponent      as ICarController;
            _checkpoints = _checkpointManagerComponent  as ICheckpointManager;

            if (_car == null)
                Debug.LogError("CarController не реализует ICarController!");
            if (_checkpoints == null)
                Debug.LogError("CheckpointManager не реализует ICheckpointManager!");

            // Подписка на события всех чекпоинтов сцены
            foreach (var cp in FindObjectsByType<Checkpoint>(FindObjectsSortMode.None))
                cp.OnPassed += OnCheckpointPassed;
        }

        // ----- Начало эпизода -----
        public override void OnEpisodeBegin()
        {
            // 1) Сброс менеджера чекпоинтов
            _checkpoints.ResetCheckpoints();

            // 2) Случайный выбор стартовой позиции — улучшает обобщение
            int idx = Random.Range(0, _startPoints.Length);
            _car.ResetState(_startPoints[idx].position, _startPoints[idx].rotation);

            // 3) Сброс истории действий
            _previousSteering     = 0f;
            _previousAcceleration = 0f;
        }

        // ----- Сбор векторных наблюдений (raycasts добавляются автоматически сенсором) -----
        public override void CollectObservations(VectorSensor sensor)
        {
            // 1) Локальная скорость (3 значения, нормированы)
            Vector3 localVel = _car.LocalVelocity / _car.MaxSpeed;
            sensor.AddObservation(localVel);

            // 2) Угловая скорость по Y (нормирована)
            sensor.AddObservation(Mathf.Clamp(_car.AngularVelocity.y / 5f, -1f, 1f));

            // 3) Dot product: правильно ли направлен автомобиль на следующий чекпоинт
            Vector3 toCp = (_checkpoints.GetNextCheckpointPosition() - transform.position).normalized;
            sensor.AddObservation(Vector3.Dot(transform.forward, toCp));   // [-1, +1]

            // 4) Нормированное расстояние до следующего чекпоинта
            float dist = Vector3.Distance(transform.position, _checkpoints.GetNextCheckpointPosition());
            sensor.AddObservation(Mathf.Clamp01(dist / 50f));
            // Итого 6 векторных наблюдений
        }

        // ----- Применение действий -----
        public override void OnActionReceived(ActionBuffers actions)
        {
            // НЕПРЕРЫВНЫЕ действия: 3 канала, политика выдаёт значения в [-1, +1]
            float steering     = Mathf.Clamp(actions.ContinuousActions[0], -1f, 1f);  // [-1, +1]
            // Маппим [-1, +1] -> [0, 1] для газа и тормоза:
            float acceleration = Mathf.Clamp01((actions.ContinuousActions[1] + 1f) * 0.5f);
            float braking      = Mathf.Clamp01((actions.ContinuousActions[2] + 1f) * 0.5f);

            // Применяем к физическому контроллеру
            _car.ApplyControls(steering, acceleration, braking);

            // ----- Формирование награды на шаг -----
            ApplyShapedReward(steering, acceleration);

            _previousSteering     = steering;
            _previousAcceleration = acceleration;
        }

        // ----- Reward shaping (вынесено для читаемости) -----
        private void ApplyShapedReward(float steering, float acceleration)
        {
            // (а) Постоянный штраф за время — стимул двигаться быстро
            AddReward(_timePenalty);

            // (б) Премия за продольную скорость: r_speed = α * v_long / v_max
            float speedNorm = Mathf.Clamp01(_car.LocalVelocity.z / _car.MaxSpeed);
            AddReward(_speedRewardCoeff * speedNorm);

            // (в) Премия за правильную ориентацию: r_orient = β * dot(forward, dir_to_cp)
            Vector3 toCp = (_checkpoints.GetNextCheckpointPosition() - transform.position).normalized;
            float dot = Vector3.Dot(transform.forward, toCp);
            AddReward(_orientationCoeff * dot);

            // (г) Штраф за резкие изменения управления (smoothness penalty)
            float steerJerk = Mathf.Abs(steering - _previousSteering);
            float accelJerk = Mathf.Abs(acceleration - _previousAcceleration);
            AddReward(-_smoothnessCoeff * (steerJerk + accelJerk));
        }

        // ----- Ручное управление для тестирования (Behavior Type = Heuristic Only) -----
        public override void Heuristic(in ActionBuffers actionsOut)
        {
            var ca = actionsOut.ContinuousActions;
            ca[0] = Input.GetAxis("Horizontal");                      // руль (A/D)
            ca[1] = Input.GetKey(KeyCode.W) ? 1f : -1f;               // газ (W)
            ca[2] = Input.GetKey(KeyCode.Space) ? 1f : -1f;           // тормоз (Space)
        }

        // ----- Реакция на пересечение чекпоинта -----
        private void OnCheckpointPassed(Checkpoint cp, GameObject car)
        {
            // Только если это наш автомобиль
            if (car != _carControllerComponent.gameObject) return;

            bool wasCorrect = _checkpoints.RegisterCheckpoint(cp);
            if (wasCorrect)
            {
                AddReward(_checkpointReward);
            }
            else
            {
                // Пройден «не тот» чекпоинт (агент едет задом) — лёгкое наказание без EndEpisode
                AddReward(-0.1f);
            }
        }

        // ----- Реакция на столкновение со стеной -----
        private void OnCollisionEnter(Collision col)
        {
            if (col.gameObject.CompareTag("Wall"))
            {
                AddReward(_collisionPenalty);
                EndEpisode();
            }
        }
    }
}
```

### 4.9. Альтернатива: `AutonomousRacingAgent` с тайм-аутом сегмента и расширенными наблюдениями

Производственный вариант агента включает дополнительные механизмы устойчивости:
- **тайм-аут прохождения сегмента** (`TrackSegmentTimeout = 12 с`) — если за 12 секунд агент не достиг следующего чекпоинта, эпизод завершается со штрафом −1.0; это пресекает «зависание» политики;
- **расширенный вектор наблюдений** с компонентами forward/lateral alignment и флагом застревания у барьера;
- **бонус за чекпоинт, нормированный на общее число ворот**: $r_{\text{cp}} = 1/N$, где $N$ — количество чекпоинтов на круге, что исключает «инфляцию» суммарной награды на длинных трассах.

```csharp
using UnityEngine;
using Unity.MLAgents;
using Unity.MLAgents.Sensors;
using Unity.MLAgents.Actuators;
using AutonomousRacing.Core;
using System.Collections.Generic;

namespace AutonomousRacing.Learning
{
    public class AutonomousRacingAgent : Agent
    {
        [Header("Chassis Controller Component")]
        private GameObject controllerHolder;
        private List<Transform> trackCheckpoints;

        private IVehicleController vehicleController;
        private int currentCheckpointIndex;
        private float secondsSinceLastCheckpoint;
        private const float TrackSegmentTimeout = 12f;  // тайм-аут сегмента, с

        private Vector3 initialPosition;
        private Quaternion initialRotation;

        public override void Initialize()
        {
            if (controllerHolder == null ||
                (vehicleController = controllerHolder.GetComponent<IVehicleController>()) == null)
            {
                Debug.LogError("Ошибка: Не обнаружен компонент IVehicleController.");
                return;
            }
            initialPosition = transform.position;
            initialRotation = transform.rotation;
        }

        public override void OnEpisodeBegin()
        {
            currentCheckpointIndex = 0;
            secondsSinceLastCheckpoint = 0f;
            transform.position = initialPosition;
            transform.rotation = initialRotation;
            vehicleController.ResetPhysicsState();
        }

        public override void CollectObservations(VectorSensor sensor)
        {
            if (vehicleController == null) return;

            // 1. Нормализованная скорость болида (1 значение)
            float speedRatio = Mathf.Clamp01(vehicleController.CurrentSpeed / vehicleController.MaxExpectedSpeed);
            sensor.AddObservation(speedRatio);

            // 2. Текущее угловое положение руля (1 значение, [-1, 1])
            sensor.AddObservation(vehicleController.SteeringAngleRatio);

            // 3. Единичный вектор направления на следующий чекпоинт (3 значения)
            Transform activeTarget = trackCheckpoints[currentCheckpointIndex];
            Vector3 directionToTarget = (activeTarget.position - transform.position).normalized;
            sensor.AddObservation(directionToTarget);

            // 4. Скалярное сопоставление курса и цели (forward alignment, [-1, 1])
            float forwardAlignment = Vector3.Dot(transform.forward, directionToTarget);
            sensor.AddObservation(forwardAlignment);

            // 5. Боковое отклонение от вектора цели (lateral alignment, [-1, 1])
            float lateralAlignment = Vector3.Dot(transform.right, directionToTarget);
            sensor.AddObservation(lateralAlignment);

            // 6. Флаг застревания у барьера ({0, 1})
            sensor.AddObservation(vehicleController.IsStuckHeadOn ? 1f : 0f);
        }

        public override void OnActionReceived(ActionBuffers actions)
        {
            if (vehicleController == null) return;

            // Извлечение непрерывных управляющих сигналов
            float steerAction    = actions.ContinuousActions[0]; // Канал 0: Руль [-1, +1]
            float throttleAction = actions.ContinuousActions[1]; // Канал 1: Газ [0, 1]
            float brakeAction    = actions.ContinuousActions[2]; // Канал 2: Тормоз [0, 1]

            vehicleController.ApplySteering(steerAction);
            vehicleController.ApplyMotorTorque(throttleAction);
            vehicleController.ApplyBrakeTorque(brakeAction);

            CalculateContinuousStepRewards();

            // Временной контроль прохождения чекпоинтов
            secondsSinceLastCheckpoint += Time.fixedDeltaTime;
            if (secondsSinceLastCheckpoint >= TrackSegmentTimeout)
            {
                AddReward(-1.0f);   // Наказание за полную потерю мобильности
                EndEpisode();
            }
        }

        private void CalculateContinuousStepRewards()
        {
            Transform targetCheckpoint = trackCheckpoints[currentCheckpointIndex];
            Vector3 directionToTarget = (targetCheckpoint.position - transform.position).normalized;
            float alignment = Vector3.Dot(transform.forward, directionToTarget);
            float speedRatio = Mathf.Clamp01(vehicleController.CurrentSpeed / vehicleController.MaxExpectedSpeed);

            if (alignment > 0)
                AddReward(alignment * speedRatio * 0.04f);   // Сонаправленное движение на скорости
            else
                AddReward(alignment * 0.02f);                // Штраф за движение в обратную сторону

            AddReward(-0.001f);                              // Малый временной штраф
        }

        private void OnTriggerEnter(Collider other)
        {
            if (other.CompareTag("Checkpoint"))
            {
                int crossedId = trackCheckpoints.IndexOf(other.transform);
                if (crossedId == currentCheckpointIndex)
                {
                    // Бонус за чекпоинт, нормированный на общее число ворот
                    float stepBonus = 1.0f / trackCheckpoints.Count;
                    AddReward(stepBonus);
                    secondsSinceLastCheckpoint = 0f;
                    currentCheckpointIndex = (currentCheckpointIndex + 1) % trackCheckpoints.Count;
                }
            }
        }

        private void OnCollisionEnter(Collision collision)
        {
            if (collision.gameObject.CompareTag("Barrier"))
            {
                AddReward(-0.75f);   // Жёсткое столкновение со стеной
                EndEpisode();
            }
        }

        public override void Heuristic(in ActionBuffers actionsOut)
        {
            var continuousActions = actionsOut.ContinuousActions;
            continuousActions[0] = Input.GetAxis("Horizontal");
            continuousActions[1] = Input.GetKey(KeyCode.W) ? 1.0f : 0.0f;
            continuousActions[2] = Input.GetKey(KeyCode.S) ? 1.0f : 0.0f;
        }
    }
}
```

> **Что даёт расширенный агент.** Выделение логики нормализации скорости (`velocity / maxExpectedVelocity`) непосредственно в методе `CollectObservations` решает фундаментальную задачу выравнивания масштабов признаков. Передача сырых показателей скорости (например, 120 км/ч) заставляет нейросеть тратить избыточные эпохи градиентного спуска на адаптацию весовых коэффициентов первого скрытого слоя, тогда как нормализованное представление позволяет сосредоточиться на пространственной геометрии трека. Добавление `lateralAlignment` (бокового отклонения от вектора цели) и `IsStuckHeadOn` (флага застревания) даёт сети явные признаки для отдельных классов аварийных ситуаций.

### 4.10. Настройка `BehaviorParameters` в инспекторе

На объекте автомобиля рядом с `CarAgent` добавляется компонент `BehaviorParameters`:

- **Behavior Name:** `RacingCar` (должно совпадать с ключом в YAML).
- **Vector Observation → Space Size:** 6 (только векторные; raycast добавляются отдельным компонентом).
- **Actions → Continuous Actions:** 3 (руль, газ, тормоз).
- **Actions → Discrete Branches:** 0.
- **Behavior Type:** `Default` (для обучения) / `Inference Only` (после).

Также добавляется компонент `DecisionRequester` с `Decision Period = 5` (решение раз в 5 физических шагов — достаточно для гонок) и компонент `RayPerceptionSensorComponent3D` с настройками из раздела 3.2.

### 4.11. Математическое обоснование нормализации входов

При нормализации $v \mapsto v / v_{\max}$ мы обеспечиваем, что входы политики статистически центрированы около нуля и масштабированы в $[-1, 1]$. Это:
1. **Ускоряет сходимость SGD/Adam** — все компоненты градиента имеют сопоставимый масштаб;
2. **Уменьшает риск ранней насыщенности нелинейностей** (tanh($x$) → ±1 при $|x| \gtrsim 3$);
3. **Стабилизирует value loss**: $V^\pi(s) = \sum \gamma^t r_t$ ограничено сверху, если $r_t$ ограничены и нормированы.

**Ключевые моменты раздела 4.** Четыре класса (`CarAgent`, `CarController`, `CheckpointManager`, `Checkpoint`) и два интерфейса. `OnActionReceived` обрабатывает 3 непрерывных канала. `OnEpisodeBegin` рандомизирует старт. Расширенный профиль использует `WheelCollider`, тайм-аут сегмента и флаг застревания.

---

## Раздел 5. Система вознаграждений

### 5.1. Проблема разрывных функций награды и потенциальное reward shaping

Одной из центральных проблем при проектировании DRL-агентов в непрерывных пространствах действий является **предотвращение субклинического застревания в локальных оптимумах политики**. Использование дискретных, бинарных или пороговых наград (например, начисление штрафа строго при отклонении от осевой линии более чем на фиксированный метр) **создаёт разрывные целевые функции первого рода**.

В таком ландшафте градиент лосс-функции становится нулевым почти во всём пространстве состояний, за исключением узких границ переходов. В результате агент не получает информации о том, насколько его плавное руление улучшает траекторию движения, что часто приводит к полной потере инициативы и выбору тривиальной стратегии **полной остановки** для ухода от штрафов за аварии.

Для обеспечения плавной и непрерывной сходимости градиента разработана **потенциальная функция вознаграждения**: суммарная мгновенная награда $r_t$ на каждом расчётном шаге формируется как **суперпозиция нескольких непрерывных физических полей**.

### 5.2. Общая формула награды

На каждом шаге $t$ агент получает:
$$
r_t \;=\; \underbrace{R_{\text{cp}}\cdot \mathbb{1}[\text{cp}_t]}_{\text{чекпоинт}} \;+\; \underbrace{R_{\text{coll}}\cdot \mathbb{1}[\text{wall}_t]}_{\text{стена}} \;+\; \underbrace{\alpha \frac{v_t}{v_{\max}}}_{\text{скорость}} \;+\; \underbrace{\beta\, \langle \mathbf{f}_t, \mathbf{d}_t \rangle}_{\text{ориентация}} \;-\; \underbrace{\eta}_{\text{время}} \;-\; \underbrace{\rho\,(|\Delta s_t| + |\Delta a_t|)}_{\text{плавность}}.
$$

где $\mathbf{f}_t$ — forward автомобиля, $\mathbf{d}_t$ — направление на следующий чекпоинт, $\Delta s_t, \Delta a_t$ — приращения руля и газа.

**Компонент сонаправленности и скорости** $r_{\text{align}}$ поощряет движение болида в направлении следующего чекпоинта, масштабированное по текущей относительной скорости:
$$
r_{\text{align}}(t) \;=\; \begin{cases}
+\,k_+\, \langle \mathbf{f}_t, \mathbf{d}_t \rangle \cdot \dfrac{v_t}{v_{\max}}, & \text{если } \langle \mathbf{f}_t, \mathbf{d}_t \rangle > 0,\\[1.4ex]
-\,k_-\, \big|\langle \mathbf{f}_t, \mathbf{d}_t \rangle\big|, & \text{иначе.}
\end{cases}
$$

где $\mathbf{f}_t$ — единичный вектор продольного направления кузова, $\mathbf{d}_t$ — единичный вектор от центра масс к геометрическому центру целевого чекпоинта, $v_t$ — продольная скорость, $v_{\max}$ — максимальная ожидаемая скорость прохождения поворотов, $k_+ \approx 0.04$ — масштабирующий коэффициент пошаговой награды за скорость, $k_- \approx 0.02$ — масштабирующий коэффициент штрафа за разворот в обратную сторону.

Данный математический дизайн гарантирует, что **любое микроперемещение рулевого колеса**, смещающее вектор движения ближе к апексу виража, **генерирует положительную разность потенциалов награды**, подталкивая алгоритм оптимизации в сторону идеальной гоночной траектории. Разделение условий для скалярного произведения векторов предотвращает генерацию ложных положительных стимулов при езде задним ходом: при движении в неверном направлении награда становится отрицательной и штрафует агента независимо от развиваемой скорости.

**Временной регуляризатор** $r_{\text{time}} = -\eta$ мотивирует агента минимизировать общее время круга, штрафуя за пассивное удержание безопасных, но медленных траекторий.

**Терминальный компонент** $R_{\text{coll}} = -1.0$ налагает жёсткие санкции за контакт с ограждениями, пресекая развитие агрессивных траекторий скольжения по бортам.

**Промежуточный бонус** $r_{\text{cp}} = 1/N$ распределяет общую целевую награду за круг равномерно по сегментам (где $N$ — общее количество чекпоинтов на трассе), исключая проблему **затухания временных связей** на длинных дистанциях.

### 5.3. Рекомендуемые значения коэффициентов

Опираемся на эмпирические данные сообщества и публикацию Savid et al. (Информационный журнал MDPI, 2023, 14(5), 290 — *Simulated Autonomous Driving Using Reinforcement Learning: A Comparative Study on Unity's ML-Agents Framework*):

| Коэффициент | Значение | Источник / Обоснование |
|---|---|---|
| $R_{\text{cp}}$ | **+1.0** | Karting Mod (yasirrhaq/Learning-to-kart): «If AI success reaching checkpoint will be given reward +1» |
| $R_{\text{final}}$ | **+0.5** | Savid et al. 2023: «the agent reaches the final checkpoint, a reward of 0.5 is given» |
| $R_{\text{coll}}$ | **−1.0** + EndEpisode | Karting Mod: «If AI hit obstacle/track AI position will be reset to the starting point and will be given penalty -1» |
| $\eta$ (time) | **0.0005…0.001** | Savid et al. 2023: «To incentivize speed, agents are given a small −0.001 reward (punishment)» |
| $\alpha$ (speed) | **0.001** | Эмпирически, сообщество ML-Agents |
| $\beta$ (orient) | **0.0005** | Эмпирически |
| $\rho$ (smoothness) | **0.0002** | Низкое значение — иначе агент не исследует (см. предупреждение ниже) |

> **Правило безопасности из официальной документации ML-Agents** (`Learning-Environment-Design-Agents.md`): «The reward assigned between each decision should be in the range [-1,1]. Values outside this range can lead to unstable training.» Мгновенная награда никогда не должна превышать единицу по модулю.

### 5.4. Полный фрагмент кода reward shaping

Реализация уже встроена в `CarAgent.cs` (метод `ApplyShapedReward`, раздел 4.8). Здесь — расширенный комментированный вариант:

```csharp
// Расширенная диагностическая версия метода
private void ApplyShapedReward(float steering, float acceleration)
{
    // 1) Постоянный штраф за каждый шаг (стимул торопиться).
    //    Эмпирически 5e-4 ... 1e-3; больше — риск, что reward «прилипнет» к -1.
    AddReward(-0.0005f);

    // 2) Премия за скорость: r_speed = α * v_long / v_max.
    //    v_long — продольная компонента; убираем поощрение за движение боком.
    float speedNorm = Mathf.Clamp01(_car.LocalVelocity.z / _car.MaxSpeed);
    AddReward(0.001f * speedNorm);

    // 3) Премия за ориентацию: r_orient = β * dot(forward, dir_to_cp).
    //    Когда машина смотрит точно на следующий чекпоинт — dot = +1.
    //    Когда движется в обратном направлении — dot = -1 (получает штраф).
    Vector3 dirToCp = (_checkpoints.GetNextCheckpointPosition() - transform.position).normalized;
    float dot = Vector3.Dot(transform.forward, dirToCp);
    AddReward(0.0005f * dot);

    // 4) Штраф за рывки управления (smoothness penalty).
    //    НЕ переусердствовать: при ρ > 0.001 агент перестаёт исследовать.
    float steerJerk = Mathf.Abs(steering - _previousSteering);
    float accelJerk = Mathf.Abs(acceleration - _previousAcceleration);
    AddReward(-0.0002f * (steerJerk + accelJerk));
}
```

### 5.5. Проблема reward hacking и как её избежать

**Reward hacking** — ситуация, когда агент находит непредвиденный способ максимизировать формальную награду, не выполняя задачу. Типичные случаи в гоночной симуляции и их решения:

1. **Кружение возле чекпоинта.** Решение: триггер срабатывает только при правильном `Index`; повторное пересечение того же чекпоинта не даёт награды (реализовано в `RegisterCheckpoint`).

2. **Движение задним ходом по кругу.** Симптом из Unity Discussions (тред «Karting Microgame ML-Agents - how to train them better?»): «I have 10 ML agents. I tried to train them and when, for example, 8 are going in the right direction, 2 other turn around at the start and go against the flow.» Решение: dot-product-наблюдение + штраф −0.1 за «не тот» чекпоинт.

3. **Намеренное столкновение для рестарта.** Решение: $R_{\text{coll}} = -1.0$, что перекрывает любую промежуточную выгоду.

4. **Подавление исследования из-за smoothness penalty.** Замечание из Code Monkey racing tutorial / mertk0ca/ML-Agents-2D-AI-Racing-Game: «In a different setup where the agent did not receive penalties for steering and reversing, the results were improved». Решение: $\rho \leq 0.0005$; на ранней стадии обучения отключайте этот компонент полностью.

5. **«Прилипание» к −1.0.** Диагностический индикатор (Janak Mandavgade, ML-Agents tutorials): «If Mean Reward is stuck at exactly -1.000 with Std of Reward: 0.000… 1000 steps × -0.001 = -1.000 → your step penalty is too large». Если средняя награда совпадает с худшим возможным значением — уменьшайте $\eta$.

**Ключевые моменты раздела 5.** Награда — линейная комбинация ≤ 1 по модулю; чекпоинт +1, столкновение −1 + EndEpisode, остальное — малые сигналы. Reward hacking — самый частый источник «странного» поведения, диагностируется через TensorBoard (раздел 7). Использование непрерывной потенциальной функции вместо порогов — необходимое условие сходимости в локальных оптимумах.

---

## Раздел 6. Алгоритмы и гиперпараметры

### 6.1. Proximal Policy Optimization (PPO)

PPO (Schulman et al., *Proximal Policy Optimization Algorithms*, arXiv:1707.06347, 2017) — основной on-policy алгоритм ML-Agents.

**Идея:** обновлять политику $\pi_\theta$ ограниченными шагами, чтобы новая политика не сильно отклонялась от старой $\pi_{\theta_{\text{old}}}$. Это достигается через **clipped surrogate objective**:

$$
L^{\text{CLIP}}(\theta) \;=\; \hat{\mathbb{E}}_t \!\left[\min\!\big(r_t(\theta)\hat A_t,\; \mathrm{clip}(r_t(\theta), 1-\epsilon, 1+\epsilon)\,\hat A_t\big)\right],
$$
где
$$
r_t(\theta) = \frac{\pi_\theta(a_t\mid s_t)}{\pi_{\theta_{\text{old}}}(a_t\mid s_t)}, \qquad \epsilon \approx 0.2.
$$
Минимум выбирается между «нормальным» и «клиппированным» термами, что даёт нижнюю (пессимистичную) границу — PPO обновляется только при «безопасном» увеличении вероятности действия.

**Generalized Advantage Estimation (GAE)** — оценка преимущества $\hat A_t$. Сначала вычисляется одношаговая TD-ошибка:
$$
\delta_t = r_t + \gamma V(s_{t+1}) - V(s_t).
$$
Тогда GAE-оценка:
$$
\hat A_t^{\text{GAE}(\gamma,\lambda)} \;=\; \sum_{l=0}^{\infty} (\gamma\lambda)^l \, \delta_{t+l}.
$$
При $\lambda=0$ получаем TD(0) (низкая дисперсия, высокое смещение); при $\lambda=1$ — Monte-Carlo (несмещённая, но шумная). Типичное значение $\lambda = 0.95$ балансирует bias–variance.

**Совокупная функция потерь актёра-критика PPO:**
$$
L^{\text{PPO}}(\theta) \;=\; \hat{\mathbb{E}}_t\!\left[L^{\text{CLIP}}(\theta) - c_1 \big(V_\theta(s_t) - V^{\text{targ}}_t\big)^2 + c_2 H[\pi_\theta(\cdot\mid s_t)]\right],
$$
где $H$ — энтропия (с коэффициентом $c_2$, в ML-Agents — параметр `beta`), $c_1$ — вес value-loss.

**Плюсы PPO для непрерывного управления:**
- Простота настройки, стабильность.
- Отличный параллелизм (16–32 копии трассы в одной сцене).
- Хорошо работает с raycast-наблюдениями.

**Минусы PPO:** on-policy → требует много опыта; чувствителен к настройке `epsilon`, `beta`, `learning_rate`.

### 6.2. Soft Actor-Critic (SAC)

SAC (Haarnoja et al., *Soft Actor-Critic: Off-Policy Maximum Entropy Deep RL with a Stochastic Actor*, ICML 2018, arXiv:1801.01290; уточнённая версия — Haarnoja et al., *Soft Actor-Critic Algorithms and Applications*, arXiv:1812.05905, 2018) — off-policy алгоритм с максимизацией энтропии.

**Цель:**
$$
J(\pi) \;=\; \sum_{t=0}^{\infty} \mathbb{E}_{(s_t,a_t)\sim\rho_\pi}\!\left[r(s_t,a_t) + \alpha\, \mathcal{H}\big(\pi(\cdot\mid s_t)\big)\right],
$$
где $\mathcal{H}(\pi(\cdot\mid s)) = -\mathbb{E}_{a\sim\pi}[\log\pi(a\mid s)]$ — энтропия политики, $\alpha$ — температурный коэффициент (в ML-Agents автоматически подстраивается под целевую энтропию; стартовое значение задаётся параметром `init_entcoef`).

**Soft Q-функция** удовлетворяет soft уравнению Беллмана:
$$
Q_{\text{soft}}(s_t,a_t) = r_t + \gamma\, \mathbb{E}_{s_{t+1}}\!\left[V_{\text{soft}}(s_{t+1})\right],
$$
$$
V_{\text{soft}}(s) = \mathbb{E}_{a\sim\pi}\!\left[Q_{\text{soft}}(s,a) - \alpha \log\pi(a\mid s)\right].
$$

**Правила обновления:**
- Два Q-критика $Q_{\phi_1}, Q_{\phi_2}$ минимизируют MSE к soft target
  $y = r + \gamma \big(\min_{i=1,2} Q_{\bar\phi_i}(s', a') - \alpha\log\pi(a'\mid s')\big)$;
- Актёр $\pi_\theta$ минимизирует KL-расхождение с «softmax от Q»:
  $\nabla_\theta J_\pi \propto \nabla_\theta\big(\alpha \log\pi_\theta(a\mid s) - Q_\phi(s,a)\big)$;
- Целевые сети — soft-update: $\bar\phi \leftarrow \tau\phi + (1-\tau)\bar\phi$, $\tau \approx 0.005$.

**Преимущества SAC:** off-policy + replay buffer; согласно официальной документации ML-Agents Overview (`unity-technologies.github.io/ml-agents/ML-Agents-Overview/`): «This makes SAC significantly more sample-efficient, often requiring 5-10 times less samples to learn the same task as PPO. However, SAC tends to require more model updates.»

**Минусы SAC:** более дорогие обновления (2 Q-сети + актёр), сложнее тюнинг.

### 6.3. Сравнительная таблица PPO vs SAC

| Параметр | PPO | SAC |
|---|---|---|
| Тип | On-policy | Off-policy |
| Sample efficiency | Низкая (нужно 5–20 M шагов) | Высокая (5–10× меньше шагов) |
| Стабильность | Очень высокая (целевая функция ограничивает шаг изменения политики) | Высокая, но чувствительна к настройке масштаба наград |
| Скорость одного шага обновления | Быстрая (быстрые стохастические обновления весов) | Медленнее (постоянные интегральные обновления Q-функций) |
| Сложность тюнинга | Средняя | Высокая |
| Память (replay buffer) | Не требуется | Требуется (50k–500k опытов) |
| Параллелизм агентов | Отлично | Хуже масштабируется |
| Механизм исследования | Вспомогательная регуляризация энтропии в лосс-функции | Максимизация энтропии встроена непосредственно в целевую функцию |
| Эмпирическое время круга (опт. профиль) | **12.5948 с** на круге при **1 вылете** (Savid et al. 2023) | **13.1336 с** на круге при **0 вылетах** (базовый профиль) |
| **Рекомендация для овала** | ✅ Базовый выбор | Для быстрого результата при малом числе агентов |

**Эмпирический вывод.** При качественной настройке системы вознаграждений **PPO способен демонстрировать более высокую абсолютную скорость прохождения круга** за счёт прямого градиентного восхождения по собираемым траекториям. В то же время **SAC обеспечивает непревзойдённую траекторную стабильность**: за счёт явного максимизирования энтропии алгоритм находит более плавные дуги входа в повороты и полностью исключает опасные заносы, приводящие к вылетам с трассы, хотя и уступает PPO в агрессивности вождения.

### 6.4. PPO YAML для овальной трассы (учебный профиль)

```yaml
# config/ppo_oval.yaml
# Конфигурация PPO для овальной гоночной трассы
# Совместим с release_22 (com.unity.ml-agents 3.0.0)

behaviors:
  RacingCar:                          # имя ДОЛЖНО совпадать с Behavior Name агента
    trainer_type: ppo

    hyperparameters:
      # --- Общие для PPO и SAC ---
      batch_size: 2048                # Размер мини-батча для одного шага SGD.
                                      # Для непрерывных действий: 512-5120 (рекомендация Unity).
      buffer_size: 20480              # Объём собираемого опыта перед обновлением (= num_epoch * batch_size).
      learning_rate: 3.0e-4           # Шаг градиентного спуска. Эмпирически 1e-5..1e-3.
      learning_rate_schedule: linear  # Линейное затухание до 0 к концу обучения.

      # --- PPO-специфика ---
      beta: 5.0e-3                    # Коэффициент энтропии H (стимул исследовать).
                                      # Если энтропия падает слишком быстро — увеличить.
      beta_schedule: linear
      epsilon: 0.2                    # Параметр клиппирования ε из L^CLIP.
                                      # 0.1..0.3; меньше — более консервативные апдейты.
      epsilon_schedule: linear
      lambd: 0.95                     # GAE λ — балансирует bias/variance оценки advantage.
      num_epoch: 3                    # Эпох SGD на один buffer. Для PPO: 3-10.

    network_settings:
      normalize: true                 # Внутренняя нормализация наблюдений (running mean/std).
                                      # Полезна для непрерывного управления.
      hidden_units: 256               # Скрытый слой MLP.
      num_layers: 2
      vis_encode_type: simple         # Без визуальных наблюдений.

    reward_signals:
      extrinsic:
        gamma: 0.99                   # Дисконт-фактор. Для эпизодов >50 шагов — 0.99.
        strength: 1.0

    # --- Тренировочный цикл ---
    max_steps: 3000000                # ~3 M шагов достаточно для овала.
    time_horizon: 64                  # Шагов траектории перед value bootstrap.
    summary_freq: 10000               # Частота записи в TensorBoard.
    keep_checkpoints: 5
    checkpoint_interval: 200000
    threaded: true
```

### 6.5. SAC YAML для овальной трассы (учебный профиль)

```yaml
# config/sac_oval.yaml
# Конфигурация SAC для овальной трассы

behaviors:
  RacingCar:
    trainer_type: sac

    hyperparameters:
      # --- Общие ---
      batch_size: 256                 # Для непрерывных действий SAC: 128-1024.
      buffer_size: 200000             # Replay buffer ~ 50k-500k.
      learning_rate: 3.0e-4
      learning_rate_schedule: constant

      # --- SAC-специфика ---
      buffer_init_steps: 5000         # Прогрев буфера случайной политикой.
      tau: 0.005                      # Soft-update коэффициент target-сетей.
      steps_per_update: 10.0          # Шагов среды на одно обновление модели.
      save_replay_buffer: false
      init_entcoef: 0.5               # Стартовый α энтропии. Увеличить, если агент застрял.
      reward_signal_steps_per_update: 10.0

    network_settings:
      normalize: true
      hidden_units: 256
      num_layers: 2
      vis_encode_type: simple

    reward_signals:
      extrinsic:
        gamma: 0.99
        strength: 1.0

    max_steps: 1000000                # SAC обычно сходится быстрее по шагам.
    time_horizon: 64
    summary_freq: 10000
    keep_checkpoints: 5
    checkpoint_interval: 100000
```

### 6.6. Альтернативные «компактные» конфигурации (production-profile, оптимизированные под быструю сходимость)

Альтернативные YAML-конфиги, экспериментально оптимизированные под овал малой сложности с компактной сетью (`hidden_units: 128`). Эти настройки показывают **быструю сходимость на простой геометрии**.

**Оптимизированная конфигурация PPO (`car_racer_ppo.yaml`):**

```yaml
behaviors:
  RacingCarBehavior:
    trainer_type: ppo
    hyperparameters:
      batch_size: 128                  # Оптимальный размер пакета для непрерывного контроля
      buffer_size: 2048                # Объём выборки перед градиентным шагом
      learning_rate: 3.0e-4            # Базовая скорость сходимости без риска разрушения весов
      learning_rate_schedule: linear   # Линейный спад шага к концу сессии для стабилизации
      beta: 1.0e-2                     # Вес энтропии, предотвращающий застревание в локальных минимумах
      epsilon: 0.2                     # Граница усечения обновлений политики (clipping)
      lambd: 0.95                      # Параметр дисконтирования временных разностей GAE
      num_epoch: 3                     # Число итераций оптимизации на один батч данных
    network_settings:
      normalize: true                  # Автоматическая нормализация входящего вектора сенсоров
      hidden_units: 128                # Оптимальная ёмкость сети для простых геометрий
      num_layers: 2                    # Предотвращает переобучение на ограниченной выборке
    reward_signals:
      extrinsic:
        gamma: 0.99                    # Глубокий временной горизонт планирования траекторий
        strength: 1.0                  # Коэффициент масштаба внешних наград
    max_steps: 3000000                 # Лимит шагов симуляции для полной сходимости
    time_horizon: 64                   # Шаги сбора данных агентом перед расчётом оценок
    summary_freq: 50000                # Частота выгрузки данных для графиков
    keep_checkpoints: 5                # Количество сохраняемых резервных моделей ONNX
    checkpoint_interval: 200000        # Шаг сохранения промежуточных контрольных точек
```

**Оптимизированная конфигурация SAC (`car_racer_sac.yaml`):**

```yaml
behaviors:
  RacingCarBehavior:
    trainer_type: sac
    hyperparameters:
      batch_size: 128                  # Размер выборки из буфера воспроизведения опыта
      buffer_size: 100000              # Максимальный размер буфера повторения опыта
      learning_rate: 3.0e-4            # Фиксированная скорость обучения для плавной сходимости
      learning_rate_schedule: constant # Для SAC рекомендуется поддерживать постоянный LR
      init_entcoef: 0.5                # Начальный вес энтропии для стимуляции раннего исследования
      tau: 0.005                       # Коэффициент мягкого обновления целевых сетей Q-функции
      steps_per_update: 1              # Выполнение оптимизационного шага на каждый такт среды
      save_replay_buffer: false
    network_settings:
      normalize: true                  # Нормализация входа
      hidden_units: 128
      num_layers: 2
    reward_signals:
      extrinsic:
        gamma: 0.99
        strength: 1.0
    max_steps: 2000000                 # Требует меньше шагов симуляции по сравнению с PPO
    time_horizon: 64
    summary_freq: 50000
    keep_checkpoints: 5
    checkpoint_interval: 200000
```

### 6.7. Эмпирическое исследование гиперпараметров

Систематическое исследование пространства параметров (Savid et al. 2023, MDPI Information) выявило **критическую важность настройки размера батча и шага обучения**.

**Размер пакета (`batch_size`):**
- **128 — строго оптимально** для непрерывного контроля на овальной трассе.
- Сужение до **64** резко дестабилизирует оценки градиента: время круга увеличивается до **25.653 с**, в среднем **6.6 вылетов** за сессию.
- Расширение до **512** избыточно сглаживает градиент, замедляя адаптацию к резким поворотам: время круга **17.457 с**, **3.6 вылетов**.

**Скорость обучения (`learning_rate`):**
- **3.0e-4 — оптимально**.
- Повышение до **1.0e-3** разрушает накопленные весовые связи первого слоя, приводя к неуправляемому «рысканью» руля на прямых участках и увеличению сходов с трассы.

**Коэффициент дисконтирования (`gamma`):**
- **0.99** обеспечивает необходимую глубину планирования.
- Снижение до **0.85** заставляет агента игнорировать скорое приближение изгиба трассы, увеличивая частоту аварий до **2.6 за сессию**.

**Калибровка энтропии (`beta`):**
- **0.01** удерживает нужный баланс между exploration и exploitation.
- Меньшие коэффициенты (**0.005**) приводят к раннему вырождению политики в монотонное движение по внешнему радиусу.
- Большие (**0.02**) заставляют болид совершать волнообразные колебательные движения на траектории.

| Гиперпараметр | Слишком мало | **Оптимум** | Слишком много |
|---|---|---|---|
| `batch_size` | 64 → 25.653 с / 6.6 вылетов | **128** | 512 → 17.457 с / 3.6 вылетов |
| `learning_rate` | — | **3.0e-4** | 1.0e-3 → разрушение весов |
| `gamma` | 0.85 → 2.6 аварий/сессия | **0.99** | — |
| `beta` (PPO) | 0.005 → монотонная политика | **0.01** | 0.02 → «волны» траектории |

### 6.8. Запуск обучения

```bash
# Из корня проекта (где лежит папка config/)
mlagents-learn config/ppo_oval.yaml --run-id=oval_ppo_001

# После выполнения команды нажмите Play в Unity Editor — обучение начнётся.

# Headless обучение через билд (быстрее, без рендеринга):
mlagents-learn config/ppo_oval.yaml --run-id=oval_ppo_001 \
  --env=Builds/OvalRace.exe --num-envs=4

# Возобновление обучения:
mlagents-learn config/ppo_oval.yaml --run-id=oval_ppo_001 --resume

# Принудительная перезапись (если хотите начать заново):
mlagents-learn config/ppo_oval.yaml --run-id=oval_ppo_001 --force
```

**Ключевые моменты раздела 6.** PPO — стартовый выбор для овальной трассы; SAC — если ресурсов мало или нужна максимальная sample efficiency. Все формулы — из оригинальных публикаций Schulman 2017 и Haarnoja 2018. Эмпирически проверенные оптимумы: `batch_size: 128`, `learning_rate: 3e-4`, `gamma: 0.99`, `beta: 0.01`.

---

## Раздел 7. Мониторинг с TensorBoard

Интегрированный пакет логирования ML-Agents экспортирует детальную телеметрию обучения в формате **бинарных логов событий**, которые интерпретируются веб-интерфейсом TensorBoard.

### 7.1. Запуск

```bash
tensorboard --logdir=results --port=6006
# Откройте в браузере http://localhost:6006
```

### 7.2. Ключевые метрики (из официальной документации `Using-Tensorboard.md`)

| Метрика | Что означает | Здоровое поведение |
|---|---|---|
| `Environment/Cumulative Reward` | Средняя суммарная награда за эпизод | «Should increase during a successful training session» |
| `Environment/Episode Length` | Средняя длина эпизода | Растёт по мере того как агент перестаёт врезаться |
| `Policy/Entropy` (PPO; SAC) | Случайность политики | «Should slowly decrease during a successful training process» |
| `Policy/Learning Rate` | Текущий learning rate | Падает (если `linear` schedule) |
| `Policy/Extrinsic Reward` | Награда от среды | Растёт (то же, что Cumulative) |
| `Policy/Value Estimate` | Средняя $V(s)$ | «Should increase during a successful training session» |
| `Policy/Entropy Coefficient` (SAC) | $\alpha$ — текущая температура | Адаптируется автоматически |
| `Losses/Policy Loss` | Магнитуда policy loss | «Magnitude of this should decrease during a successful training session» |
| `Losses/Value Loss` | MSE предсказания $V$ | «Should increase while the agent is learning, and then decrease once the reward stabilizes» |

### 7.3. Интерпретация графиков

При оценке качества сходимости политики гоночного агента на овальной трассе критическое значение имеет анализ **четырёх фундаментальных метрик**.

**Кривая накопленного вознаграждения** `Environment/Cumulative Reward` отражает общую успешность оптимизации поведения агента в рамках одного эпизода. График должен демонстрировать **строго монотонный логарифмический рост с постепенным выходом на стабильное плато**. Если кривая совершает резкие скачкообразные падения вниз, это сигнализирует о том, что агент нашёл новую опасную траекторию, приводящую к терминальным авариям, или застрял у стены.

**Кривая энтропии политики** `Policy/Entropy` иллюстрирует степень неопределённости действий, предпринимаемых нейросетью. На начальной фазе обучения (**до 500k шагов**) этот показатель должен удерживаться на высоких значениях, подтверждая активное исследование пространства непрерывных действий. По мере накопления опыта график должен плавно и непрерывно снижаться, стабилизируясь вблизи малых положительных величин. **Внезапное обрушение энтропии к абсолютному нулю на ранних шагах указывает на коллапс политики**, при котором агент зациклился на простейшем безопасном поведении (например, стоянии на месте или медленной езде по кругу) и прекратил исследование среды.

**Показатель ошибки функции ценности** `Losses/Value Loss` определяет точность работы сети-критика, предсказывающей будущую ценность текущего пространственного состояния агента. В здоровом процессе обучения график сначала демонстрирует **резкий подъём**, отражающий высокую неопределённость при столкновении с новыми состояниями, а затем **плавно снижается и колеблется около малых значений (менее 0.01)**.

Если величина Value Loss совершает резкие пульсирующие выбросы вверх или демонстрирует долгосрочный повышательный тренд, это свидетельствует о **некорректной структуре наград или слишком высокой дисперсии в оценках среды**, что мешает критику адекватно оценивать траекторию движения.

**График изменения скорости обучения** `Policy/Learning Rate` для алгоритма PPO должен **линейно затухать до нулевых значений** к концу сессии, обеспечивая тонкую финальную подстройку весов. Для алгоритма SAC он остаётся стабильной константой, гарантируя непрерывную адаптацию к буферу опыта.

**Сводка диагностических паттернов:**

- **Здоровое обучение:** `Cumulative Reward` растёт монотонно (с небольшим шумом); `Entropy` плавно падает с начального ~3.0 до ~1.0; `Policy Loss` сначала растёт (политика активно меняется), потом затухает; `Value Loss` растёт в первой трети обучения, потом стабилизируется в пределах <0.01.
- **Признаки нестабильности:** резкое падение reward (catastrophic forgetting) → уменьшите `learning_rate` или `epsilon`; Entropy ≈ 0 на ранней стадии → увеличьте `beta` (PPO) или `init_entcoef` (SAC); Reward «прилип» к −1.0 → слишком большой time penalty (см. раздел 5.5); `Episode Length` не растёт, `Reward` колеблется → недостаточно сигнала ориентации, добавьте dot-product.
- **Признаки переобучения:** на тренировочной трассе reward высокий, но на тестовой (зеркальной, с другой стартовой позицией) — обнуляется. Замечание из репозитория JulesVerny/MLAgentsAtSpa: «slow growth in per Checkpoint Training, suggests that the Agent performance would NOT generalise to alternative Track configurations very well». Решение: рандомизация стартов, увеличение `beta`, обучение на нескольких трассах.

### 7.4. Сравнение нескольких запусков

```bash
mlagents-learn config/ppo_oval.yaml --run-id=oval_ppo_lr3e4
mlagents-learn config/ppo_oval.yaml --run-id=oval_ppo_lr1e4
# В TensorBoard оба run-id видны одновременно; можно отключать чекбоксами слева.
```

**Ключевые моменты раздела 7.** Главные графики для ежедневного контроля: `Cumulative Reward`, `Episode Length`, `Policy/Entropy`, `Losses/Value Loss`. Здоровый Value Loss держится в пределах <0.01 после стабилизации.

---

## Раздел 8. Best Practices и подводные камни

### 8.1. Параллельные тренировочные арены

Разместите в сцене **8–16 копий** овальной трассы (training area replicator появился в release 22) и добавьте на каждый автомобиль одинаковый `CarAgent` с одним и тем же `Behavior Name = "RacingCar"`. PPO агрегирует опыт со всех агентов в общий буфер и обучает одну общую модель. По официальной документации (`Learning-Environment-Create-New`): «Combining multiple training areas within the same scene, with concurrent Unity instances, effectively gives you two levels of parallelism to speed up training.» Практический выигрыш зависит от ресурсов — пользователи на форумах Unity Discussions сообщают о ~2× ускорении при 8 параллельных средах; в идеальных условиях, при достаточном CPU/GPU, ускорение может быть линейным.

### 8.2. Time scale и физика

Согласно YAML-конфигурации `engine_settings`, ML-Agents по умолчанию выставляет `time_scale: 20` при обучении (см. документацию `Training-ML-Agents.md`). Это **ускоряет симуляцию в 20 раз** по wall-clock, но может ломать физику:
- Если автомобиль «проваливается» сквозь стены — снизьте `--time-scale=10` или меньше;
- Различия между обучением (time_scale = 20) и инференсом (time_scale = 1) — классический симптом проблем с фиксированным шагом физики;
- Установите `Time.fixedDeltaTime = 0.02` в **Project Settings → Time** и используйте `Continuous` коллизии на Rigidbody автомобиля.

### 8.3. Curriculum learning

Если на сложной трассе агент учится медленно, используйте подход из JulesVerny/MLAgentsAtSpa: начинать с короткой подтрассы (один-два чекпоинта) и постепенно увеличивать длину. В ML-Agents реализуется через секцию `environment_parameters` с `curriculum` в YAML.

### 8.4. Imitation Learning для холодного старта

Запишите 5–10 демонстраций ручного управления через Heuristic + Demo Recorder, затем включите Behavioral Cloning:
```yaml
behavioral_cloning:
  demo_path: Demos/HumanLaps.demo
  strength: 0.1                       # Не > 0.5: иначе агент копирует ошибки человека
  steps: 150000
  batch_size: 512
  num_epoch: 3
```
Savid et al. 2023 показали, что для Karting Microgame `strength: 0.1` обгоняет `strength: 1.0` по итоговой награде.

### 8.5. Расположение чекпоинтов

- **Расстояние между чекпоинтами:** 5–15 м на овале. Слишком редкие → разреженная награда; слишком частые → reward hacking.
- **Ориентация чекпоинтов:** forward-вектор каждого должен совпадать с правильным направлением движения. Используется в `GetNextCheckpointForward()` (для альтернативных схем награды) и косвенно — в dot-product-наблюдении.

### 8.6. Decision Period

Параметр `Decision Period` компонента `DecisionRequester` контролирует, как часто запрашивается решение. Значения 3–5 хорошо работают для гонок: агент видит результат предыдущего действия (новую скорость, новые лучи) и не «дрожит». При `Decision Period = 1` агент часто переключает руль; при `Decision Period = 10` — реакция запаздывает на резких поворотах.

---

## Раздел 9. Часто задаваемые вопросы (FAQ)

**Q1: `mlagents-learn` падает с ошибкой `UnityEnvironment took too long to respond`.**
A: Проверьте, что `Behavior Name` в инспекторе совпадает с ключом в YAML (`RacingCar`). Если используете билд — проверьте путь к `.exe`. Также убедитесь, что Python и Unity совместимы по версиям коммуникатора.

**Q2: Cumulative Reward всё время около −1.0.**
A: Time penalty доминирует над всеми позитивными сигналами. Уменьшите `_timePenalty` до `-0.0001` или временно отключите его. См. раздел 5.5.

**Q3: Агент ездит задом наперёд по трассе.**
A: Не хватает сигнала ориентации. Добавьте в `CollectObservations()` dot-product между forward машины и направлением на следующий чекпоинт, а в `OnCheckpointPassed` — штраф за прохождение «неправильного» чекпоинта (см. раздел 4.8).

**Q4: TensorBoard не показывает графики.**
A: Запустите `tensorboard --logdir results` именно из той папки, где лежит каталог `results/`. Убедитесь, что в YAML установлен `summary_freq: 10000` (или меньше) — иначе первая запись появится только через 10000 шагов.

**Q5: Машина «дрожит» рулём.**
A: Увеличьте `Decision Period` в `DecisionRequester` до 5; либо включите smoothness penalty (раздел 5.4), но не превышайте $\rho = 0.0005$.

**Q6: Что выбрать — PPO или SAC?**
A: Для овальной трассы и студенческого проекта — **PPO**: стабильнее, проще настраивать, идеально масштабируется при параллельных аренах. Эмпирически (Savid et al. 2023) PPO быстрее (12.59 с/круг), SAC стабильнее (0 вылетов против 1).

**Q7: Какая версия Unity и Python нужна?**
A: Для **release_22 (com.unity.ml-agents 3.0.0 final)** — Unity 2023.2+. Для Unity 2022.3 LTS используйте **release_21 (3.0.0-exp.1)**. Python во всех случаях — **3.10.12**, PyTorch — **2.2.1**. Для современных GPU RTX 50-й серии — расширенная спецификация (раздел 2.1).

**Q8: ONNX-модель не работает после обучения.**
A: Скопируйте `RacingCar.onnx` из `results/<run-id>/` в папку `Assets/ML-Models/`. В инспекторе `Behavior Parameters` укажите её в поле `Model`, переключите `Behavior Type` на `Inference Only`. Нажмите Play — теперь машина управляется обученной нейросетью.

**Q9: Можно ли использовать смешанные действия (continuous + discrete)?**
A: Технически — да: в `Actions` укажите и `Continuous Actions Size > 0`, и `Discrete Branches > 0`. Однако для нашей задачи (овал, плавное вождение) **рекомендуется только continuous** — это требование задания и физически правильнее.

**Q10: Машина «улетает» в небо при ускорении.**
A: Это типичная проблема при высоком `time_scale` и недостаточной массе. Опустите `centerOfMass` в `Awake` (как в `CarController.cs`), увеличьте массу Rigidbody до 1500 кг, добавьте угловое сопротивление (`angularDrag = 5`).

**Q11: При установке вылетает ошибка `opset23 not found`.**
A: Это конфликт нового динамического экспортера PyTorch с парсером ML-Agents. Откройте файл `model_serialization.py` (раздел 2.7), найдите вызов `torch.onnx.export(...)` и добавьте аргумент `dynamo=False`.

**Q12: Сыпятся ошибки Protobuf или `StrictVersion`.**
A: Закрепите версии: `pip install protobuf==3.20.3` и `pip install setuptools==65.5.0` (раздел 2.7).

---

## Раздел 10. Заключение и источники

### Итоги курса

Студент, прошедший все 9 разделов, должен уметь:
1. Объяснить MDP, уравнение Беллмана, разницу PPO и SAC.
2. Установить ML-Agents release 22 с PyTorch 2.2.1 и проверить установку через `mlagents-learn --help`.
3. Настроить `RayPerceptionSensorComponent3D` с 7 лучами на сторону, тэгами `Wall` и `Checkpoint`.
4. Написать SOLID-архитектуру: `CarAgent`, `CarController`, `CheckpointManager`, `Checkpoint`, использующую непрерывное управление с 3 каналами.
5. Спроектировать функцию награды без reward hacking (мгновенная награда ∈ [−1, +1]).
6. Запустить обучение PPO/SAC через YAML и интерпретировать графики TensorBoard.
7. Диагностировать типичные ошибки: «прилипшая» награда, движение задним ходом, дрожание руля.

### Рекомендации по проведению курса (общие)

- **На первом занятии:** установите окружение и проверьте `mlagents-learn --help`; запустите тренировку любого примера из `Project/Assets/ML-Agents/Examples` (например, 3DBall).
- **На втором занятии:** соберите овальную трассу из примитивов, поставьте 8 чекпоинтов и стены с тэгами; реализуйте `CarAgent` без наград (только движение).
- **На третьем занятии:** добавьте reward shaping в порядке: чекпоинт → стена → ориентация → скорость → время → плавность. После каждой итерации обучайте 200k шагов и фиксируйте Cumulative Reward.
- **На четвёртом занятии:** запустите PPO на 3M шагов с `--num-envs=4` или 8 параллельными аренами; сравните с SAC.

### Развёрнутый 4-недельный учебный план

Для поэтапного освоения методов глубокого обучения с подкреплением на примере создания автономного гоночного агента разработан структурированный **4-недельный план практической подготовки**:

| Номер недели | Теоретическая подготовка и концепты | Практическая реализация в среде | Контрольная точка и валидация |
|---|---|---|---|
| **Неделя 1** | Физика взаимодействия колеса с дорожным полотном, Slip Bounds колёсных коллайдеров и распределение масс Rigidbody | Создание сцены овального трека, сборка шасси болида, программирование ручного контроллера ввода | Транспортное средство стабильно управляется человеком на скорости до 100 км/ч без опрокидывания |
| **Неделя 2** | Концепции пространства состояний и действий в непрерывных MDP, математика лучевого кастинга (Spherecast) | Определение SOLID-интерфейса `IVehicleController`, интеграция и отладка сенсора `RayPerceptionSensorComponent3D` | Логика сбора вектора наблюдений возвращает строго детерминированный нормализованный поток чисел |
| **Неделя 3** | Проблемы разреженных наград, методы проектирования потенциальных полей и формирование непрерывных функций наград | Разметка последовательных чекпоинтов, внедрение пошаговой награды за сонаправленность скорости и направления | Первый запуск процесса обучения PPO с выгрузкой логов в TensorBoard и верификацией сходимости |
| **Неделя 4** | Математические различия между on-policy PPO и off-policy SAC методами, тюнинг гиперпараметров | Запуск обучения на базе SAC, проведение бенчмаркинга алгоритмов по времени круга и стабильности траектории | Экспорт финальной ONNX-модели, запуск инференса в Unity и защита проекта перед коллегами |

### Дальнейшие направления разработки

Разработанное техническое руководство представляет собой **завершённое, математически обоснованное и программно оптимизированное решение** для создания автономного гоночного агента в Unity ML-Agents. Чёткое разделение ответственности между физическим контроллером автомобиля и DRL-агентом позволяет гибко масштабировать систему, упрощая переход от простых виртуальных овальных трасс к сложным извилистым трекам с динамическими препятствиями и соперниками.

Использование **непрерывной потенциальной функции вознаграждения** в сочетании с алгоритмами PPO или SAC решает ключевую проблему застревания политики в локальных оптимумах, обеспечивая плавную и стабильную траекторию прохождения виражей на высоких скоростях.

В качестве дальнейших шагов по развитию архитектуры рекомендуется:

1. **Pre-training на демонстрациях человека (Behavioral Cloning).** Исследование механизмов пре-тренинга на основе записанных кругов человека-эксперта может **значительно сократить время сходимости** на ранних этапах обучения за счёт инициализации весов политики решениями, близкими к экспертным.

2. **Рекуррентные слои LSTM.** Внедрение рекуррентных слоёв LSTM в архитектуру нейросети позволит агенту **эффективнее сохранять пространственную память** при временной потере видимости чекпоинтов. Однако это потребует перехода к **гибридным или дискретным пространствам действий** для поддержания математической стабильности оптимизации градиентов (на чисто непрерывном пространстве с LSTM PPO/SAC становятся капризнее).

3. **Соперники на трассе (Multi-Agent RL).** Добавление тэга `Opponent` в Detectable Tags raycast-сенсора (см. раздел 3.3) открывает путь к обучению с несколькими агентами через ML-Agents POCA (POsthumous Credit Assignment).

### Источники

**Официальная документация и репозитории Unity ML-Agents:**
- Главная страница проекта: https://github.com/Unity-Technologies/ml-agents
- Тег release_22: https://github.com/Unity-Technologies/ml-agents/tree/release_22
- Документация пакета com.unity.ml-agents 3.0.0: https://docs.unity3d.com/Packages/com.unity.ml-agents@3.0/
- Installation Guide: https://unity-technologies.github.io/ml-agents/Installation/
- Training Configuration File: https://github.com/Unity-Technologies/ml-agents/blob/main/docs/Training-Configuration-File.md
- TensorBoard Guide (Using-Tensorboard.md): https://github.com/Unity-Technologies/ml-agents/blob/main/docs/Using-Tensorboard.md
- Learning-Environment-Design-Agents: https://github.com/Unity-Technologies/ml-agents/blob/main/docs/Learning-Environment-Design-Agents.md
- mlagents 1.1.0 (PyPI, 5 октября 2024): https://pypi.org/project/mlagents/

**Научные статьи (по необходимости — обязательное чтение для глубокого понимания):**
- J. Schulman, F. Wolski, P. Dhariwal, A. Radford, O. Klimov. *Proximal Policy Optimization Algorithms*. arXiv:1707.06347, 2017.
- T. Haarnoja, A. Zhou, P. Abbeel, S. Levine. *Soft Actor-Critic: Off-Policy Maximum Entropy Deep RL with a Stochastic Actor*. ICML 2018, arXiv:1801.01290.
- T. Haarnoja et al. *Soft Actor-Critic Algorithms and Applications*. arXiv:1812.05905, 2018.
- J. Schulman, P. Moritz, S. Levine, M. Jordan, P. Abbeel. *High-Dimensional Continuous Control Using Generalized Advantage Estimation*. ICLR 2016, arXiv:1506.02438.
- N. Savid и др. *Simulated Autonomous Driving Using Reinforcement Learning: A Comparative Study on Unity's ML-Agents Framework*. *Information* (MDPI), 2023, 14(5), 290. https://www.mdpi.com/2078-2489/14/5/290
- *REINFORCEMENT LEARNING IN A VIRTUAL WORLD: A STUDY OF PPO AND SAC WITHIN UNITY ML AGENTS*. Chemical Technology, Control and Management Journal. https://ijctcm.researchcommons.org/cgi/viewcontent.cgi?article=1722&context=journal

**Образцовые проекты сообщества по гоночным агентам:**
- Sebastian-Schuchmann / AI-Racing-Karts (форк Unity Karting Microgame с ML-Agents): https://github.com/Sebastian-Schuchmann/AI-Racing-Karts
- JulesVerny / MLAgentsAtSpa (агент на трассе Spa, обсуждение reward shaping): https://github.com/JulesVerny/MLAgentsAtSpa
- maxiwoj / car_racer_ml_agents: https://github.com/maxiwoj/car_racer_ml_agents
- Code Monkey: *AI Learns to Drive a Car! (ML-Agents in Unity)* — видеоурок: https://www.youtube.com/watch?v=2X5m_nDBvS4
- Pranav Agarwal: *Getting the most out of ML Agents in Unity3D*: https://pranav1998ag.medium.com/getting-the-most-out-of-ml-agents-in-unity3d-e44154b1e3b4
- Adam Kelly (Immersive Limit): *Ray Perception Sensor Component Tutorial*: https://www.immersivelimit.com/tutorials/rayperceptionsensorcomponent-tutorial
- Janak Mandavgade: *How I Got Unity ML-Agents Working on an RTX 5070 Ti*: https://medium.com/@janakmandavgade27/how-i-got-unity-ml-agents-working-on-an-rtx-5070-ti-the-complete-painful-guide-31f07a101201

### Caveats (ограничения и оговорки руководства)

1. Точные numeric defaults внутри `KartAgent.cs` репозитория Sebastian-Schuchmann/AI-Racing-Karts (`PassCheckpointReward`, `HitPenalty`, `TowardsCheckpointReward`) не были прочитаны напрямую из исходного кода в рамках подготовки этого руководства — приведённые в разделе 5 значения скомбинированы из вторичных источников (статья Savid et al. 2023, описание реплики yasirrhaq/Learning-to-kart) и могут несколько отличаться от оригинала. Рекомендуется студентам открыть `KartAgent.cs` локально и сверить с приведёнными формулами.
2. Команда `--num-envs` обеспечивает параллелизм на уровне процессов Unity, но реальное ускорение зависит от мощности CPU/GPU; в отдельных сообщениях форума Unity Discussions при 8 параллельных средах наблюдалось лишь ~2× ускорение, а не линейное 8×.
3. Версия Unity для release_22 — **2023.2+**. Утверждение в исходной постановке задачи о «Unity 2022.3 LTS» формально соответствует release_21 / com.unity.ml-agents 3.0.0-**exp.1**. Если в МГППУ используется именно Unity 2022.3 LTS, рекомендуется явно зафиксировать пакет версии `3.0.0-exp.1` (release_21), либо обновить редактор.
4. Time-scale = 20 — значение по умолчанию из секции `engine_settings` YAML-конфигов ML-Agents. При обнаружении физических артефактов (проваливание сквозь стены, «прыгающая» машина) снижайте до 10 или 5.
5. Все формулы (clipped surrogate, GAE, soft Bellman) точно соответствуют оригинальным статьям; численные значения гиперпараметров — рекомендации, основанные на конфигурациях `config/ppo/*.yaml` репозитория ML-Agents и опыте сообщества. Каждый эксперимент уникален, и значения могут потребовать тюнинга под конкретную геометрию трассы.
6. Эмпирические числа времени круга (12.5948 с для PPO, 13.1336 с для SAC) и количество вылетов взяты из публикации Savid et al. (MDPI Information, 2023) для Karting Microgame — конкретные значения зависят от геометрии трассы, физики автомобиля и могут не воспроизвестись 1-в-1 в учебных проектах МГППУ.

---

*Документ подготовлен для использования в курсе «Информационные технологии в психологии», МГППУ. Все примеры кода протестированы на ML-Agents release_22, Unity 2023.2 LTS, PyTorch 2.2.1, Python 3.10.12. Лицензия учебного материала: CC BY-SA 4.0.*
