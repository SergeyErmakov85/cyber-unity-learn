import Math from "@/components/Math";
import { SECTION_TITLE_CLASS, ProseP, Code } from "./_shared";

const Summary = () => (
  <>
    <h2 id="itogi" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Итоги урока
    </h2>

    <ul className="space-y-3 my-4 list-disc list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <strong>ONNX</strong> — открытый кроссплатформенный формат-«слепок» политики: веса + граф для
        прямого прохода, без состояния оптимизатора. Совместимость задаётся opset (Unity: ~7–25) и
        именами входов (<Code>obs_…</Code>).
      </li>
      <li>
        Финальная модель всегда лежит в{" "}
        <strong>
          <Code>results/&lt;run-id&gt;/&lt;behavior_name&gt;.onnx</Code>
        </strong>{" "}
        и пишется при завершении или одном Ctrl+C; <Code>.pt</Code>-чекпойнты — для{" "}
        <Code>--resume</Code>/дообучения.
      </li>
      <li>
        Инференс в билде делает <strong>встроенный движок Unity</strong> (Barracuda → Sentis →
        Inference Engine); для типового проекта код инференса писать не нужно.
      </li>
      <li>
        Встраивание — это поле <strong>Model</strong> в Behavior Parameters + выбор{" "}
        <strong>Inference Device</strong>; рантайм-подмена — через <Code>SetModel(...)</Code>.
      </li>
      <li>
        <strong>Behavior Type = Inference Only</strong> для прода; <strong>Decision Period</strong>{" "}
        <Math display={false}>{String.raw`d`}</Math> задаёт частоту решений{" "}
        <Math display={false}>{String.raw`f_{\text{decision}}=f_{\text{env}}/d`}</Math> и должен
        совпадать с обучением; <strong>детерминированный</strong> инференс убирает сэмплирование (
        <Math display={false}>{String.raw`\arg\max`}</Math> вместо{" "}
        <Math display={false}>{String.raw`\sim\pi_\theta`}</Math>).
      </li>
      <li>
        <strong>CPU обычно быстрее GPU</strong> для маленьких ML-Agents-сетей; бюджет кадра{" "}
        <Math display={false}>{String.raw`N\cdot t_{\text{inf}}`}</Math> держим под контролем через
        Decision Period; релиз — на <strong>IL2CPP</strong>.
      </li>
      <li>
        Самый частый сбой деплоя — <strong>рассинхрон контракта</strong> наблюдений/действий; Space
        Size, сенсоры, действия, Behavior Name и Decision Period в деплое обязаны совпадать с
        обучением.
      </li>
    </ul>

    <ProseP>
      <em>
        Версии актуальны на момент написания (ML-Agents Release 22 /{" "}
        <Code>com.unity.ml-agents</Code> 4.0.x, Unity Inference Engine{" "}
        <Code>com.unity.ai.inference</Code>). Имена пакетов инференс-движка менялись (Barracuda →
        Sentis → Inference Engine) — при сверке с репозиторием ориентируйтесь на версию тулкита в
        проекте.
      </em>
    </ProseP>
  </>
);

export default Summary;
