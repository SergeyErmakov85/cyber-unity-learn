import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, TrendingUp, Bot, Target } from "lucide-react";
import demoVideoAsset from "@/assets/videos/demo-unity-agent.mp4.asset.json";
import demoPosterAsset from "@/assets/videos/demo-unity-agent-poster.jpg.asset.json";
const DEMO_VIDEO_SRC = demoVideoAsset.url;
const DEMO_POSTER_SRC = demoPosterAsset.url;
const BALL_BALANCE_VIDEO_SRC = "/videos/ball-balance.mp4";
const BALL_BALANCE_POSTER_SRC = "/videos/ball-balance-poster.jpg";

const DemoSection = () => {
  return (
    <section id="demo" className="py-20 px-4 relative bg-cyber-darker/50">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold">
            <span className="text-foreground">Посмотрите </span>
            <span className="bg-gradient-neon bg-clip-text text-transparent">
              в действии
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Наблюдайте, как агенты обучаются решать задачи в Unity-окружениях
          </p>
        </div>

        {/* Ball Balance — запись обучения агента */}
        <Card className="mb-16 max-w-6xl mx-auto bg-card/60 backdrop-blur-sm border-primary/30 overflow-hidden">
          <CardContent className="p-0">
            <div className="relative w-full aspect-[1094/286] bg-gradient-to-br from-cyber-dark via-cyber-darker to-cyber-dark">
              <video
                src={BALL_BALANCE_VIDEO_SRC}
                poster={BALL_BALANCE_POSTER_SRC}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-label="Запись обучения агента в окружении Ball Balance"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-sm border border-border/50">
                <span className="text-xs text-muted-foreground">Ball Balance</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Demo Video */}
          <Card className="bg-card/60 backdrop-blur-sm border-primary/30 overflow-hidden">
            <CardContent className="p-0 h-full">
              <div className="relative h-full min-h-[320px] overflow-hidden bg-gradient-to-br from-cyber-dark via-cyber-darker to-cyber-dark">
                <video
                  src={DEMO_VIDEO_SRC}
                  poster={DEMO_POSTER_SRC}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-sm border border-border/50">
                  <span className="text-xs text-muted-foreground">Demo</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Training Metrics */}
          <div className="space-y-4">
            {/* Reward Graph Placeholder */}
            <Card className="bg-card/60 backdrop-blur-sm border-secondary/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                  <h3 className="font-semibold text-foreground">График вознаграждения</h3>
                </div>
                <div className="h-32 bg-gradient-to-br from-cyber-dark to-cyber-darker rounded-lg flex items-end justify-around p-4 gap-1">
                  {/* Simulated bar chart */}
                  {[20, 35, 30, 45, 55, 50, 70, 65, 80, 85, 90, 95].map((height, i) => (
                    <div
                      key={i}
                      className="w-full bg-gradient-to-t from-secondary/60 to-secondary rounded-t transition-all duration-300 hover:from-secondary/80"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Рост награды в процессе обучения (эпизоды)
                </p>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-card/60 backdrop-blur-sm border-accent/30">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">1M+</div>
                    <div className="text-xs text-muted-foreground">Шагов обучения</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/60 backdrop-blur-sm border-primary/30">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">95%</div>
                    <div className="text-xs text-muted-foreground">Точность агента</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/demo-project">
            <Button size="lg" variant="outline" className="group transition-all duration-500 hover:bg-secondary/30 hover:text-secondary-foreground hover:border-secondary/50">
              <Play className="w-4 h-4 mr-2" />
              Перейти к проекту
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
