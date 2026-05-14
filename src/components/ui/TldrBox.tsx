import { ReactNode } from "react";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface TldrBoxProps {
  title?: string;
  items: ReactNode[];
  className?: string;
}

const TldrBox = ({ title = "TL;DR", items, className }: TldrBoxProps) => {
  return (
    <aside
      className={cn(
        "rounded-2xl border border-yellow-400/30 bg-gradient-to-br from-yellow-500/5 via-amber-500/5 to-orange-500/5 backdrop-blur-sm p-6",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_8px_hsl(48_96%_60%/0.6)]" />
        <h3 className="text-lg font-bold text-yellow-300">{title}</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 text-sm text-foreground/90 leading-relaxed">
            <span className="text-yellow-400 mt-1 shrink-0">▸</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default TldrBox;
