import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Settings, Code, Rocket, Target, Users } from "lucide-react";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import HubLessonBadges from "@/components/HubLessonBadges";
import { useNavigate } from "react-router-dom";
import LabPracticeSection from "@/components/LabPracticeSection";

const SoccerProject = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/unity-projects")} className="text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Unity Проекты
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-red-500/10 text-red-400">Продвинутый</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold">
            <span className="bg-gradient-neon bg-clip-text text-transparent">Soccer (Multi-Agent)</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            Команды агентов играют в футбол друг против друга. Multi-Agent RL с использованием MAPOCA и Self-Play.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-12">
        <HubLessonBadges hubPath="/unity-projects/soccer" />
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
              <li><a href="#training" className="text-primary hover:underline">Обучение (MAPOCA + Self-Play)</a></li>
              <li><a href="#results" className="text-primary hover:underline">Результаты и оптимизация</a></li>
            </ol>
          </CardContent>
        </Card>

        {/* 1. Описание */}
        <section id="overview" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" /> 1. Описание проекта
          </h2>
          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Два игрока (или команды 2v2) играют в футбол на поле (мультиагенты — <CrossLinkToLesson lessonId="3-2" lessonPath="/courses/3-2" lessonTitle="Multi-Agent RL и Self-Play" lessonLevel={3} />). Каждый агент наблюдает за мячом, своей позицией и
                позициями других игроков. Агенты должны координироваться для забивания голов и защиты ворот.
                Используется Multi-Agent Posthumous Credit Assignment (MAPOCA).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-background/60 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-foreground">Наблюдения (каждый агент)</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Позиция и скорость мяча (6)</li>
                    <li>Своя позиция и скорость (6)</li>
                    <li>Позиция партнёра (3)</li>
                    <li>Позиции противников (6)</li>
                    <li>Направление к воротам (2)</li>
                  </ul>
                </div>
                <div className="bg-background/60 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-foreground">Действия (дискретные + непрерывные)</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Перемещение (непрерывное): x, z</li>
                    <li>Поворот (непрерывное): от -1 до 1</li>
                    <li>Удар по мячу (дискретное): 0 или 1</li>
                  </ul>
                </div>
                <div className="bg-background/60 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-foreground">Награды (командные)</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>+1.0 всей команде за гол</li>
                    <li>-1.0 всей команде за пропущенный гол</li>
                    <li>+0.1 за касание мяча</li>
                    <li>-0.0005 штраф за шаг</li>
                  </ul>
                </div>
                <div className="bg-background/60 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-foreground">Алгоритм</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>MAPOCA (MA-POCA)</li>
                    <li>Self-Play для противников</li>
                    <li>Групповые награды</li>
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
                <li><strong className="text-foreground">Создайте поле:</strong>
                  <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                    <li>Plane размером 20×30</li>
                    <li>Стены по периметру (Box Collider)</li>
                    <li>Ворота с двух сторон (Tag: «BlueGoal», «PurpleGoal»)</li>
                  </ul>
                </li>
                <li><strong className="text-foreground">Создайте мяч:</strong>
                  <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                    <li>Sphere с Rigidbody</li>
                    <li>Физический материал: Bounciness 0.6, Friction 0.4</li>
                  </ul>
                </li>
                <li><strong className="text-foreground">Создайте агентов (4 шт: 2v2):</strong>
                  <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                    <li>Capsule с Rigidbody (Freeze Rotation X, Z)</li>
                    <li>Добавьте Behavior Parameters</li>
                    <li>Team Id: 0 для Blue, 1 для Purple</li>
                  </ul>
                </li>
                <li><strong className="text-foreground">Настройте SimpleMultiAgentGroup:</strong>
                  <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                    <li>Зарегистрируйте агентов одной команды в группу</li>
                    <li>Групповые награды распределяются автоматически</li>
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

public class SoccerAgent : Agent
{
    public enum Team { Blue = 0, Purple = 1 }
    
    [Header("Настройки")]
    public Team team;
    public float moveSpeed = 6f;
    public float turnSpeed = 300f;
    public float kickForce = 15f;
    
    [Header("Ссылки")]
    public Transform ball;
    public Transform ownGoal;
    public Transform opponentGoal;
    public SoccerAgent teammate;
    public SoccerAgent[] opponents;
    
    private Rigidbody rb;
    private Rigidbody ballRb;
    private SimpleMultiAgentGroup agentGroup;
    
    private Vector3 startPos;
    private Quaternion startRot;
    
    public override void Initialize()
    {
        rb = GetComponent<Rigidbody>();
        ballRb = ball.GetComponent<Rigidbody>();
        startPos = transform.localPosition;
        startRot = transform.localRotation;
    }
    
