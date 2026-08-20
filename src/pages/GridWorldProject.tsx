import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, BookOpen, Settings, Code, Rocket, Target, Grid3X3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HubLessonBadges from "@/components/HubLessonBadges";
import LabPracticeSection from "@/components/LabPracticeSection";

const GridWorldProject = () => {
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
            <span className="bg-gradient-neon bg-clip-text text-transparent">GridWorld с препятствиями</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            Агент перемещается по сетке, собирает бонусы и избегает ловушек — идеальный проект для изучения дискретных действий.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-12">
        <HubLessonBadges hubPath="/unity-projects/gridworld" />
        {/* Содержание */}
        <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" /> Содержание
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li><a href="#overview" className="text-primary hover:underline">Описание проекта</a></li>
              <li><a href="#setup" className="text-primary hover:underline">Настройка среды</a></li>
              <li><a href="#agent" className="text-primary hover:underline">Код Agent (C#)</a></li>
              <li><a href="#training" className="text-primary hover:underline">Обучение</a></li>
            </ol>
          </CardContent>
        </Card>

        {/* 1. Описание */}
        <section id="overview" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Grid3X3 className="w-6 h-6 text-primary" /> 1. Описание проекта
          </h2>
          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                GridWorld — классическая среда для обучения с подкреплением. Агент перемещается по двумерной сетке,
                собирая бонусы (+10) и избегая ловушек (-10). За каждый шаг агент получает штраф -1, мотивируя
                находить кратчайший путь.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-background/60 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-foreground">Наблюдения</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Карта 5×5 вокруг агента</li>
                    <li>Тип каждой клетки (пусто, бонус, ловушка, стена)</li>
                    <li>Позиция агента на сетке</li>
                  </ul>
                </div>
                <div className="bg-background/60 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-foreground">Действия (дискретные)</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>0 — Вверх</li>
                    <li>1 — Вниз</li>
                    <li>2 — Влево</li>
                    <li>3 — Вправо</li>
                  </ul>
                </div>
                <div className="bg-background/60 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-foreground">Награды</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>+10 за сбор бонуса</li>
                    <li>-10 за попадание в ловушку</li>
                    <li>-1 за каждый шаг</li>
                  </ul>
                </div>
                <div className="bg-background/60 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-foreground">Алгоритм</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>PPO (дискретные действия)</li>
                    <li>Подходит также для DQN</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 2. Настройка */}
        <section id="setup" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" /> 2. Настройка среды
          </h2>
          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 space-y-4">
              <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                <li>Создайте 2D/3D сетку (например, 10×10) из кубов или спрайтов</li>
                <li>Разместите объекты:
                  <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                    <li><strong className="text-foreground text-green-400">Зелёные</strong> — бонусы (Tag: «Goal»)</li>
                    <li><strong className="text-foreground text-red-400">Красные</strong> — ловушки (Tag: «Trap»)</li>
                    <li><strong className="text-foreground">Серые</strong> — стены (Tag: «Wall»)</li>
                  </ul>
                </li>
                <li>Настройте Behavior Parameters:
                  <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                    <li>Vector Observation Space Size: 27 (5×5 карта + позиция)</li>
                    <li>Discrete Branch: 1 ветка с 4 действиями</li>
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

public class GridWorldAgent : Agent
{
    public int gridSize = 10;
    private int posX, posY;
    private int[,] grid; // 0=пусто, 1=бонус, 2=ловушка, 3=стена
    
    public override void OnEpisodeBegin()
    {
        // Сброс позиции агента
        posX = Random.Range(0, gridSize);
        posY = Random.Range(0, gridSize);
        
        // Генерация сетки
        GenerateGrid();
        
        // Визуальное обновление
        UpdateVisuals();
    }
    
    public override void CollectObservations(
        VectorSensor sensor)
    {
        // Позиция агента (нормализованная)
        sensor.AddObservation(posX / (float)gridSize);
        sensor.AddObservation(posY / (float)gridSize);
        
        // Карта 5x5 вокруг агента
        for (int dx = -2; dx <= 2; dx++)
        {
            for (int dy = -2; dy <= 2; dy++)
            {
                int x = posX + dx;
                int y = posY + dy;
                
                if (x >= 0 && x < gridSize && 
                    y >= 0 && y < gridSize)
                    sensor.AddObservation(grid[x, y]);
                else
                    sensor.AddObservation(3); // Стена
            }
        }
    }
    
    public override void OnActionReceived(
        ActionBuffers actions)
    {
        int action = actions.DiscreteActions[0];
        
        // Перемещение
        int newX = posX, newY = posY;
        switch (action)
        {
            case 0: newY++; break; // Вверх
            case 1: newY--; break; // Вниз
            case 2: newX--; break; // Влево
            case 3: newX++; break; // Вправо
        }
        
        // Проверка границ и стен
        if (newX >= 0 && newX < gridSize && 
            newY >= 0 && newY < gridSize &&
            grid[newX, newY] != 3)
        {
            posX = newX;
            posY = newY;
        }
        
        // Награды
        AddReward(-1f); // Штраф за шаг
        
        if (grid[posX, posY] == 1) // Бонус
        {
            SetReward(10f);
            EndEpisode();
        }
        else if (grid[posX, posY] == 2) // Ловушка
        {
            SetReward(-10f);
            EndEpisode();
        }
        
        UpdateVisuals();
    }
    
    public override void Heuristic(
        in ActionBuffers actionsOut)
    {
        var da = actionsOut.DiscreteActions;
        if (Input.GetKey(KeyCode.W)) da[0] = 0;
        else if (Input.GetKey(KeyCode.S)) da[0] = 1;
        else if (Input.GetKey(KeyCode.A)) da[0] = 2;
        else if (Input.GetKey(KeyCode.D)) da[0] = 3;
    }
    
    void GenerateGrid() { /* ... */ }
    void UpdateVisuals() { /* ... */ }
}`}
              </pre>
            </CardContent>
          </Card>
        </section>

        {/* 4. Обучение */}
        <section id="training" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Rocket className="w-6 h-6 text-primary" /> 4. Обучение
          </h2>
          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Конфигурация YAML</h3>
              <pre className="bg-background/80 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
{`behaviors:
  GridWorld:
    trainer_type: ppo
    
    hyperparameters:
      batch_size: 128
      buffer_size: 2048
      learning_rate: 3.0e-4
      beta: 1.0e-3
      epsilon: 0.2
      lambd: 0.95
      num_epoch: 3
    
    network_settings:
      normalize: false
      hidden_units: 128
      num_layers: 2
    
    reward_signals:
      extrinsic:
        gamma: 0.99
        strength: 1.0
    
    max_steps: 300000
    time_horizon: 128
    summary_freq: 5000`}
              </pre>

              <h3 className="text-lg font-semibold text-foreground mt-4">Запуск</h3>
              <pre className="bg-background/80 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
{`mlagents-learn config/gridworld.yaml \\
    --run-id=gridworld_01`}
              </pre>

              <h3 className="text-lg font-semibold text-foreground mt-4">Ожидаемые результаты</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">~30,000 шагов:</strong> Агент начинает находить бонусы</li>
                <li><strong className="text-foreground">~100,000 шагов:</strong> Агент уверенно избегает ловушек</li>
                <li><strong className="text-foreground">~300,000 шагов:</strong> Находит оптимальные пути</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Практика: собранная среда лаборатории для этой темы. */}
        <LabPracticeSection contextKey="/unity-projects/gridworld" />

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-border/50">
          <Button variant="outline" onClick={() => navigate("/unity-projects/ball-balance")} className="border-primary/50 text-primary hover:bg-primary/10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Ball Balance
          </Button>
          <Button variant="outline" onClick={() => navigate("/unity-projects/racing")} className="border-primary/50 text-primary hover:bg-primary/10">
            Racing Car <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GridWorldProject;
