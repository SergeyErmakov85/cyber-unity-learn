import Math from "@/components/Math";

/**
 * Урок 1.3 — «Вывод уравнения Беллмана».
 * Пошаговый вывод: максимизация → мат. ожидание → MDP → дисконт → уравнение Беллмана.
 * Математика — только через KaTeX (компонент Math); цвета символов — через \textcolor.
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

/* ─────────────── Цветовая легенда ─────────────── */

const LEGEND: { color: string; symbols: string; meaning: string; name: string }[] = [
  { color: "#E8820C", symbols: "f, γ", name: "оранжевый", meaning: "функция, дисконтирующий множитель" },
  { color: "#2563EB", symbols: "x, X", name: "синий", meaning: "переменная / случайная величина" },
  { color: "#0891B2", symbols: "s, S, 𝒮", name: "голубой", meaning: "состояния (states)" },
  { color: "#7C3AED", symbols: "a, A, 𝒜", name: "фиолетовый", meaning: "действия (actions)" },
  { color: "#DB2777", symbols: "𝒫, P", name: "розовый", meaning: "вероятность перехода / вероятность" },
  { color: "#CA8A04", symbols: "𝓡, R, G, S (ряд)", name: "золотой", meaning: "награда, возврат, сумма ряда" },
  { color: "#16A34A", symbols: "𝔼, ∞", name: "зелёный", meaning: "мат. ожидание, бесконечность" },
  { color: "#0D9488", symbols: "π", name: "бирюзовый", meaning: "стратегия (policy)" },
  { color: "#DC2626", symbols: "V", name: "красный", meaning: "ценность (value)" },
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
      aria-label="Урок 1.3 — Вывод уравнения Беллмана"
      className="py-6"
      style={BODY_STYLE}
    >
      <h2
        className="text-2xl font-bold tracking-wide"
        style={{ fontFamily: HEADING_FONT, color: CYAN }}
        data-toc-label="Вывод уравнения Беллмана"
      >
        Вывод уравнения Беллмана
      </h2>

      {/* ─────── Цветовая легенда ─────── */}
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
          Цветовая легенда (по смыслу символов)
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ color: "rgba(255,255,255,0.5)", textAlign: "left" }}>
                <th style={{ padding: "6px 10px", fontWeight: 500 }}>Цвет</th>
                <th style={{ padding: "6px 10px", fontWeight: 500 }}>Символы</th>
                <th style={{ padding: "6px 10px", fontWeight: 500 }}>Смысл</th>
              </tr>
            </thead>
            <tbody>
              {LEGEND.map((row) => (
                <tr key={row.color} style={{ borderTop: `1px solid ${SOFT_BORDER}` }}>
                  <td style={{ padding: "6px 10px", color: row.color, fontWeight: 600 }}>
                    {row.name}
                  </td>
                  <td
                    style={{
                      padding: "6px 10px",
                      fontFamily: MONO_FONT,
                      color: row.color,
                    }}
                  >
                    {row.symbols}
                  </td>
                  <td style={{ padding: "6px 10px", color: TEXT }}>{row.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
            Пусть у нас есть функция <IM>{String.raw`\textcolor{#E8820C}{f}(\textcolor{#2563EB}{x})`}</IM>,
            которая описывает «пользу» от выбора значения{" "}
            <IM>{String.raw`\textcolor{#2563EB}{x}`}</IM>. Наша задача — найти такое
            значение <IM>{String.raw`\textcolor{#2563EB}{x}`}</IM>, при котором функция
            достигает наибольшего возможного значения.
          </P>
          <P>Здесь важно строго различать два оператора:</P>
          <ol className="list-decimal list-inside space-y-1" style={{ color: TEXT }}>
            <li>
              <IM>{String.raw`\max_{\textcolor{#2563EB}{x}}\!\left(\textcolor{#E8820C}{f}(\textcolor{#2563EB}{x})\right)`}</IM>{" "}
              — это само <strong>максимальное значение</strong> функции.
            </li>
            <li>
              <IM>{String.raw`\arg\max_{\textcolor{#2563EB}{x}}\!\left(\textcolor{#E8820C}{f}(\textcolor{#2563EB}{x})\right)`}</IM>{" "}
              — это <strong>аргумент</strong> (значение{" "}
              <IM>{String.raw`\textcolor{#2563EB}{x}`}</IM>, при котором функция достигает
              максимума).
            </li>
          </ol>
          <P>
            Докажем это на примере. Рассмотрим параболу, ветви которой направлены
            вниз:
          </P>
          <F>{String.raw`\textcolor{#E8820C}{f}(\textcolor{#2563EB}{x}) = -\textcolor{#2563EB}{x}^2 + 4\textcolor{#2563EB}{x}`}</F>
          <P>
            Функция достигает экстремума там, где её производная (скорость
            изменения) равна нулю:
          </P>
          <F>{String.raw`\frac{d}{d\textcolor{#2563EB}{x}}\,\textcolor{#E8820C}{f}(\textcolor{#2563EB}{x}) = -2\textcolor{#2563EB}{x} + 4`}</F>
          <P>Приравняем производную к нулю:</P>
          <F>{String.raw`-2\textcolor{#2563EB}{x} + 4 = 0 \quad\Longrightarrow\quad \textcolor{#2563EB}{x} = 2`}</F>
          <P>Теперь вычислим значение функции в этой точке:</P>
          <F>{String.raw`\textcolor{#E8820C}{f}(2) = -(2)^2 + 4(2) = -4 + 8 = 4`}</F>
          <P>Следовательно:</P>
          <F>{String.raw`\max_{\textcolor{#2563EB}{x}}\!\left(\textcolor{#E8820C}{f}(\textcolor{#2563EB}{x})\right) = 4 \qquad \arg\max_{\textcolor{#2563EB}{x}}\!\left(\textcolor{#E8820C}{f}(\textcolor{#2563EB}{x})\right) = 2`}</F>
          <P>
            В обучении с подкреплением мы постоянно ищем{" "}
            <IM>{String.raw`\arg\max_{\textcolor{#7C3AED}{a}}(\square)`}</IM> — то есть
            действие <IM>{String.raw`\textcolor{#7C3AED}{a}`}</IM>, которое приведёт к
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
            Пусть <IM>{String.raw`\textcolor{#2563EB}{X}`}</IM> — дискретная случайная
            величина (например, результат броска кости), принимающая значения{" "}
            <IM>{String.raw`\textcolor{#2563EB}{x_i}`}</IM> с вероятностью{" "}
            <IM>{String.raw`\textcolor{#DB2777}{P}(\textcolor{#2563EB}{X} = \textcolor{#2563EB}{x_i})`}</IM>.
            Сумма вероятностей всех исходов строго равна единице:
          </P>
          <F>{String.raw`\sum_{i} \textcolor{#DB2777}{P}(\textcolor{#2563EB}{X} = \textcolor{#2563EB}{x_i}) = 1`}</F>
          <P>
            <strong>Математическое ожидание</strong>{" "}
            <IM>{String.raw`\textcolor{#16A34A}{\mathbb{E}}[\textcolor{#2563EB}{X}]`}</IM>{" "}
            — это среднее значение случайной величины при бесконечном числе
            повторений эксперимента. Оно вычисляется как взвешенная сумма всех
            исходов, где весом выступает вероятность:
          </P>
          <F>{String.raw`\textcolor{#16A34A}{\mathbb{E}}[\textcolor{#2563EB}{X}] = \sum_{\textcolor{#2563EB}{x}} \textcolor{#2563EB}{x} \cdot \textcolor{#DB2777}{P}(\textcolor{#2563EB}{X} = \textcolor{#2563EB}{x})`}</F>
          <P>
            <strong>Пример.</strong> Бросок «нечестной» монеты: при выпадении орла
            (вероятность 0.8) вы получаете 10 монет, при выпадении решки
            (вероятность 0.2) теряете 5 монет.
          </P>
          <F>{String.raw`\textcolor{#16A34A}{\mathbb{E}}[\textcolor{#2563EB}{X}] = 10 \cdot 0.8 + (-5) \cdot 0.2 = 8 - 1 = 7`}</F>
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
          <F>{String.raw`\left(\textcolor{#0891B2}{\mathcal{S}},\ \textcolor{#7C3AED}{\mathcal{A}},\ \textcolor{#DB2777}{\mathcal{P}},\ \textcolor{#CA8A04}{\mathcal{R}},\ \textcolor{#E8820C}{\gamma}\right)`}</F>
          <ul className="list-disc list-inside space-y-2" style={{ color: TEXT }}>
            <li>
              <IM>{String.raw`\textcolor{#0891B2}{\mathcal{S}}`}</IM> — конечное
              множество всех возможных состояний (states).
            </li>
            <li>
              <IM>{String.raw`\textcolor{#7C3AED}{\mathcal{A}}`}</IM> — конечное
              множество всех доступных действий (actions).
            </li>
            <li>
              <IM>{String.raw`\textcolor{#DB2777}{\mathcal{P}}(\textcolor{#0891B2}{s'} \mid \textcolor{#0891B2}{s}, \textcolor{#7C3AED}{a})`}</IM>{" "}
              — функция вероятности перехода: вероятность того, что из состояния{" "}
              <IM>{String.raw`\textcolor{#0891B2}{s}`}</IM> при действии{" "}
              <IM>{String.raw`\textcolor{#7C3AED}{a}`}</IM> среда перейдёт в новое
              состояние <IM>{String.raw`\textcolor{#0891B2}{s'}`}</IM>.
            </li>
            <li>
              <IM>{String.raw`\textcolor{#CA8A04}{\mathcal{R}}(\textcolor{#0891B2}{s}, \textcolor{#7C3AED}{a}, \textcolor{#0891B2}{s'})`}</IM>{" "}
              — функция награды: ожидаемая мгновенная награда при переходе из{" "}
              <IM>{String.raw`\textcolor{#0891B2}{s}`}</IM> в{" "}
              <IM>{String.raw`\textcolor{#0891B2}{s'}`}</IM> посредством действия{" "}
              <IM>{String.raw`\textcolor{#7C3AED}{a}`}</IM>.
            </li>
            <li>
              <IM>{String.raw`\textcolor{#E8820C}{\gamma}`}</IM> — дисконтирующий
              множитель, о котором — на следующем этапе.
            </li>
          </ul>
          <P>
            <strong>Марковское свойство.</strong> Будущее зависит только от текущего
            состояния и действия, а не от всей предыдущей истории:
          </P>
          <F>{String.raw`\textcolor{#DB2777}{\mathcal{P}}\!\left(\textcolor{#0891B2}{S_{t+1}} \mid \textcolor{#0891B2}{S_t}, \textcolor{#7C3AED}{A_t}, \textcolor{#0891B2}{S_{t-1}}, \textcolor{#7C3AED}{A_{t-1}}, \ldots\right) = \textcolor{#DB2777}{\mathcal{P}}\!\left(\textcolor{#0891B2}{S_{t+1}} \mid \textcolor{#0891B2}{S_t}, \textcolor{#7C3AED}{A_t}\right)`}</F>
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
          <F>{String.raw`1 + 1 + 1 + \cdots = \textcolor{#16A34A}{\infty}`}</F>
          <P>
            Сравнивать две бесконечности математически некорректно. Чтобы сумма
            оставалась конечной (сходилась), вводим параметр{" "}
            <IM>{String.raw`\textcolor{#E8820C}{\gamma} \in [0, 1]`}</IM> —
            дисконтирующий множитель. Он отражает ценность времени: награда завтра
            ценится меньше, чем награда сегодня.
          </P>
          <P>
            Докажем, что бесконечная сумма дисконтированных наград конечна, если
            награды ограничены значением{" "}
            <IM>{String.raw`\textcolor{#CA8A04}{R_{\max}}`}</IM>. Рассмотрим ряд:
          </P>
          <F>{String.raw`\textcolor{#CA8A04}{S} = 1 + \textcolor{#E8820C}{\gamma} + \textcolor{#E8820C}{\gamma}^2 + \textcolor{#E8820C}{\gamma}^3 + \ldots`}</F>
          <P>
            Умножим обе части на <IM>{String.raw`\textcolor{#E8820C}{\gamma}`}</IM>:
          </P>
          <F>{String.raw`\textcolor{#E8820C}{\gamma}\,\textcolor{#CA8A04}{S} = \textcolor{#E8820C}{\gamma} + \textcolor{#E8820C}{\gamma}^2 + \textcolor{#E8820C}{\gamma}^3 + \textcolor{#E8820C}{\gamma}^4 + \ldots`}</F>
          <P>Вычтем второе уравнение из первого — все степени сократятся, кроме единицы:</P>
          <F>{String.raw`\textcolor{#CA8A04}{S} - \textcolor{#E8820C}{\gamma}\,\textcolor{#CA8A04}{S} = 1 \quad\Longrightarrow\quad \textcolor{#CA8A04}{S}\,(1 - \textcolor{#E8820C}{\gamma}) = 1 \quad\Longrightarrow\quad \textcolor{#CA8A04}{S} = \frac{1}{1 - \textcolor{#E8820C}{\gamma}}`}</F>
          <P>
            Значит, при{" "}
            <IM>{String.raw`\textcolor{#E8820C}{\gamma} < 1`}</IM> сумма
            дисконтированных наград ограничена сверху и конечна:
          </P>
          <F>{String.raw`\sum_{t=0}^{\infty} \textcolor{#E8820C}{\gamma}^{\,t}\, \textcolor{#CA8A04}{R} \;\le\; \textcolor{#CA8A04}{R_{\max}} \sum_{t=0}^{\infty} \textcolor{#E8820C}{\gamma}^{\,t} = \frac{\textcolor{#CA8A04}{R_{\max}}}{1 - \textcolor{#E8820C}{\gamma}}`}</F>
        </Stage>

        {/* ─────── Этап 5 ─────── */}
        <Stage>
          <H3>Этап 5. Сборка: вывод уравнения Беллмана</H3>
          <P>
            Суммарную дисконтированную награду, начиная с момента{" "}
            <IM>{String.raw`t`}</IM>, называют возвратом{" "}
            <IM>{String.raw`\textcolor{#CA8A04}{G_t}`}</IM>:
          </P>
          <F>{String.raw`\textcolor{#CA8A04}{G_t} = \textcolor{#CA8A04}{R_{t+1}} + \textcolor{#E8820C}{\gamma}\,\textcolor{#CA8A04}{R_{t+2}} + \textcolor{#E8820C}{\gamma}^2\,\textcolor{#CA8A04}{R_{t+3}} + \ldots`}</F>
          <P>
            Ключевое наблюдение: возврат рекурсивен — вынесем{" "}
            <IM>{String.raw`\textcolor{#E8820C}{\gamma}`}</IM> за скобку:
          </P>
          <F>{String.raw`\textcolor{#CA8A04}{G_t} = \textcolor{#CA8A04}{R_{t+1}} + \textcolor{#E8820C}{\gamma}\left(\textcolor{#CA8A04}{R_{t+2}} + \textcolor{#E8820C}{\gamma}\,\textcolor{#CA8A04}{R_{t+3}} + \ldots\right) = \textcolor{#CA8A04}{R_{t+1}} + \textcolor{#E8820C}{\gamma}\,\textcolor{#CA8A04}{G_{t+1}}`}</F>
          <P>
            Ценность состояния{" "}
            <IM>{String.raw`\textcolor{#DC2626}{V}^{\textcolor{#0D9488}{\pi}}(\textcolor{#0891B2}{s})`}</IM>{" "}
            — это ожидаемый возврат при следовании стратегии{" "}
            <IM>{String.raw`\textcolor{#0D9488}{\pi}`}</IM> из состояния{" "}
            <IM>{String.raw`\textcolor{#0891B2}{s}`}</IM>:
          </P>
          <F>{String.raw`\textcolor{#DC2626}{V}^{\textcolor{#0D9488}{\pi}}(\textcolor{#0891B2}{s}) = \textcolor{#16A34A}{\mathbb{E}}_{\textcolor{#0D9488}{\pi}}\!\left[\textcolor{#CA8A04}{G_t} \mid \textcolor{#0891B2}{S_t} = \textcolor{#0891B2}{s}\right]`}</F>
          <P>Подставим рекурсивную форму возврата:</P>
          <F>{String.raw`\textcolor{#DC2626}{V}^{\textcolor{#0D9488}{\pi}}(\textcolor{#0891B2}{s}) = \textcolor{#16A34A}{\mathbb{E}}_{\textcolor{#0D9488}{\pi}}\!\left[\textcolor{#CA8A04}{R_{t+1}} + \textcolor{#E8820C}{\gamma}\,\textcolor{#CA8A04}{G_{t+1}} \mid \textcolor{#0891B2}{S_t} = \textcolor{#0891B2}{s}\right]`}</F>
          <P>
            Раскроем ожидание через сумму по действиям (стохастичность стратегии) и
            по переходам (стохастичность среды). Получаем{" "}
            <strong>уравнение Беллмана для ожиданий:</strong>
          </P>
          <F>{String.raw`\textcolor{#DC2626}{V}^{\textcolor{#0D9488}{\pi}}(\textcolor{#0891B2}{s}) = \sum_{\textcolor{#7C3AED}{a}} \textcolor{#0D9488}{\pi}(\textcolor{#7C3AED}{a} \mid \textcolor{#0891B2}{s}) \sum_{\textcolor{#0891B2}{s'}} \textcolor{#DB2777}{\mathcal{P}}(\textcolor{#0891B2}{s'} \mid \textcolor{#0891B2}{s}, \textcolor{#7C3AED}{a})\left[\textcolor{#CA8A04}{\mathcal{R}}(\textcolor{#0891B2}{s}, \textcolor{#7C3AED}{a}, \textcolor{#0891B2}{s'}) + \textcolor{#E8820C}{\gamma}\,\textcolor{#DC2626}{V}^{\textcolor{#0D9488}{\pi}}(\textcolor{#0891B2}{s'})\right]`}</F>
          <P>
            Словами: ценность состояния равна средневзвешенной сумме немедленных
            наград и дисконтированной ценности всех возможных следующих состояний{" "}
            <IM>{String.raw`\textcolor{#0891B2}{s'}`}</IM>.
          </P>
          <Callout>
            ❓ <strong>Блок самопроверки.</strong> Убедитесь, что понимаете каждый
            символ. Почему здесь двойная сумма? Первая сумма{" "}
            <IM>{String.raw`\sum_{\textcolor{#7C3AED}{a}}(\square)`}</IM> учитывает
            случайность стратегии (какое действие мы выберем), а вторая{" "}
            <IM>{String.raw`\sum_{\textcolor{#0891B2}{s'}}(\square)`}</IM> —
            стохастичность среды (куда нас приведёт это действие).
          </Callout>
          <P>
            Если вместо усреднения по стратегии всегда выбирать лучшее действие, мы
            получаем <strong>уравнение оптимальности Беллмана</strong>:
          </P>
          <F>{String.raw`\textcolor{#DC2626}{V}^{*}(\textcolor{#0891B2}{s}) = \max_{\textcolor{#7C3AED}{a}} \sum_{\textcolor{#0891B2}{s'}} \textcolor{#DB2777}{\mathcal{P}}(\textcolor{#0891B2}{s'} \mid \textcolor{#0891B2}{s}, \textcolor{#7C3AED}{a})\left[\textcolor{#CA8A04}{\mathcal{R}}(\textcolor{#0891B2}{s}, \textcolor{#7C3AED}{a}, \textcolor{#0891B2}{s'}) + \textcolor{#E8820C}{\gamma}\,\textcolor{#DC2626}{V}^{*}(\textcolor{#0891B2}{s'})\right]`}</F>
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
              <IM>{String.raw`\textcolor{#DC2626}{V}^{\textcolor{#0D9488}{\pi}}(\textcolor{#0891B2}{s})`}</IM>{" "}
              не сойдутся.
            </li>
            <li>
              <strong>Улучшение стратегии (Policy Improvement).</strong> Имея точные
              оценки{" "}
              <IM>{String.raw`\textcolor{#DC2626}{V}(\textcolor{#0891B2}{s})`}</IM>,
              обновляем стратегию, выбирая в каждом состоянии «жадное» действие:
            </li>
          </ol>
          <F>{String.raw`\textcolor{#0D9488}{\pi_{\text{new}}}(\textcolor{#0891B2}{s}) = \arg\max_{\textcolor{#7C3AED}{a}} \sum_{\textcolor{#0891B2}{s'}} \textcolor{#DB2777}{\mathcal{P}}(\textcolor{#0891B2}{s'} \mid \textcolor{#0891B2}{s}, \textcolor{#7C3AED}{a})\left[\textcolor{#CA8A04}{\mathcal{R}}(\textcolor{#0891B2}{s}, \textcolor{#7C3AED}{a}, \textcolor{#0891B2}{s'}) + \textcolor{#E8820C}{\gamma}\,\textcolor{#DC2626}{V}^{\textcolor{#0D9488}{\pi}}(\textcolor{#0891B2}{s'})\right]`}</F>
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
