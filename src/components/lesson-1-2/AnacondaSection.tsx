import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import { Lightbulb, ExternalLink } from "lucide-react";

const AnacondaSection = () => (
  <div className="space-y-6">
    <p className="text-muted-foreground leading-relaxed">
      Мы работаем через <strong className="text-foreground">Anaconda</strong> — дистрибутив
      Python с менеджером окружений conda. Это решает главную проблему урока одним
      инструментом: ML-Agents принимает только Python 3.10.x, и conda позволяет создать
      среду с точной версией 3.10.12, не трогая системный Python. Официальная документация
      ML-Agents рекомендует именно conda.
    </p>

    <Card className="bg-card/30 border-primary/20">
      <CardContent className="p-4 flex gap-3 items-start">
        <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          Если полный набор пакетов Anaconda (~5 ГБ) не нужен, можно установить лёгкий{" "}
          <strong className="text-foreground">Miniconda</strong> — все conda-команды урока
          идентичны. Ниже описана установка полной Anaconda Distribution.
        </p>
      </CardContent>
    </Card>

    <Tabs defaultValue="windows" className="w-full">
      <TabsList className="w-full sm:w-auto">
        <TabsTrigger value="windows">Windows</TabsTrigger>
        <TabsTrigger value="macos">macOS (M1/M2/M3)</TabsTrigger>
        <TabsTrigger value="linux">Linux (Ubuntu)</TabsTrigger>
      </TabsList>

      <TabsContent value="windows" className="space-y-4">
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
          <li>
            Скачайте установщик Anaconda Distribution для Windows (64-bit) с{" "}
            <a
              href="https://www.anaconda.com/download"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 hover:text-cyan-200 hover:underline"
            >
              anaconda.com/download
            </a>
            .
          </li>
          <li>
            Запустите <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">.exe</code>
            -установщик: <em>Just Me</em> → путь по умолчанию.
          </li>
          <li>
            На шаге <em>Advanced Options</em> оставьте настройки по умолчанию: галочку
            «Add Anaconda3 to my PATH» ставить <strong className="text-foreground">не нужно</strong>{" "}
            — работать будем через Anaconda Prompt.
          </li>
          <li>Откройте Anaconda Prompt из меню «Пуск» и проверьте установку.</li>
        </ol>
        <CyberCodeBlock language="python" filename="Anaconda Prompt">
          {`conda --version
# conda 24.x.x или новее`}
        </CyberCodeBlock>
        <p className="text-sm text-muted-foreground">
          Чтобы conda была доступна и в обычном PowerShell (и в терминале VS Code),
          выполните один раз:
        </p>
        <CyberCodeBlock language="python" filename="Anaconda Prompt">
          {`conda init powershell

# Если PowerShell после этого блокирует загрузку профиля:
# Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`}
        </CyberCodeBlock>
      </TabsContent>

      <TabsContent value="macos" className="space-y-4">
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
          <li>
            Скачайте установщик для{" "}
            <strong className="text-foreground">Apple Silicon</strong> (
            <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">.pkg</code>, arm64)
            с{" "}
            <a
              href="https://www.anaconda.com/download"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 hover:text-cyan-200 hover:underline"
            >
              anaconda.com/download
            </a>{" "}
            — не перепутайте с Intel-версией.
          </li>
          <li>
            Запустите <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">.pkg</code>{" "}
            и пройдите шаги установщика (путь по умолчанию —{" "}
            <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">~/anaconda3</code>).
          </li>
          <li>Откройте новый терминал и проверьте установку.</li>
        </ol>
        <CyberCodeBlock language="python" filename="Terminal (zsh)">
          {`conda --version

# Если команда не найдена — инициализируйте оболочку вручную:
# ~/anaconda3/bin/conda init zsh
# и перезапустите терминал`}
        </CyberCodeBlock>
      </TabsContent>

      <TabsContent value="linux" className="space-y-4">
        <CyberCodeBlock language="python" filename="Terminal (bash)">
          {`# Скачиваем установщик (актуальное имя файла — на anaconda.com/download)
wget https://repo.anaconda.com/archive/Anaconda3-2024.10-1-Linux-x86_64.sh
bash Anaconda3-2024.10-1-Linux-x86_64.sh`}
        </CyberCodeBlock>
        <p className="text-sm text-muted-foreground">
          В диалоге установщика: примите лицензию (
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">yes</code>),
          подтвердите путь{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">~/anaconda3</code>, на
          вопрос про инициализацию (<em>conda init</em>) ответьте{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">yes</code>. Затем
          перезапустите терминал:
        </p>
        <CyberCodeBlock language="python" filename="Terminal (bash)">
          {`conda --version

# Также убедитесь, что установлен git:
sudo apt update && sudo apt install -y git`}
        </CyberCodeBlock>
      </TabsContent>
    </Tabs>

    <a
      href="https://www.anaconda.com/download"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm text-cyan-300 hover:text-cyan-200 hover:underline"
    >
      <ExternalLink className="w-3.5 h-3.5" />
      Официальная страница загрузки Anaconda
    </a>
  </div>
);

export default AnacondaSection;
