import Math from "@/components/Math";
import ColorLegend from "@/components/textbook/ColorLegend";

/**
 * Урок 1.3 — «Вывод уравнения Беллмана».
 * Пошаговый вывод: максимизация → мат. ожидание → MDP → дисконт → уравнение Беллмана.
 *
 * Математика — только через KaTeX (компонент Math). Цвет задаётся РОЛЬЮ сущности
 * через макросы \enfVar / \enfFun / \enfPar / \enfOp / \enfTgt (ENF-COLOR-030);
 * \textcolor и HEX в формулах запрещены — палитра живёт в src/styles/enf-math.css.
 */

/* ─────────────── Design tokens (совместимо с § 5–8) ─────────────── */

const HEADING_FONT = "'Orbitron', 'Inter', ui-sans-serif, system-ui, sans-serif";
const MONO_FONT = "'JetBrains Mono', ui-monospace, monospace";
const GLASS_BG = "rgba(12,16,28,0.7)";
const SOFT_BORDER = "rgba(255,255,255,0.06)";
const CYAN = "#00FFD6";
const MAGENTA = "#D946EF";

const BODY_STYLE: React.CSSProperties = { fontSize: 14, lineHeight: 1.7 };
const TEXT = "rgba(255,255,255,0.88)";

/* ─────────────── Обозначения ───────────────
   Таблица «символ, значение, роль» — она же легенда цветов (ENF-MATH-011):
   роль названа словом, поэтому смысл не теряется в чёрно-белой печати. */

const NOTATION: { tex: string; meaning: string; role: string }[] = [
  { tex: String.raw`\enfVar{x},\ \enfVar{X}`, meaning: "аргумент функции, случайная величина", role: "variable" },
  { tex: String.raw`\enfVar{s} \in \mathcal{S}`, meaning: "состояние среды", role: "variable" },
  { tex: String.raw`\enfFun{f}`, meaning: "функция, которую максимизируем", role: "function" },
  { tex: String.raw`a \in \mathcal{A}`, meaning: "действие агента", role: "function" },
  { tex: String.raw`\pi(a \mid \enfVar{s})`, meaning: "стратегия: вероятность выбрать действие в состоянии", role: "function" },
  { tex: String.raw`\mathcal{P}(\enfVar{s}' \mid \enfVar{s}, a)`, meaning: "вероятность перехода среды", role: "function" },
  { tex: String.raw`\enfPar{\gamma} \in [0, 1]`, meaning: "коэффициент дисконтирования", role: "parameter" },
  { tex: String.raw`\mathbb{E}`, meaning: "математическое ожидание", role: "operator" },
  { tex: String.raw`\enfOp{V}^{\pi}(\enfVar{s})`, meaning: "ценность состояния при стратегии", role: "operator" },
  { tex: String.raw`\enfTgt{R},\ \enfTgt{\mathcal{R}}`, meaning: "немедленная награда", role: "target" },
  { tex: String.raw`\enfOp{G}_t`, meaning: "возврат — суммарная дисконтированная награда", role: "operator" },
];

/* ─────────────── Атомы ─────────────── */

const H3: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3
    className="mt-2"
    style={{ fontFamily: HEADING_FONT, fontSize: 18, color: CYAN, letterSpacing: "0.04em" }}
  >
    {children}
  </h3>
);

const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{ color: TEXT, margin: 0 }}>{children}</p>
);

/** Инлайновая формула */
const IM: React.FC<{ children: string }> = ({ children }) => (
  <Math display={false}>{children}</Math>
);

/** Блочная формула в стеклянной карточке */
const F: React.FC<{ children: string }> = ({ children }) => (
  <div
    style={{
      background: GLASS_BG,
      border: `1px solid ${SOFT_BORDER}`,
      borderRadius: 12,
      padding: "10px 16px",
      overflowX: "auto",
    }}
  >
    <Math display className="!my-0 !bg-transparent !border-0 !p-0">
      {children}
    </Math>
  </div>
);