    public void SetAgentGroup(
        SimpleMultiAgentGroup group)
    {
        agentGroup = group;
    }
    
    public override void OnEpisodeBegin()
    {
        transform.localPosition = startPos;
        transform.localRotation = startRot;
        rb.velocity = Vector3.zero;
        rb.angularVelocity = Vector3.zero;
    }
    
    public override void CollectObservations(
        VectorSensor sensor)
    {
        // Позиция мяча (локальная)
        Vector3 ballLocal = 
            transform.InverseTransformPoint(
                ball.position);
        sensor.AddObservation(ballLocal);
        
        // Скорость мяча
        sensor.AddObservation(ballRb.velocity);
        
        // Своя позиция и скорость
        sensor.AddObservation(
            transform.localPosition);
        sensor.AddObservation(rb.velocity);
        
        // Позиция партнёра
        sensor.AddObservation(
            teammate.transform.localPosition);
        
        // Позиции противников
        foreach (var opp in opponents)
        {
            sensor.AddObservation(
                opp.transform.localPosition);
        }
        
        // Направление к воротам противника
        Vector3 goalDir = (
            opponentGoal.position 
            - transform.position
        ).normalized;
        sensor.AddObservation(goalDir.x);
        sensor.AddObservation(goalDir.z);
    }
    
    public override void OnActionReceived(
        ActionBuffers actions)
    {
        // Непрерывные: перемещение и поворот
        float moveX = actions.ContinuousActions[0];
        float moveZ = actions.ContinuousActions[1];
        float turn = actions.ContinuousActions[2];
        
        // Дискретное: удар
        int kick = actions.DiscreteActions[0];
        
        // Движение
        Vector3 move = new Vector3(moveX, 0, moveZ);
        rb.AddForce(
            move * moveSpeed, 
            ForceMode.VelocityChange
        );
        
        // Поворот
        transform.Rotate(
            0, turn * turnSpeed 
            * Time.fixedDeltaTime, 0
        );
        
        // Удар по мячу
        if (kick == 1)
        {
            float dist = Vector3.Distance(
                transform.position, ball.position);
            if (dist < 2f)
            {
                Vector3 kickDir = (
                    ball.position 
                    - transform.position
                ).normalized;
                ballRb.AddForce(
                    kickDir * kickForce, 
                    ForceMode.Impulse
                );
                AddReward(0.1f); // Бонус за касание
            }
        }
        
        // Штраф за шаг
        AddReward(-0.0005f);
    }
    
    // Вызывается из GameManager при голе
    public void OnGoalScored(Team scoringTeam)
    {
        if (scoringTeam == team)
        {
            agentGroup.AddGroupReward(1.0f);
        }
        else
        {
            agentGroup.AddGroupReward(-1.0f);
        }
        agentGroup.EndGroupEpisode();
    }
    
    public override void Heuristic(
        in ActionBuffers actionsOut)
    {
        var ca = actionsOut.ContinuousActions;
        ca[0] = Input.GetAxis("Horizontal");
        ca[1] = Input.GetAxis("Vertical");
        ca[2] = Input.GetKey(KeyCode.Q) ? -1f 
            : Input.GetKey(KeyCode.E) ? 1f : 0f;
        
        var da = actionsOut.DiscreteActions;
        da[0] = Input.GetKey(KeyCode.Space) ? 1 : 0;
    }
}`}
              </pre>

              <h3 className="text-lg font-semibold text-foreground mt-4">GameManager (управление эпизодами)</h3>
              <pre className="bg-background/80 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
{`using Unity.MLAgents;
using UnityEngine;

public class SoccerGameManager : MonoBehaviour
{
    public SoccerAgent[] blueTeam;
    public SoccerAgent[] purpleTeam;
    public Transform ball;
    
    private SimpleMultiAgentGroup blueGroup;
    private SimpleMultiAgentGroup purpleGroup;
    private Rigidbody ballRb;
    
    void Start()
    {
        ballRb = ball.GetComponent<Rigidbody>();
        
        // Создаём группы
        blueGroup = new SimpleMultiAgentGroup();
        purpleGroup = new SimpleMultiAgentGroup();
        
        foreach (var agent in blueTeam)
        {
            blueGroup.RegisterAgent(agent);
            agent.SetAgentGroup(blueGroup);
        }
        foreach (var agent in purpleTeam)
        {
            purpleGroup.RegisterAgent(agent);
            agent.SetAgentGroup(purpleGroup);
        }
    }
    
