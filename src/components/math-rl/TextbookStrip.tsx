import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { PART_INDEX } from "@/content/textbook/index.generated";
import { TEXTBOOK_PARTS, TEXTBOOK_ROOT } from "@/content/textbook/parts";
import { sections } from "@/lib/plural";

/**
 * Мост из обзорной части хаба в полные лекции учебника.
 *
 * Хаб остаётся кратким изложением, поэтому у каждой его части здесь появляется
 * список разделов пособия — тот же материал, разобранный до конца, с выводами,
 * задачами и кодом. Связь строится по sitePartId, а не по номеру каталога:
 * нумерация хаба и нумерация пособия не совпадают (см. content/textbook/parts.ts).
 */
const TextbookStrip = ({ sitePartId }: { sitePartId: string }) => {
  const part = TEXTBOOK_PARTS.find((p) => p.sitePartId === sitePartId);
  if (!part) return null;

  const lectures = PART_INDEX[part.segment] ?? [];
  if (lectures.length === 0) return null;

  return (
    <div className="mb-8 rounded-xl border border-secondary/30 bg-card/40 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <BookOpen className="h-4 w-4 text-secondary" />
          Полная версия части в учебнике
        </h3>
        <Link
          to={`${TEXTBOOK_ROOT}/${part.segment}`}
          className="text-xs text-secondary hover:underline"
        >
          {sections(lectures.length)} целиком →
        </Link>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        Ниже — краткое изложение. Полные лекции с доказательствами, разбором на числах и задачами:
      </p>

      <ul className="mt-3 flex flex-wrap gap-2">
        {lectures.map((lecture) => (
          <li key={lecture.id}>
            <Link
              to={lecture.route}
              className="inline-block rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-secondary/60 hover:text-foreground"
            >
              {lecture.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TextbookStrip;
