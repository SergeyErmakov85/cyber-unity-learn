import { Card } from "@/components/ui/card";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import Math from "@/components/Math";

const Section4Agent = () => (
  <div className="space-y-8">
    {/* 4.1 SOLID */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">4.1. Применение SOLID</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-cyan-500/20">
              <th className="text-left py-2 px-3 text-cyan-300 font-semibold">Принцип</th>
              <th className="text-left py-2 px-3 text-cyan-300 font-semibold">Реализация в проекте</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            {[
              ["S — Single Responsibility",  "CarAgent — только RL-цикл; физика в CarController; чекпоинты в CheckpointManager"],
              ["O — Open/Closed",            "Новые источники награды добавляются методами без правки CarAgent"],
              ["L — Liskov Substitution",    "Любая реализация ICarController (упрощённая, WheelCollider, аркадная) подставляется в агента"],
              ["I — Interface Segregation",  "Маленькие интерфейсы ICarController, ICheckpointManager"],
              ["D — Dependency Inversion",   "CarAgent зависит от абстракций, а не от конкретных классов"],
            ].map(([principle, impl]) => (
              <tr key={principle} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                <td className="py-2 px-3 font-bold text-purple-300 font-mono text-xs whitespace-nowrap">{principle}</td>
                <td className="py-2 px-3">{impl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        В соответствии с принципами SOLID,{" "}
        <strong className="text-foreground">логика принятия решений агентом (инференс нейросети и накопление
        наград) должна быть изолирована от непосредственной реализации физики колёсных коллайдеров.</strong>{" "}
        Класс агента выполняет роль высокоуровневого координатора, агрегирующего нормализованные данные среды
        и транслирующего непрерывные действия сети в конкретные физические силы.
      </p>
    </div>

    {/* 4.2 ICarController */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">4.2. Интерфейс ICarController</h3>
      <CyberCodeBlock language="csharp" filename="Assets/Scripts/Car/ICarController.cs">
{`// Assets/Scripts/Car/ICarController.cs
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
}`}
      </CyberCodeBlock>
    </div>

    {/* 4.3 ICheckpointManager */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">4.3. Интерфейс ICheckpointManager</h3>
      <CyberCodeBlock language="csharp" filename="Assets/Scripts/Track/ICheckpointManager.cs">
{`// Assets/Scripts/Track/ICheckpointManager.cs
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
}`}
      </CyberCodeBlock>
    </div>

    {/* 4.4 Checkpoint */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">4.4. Класс Checkpoint</h3>
      <CyberCodeBlock language="csharp" filename="Assets/Scripts/Track/Checkpoint.cs">
{`// Assets/Scripts/Track/Checkpoint.cs
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
}`}
      </CyberCodeBlock>
    </div>

    {/* 4.5 CheckpointManager */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">4.5. Класс CheckpointManager</h3>
      <CyberCodeBlock language="csharp" filename="Assets/Scripts/Track/CheckpointManager.cs">
{`// Assets/Scripts/Track/CheckpointManager.cs
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
}`}
      </CyberCodeBlock>
    </div>

    {/* 4.6 CarController */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">4.6. Класс CarController (упрощённая физика)</h3>
      <CyberCodeBlock language="csharp" filename="Assets/Scripts/Car/CarController.cs">
{`// Assets/Scripts/Car/CarController.cs
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
}`}
      </CyberCodeBlock>
    </div>

    {/* 4.7 WheelCollider */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">4.7. Альтернатива: IVehicleController и WheelCollider</h3>
      <p className="text-muted-foreground leading-relaxed">
        Для более реалистичной физики применяется встроенная в Unity модель{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">WheelCollider</code>.
        Интерфейс расширен дополнительными свойствами, полезными для агента:{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">CurrentSpeed</code> в км/ч,{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">MaxExpectedSpeed</code>,
        отношение угла руля и флаг застревания у барьера{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">IsStuckHeadOn</code>.
      </p>
      <CyberCodeBlock language="csharp" filename="AutonomousRacing.Core/IVehicleController.cs">
{`// Расширенный интерфейс для реалистичной физической модели
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
}`}
      </CyberCodeBlock>
      <CyberCodeBlock language="csharp" filename="AutonomousRacing.Physics/WheelColliderVehicleController.cs">
{`// Реализация через встроенную физическую модель колёс WheelCollider
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
}`}
      </CyberCodeBlock>
    </div>

    {/* 4.8 CarAgent */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">4.8. Главный класс CarAgent</h3>
      <CyberCodeBlock language="csharp" filename="Assets/Scripts/Agent/CarAgent.cs">
{`// Assets/Scripts/Agent/CarAgent.cs
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
}`}
      </CyberCodeBlock>
    </div>

    {/* 4.9 AutonomousRacingAgent */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">4.9. Альтернатива: AutonomousRacingAgent с тайм-аутом сегмента</h3>
      <p className="text-muted-foreground leading-relaxed">
        Производственный вариант агента включает дополнительные механизмы устойчивости:
      </p>
      <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground leading-relaxed">
        <li>
          <strong className="text-foreground">Тайм-аут прохождения сегмента</strong>{" "}
          (<code className="bg-muted/50 px-1 text-xs">TrackSegmentTimeout = 12 с</code>) — если за 12 секунд
          агент не достиг следующего чекпоинта, эпизод завершается со штрафом −1.0; это пресекает «зависание»
        </li>
        <li>
          <strong className="text-foreground">Расширенный вектор наблюдений</strong> с компонентами
          forward/lateral alignment и флагом застревания у барьера
        </li>
        <li>
          <strong className="text-foreground">Бонус за чекпоинт, нормированный на общее число ворот</strong>:{" "}
          <Math display={false}>{String.raw`r_{\text{cp}} = 1/N`}</Math>, где{" "}
          <Math display={false}>{String.raw`N`}</Math> — количество чекпоинтов на круге
        </li>
      </ul>
      <CyberCodeBlock language="csharp" filename="AutonomousRacing.Learning/AutonomousRacingAgent.cs">
{`using UnityEngine;
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
}`}
      </CyberCodeBlock>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Выделение логики нормализации скорости непосредственно в{" "}
        <code className="bg-muted/50 px-1 text-xs">CollectObservations</code> решает фундаментальную задачу
        выравнивания масштабов признаков. Добавление{" "}
        <code className="bg-muted/50 px-1 text-xs">lateralAlignment</code> и{" "}
        <code className="bg-muted/50 px-1 text-xs">IsStuckHeadOn</code> даёт сети явные признаки для
        отдельных классов аварийных ситуаций.
      </p>
    </div>

    {/* 4.10 BehaviorParameters */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">4.10. Настройка BehaviorParameters в инспекторе</h3>
      <p className="text-muted-foreground leading-relaxed">
        На объекте автомобиля рядом с{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">CarAgent</code> добавляется компонент{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">BehaviorParameters</code>:
      </p>
      <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground leading-relaxed">
        <li><strong className="text-foreground">Behavior Name:</strong>{" "}
          <code className="bg-muted/50 px-1 text-xs">RacingCar</code> (должно совпадать с ключом в YAML)</li>
        <li><strong className="text-foreground">Vector Observation → Space Size:</strong> 6</li>
        <li><strong className="text-foreground">Actions → Continuous Actions:</strong> 3 (руль, газ, тормоз)</li>
        <li><strong className="text-foreground">Actions → Discrete Branches:</strong> 0</li>
        <li><strong className="text-foreground">Behavior Type:</strong>{" "}
          <code className="bg-muted/50 px-1 text-xs">Default</code> (обучение) /{" "}
          <code className="bg-muted/50 px-1 text-xs">Inference Only</code> (после)</li>
      </ul>
      <p className="text-sm text-muted-foreground">
        Также добавляется{" "}
        <code className="bg-muted/50 px-1 text-xs">DecisionRequester</code> с{" "}
        <code className="bg-muted/50 px-1 text-xs">Decision Period = 5</code> (решение раз в 5 физических
        шагов) и{" "}
        <code className="bg-muted/50 px-1 text-xs">RayPerceptionSensorComponent3D</code> с настройками
        из раздела 3.2.
      </p>
    </div>

    {/* 4.11 Математическое обоснование нормализации */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">4.11. Математическое обоснование нормализации входов</h3>
      <p className="text-muted-foreground leading-relaxed">
        При нормализации <Math display={false}>{String.raw`v \mapsto v / v_{\max}`}</Math> мы обеспечиваем,
        что входы политики статистически центрированы около нуля и масштабированы в{" "}
        <Math display={false}>{String.raw`[-1, 1]`}</Math>. Это:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground leading-relaxed">
        <li>
          <strong className="text-foreground">Ускоряет сходимость SGD/Adam</strong> — все компоненты
          градиента имеют сопоставимый масштаб
        </li>
        <li>
          <strong className="text-foreground">Уменьшает риск ранней насыщенности нелинейностей</strong>{" "}
          (<Math display={false}>{String.raw`\tanh(x) \to \pm 1`}</Math> при{" "}
          <Math display={false}>{String.raw`|x| \gtrsim 3`}</Math>)
        </li>
        <li>
          <strong className="text-foreground">Стабилизирует value loss</strong>:{" "}
          <Math display={false}>{String.raw`V^\pi(s) = \sum \gamma^t r_t`}</Math> ограничено сверху, если{" "}
          <Math display={false}>{String.raw`r_t`}</Math> ограничены и нормированы
        </li>
      </ol>
    </div>

    <Card className="border-cyan-500/20 bg-cyan-500/5 p-4">
      <p className="text-sm text-cyan-200 font-medium">
        Ключевые моменты раздела 4: четыре класса (CarAgent, CarController, CheckpointManager, Checkpoint)
        и два интерфейса. OnActionReceived обрабатывает 3 непрерывных канала. OnEpisodeBegin рандомизирует
        старт. Расширенный профиль использует WheelCollider, тайм-аут сегмента и флаг застревания.
      </p>
    </Card>
  </div>
);

export default Section4Agent;
