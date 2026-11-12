import dogTrainingImg from "@/assets/lesson-1-1/dog-training.webp";

const STEPS = [
  { title: "Наблюдение", text: "Собака слышит команду и видит жест хозяина." },
  { title: "Действие", text: "Собака выбирает, что сделать, и садится." },
  { title: "Награда", text: "За выполненное действие она получает лакомство." },
];

const DogTrainingIllustration = () => (
  <figure
    aria-labelledby="dog-training-title"
    className="mt-6 overflow-hidden rounded-2xl border border-primary/30 bg-card/60"
  >
    <div className="border-b border-primary/10 bg-gradient-to-r from-primary/10 to-secondary/5 px-5 py-4 sm:px-6">
      <p className="mb-1 font-mono text-xs uppercase tracking-widest text-primary">
        RL на знакомом примере
      </p>
      <h3 id="dog-training-title" className="text-lg font-bold text-foreground">
        От команды к награде
      </h3>
    </div>

    <img
      src={dogTrainingImg}
      alt="Три шага слева направо: собака воспринимает жест хозяина, садится и получает лакомство. Стрелки показывают порядок событий."
      width={1536}
      height={1024}
      loading="lazy"
      decoding="async"
      className="block h-auto w-full"
    />

    <figcaption className="space-y-4 p-5 sm:p-6">
      <p className="text-sm text-muted-foreground">
        <strong className="text-primary">Агент — собака.</strong>{" "}
        Среда — комната и хозяин, с которыми она взаимодействует.
      </p>
      <ol className="grid gap-4 sm:grid-cols-3">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex items-start gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-mono text-xs text-primary">
              {index + 1}
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">{step.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="border-t border-border/50 pt-4 text-sm leading-relaxed text-muted-foreground">
        <strong className="text-foreground">Что меняется с опытом?</strong>{" "}
        Услышав команду снова, собака чаще выбирает действие, за которое получала награду.
      </p>
    </figcaption>
  </figure>
);

export default DogTrainingIllustration;
