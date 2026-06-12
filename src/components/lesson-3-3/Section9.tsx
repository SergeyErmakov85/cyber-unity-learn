import Math from "@/components/Math";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints } from "./_shared";

const Section9 = () => (
  <>
    <h2 id="razdel-9-ued" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 9. Рубеж: Unsupervised Environment Design — self-play над средами
    </h2>

    <ProseP>
      Мы прошли путь: ручной план → авто-план (ACL) → ADR → PLR. Логичный финал —{" "}
      <strong>полностью убрать человека из проектирования среды</strong> и заставить{" "}
      <em>учителя-генератора</em> самого изобретать миры на грани возможностей ученика. Это парадигма{" "}
      <strong>Unsupervised Environment Design (UED)</strong>, Dennis и др. (2020): разработчик отдаёт
      среду со «свободными» параметрами, а алгоритм сам производит распределение над{" "}
      <strong>корректными, решаемыми</strong> средами, адаптируя сложность под прогресс агента.
    </ProseP>

    <ProseP>UED аккуратно чинит крайности, которые мы уже обсуждали:</ProseP>
    <ul className="space-y-2 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <strong>Чистая рандомизация (DR)</strong> не умеет ни порождать структуру, ни подстраивать
          сложность под агента.
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <strong>Минимаксный противник</strong> (генерировать самые трудные миры) скатывается к{" "}
          <strong>нерешаемым</strong> средам — учиться на них нельзя.
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <strong>Минимакс-regret</strong> — золотая середина: генерировать миры, которые трудны, но{" "}
          <strong>решаемы</strong>.
        </span>
      </li>
    </ul>

    <ProseP>
      Флагман UED — <strong>PAIRED</strong> (Dennis и др., 2020): учитель-генератор создаёт уровни,
      максимизируя <strong>regret</strong> — разницу между отдачей «антагониста» и «протагониста»:
    </ProseP>

    <Math>{String.raw`\text{Regret} \;=\; U^{\text{antagonist}}(\theta) \;-\; U^{\text{protagonist}}(\theta).`}</Math>

    <ProseP>
      Создавая уровни, где антагонист справляется, а протагонист — пока нет, учитель порождает задачи
      ровно на <strong>границе компетентности</strong> ученика и при этом заведомо решаемые. Возникает
      эмерджентный учебный план нарастающей сложности — без единого «урока», написанного руками.
      Соседние подходы: <strong>POET</strong> (Wang и др., 2019) — со-эволюция популяции «среда+агент»;{" "}
      <strong>ACCEL</strong> (Parker-Holder и др., 2022) — эволюция уровней при одном агенте, с
      приоритетом «самых простых из тех, что агент ещё не решает». А связку{" "}
      <Math display={false}>{String.raw`\text{PLR}^{\perp}`}</Math> ↔ UED мы уже видели в разделе 6.
    </ProseP>

    <ProseP>Сравнение семейства методов:</ProseP>

    <div className="my-6 overflow-x-auto rounded-xl border border-cyan-500/15 bg-card/40 backdrop-blur-sm">
      <table className="w-full min-w-[760px] text-[14px] text-foreground/90">
        <thead>
          <tr className="border-b border-cyan-500/20 bg-cyan-500/5">
            <th className="text-left py-3 px-4 font-semibold text-cyan-400">Метод</th>
            <th className="text-left py-3 px-4 font-semibold text-cyan-400">Кто генерирует среды</th>
            <th className="text-left py-3 px-4 font-semibold text-cyan-400">Как выбирается сложность</th>
            <th className="text-left py-3 px-4 font-semibold text-cyan-400">Контроль над генератором</th>
            <th className="text-left py-3 px-4 font-semibold text-cyan-400">Тип гарантии</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border/20 align-top">
            <td className="py-3 px-4">Domain Randomization</td>
            <td className="py-3 px-4">
              фикс. распределение <Math display={false}>{String.raw`p(c)`}</Math>
            </td>
            <td className="py-3 px-4">никак (не адаптируется)</td>
            <td className="py-3 px-4">да</td>
            <td className="py-3 px-4">разнообразие</td>
          </tr>
          <tr className="border-b border-border/20 align-top">
            <td className="py-3 px-4">
              <strong>ADR</strong>
            </td>
            <td className="py-3 px-4">
              расширяемые границы <Math display={false}>{String.raw`P_\phi`}</Math>
            </td>
            <td className="py-3 px-4">
              пороги <Math display={false}>{String.raw`t_L/t_H`}</Math> по успешности
            </td>
            <td className="py-3 px-4">да</td>
            <td className="py-3 px-4">растущая сложность</td>
          </tr>
          <tr className="border-b border-border/20 align-top">
            <td className="py-3 px-4">
              <strong>PLR</strong>
            </td>
            <td className="py-3 px-4">чёрный ящик (сиды)</td>
            <td className="py-3 px-4">
              переигрывать высокий <Math display={false}>{String.raw`|\hat A_t|`}</Math>
            </td>
            <td className="py-3 px-4">нет (только курирование)</td>
            <td className="py-3 px-4">
              <Math display={false}>{String.raw`\text{PLR}^{\perp}`}</Math> → минимакс-regret
            </td>
          </tr>
          <tr className="border-b border-border/20 align-top">
            <td className="py-3 px-4">
              <strong>PAIRED</strong>
            </td>
            <td className="py-3 px-4">обучаемый учитель</td>
            <td className="py-3 px-4">максимизация regret</td>
            <td className="py-3 px-4">да (учитель-агент)</td>
            <td className="py-3 px-4">минимакс-regret</td>
          </tr>
          <tr className="align-top">
            <td className="py-3 px-4">
              <strong>POET/ACCEL</strong>
            </td>
            <td className="py-3 px-4">эволюция уровней</td>
            <td className="py-3 px-4">отбор решаемых трудных</td>
            <td className="py-3 px-4">да</td>
            <td className="py-3 px-4">робастность к разнообразию</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ProseP>
      И вот мост, замыкающий три урока продвинутого раздела. В{" "}
      <CrossLinkToHub hubPath="/courses/3-2" hubAnchor="self-play" hubTitle="Урок 3.2 — Self-Play">
        уроке 3.2
      </CrossLinkToHub>{" "}
      self-play был игрой <strong>двух политик</strong> друг против друга. UED — это игра между{" "}
      <strong>учеником и учителем-средой</strong>: тот же принцип «соревнования, порождающего
      сложность», но теперь соперник — не другой игрок, а сам мир. Не случайно эту общую идею называют{" "}
      <strong>автокурриккулумами</strong> (Leibo и др., 2019): сложность рождается из взаимодействия, а
      не задаётся извне. Self-play, ADR, PLR и UED — это одно и то же дерево, ветвящееся по вопросу «кто
      и как поднимает планку».
    </ProseP>

    <ProseP>
      <strong>Куда дальше.</strong> Дальше курс перейдёт от «как поднимать сложность» к более прикладным
      сюжетам продвинутого уровня и финальному проекту, где рандомизация и учебный план из этого урока
      станут штатными инструментами обучения робастной политики.
    </ProseP>

    <KeyPoints
      items={[
        <>
          <strong>UED</strong> (Dennis и др., 2020): учитель-генератор сам производит распределение{" "}
          <strong>решаемых</strong> сред, подстраивая сложность под агента.
        </>,
        <>
          <strong>PAIRED</strong> максимизирует <strong>regret</strong> (антагонист − протагонист) →
          трудные, но решаемые миры; <strong>минимакс-regret</strong> — середина между бесполезной DR и
          нерешаемым минимаксом.
        </>,
        <>
          <strong>POET/ACCEL</strong> — эволюционные родственники;{" "}
          <Math display={false}>{String.raw`\text{PLR}^{\perp}`}</Math> уже даёт минимакс-regret
          курированием.
        </>,
        <>
          Главная мысль: self-play (3.2), ADR, PLR и UED — это <strong>автокурриккулумы</strong>; UED —
          это «<strong>self-play над средами</strong>».
        </>,
      ]}
    />
  </>
);

export default Section9;
