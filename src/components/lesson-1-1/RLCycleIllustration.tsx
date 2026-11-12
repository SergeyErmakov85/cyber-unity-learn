import Math from "@/components/Math";
import robotStepImg from "@/assets/lesson-1-1/robot-rl-step.webp";

const STEPS = [
  { title: "Наблюдение", text: <>Перед роботом соседняя клетка с целью.</> },
  { title: "Действие", text: <>Робот выбирает шаг вправо, к звезде.</> },
  { title: "Ответ среды", text: <>Новая позиция и награда <Math display={false}>{"+10"}</Math>. Цель достигнута — эпизод завершён.</> },
];

export default function RLCycleIllustration() {
  return (
    <figure aria-labelledby="rl-step-title"
      className="overflow-hidden rounded-2xl border border-primary/30 bg-card/60">
      <div className="border-b border-primary/10 bg-gradient-to-r from-primary/10 to-secondary/5 px-5 py-4 sm:px-6">
        <p className="mb-1 font-mono text-xs uppercase tracking-widest text-primary">Один шаг крупным планом</p>
        <h3 id="rl-step-title" className="text-lg font-bold text-foreground">Как робот получает опыт</h3>
      </div>
      <img src={robotStepImg}
        alt="Три момента одного шага слева направо: робот видит звезду на соседней клетке, шагает вправо и достигает цели, получая награду."
        width={1536} height={1024} loading="lazy" decoding="async" className="block h-auto w-full" />
      <figcaption className="p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <div key={step.title} className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-mono text-xs text-primary">{index + 1}</span>
              <div>
                <p className="text-sm font-semibold text-foreground">{step.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </figcaption>
    </figure>
  );
}
