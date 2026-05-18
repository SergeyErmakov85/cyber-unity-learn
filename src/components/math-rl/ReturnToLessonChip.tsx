import { MouseEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CYAN = "#00FFD6";
const GLOW = "0 0 10px rgba(0,255,214,0.4)";
const BORDER = "rgba(0,255,214,0.3)";
const BORDER_HOVER = "rgba(0,255,214,0.6)";
const FILL = "rgba(0,255,214,0.08)";

/**
 * Двунаправленность Урок ↔ Хаб (Википедия-стиль).
 * Читает query `?from=&fromAnchor=&fromLabel=`, заданные HubLink,
 * и показывает sticky-чип «← Вернуться к уроку: …».
 * При клике — навигация на `fromPath#fromAnchor` + плавный скролл
 * (поллинг DOM, как в HubLink, на случай lazy-загрузки маршрута урока).
 */
const scrollWhenReady = (anchor: string, maxWaitMs = 3000): void => {
  const deadline = Date.now() + maxWaitMs;
  const tick = (): void => {
    const el = document.getElementById(anchor);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (Date.now() < deadline) {
      window.requestAnimationFrame(() => window.setTimeout(tick, 80));
    }
  };
  tick();
};

const ReturnToLessonChip = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const from = params.get("from");
  const fromAnchor = params.get("fromAnchor");
  const fromLabel = params.get("fromLabel");

  if (!from || !fromAnchor) return null;

  const href = `${from}#${fromAnchor}`;

  const onClick = (e: MouseEvent<HTMLAnchorElement>): void => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(href);
    scrollWhenReady(fromAnchor);
  };

  return (
    <div className="sticky top-2 z-40 flex justify-end px-4 pt-2">
      <a
        href={href}
        onClick={onClick}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md transition-all duration-200"
        style={{
          borderColor: BORDER,
          backgroundColor: FILL,
          color: CYAN,
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: "12px",
          lineHeight: 1.2,
        }}
        onMouseEnter={(ev) => {
          ev.currentTarget.style.boxShadow = GLOW;
          ev.currentTarget.style.borderColor = BORDER_HOVER;
        }}
        onMouseLeave={(ev) => {
          ev.currentTarget.style.boxShadow = "none";
          ev.currentTarget.style.borderColor = BORDER;
        }}
      >
        <ArrowLeft aria-hidden style={{ width: 13, height: 13 }} />
        <span>Вернуться к уроку{fromLabel ? `: ${fromLabel}` : ""}</span>
      </a>
    </div>
  );
};

export default ReturnToLessonChip;
