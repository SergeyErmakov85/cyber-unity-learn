import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, BookOpen, Settings, Code, Rocket, Target, Car } from "lucide-react";
import RaycastVisualizer from "@/components/RaycastVisualizer";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import HubLessonBadges from "@/components/HubLessonBadges";
import { useNavigate } from "react-router-dom";
import LabPracticeSection from "@/components/LabPracticeSection";

const RacingCarProject = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/unity-projects")} className="text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Unity Проекты
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400">Средний</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold">
            <span className="bg-gradient-neon bg-clip-text text-transparent">Racing Car</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            Агент управляет автомобилем на треке, используя raycast-сенсоры для обнаружения стен и SAC алгоритм для обучения.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-12">
        <HubLessonBadges hubPath="/unity-projects/racing" />
        {/* Содержание */}
        <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" /> Содержание
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li><a href="#overview" className="text-primary hover:underline">Описание проекта</a></li>
              <li><a href="#setup" className="text-primary hover:underline">Настройка среды Unity</a></li>
              <li><a href="#agent" className="text-primary hover:underline">Код Agent (C#)</a></li>
              <li><a href="#training" className="text-primary hover:underline">Обучение и конфигурация</a></li>
              <li><a href="#results" className="text-primary hover:underline">Результаты и оптимизация</a></li>
            </ol>
          </CardContent>
        </Card>

        {/* 1. Описание */}
        <section id="overview" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Car className="w-6 h-6 text-primary" /> 1. Описание проекта
          </h2>
          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Агент управляет автомобилем на замкнутом треке (Урок: гоночный агент — <CrossLinkToLesson lessonId="project-3" lessonPath="/courses/project-3" lessonTitle="Гоночный агент с непрерывным управлением" lessonLevel={2} />). Для восприятия окружения используются raycast-сенсоры,
                направленные веером вперёд. Агент должен научиться проходить трек максимально быстро, не врезаясь в стены.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-background/60 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-foreground">Наблюдения</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>9 raycast-лучей (дистанция до стен)</li>
                    <li>Текущая скорость (нормализованная)</li>
                    <li>Угловая скорость</li>
                    <li>Направление к следующей контрольной точке</li>
                  </ul>
                </div>
                <div className="bg-background/60 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-foreground">Действия (непрерывные)</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Ускорение / торможение: от -1 до 1</li>
                    <li>Поворот руля: от -1 до 1</li>
                  </ul>
                </div>
                <div className="bg-background/60 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-foreground">Награды</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>+1.0 за прохождение контрольной точки</li>
                    <li>+0.01 × скорость (стимул ехать быстрее)</li>
                    <li>-1.0 за столкновение со стеной</li>
                    <li>-0.001 за каждый шаг (стимул к скорости)</li>
                  </ul>
                </div>
                <div className="bg-background/60 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-foreground">Алгоритм</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>SAC (Soft Actor-Critic)</li>
                    <li>Непрерывные действия</li>
                    <li>Автоматическая настройка энтропии</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Интерактивная визуализация */}
        <section className="space-y-6">
          <RaycastVisualizer />
        </section>

        {/* 2. Настройка */}
        <section id="setup" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" /> 2. Настройка среды Unity
          </h2>
          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 space-y-4">
              <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                <li><strong className="text-foreground">Создайте трек:</strong>
                  <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                    <li>Используйте ProBuilder или 3D-модель замкнутой трассы</li>
                    <li>Добавьте коллайдеры на стены (Tag: «Wall»)</li>
                    <li>Разместите контрольные точки (Tag: «Checkpoint») по всему треку</li>
                  </ul>
                </li>
                <li><strong className="text-foreground">Создайте автомобиль:</strong>
                  <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                    <li>3D модель или простой куб</li>
                    <li>Добавьте Rigidbody (Mass: 1, Drag: 0.5)</li>
                    <li>Box Collider для столкновений</li>
                  </ul>
                </li>
                <li><strong className="text-foreground">Настройте Raycast-сенсоры:</strong>
                  <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                    <li>Добавьте Ray Perception Sensor 3D компонент</li>
                    <li>9 лучей, угол 180°, длина 20 единиц</li>
                    <li>Detectable Tags: «Wall»</li>
                  </ul>
                </li>
                <li><strong className="text-foreground">Behavior Parameters:</strong>
                  <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                    <li>Vector Observation Space Size: 5 (скорость + угл. скорость + направление)</li>
                    <li>Ray Perception Sensor добавит наблюдения автоматически</li>
                    <li>Continuous Actions: 2</li>
                  </ul>
                </li>
              </ol>
            </CardContent>
          </Card>
        </section>

        {/* 3. Код Agent */}
        <section id="agent" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Code className="w-6 h-6 text-primary" /> 3. Код Agent (C#)
          </h2>
          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 space-y-4">
              <pre className="bg-background/80 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
{`using Unity.MLAgents;
using Unity.MLAgents.Sensors;
using Unity.MLAgents.Actuators;
using UnityEngine;

public class RacingCarAgent : Agent
{
    public float maxSpeed = 30f;
    public float turnSpeed = 150f;
    public float acceleration = 20f;
    
    public Transform[] checkpoints;
    private int currentCheckpoint = 0;
    
    private Rigidbody rb;
    private Vector3 startPos;
    private Quaternion startRot;
    
    public override void Initialize()
    {
        rb = GetComponent<Rigidbody>();
        startPos = transform.localPosition;
        startRot = transform.localRotation;
    }
    
    public override void OnEpisodeBegin()
    {
        // Сброс позиции и скорости
        transform.localPosition = startPos;
        transform.localRotation = startRot;
        rb.velocity = Vector3.zero;
        rb.angularVelocity = Vector3.zero;
        currentCheckpoint = 0;
    }
    
    public override void CollectObservations(
        VectorSensor sensor)
    {
        // Нормализованная скорость
        float speed = rb.velocity.magnitude / maxSpeed;
        sensor.AddObservation(speed);
        
        // Угловая скорость (Y)
        sensor.AddObservation(
            rb.angularVelocity.y / turnSpeed);
        
        // Направление к следующей контрольной точке
        if (currentCheckpoint < checkpoints.Length)
        {
            Vector3 dir = (
                checkpoints[currentCheckpoint].position 
                - transform.position
            ).normalized;
            
            // Локальное направление
            Vector3 localDir = 
                transform.InverseTransformDirection(dir);
            sensor.AddObservation(localDir.x);
            sensor.AddObservation(localDir.z);
        }
        else
        {
            sensor.AddObservation(0f);
            sensor.AddObservation(0f);
        }
        
        // Угол поворота автомобиля (sin, cos)
        float angle = transform.eulerAngles.y 
            * Mathf.Deg2Rad;
        sensor.AddObservation(Mathf.Sin(angle));
    }
    
    public override void OnActionReceived(
        ActionBuffers actions)
    {
        float accel = actions.ContinuousActions[0];
        float steer = actions.ContinuousActions[1];
        
        // Ускорение
        Vector3 force = transform.forward 
            * accel * acceleration;
        rb.AddForce(force, ForceMode.Acceleration);
        
        // Ограничение скорости
        if (rb.velocity.magnitude > maxSpeed)
            rb.velocity = 
                rb.velocity.normalized * maxSpeed;
        
        // Поворот
        float turn = steer * turnSpeed * Time.fixedDeltaTime;
        transform.Rotate(0, turn, 0);
        
        // Награда за скорость
        float speed = rb.velocity.magnitude / maxSpeed;
        AddReward(0.01f * speed);
        
        // Штраф за шаг
        AddReward(-0.001f);
    }
    
    void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Checkpoint"))
        {
            int idx = System.Array.IndexOf(
                checkpoints, other.transform);
            if (idx == currentCheckpoint)
            {
                AddReward(1.0f);
                currentCheckpoint++;
                
                // Круг пройден
                if (currentCheckpoint 
                    >= checkpoints.Length)
                {
                    AddReward(5.0f);
                    EndEpisode();
                }
            }
        }
    }
    
    void OnCollisionEnter(Collision collision)
    {
        if (collision.gameObject.CompareTag("Wall"))
        {
            SetReward(-1.0f);
            EndEpisode();
        }
    }
    
    public override void Heuristic(
        in ActionBuffers actionsOut)
    {
        var ca = actionsOut.ContinuousActions;
        ca[0] = Input.GetAxis("Vertical");
        ca[1] = Input.GetAxis("Horizontal");
    }
}`}
              </pre>
            </CardContent>
          </Card>
        </section>

        {/* 4. Обучение */}
        <section id="training" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Rocket className="w-6 h-6 text-primary" /> 4. Обучение и конфигурация
          </h2>
          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Файл конфигурации (YAML)</h3>
              <pre className="bg-background/80 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
{`behaviors:
  RacingCar:
    trainer_type: sac
    
    hyperparameters:
      batch_size: 256
      buffer_size: 50000
      learning_rate: 3.0e-4
      learning_rate_schedule: linear
      tau: 0.005            # Soft update
      init_entcoef: 0.5     # Начальная энтропия
      steps_per_update: 10
      save_replay_buffer: true
    
    network_settings:
      normalize: true
      hidden_units: 256
      num_layers: 3
      vis_encode_type: simple
    
    reward_signals:
      extrinsic:
        gamma: 0.995
        strength: 1.0
    
    max_steps: 1000000
    time_horizon: 128
    summary_freq: 10000
    
    # Curiosity (опционально)
    reward_signals:
      extrinsic:
        gamma: 0.995
        strength: 1.0
      curiosity:
        gamma: 0.995
        strength: 0.02
        encoding_size: 128`}
              </pre>

              <h3 className="text-lg font-semibold text-foreground mt-4">Запуск обучения</h3>
              <pre className="bg-background/80 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
{`# Запуск обучения
mlagents-learn config/racing_car.yaml \\
    --run-id=racing_01

# С несколькими копиями среды (ускорение)
mlagents-learn config/racing_car.yaml \\
    --run-id=racing_01 --num-envs=4

# TensorBoard
tensorboard --logdir results`}
              </pre>
            </CardContent>
          </Card>
        </section>

        {/* 5. Результаты */}
        <section id="results" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" /> 5. Результаты и оптимизация
          </h2>
          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Ожидаемые результаты</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">~100,000 шагов:</strong> Агент учится не врезаться в стены</li>
                <li><strong className="text-foreground">~300,000 шагов:</strong> Проходит несколько контрольных точек</li>
                <li><strong className="text-foreground">~700,000 шагов:</strong> Стабильно проходит полный круг</li>
                <li><strong className="text-foreground">~1,000,000 шагов:</strong> Оптимизирует траекторию и скорость</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mt-4">Советы по оптимизации</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Используйте <strong className="text-foreground">Curriculum Learning</strong>: начните с простого трека, постепенно добавляйте сложные повороты</li>
                <li>Добавьте <strong className="text-foreground">curiosity reward</strong> для исследования трека</li>
                <li>Увеличьте количество <strong className="text-foreground">raycast-лучей</strong> для сложных треков (15–21)</li>
                <li><strong className="text-foreground">Параллельное обучение</strong>: 4–8 копий среды значительно ускоряют обучение SAC</li>
                <li>Экспериментируйте с <strong className="text-foreground">reward shaping</strong>: бонус за прижимание к апексам поворотов</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Практика: собранная среда лаборатории для этой темы. */}
        <LabPracticeSection contextKey="/unity-projects/racing" />

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-border/50">
          <Button variant="outline" onClick={() => navigate("/unity-projects/gridworld")} className="border-primary/50 text-primary hover:bg-primary/10">
            <ArrowLeft className="w-4 h-4 mr-2" /> GridWorld
          </Button>
          <Button variant="outline" onClick={() => navigate("/unity-projects/soccer")} className="border-primary/50 text-primary hover:bg-primary/10">
            Soccer <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RacingCarProject;
