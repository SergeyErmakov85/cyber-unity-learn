import Math from "@/components/Math";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints } from "./_shared";

const PLR_PSEUDO = `# Псевдокод PLR (Jiang и др., 2021)
при выборе следующего уровня:
    с вероятностью (1 − d): replay  → сэмпл l ~ P_replay(l)        # учить «полезное»
    иначе:                  explore → новый сид, сыграть, оценить его потенциал
после эпизода на уровне l:
    S_l ← (1/T) · Σ_t |Â_t|        # учебный потенциал ≈ средний |GAE| (см. урок 3.1)
    обновить свежесть(l)
P_replay(l) = (1 − ρ)·P_S(l) + ρ·P_C(l)   # смесь «по баллу» и «по свежести»`;

const Section6 = () => (
  <>
    <h2 id="razdel-6-plr" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 6. Prioritized Level Replay: учебный план без контроля над генератором
    </h2>

    <ProseP>
      ADR предполагает, что мы <strong>управляем</strong> параметрами генерации (можем задать диапазон
      сцепления). Но часто среда — это <strong>процедурно генерируемые уровни</strong> (PCG), где у нас
      на руках лишь «сид» (seed), а как именно он раскладывается в уровень — чёрный ящик. Менять
      распределение генерации нельзя; можно лишь решать, <strong>какие уровни переигрывать чаще</strong>.
      Для этого случая — <strong>Prioritized Level Replay (PLR)</strong>, Jiang и др. (2021).
    </ProseP>

    <ProseP>
      Идея PLR: вести распределение над <em>уже виденными</em> уровнями и переигрывать те, у которых
      выше <strong>учебный потенциал</strong> (learning potential) — то есть где агенту сейчас есть чему
      поучиться. Как измерить потенциал? Удачным оказался сигнал, который мы уже знаем по PPO:{" "}
      <strong>средняя величина преимущества</strong> <Math display={false}>{String.raw`|\enfOp{\hat{A}}_t|`}</Math>{" "}
      — тот самый GAE из{" "}
      <CrossLinkToHub hubPath="/courses/3-1" hubAnchor="ppo" hubTitle="Урок 3.1 — PPO">
        урока 3.1
      </CrossLinkToHub>
      . По сути это L1-ошибка ценности (L1 value loss): большое{" "}
      <Math display={false}>{String.raw`|\enfOp{\hat{A}}_t|`}</Math> означает, что критик сильно ошибается на этом
      уровне — там «сюрприз», там обучение даст больше всего:
    </ProseP>

    <Math>{String.raw`\enfOp{S}_l \;=\; \frac{1}{T}\sum_{t=0}^{T-1} \big|\enfOp{\hat{A}}_t^{\text{GAE}}\big| \qquad (\text{учебный потенциал уровня } l).`}</Math>

    <ProseP>
      Дальше — тонкость, без которой PLR ломается. Балл <Math display={false}>{String.raw`\enfOp{S}_l`}</Math>{" "}
      устаревает: его посчитали давно, политика с тех пор изменилась. Чтобы не переигрывать уровни на
      основе протухших оценок, PLR смешивает распределение <strong>по баллу</strong>{" "}
      <Math display={false}>{String.raw`P_S`}</Math> с распределением <strong>по свежести</strong>{" "}
      (staleness) <Math display={false}>{String.raw`P_C`}</Math>, которое поднимает приоритет уровней,
      давно не пересчитывавшихся:
    </ProseP>

    <Math>{String.raw`\boxed{\,P_{\text{replay}}(l) \;=\; (1-\rho)\,P_S(l \mid \Lambda_{\text{seen}}, \enfOp{S}) \;+\; \rho\,P_C(l \mid \Lambda_{\text{seen}}, C, c)\,}`}</Math>

    <ProseP>
      где <Math display={false}>{String.raw`\rho`}</Math> — коэффициент свежести (
      <code className="px-1 rounded bg-muted/50 text-xs font-mono">staleness_coef</code>), а баллы обычно
      преобразуются ранговой приоритизацией с температурой (как в приоритизированном реплее).
      Канонические значения из репозитория авторов: стратегия{" "}
      <code className="px-1 rounded bg-muted/50 text-xs font-mono">value_l1</code>, ранговое
      преобразование, температура <Math display={false}>{String.raw`0.1`}</Math>,{" "}
      <Math display={false}>{String.raw`\rho = 0.1`}</Math>.
    </ProseP>

    <CyberCodeBlock language="pseudo" filename="plr.pseudo">
      {PLR_PSEUDO}
    </CyberCodeBlock>

    <ProseP>
      Замечательно, что <strong>никто не задавал лестницу сложности</strong> — а на лабиринтах MiniGrid
      PLR сам порождает <strong>неявный учебный план</strong> от простых уровней к трудным: пока трудные
      уровни агенту не по зубам, их потенциал (ошибка критика) низок, и PLR их откладывает; как только
      агент дорос — их <Math display={false}>{String.raw`|\enfOp{\hat{A}}_t|`}</Math> взлетает, и PLR начинает их
      подсовывать.
    </ProseP>

    <ProseP>
      И финальный штрих, связывающий раздел с рубежом (раздел 9): вариант{" "}
      <Math display={false}>{String.raw`\text{PLR}^{\perp}`}</Math> («robust PLR») обновляет политику{" "}
      <strong>только</strong> на переигранных уровнях, игнорируя градиенты со свежесэмплированных. Это,
      как показано в «Replay-Guided Adversarial Environment Design» (Jiang и др., 2021), приводит
      политику к <strong>минимаксно-regret-робастному</strong> решению — то есть к хорошему поведению в
      наихудшем случае. Так курирование уровней по учебному потенциалу смыкается с теорией игр.
    </ProseP>

    <KeyPoints
      items={[
        <>
          <strong>PLR</strong> (Jiang и др., 2021) нужен, когда генератор уровней — чёрный ящик:
          управляем только тем, <strong>что переигрывать</strong>.
        </>,
        <>
          Учебный потенциал уровня ≈ средний <Math display={false}>{String.raw`|\enfOp{\hat{A}}_t|`}</Math>{" "}
          (<strong>L1 value loss</strong> ≈ |GAE| из{" "}
          <CrossLinkToHub hubPath="/courses/3-1" hubAnchor="ppo" hubTitle="Урок 3.1 — PPO">
            урока 3.1
          </CrossLinkToHub>
          ): где критик ошибается сильнее — там учиться полезнее.
        </>,
        <>
          <strong>Staleness-коррекция</strong> обязательна:{" "}
          <Math display={false}>{String.raw`P_{\text{replay}} = (1-\rho)P_S + \rho P_C`}</Math> — иначе
          приоритеты строятся на протухших баллах.
        </>,
        <>
          PLR порождает <strong>неявный</strong> учебный план (легко→трудно); вариант{" "}
          <Math display={false}>{String.raw`\text{PLR}^{\perp}`}</Math> даёт{" "}
          <strong>минимакс-regret</strong> робастность — мост к UED (раздел 9).
        </>,
      ]}
    />
  </>
);

export default Section6;
