import Math from "@/components/Math";
import { SECTION_TITLE_CLASS, ProseP } from "./_shared";

const Summary = () => (
  <>
    <h2 id="itogi" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Итоги урока
    </h2>

    <ul className="space-y-3 my-4 list-disc list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li>Финальный проект — это <strong>системная сборка</strong> всего курса: шесть этапов (среда → награда → обучение → оптимизация → деплой → геймплей) с обратными связями.</li>
      <li>
        Агент максимизирует <Math display={false}>{String.raw`J(\pi)=\mathbb{E}_\pi[\sum_t \gamma^t r_t]`}</Math> — поэтому <strong>дизайн награды</strong> (потенциальное шейпинг, защита от reward hacking) определяет результат сильнее, чем гиперпараметры.
      </li>
      <li>Обучение задаётся <strong>YAML</strong> (<code>mlagents-learn</code>, <code>--num-envs</code>, <code>--num-areas</code>); PPO — <code>linear</code>/<code>epsilon</code> 0.2/<code>beta</code> 5e-3, SAC — <code>constant</code>/<code>tau</code> 0.005, MA-POCA = конфиг PPO.</li>
      <li>Оптимизация: TensorBoard → <strong>Optuna (TPE) + W&B</strong> → <strong>FCA-анализ</strong> устойчивых конфигов.</li>
      <li>Деплой: <strong>ONNX → Inference Only → Unity Sentis</strong> (заменил Barracuda), при необходимости <strong>квантизация</strong> под мобайл.</li>
      <li>Бонусы: <strong>Curriculum Learning</strong> (новое), <strong>Self-Play</strong> (из 3.2), <strong>GAIL/BC</strong> (новое).</li>
      <li>Четыре эталонных проекта показывают один каркас на четырёх жанрах; обязательное + ≥2 бонуса = <strong>сертификат</strong>.</li>
    </ul>

    <ProseP>
      <strong>В следующих шагах</strong> (за рамками курса): мультиагентные кооперативно-конкурентные арены, перенос политики в реальные движки на проде, RLHF-надстройки над поведением NPC.
    </ProseP>
  </>
);

export default Summary;
