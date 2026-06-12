import Math from "@/components/Math";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints, InteractiveStub } from "./_shared";

const ADR_PSEUDO = `# Псевдокод ADR (по мотивам OpenAI и др., 2019): расширение границ через boundary sampling
инициализировать φ = центр диапазонов  # нулевая ширина = нерандомизированная среда
повторять:
    λ ← сэмпл из P_φ                      # обычная среда из текущего распределения
    с вероятностью p_boundary:
        i ← случайно выбранный параметр
        b ← случайно выбранная граница (нижняя φ_i^L или верхняя φ_i^H)
        λ_i ← b                           # boundary sampling: фиксируем параметр на границе
        сыграть эпизод(λ); добавить успешность в буфер D[i][b]
        если размер(D[i][b]) ≥ m:
            p̄ ← среднее(D[i][b]); очистить D[i][b]
            если p̄ ≥ t_H:  расширить границу b наружу на Δ   # усложняем
            если p̄ ≤ t_L:  сжать границу b внутрь на Δ        # упрощаем
    иначе:
        обучать политику на эпизодах из λ`;

const Section5 = () => (
  <>
    <h2 id="razdel-5-adr" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 5. Автоматическая рандомизация (ADR): учебный план НАД рандомизацией
    </h2>

    <ProseP>
      Раздел 4 закончился вопросом «насколько широко рандомизировать и когда расширять?». Ответ дали{" "}
      <strong>OpenAI и др. (2019)</strong> в работе про сборку <strong>кубика Рубика</strong> роборукой
      — алгоритмом <strong>ADR (Automatic Domain Randomization)</strong>. Это и есть слияние двух
      половин урока: <strong>учебный план поверх рандомизации</strong>.
    </ProseP>

    <ProseP>
      Идея ADR в одном предложении: <em>начни с одной нерандомизированной среды и автоматически
      расширяй диапазоны случайности всякий раз, когда агент перешагивает порог качества.</em>{" "}
      Сложность растёт ровно так быстро, как агент успевает её осваивать — как self-play, но «соперник»
      здесь это ширина распределения мира.
    </ProseP>

    <ProseP>
      <strong>Механика.</strong> ADR хранит <strong>факторизованное</strong> распределение{" "}
      <Math display={false}>{String.raw`P_\phi`}</Math> над параметрами среды: по каждой из{" "}
      <Math display={false}>{String.raw`d`}</Math> размерностей — равномерное распределение между
      обучаемыми границами{" "}
      <Math display={false}>{String.raw`[\phi_i^L, \phi_i^H]`}</Math>. Итого{" "}
      <Math display={false}>{String.raw`2d`}</Math> настраиваемых чисел (нижняя и верхняя граница на
      каждый параметр):
    </ProseP>

    <Math>{String.raw`P_\phi(\lambda) \;=\; \prod_{i=1}^{d} \mathcal{U}\big(\phi_i^L,\, \phi_i^H\big).`}</Math>

    <ProseP>
      Расширение границ управляется приёмом <strong>boundary sampling</strong>: с некоторой
      вероятностью один параметр <Math display={false}>{String.raw`i`}</Math> фиксируется ровно на своей
      границе (нижней <strong>или</strong> верхней), остальные сэмплируются как обычно. Политика играет
      эпизод, её успешность кладётся в буфер <Math display={false}>{String.raw`D_i^b`}</Math> конкретной
      границы <Math display={false}>{String.raw`b`}</Math>. Когда буфер наполнился:
    </ProseP>

    <ul className="space-y-2 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          если средняя успешность на границе{" "}
          <Math display={false}>{String.raw`\ge t_H`}</Math> (высокий порог) →{" "}
          <strong>расширить</strong> границу наружу (мир усложняется);
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          если <Math display={false}>{String.raw`\le t_L`}</Math> (низкий порог) → <strong>сжать</strong>{" "}
          границу внутрь (мир упрощается).
        </span>
      </li>
    </ul>

    <ProseP>
      «Ширину» текущего распределения удобно мерить <strong>ADR-энтропией</strong> (выше энтропия ⇔
      шире, разнообразнее распределение):
    </ProseP>

    <Math>{String.raw`H(P_\phi) \;=\; -\,\frac{1}{d}\int P_\phi(\lambda)\,\log P_\phi(\lambda)\,d\lambda.`}</Math>

    <ProseP>
      Для факторизованных равномерных распределений она растёт с шириной диапазонов{" "}
      <Math display={false}>{String.raw`\sum_i \log(\phi_i^H - \phi_i^L)`}</Math>: расширили границу →
      энтропия поднялась. По сути ADR-энтропия — это «номер урока» для рандомизации. (О связи энтропии и
      распределений см. хаб{" "}
      <CrossLinkToHub
        hubPath="/math-rl/module-3"
        hubAnchor="entropy"
        hubTitle="Математика → Теория вероятностей и информации"
      >
        Теория вероятностей и информации ↗
      </CrossLinkToHub>
      .)
    </ProseP>

    <CyberCodeBlock language="pseudo" filename="adr.pseudo">
      {ADR_PSEUDO}
    </CyberCodeBlock>

    <ProseP>Два следствия, важных для нас:</ProseP>
    <ul className="space-y-2 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <strong>Не нужно вручную крутить десятки диапазонов.</strong> Чем больше параметров
          рандомизации, тем безнадёжнее ручная настройка; ADR убирает её, оставляя человеку только
          пороги <Math display={false}>{String.raw`t_L, t_H`}</Math>.
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <strong>Эмерджентное мета-обучение.</strong> Политики OpenAI имели <strong>память</strong>{" "}
          (рекуррентность): на бесконечно разнообразных средах выгодно не «зазубрить» один мир, а{" "}
          <em>адаптироваться на лету</em> — оценивать физику текущего эпизода по первым шагам. Это
          работало даже на возмущения, которых не было в обучении (знаменитый тычок плюшевым жирафом).
        </span>
      </li>
    </ul>

    <ProseP>
      Для гонщика ADR-расписание выглядит так: стартуем с сухого асфальта{" "}
      <Math display={false}>{String.raw`\mu=1.0`}</Math> (нулевая ширина); агент справился → границы
      поехали к <Math display={false}>{String.raw`[0.85, 1.05]`}</Math>, затем{" "}
      <Math display={false}>{String.raw`[0.6, 1.2]`}</Math>, затем добавились лужи и сумерки. Никаких
      «уроков руками» — только пороги.
    </ProseP>

    <InteractiveStub title="Интерактив (рекомендация): «Расширение границ ADR»">
      Горизонтальная ось параметра (например, сцепление{" "}
      <Math display={false}>{String.raw`\mu`}</Math>) с текущим диапазоном{" "}
      <Math display={false}>{String.raw`[\phi^L,\phi^H]`}</Math>; слайдеры{" "}
      <Math display={false}>{String.raw`t_L`}</Math>, <Math display={false}>{String.raw`t_H`}</Math> и
      «текущая успешность на границе»; кнопка «оценить границу» сдвигает{" "}
      <Math display={false}>{String.raw`\phi^L/\phi^H`}</Math> наружу или внутрь по правилу ADR; рядом
      счётчик ADR-энтропии. Видно, как агрессивные пороги «разносят» диапазон, а строгие — держат узким.
      JSX с анимацией расширения/сжатия.
    </InteractiveStub>

    <KeyPoints
      items={[
        <>
          <strong>ADR</strong> (OpenAI и др., 2019) = автоматический учебный план{" "}
          <strong>над рандомизацией</strong>: старт без случайности → расширение диапазонов при
          достижении порога.
        </>,
        <>
          Распределение <Math display={false}>{String.raw`P_\phi`}</Math> факторизовано (
          <Math display={false}>{String.raw`2d`}</Math> границ); расширение/сжатие — через{" "}
          <strong>boundary sampling</strong> и пороги{" "}
          <Math display={false}>{String.raw`t_H/t_L`}</Math>.
        </>,
        <>
          <strong>ADR-энтропия</strong> <Math display={false}>{String.raw`H(P_\phi)`}</Math> измеряет
          ширину распределения — фактически «номер урока» для рандомизации.
        </>,
        <>
          На бесконечно разнообразных средах у агента с памятью возникает{" "}
          <strong>эмерджентное мета-обучение</strong> — адаптация к физике эпизода на лету.
        </>,
      ]}
    />
  </>
);

export default Section5;
