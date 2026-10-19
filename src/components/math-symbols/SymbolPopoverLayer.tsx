import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Code2, CornerDownRight, Info, ListTree, X } from "lucide-react";
import Math from "@/components/Math";
import { ROLE_META, wrapRole, type EnfTone } from "@/lib/enf-roles";
import { greekReading, type Mark } from "@/lib/enf-tex";
import RichText from "./RichText";
import { resolveClick, type ResolvedSymbol } from "./lookup";

/**
 * Всплывающие пояснения к символам формул — на всём сайте сразу.
 *
 * Один слушатель на документе: клик левой кнопкой по символу внутри любой
 * формулы KaTeX (компонент Math, локальные обёртки, лекции учебника) открывает
 * над символом карточку: что это, какую роль играет в формуле и как записан
 * в коде. Окрашенные символы узнаются по классу `enf-sym`, который вешают
 * макросы ролей (src/lib/katex-options.ts); знаки, скобки и операторы — по
 * глифу (src/content/symbols/glyphs.ts).
 */

const INTERACTIVE = 'a, button, summary, label, input, select, textarea, [role="button"], [role="tab"], [role="link"], [role="option"], [role="checkbox"], [role="radio"]';

/** Что делает роль в формуле, если словарь не сказал точнее. */
const ROLE_IN_FORMULA: Record<EnfTone, string> = {
  variable:
    "Объект, к которому применяется формула: его подставляют на вход, а формула вычисляет что-то о нём.",
  function:
    "Преобразование: принимает аргумент и возвращает результат — действие, вероятность действия, значение функции или выход слоя сети.",
  parameter:
    "Настройка: формула её не вычисляет, а использует. Её задают заранее (гиперпараметр) или подбирают обучением (веса).",
  operator:
    "Агрегат: сворачивает много значений в одно — сумму, ожидание, градиент или ценность.",
  target:
    "Цель: величина, которую агент стремится увеличить или уменьшить, либо эталон, с которым сравнивают оценку.",
  neutral: "Служебный знак: связывает величины формулы, но сам величиной не является.",
};

const explainMark = (mark: Mark, role: EnfTone): string => {
  switch (mark.kind) {
    case "hat":
      return "«Крышка» — оценка или предсказание величины, а не её точное значение. В коде — суффикс `_hat`.";
    case "bar":
      return "Черта — усреднённое значение или «замороженная» копия (например, параметры целевой сети). В коде — суффикс `_bar` или `_target`.";
    case "tilde":
      return "Тильда — изменённая или зашумлённая версия величины.";
    case "dot":
      return "Точка сверху — производная по времени.";
    case "vec":
      return "Стрелка — величина является вектором.";
    case "star":
      return "Звёздочка — оптимальное значение: лучшее из возможных. В коде — суффикс `_star` или `_opt`.";
    case "prime":
      return role === "function" || role === "operator"
        ? "Штрих после функции — производная (или другая версия той же функции, если так сказано в тексте)."
        : "Штрих — «следующее»: значение после перехода, например следующее состояние. В коде — суффикс `_next`.";
    case "sup": {
      const v = mark.value ?? "";
      if (v === "\\pi") return "Верхний индекс $\\pi$ — величина вычислена при следовании политике $\\pi$.";
      if (v === "\\top" || v === "T") return "Верхний индекс — транспонирование: строки становятся столбцами. В коде — `.T`.";
      if (/^\(.+\)$/.test(v)) return `Верхний индекс в скобках $${v}$ — номер итерации или элемента, а не степень. В коде — индекс массива.`;
      return `Верхний индекс $${v}$: степень или уточнение версии величины — смотрите текст рядом с формулой.`;
    }
    case "sub": {
      const v = mark.value ?? "";
      if (/^t([+-]\d)?$/.test(v.replace(/\s/g, "")))
        return `Нижний индекс $${v}$ — момент времени: к какому шагу эпизода относится величина. В коде — элемент массива \`[${v.replace(/\s/g, "")}]\`.`;
      if (/^\\(theta|phi|psi|varphi)$/.test(v))
        return `Нижний индекс $${v}$ — величина вычисляется сетью с параметрами $${v}$ и меняется вместе с ними при обучении.`;
      if (/old/.test(v)) return "Индекс «old» — значение до текущего обновления, зафиксированное при сборе данных.";
      if (/targ|\\bar|-/.test(v)) return `Нижний индекс $${v}$ — версия величины для расчёта цели (целевая сеть).`;
      if (/^[ijkn]$/.test(v)) return `Нижний индекс $${v}$ — номер элемента, итерации или члена последовательности. В коде — \`[${v}]\`.`;
      return `Нижний индекс $${v}$ уточняет, о каком экземпляре величины идёт речь.`;
    }
  }
};

