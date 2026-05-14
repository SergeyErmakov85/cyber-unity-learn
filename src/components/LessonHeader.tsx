import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";

interface LessonHeaderProps {
  title: string;
  subtitle?: string;
  isPro?: boolean;
  estimatedMinutes?: number;
}

const LessonHeader = ({ title, subtitle, isPro, estimatedMinutes }: LessonHeaderProps) => {
  return (
    <header className="space-y-4 pb-8">
      <div className="flex flex-wrap items-center gap-3">
        {isPro && (
          <Badge className="bg-gradient-to-r from-secondary to-primary text-primary-foreground border-0 gap-1">
            <Crown className="w-3 h-3" />
            PRO
          </Badge>
        )}
        {estimatedMinutes && (
          <Badge variant="outline" className="border-primary/30 text-primary">
            ~{estimatedMinutes} мин
          </Badge>
        )}
      </div>
      <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">{subtitle}</p>
      )}
    </header>
  );
};

export default LessonHeader;
