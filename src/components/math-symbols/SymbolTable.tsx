import { useEffect, useState } from "react";
import { ChevronDown, MousePointerClick, Sigma } from "lucide-react";
import Math from "@/components/Math";
import { ROLES, ROLE_INFO, ROLE_TO_MACRO, type EnfRoleOrNeutral } from "@/lib/enf-symbols";
import { registerScope, unregisterScope } from "@/lib/symbol-registry";
import type { PageSymbols, SymbolEntry } from "@/content/math-symbols/types";
import RichText from "./RichText";

/**
 * Таблица «Символы страницы: от формулы к коду» (ENF, модуль «Код», п. 5.1):
 * каждый символ формул страницы — в своём цвете, со смыслом, ролью и тем,
 * как он записан в Python-коде этой же страницы.
 *
 * Таблица регистрирует свои строки для карточек по клику: нажатый в формуле
 * символ сначала ищется здесь, поэтому карточка и таблица говорят одно и то же.
 */

const COLLAPSED_ROWS = 10;

const symbolTex = (entry: SymbolEntry) =>
  entry.role === "neutral" ? entry.tex : `\\${ROLE_TO_MACRO[entry.role]}{${entry.tex}}`;

const RoleMark = ({ role }: { role: EnfRoleOrNeutral }) => (
  <span className={`inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium enf-${role}`}>
    <span
      className="h-2 w-2 shrink-0 rounded-full"
      style={{ background: `var(--enf-color-${role})`, boxShadow: `0 0 6px var(--enf-color-${role})` }}
    />
    {ROLE_INFO[role].short}
  </span>
);

const CodeChip = ({ code }: { code: string }) => (
  <code className="inline-block rounded-md border border-primary/25 bg-primary/10 px-1.5 py-0.5 font-mono text-[12px] text-primary">
    {code}
  </code>
);

interface SymbolTableProps extends PageSymbols {
  title?: string;
  className?: string;
}

const SymbolTable = ({ id, caption, symbols, title, className = "" }: SymbolTableProps) => {
  const [expanded, setExpanded] = useState(symbols.length <= COLLAPSED_ROWS + 2);

  useEffect(() => {
    registerScope(id, symbols);
    return () => unregisterScope(id);
  }, [id, symbols]);

  const rows = expanded ? symbols : symbols.slice(0, COLLAPSED_ROWS);
  const usedRoles = ROLES.filter((r) => symbols.some((s) => s.role === r));

  return (
    <section
      id={`enf-symbols-${id}`}
      data-enf-scope={id}
      className={`scroll-mt-24 my-8 overflow-hidden rounded-2xl border border-primary/20 bg-card/60 backdrop-blur-sm ${className}`}
    >
      <header className="flex flex-col gap-4 border-b border-primary/10 bg-gradient-to-r from-primary/10 via-secondary/5 to-transparent p-5 md:flex-row md:items-start md:p-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 shadow-[0_0_24px_hsl(var(--primary)/0.35)]">
          <Sigma className="h-6 w-6 text-primary" />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <h3 className="font-heading text-lg font-bold leading-snug text-foreground md:text-xl">
            {title ?? "Символы страницы: от формулы к коду"}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {caption ??
              "Каждый символ из формул этой страницы: что он означает, какую роль играет и как называется в Python-коде."}{" "}
            Цвет символа — его роль, одинаковая во всех формулах страницы.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1">
            {usedRoles.map((role) => (
              <span key={role} className="text-xs text-muted-foreground">
                <RoleMark role={role} /> — {ROLE_INFO[role].hint}
              </span>
            ))}
          </div>
          <p className="flex items-center gap-1.5 text-xs text-secondary">
            <MousePointerClick className="h-3.5 w-3.5 shrink-0" />
            Нажмите на любой символ в формуле — над ним откроется карточка с подробным объяснением.
          </p>
        </div>
      </header>

      {/* Широкий экран: таблица */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-primary/10 text-left font-heading text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              <th className="w-[12%] px-5 py-3 font-medium">Символ</th>
              <th className="px-3 py-3 font-medium">Смысл</th>
              <th className="w-[11%] px-3 py-3 font-medium">Роль</th>
              <th className="w-[22%] px-3 py-3 font-medium">В коде (Python)</th>
              <th className="w-[16%] px-5 py-3 font-medium">Тип и форма</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((entry) => (
              <tr
                key={entry.role + entry.tex}
                className="border-b border-border/40 align-top transition-colors last:border-0 hover:bg-primary/5"
              >
                <td className="px-5 py-3 text-base">
                  <Math display={false}>{symbolTex(entry)}</Math>
                </td>
                <td className="px-3 py-3 leading-relaxed">
                  <div className="font-semibold text-foreground">{entry.name}</div>
                  <div className="text-muted-foreground">
                    <RichText text={entry.meaning} />
                  </div>
                </td>
                <td className="px-3 py-3">
                  <RoleMark role={entry.role} />
                </td>
                <td className="px-3 py-3 leading-relaxed">
                  {entry.code ? <CodeChip code={entry.code} /> : <span className="text-muted-foreground">—</span>}
                  {entry.codeNote && (
                    <div className="mt-1.5 text-xs text-muted-foreground">
                      <RichText text={entry.codeNote} />
                    </div>
                  )}
                </td>
                <td className="px-5 py-3 font-mono text-xs leading-relaxed text-muted-foreground">
                  {entry.codeType ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Узкий экран: карточки */}
      <ul className="divide-y divide-border/40 md:hidden">
        {rows.map((entry) => (
          <li key={entry.role + entry.tex} className="space-y-2 px-4 py-3 text-sm">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-lg">
                <Math display={false}>{symbolTex(entry)}</Math>
              </span>
              <RoleMark role={entry.role} />
            </div>
            <div className="font-semibold text-foreground">{entry.name}</div>
            <div className="leading-relaxed text-muted-foreground">
              <RichText text={entry.meaning} />
            </div>
            {(entry.code || entry.codeType) && (
              <div className="flex flex-wrap items-baseline gap-2">
                {entry.code && <CodeChip code={entry.code} />}
                {entry.codeType && <span className="font-mono text-xs text-muted-foreground">{entry.codeType}</span>}
              </div>
            )}
            {entry.codeNote && (
              <div className="text-xs text-muted-foreground">
                <RichText text={entry.codeNote} />
              </div>
            )}
          </li>
        ))}
      </ul>

      {symbols.length > rows.length || (expanded && symbols.length > COLLAPSED_ROWS + 2) ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-center justify-center gap-2 border-t border-primary/10 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
          {expanded ? "Свернуть таблицу" : `Показать все символы (${symbols.length})`}
        </button>
      ) : null}
    </section>
  );
};

export default SymbolTable;
