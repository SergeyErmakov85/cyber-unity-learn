import { SECTION_TITLE_CLASS, H3_CLASS, ProseP, Callout, WarnNote, Code } from "./_shared";

const Summary = () => (
  <>
    <h2 id="itogi" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Итоги: Recommendations и Caveats
    </h2>

    <h3 className={H3_CLASS}>Recommendations — пошаговый рецепт</h3>

    <Callout title="Этап 1 — старт (демо + BC)" color="cyan">
      Запишите 10–30 разнообразных заездов через <Code>Demonstration Recorder</Code>. Включите только{" "}
      <Code>behavioral_cloning</Code> (<Code>strength 0.5</Code>, <Code>steps 300k</Code>) +{" "}
      <Code>extrinsic</Code> и обучите как baseline. <strong>Порог перехода:</strong> агент уверенно
      проезжает хотя бы один круг без BC-доминирования (<Code>Losses/Pretraining Loss</Code> вышел на
      плато).
    </Callout>

    <Callout title="Этап 2 — добавить GAIL" color="purple">
      Включите <Code>reward_signals: gail</Code> со <Code>strength 0.1</Code>,{" "}
      <Code>use_actions: false</Code>, <Code>use_vail: false</Code>. Следите за сближением{" "}
      <Code>Policy/GAIL Policy Estimate</Code> и <Code>Policy/GAIL Expert Estimate</Code>.{" "}
      <strong>Порог-триггер:</strong> если разрыв не сокращается или <Code>GAIL Loss</Code>
      нестабилен — понизьте <Code>gail.learning_rate</Code> до <Code>1e-4</Code> и/или включите{" "}
      <Code>use_vail: true</Code>. Если <Code>Environment/Cumulative Reward</Code> падает с ростом
      GAIL → снижайте <Code>gail.strength</Code> к <Code>0.05–0.03</Code>.
    </Callout>

    <Callout title="Этап 3 — робастность" color="cyan">
      Наложите domain randomization из урока 3.3 на трассы. <strong>Порог:</strong> если на
      рандомизированных трассах производительность сильно ниже, чем на демо-трассе, — расширьте
      диапазоны рандомизации (или подключите PLR), но <strong>не</strong> повышайте{" "}
      <Code>gail.strength</Code> (усугубит переобучение на стиль одной трассы).
    </Callout>

    <Callout title="Этап 4 — если нужна переносимость награды" color="amber">
      Если стоит задача переносить поведение в среды с <strong>разной динамикой</strong> (другая
      физика/сцепление), рассматривайте <strong>AIRL</strong> (вне штатного ML-Agents — через
      сторонние реализации, например библиотеку <Code>imitation</Code>): GAIL-награда не disentangled.
      <strong>Триггер замены GAIL→AIRL:</strong> политика, обученная GAIL, деградирует при переносе в
      среду с изменённой динамикой.
    </Callout>

    <WarnNote>
      <strong>Чего не делать:</strong> не полагайтесь на чистый offline-BC для длинных гонок
      (квадратичный covariate shift). Не используйте устаревшие поля (<Code>encoding_size</Code>,{" "}
      <Code>online_bc</Code>, Broadcast Hub). Не ставьте высокий <Code>gail.strength</Code> с
      человеческими демо вместе с extrinsic.
    </WarnNote>

    <h3 className={H3_CLASS}>Caveats — на что обратить внимание</h3>

    <ul className="space-y-3 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li className="flex gap-2.5">
        <span className="text-amber-400 mt-0.5 shrink-0">▸</span>
        <span>
          <strong>Эмпирические числа сэмпл-эффективности GAIL</strong> («~4 траектории / ~200
          переходов», «до ~25 млн шагов среды») — из Kostrikov и др. (ICLR 2019), не из оригинала. В
          самой статье Ho &amp; Ermon фигурируют датасеты <Code>{"{4,11,18,25}"}</Code> траекторий
          для Hopper/Walker и вывод о «точном экспертном уровне на Humanoid». Конкретные числа для
          гоночного агента в Unity — ориентировочны.
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-amber-400 mt-0.5 shrink-0">▸</span>
        <span>
          <strong>Награда GAIL в ML-Agents</strong> реализована как собственный сигнал; формула{" "}
          <Code>r=-log(1-D)</Code> — каноническая из статьи, но точная нормировка/клиппинг в коде
          ML-Agents могут отличаться. Для тонкой настройки ориентируйтесь на TensorBoard-метрики, а не
          на абсолютные значения награды.
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-amber-400 mt-0.5 shrink-0">▸</span>
        <span>
          <strong>Диапазоны гиперпараметров</strong> — это рекомендации документации, не жёсткие
          границы. Для непрерывного управления часто нужны значения у верхней границы{" "}
          <Code>batch_size</Code>/<Code>hidden_units</Code>.
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-amber-400 mt-0.5 shrink-0">▸</span>
        <span>
          <strong>Версионная оговорка:</strong> всё по ML-Agents выверено по{" "}
          <Code>com.unity.ml-agents@4.0</Code> (Release 22). При обновлении пакета сверяйтесь с{" "}
          <em>Training-Configuration-File</em> и <em>Using-Tensorboard</em> соответствующей версии —
          имена полей и метрик исторически менялись (особенно <Code>encoding_size</Code> →{" "}
          <Code>network_settings</Code>).
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-amber-400 mt-0.5 shrink-0">▸</span>
        <span>
          <strong>DAgger</strong> в штатном ML-Agents «из коробки» не реализован — нет механизма
          онлайн-дозапроса эксперта. Он приведён здесь как теоретический ориентир и для сравнения
          границ ошибки.
        </span>
      </li>
    </ul>

    <ProseP>
      <strong>Главный takeaway урока.</strong> Imitation Learning — это не «обходной путь вокруг
      RL», а способ перераспределить нагрузку: BC берёт на себя разгон, GAIL — задание стиля, PPO с
      extrinsic — цель, рандомизация из урока 3.3 — робастность. Дальше эта же связка ложится в
      основу подготовки модели к деплою — что вы увидите в следующем уроке.
    </ProseP>
  </>
);

export default Summary;
