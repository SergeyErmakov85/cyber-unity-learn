import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Math from "@/components/Math";
import HubLink from "@/components/math-rl/HubLink";
import bellmanEquationImg from "@/assets/bellman-equation.png";

/* ─────────────── Design tokens (совместимо с § 5–7) ─────────────── */

const HEADING_FONT =
  "'Orbitron', 'Inter', ui-sans-serif, system-ui, sans-serif";
const MONO_FONT = "'JetBrains Mono', ui-monospace, monospace";
const GLASS_BG = "rgba(12,16,28,0.7)";
const SOFT_BORDER = "rgba(255,255,255,0.06)";
const CYAN = "#00FFD6";
const MAGENTA = "#D946EF";
const AMBER = "#F59E0B";

const BODY_STYLE: React.CSSProperties = { fontSize: 14, lineHeight: 1.7 };

/* ─────────────── Атомы ─────────────── */

const FormulaCard: React.FC<{
  label: string;
  labelColor: string;
  tex: string;
  note?: React.ReactNode;
}> = ({ label, labelColor, tex, note }) => (
  <div
    style={{
      background: GLASS_BG,
      border: `1px solid ${SOFT_BORDER}`,
      borderLeft: `3px solid ${labelColor}`,
      borderRadius: 12,
      padding: "16px 18px",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      minWidth: 0,
    }}
  >
    <div
      style={{
        fontFamily: HEADING_FONT,
        fontSize: 12,
        color: labelColor,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>
    <div
      style={{
        color: "rgba(255,255,255,0.96)",
        textAlign: "center",
        padding: "8px 4px",
        overflowX: "auto",
        fontSize: 15,
      }}
    >
      <Math display className="!my-0 !bg-transparent !border-0 !p-0">
        {tex}
      </Math>
    </div>
    {note && (
      <div
        style={{
          fontFamily: MONO_FONT,
          fontSize: 11,
          color: "rgba(255,255,255,0.6)",
          textAlign: "center",
          fontStyle: "italic",
        }}
      >
        {note}
      </div>
    )}
  </div>
);

const SummaryRow: React.FC<{
  section: string;
  children: React.ReactNode;
  color?: string;
}> = ({ section, children, color = CYAN }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "74px 1fr",
      columnGap: 14,
      alignItems: "baseline",
    }}
  >
    <span
      style={{
        fontFamily: MONO_FONT,
        fontSize: 12,
        color,
        letterSpacing: "0.06em",
        textAlign: "right",
      }}
    >
      {section}
    </span>
    <span style={{ color: "rgba(255,255,255,0.88)" }}>{children}</span>
  </div>
);

/* ─────────────── Section ─────────────── */

