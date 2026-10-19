import { useMemo, useRef, type ReactNode } from "react";
import { MousePointerClick, Sigma } from "lucide-react";
import Math from "@/components/Math";
import { ROLE_META, ROLE_ORDER, wrapRole } from "@/lib/enf-roles";
import type { SymbolEntry } from "@/content/symbols/types";
import RichText from "./RichText";
import { useRegisterSymbols } from "./registry";

interface SymbolTableProps {
  /** Символы страницы — тот же словарь питает всплывающие пояснения. */
  symbols: SymbolEntry[];
  /** id якоря; на него ведёт ссылка из пояснений. */
  id?: string;
  title?: string;
  description?: ReactNode;
  /** Заголовок колонки кода: «В коде Python», «В конфиге ML-Agents». */
  codeLabel?: string;
  className?: string;
}

const codes = (c?: string | string[]) => (c === undefined ? [] : Array.isArray(c) ? c : [c]);

const RoleChip = ({ role }: { role: SymbolEntry["role"] }) => (
  <span className={`enf-role-chip enf-role-chip--${role}`}>
    <span className="enf-role-chip__dot" aria-hidden />
    {ROLE_META[role].label}
  </span>
);

const CodeCell = ({ entry }: { entry: SymbolEntry }) => (
  <div className="space-y-1.5">
    {codes(entry.code).length > 0 ? (
      <div className="flex flex-wrap gap-1.5">
        {codes(entry.code).map((c) => (
          <code key={c} className="enf-pop__code">
            {c}
          </code>
        ))}
      </div>
    ) : (
      <span className="text-xs text-muted-foreground">в коде страницы не встречается</span>
    )}
    {entry.codeNote && (
      <p className="text-xs leading-relaxed text-muted-foreground">
        <RichText text={entry.codeNote} />
      </p>
    )}
  </div>
);

/**
 * Таблица «Символы: от формулы к коду» (ENF, docs/13_Code_Module_Python.md, п. 5.1).
 *
 * Каждый символ страницы — в цвете своей роли, с объяснением, ролью в формуле
 * и тем, как он записан в коде. Записи регистрируются как словарь страницы:
 * всплывающие пояснения по клику на символ берут текст отсюда, поэтому
 * таблица и пояснения никогда не расходятся.
 */
const SymbolTable = ({
  symbols,
  id = "symbols",
  title = "Символы: от формулы к коду",
  description,
  codeLabel = "В коде",
  className = "",
}: SymbolTableProps) => {
  const ref = useRef<HTMLElement>(null);
  useRegisterSymbols(symbols, ref, id);

  const roles = useMemo(() => ROLE_ORDER.filter((r) => symbols.some((s) => s.role === r)), [symbols]);

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={`${id}-title`}
      className={`enf-symbol-table scroll-mt-24 my-8 rounded-2xl border border-primary/20 bg-card/60 p-5 backdrop-blur-sm md:p-6 ${className}`}
    >
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 shadow-[0_0_20px_hsl(var(--primary)/0.25)]">
            <Sigma className="h-5 w-5 text-primary" aria-hidden />
          </div>
          <div>
            <h3
              id={`${id}-title`}
              className="font-heading text-lg font-bold tracking-wide text-foreground md:text-xl"
            >
              {title}
            </h3>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {description ??
                "Каждый символ из формул этой страницы: что он означает, какую роль играет и как называется в коде. Цвет символа — его роль, одинаковая во всех формулах страницы."}
            </p>
          </div>
        </div>
        <p className="flex shrink-0 items-center gap-1.5 rounded-lg border border-secondary/30 bg-secondary/10 px-3 py-1.5 text-xs text-foreground/80">
          <MousePointerClick className="h-3.5 w-3.5 text-secondary" aria-hidden />
          Нажмите на символ в любой формуле
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2" aria-label="Роли символов">
        {roles.map((r) => (
          <span key={r} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <RoleChip role={r} />
            <span className="hidden lg:inline">{ROLE_META[r].hint}</span>
          </span>
        ))}
      </div>

      {/* Широкий экран — таблица */}
      <div className="hidden overflow-x-auto rounded-xl border border-border/40 md:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-primary/[0.07] text-left">
              <th scope="col" className="w-24 px-4 py-3 font-semibold text-foreground">
                Символ
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-foreground">
                Что означает и роль в формуле
              </th>
              <th scope="col" className="w-32 px-4 py-3 font-semibold text-foreground">
                Роль
              </th>
              <th scope="col" className="w-[30%] px-4 py-3 font-semibold text-foreground">
                {codeLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {symbols.map((s) => (
              <tr key={`${s.role}:${s.tex}`} className={`enf-symbol-row enf-symbol-row--${s.role} border-t border-border/30 align-top`}>
                <td className="whitespace-nowrap px-4 py-3 text-[1.15rem]">
                  <Math display={false}>{s.role === "neutral" ? s.tex : wrapRole(s.role, s.tex)}</Math>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  <p className="font-medium text-foreground">{s.name}</p>
                  <p className="mt-1 leading-relaxed">
                    <RichText text={s.meaning} />
                  </p>
                  {s.inFormula && (
                    <p className="mt-1.5 text-xs leading-relaxed text-foreground/70">
                      <span className="font-semibold text-foreground/85">В формуле: </span>
                      <RichText text={s.inFormula} />
                    </p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <RoleChip role={s.role} />
                </td>
                <td className="px-4 py-3">
                  <CodeCell entry={s} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Узкий экран — карточки */}
      <ul className="space-y-3 md:hidden">
        {symbols.map((s) => (
          <li
            key={`${s.role}:${s.tex}`}
            className={`enf-symbol-row enf-symbol-row--${s.role} rounded-xl border border-border/40 bg-background/40 p-4`}
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-[1.2rem]">
                <Math display={false}>{s.role === "neutral" ? s.tex : wrapRole(s.role, s.tex)}</Math>
              </span>
              <RoleChip role={s.role} />
            </div>
            <p className="font-medium text-foreground">{s.name}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              <RichText text={s.meaning} />
            </p>
            {s.inFormula && (
              <p className="mt-1.5 text-xs leading-relaxed text-foreground/70">
                <span className="font-semibold text-foreground/85">В формуле: </span>
                <RichText text={s.inFormula} />
              </p>
            )}
            <div className="mt-3 border-t border-border/30 pt-3">
              <p className="mb-1.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted-foreground">{codeLabel}</p>
              <CodeCell entry={s} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SymbolTable;

/** Словарь без таблицы: для страниц, где формулы есть, а кода нет. */
export const SymbolGlossary = ({ symbols }: { symbols: SymbolEntry[] }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useRegisterSymbols(symbols, ref);
  return <span ref={ref} hidden data-symbol-glossary="" />;
};
