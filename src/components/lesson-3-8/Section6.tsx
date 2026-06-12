import CyberCodeBlock from "@/components/CyberCodeBlock";
import { SECTION_TITLE_CLASS, H3_CLASS, ProseP, KeyPoints, Callout } from "./_shared";

const CODE = `// Конвертация ONNX → оптимизированный .sentis с квантизацией весов
ModelQuantizer.QuantizeWeights(QuantizationType.Uint8, ref model);
ModelWriter.Save("Assets/Models/arena_agent_q.sentis", model);`;

const Section6 = () => (
  <>
    <h2 id="etap-5-deploy" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 6. Этап 5 — Деплой
    </h2>

    <ProseP>
      Обучение завершено — пора «вшить» политику в игру. ML-Agents на каждом чекпойнте сохраняет модель в формате <strong>ONNX</strong> (<code>results/&lt;run-id&gt;/&lt;behavior_name&gt;.onnx</code>).
    </ProseP>

    <h3 className={H3_CLASS}>Базовый путь (рекомендуемый)</h3>
    <ol className="space-y-2 my-4 list-decimal list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li>Перетащите <code>.onnx</code> в проект Unity.</li>
      <li>В компоненте <code>Behavior Parameters</code> агента укажите этот файл в поле <strong>Model</strong>.</li>
      <li>Поставьте <strong>Behavior Type → Inference Only</strong> — агент перестаёт ждать Python-тренер и действует автономно.</li>
    </ol>

    <ProseP>
      Под капотом инференс выполняет <strong>Unity Sentis</strong> — нейросетевой рантайм Unity, пришедший на смену устаревшему <strong>Barracuda</strong>. (Историческая справка: Barracuda → переименован в Sentis → кратко назывался «Unity Inference Engine» → имя вернули к <strong>Sentis</strong>, пакет <code>com.unity.ai.inference</code>.) Sentis импортирует ONNX напрямую и исполняет на CPU или GPU.
    </ProseP>

    <h3 className={H3_CLASS}>Квантизация под мобильные (бонус)</h3>
    <ProseP>
      Для Quest/мобильных моделей вес можно <strong>квантовать</strong> (Uint8 / Float16) средствами Sentis (<code>ModelQuantizer.QuantizeWeights</code>), уменьшив размер и ускорив инференс ценой небольшой потери точности:
    </ProseP>

    <CyberCodeBlock language="csharp" filename="QuantizeModel.cs">{CODE}</CyberCodeBlock>

    <Callout title="Грабли" color="amber">
      Если в билде NPC «застыл», в 90% случаев виноват деплой: не выставлен <strong>Inference Only</strong>, не назначена модель, или число наблюдений/действий в <code>Behavior Parameters</code> разошлось с тем, на чём обучали. Сверяйте размерности.
    </Callout>

    <KeyPoints
      items={[
        <>ML-Agents сохраняет политику в <strong>ONNX</strong> автоматически на каждом чекпойнте.</>,
        <>Деплой: модель в поле <strong>Model</strong> → <strong>Behavior Type: Inference Only</strong>.</>,
        <>Рантаймом служит <strong>Unity Sentis</strong> (заменил Barracuda), импортирует ONNX напрямую.</>,
        <><strong>Квантизация</strong> (Uint8/Float16) уменьшает модель под мобильные; следите за точностью.</>,
      ]}
    />
  </>
);

export default Section6;
