import { BookOpen } from "lucide-react";
import RichText from "@/components/math-symbols/RichText";
import { Section } from "./Section";

const Introduction = () => (
  <Section icon={<BookOpen className="w-5 h-5 text-primary" />} title="Введение: От интуитивного кодирования к математическому осознанию" id="введение">
    <p>
      Многие вводные курсы по RL предлагают быстрый старт: установку библиотек, копирование скриптов и запуск обучения. Такой подход даёт мгновенный визуальный результат, но оставляет огромные концептуальные пробелы. Алгоритмы превращаются в «чёрные ящики». Когда агент перестаёт обучаться или застревает в локальном оптимуме, инженер без математического аппарата оказывается бессилен.
    </p>
    <p>
      Этот модуль проведёт вас через всю иерархию математических абстракций, на которых строится RL: от базовой теории вероятностей через Марковские процессы, уравнения Беллмана и методы разностного обучения до градиентных методов оптимизации политик. Каждая концепция сопровождается детальной расшифровкой и проекцией на реальную практику.
    </p>
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
      {[
        "Теория вероятностей и математическое ожидание",
        "Многорукие бандиты и дилемма Exploration/Exploitation",
        "MDP и Марковское свойство",
        "Возврат, политики и функции ценности",
        "Уравнения Беллмана (ожиданий и оптимальности)",
        "Монте-Карло, TD-обучение, SARSA, Q-learning",
        String.raw`Следы пригодности TD($\enfPar{\lambda}$)`,
        "Deep RL: DQN и аппроксимация функций",
        "Policy Gradients, REINFORCE, Actor-Critic",
        "Практика: Unity ML-Agents",
      ].map((item, i) => (
        <div key={i} className="flex items-start gap-2 text-sm">
          <span className="text-primary font-mono font-bold min-w-[1.5rem]">{i + 1}.</span>
          <span><RichText text={item} /></span>
        </div>
      ))}
    </div>
  </Section>
);

export default Introduction;
