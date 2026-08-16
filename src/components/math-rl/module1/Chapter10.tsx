import { Gamepad2 } from "lucide-react";
import Math from "@/components/Math";
import { Section, InfoBox } from "./Section";

const Chapter10 = () => (
  <Section icon={<Gamepad2 className="w-5 h-5 text-primary" />} title="Глава 10. Мост к практике: Unity ML-Agents" id="глава-10">
    <p>
      Unity ML-Agents позволяет создавать 3D-симуляции на C#, выступающие в роли Среды, в то время как алгоритмы RL (PPO на Python/PyTorch) работают в отдельном процессе через TCP.
    </p>

    <h3 id="связь-mdp-unity-event-функции" className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3">Связь MDP → Unity Event-функции</h3>

    <InfoBox>
      <div className="space-y-4 text-sm">
        <div>
          <strong className="text-primary">1. Формирование вектора состояний <Math display={false}>{"S_t \\in \\mathbb{\\enfTgt{R}}^n"}</Math></strong>
          <p>Метод <code className="text-primary">CollectObservations(VectorSensor sensor)</code>: вызовы <code>sensor.AddObservation(transform.localPosition)</code>, <code>sensor.AddObservation(rigidbody.velocity)</code>. Все числа конкатенируются в плоский тензор и отправляются на вход нейросети Актора. Помните о Марковском свойстве!</p>
        </div>
        <div>
          <strong className="text-primary">2. Применение действий <Math display={false}>{"A_t"}</Math> и переход <Math display={false}>{"p(s',r|s,a)"}</Math></strong>
          <p>Метод <code className="text-primary">OnActionReceived(ActionBuffers actions)</code>: извлечение из <code>ContinuousActions</code>, применение через <code>AddForce/AddTorque</code>. Физический движок PhysX генерирует <Math display={false}>{"S_{t+1}"}</Math> — вероятности переходов эмулируются движком.</p>
        </div>
        <div>
          <strong className="text-primary">3. Сигнал подкрепления <Math display={false}>{"\\enfTgt{R}_t"}</Math></strong>
          <p>Методы <code className="text-primary">AddReward(float)</code> и <code className="text-primary">SetReward(float)</code>. При терминальном состоянии — <code>EndEpisode()</code>, после чего алгоритм рассчитывает <Math display={false}>{"\\enfOp{G}_t"}</Math> и обновляет веса через Backpropagation.</p>
        </div>
      </div>
    </InfoBox>

    <h3 id="гиперпараметры-yaml-и-их-математический-смысл" className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3">Гиперпараметры .yaml и их математический смысл</h3>
    <div className="my-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left py-2 px-3 text-primary">Параметр</th>
            <th className="text-left py-2 px-3 text-foreground">Математический смысл</th>
          </tr>
        </thead>
        <tbody>
          {[
            { p: "gamma", d: "Дальновидность в расчёте G_t — фактор дисконтирования γ" },
            { p: "learning_rate", d: "Коэффициент α в формулах градиентного шага" },
            { p: "beta", d: "Регуляризация энтропии — стимулирует равномерность π(a|s), аналог ε-жадности для нейросетей" },
          ].map((row, i) => (
            <tr key={i} className="border-b border-border/20">
              <td className="py-2 px-3 font-mono text-primary">{row.p}</td>
              <td className="py-2 px-3 text-muted-foreground">{row.d}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Section>
);

export default Chapter10;
