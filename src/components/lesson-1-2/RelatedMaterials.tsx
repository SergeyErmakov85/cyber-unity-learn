import { Card, CardContent } from "@/components/ui/card";
import { Link2, GraduationCap, Wrench, ExternalLink } from "lucide-react";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";

const HUBS: Array<{
  path: string;
  anchor?: string;
  title: string;
  label: string;
}> = [
  {
    path: "/pytorch/cheatsheet",
    anchor: "setup",
    title: "PyTorch — Установка",
    label: "PyTorch → Шпаргалка: установка, тензоры, первые шаги",
  },
  {
    path: "/unity-ml-agents",
    anchor: "installation",
    title: "Unity ML-Agents — Установка",
    label: "Unity ML-Agents → Установка и структура тулкита",
  },
];

const LESSONS: Array<{
  id: string;
  path: string;
  title: string;
  note: string;
}> = [
  {
    id: "1.1",
    path: "/courses/1-1",
    title: "Что такое RL?",
    note: "Теоретический фундамент перед настройкой окружения",
  },
  {
    id: "1.5",
    path: "/courses/1-5",
    title: "CartPole — твой первый RL-агент",
    note: "Первое применение установленного окружения на практике",
  },
  {
    id: "1.6",
    path: "/courses/1-6",
    title: "DQN с нуля на PyTorch",
    note: "Здесь пригодится CUDA-сборка PyTorch",
  },
];

const EXTERNAL: Array<{ label: string; url: string }> = [
  {
    label: "Репозиторий Unity ML-Agents",
    url: "https://github.com/Unity-Technologies/ml-agents",
  },
  {
    label: "Официальная инструкция по установке ML-Agents (Release 22)",
    url: "https://unity-technologies.github.io/ml-agents/Installation/",
  },
  {
    label: "Селектор установки PyTorch",
    url: "https://pytorch.org/get-started/locally/",
  },
  { label: "Загрузка Anaconda", url: "https://www.anaconda.com/download" },
  {
    label: "Документация conda: управление средами",
    url: "https://docs.conda.io/projects/conda/en/stable/user-guide/tasks/manage-environments.html",
  },
  { label: "Unity Hub", url: "https://unity.com/download" },
  {
    label: "Jupyter в VS Code",
    url: "https://code.visualstudio.com/docs/datascience/jupyter-notebooks",
  },
];

const RelatedMaterials = () => (
  <section
    aria-label="Связанные материалы"
    className="mt-12 scroll-mt-24 py-10 px-6 md:px-8 bg-card/60 backdrop-blur-sm rounded-2xl border border-cyan-500/10"
  >
    <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
      Связанные материалы
    </h2>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Hubs */}
      <Card className="bg-card/40 backdrop-blur-sm border-cyan-500/20 hover:border-cyan-400/50 transition-colors">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-foreground">Хабы по теме</h3>
          </div>
          <ul className="space-y-2.5 text-sm">
            {HUBS.map((h) => (
              <li key={h.path + (h.anchor ?? "")} className="leading-snug">
                <CrossLinkToHub hubPath={h.path} hubAnchor={h.anchor} hubTitle={h.title}>
                  {h.label}
                </CrossLinkToHub>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Lessons */}
      <Card className="bg-card/40 backdrop-blur-sm border-purple-500/20 hover:border-purple-400/50 transition-colors">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-foreground">Связанные уроки</h3>
          </div>
          <ul className="space-y-3 text-sm">
            {LESSONS.map((l) => (
              <li key={l.id} className="leading-snug">
                <CrossLinkToLesson
                  lessonId={l.id}
                  lessonPath={l.path}
                  lessonTitle={l.title}
                  lessonLevel={1}
                >
                  <span className="font-semibold">{l.id}</span>
                  <span className="ml-1">— {l.title}</span>
                </CrossLinkToLesson>
                <div className="text-xs text-muted-foreground mt-0.5 ml-4">{l.note}</div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* External */}
      <Card className="bg-card/40 backdrop-blur-sm border-pink-500/20 hover:border-pink-400/50 transition-colors">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-pink-400" />
            <h3 className="font-bold text-foreground">Внешние ресурсы</h3>
          </div>
          <ul className="space-y-2 text-sm">
            {EXTERNAL.map((r) => (
              <li key={r.url}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-1.5 text-cyan-300 hover:text-cyan-200 hover:underline transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{r.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  </section>
);

export default RelatedMaterials;
