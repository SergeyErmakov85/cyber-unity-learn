import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, BookOpen, Settings, Code, Rocket, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import HubLessonBadges from "@/components/HubLessonBadges";
import Math from "@/components/Math";
import LabPracticeSection from "@/components/LabPracticeSection";

const BallBalanceProject = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/unity-projects")} className="text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Unity Проекты
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-500/10 text-green-400">Начальный</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold">
            <span className="bg-gradient-neon bg-clip-text text-transparent">3D Ball Balance</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            Агент управляет платформой для балансировки шара — классический проект для изучения непрерывных действий.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-12">
        <HubLessonBadges hubPath="/unity-projects/ball-balance" />
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
            <Target className="w-6 h-6 text-primary" /> 1. Описание проекта
          </h2>
          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Агент управляет 3D платформой и должен удерживать шар на ней как можно дольше (см. <CrossLinkToLesson lessonId="project-1" lessonPath="/courses/project-1" lessonTitle={'Проект-1: "Баланс в 3D"'} lessonLevel={1} />). Платформа вращается по осям X и Z, а шар подчиняется физике Unity.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-background/60 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-foreground">Наблюдения (8 значений)</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Позиция шара (x, y, z)</li>
                    <li>Скорость шара (x, y, z)</li>
                    <li>Угол наклона платформы (x, z)</li>
                  </ul>
                </div>
                <div className="bg-background/60 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-foreground">Действия (непрерывные)</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Вращение по X: от -1 до 1</li>
                    <li>Вращение по Z: от -1 до 1</li>
                  </ul>
                </div>
                <div className="bg-background/60 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-foreground">Награды</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>+1 за удержание шара</li>
                    <li>-1 за падение шара</li>
                  </ul>
                </div>
                <div className="bg-background/60 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-foreground">Алгоритм</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>PPO (Proximal Policy Optimization)</li>
                    <li>Непрерывные действия</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 2. Настройка */}
        <section id="setup" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" /> 2. Настройка среды Unity
          </h2>
          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 space-y-4">
              <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                <li>Создайте новый 3D проект в Unity</li>
                <li>Добавьте пакет ML-Agents через Package Manager</li>
                <li><strong className="text-foreground">Создайте 3D плоскость</strong> (платформа):
                  <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                    <li>GameObject → 3D Object → Plane</li>
                    <li>Scale: (1, 1, 1)</li>
                    <li>Добавьте Rigidbody (Is Kinematic = true)</li>
                  </ul>
                </li>
                <li><strong className="text-foreground">Добавьте сферу</strong> (шар):
                  <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                    <li>GameObject → 3D Object → Sphere</li>
                    <li>Добавьте Rigidbody (Use Gravity = true)</li>
                    <li>Поместите над платформой</li>
                  </ul>
                </li>
                <li><strong className="text-foreground">Настройте компоненты ML-Agents:</strong>
                  <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                    <li>Добавьте Behavior Parameters к платформе</li>
                    <li>Vector Observation Space Size: 8</li>
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

public class BallBalanceAgent : Agent
{
    public GameObject ball;
    public GameObject platform;
    private Rigidbody ballRb;
    
    public override void Initialize()
    {
        ballRb = ball.GetComponent<Rigidbody>();
    }
    
    public override void OnEpisodeBegin()
    {
        // Сброс позиции шара
        ball.transform.localPosition = new Vector3(
            Random.Range(-0.5f, 0.5f),
            1.5f,
            Random.Range(-0.5f, 0.5f)
        );
        ballRb.velocity = Vector3.zero;
        ballRb.angularVelocity = Vector3.zero;
        
        // Сброс платформы
        platform.transform.rotation = Quaternion.identity;
    }
    
    public override void CollectObservations(
        VectorSensor sensor)
    {
        // Позиция шара относительно платформы (3)
        sensor.AddObservation(
            ball.transform.localPosition);
        // Скорость шара (3)
        sensor.AddObservation(ballRb.velocity);
        // Угол наклона платформы (2)
        sensor.AddObservation(
            platform.transform.rotation.x);
        sensor.AddObservation(
            platform.transform.rotation.z);
    }
    
    public override void OnActionReceived(
        ActionBuffers actions)
    {
        // Получаем непрерывные действия
        float rotateX = actions.ContinuousActions[0];
        float rotateZ = actions.ContinuousActions[1];
        
        // Применяем вращение к платформе
        platform.transform.rotation = Quaternion.Euler(
            rotateX * 45f, 
            0, 
            rotateZ * 45f
        );
        
        // Награда за удержание
        if (ball.transform.localPosition.y > 0.5f)
        {
            SetReward(1.0f);
        }
        else
        {
            SetReward(-1.0f);
            EndEpisode();
        }
    }
    
    public override void Heuristic(
        in ActionBuffers actionsOut)
    {
        // Ручное управление для тестирования
        var ca = actionsOut.ContinuousActions;
        ca[0] = Input.GetAxis("Horizontal");
        ca[1] = Input.GetAxis("Vertical");
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
  BallBalance:
    trainer_type: ppo
    
    hyperparameters:
      batch_size: 64
      buffer_size: 1024
      learning_rate: 3.0e-4
      beta: 5.0e-4          # Энтропия
      epsilon: 0.2           # Клиппинг
      lambd: 0.95            # GAE lambda
      num_epoch: 3
    
    network_settings:
      normalize: true
      hidden_units: 128
      num_layers: 2
    
    reward_signals:
      extrinsic:
        gamma: 0.99
        strength: 1.0
    
    max_steps: 500000
    time_horizon: 64
    summary_freq: 10000`}
              </pre>

              <h3 className="text-lg font-semibold text-foreground mt-4">Запуск обучения</h3>
              <pre className="bg-background/80 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
{`# Запуск обучения
mlagents-learn config/ball_balance.yaml \\
    --run-id=ball_balance_01

# Продолжение обучения
mlagents-learn config/ball_balance.yaml \\
    --run-id=ball_balance_01 --resume

# TensorBoard для мониторинга
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
                <li><strong className="text-foreground">~50,000 шагов:</strong> Агент начинает удерживать шар несколько секунд</li>
                <li><strong className="text-foreground">~200,000 шагов:</strong> Стабильное удержание в центре</li>
                <li><strong className="text-foreground">~500,000 шагов:</strong> Агент справляется с начальными отклонениями</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mt-4">Советы по оптимизации</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Используйте <strong className="text-foreground">множественные копии</strong> среды для параллельного обучения</li>
                <li>Добавьте <strong className="text-foreground">reward shaping</strong>: дополнительную награду за близость шара к центру</li>
                <li>Экспериментируйте с <strong className="text-foreground">learning rate</strong>: начните с 3e-4, уменьшайте если нестабильно</li>
                <li>Увеличивайте <strong className="text-foreground">hidden_units</strong> для более сложных задач</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Практика: собранная среда лаборатории для этой темы. */}
        <LabPracticeSection contextKey="/unity-projects/ball-balance" />

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-border/50">
          <Button variant="outline" onClick={() => navigate("/unity-projects")} className="border-primary/50 text-primary hover:bg-primary/10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Unity Проекты
          </Button>
          <Button variant="outline" onClick={() => navigate("/unity-projects/gridworld")} className="border-primary/50 text-primary hover:bg-primary/10">
            GridWorld <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BallBalanceProject;
