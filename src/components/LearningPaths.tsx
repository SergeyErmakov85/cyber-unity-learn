import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const paths = [
  {
    title: "Основы ML-Agents",
    level: "Начальный",
    duration: "4 недели",
    modules: [
      "Установка Unity ML-Agents Toolkit",
      "Создание первого агента",
      "Базовые концепции обучения с подкреплением",
      "Простой пример: мяч на платформе",
    ],
    gradient: "from-cyber-cyan to-primary",
  },
  {
    title: "Продвинутые техники",
    level: "Средний",
    duration: "6 недель",
    modules: [
      "Настройка параметров обучения",
      "Работа с наблюдениями и действиями",
      "Система наград и штрафов",
      "Curriculum Learning",
    ],
    gradient: "from-secondary to-cyber-purple",
  },
  {
    title: "Реальные проекты",
    level: "Продвинутый",
    duration: "8 недель",
    modules: [
      "Многоагентные системы",
      "Имитационное обучение",
      "Оптимизация производительности",
      "Развертывание моделей в production",
    ],
    gradient: "from-accent to-cyber-pink",
  },
];

const LearningPaths = () => {
  return (
    <section className="py-20 px-4 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-neon bg-clip-text text-transparent">
              Программы обучения
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Выберите свой путь от новичка до эксперта
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {paths.map((path, index) => (
            <Card
              key={index}
              className="relative bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 overflow-hidden group"
            >
              {/* Gradient Header */}
              <div
                className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${path.gradient}`}
              />

              <CardHeader className="space-y-4 pt-8">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {path.level}
                    </div>
                    <CardTitle className="text-2xl">{path.title}</CardTitle>
                  </div>
                  <div className="text-sm text-primary font-semibold bg-primary/10 px-3 py-1 rounded-full">
                    {path.duration}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {path.modules.map((module, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">
                        {module}
                      </span>
                    </div>
                  ))}
                </div>

                {index === 0 ? (
                  <Link to="/courses/1-1" className="block">
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-primary/10 group-hover:border-primary"
                    >
                      Начать курс
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-primary/10 group-hover:border-primary"
                  >
                    Скоро доступно
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningPaths;
