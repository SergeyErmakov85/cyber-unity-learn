import { MouseEvent, ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";

type HubLinkVariant = "inline" | "pill";

interface HubLinkProps {
  to: string;
  anchor?: string;
  children: ReactNode;
  variant?: HubLinkVariant;
  /** Обратный якорь: путь урока-источника (например, "/courses/project-2"). */
  fromPath?: string;
  /** id места в уроке, к которому нужно вернуться (без #). */
  fromAnchor?: string;
  /** Человекочитаемая подпись урока для return-чипа на хабе. */
  fromLabel?: string;
}

const HUB_CYAN = "#00FFD6";
const HUB_GLOW = "0 0 8px rgba(0,255,214,0.35)";
const PILL_BORDER = "rgba(0,255,214,0.25)";
const PILL_BORDER_HOVER = "rgba(0,255,214,0.5)";
const PILL_FILL = "rgba(0,255,214,0.06)";

/**
 * Маппинг якорей хаба «Математика RL» на реальные маршруты `/math-rl/module-N`.
 * В уроках мы пишем логический путь `to="/hub/math-rl"` — он здесь и
 * разрешается в правильный модуль по `anchor`. Это единая точка истины,
 * чтобы при добавлении новых якорей не править уроки.
 *
 * Подтверждено аудитом в docs/audit/lesson-1-5-overlap.md.
 */
const ANCHOR_TO_MODULE: Record<string, string> = {
  // module-1 (Part1Limits.tsx)
  "геометрический-ряд": "/math-rl/module-1",
  "функция-ценности-состояния": "/math-rl/module-1",
  "пример-mdp-с-двумя-состояниями": "/math-rl/module-1",
  // module-5 (Part5FundamentalRL → Chapter1…10)
  "случайная-величина-random-variable": "/math-rl/module-5",
  "жадная-стратегия": "/math-rl/module-5",
  "марковское-свойство": "/math-rl/module-5",
  "функции-ценности-value-functions": "/math-rl/module-5",
  "уравнение-ожиданий-беллмана": "/math-rl/module-5",
  "уравнение-оптимальности-беллмана": "/math-rl/module-5",
};

const LOGICAL_HUB_PREFIX = "/hub/math-rl";
const HUB_DEFAULT = "/math-rl";

/**
 * Разрешает логический «to» в реальный SPA-маршрут:
 *  - `/hub/math-rl` + известный anchor → `/math-rl/module-N`
 *  - `/hub/math-rl` без anchor → `/math-rl` (корень хаба)
 *  - любой другой `to` (включая прямой `/math-rl/module-N`) оставляется как есть.
 */
const resolveHubPath = (to: string, anchor: string | undefined): string => {
  if (to !== LOGICAL_HUB_PREFIX) return to;
  if (!anchor) return HUB_DEFAULT;
  const mapped = ANCHOR_TO_MODULE[anchor];
  return mapped ?? HUB_DEFAULT;
};

/**
 * Polls the DOM for `#{anchor}` and scrolls to it once it appears.
 * Routes are lazy-loaded, so target element may not exist immediately
 * after `navigate()`. The polling window is capped to `maxWaitMs`.
 */
const scrollToAnchorWhenReady = (anchor: string, maxWaitMs = 3000): void => {
  const deadline = Date.now() + maxWaitMs;
  const tryScroll = (): void => {
    const el = document.getElementById(anchor);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (Date.now() < deadline) {
      window.requestAnimationFrame(() => {
        window.setTimeout(tryScroll, 80);
      });
    }
  };
  tryScroll();
};

/**
 * HubLink — типизированная ссылка из уроков в разделы хаба «Математика RL».
 *
 * Варианты отображения:
 *  - `inline` — подчёркнутая ссылка цветом #00FFD6 с иконкой ExternalLink (13px)
 *    и свечением при наведении.
 *  - `pill` — капсула с JetBrains Mono 12px и префиксом «→ В хаб:».
 *
 * Рендерится как `<a href>` для семантики и браузерного preview,
 * но при клике использует React Router `navigate()` без полной перезагрузки.
 * После навигации запускается плавная прокрутка к якорю.
 */
const HubLink = ({ to, anchor, children, variant = "inline" }: HubLinkProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const resolvedPath = resolveHubPath(to, anchor);
  const href = anchor ? `${resolvedPath}#${anchor}` : resolvedPath;

  // Если пользователь перешёл по якорю в пределах той же страницы, где уже
  // смонтирован HubLink (или по обновлённому hash), синхронизируем прокрутку.
  useEffect(() => {
    if (!anchor) return;
    if (location.pathname !== resolvedPath) return;
    if (location.hash !== `#${anchor}`) return;
    scrollToAnchorWhenReady(anchor);
  }, [anchor, location.hash, location.pathname, resolvedPath]);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>): void => {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }
    e.preventDefault();
    navigate(href);
    if (anchor) scrollToAnchorWhenReady(anchor);
  };

  if (variant === "pill") {
    return (
      <a
        href={href}
        onClick={handleClick}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all duration-200"
        style={{
          borderColor: PILL_BORDER,
          backgroundColor: PILL_FILL,
          color: HUB_CYAN,
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: "12px",
          lineHeight: 1.2,
        }}
        onMouseEnter={(ev) => {
          const el = ev.currentTarget;
          el.style.boxShadow = HUB_GLOW;
          el.style.borderColor = PILL_BORDER_HOVER;
        }}
        onMouseLeave={(ev) => {
          const el = ev.currentTarget;
          el.style.boxShadow = "none";
          el.style.borderColor = PILL_BORDER;
        }}
      >
        <span aria-hidden>→ В хаб:</span>
        <span>{children}</span>
      </a>
    );
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className="inline-flex items-baseline gap-1 underline underline-offset-2 decoration-1 transition-all duration-200"
      style={{
        color: HUB_CYAN,
        textDecorationColor: HUB_CYAN,
      }}
      onMouseEnter={(ev) => {
        ev.currentTarget.style.boxShadow = HUB_GLOW;
      }}
      onMouseLeave={(ev) => {
        ev.currentTarget.style.boxShadow = "none";
      }}
    >
      <span>{children}</span>
      <ExternalLink
        aria-hidden
        className="flex-shrink-0 self-center"
        style={{ width: 13, height: 13 }}
      />
    </a>
  );
};

export default HubLink;