const Callout: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = CYAN,
}) => (
  <div
    style={{
      background: `${color}0A`,
      border: `1px solid ${color}`,
      borderLeft: `3px solid ${color}`,
      borderRadius: 12,
      padding: "14px 18px",
      color: "rgba(255,255,255,0.94)",
      boxShadow: `0 0 22px ${color}24`,
    }}
  >
    {children}
  </div>
);

const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col gap-3">{children}</div>
);

/* ─────────────── Section ─────────────── */

const Section_BellmanDerivation = () => {
  return (
    <section
      id="l13-bellman-derivation"
      aria-label="Урок 1.3 — § 8. Вывод уравнения Беллмана"
      className="py-6"
      style={BODY_STYLE}
    >
      <h2
        className="text-2xl font-bold tracking-wide"
        style={{ fontFamily: HEADING_FONT, color: CYAN }}
        data-toc-label="Вывод уравнения Беллмана"
      >
        § 8. Вывод уравнения Беллмана
      </h2>

      {/* ─────── Обозначения (ENF-MATH-011) ─────── */}
      <div
        className="mt-6"
        style={{
          background: GLASS_BG,
          border: `1px solid ${SOFT_BORDER}`,
          borderLeft: `3px solid ${MAGENTA}`,
          borderRadius: 12,
          padding: "16px 18px",
        }}
      >
        <div
          style={{
            fontFamily: HEADING_FONT,
            fontSize: 12,
            color: MAGENTA,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Обозначения
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ color: "rgba(255,255,255,0.5)", textAlign: "left" }}>
                <th style={{ padding: "6px 10px", fontWeight: 500 }}>Символ</th>
                <th style={{ padding: "6px 10px", fontWeight: 500 }}>Значение</th>
                <th style={{ padding: "6px 10px", fontWeight: 500 }}>Роль</th>
              </tr>
            </thead>
            <tbody>
              {NOTATION.map((row) => (
                <tr key={row.tex} style={{ borderTop: `1px solid ${SOFT_BORDER}` }}>
                  <td style={{ padding: "6px 10px" }}>
                    <IM>{row.tex}</IM>
                  </td>
                  <td style={{ padding: "6px 10px", color: TEXT }}>{row.meaning}</td>
                  <td
                    style={{
                      padding: "6px 10px",
                      fontFamily: MONO_FONT,
                      color: "rgba(255,255,255,0.55)",
                    }}
                  >
                    {row.role}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ColorLegend />
      </div>

      <div className="mt-7 flex flex-col gap-9">
        {/* ─────── Этап 1 ─────── */}
        <Stage>
          <H3>Этап 1. Алгебраический фундамент: максимизация и экстремумы</H3>
          <P>
            Начнём с базовых концепций. В основе любого процесса принятия решений
            лежит желание получить наилучший результат. На языке математики это
            означает нахождение максимума функции.
          </P>
          <P>
            Пусть у нас есть функция <IM>{String.raw`\enfFun{f}(\enfVar{x})`}</IM>,
            которая описывает «пользу» от выбора значения{" "}
            <IM>{String.raw`\enfVar{x}`}</IM>. Наша задача — найти такое
            значение <IM>{String.raw`\enfVar{x}`}</IM>, при котором функция
            достигает наибольшего возможного значения.
          </P>
          <P>Здесь важно строго различать два оператора:</P>
          <ol className="list-decimal list-inside space-y-1" style={{ color: TEXT }}>
            <li>
              <IM>{String.raw`\max_{\enfVar{x}}\!\left(\enfFun{f}(\enfVar{x})\right)`}</IM>{" "}
              — это само <strong>максимальное значение</strong> функции.
            </li>
            <li>
              <IM>{String.raw`\arg\max_{\enfVar{x}}\!\left(\enfFun{f}(\enfVar{x})\right)`}</IM>{" "}
              — это <strong>аргумент</strong> (значение{" "}
              <IM>{String.raw`\enfVar{x}`}</IM>, при котором функция достигает
              максимума).
            </li>
          </ol>
          <P>
            Докажем это на примере. Рассмотрим параболу, ветви которой направлены
            вниз:
          </P>
          <F>{String.raw`\enfFun{f}(\enfVar{x}) = -\enfVar{x}^2 + 4\enfVar{x}`}</F>
          <P>
            Функция достигает экстремума там, где её производная (скорость
            изменения) равна нулю:
          </P>
          <F>{String.raw`\frac{d}{d\enfVar{x}}\,\enfFun{f}(\enfVar{x}) = -2\enfVar{x} + 4`}</F>
          <P>Приравняем производную к нулю:</P>
          <F>{String.raw`-2\enfVar{x} + 4 = 0 \quad\Longrightarrow\quad \enfVar{x} = 2`}</F>
          <P>Теперь вычислим значение функции в этой точке:</P>
          <F>{String.raw`\enfFun{f}(2) = -(2)^2 + 4(2) = -4 + 8 = 4`}</F>
          <P>Следовательно:</P>
          <F>{String.raw`\max_{\enfVar{x}}\!\left(\enfFun{f}(\enfVar{x})\right) = 4 \qquad \arg\max_{\enfVar{x}}\!\left(\enfFun{f}(\enfVar{x})\right) = 2`}</F>
          <P>
            В обучении с подкреплением мы постоянно ищем{" "}
            <IM>{String.raw`\arg\max_{a}(\square)`}</IM> — то есть
            действие <IM>{String.raw`\enfFun{a}`}</IM>, которое приведёт к
            максимизации ожидаемой награды.
          </P>
        </Stage>

        {/* ─────── Этап 2 ─────── */}
        <Stage>
          <H3>Этап 2. Вероятностная парадигма: стохастические среды</H3>
          <P>
            В реальном мире наши действия редко приводят к 100% предсказуемым
            результатам. Чтобы работать с неопределённостью, мы вводим понятие
            случайной величины и математического ожидания.
          </P>
          <P>
            Пусть <IM>{String.raw`\enfVar{X}`}</IM> — дискретная случайная
            величина (например, результат броска кости), принимающая значения{" "}
            <IM>{String.raw`\enfVar{x}_i`}</IM> с вероятностью{" "}
            <IM>{String.raw`\enfFun{P}(\enfVar{X} = \enfVar{x}_i)`}</IM>.
            Сумма вероятностей всех исходов строго равна единице:
          </P>
          <F>{String.raw`\sum_{i} \enfFun{P}(\enfVar{X} = \enfVar{x}_i) = 1`}</F>
          <P>
            <strong>Математическое ожидание</strong>{" "}
            <IM>{String.raw`\mathbb{E}[\enfVar{X}]`}</IM>{" "}
            — это среднее значение случайной величины при бесконечном числе
            повторений эксперимента. Оно вычисляется как взвешенная сумма всех
            исходов, где весом выступает вероятность:
          </P>
          <F>{String.raw`\mathbb{E}[\enfVar{X}] = \sum_{\enfVar{x}} \enfVar{x} \cdot \enfFun{P}(\enfVar{X} = \enfVar{x})`}</F>
          <P>
            <strong>Пример.</strong> Бросок «нечестной» монеты: при выпадении орла
            (вероятность 0.8) вы получаете 10 монет, при выпадении решки
            (вероятность 0.2) теряете 5 монет.
          </P>
          <F>{String.raw`\mathbb{E}[\enfVar{X}] = 10 \cdot 0.8 + (-5) \cdot 0.2 = 8 - 1 = 7`}</F>
          <P>
            Ожидаемый выигрыш — 7 монет за бросок. Именно математическое ожидание
            станет нашим главным инструментом для оценки стратегий в условиях
            неопределённости.
          </P>
        </Stage>

        {/* ─────── Этап 3 ─────── */}
        <Stage>
          <H3>Этап 3. Архитектура MDP: марковские процессы принятия решений</H3>
          <P>
            Теперь формализуем среду, в которой действует агент, как Марковский
            процесс принятия решений (Markov Decision Process, MDP). Любую задачу
            обучения с подкреплением можно свести к MDP. Он описывается кортежем из
            пяти элементов:
          </P>
          <F>{String.raw`\left(\enfVar{\mathcal{S}},\ \enfFun{\mathcal{A}},\ \enfFun{\mathcal{P}},\ \enfTgt{\mathcal{R}},\ \enfPar{\gamma}\right)`}</F>
          <ul className="list-disc list-inside space-y-2" style={{ color: TEXT }}>
            <li>
              <IM>{String.raw`\enfVar{\mathcal{S}}`}</IM> — конечное
              множество всех возможных состояний (states).
            </li>
            <li>
              <IM>{String.raw`\enfFun{\mathcal{A}}`}</IM> — конечное
              множество всех доступных действий (actions).
            </li>
            <li>
              <IM>{String.raw`\mathcal{P}(\enfVar{s}' \mid \enfVar{s}, a)`}</IM>{" "}
              — функция вероятности перехода: вероятность того, что из состояния{" "}
              <IM>{String.raw`\enfVar{s}`}</IM> при действии{" "}
              <IM>{String.raw`\enfFun{a}`}</IM> среда перейдёт в новое
              состояние <IM>{String.raw`\enfVar{s}'`}</IM>.
            </li>
            <li>
              <IM>{String.raw`\enfTgt{\mathcal{R}}(\enfVar{s}, a, \enfVar{s}')`}</IM>{" "}
              — функция награды: ожидаемая мгновенная награда при переходе из{" "}
              <IM>{String.raw`\enfVar{s}`}</IM> в{" "}
              <IM>{String.raw`\enfVar{s}'`}</IM> посредством действия{" "}
              <IM>{String.raw`\enfFun{a}`}</IM>.
            </li>
            <li>
              <IM>{String.raw`\enfPar{\gamma}`}</IM> — дисконтирующий
              множитель, о котором — на следующем этапе.
            </li>
          </ul>
          <P>
            <strong>Марковское свойство.</strong> Будущее зависит только от текущего
            состояния и действия, а не от всей предыдущей истории:
          </P>
          <F>{String.raw`\enfFun{\mathcal{P}}\!\left(S_{t+1} \mid S_t, A_t, S_{t-1}, A_{t-1}, \ldots\right) = \enfFun{\mathcal{P}}\!\left(S_{t+1} \mid S_t, A_t\right)`}</F>
          <P>
            Это свойство «отсутствия памяти» резко упрощает моделирование: агент
            принимает решение, опираясь лишь на то, где он находится прямо сейчас.
          </P>
        </Stage>

        {/* ─────── Этап 4 ─────── */}
        <Stage>
          <H3>Этап 4. Экономика времени: обоснование дисконтирующего множителя</H3>
          <P>
            Представьте, что агент действует бесконечно долго. Цель — максимизировать
            сумму наград. Но если бесконечно складывать положительные числа, сумма
            устремится к бесконечности:
          </P>
          <F>{String.raw`1 + 1 + 1 + \cdots = \infty`}</F>
          <P>
            Сравнивать две бесконечности математически некорректно. Чтобы сумма
            оставалась конечной (сходилась), вводим параметр{" "}
            <IM>{String.raw`\enfPar{\gamma} \in [0, 1]`}</IM> —
            дисконтирующий множитель. Он отражает ценность времени: награда завтра
            ценится меньше, чем награда сегодня.
          </P>
          <P>
            Докажем, что бесконечная сумма дисконтированных наград конечна, если
            награды ограничены значением{" "}
            <IM>{String.raw`\enfTgt{R}_{\max}`}</IM>. Рассмотрим ряд:
          </P>
          <F>{String.raw`\enfOp{S} = 1 + \enfPar{\gamma} + \enfPar{\gamma}^2 + \enfPar{\gamma}^3 + \ldots`}</F>
          <P>
            Умножим обе части на <IM>{String.raw`\enfPar{\gamma}`}</IM>:
          </P>
          <F>{String.raw`\enfPar{\gamma}\,\enfOp{S} = \enfPar{\gamma} + \enfPar{\gamma}^2 + \enfPar{\gamma}^3 + \enfPar{\gamma}^4 + \ldots`}</F>
          <P>Вычтем второе уравнение из первого — все степени сократятся, кроме единицы:</P>
          <F>{String.raw`\enfOp{S} - \enfPar{\gamma}\,\enfOp{S} = 1 \quad\Longrightarrow\quad \enfOp{S}\,(1 - \enfPar{\gamma}) = 1 \quad\Longrightarrow\quad \enfOp{S} = \frac{1}{1 - \enfPar{\gamma}}`}</F>
          <P>
            Значит, при{" "}
            <IM>{String.raw`\enfPar{\gamma} < 1`}</IM> сумма
            дисконтированных наград ограничена сверху и конечна:
          </P>
          <F>{String.raw`\sum_{t=0}^{\infty} \enfPar{\gamma}^{\,t}\, \enfTgt{R} \;\le\; \enfTgt{R}_{\max} \sum_{t=0}^{\infty} \enfPar{\gamma}^{\,t} = \frac{\enfTgt{R}_{\max}}{1 - \enfPar{\gamma}}`}</F>
        </Stage>

        {/* ─────── Этап 5 ─────── */}
        <Stage>
          <H3>Этап 5. Сборка: вывод уравнения Беллмана</H3>
          <P>
            Суммарную дисконтированную награду, начиная с момента{" "}
            <IM>{String.raw`t`}</IM>, называют возвратом{" "}
            <IM>{String.raw`\enfOp{G}_t`}</IM>:
          </P>
          <F>{String.raw`\enfOp{G}_t = \enfTgt{R}_{t+1} + \enfPar{\gamma}\,\enfTgt{R}_{t+2} + \enfPar{\gamma}^2\,\enfTgt{R}_{t+3} + \ldots`}</F>
          <P>
            Ключевое наблюдение: возврат рекурсивен — вынесем{" "}
            <IM>{String.raw`\enfPar{\gamma}`}</IM> за скобку:
          </P>
          <F>{String.raw`\enfOp{G}_t = \enfTgt{R}_{t+1} + \enfPar{\gamma}\left(\enfTgt{R}_{t+2} + \enfPar{\gamma}\,\enfTgt{R}_{t+3} + \ldots\right) = \enfTgt{R}_{t+1} + \enfPar{\gamma}\,\enfOp{G}_{t+1}`}</F>
          <P>
            Ценность состояния{" "}
            <IM>{String.raw`\enfOp{V}^{\pi}(\enfVar{s})`}</IM>{" "}
            — это ожидаемый возврат при следовании стратегии{" "}
            <IM>{String.raw`\enfFun{\pi}`}</IM> из состояния{" "}
            <IM>{String.raw`\enfVar{s}`}</IM>:
          </P>
          <F>{String.raw`\enfOp{V}^{\pi}(\enfVar{s}) = \mathbb{E}_{\pi}\!\left[\enfOp{G}_t \mid S_t = \enfVar{s}\right]`}</F>
          <P>Подставим рекурсивную форму возврата:</P>
          <F>{String.raw`\enfOp{V}^{\pi}(\enfVar{s}) = \mathbb{E}_{\pi}\!\left[\enfTgt{R}_{t+1} + \enfPar{\gamma}\,\enfOp{G}_{t+1} \mid S_t = \enfVar{s}\right]`}</F>
          <P>
            Раскроем ожидание через сумму по действиям (стохастичность стратегии) и
            по переходам (стохастичность среды). Получаем{" "}
            <strong>уравнение Беллмана для ожиданий:</strong>
          </P>
          <F>{String.raw`\enfOp{V}^{\pi}(\enfVar{s}) = \sum_{a} \pi(a \mid \enfVar{s}) \sum_{\enfVar{s}'} \mathcal{P}(\enfVar{s}' \mid \enfVar{s}, a)\left[\enfTgt{\mathcal{R}}(\enfVar{s}, a, \enfVar{s}') + \enfPar{\gamma}\,\enfOp{V}^{\pi}(\enfVar{s}')\right]`}</F>
          <P>
            Словами: ценность состояния равна средневзвешенной сумме немедленных
            наград и дисконтированной ценности всех возможных следующих состояний{" "}
            <IM>{String.raw`\enfVar{s}'`}</IM>.
          </P>
          <Callout>
            ❓ <strong>Блок самопроверки.</strong> Убедитесь, что понимаете каждый
            символ. Почему здесь двойная сумма? Первая сумма{" "}
            <IM>{String.raw`\sum_{a}(\square)`}</IM> учитывает
            случайность стратегии (какое действие мы выберем), а вторая{" "}
            <IM>{String.raw`\sum_{\enfVar{s}'}(\square)`}</IM> —
            стохастичность среды (куда нас приведёт это действие).
          </Callout>
          <P>
            Если вместо усреднения по стратегии всегда выбирать лучшее действие, мы
            получаем <strong>уравнение оптимальности Беллмана</strong>:
          </P>
          <F>{String.raw`\enfOp{V}^{*}(\enfVar{s}) = \max_{a} \sum_{\enfVar{s}'} \mathcal{P}(\enfVar{s}' \mid \enfVar{s}, a)\left[\enfTgt{\mathcal{R}}(\enfVar{s}, a, \enfVar{s}') + \enfPar{\gamma}\,\enfOp{V}^{*}(\enfVar{s}')\right]`}</F>
        </Stage>

        {/* ─────── Policy Iteration ─────── */}
        <Stage>
          <H3>Итерация стратегий (Policy Iteration)</H3>
          <P>
            Выведенное уравнение позволяет оценить любую заданную стратегию. Но как
            найти оптимальную? Алгоритм <strong>Policy Iteration</strong> чередует два
            шага:
          </P>
          <ol className="list-decimal list-inside space-y-2" style={{ color: TEXT }}>
            <li>
              <strong>Оценка стратегии (Policy Evaluation).</strong> Решаем уравнение
              Беллмана итеративно для всех состояний, пока значения{" "}
              <IM>{String.raw`\enfOp{V}^{\pi}(\enfVar{s})`}</IM>{" "}
              не сойдутся.
            </li>
            <li>
              <strong>Улучшение стратегии (Policy Improvement).</strong> Имея точные
              оценки{" "}
              <IM>{String.raw`\enfOp{V}(\enfVar{s})`}</IM>,
              обновляем стратегию, выбирая в каждом состоянии «жадное» действие:
            </li>
          </ol>
          <F>{String.raw`\pi_{\text{new}}(\enfVar{s}) = \arg\max_{a} \sum_{\enfVar{s}'} \mathcal{P}(\enfVar{s}' \mid \enfVar{s}, a)\left[\enfTgt{\mathcal{R}}(\enfVar{s}, a, \enfVar{s}') + \enfPar{\gamma}\,\enfOp{V}^{\pi}(\enfVar{s}')\right]`}</F>
          <Callout color={MAGENTA}>
            <strong>Этот процесс математически гарантированно сходится к оптимальной
            стратегии.</strong>
          </Callout>
        </Stage>
      </div>
    </section>
  );
};

export default Section_BellmanDerivation;
