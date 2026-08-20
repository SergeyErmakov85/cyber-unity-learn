import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Boxes, ExternalLink, FileCode2, Terminal } from "lucide-react";

import { LAB_REPO, LAB_ENVS, getLabPractice, labUrl, type LabEnv } from "@/content/labEnvironments";

/**
 * Блок «Практика: собранная среда в лаборатории».
 *
 * Курс объясняет, пособие доказывает, лаборатория показывает работающий код.
 * Этот блок — третья вершина: он ведёт из места урока прямо в файл, где
 * та же идея записана и проверена запуском.
 *
 * Данные — общий реестр `src/content/labEnvironments.ts`, один на весь сайт.
 * Ссылки внешние и открываются в новой вкладке: лаборатория — отдельный
 * репозиторий, и уводить читателя из урока насовсем не нужно.
 *
 * У блока есть собственный id, чтобы на него можно было сослаться якорем.
 */
const ANCHOR = "lab-practice";

/** Ссылки, которые стоит открыть первыми именно в этом месте курса. */
const pickLinks = (env: LabEnv, focus?: string[]) => {
  if (!focus || focus.length === 0) return env.links;

  const byPath = new Map(env.links.map((link) => [link.path, link]));
  const picked = focus.map(
    (path) => byPath.get(path) ?? { label: path.split("/").pop() ?? path, path },
  );

  // Карточка среды остаётся всегда: с неё начинается любое знакомство.
  const card = env.links[0];
  return picked.some((link) => link.path === card.path) ? picked : [card, ...picked];
};

const STATUS_TEXT: Record<LabEnv["status"], string> = {
  done: "обучено и проверено в Unity",
  ready: "готово к запуску обучения",
};

interface LabPracticeSectionProps {
  /**
   * Ключ реестра: идентификатор урока (`3-4`, `project-2`) или маршрут
   * страницы (`/algorithms/ppo`).
   */
  contextKey: string;
}

const LabPracticeSection = ({ contextKey }: LabPracticeSectionProps) => {
  const practice = getLabPractice(contextKey);
  if (practice.length === 0) return null;

  return (
    <section id={ANCHOR} className="mt-12 scroll-mt-24">
      <h2 className="mb-2 flex items-center gap-2 text-xl font-bold text-foreground">
        <Boxes className="h-5 w-5 text-primary" />
        Практика: собранная среда в лаборатории
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Не пересказ, а работающий код:{" "}
        <a
          href={LAB_REPO}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          unity-ml-agents-lab
        </a>{" "}
        — двенадцать сред Unity ML-Agents и собственное ядро обучения на PyTorch,
        где алгоритмы написаны своим кодом, а не взяты из библиотеки.
      </p>

      <div className="grid gap-4">
        {practice.map(({ envId, whyThisNow, focus }) => {
          const env = LAB_ENVS[envId];
          const links = pickLinks(env, focus);

          return (
            <Card key={envId} className="border-primary/20 bg-card/40">
              <CardContent className="space-y-3 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={labUrl(env.links[0].path)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-semibold text-foreground hover:text-primary"
                  >
                    <code className="rounded bg-muted/50 px-1.5 py-0.5 font-mono text-xs">
                      {env.id}
                    </code>
                    {env.title}
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  </a>
                  <Badge variant={env.status === "done" ? "default" : "secondary"}>
                    {STATUS_TEXT[env.status]}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground">
                  <span className="text-foreground/80">Задача:</span> {env.task}.{" "}
                  <span className="text-foreground/80">Действия:</span> {env.actions}.{" "}
                  <span className="text-foreground/80">Методы:</span> {env.algos.join(", ")}.
                </p>

                <p className="text-sm text-foreground/90">{whyThisNow}</p>

                <p className="text-xs text-muted-foreground">
                  <span className="text-foreground/70">Чем подтверждено:</span> {env.evidence}.
                </p>

                <ul className="grid gap-1.5 sm:grid-cols-2">
                  {links.map((link) => (
                    <li key={link.path} className="text-sm">
                      <a
                        href={labUrl(link.path)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={link.path}
                        className="inline-flex items-start gap-1.5 text-primary hover:underline"
                      >
                        <FileCode2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                  <li className="text-sm">
                    <a
                      href={labUrl(env.notebook)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={env.notebook}
                      className="inline-flex items-start gap-1.5 text-primary hover:underline"
                    >
                      <FileCode2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      Ноутбук с графиками
                    </a>
                  </li>
                </ul>

                <div className="rounded-lg border border-border/40 bg-muted/20 p-3">
                  <p className="mb-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Terminal className="h-3.5 w-3.5" />
                    Запустить обучение из корня лаборатории
                  </p>
                  <code className="block overflow-x-auto whitespace-pre font-mono text-xs text-foreground/90">
                    {env.train}
                  </code>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default LabPracticeSection;
