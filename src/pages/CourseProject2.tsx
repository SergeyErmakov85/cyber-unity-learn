import LessonLayout from "@/components/LessonLayout";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import ProGate from "@/components/ProGate";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import HubLink from "@/components/math-rl/HubLink";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Trophy, CheckCircle2, ExternalLink, Download } from "lucide-react";

const CourseProject2 = () => {
  const preview = (
    <>
      <section id="capstone-return-test" className="scroll-mt-28 mb-6 p-4 rounded-lg border border-[rgba(255,255,255,0.05)] bg-[rgba(0,255,214,0.04)]">
        <p className="text-sm text-muted-foreground mb-2">
          Дисконтированный возврат опирается на сумму геометрического ряда —
          формальный вывод см. в хабе:
        </p>
        <HubLink
          to="/hub/math-rl"
          anchor="геометрический-ряд"
          variant="pill"
          fromPath="/courses/project-2"
          fromAnchor="capstone-return-test"
          fromLabel="Капстоун · 3D-агент-охотник"
        >
          Геометрический ряд и сходимость возврата
        </HubLink>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">Задание</h2>
        <p className="text-muted-foreground leading-relaxed">
          Создайте 3D-среду в Unity: замкнутая арена с препятствиями, где агент должен
          преследовать и поймать подвижную цель. Используйте <CrossLinkToHub hubPath="/algorithms/ppo" hubTitle="PPO — Proximal Policy Optimization">PPO</CrossLinkToHub> с dense reward shaping,
          параллельные среды для ускорения обучения и TensorBoard для мониторинга.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-3">
          Этот проект объединяет все навыки Уровня 2: reward design, параллелизацию,
          непрерывное управление и визуализацию обучения.
        </p>
      </section>
    </>
  );

  return (
    <LessonLayout
      lessonId="project-2"
      lessonTitle="3D-агент-охотник в Unity"
      lessonNumber="П2"
      duration="90–120 мин"
      tags={["#project", "#unity", "#ppo"]}
      level={2}
      prevLesson={{ path: "/courses/2-6", title: "TensorBoard и W&B" }}
      nextLesson={{ path: "/courses/project-3", title: "Проект 3" }}
    >
      <ProGate preview={preview}>
        {preview}

        {/* Environment */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Описание среды</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "Арена", value: "10×10 замкнутая площадка с 4 препятствиями" },
              { label: "Агент", value: "Сфера с Rigidbody, непрерывное управление (2D force)" },
              { label: "Цель", value: "Подвижная сфера, случайно меняющая направление" },
              { label: "Наблюдения", value: "8: позиция агента (2), скорость (2), позиция цели (2), расстояние до стен (2)" },
              { label: "Действия", value: "2 непрерывных: force_x [-1,1], force_z [-1,1]" },
              { label: "Макс. шагов", value: "1000 за эпизод" },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-lg bg-card/40 border border-border/30">
                <p className="text-xs text-primary font-semibold">{item.label}</p>
                <p className="text-sm text-muted-foreground mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Reward structure */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Система наград</h2>
          <Card className="bg-card/40 border-primary/20">
            <CardContent className="p-5">
              <div className="flex items-start gap-3 mb-4">
                <Target className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <h3 className="font-bold text-foreground">Reward Structure</h3>
              </div>
              <div className="space-y-2">
                {[
                  { reward: "+1.0", event: "Поимка цели (расстояние < 1.0)" },
                  { reward: "-0.001", event: "Каждый шаг (мотивация к скорости)" },
                  { reward: "-1.0", event: "Столкновение со стеной" },
                  { reward: "+0.01 × Δdist", event: "Приближение к цели (dense)" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="font-mono text-xs text-primary w-20 text-right">{item.reward}</span>
                    <span className="text-muted-foreground">{item.event}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Agent C# */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Starter-код агента</h2>
          <CyberCodeBlock language="csharp" filename="HunterAgent.cs">
{`using Unity.MLAgents;
using Unity.MLAgents.Actuators;
using Unity.MLAgents.Sensors;
using UnityEngine;

public class HunterAgent : Agent
{
    public Transform target;
    public float moveSpeed = 5f;
    private Rigidbody rb;
    private float previousDist;

    public override void Initialize()
    {
        rb = GetComponent<Rigidbody>();
    }

    public override void OnEpisodeBegin()
    {
        // Сброс позиции
        transform.localPosition = new Vector3(
            Random.Range(-4f, 4f), 0.5f, Random.Range(-4f, 4f));
        rb.velocity = Vector3.zero;

        // Случайная позиция цели
        target.localPosition = new Vector3(
            Random.Range(-4f, 4f), 0.5f, Random.Range(-4f, 4f));

        previousDist = Vector3.Distance(
            transform.localPosition, target.localPosition);
    }

    public override void CollectObservations(VectorSensor sensor)
    {
        // TODO: добавьте 8 наблюдений
        sensor.AddObservation(transform.localPosition.x);
        sensor.AddObservation(transform.localPosition.z);
        sensor.AddObservation(rb.velocity.x);
        sensor.AddObservation(rb.velocity.z);
        sensor.AddObservation(target.localPosition.x);
        sensor.AddObservation(target.localPosition.z);
        // TODO: добавьте расстояние до ближайших стен
    }

    public override void OnActionReceived(ActionBuffers actions)
    {
        float forceX = actions.ContinuousActions[0];
        float forceZ = actions.ContinuousActions[1];
        rb.AddForce(new Vector3(forceX, 0, forceZ) * moveSpeed);

        // TODO: реализуйте систему наград
        float currentDist = Vector3.Distance(
            transform.localPosition, target.localPosition);

        // Dense reward за приближение
        AddReward((previousDist - currentDist) * 0.1f);
        previousDist = currentDist;

        // Штраф за время
        AddReward(-0.001f);

        // Поимка
        if (currentDist < 1.0f)
        {
            AddReward(1.0f);
            EndEpisode();
        }
    }

    public override void Heuristic(in ActionBuffers actionsOut)
    {
        var c = actionsOut.ContinuousActions;
        c[0] = Input.GetAxis("Horizontal");
        c[1] = Input.GetAxis("Vertical");
    }
}`}
          </CyberCodeBlock>

          <div className="flex gap-3 mt-4 flex-wrap">
            <Button variant="outline" size="sm" asChild>
              <a href="https://colab.research.google.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5" />
                Unity Package
              </a>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Download className="w-3.5 h-3.5" />
              Скачать YAML-конфиг
            </Button>
          </div>
        </section>

        {/* Success criteria */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Критерии успеха</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-3 text-muted-foreground">Метрика</th>
                  <th className="text-left py-2 px-3 text-muted-foreground">Минимум</th>
                  <th className="text-left py-2 px-3 text-muted-foreground">Хорошо</th>
                  <th className="text-left py-2 px-3 text-primary">Отлично</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { m: "Avg reward (последние 100)", min: "> 0.5", good: "> 0.8", great: "> 0.95" },
                  { m: "Шаги до конвергенции", min: "< 1M", good: "< 500k", great: "< 300k" },
                  { m: "Процент поимок", min: "> 60%", good: "> 80%", great: "> 95%" },
                  { m: "TensorBoard графики", min: "Есть", good: "+интерпретация", great: "+сравнение run-ов" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border/20">
                    <td className="py-2 px-3 text-foreground">{row.m}</td>
                    <td className="py-2 px-3 text-muted-foreground">{row.min}</td>
                    <td className="py-2 px-3 text-secondary">{row.good}</td>
                    <td className="py-2 px-3 text-primary font-semibold">{row.great}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </ProGate>
    </LessonLayout>
  );
};

export default CourseProject2;
