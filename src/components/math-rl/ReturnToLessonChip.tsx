import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { LEARNING_MAP } from "@/content/learningMap";

/** Возврат к месту в уроке, откуда читатель открыл хаб или учебник. */
const ReturnToLessonChip = () => {
  const [params] = useSearchParams();

  const from = params.get("from");
  const fromAnchor = params.get("fromAnchor");
  const fromLabel = params.get("fromLabel");

  if (!fromAnchor || !LEARNING_MAP.some(stage => stage.lessons.some(lesson => lesson.path === from))) {
    return null;
  }

  return (
    <div className="pointer-events-none sticky top-16 z-40 flex justify-end px-4 pt-2 md:top-20">
      <Link
        to={{ pathname: from, hash: encodeURIComponent(fromAnchor) }}
        className="pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary font-mono text-xs backdrop-blur-md transition-all duration-200 hover:border-primary/60 hover:shadow-glow-cyan"
      >
        <ArrowLeft aria-hidden style={{ width: 13, height: 13 }} />
        <span>Вернуться к уроку{fromLabel ? `: ${fromLabel}` : ""}</span>
      </Link>
    </div>
  );
};

export default ReturnToLessonChip;