interface OpenState {
  el: Element;
  resolved: ResolvedSymbol;
}

interface Position {
  left: number;
  top: number;
  placement: "top" | "bottom";
  arrowX: number;
}

// `Math` в этом файле — компонент формулы, поэтому встроенный объект берём под другим именем.
const Math_ = globalThis.Math;
const clamp = (v: number, lo: number, hi: number) => (hi < lo ? lo : Math_.min(Math_.max(v, lo), hi));

const capitalize = (s: string) => (s ? s[0].toLocaleUpperCase("ru") + s.slice(1) : s);

const Section = ({ icon: Icon, title, children }: { icon: typeof Info; title: string; children: ReactNode }) => (
  <div className="space-y-1">
    <p className="flex items-center gap-1.5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--enf-pop)]">
      <Icon className="h-3 w-3" aria-hidden />
      {title}
    </p>
    <div className="text-[0.8rem] leading-relaxed text-foreground/85">{children}</div>
  </div>
);

const SymbolCard = ({ r, onClose }: { r: ResolvedSymbol; onClose: () => void }) => {
  const role = r.declaredRole ?? r.tone;
  const shownTex = r.tone === "neutral" ? r.tex : wrapRole(r.tone, r.tex);
  const reading = greekReading(r.tex);
  const meta = ROLE_META[r.tone];
  const declared = r.declaredRole ? ROLE_META[r.declaredRole] : undefined;

  return (
    <>
      <div className="flex items-start gap-3">
        <div className="enf-pop__glyph" aria-hidden>
          <Math display={false}>{shownTex}</Math>
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="font-heading text-[0.92rem] font-semibold leading-snug text-foreground">{capitalize(r.name)}</p>
          {reading && <p className="mt-0.5 text-xs text-muted-foreground">читается «{reading}»</p>}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          aria-label="Закрыть пояснение"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="enf-pop__role">
        <span className="enf-pop__dot" aria-hidden />
        <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em]">{meta.label}</span>
        <span className="text-[0.72rem] text-muted-foreground">— {meta.hint}</span>
      </div>

      {r.tone === "neutral" && (r.neutralReason || declared) && (
        <p className="text-[0.72rem] leading-relaxed text-muted-foreground">
          {declared && (
            <>
              Роль этого символа на странице — <span className={declared.cls}>{declared.label}</span>.{" "}
            </>
          )}
          {r.neutralReason}
        </p>
      )}

      {r.meaning && (
        <Section icon={Info} title="Что означает">
          <RichText text={r.meaning} />
        </Section>
      )}

      <Section icon={CornerDownRight} title="Роль в формуле">
        <RichText text={r.inFormula ?? ROLE_IN_FORMULA[role]} />
      </Section>

      {r.marks.length > 0 && (
        <Section icon={ListTree} title="Как читать запись">
          <ul className="space-y-1">
            {r.marks.map((m, i) => (
              <li key={i} className="flex gap-1.5">
                <span className="text-[color:var(--enf-pop)]">•</span>
                <span>
                  <RichText text={explainMark(m, role)} />
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {(r.code?.length || r.conventionalCode || r.codeNote) && (
        <Section icon={Code2} title="В коде">
          {r.code?.length ? (
            <div className="flex flex-wrap gap-1.5">
              {r.code.map((c) => (
                <code key={c} className="enf-pop__code">
                  {c}
                </code>
              ))}
            </div>
          ) : r.conventionalCode ? (
            <p>
              На этой странице символ в коде не встречается. По соглашению ENF его называют{" "}
              <code className="enf-pop__code">{r.conventionalCode}</code>.
            </p>
          ) : null}
          {r.codeNote && (
            <p className="mt-1.5 text-[0.74rem] text-muted-foreground">
              <RichText text={r.codeNote} />
            </p>
          )}
        </Section>
      )}

      {r.tableId && (
        <a
          href={`#${r.tableId}`}
          onClick={onClose}
          className="inline-flex items-center gap-1 text-[0.72rem] font-medium text-primary underline-offset-4 hover:underline"
        >
          Все символы страницы — в таблице «формула ↔ код» ↓
        </a>
      )}
    </>
  );
};

const SymbolPopoverLayer = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState<OpenState | null>(null);
  const [pos, setPos] = useState<Position | null>(null);
  const popRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(null), []);

  // Клик по символу формулы — открыть (или закрыть, если это тот же символ).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.defaultPrevented) return;
      const t = e.target instanceof Element ? e.target : (e.target as Node | null)?.parentElement;
      if (!t || popRef.current?.contains(t)) return;
      if (!t.closest(".katex-html") || t.closest(INTERACTIVE)) return;
      if (window.getSelection()?.toString().trim()) return;
      const hit = resolveClick(t);
      if (!hit) return;
      setOpen((prev) => (prev && prev.el === hit.el ? null : hit));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Закрытие: клик мимо, Esc, смена страницы.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (popRef.current?.contains(t) || open.el.contains(t)) return;
      if (t instanceof Element && t.closest(".katex-html")) return; // решит обработчик клика
      setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => setOpen(null), [pathname]);

  // Подсветка активного символа.
  useEffect(() => {
    if (!open) return;
    open.el.classList.add("enf-sym-active");
    return () => open.el.classList.remove("enf-sym-active");
  }, [open]);

  // Позиция: над символом, а если сверху мало места — под ним. Следует за прокруткой.
  const place = useCallback(() => {
    const pop = popRef.current;
    if (!open || !pop) return;
    if (!open.el.isConnected) {
      setOpen(null);
      return;
    }
    const r = open.el.getBoundingClientRect();
    const w = pop.offsetWidth;
    const h = pop.offsetHeight;
    const gap = 12;
    const margin = 8;
    const fitsAbove = r.top - h - gap >= margin;
    const fitsBelow = r.bottom + gap + h <= window.innerHeight - margin;
    const placement: Position["placement"] = fitsAbove || !fitsBelow ? "top" : "bottom";
    const top = placement === "top" ? r.top - h - gap : r.bottom + gap;
    const cx = r.left + r.width / 2;
    const left = clamp(cx - w / 2, margin, window.innerWidth - w - margin);
    setPos({ left, top, placement, arrowX: clamp(cx - left, 18, w - 18) });
  }, [open]);

  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    place();
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(place);
    };
    window.addEventListener("scroll", schedule, true);
    window.addEventListener("resize", schedule);
    const ro = new ResizeObserver(schedule);
    if (popRef.current) ro.observe(popRef.current);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
      ro.disconnect();
    };
  }, [open, place]);

  if (!open) return null;
  const tone = open.resolved.tone;

  return createPortal(
    <motion.div
      ref={popRef}
      key={open.resolved.tex + tone}
      role="dialog"
      aria-label={`Пояснение к символу: ${open.resolved.name}`}
      className={`enf-pop enf-pop--${tone}`}
      data-placement={pos?.placement ?? "top"}
      style={{
        left: pos?.left ?? -9999,
        top: pos?.top ?? -9999,
        visibility: pos ? "visible" : "hidden",
        ["--enf-arrow-x" as string]: `${pos?.arrowX ?? 0}px`,
      }}
      initial={{ opacity: 0, y: pos?.placement === "bottom" ? -6 : 6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
    >
      <div className="enf-pop__body">
        <SymbolCard r={open.resolved} onClose={close} />
      </div>
      <span className="enf-pop__arrow" aria-hidden />
    </motion.div>,
    document.body,
  );
};

export default SymbolPopoverLayer;
