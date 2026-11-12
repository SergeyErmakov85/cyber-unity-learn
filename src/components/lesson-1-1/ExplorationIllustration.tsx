import explorationImg from "@/assets/lesson-1-1/exploration-exploitation.webp";

const ExplorationIllustration = () => (
  <figure
    aria-labelledby="exploration-illustration-title"
    className="my-6 overflow-hidden rounded-2xl border border-secondary/30 bg-card/60"
  >
    <div className="border-b border-secondary/10 bg-gradient-to-r from-primary/10 to-secondary/10 px-5 py-4 sm:px-6">
      <p className="mb-1 font-mono text-xs uppercase tracking-widest text-secondary">
        Дилемма выбора
      </p>
      <h3 id="exploration-illustration-title" className="text-lg font-bold text-foreground">
        Знакомый путь или новая возможность?
      </h3>
    </div>

    <img
      src={explorationImg}
      alt="Робот стоит на развилке. Слева сплошной бирюзовый путь ведёт к знакомой награде — кристаллу. Справа фиолетовый пунктир ведёт в туман со знаком вопроса: результат ещё неизвестен."
      width={1536}
      height={1024}
      loading="lazy"
      decoding="async"
      className="block h-auto w-full"
    />

    <figcaption className="space-y-4 p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="mb-2 flex items-center gap-2">
            <span aria-hidden="true" className="w-6 shrink-0 border-t-2 border-primary" />
            <p className="text-sm font-semibold text-foreground">Слева — exploitation</p>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Использовать опыт: выбрать знакомый маршрут, который раньше приносил награду.
          </p>
        </div>
        <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-4">
          <div className="mb-2 flex items-center gap-2">
            <span aria-hidden="true" className="w-6 shrink-0 border-t-2 border-dashed border-secondary" />
            <p className="text-sm font-semibold text-foreground">Справа — exploration</p>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Исследовать: проверить новый маршрут. Награда может оказаться больше, меньше или отсутствовать.
          </p>
        </div>
      </div>
      <p className="border-t border-border/50 pt-4 text-sm leading-relaxed text-muted-foreground">
        <strong className="text-foreground">Знак вопроса — это неизвестность.</strong>{" "}
        Исследование даёт новые знания, а использование опыта помогает получать награду
        по уже известной стратегии. Агенту нужны оба подхода.
      </p>
    </figcaption>
  </figure>
);

export default ExplorationIllustration;
