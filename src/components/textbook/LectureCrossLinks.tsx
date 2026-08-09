import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { getLinksForTextbook } from "@/config/crosslinks";

/**
 * Обратная сторона связи «урок → лекция»: где разобранная здесь математика
 * работает на практике. Данные — тот же реестр src/config/crosslinks.ts,
 * что рисует ссылки в уроках, поэтому направления не могут разойтись.
 */
const LectureCrossLinks = ({ route }: { route: string }) => {
  const links = getLinksForTextbook(route);
  if (links.length === 0) return null;

  return (
    <section className="mt-12 rounded-lg border border-secondary/30 bg-card/40 p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <GraduationCap className="h-5 w-5 text-secondary" />
        Где это применяется
      </h2>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={`${link.lessonId}-${link.hubAnchor ?? ""}`} className="text-sm">
            <Link to={link.lessonPath} className="font-medium text-secondary hover:underline">
              {link.lessonTitle}
            </Link>
            <span className="text-muted-foreground"> — {link.contextInLesson}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default LectureCrossLinks;
