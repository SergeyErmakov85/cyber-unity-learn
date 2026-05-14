import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LessonLink {
  title: string;
  path: string;
}

interface NextPrevLessonProps {
  prev?: LessonLink;
  next?: LessonLink;
}

const NextPrevLesson = ({ prev, next }: NextPrevLessonProps) => {
  return (
    <nav
      aria-label="Навигация между уроками"
      className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      {prev ? (
        <Link
          to={prev.path}
          className={cn(
            "group flex items-center gap-3 rounded-2xl border border-cyan-500/20 bg-card/60 backdrop-blur-sm p-4 transition-all",
            "hover:border-cyan-400/60 hover:shadow-[0_0_20px_hsl(var(--primary)/0.25)]"
          )}
        >
          <ArrowLeft className="w-5 h-5 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Назад</div>
            <div className="font-semibold text-foreground">{prev.title}</div>
          </div>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          to={next.path}
          className={cn(
            "group flex items-center justify-end gap-3 rounded-2xl border border-pink-500/20 bg-card/60 backdrop-blur-sm p-4 transition-all text-right",
            "hover:border-pink-400/60 hover:shadow-[0_0_20px_hsl(var(--accent)/0.25)]"
          )}
        >
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Далее</div>
            <div className="font-semibold text-foreground">{next.title}</div>
          </div>
          <ArrowRight className="w-5 h-5 text-pink-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
};

export default NextPrevLesson;
