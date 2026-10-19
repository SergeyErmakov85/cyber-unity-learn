import { useMemo } from "react";
import katex from "katex";
import { Code2, X } from "lucide-react";
import { KATEX_OPTIONS } from "@/lib/katex-options";
import {
  ROLE_INFO,
  ROLE_TO_MACRO,
  highlightAtom,
  tagEnfSymbols,
  type EnfRole,
  type EnfRoleOrNeutral,
} from "@/lib/enf-symbols";
import type { SymbolEntry } from "@/content/math-symbols/types";
import RichText from "./RichText";

export interface SymbolHit {
  atom: string;
  /** Роль, в которой символ окрашен в формуле; undefined — символ без цвета. */
  coloredAs?: EnfRole;
  /** Символ стоит в индексе или степени. */
  script: boolean;
  /** Исходный TeX формулы, в которой нажат символ. */
  formula?: string;
}

const roleColor = (role: EnfRoleOrNeutral) => `var(--enf-color-${role})`;
const mix = (role: EnfRoleOrNeutral, pct: number) => `color-mix(in srgb, ${roleColor(role)} ${pct}%, transparent)`;

const renderTex = (tex: string, display = false) => {
  try {
    return katex.renderToString(tex, { ...KATEX_OPTIONS, displayMode: display });
  } catch {
    return "";
  }
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-1 font-heading text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{children}</div>
);

interface SymbolCardProps {
  hit: SymbolHit;
  entry?: SymbolEntry;
  loading: boolean;
  /** id таблицы символов страницы, если описание взято из неё. */
  tableId?: string;
  onClose: () => void;
}

/**
 * Карточка символа: что это, какую работу символ делает в формуле, как он
 * называется в коде. Оформление — стеклянная карточка сайта, рамка и свечение
 * в тоне роли символа.
 */
const SymbolCard = ({ hit, entry, loading, tableId, onClose }: SymbolCardProps) => {
  const role: EnfRoleOrNeutral = entry?.role ?? hit.coloredAs ?? "neutral";
  const info = ROLE_INFO[role];

  const symbolHtml = useMemo(() => {
    const tex = role === "neutral" ? hit.atom : `\\${ROLE_TO_MACRO[role]}{${hit.atom}}`;
    return renderTex(tex);
  }, [hit.atom, role]);

  const formulaHtml = useMemo(() => {
    if (!hit.formula || !hit.coloredAs || hit.formula.length > 420) return "";
    if (hit.formula.replace(/\s/g, "") === `\\${ROLE_TO_MACRO[hit.coloredAs]}{${hit.atom}}`.replace(/\s/g, "")) return "";
    return renderTex(tagEnfSymbols(highlightAtom(hit.formula, hit.coloredAs, hit.atom)), true);
  }, [hit]);

  const neutralHere = !hit.coloredAs && role !== "neutral";
  const name = entry?.name ?? (hit.coloredAs ? info.label : "Символ формулы");

  return (
    <div
      className="relative overflow-hidden rounded-xl border bg-popover/95 text-sm shadow-2xl backdrop-blur-md"
      style={{
        borderColor: mix(role, 55),
        boxShadow: `0 0 0 1px ${mix(role, 12)}, 0 0 28px ${mix(role, 28)}, 0 18px 48px rgba(0,0,0,0.55)`,
      }}
    >
      {/* неоновая полоса сверху в тоне роли */}
      <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${roleColor(role)}, transparent)` }} />

      <div className="flex items-start gap-3 px-4 pb-3 pt-3">
        <div
          className="flex h-14 min-w-14 max-w-[45%] shrink-0 items-center justify-center overflow-hidden rounded-lg border px-2 text-2xl"
          style={{ borderColor: mix(role, 45), background: mix(role, 9), boxShadow: `inset 0 0 18px ${mix(role, 16)}` }}
          dangerouslySetInnerHTML={{ __html: symbolHtml }}
        />
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="font-heading text-[13px] font-bold uppercase leading-snug tracking-wide text-foreground">
            {name}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold"
              style={{ borderColor: mix(role, 45), color: roleColor(role), background: mix(role, 8) }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: roleColor(role), boxShadow: `0 0 6px ${roleColor(role)}` }} />
              {info.label}
            </span>
            <span className="text-[11px] leading-tight text-muted-foreground">{info.hint}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть карточку символа"
          className="-mr-1 -mt-1 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-[min(60vh,520px)] space-y-3 overflow-y-auto px-4 pb-4">
        {loading && !entry ? (
          <div className="h-16 animate-pulse rounded-md bg-muted/30" />
        ) : (
          <>
            <section>
              <Label>Что это</Label>
              <p className="leading-relaxed text-foreground/90">
                {entry ? <RichText text={entry.meaning} /> : info.hint[0].toUpperCase() + info.hint.slice(1) + "."}
              </p>
            </section>

            <section>
              <Label>Роль в формуле</Label>
              <p className="leading-relaxed text-foreground/85">
                <RichText text={entry?.inFormula ?? info.inFormula} />
              </p>
              {hit.script && (
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  Здесь символ стоит в индексе или степени: такие позиции по правилам ENF не окрашиваются, роль
                  сообщает основной символ рядом.
                </p>
              )}
              {neutralHere && !hit.script && (
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  В этой формуле символ оставлен без цвета: в одной формуле не больше четырёх тонов, и нейтральной
                  остаётся роль, которую разбирают в другом месте.
                </p>
              )}
            </section>

            {formulaHtml && (
              <section>
                <Label>В этой формуле</Label>
                <div
                  className="enf-card-formula overflow-x-auto rounded-lg border border-border/60 bg-background/60 px-3 py-1 text-[0.95em]"
                  dangerouslySetInnerHTML={{ __html: formulaHtml }}
                />
              </section>
            )}

            <section className="rounded-lg border border-border/60 bg-background/50 p-3">
              <div className="mb-1.5 flex items-center gap-1.5 font-heading text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                <Code2 className="h-3.5 w-3.5 text-primary" />В коде · Python
              </div>
              {entry?.code ? (
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <code className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[13px] text-primary">
                    {entry.code}
                  </code>
                  {entry.codeType && <span className="font-mono text-xs text-muted-foreground">{entry.codeType}</span>}
                </div>
              ) : (
                <p className="text-xs leading-relaxed text-muted-foreground">
                  <RichText text={info.inCode} />
                </p>
              )}
              {entry?.codeNote && (
                <p className="mt-2 text-xs leading-relaxed text-foreground/80">
                  <RichText text={entry.codeNote} />
                </p>
              )}
            </section>

            {tableId && (
              <a
                href={`#${tableId}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(tableId)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  onClose();
                }}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Все символы страницы: таблица «от формулы к коду» →
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SymbolCard;
