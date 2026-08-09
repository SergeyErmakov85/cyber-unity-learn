import { Card, CardContent } from "@/components/ui/card";
import { Sigma } from "lucide-react";
import HubLink from "@/components/math-rl/HubLink";
import { getLinksForLesson } from "@/config/crosslinks";

/**
 * Блок «Математика под этим уроком» для страниц, которые не используют
 * LessonLayout (там тот же список встроен в раздел «Углубись в тему»).
 *
 * Данные — общий реестр src/config/crosslinks.ts, поэтому направления
 * «урок → лекция» и «лекция → урок» не могут разойтись.
 *
 * У блока есть собственный id: он же уходит в fromAnchor, и чип возврата
 * на лекции приводит читателя ровно сюда, а не в начало урока.
 */
const ANCHOR = "math-under-lesson";

interface LessonTextbookLinksProps {
  lessonId: string;
  /** Подпись для чипа «← Вернуться к уроку» на странице лекции. */
  lessonLabel: string;
}

const LessonTextbookLinks = ({ lessonId, lessonLabel }: LessonTextbookLinksProps) => {
  const links = getLinksForLesson(lessonId).filter((l) => l.textbookRoute);
  if (links.length === 0) return null;

  const lessonPath = links[0].lessonPath;

  return (
    <section id={ANCHOR} className="mt-12 scroll-mt-24">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
        <Sigma className="h-5 w-5 text-primary" />
        Математика под этим уроком
      </h2>
      <Card className="border-border/20 bg-card/40">
        <CardContent className="grid gap-3 p-4">
          {links.map((link) => (
            <div key={link.textbookRoute} className="text-sm">
              <HubLink
                to={link.textbookRoute!}
                fromPath={lessonPath}
                fromAnchor={ANCHOR}
                fromLabel={lessonLabel}
              >
                {link.hubLabel.replace("Математика → ", "")}
              </HubLink>
              <p className="text-xs text-muted-foreground">{link.contextInLesson}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
};

export default LessonTextbookLinks;
