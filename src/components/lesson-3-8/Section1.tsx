import Math from "@/components/Math";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints, InteractiveStub } from "./_shared";

const Section1 = () => (
  <>
    <h2 id="anatomiya-proekta" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 1. Анатомия финального проекта: шесть этапов
    </h2>

    <ProseP>
      Прежде чем браться за конкретную игру, зафиксируем <strong>методологию</strong> — общий каркас, который дальше переиспользуется во всех четырёх эталонных проектах. Это ваш чек-лист от пустой сцены до сертификата.
    </ProseP>

    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm border border-cyan-500/20 rounded-lg overflow-hidden">
        <thead className="bg-cyan-500/10">
          <tr className="text-left text-cyan-200">
            <th className="p-3">Этап</th>
            <th className="p-3">Что делаем</th>
            <th className="p-3">Ориентир по времени</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cyan-500/10 text-foreground/85">
          <tr><td className="p-3"><strong>1. Среда</strong></td><td className="p-3">Unity-сцена, <code>Agent</code>-компонент, сенсоры (наблюдения), пространство действий, структура эпизода</td><td className="p-3">2–4 ч</td></tr>
          <tr><td className="p-3"><strong>2. Функция награды</strong></td><td className="p-3">dense rewards за прогресс, штрафы за ошибки, бонусы за цели, защита от reward hacking</td><td className="p-3">2–3 ч</td></tr>
          <tr><td className="p-3"><strong>3. Обучение</strong></td><td className="p-3">YAML-конфиг (PPO/SAC/POCA), <code>mlagents-learn</code> с параллельными средами</td><td className="p-3">2–4 ч</td></tr>
          <tr><td className="p-3"><strong>4. Оптимизация</strong></td><td className="p-3">диагностика по TensorBoard, Optuna-свип, W&B-логи, FCA-анализ результатов</td><td className="p-3">2–4 ч</td></tr>
          <tr><td className="p-3"><strong>5. Деплой</strong></td><td className="p-3">ONNX-экспорт, <code>BehaviorParameters</code>, инференс в Unity Sentis, квантизация</td><td className="p-3">1–2 ч</td></tr>
          <tr><td className="p-3"><strong>6. Геймплей</strong></td><td className="p-3">управление игроком, камера, UI/HUD, сборка билда под платформу</td><td className="p-3">2–4 ч</td></tr>
        </tbody>
      </table>
    </div>

    <ProseP>
      Важнейшая идея методологии — <strong>этапы не линейны, а образуют цикл с обратными связями</strong>. Если на этапе 4 TensorBoard показывает, что reward не растёт, проблема почти всегда лежит на этапе 1 (плохие наблюдения) или 2 (плохая награда), а не в гиперпараметрах. Поэтому опытный разработчик возвращается назад, а не крутит <code>learning_rate</code> до бесконечности.
    </ProseP>

    <Math>
      {String.raw`\text{Этап}_k \;\xrightarrow{\;\text{вперёд}\;}\; \text{Этап}_{k+1}, \qquad \text{Этап}_{k}\;\xleftarrow{\;\text{диагностика}\;}\;\text{Этап}_{4}\ (\text{TensorBoard})`}
    </Math>

    <InteractiveStub title="Интерактив (рекомендация)">
      Кликабельная диаграмма конвейера: шесть узлов, по клику раскрывается чек-лист этапа и подсвечиваются обратные связи «диагностика → к какому этапу возвращаться». Реализация — JSX/React (не статичный SVG); состояние раскрытых узлов — в <code>useState</code>.
    </InteractiveStub>

    <KeyPoints
      items={[
        <>Шесть этапов — это <strong>переиспользуемый каркас</strong> проекта, общий для любой игры.</>,
        <>Закладывайте <strong>11–21 час</strong> суммарно; самый недооценённый этап — награда (этап 2).</>,
        <>Конвейер <strong>циклический</strong>: плохие метрики на этапе 4 чаще лечатся возвратом к этапам 1–2, чем подбором гиперпараметров.</>,
      ]}
    />
  </>
);

export default Section1;
