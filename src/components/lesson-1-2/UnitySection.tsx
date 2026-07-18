import { Card, CardContent } from "@/components/ui/card";
import { Gamepad2, Monitor, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";

const STEPS = [
  {
    step: "Скачайте и установите Unity Hub с unity.com/download",
    icon: Monitor,
  },
  {
    step: "В Unity Hub: Installs → Install Editor → выберите Unity 6 LTS (6000.x). Дополнительные модули (Android/iOS) для курса не нужны",
    icon: Gamepad2,
  },
  {
    step: "Создайте тестовый 3D-проект (Projects → New project → Universal 3D), чтобы убедиться, что редактор запускается",
    icon: CheckCircle2,
  },
];

const UnitySection = () => (
  <div className="space-y-6">
    <p className="text-muted-foreground leading-relaxed">
      Unity — игровой движок, в котором живут среды и агенты. ML-Agents Release 22
      официально поддерживает{" "}
      <strong className="text-foreground">Unity 6000.0 и новее</strong>.
    </p>

    <div className="space-y-3">
      {STEPS.map((item, i) => (
        <div key={i} className="flex gap-3 items-start">
          <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-xs font-bold text-primary">{i + 1}</span>
          </div>
          <div className="flex items-center gap-2 flex-1 p-3 rounded-lg bg-card/40 border border-border/30">
            <item.icon className="w-4 h-4 text-muted-foreground/50 shrink-0" />
            <p className="text-sm text-muted-foreground">{item.step}</p>
          </div>
        </div>
      ))}
    </div>

    <Card className="bg-destructive/5 border-destructive/20">
      <CardContent className="p-4 flex gap-3 items-start">
        <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          Не используйте версии старее Unity 6 — Unity-пакет ML-Agents из ветки{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">release_22</code> с
          ними несовместим. Сам пакет подключим в следующем разделе — из клонированного
          репозитория, чтобы версии C#- и Python-частей точно совпадали.
        </p>
      </CardContent>
    </Card>

    <a
      href="https://unity.com/download"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm text-cyan-300 hover:text-cyan-200 hover:underline"
    >
      <ExternalLink className="w-3.5 h-3.5" />
      Скачать Unity Hub
    </a>
  </div>
);

export default UnitySection;
