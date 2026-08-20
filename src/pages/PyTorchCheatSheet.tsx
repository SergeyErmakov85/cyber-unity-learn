import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Box, Zap, Brain, Database, RotateCw, Eye, Save, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import HubLessonBadges from "@/components/HubLessonBadges";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import LabPracticeSection from "@/components/LabPracticeSection";

const PyTorchCheatSheet = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/pytorch")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к PyTorch
          </Button>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">Шпаргалка</span>
        </div>
      </div>

      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="bg-gradient-neon bg-clip-text text-transparent">
            PyTorch: Шпаргалка по Нейронным Сетям
          </span>
        </h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Исчерпывающее руководство от базовых операций с тензорами до полного цикла обучения нейронной сети
        </p>

        {/* Table of Contents */}
        <div className="mb-12 p-4 rounded-lg bg-card/60 border border-primary/20">
          <h3 className="text-sm font-semibold text-primary mb-3">Содержание</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
            <li><a href="#setup" className="hover:text-primary transition-colors">Импорт и Настройка</a></li>
            <li><a href="#tensors" className="hover:text-primary transition-colors">Тензоры: Основы</a></li>
            <li><a href="#autograd" className="hover:text-primary transition-colors">Autograd (Автодифференцирование)</a></li>
            <li><a href="#nn" className="hover:text-primary transition-colors">Нейронные сети (torch.nn)</a></li>
            <li><a href="#data" className="hover:text-primary transition-colors">Работа с данными (Dataset & DataLoader)</a></li>
            <li><a href="#training" className="hover:text-primary transition-colors">Цикл обучения — Шаблон</a></li>
            <li><a href="#inference" className="hover:text-primary transition-colors">Инференс и Валидация</a></li>
            <li><a href="#saving" className="hover:text-primary transition-colors">Сохранение и Загрузка</a></li>
            <li><a href="#utils" className="hover:text-primary transition-colors">Полезные утилиты</a></li>
          </ol>
        </div>

        {/* Section 1: Setup */}
        <Section id="setup" icon={<Package className="w-5 h-5 text-primary" />} title="1. Импорт и Настройка (Setup)">
          <HubLessonBadges hubPath="/pytorch/cheatsheet" hubAnchor="setup" />
          <p>Стандартные импорты, необходимые для начала работы с PyTorch.</p>
          <CyberCodeBlock language="python" filename="setup.py">{`import torch
import torch.nn as nn                   # Слои нейросетей, функции потерь
import torch.optim as optim             # Оптимизаторы (SGD, Adam и т.д.)
import torch.nn.functional as F         # Функциональный API (активации без состояния и т.д.)
from torch.utils.data import Dataset, DataLoader # Работа с данными

# Определение устройства (GPU / Apple MPS / CPU)
device = torch.device(
    "cuda" if torch.cuda.is_available()
    else "mps" if torch.backends.mps.is_available()
    else "cpu"
)
print(f"Using device: {device}")`}</CyberCodeBlock>

          <InfoBox color="primary" title="💡 Совет">
            <p className="text-sm">
              Всегда определяйте <code className="text-foreground">device</code> в начале скрипта и переносите на него модель и данные. Это позволяет коду работать на любом оборудовании без изменений.
            </p>
          </InfoBox>
        </Section>

        {/* Section 2: Tensors */}
        <Section id="tensors" icon={<Box className="w-5 h-5 text-secondary" />} title="2. Тензоры (Tensors): Основы">
          <HubLessonBadges hubPath="/pytorch/cheatsheet" hubAnchor="tensors" />
          <p>Тензоры — это многомерные матрицы, аналог <code className="text-foreground">ndarray</code> из NumPy, но с поддержкой GPU (практика — <CrossLinkToLesson lessonId="1-2" lessonPath="/courses/1-2" lessonTitle="Установка окружения: PyTorch + Unity ML-Agents" lessonLevel={1} />).</p>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">Создание</h3>
          <CyberCodeBlock language="python" filename="tensors_create.py">{`x = torch.tensor([1, 2, 3])         # Из списка
x = torch.randn((2, 3))             # Случайные числа (нормальное распр.)
x = torch.zeros((2, 3))             # Нули
x = torch.ones((2, 3))              # Единицы
x = torch.arange(0, 10, step=2)     # Аналог range: [0, 2, 4, 6, 8]
x = torch.linspace(0, 1, steps=5)   # 5 точек от 0 до 1 включительно`}</CyberCodeBlock>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">Свойства и типы</h3>
          <CyberCodeBlock language="python" filename="tensors_props.py">{`x.shape             # Размерность (например, torch.Size([2, 3]))
x.dtype             # Тип данных (float32, int64 и т.д.)
x.device            # Где находится тензор (cpu, cuda:0)

# Приведение типов
x = x.float()       # float32
x = x.long()        # int64 (нужно для индексов/меток классов)
x = x.to(device)    # Перенос на GPU/CPU`}</CyberCodeBlock>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">Манипуляции с формой (Reshaping)</h3>
          <CyberCodeBlock language="python" filename="tensors_reshape.py">{`x.view(6)           # Изменение формы (memory sharing, требует contiguous)
x.reshape(2, 3)     # Безопасное изменение формы (может копировать данные)
x.permute(1, 0)     # Транспонирование / смена осей
x.squeeze(0)        # Удаляет размерность 1 (напр., [1, 28, 28] -> [28, 28])
x.unsqueeze(0)      # Добавляет размерность (напр., [28, 28] -> [1, 28, 28])
x.flatten()         # Выпрямляет тензор в 1D вектор`}</CyberCodeBlock>

          <InfoBox color="secondary" title="view() vs reshape()">
            <p className="text-sm">
              <code className="text-foreground">view()</code> работает только с contiguous-тензорами (разделяет память с оригиналом — быстрее). 
              <code className="text-foreground">reshape()</code> работает всегда, но может создавать копию данных. Если не уверены — используйте <code className="text-foreground">reshape()</code>.
            </p>
          </InfoBox>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">Математика</h3>
          <CyberCodeBlock language="python" filename="tensors_math.py">{`z = x + y           # Поэлементное сложение
z = x * y           # Поэлементное умножение
z = x @ y           # Матричное умножение (Dot product)
z = torch.matmul(x, y) # То же самое, что и @
val = x.item()      # Получить Python число (только для скаляров)
arr = x.numpy()     # Конвертация в NumPy (нужен .cpu() и .detach() если есть градиенты)`}</CyberCodeBlock>
        </Section>

        {/* Section 3: Autograd */}
        <Section id="autograd" icon={<Zap className="w-5 h-5 text-accent" />} title="3. Autograd (Автоматическое дифференцирование)">
          <HubLessonBadges hubPath="/pytorch/cheatsheet" hubAnchor="autograd" />
          <p>
            Ключевой механизм PyTorch для обратного распространения ошибки (Backpropagation). 
            При каждой операции с тензором, у которого <code className="text-foreground">requires_grad=True</code>, 
            PyTorch строит вычислительный граф и автоматически рассчитывает градиенты (Policy Gradient — <CrossLinkToLesson lessonId="2-1" lessonPath="/courses/2-1" lessonTitle="Policy Gradient и REINFORCE" lessonLevel={2} />).
          </p>
          <CyberCodeBlock language="python" filename="autograd.py">{`x = torch.tensor([2.0], requires_grad=True) # Включаем слежение за градиентами
y = x ** 2 + 5    # y = x² + 5
z = y * 3          # z = 3(x² + 5)

z.backward()        # Вычисляет градиенты (dz/dx)
print(x.grad)       # Вывод градиента: dz/dx = 6x = 12.0

# Отключение градиентов (для инференса/валидации)
with torch.no_grad():
    res = model(input_data)
    # Градиенты не вычисляются — экономия памяти и ускорение`}</CyberCodeBlock>

          <InfoBox color="accent" title="⚠️ Важно: накопление градиентов">
            <p className="text-sm">
              PyTorch по умолчанию <strong className="text-foreground">накапливает</strong> градиенты при повторных вызовах <code className="text-foreground">.backward()</code>. 
              Именно поэтому в цикле обучения обязательно вызывать <code className="text-foreground">optimizer.zero_grad()</code> перед каждым шагом.
            </p>
          </InfoBox>
        </Section>

        {/* Section 4: Neural Networks */}
        <Section id="nn" icon={<Brain className="w-5 h-5 text-primary" />} title="4. Нейронные сети (torch.nn)">
          <HubLessonBadges hubPath="/pytorch/cheatsheet" hubAnchor="nn" />
          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Создание модели</h3>
          <p>Все модели наследуются от <code className="text-foreground">nn.Module</code>. Необходимо определить слои в <code className="text-foreground">__init__</code> и прямой проход в <code className="text-foreground">forward</code> (ваша первая сеть — <CrossLinkToLesson lessonId="1-4" lessonPath="/courses/1-4" lessonTitle="CartPole — твой первый RL-агент" lessonLevel={1} />) (Actor-Critic — <CrossLinkToLesson lessonId="2-3" lessonPath="/courses/2-3" lessonTitle="Actor-Critic и непрерывные действия" lessonLevel={2} />).</p>
          <CyberCodeBlock language="python" filename="model.py">{`class MyClassifier(nn.Module):
    def __init__(self, input_size, num_classes):
        super(MyClassifier, self).__init__()
        # Определение слоев
        self.fc1 = nn.Linear(input_size, 64)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(p=0.5) # Отключение нейронов с вероятностью 50%
        self.fc2 = nn.Linear(64, num_classes)

    def forward(self, x):
        # Определение прямого прохода
        x = self.fc1(x)
        x = self.relu(x)
        x = self.dropout(x)
        x = self.fc2(x)
        return x # Обычно возвращаются логиты (logits)

model = MyClassifier(input_size=784, num_classes=10).to(device)`}</CyberCodeBlock>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">Популярные слои</h3>
          <div className="my-4 overflow-x-auto">
            <table className="w-full text-sm border border-border/30 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-card/60">
                  <th className="text-left p-3 text-foreground font-semibold border-b border-border/30">Слой</th>
                  <th className="text-left p-3 text-foreground font-semibold border-b border-border/30">Описание</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/20"><td className="p-3 font-mono text-xs"><code>nn.Linear(in, out)</code></td><td className="p-3">Полносвязный слой</td></tr>
                <tr className="border-b border-border/20"><td className="p-3 font-mono text-xs"><code>nn.Conv2d(in_ch, out_ch, kernel)</code></td><td className="p-3">Сверточный слой (для изображений)</td></tr>
                <tr className="border-b border-border/20"><td className="p-3 font-mono text-xs"><code>nn.MaxPool2d(kernel_size)</code></td><td className="p-3">Пулинг (уменьшение размерности)</td></tr>
                <tr className="border-b border-border/20"><td className="p-3 font-mono text-xs"><code>nn.BatchNorm2d(num_features)</code></td><td className="p-3">Пакетная нормализация</td></tr>
                <tr className="border-b border-border/20"><td className="p-3 font-mono text-xs"><code>nn.LSTM(in, hidden, layers)</code></td><td className="p-3">Рекуррентный слой (LSTM)</td></tr>
                <tr><td className="p-3 font-mono text-xs"><code>nn.Embedding(vocab, dim)</code></td><td className="p-3">Слой эмбеддингов (для NLP)</td></tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">Функции потерь (Loss Functions)</h3>
          <div className="my-4 overflow-x-auto">
            <table className="w-full text-sm border border-border/30 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-card/60">
                  <th className="text-left p-3 text-foreground font-semibold border-b border-border/30">Функция</th>
                  <th className="text-left p-3 text-foreground font-semibold border-b border-border/30">Использование</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/20"><td className="p-3 font-mono text-xs"><code>nn.MSELoss()</code></td><td className="p-3">Регрессия (среднеквадратичная ошибка)</td></tr>
                <tr className="border-b border-border/20"><td className="p-3 font-mono text-xs"><code>nn.CrossEntropyLoss()</code></td><td className="p-3">Классификация (включает Softmax!)</td></tr>
                <tr><td className="p-3 font-mono text-xs"><code>nn.BCEWithLogitsLoss()</code></td><td className="p-3">Бинарная классификация</td></tr>
              </tbody>
            </table>
          </div>

          <InfoBox color="primary" title="⚠️ CrossEntropyLoss включает Softmax">
            <p className="text-sm">
              Не добавляйте <code className="text-foreground">nn.Softmax()</code> в конец модели, если используете <code className="text-foreground">nn.CrossEntropyLoss()</code> — 
              он уже применяет LogSoftmax внутри. Модель должна возвращать сырые логиты.
            </p>
          </InfoBox>

          <p className="text-sm text-muted-foreground mt-2">(Actor-Critic архитектура — <CrossLinkToLesson lessonId="2-3" lessonPath="/courses/2-3" lessonTitle="Actor-Critic и A2C" lessonLevel={2} />)</p>
          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">Оптимизаторы (Optimizers)</h3>
          <CyberCodeBlock language="python" filename="optimizers.py">{`# Стохастический градиентный спуск с momentum
optimizer = optim.SGD(model.parameters(), lr=0.01, momentum=0.9)

# Adam — адаптивный оптимизатор (рекомендуется как стандарт)
optimizer = optim.Adam(model.parameters(), lr=0.001)

# AdamW — Adam с правильной регуляризацией весов
optimizer = optim.AdamW(model.parameters(), lr=0.001, weight_decay=0.01)`}</CyberCodeBlock>
        </Section>

        {/* Section 5: Data */}
        <Section id="data" icon={<Database className="w-5 h-5 text-secondary" />} title="5. Работа с данными (Dataset & DataLoader)">
          <p>
            PyTorch разделяет <strong className="text-foreground">хранение данных</strong> (<code className="text-foreground">Dataset</code>) и их 
            <strong className="text-foreground"> загрузку/батчинг</strong> (<code className="text-foreground">DataLoader</code>).
          </p>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">Кастомный Dataset</h3>
          <CyberCodeBlock language="python" filename="dataset.py">{`class CustomDataset(Dataset):
    def __init__(self, data, labels):
        self.data = data
        self.labels = labels

    def __len__(self):
        return len(self.data) # Общее количество образцов

    def __getitem__(self, idx):
        # Возвращает один образец и метку
        return self.data[idx], self.labels[idx]

dataset = CustomDataset(train_x, train_y)`}</CyberCodeBlock>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">DataLoader</h3>
          <CyberCodeBlock language="python" filename="dataloader.py">{`dataloader = DataLoader(
    dataset,
    batch_size=32,      # Размер батча
    shuffle=True,       # Перемешивать данные каждую эпоху
    num_workers=2,      # Количество процессов для загрузки
    pin_memory=True     # Ускоряет перенос на GPU
)`}</CyberCodeBlock>

          <InfoBox color="secondary" title="💡 pin_memory">
            <p className="text-sm">
              Параметр <code className="text-foreground">pin_memory=True</code> выделяет память в page-locked (pinned) области RAM, 
              что значительно ускоряет передачу данных из CPU в GPU. Используйте его, если тренируете на GPU.
            </p>
          </InfoBox>
        </Section>

        {/* Section 6: Training Loop */}
        <Section id="training" icon={<RotateCw className="w-5 h-5 text-accent" />} title="6. Цикл обучения (Training Loop) — Шаблон">
          <HubLessonBadges hubPath="/pytorch/cheatsheet" hubAnchor="training" />
          <p>Стандартный шаблон обучения (boilerplate), который используется в большинстве проектов на PyTorch (DQN loop — <CrossLinkToLesson lessonId="1-5" lessonPath="/courses/1-5" lessonTitle="DQN с нуля на PyTorch" lessonLevel={1} />).</p>
          <CyberCodeBlock language="python" filename="train.py">{`# Гиперпараметры
epochs = 10
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# Цикл по эпохам
for epoch in range(epochs):
    model.train()  # Режим обучения (важно для Dropout/BatchNorm)
    running_loss = 0.0

    for inputs, labels in dataloader:
        # 1. Перенос данных на устройство (GPU/CPU)
        inputs, labels = inputs.to(device), labels.to(device)

        # 2. Обнуление градиентов
        optimizer.zero_grad()

        # 3. Прямой проход (Forward pass)
        outputs = model(inputs)

        # 4. Вычисление ошибки
        loss = criterion(outputs, labels)

        # 5. Обратное распространение (Backward pass)
        loss.backward()

        # 6. Шаг оптимизатора (обновление весов)
        optimizer.step()

        running_loss += loss.item()

    avg_loss = running_loss / len(dataloader)
    print(f"Epoch {epoch+1}/{epochs}, Loss: {avg_loss:.4f}")`}</CyberCodeBlock>

          <InfoBox color="accent" title="Порядок операций — запомните!">
            <p className="text-sm">
              Порядок всегда один и тот же: <code className="text-foreground">zero_grad() → forward → loss → backward → step</code>. 
              Нарушение порядка приведёт к некорректному обучению.
            </p>
          </InfoBox>
        </Section>

        {/* Section 7: Inference */}
        <Section id="inference" icon={<Eye className="w-5 h-5 text-primary" />} title="7. Инференс и Валидация">
          <p>Как проверять модель без обучения — при валидации и в production.</p>
          <CyberCodeBlock language="python" filename="eval.py">{`model.eval() # Режим оценки (выключает Dropout, фиксирует BatchNorm)

correct = 0
total = 0

with torch.no_grad(): # Отключаем расчет градиентов для экономии памяти
    for inputs, labels in val_loader:
        inputs, labels = inputs.to(device), labels.to(device)
        outputs = model(inputs)

        # Получение предсказаний (класс с макс. вероятностью)
        _, predicted = torch.max(outputs.data, 1)

        total += labels.size(0)
        correct += (predicted == labels).sum().item()

accuracy = 100 * correct / total
print(f'Accuracy: {accuracy:.2f}%')`}</CyberCodeBlock>

          <InfoBox color="primary" title="model.train() vs model.eval()">
            <p className="text-sm">
              <code className="text-foreground">model.train()</code> — включает Dropout и BatchNorm в режиме обучения. <br />
              <code className="text-foreground">model.eval()</code> — отключает Dropout, BatchNorm использует скользящее среднее. <br />
              <strong className="text-foreground">Всегда</strong> переключайте режим перед обучением/инференсом!
            </p>
          </InfoBox>
        </Section>

        {/* Section 8: Saving & Loading */}
        <Section id="saving" icon={<Save className="w-5 h-5 text-secondary" />} title="8. Сохранение и Загрузка (Saving & Loading)">
          <HubLessonBadges hubPath="/pytorch/cheatsheet" hubAnchor="saving" />
          <p>Рекомендуемый способ — сохранять только веса (<code className="text-foreground">state_dict</code>), а не модель целиком (ONNX деплой — <CrossLinkToLesson lessonId="3-5" lessonPath="/courses/3-5" lessonTitle="ONNX-экспорт и деплой в Unity" lessonLevel={3} />).</p>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">Сохранение</h3>
          <CyberCodeBlock language="python" filename="save.py">{`# Сохранить только веса (рекомендуется)
torch.save(model.state_dict(), 'model_weights.pth')

# Сохранить модель целиком (может ломаться при рефакторинге)
torch.save(model, 'full_model.pth')

# Сохранить чекпоинт (веса + состояние оптимизатора + эпоха)
checkpoint = {
    'epoch': epoch,
    'model_state_dict': model.state_dict(),
    'optimizer_state_dict': optimizer.state_dict(),
    'loss': loss,
}
torch.save(checkpoint, 'checkpoint.pth')`}</CyberCodeBlock>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">Загрузка</h3>
          <CyberCodeBlock language="python" filename="load.py">{`# Загрузка весов
model = MyClassifier(...)  # Сначала создайте экземпляр архитектуры!
model.load_state_dict(torch.load('model_weights.pth', map_location=device))
model.to(device)
model.eval()  # Не забудьте переключить в eval!

# Загрузка чекпоинта (для продолжения обучения)
checkpoint = torch.load('checkpoint.pth', map_location=device)
model.load_state_dict(checkpoint['model_state_dict'])
optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
start_epoch = checkpoint['epoch']`}</CyberCodeBlock>

          <InfoBox color="secondary" title="💡 map_location">
            <p className="text-sm">
              Используйте <code className="text-foreground">map_location=device</code> при загрузке, чтобы модель корректно загрузилась 
              на текущее устройство (например, если модель была сохранена на GPU, а загружается на CPU).
            </p>
          </InfoBox>
          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3" id="onnx-export">ONNX-экспорт</h3>
          <HubLessonBadges hubPath="/pytorch/cheatsheet" hubAnchor="onnx-export" />
          <p>Экспорт модели в формат ONNX для использования вне PyTorch (Unity Sentis, TensorRT, ONNX Runtime) (экспорт для Unity — <CrossLinkToLesson lessonId="3-5" lessonPath="/courses/3-5" lessonTitle="ONNX-экспорт и деплой в Unity" lessonLevel={3} />).</p>

          <CyberCodeBlock language="python" filename="onnx_export.py">{`import torch

model = PolicyNetwork(obs_size=33, action_size=4)
model.load_state_dict(torch.load("ppo_agent.pt"))
model.eval()

dummy_input = torch.randn(1, 33)
torch.onnx.export(
    model, dummy_input, "agent.onnx",
    input_names=["obs"], output_names=["action"],
    opset_version=11
)`}</CyberCodeBlock>

          <InfoBox color="secondary" title="⚙️ opset_version и верификация">
            <p className="text-sm">
              Используйте <code className="text-foreground">opset_version=11</code> для совместимости с Unity Sentis.
              После экспорта проверьте модель через <code className="text-foreground">onnx.checker.check_model("agent.onnx")</code> —
              это выявит несовместимые операции до деплоя.
            </p>
          </InfoBox>
        </Section>

        {/* Section 9: Utilities */}
        <Section id="utils" icon={<Wrench className="w-5 h-5 text-accent" />} title="9. Полезные утилиты">

          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Learning Rate Scheduler</h3>
          <p>Изменение скорости обучения на лету для лучшей сходимости.</p>
          <CyberCodeBlock language="python" filename="scheduler.py">{`# Уменьшать lr в 10 раз каждые 5 эпох
scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=5, gamma=0.1)

# Cosine Annealing — плавное уменьшение lr
scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=50)

# ReduceOnPlateau — уменьшать lr если метрика не улучшается
scheduler = optim.lr_scheduler.ReduceLROnPlateau(
    optimizer, mode='min', factor=0.1, patience=5
)

# Вызывать каждую эпоху:
scheduler.step()           # Для StepLR, CosineAnnealing
scheduler.step(val_loss)   # Для ReduceOnPlateau`}</CyberCodeBlock>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">Gradient Clipping</h3>
          <p>Предотвращение взрыва градиентов (часто нужно в RNN/LSTM).</p>
          <CyberCodeBlock language="python" filename="grad_clip.py">{`# Обрезка по норме (наиболее распространённый метод)
torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)

# Обрезка по значению
torch.nn.utils.clip_grad_value_(model.parameters(), clip_value=0.5)

# Вызывать ПОСЛЕ loss.backward() и ДО optimizer.step()`}</CyberCodeBlock>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">Просмотр структуры модели</h3>
          <CyberCodeBlock language="python" filename="inspect.py">{`# Вывод архитектуры модели
print(model)

# Перебор параметров с именами
for name, param in model.named_parameters():
    if param.requires_grad:
        print(f"{name}: {param.shape}")

# Общее количество обучаемых параметров
total_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
print(f"Total trainable params: {total_params:,}")`}</CyberCodeBlock>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">Воспроизводимость (Reproducibility)</h3>
          <CyberCodeBlock language="python" filename="seed.py">{`# Фиксация seed для воспроизводимости результатов
import random
import numpy as np

seed = 42
torch.manual_seed(seed)
torch.cuda.manual_seed_all(seed)
np.random.seed(seed)
random.seed(seed)
torch.backends.cudnn.deterministic = True
torch.backends.cudnn.benchmark = False`}</CyberCodeBlock>
        </Section>

        {/* Back */}
        <div className="mt-16 flex justify-center gap-4">
          <Button variant="outline" onClick={() => navigate("/pytorch")} className="border-primary/50 text-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            DQN на PyTorch
          </Button>
          <Button variant="outline" onClick={() => navigate("/")} className="border-primary/50 text-primary">
            На главную
          </Button>
        </div>
      {/* Практика: собранная среда лаборатории для этой темы. */}
      <LabPracticeSection contextKey="/pytorch/cheatsheet" />

      </article>
    </div>
  );
};

const Section = ({ id, icon, title, children }: { id: string; icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <section id={id} className="mt-12 first:mt-0 scroll-mt-20">
    <div className="flex items-center gap-3 mb-6">
      {icon}
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
    </div>
    <div className="text-muted-foreground leading-relaxed space-y-3">{children}</div>
  </section>
);

const InfoBox = ({ color, title, children }: { color: "primary" | "secondary" | "accent"; title: string; children: React.ReactNode }) => {
  const borderColor = color === "primary" ? "border-primary/30" : color === "secondary" ? "border-secondary/30" : "border-accent/30";
  const titleColor = color === "primary" ? "text-primary" : color === "secondary" ? "text-secondary" : "text-accent";
  return (
    <div className={`my-4 p-4 rounded-lg bg-card/60 border ${borderColor}`}>
      <p className={`font-semibold ${titleColor} text-sm mb-2`}>{title}</p>
      {children}
    </div>
  );
};

export default PyTorchCheatSheet;
