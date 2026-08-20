import BlogLayout from "@/components/BlogLayout";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import { blogPosts } from "@/pages/Blog";
import { Link } from "react-router-dom";
import LabPracticeSection from "@/components/LabPracticeSection";

const post = blogPosts.find((p) => p.slug === "gridsensor-guide")!;

const toc = [
  { id: "what-is", title: "Что такое GridSensor" },
  { id: "tensor", title: "Структура данных: 4D тензор" },
  { id: "mistake", title: "Типичная ошибка в PyTorch" },
  { id: "config", title: "Пример конфигурации" },
  { id: "conclusion", title: "Итог" },
];

const BlogGridSensor = () => (
  <BlogLayout post={post} toc={toc}>
    <section id="what-is">
      <h2 className="text-2xl font-bold text-foreground mb-3">Что такое GridSensor</h2>
      <p className="text-muted-foreground leading-relaxed">
        <strong className="text-primary">GridSensor</strong> — это визуальный сенсор в Unity ML-Agents,
        который представляет окружение агента в виде сетки наблюдений. Вместо того чтобы передавать
        агенту «сырое» изображение (камера), GridSensor кодирует объекты в ячейках сетки через
        каналы (channels). Каждый канал отвечает за определённый тип информации: наличие еды,
        врагов, стен, союзников. Это значительно сокращает размер входных данных по сравнению
        с пиксельным вводом и делает обучение быстрее.
      </p>
      <p className="text-muted-foreground leading-relaxed mt-3">
        GridSensor создаёт 2D-сетку вокруг агента, где каждая ячейка может содержать информацию
        о нескольких свойствах объекта. Это похоже на «радар»: агент видит упрощённую карту
        своего окружения, но с точной числовой кодировкой.
      </p>
    </section>

    <section id="tensor">
      <h2 className="text-2xl font-bold text-foreground mb-3">Структура данных: 4D тензор</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        GridSensor генерирует данные в формате 4D-тензора. Понимание порядка осей критически
        важно для правильной обработки в PyTorch.
      </p>
      <CyberCodeBlock language="python" filename="gridsensor_tensor.py">
{`# Форма тензора GridSensor
# ML-Agents передаёт данные в формате: (batch, height, width, channels)
# Это формат NHWC (TensorFlow-style)

obs_shape = (batch_size, grid_height, grid_width, num_channels)
# Пример: (32, 20, 20, 4)
#   batch_size   = 32   — число параллельных агентов
#   grid_height  = 20   — высота сетки
#   grid_width   = 20   — ширина сетки
#   num_channels = 4    — каналы: [food, enemy, wall, empty]

# PyTorch CNN ожидает формат NCHW:
# (batch, channels, height, width) = (32, 4, 20, 20)
obs_pytorch = obs.permute(0, 3, 1, 2)  # NHWC → NCHW`}
      </CyberCodeBlock>
    </section>

    <section id="mistake">
      <h2 className="text-2xl font-bold text-foreground mb-3">Типичная ошибка в PyTorch</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Самая частая ошибка — передача данных в CNN без конвертации порядка каналов.
        ML-Agents использует формат <strong className="text-foreground">NHWC</strong>, а PyTorch
        ожидает <strong className="text-foreground">NCHW</strong>. Без permute сеть будет обучаться
        на «мусорных» данных, и вы получите нулевой прогресс без явных ошибок.
      </p>
      <CyberCodeBlock language="python" filename="gridsensor_fix.py">
{`import torch
import torch.nn as nn

class GridSensorCNN(nn.Module):
    def __init__(self, channels, grid_size, action_dim):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(channels, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d(1),
        )
        self.fc = nn.Linear(64, action_dim)

    def forward(self, obs):
        # ⚠️ КРИТИЧЕСКИ ВАЖНО: конвертируем NHWC → NCHW
        if obs.dim() == 4 and obs.shape[-1] < obs.shape[-2]:
            # Уже в формате NCHW — не трогаем
            x = obs
        else:
            # ML-Agents формат NHWC → PyTorch NCHW
            x = obs.permute(0, 3, 1, 2).contiguous()

        x = self.conv(x)
        x = x.view(x.size(0), -1)
        return self.fc(x)`}
      </CyberCodeBlock>
    </section>

    <section id="config">
      <h2 className="text-2xl font-bold text-foreground mb-3">Пример конфигурации</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Конфигурация GridSensor в YAML-файле ML-Agents. Обратите внимание на параметры
        <code className="text-primary"> GridSize</code>, <code className="text-primary"> CellScale</code> и
        <code className="text-primary"> DetectableTags</code>.
      </p>
      <CyberCodeBlock language="python" filename="gridsensor_config.yaml">
{`# Конфигурация GridSensor в Unity ML-Agents
behaviors:
  FoodCollector:
    trainer_type: ppo
    hyperparameters:
      batch_size: 128
      buffer_size: 2048
      learning_rate: 0.0003

    network_settings:
      normalize: true
      hidden_units: 256
      num_layers: 2
      vis_encode_type: simple  # CNN для визуальных наблюдений

    # GridSensor настройки (в Unity Inspector):
    # GridSize: [20, 20]       — размер сетки 20×20
    # CellScale: [1, 1, 1]    — масштаб ячейки
    # DetectableTags:
    #   - food               — канал 0
    #   - enemy              — канал 1
    #   - wall               — канал 2
    # ObservationStacks: 1   — число стеков (для velocity estimation)`}
      </CyberCodeBlock>
    </section>

    <section id="conclusion">
      <h2 className="text-2xl font-bold text-foreground mb-3">Итог</h2>
      <p className="text-muted-foreground leading-relaxed">
        GridSensor — мощный инструмент для задач, где агенту нужно «видеть» окружение,
        но полноценная камера избыточна. Главное — не забывать про конвертацию NHWC → NCHW
        при использовании PyTorch. Рекомендуем попрактиковаться на проекте{" "}
        <Link to="/unity-projects/food-collector" className="text-primary hover:underline">
          FoodCollector
        </Link>, где GridSensor используется по умолчанию.
      </p>
    </section>
  {/* Практика: собранная среда лаборатории для этой темы. */}
  <LabPracticeSection contextKey="/blog/gridsensor-guide" />

  </BlogLayout>
);

export default BlogGridSensor;
