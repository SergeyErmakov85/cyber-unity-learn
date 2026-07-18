import { Card, CardContent } from "@/components/ui/card";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import { AlertTriangle } from "lucide-react";

const CondaEnvSection = () => (
  <div className="space-y-6">
    <p className="text-muted-foreground leading-relaxed">
      Все Python-пакеты курса живут в изолированной conda-среде{" "}
      <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">mlagents</code> — это
      гарантирует воспроизводимость и нужную версию Python 3.10.12 независимо от системного
      Python. Сначала создадим рабочую папку курса:
    </p>

    <CyberCodeBlock language="python" filename="Windows (Anaconda Prompt)">
      {`mkdir C:\\rl-course
cd C:\\rl-course`}
    </CyberCodeBlock>

    <CyberCodeBlock language="python" filename="macOS / Linux">
      {`mkdir ~/rl-course && cd ~/rl-course`}
    </CyberCodeBlock>

    <p className="text-muted-foreground leading-relaxed">
      Дальше команды одинаковы для всех ОС — conda сама скачает Python 3.10.12 в среду:
    </p>

    <CyberCodeBlock language="python" filename="terminal">
      {`conda create -n mlagents python=3.10.12
conda activate mlagents

# Проверяем версию и обновляем базовые инструменты
python --version
# Python 3.10.12
python -m pip install --upgrade pip setuptools wheel`}
    </CyberCodeBlock>

    <Card className="bg-yellow-500/5 border-yellow-500/20">
      <CardContent className="p-4 flex gap-3 items-start">
        <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          После активации в начале строки терминала появится{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">(mlagents)</code>.{" "}
          <strong className="text-foreground">
            Все дальнейшие pip- и mlagents-команды урока выполняются только внутри
            активированной среды
          </strong>{" "}
          — при каждом новом сеансе терминала не забывайте{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">
            conda activate mlagents
          </code>
          .
        </p>
      </CardContent>
    </Card>

    <div>
      <h3 className="text-lg font-bold text-foreground mb-3">
        Полезные conda-команды на будущее
      </h3>
      <CyberCodeBlock language="python" filename="terminal">
        {`conda deactivate            # выйти из среды
conda env list              # список всех сред
conda env remove -n mlagents  # удалить среду и начать с чистого листа`}
      </CyberCodeBlock>
    </div>
  </div>
);

export default CondaEnvSection;
