import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Unlock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUserRole } from "@/hooks/useUserRole";
import { MONETIZATION_ENABLED } from "@/config/monetization";

interface CrossLinkToLessonProps {
  lessonId: string;
  lessonPath: string;
  lessonTitle: string;
  lessonLevel: 1 | 2 | 3;
  children?: React.ReactNode;
}

const CrossLinkToLesson = ({
  lessonId,
  lessonPath,
  lessonTitle,
  lessonLevel,
  children,
}: CrossLinkToLessonProps) => {
  const navigate = useNavigate();
  const { isAdmin } = useUserRole();
  const [showDialog, setShowDialog] = useState(false);

  // Монетизация выключена — открыт любой урок. Иначе: admin обходит замки, уровень 1 всегда бесплатен.
  const isAccessible = !MONETIZATION_ENABLED || lessonLevel === 1 || isAdmin;

  const handleClick = () => {
    if (isAccessible) {
      navigate(lessonPath);
    } else {
      setShowDialog(true);
    }
  };

  const label = children ?? `Урок ${lessonId}`;

  if (isAccessible) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            onClick={handleClick}
            className="inline-flex items-center gap-1 cursor-pointer text-[hsl(192,100%,50%)] hover:underline transition-all duration-200"
          >
            <Unlock className="inline w-2.5 h-2.5 flex-shrink-0 text-muted-foreground" />
            {label}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          {lessonTitle}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            onClick={handleClick}
            className="inline-flex items-center gap-1 cursor-default text-slate-500"
          >
            <Lock className="inline w-3 h-3 flex-shrink-0 text-slate-500" />
            {label}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          Этот урок доступен на тарифе PRO
        </TooltipContent>
      </Tooltip>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>PRO-контент</AlertDialogTitle>
            <AlertDialogDescription>
              Урок «{lessonTitle}» доступен на тарифе PRO.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Закрыть</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate("/pricing")}>
              Узнать о PRO
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CrossLinkToLesson;

/** Compact badge variant: "2.2 🔓" or "1.3 🔒" */
interface CrossLinkBadgeProps {
  lessonId: string;
  lessonPath: string;
  lessonTitle: string;
  lessonLevel: 1 | 2 | 3;
}

export const CrossLinkBadge = ({
  lessonId,
  lessonPath,
  lessonTitle,
  lessonLevel,
}: CrossLinkBadgeProps) => {
  const navigate = useNavigate();
  const { isAdmin } = useUserRole();
  const [showDialog, setShowDialog] = useState(false);

  const isAccessible = !MONETIZATION_ENABLED || lessonLevel === 1 || isAdmin;

  const handleClick = () => {
    if (isAccessible) {
      navigate(lessonPath);
    } else {
      setShowDialog(true);
    }
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            onClick={handleClick}
            className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border transition-colors ${
              isAccessible
                ? "border-[hsl(192,100%,50%)]/30 text-[hsl(192,100%,50%)] cursor-pointer hover:bg-[hsl(192,100%,50%)]/10"
                : "border-slate-600 text-slate-500 cursor-default"
            }`}
          >
            {lessonId}
            {isAccessible ? (
              <Unlock className="w-2.5 h-2.5" />
            ) : (
              <Lock className="w-2.5 h-2.5" />
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          {isAccessible ? lessonTitle : "Доступно на тарифе PRO"}
        </TooltipContent>
      </Tooltip>

      {!isAccessible && (
        <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>PRO-контент</AlertDialogTitle>
              <AlertDialogDescription>
                Урок «{lessonTitle}» доступен на тарифе PRO.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Закрыть</AlertDialogCancel>
              <AlertDialogAction onClick={() => navigate("/pricing")}>
                Узнать о PRO
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};