const Section_BellmanBridge = () => {
  return (
    <section
      id="l15-bellman-bridge"
      aria-label="Lesson 1.5 — § 9. Мост к уравнениям Беллмана"
      className="py-6"
      style={BODY_STYLE}
    >
      <h2
        className="text-2xl font-bold tracking-wide"
        style={{ fontFamily: HEADING_FONT, color: CYAN }}
        data-toc-label="Уравнение Беллмана"
      >
        § 9. То, что мы сделали, называется{" "}
        <span className="group/bellman relative inline-block cursor-help">
          <span
            className="transition-all duration-500"
            style={{
              color: MAGENTA,
              textShadow: `0 0 6px ${MAGENTA}, 0 0 14px ${MAGENTA}, 0 0 28px ${MAGENTA}`,
            }}
          >
            <style>{`
              @keyframes gentlePulse {
                0%, 100% { 
                  text-shadow: 0 0 6px ${MAGENTA}, 0 0 14px ${MAGENTA}, 0 0 28px ${MAGENTA};
                }
                50% { 
                  text-shadow: 0 0 12px ${MAGENTA}, 0 0 24px ${MAGENTA}, 0 0 48px ${MAGENTA}, 0 0 64px ${MAGENTA};
                }
              }
            `}</style>
            <span
              className="group-hover/bellman:animate-[gentlePulse_2s_ease-in-out_infinite]"
              style={{
                transition: 'all 0.5s ease-out',
              }}
            >
              Уравнением Беллмана
            </span>
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-full z-50 mt-3 -translate-x-1/2 opacity-0 transition-opacity duration-500 ease-out group-hover/bellman:opacity-100"
            style={{ width: "min(680px, 90vw)" }}
          >
            <img
              src={bellmanEquationImg}
              alt="Уравнение Беллмана"
              className="w-full h-auto rounded-xl"
              style={{
                boxShadow: `0 0 30px rgba(0,255,214,0.35), 0 0 60px rgba(217,70,239,0.25)`,
              }}
            />
          </span>
        </span>
      </h2>
      <p
        className="text-sm italic mt-1"
        style={{ color: "rgba(255,255,255,0.6)" }}
      >
        «Великие формулы обычно не открывают — их замечают, когда они уже лежат
        на столе»
      </p>

      <div className="mt-6 flex flex-col gap-7">
        {/* ─────── Сводка ─────── */}
        <div className="flex flex-col gap-3">
          <h3
            style={{
              fontFamily: HEADING_FONT,
              fontSize: 17,
              color: CYAN,
              letterSpacing: "0.04em",
            }}
          >
            8.1 · Что именно мы успели
          </h3>
          <div
            style={{
              background: GLASS_BG,
              border: `1px solid ${SOFT_BORDER}`,
              borderRadius: 12,
              padding: "16px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <SummaryRow section="§ 2–3" color={AMBER}>
              Ввели MDP: формализовали RoomBot как кортеж{" "}
              <span style={{ fontFamily: MONO_FONT, color: AMBER }}>
                (S, A, P, R, γ)
              </span>{" "}
              и проверили марковское свойство.
            </SummaryRow>
            <SummaryRow section="§ 5–6" color={MAGENTA}>
              Построили{" "}
              <span style={{ fontFamily: MONO_FONT, color: CYAN }}>
                V<sup>π</sup>(s)
              </span>{" "}
              и{" "}
              <span style={{ fontFamily: MONO_FONT, color: MAGENTA }}>
                Q<sup>π</sup>(s, a)
              </span>{" "}
              — среднюю «ценность» состояния и действия.
            </SummaryRow>
            <SummaryRow section="§ 6" color={MAGENTA}>
              Нашли связь V ↔ Q:{" "}
              <span style={{ fontFamily: MONO_FONT, color: CYAN }}>
                V<sup>π</sup>(s) = Σ<sub>a</sub> π(a|s) · Q<sup>π</sup>(s, a)
              </span>
              .
            </SummaryRow>
            <SummaryRow section="§ 7" color={CYAN}>
              Построили итерационный алгоритм, сходящийся к{" "}
              <span style={{ fontFamily: MONO_FONT, color: CYAN }}>V*</span>{" "}
              — и увидели её глазами, сначала на NumPy, потом на PyTorch.
            </SummaryRow>
          </div>
        </div>

        {/* ─────── Две формулы Беллмана ─────── */}
        <div className="flex flex-col gap-3">
          <h3
            style={{
              fontFamily: HEADING_FONT,
              fontSize: 17,
              color: CYAN,
              letterSpacing: "0.04em",
            }}
          >
            8.2 · А теперь откроем учебник и узнаем их имена
          </h3>
          <p style={{ color: "rgba(255,255,255,0.88)" }}>
            Эти две формулы не новы — мы вывели их сами из определений, но в
            литературе у них есть собственные названия. Это{" "}
            <span style={{ color: CYAN, fontWeight: 600 }}>
              уравнения Беллмана
            </span>
            , и вся дальнейшая математика RL строится на них.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 14,
            }}
          >
            <FormulaCard
              label="Bellman expectation · § 5–6"
              labelColor={MAGENTA}
              note="средняя ценность при следовании политике π"
              tex="V^{\pi}(s) \;=\; \sum_{a} \pi(a \mid s) \sum_{s'} P(s' \mid s, a)\,\bigl[\, R(s') + \gamma\, V^{\pi}(s') \,\bigr]"
            />

            <FormulaCard
              label="Bellman optimality · § 7"
              labelColor={CYAN}
              note="максимальная возможная ценность"
              tex="V^{*}(s) \;=\; \max_{a} \sum_{s'} P(s' \mid s, a)\,\bigl[\, R(s') + \gamma\, V^{*}(s') \,\bigr]"
            />
          </div>

          <div
            style={{
              background: "rgba(0,255,214,0.04)",
              border: `1px solid ${CYAN}`,
              borderLeft: `3px solid ${CYAN}`,
              borderRadius: 12,
              padding: "14px 18px",
              boxShadow: `0 0 22px rgba(0,255,214,0.14)`,
              color: "rgba(255,255,255,0.94)",
            }}
          >
            Обратите внимание: вторую формулу мы получили не как аксиому, а как{" "}
            <em>правило шага итерации</em> в § 7. То есть Value Iteration — это
            буквально уравнение Беллмана-оптимальности, переписанное как
            «взять его правую часть и подставить в левую».
          </div>
        </div>

        {/* ─────── Два хаб-линка ─────── */}
        <div className="flex flex-col gap-3">
          <h3
            style={{
              fontFamily: HEADING_FONT,
              fontSize: 17,
              color: CYAN,
              letterSpacing: "0.04em",
            }}
          >
            8.3 · Хочется строже — в хаб
          </h3>
          <p style={{ color: "rgba(255,255,255,0.85)" }}>
            Мы прошли путь «на пальцах»; формальная часть (условия существования,
            сжимающее отображение, единственность неподвижной точки) вынесена
            в хаб математики RL:
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <HubLink
              to="/hub/math-rl"
              anchor="уравнение-ожиданий-беллмана"
              variant="pill"
            >
              Ожидания Беллмана — полный вывод
            </HubLink>
            <HubLink
              to="/hub/math-rl"
              anchor="уравнение-оптимальности-беллмана"
              variant="pill"
            >
              Оптимальность Беллмана и сжимающее отображение
            </HubLink>
          </div>
        </div>

        {/* ─────── Переход в 1.6 ─────── */}
        <div className="flex flex-col gap-3">
          <h3
            style={{
              fontFamily: HEADING_FONT,
              fontSize: 17,
              color: MAGENTA,
              letterSpacing: "0.04em",
            }}
          >
            8.4 · Что будет дальше — урок 1.6
          </h3>
          <p style={{ color: "rgba(255,255,255,0.88)" }}>
            Value Iteration опирался на честный доступ к{" "}
            <span style={{ fontFamily: MONO_FONT, color: CYAN }}>P(s′|s,a)</span>{" "}
            и{" "}
            <span style={{ fontFamily: MONO_FONT, color: CYAN }}>R(s′)</span> —
            как будто модель мира у нас в кармане. В реальности это почти
            никогда не так: бот знает только то, что видит своими датчиками.
            В уроке 1.6 мы увидим, что будет, если{" "}
            <span style={{ fontFamily: MONO_FONT, color: MAGENTA }}>P</span> и{" "}
            <span style={{ fontFamily: MONO_FONT, color: MAGENTA }}>R</span>{" "}
            неизвестны, — и нам придётся <em>учить</em>{" "}
            <span style={{ fontFamily: MONO_FONT, color: CYAN }}>Q</span>,
            а не вычислять её.
          </p>

          <Link
            to="/courses/1-3"
            style={{
              alignSelf: "flex-start",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 18px",
              borderRadius: 10,
              background: `linear-gradient(90deg, rgba(0,255,214,0.08), rgba(217,70,239,0.08))`,
              border: `1px solid rgba(0,255,214,0.35)`,
              color: "rgba(255,255,255,0.95)",
              fontFamily: HEADING_FONT,
              fontSize: 13,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textDecoration: "none",
              boxShadow: `0 0 18px rgba(0,255,214,0.12)`,
              transition:
                "box-shadow 0.2s ease-out, transform 0.2s ease-out, border-color 0.2s ease-out",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 0 28px rgba(0,255,214,0.28)`;
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `0 0 18px rgba(0,255,214,0.12)`;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <span style={{ color: CYAN, fontFamily: MONO_FONT }}>1.6 →</span>
            <span>Q-Learning: табличный метод</span>
            <ArrowRight size={14} style={{ color: MAGENTA }} />
          </Link>
        </div>

        {/* ─────── Финальная плашка-эпилог ─────── */}
        <div
          style={{
            position: "relative",
            padding: "1px", // толщина рамки = 1px
            borderRadius: 16,
            background: `linear-gradient(135deg, ${CYAN} 0%, ${MAGENTA} 100%)`,
            boxShadow: `0 0 30px rgba(0,255,214,0.10), 0 0 30px rgba(217,70,239,0.10)`,
          }}
        >
          <div
            style={{
              background: "rgba(6,8,13,0.92)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              borderRadius: 15,
              padding: "28px 28px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              alignItems: "center",
            }}
          >
            <div
              aria-hidden
              style={{
                fontFamily: MONO_FONT,
                fontSize: 11,
                letterSpacing: "0.24em",
                color: "rgba(255,255,255,0.45)",
                textTransform: "uppercase",
              }}
            >
              · эпилог урока 1.5 ·
            </div>
            <p
              style={{
                margin: 0,
                fontFamily: HEADING_FONT,
                fontSize: 17,
                lineHeight: 1.55,
                color: "rgba(255,255,255,0.96)",
                maxWidth: 560,
              }}
            >
              Ты только что прошёл путь,{" "}
              <span style={{ color: CYAN }}>который занял у RL-сообщества</span>{" "}
              <span style={{ color: MAGENTA }}>десятилетие с 1950-х</span>.
            </p>
            <div
              style={{
                fontFamily: MONO_FONT,
                fontSize: 12,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Беллман, 1957 — Dynamic Programming. Дальше — всего лишь детали.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section_BellmanBridge;
