import Math from "@/components/Math";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints } from "./_shared";

const Section6 = () => (
  <>
    <h2 id="razdel-6-shared-vs-separate" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 6. Один backbone или два: actor и critic
    </h2>

    <ProseP>
      Actor (политика) и critic (оценка) — обе сети получают одно и то же наблюдение. Делить им
      энкодер или нет?
    </ProseP>

    <ProseP>
      <strong>Раздельные backbone.</strong> У актора свой энкодер, у критика — свой. Градиенты не
      мешают друг другу: цель политики и цель ценности не «перетягивают» общие признаки. Безопасный
      дефолт для <strong>векторных</strong> наблюдений, где энкодер дешёвый.
    </ProseP>

    <ProseP>
      <strong>Общий backbone (shared).</strong> Один энкодер{" "}
      <Math display={false}>{String.raw`f_\phi`}</Math> кодирует{" "}
      <Math display={false}>{String.raw`o`}</Math> в <Math display={false}>{String.raw`z`}</Math>,
      дальше две головы: <Math display={false}>{String.raw`\pi(a\mid z)`}</Math> и{" "}
      <Math display={false}>{String.raw`V(z)`}</Math>. Экономит параметры и заставляет обе задачи
      учить общее представление — это особенно ценно для <strong>дорогих энкодеров</strong>, в
      первую очередь CNN над пикселями: два независимых CNN — это двойная стоимость и вдвое больше
      данных на обучение.
    </ProseP>

    <ProseP>
      В ML-Agents этим управляет один флаг PPO: <code>shared_critic</code> (дефолт{" "}
      <code>false</code>). Документация прямо советует включать его{" "}
      <strong>при обучении с изображений</strong>. Для нашего гоночного агента: на векторных лучах —
      оставляем <code>false</code>; если перешли на камеру — <code>true</code> экономит и
      стабилизирует.
    </ProseP>

    <KeyPoints
      items={[
        <>Раздельные сети актора/критика — безопасно для дешёвых (векторных) энкодеров.</>,
        <>
          <strong>Общий backbone</strong> экономит параметры и полезен для{" "}
          <strong>дорогих энкодеров</strong> (CNN над пикселями).
        </>,
        <>
          В ML-Agents это флаг <code>shared_critic</code> (дефолт <code>false</code>); включать при
          обучении с картинки.
        </>,
      ]}
    />
  </>
);

export default Section6;
