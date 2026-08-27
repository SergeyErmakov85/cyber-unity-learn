import Math from "@/components/Math";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints, Callout } from "./_shared";

const Section9 = () => (
  <>
    <h2 id="razdel-9-decision-transformer" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 9. За горизонтом: Decision Transformer
    </h2>

    <ProseP>
      Всё выше предполагало классическую схему «энкодер → голова, обучаемые градиентом политики».
      Но в 2021 году появился радикально иной взгляд: <strong>что, если относиться к RL как к
      задаче языкового моделирования?</strong>
    </ProseP>

    <ProseP>
      <strong>Decision Transformer</strong> (Chen и др., 2021) выбрасывает функции ценности и
      градиент политики целиком. Вместо этого траектория подаётся в GPT-подобный причинный
      трансформер как <strong>последовательность токенов</strong>:
    </ProseP>

    <Math>
      {String.raw`\tau = \big(\enfTgt{\hat{R}}_1,\, \enfVar{s}_1,\, a_1,\; \enfTgt{\hat{R}}_2,\, \enfVar{s}_2,\, a_2,\; \dots\big),`}
    </Math>

    <ProseP>
      где <Math display={false}>{String.raw`\enfTgt{\hat{R}}_t`}</Math> — <strong>return-to-go</strong>,
      желаемая будущая суммарная награда:
    </ProseP>

    <Math>
      {String.raw`\enfTgt{\hat{R}}_t = \enfTgt{R}^{\text{target}} - \sum_{t'=1}^{t-1} \enfTgt{r}_{t'} .`}
    </Math>

    <ProseP>
      Модель учится предсказывать следующее действие{" "}
      <Math display={false}>{String.raw`a_t`}</Math> по предыдущим токенам (causal-маска внимания).
      На инференсе вы <strong>задаёте желаемый возврат</strong>{" "}
      <Math display={false}>{String.raw`\enfTgt{R}^{\text{target}}`}</Math> — и сеть авторегрессионно
      генерирует действия, ведущие к нему. Никаких уравнений Беллмана: только supervised-обучение
      «продолжи последовательность».
    </ProseP>

    <ProseP>
      Это мощно для <strong>offline RL</strong> (учиться по логам без взаимодействия со средой), но
      не бесплатно: в стохастичных средах return-conditioning может имитировать «везучие»
      траектории вместо хороших решений, и метод плохо «сшивает» куски разных траекторий — то, что
      Беллман-методы делают естественно. Поэтому Decision Transformer — не замена PPO в Unity, а
      важное окно в то, куда движется область.
    </ProseP>

    <Callout title="Связь с уроком 3.2" color="purple">
      Здесь работает тот же трансформер на self-attention, что и в MA-POCA, но теперь —{" "}
      <strong>по оси времени</strong> (последовательность шагов), а не по сущностям. Один механизм,
      две оси применения. См.{" "}
      <CrossLinkToLesson lessonId="3.2" lessonPath="/courses/3-2" lessonTitle="Урок 3.2" lessonLevel={3}>
        урок 3.2
      </CrossLinkToLesson>
      .
    </Callout>

    <KeyPoints
      items={[
        <>
          <strong>Decision Transformer</strong> переформулирует RL как моделирование
          последовательности <code>(return-to-go, состояние, действие)</code>.
        </>,
        <>
          На инференсе политика задаётся целевым возвратом{" "}
          <Math display={false}>{String.raw`\enfTgt{R}^{\text{target}}`}</Math>; обучение — чисто supervised,
          без Беллмана.
        </>,
        <>Силён в <strong>offline RL</strong>; слабые места — стохастичность среды и «сшивание» траекторий.</>,
        <>Тот же self-attention, что в 3.2, но применённый по оси <strong>времени</strong>.</>,
      ]}
    />
  </>
);

export default Section9;
