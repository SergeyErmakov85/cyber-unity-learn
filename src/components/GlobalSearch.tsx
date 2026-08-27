import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { BookOpen, Code2, FileText, HelpCircle, Sigma } from "lucide-react";
import { LECTURES } from "@/content/textbook/index.generated";
import { TEXTBOOK_PARTS, TEXTBOOK_ROOT } from "@/content/textbook/parts";
import { MONETIZATION_ENABLED } from "@/config/monetization";

interface SearchItem {
  title: string;
  path: string;
  group: string;
  keywords?: string;
}

/**
 * Разделы учебника подмешиваются в поиск из сгенерированного индекса:
 * добавили лекцию — она находится, руками список не ведём.
 * Ключевые слова — теги лекции и подпись её узла на mind map.
 */
const TEXTBOOK_ITEMS: SearchItem[] = [
  { title: "Учебник по математике RL — все части", path: TEXTBOOK_ROOT, group: "Учебник", keywords: "математика учебник lectures" },
  ...TEXTBOOK_PARTS.map((part) => ({
    title: `Часть ${part.roman}. ${part.title}`,
    path: `${TEXTBOOK_ROOT}/${part.segment}`,
    group: "Учебник",
    keywords: part.caption.toLowerCase(),
  })),
  ...LECTURES.map((lecture) => ({
    title: lecture.title,
    path: lecture.route,
    group: "Учебник",
    keywords: [...lecture.tags, lecture.mindmapNode ?? ""].join(" ").toLowerCase(),
  })),
];

const searchItems: SearchItem[] = [
  // Уроки
  { title: "Что такое обучение с подкреплением?", path: "/courses/1-1", group: "Уроки", keywords: "rl reinforcement learning" },
  { title: "Установка окружения: PyTorch + Unity ML-Agents", path: "/courses/1-2", group: "Уроки", keywords: "install setup" },
  { title: "MDP — Марковские процессы принятия решений", path: "/courses/1-3", group: "Уроки", keywords: "mdp markov bellman" },
  { title: "Q-Learning: табличный метод", path: "/courses/1-4", group: "Уроки", keywords: "q-learning tabular" },
  { title: "CartPole — первый агент", path: "/courses/1-5", group: "Уроки", keywords: "cartpole agent" },
  { title: "DQN с нуля на PyTorch", path: "/courses/1-6", group: "Уроки", keywords: "dqn deep q-network" },
  { title: "Exploration vs Exploitation", path: "/courses/1-7", group: "Уроки", keywords: "exploration exploitation epsilon" },
  { title: "Policy Gradient и теорема градиента", path: "/courses/2-1", group: "Уроки", keywords: "policy gradient reinforce" },
  { title: "PPO — реализация с нуля", path: "/courses/2-2", group: "Уроки", keywords: "ppo proximal policy" },
  { title: "Непрерывные действия и Actor-Critic", path: "/courses/2-3", group: "Уроки", keywords: "actor critic continuous" },
  { title: "Reward Shaping", path: "/courses/2-4", group: "Уроки", keywords: "reward shaping" },
  { title: "Параллельные среды", path: "/courses/2-5", group: "Уроки", keywords: "parallel environments" },
  { title: "TensorBoard и W&B", path: "/courses/2-6", group: "Уроки", keywords: "tensorboard wandb logging" },
  { title: "SAC — Soft Actor-Critic", path: "/courses/3-1", group: "Уроки", keywords: "sac soft actor critic" },
  { title: "MA-POCA и Self-Play", path: "/courses/3-2", group: "Уроки", keywords: "mapoca multi-agent" },
  { title: "Curriculum Learning", path: "/courses/3-3", group: "Уроки", keywords: "curriculum" },
  { title: "Имитационное обучение (GAIL)", path: "/courses/3-4", group: "Уроки", keywords: "gail imitation" },
  { title: "Деплой модели: ONNX", path: "/courses/3-5", group: "Уроки", keywords: "onnx deploy" },
  { title: "Оптимизация гиперпараметров", path: "/courses/3-6", group: "Уроки", keywords: "hyperparameters optuna" },
  { title: "Архитектуры нейросетей", path: "/courses/3-7", group: "Уроки", keywords: "neural networks architecture" },

  // Поиск
  { title: "Поиск по урокам и блогу", path: "/search", group: "FAQ", keywords: "поиск search фильтры темы" },

  // Примеры кода
  { title: "Примеры кода", path: "/code-examples", group: "Примеры кода", keywords: "code examples" },
  { title: "PyTorch шпаргалка", path: "/pytorch/cheatsheet", group: "Примеры кода", keywords: "pytorch cheatsheet" },
  { title: "Алгоритмы RL", path: "/algorithms", group: "Примеры кода", keywords: "algorithms dqn ppo sac" },

  // Блог
  { title: "PPO vs SAC: Сравнение алгоритмов", path: "/blog/ppo-vs-sac", group: "Блог", keywords: "ppo sac comparison" },
  { title: "5 ошибок новичков в RL", path: "/blog/top-5-mistakes", group: "Блог", keywords: "mistakes beginners" },
  { title: "Параллельные среды в Unity", path: "/blog/parallel-envs", group: "Блог", keywords: "parallel environments unity" },
  { title: "Гайд по MA-POCA", path: "/blog/mapoca-guide", group: "Блог", keywords: "mapoca guide multi-agent" },
  { title: "От Jupyter к Unity", path: "/blog/jupyter-to-unity", group: "Блог", keywords: "jupyter unity migration" },

  // FAQ
  { title: "FAQ — Часто задаваемые вопросы", path: "/faq", group: "FAQ", keywords: "faq questions help" },
  ...(MONETIZATION_ENABLED
    ? [{ title: "Тарифы и цены", path: "/pricing", group: "FAQ", keywords: "pricing plans pro free" }]
    : []),
  { title: "Сообщество", path: "/community", group: "FAQ", keywords: "community discord" },

  ...TEXTBOOK_ITEMS,
];

const groupIcons: Record<string, typeof BookOpen> = {
  "Уроки": BookOpen,
  "Примеры кода": Code2,
  "Блог": FileText,
  "FAQ": HelpCircle,
  "Учебник": Sigma,
};

const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const grouped = useMemo(() => {
    const groups: Record<string, SearchItem[]> = {};
    for (const item of searchItems) {
      if (!groups[item.group]) groups[item.group] = [];
      groups[item.group].push(item);
    }
    return groups;
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Поиск по сайту... (Ctrl+K)" />
      <CommandList>
        <CommandEmpty>Ничего не найдено.</CommandEmpty>
        {Object.entries(grouped).map(([group, items]) => {
          const Icon = groupIcons[group] || BookOpen;
          return (
            <CommandGroup key={group} heading={group}>
              {items.map((item) => (
                <CommandItem
                  key={item.path}
                  value={`${item.title} ${item.keywords || ""}`}
                  onSelect={() => {
                    setOpen(false);
                    navigate(item.path);
                  }}
                  className="cursor-pointer"
                >
                  <Icon className="mr-2 h-4 w-4 text-primary" />
                  <span>{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
};

export default GlobalSearch;