    // Вызвать при попадании мяча в ворота
    public void OnGoal(
        SoccerAgent.Team scoringTeam)
    {
        foreach (var a in blueTeam)
            a.OnGoalScored(scoringTeam);
        foreach (var a in purpleTeam)
            a.OnGoalScored(scoringTeam);
        
        ResetBall();
    }
    
    void ResetBall()
    {
        ball.localPosition = Vector3.up;
        ballRb.velocity = Vector3.zero;
        ballRb.angularVelocity = Vector3.zero;
    }
}`}
              </pre>
            </CardContent>
          </Card>
        </section>

        {/* 4. Обучение */}
        <section id="training" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Rocket className="w-6 h-6 text-primary" /> 4. Обучение (MAPOCA + Self-Play)
          </h2>
          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Файл конфигурации (YAML)</h3>
              <pre className="bg-background/80 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
{`behaviors:
  Soccer:
    trainer_type: poca   # MA-POCA
    
    hyperparameters:
      batch_size: 2048
      buffer_size: 20480
      learning_rate: 3.0e-4
      beta: 0.01
      epsilon: 0.2
      lambd: 0.95
      num_epoch: 3
    
    network_settings:
      normalize: true
      hidden_units: 512
      num_layers: 3
      memory:
        memory_size: 256
        sequence_length: 64
    
    reward_signals:
      extrinsic:
        gamma: 0.99
        strength: 1.0
    
    max_steps: 5000000
    time_horizon: 256
    summary_freq: 10000
    
    # Self-Play
    self_play:
      save_steps: 50000
      team_change: 200000
      swap_steps: 10000
      window: 10
      play_against_latest_model_ratio: 0.5
      initial_elo: 1200.0`}
              </pre>

              <h3 className="text-lg font-semibold text-foreground mt-4">Запуск обучения</h3>
              <pre className="bg-background/80 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
{`# Запуск с Self-Play
mlagents-learn config/soccer.yaml \\
    --run-id=soccer_2v2_01

# Параллельные среды (рекомендуется 8+)
mlagents-learn config/soccer.yaml \\
    --run-id=soccer_2v2_01 --num-envs=8

# TensorBoard (отслеживайте ELO рейтинг)
tensorboard --logdir results`}
              </pre>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-4">
                <h4 className="font-semibold text-primary mb-2">💡 Ключевые метрики Self-Play</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                  <li><strong className="text-foreground">ELO Rating</strong> — растёт по мере улучшения стратегии</li>
                  <li><strong className="text-foreground">Group Cumulative Reward</strong> — средняя командная награда</li>
                  <li><strong className="text-foreground">Win Rate</strong> — процент побед против прошлых версий</li>
                </ul>
              </div>
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
                <li><strong className="text-foreground">~500,000 шагов:</strong> Агенты учатся двигаться к мячу и пинать его</li>
                <li><strong className="text-foreground">~1,500,000 шагов:</strong> Появляется базовая командная координация</li>
                <li><strong className="text-foreground">~3,000,000 шагов:</strong> Агенты начинают делать передачи</li>
                <li><strong className="text-foreground">~5,000,000 шагов:</strong> Сложные стратегии: защита ворот, позиционная игра</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mt-4">Советы по оптимизации</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Reward shaping:</strong> добавьте бонус за нахождение рядом с мячом на начальных этапах</li>
                <li><strong className="text-foreground">Curriculum Learning:</strong> начните с 1v1, потом переходите к 2v2</li>
                <li><strong className="text-foreground">Memory (LSTM):</strong> включите для запоминания стратегий противника</li>
                <li><strong className="text-foreground">Self-Play window:</strong> увеличьте для разнообразия противников</li>
                <li><strong className="text-foreground">Параллельные среды:</strong> используйте 8–16 копий для стабильного обучения</li>
              </ul>

              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mt-4">
                <h4 className="font-semibold text-accent mb-2">🏆 Расширенные задания</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                  <li>Реализуйте 3v3 с ролями (нападающий, защитник, вратарь)</li>
                  <li>Добавьте Imitation Learning на начальном этапе (записи человеческой игры)</li>
                  <li>Создайте турнир между разными версиями обученных агентов</li>
                  <li>Визуализируйте ELO-прогресс с помощью TensorBoard</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Практика: собранная среда лаборатории для этой темы. */}
        <LabPracticeSection contextKey="/unity-projects/soccer" />

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-border/50">
          <Button variant="outline" onClick={() => navigate("/unity-projects/racing")} className="border-primary/50 text-primary hover:bg-primary/10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Racing Car
          </Button>
          <Button variant="outline" onClick={() => navigate("/unity-projects")} className="border-primary/50 text-primary hover:bg-primary/10">
            Все проекты
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SoccerProject;
