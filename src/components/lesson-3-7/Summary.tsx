import Math from "@/components/Math";
import { SECTION_TITLE_CLASS, Code } from "./_shared";

const Summary = () => (
  <>
    <h2 id="itogi" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Итоги урока
    </h2>

    <ul className="space-y-3 my-4 list-disc list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li>
        Сеть агента = <strong>энкодер</strong> (наблюдение → эмбеддинг{" "}
        <Math display={false}>{String.raw`z`}</Math>) + <strong>голова</strong> (
        <Math display={false}>{String.raw`z`}</Math> → действие/оценка). Проектирование архитектуры —
        это в первую очередь <strong>выбор энкодера под тип наблюдения</strong>.
      </li>
      <li>
        Карта «наблюдение → энкодер»: вектор → <strong>MLP</strong>; пиксели → <strong>CNN</strong>{" "}
        (<Code>simple</Code>/<Code>nature_cnn</Code>/<Code>resnet</Code>); частичная наблюдаемость
        (POMDP) → <strong>кадровый стек</strong> или <strong>LSTM</strong> (<Code>memory</Code>);
        переменное число сущностей → <strong>внимание</strong> (тот же, что в 3.2).
      </li>
      <li>
        Actor и critic делят backbone (<Code>shared_critic: true</Code>), когда энкодер дорогой (CNN
        над пикселями); иначе — раздельно.
      </li>
      <li>
        Всё это — поля одного блока <Code>network_settings</Code>. Дефолты:{" "}
        <Math display={false}>{String.raw`128`}</Math> юнитов,{" "}
        <Math display={false}>{String.raw`2`}</Math> слоя, <Code>simple</Code>-энкодер,{" "}
        <Code>memory_size</Code> кратно 2. В 4.0.x <strong>нет <Code>encoding_size</Code></strong>.
      </li>
      <li>
        Return-to-go и <strong>Decision Transformer</strong> (
        <Math display={false}>{String.raw`\tau = (\hat R_t, s_t, a_t)`}</Math>) — взгляд на политику
        как на языковую модель; направление развития области.
      </li>
    </ul>
  </>
);

export default Summary;
