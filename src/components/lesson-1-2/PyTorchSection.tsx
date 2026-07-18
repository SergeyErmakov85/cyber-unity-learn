import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { AlertTriangle, ExternalLink } from "lucide-react";

const PyTorchSection = () => (
  <div className="space-y-6">
    <p className="text-muted-foreground leading-relaxed">
      <CrossLinkToHub
        hubPath="/pytorch/cheatsheet"
        hubAnchor="setup"
        hubTitle="PyTorch — Установка"
      >
        PyTorch
      </CrossLinkToHub>{" "}
      — фреймворк глубокого обучения, на котором ML-Agents обучает нейросети. Ставим
      последнюю стабильную сборку 2.x: ML-Agents Release 22 требует{" "}
      <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">torch&gt;=2.1.1</code>{" "}
      без верхнего предела версии.
    </p>

    <Card className="bg-destructive/5 border-destructive/20">
      <CardContent className="p-4 flex gap-3 items-start">
        <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">
            PyTorch ставим до ML-Agents.
          </strong>{" "}
          Иначе pip на Windows подтянет CPU-версию по умолчанию, и обучение не будет
          использовать GPU. CUDA-runtime входит в состав pip-колеса — отдельно CUDA Toolkit
          устанавливать не нужно, достаточно свежего драйвера NVIDIA (проверить:{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">nvidia-smi</code>).
        </p>
      </CardContent>
    </Card>

    <Tabs defaultValue="cuda" className="w-full">
      <TabsList className="w-full sm:w-auto flex-wrap h-auto">
        <TabsTrigger value="cuda">Windows / Linux + NVIDIA GPU</TabsTrigger>
        <TabsTrigger value="cpu">Без GPU (CPU)</TabsTrigger>
        <TabsTrigger value="mps">macOS (M1/M2/M3)</TabsTrigger>
      </TabsList>

      <TabsContent value="cuda">
        <CyberCodeBlock language="python" filename="terminal (mlagents)">
          {`# Последняя стабильная сборка с CUDA 12.8
pip3 install torch torchvision --index-url https://download.pytorch.org/whl/cu128`}
        </CyberCodeBlock>
      </TabsContent>

      <TabsContent value="cpu">
        <CyberCodeBlock language="python" filename="terminal (mlagents)">
          {`# CPU-сборка — если нет дискретной NVIDIA GPU
pip3 install torch torchvision --index-url https://download.pytorch.org/whl/cpu`}
        </CyberCodeBlock>
      </TabsContent>

      <TabsContent value="mps" className="space-y-3">
        <p className="text-sm text-muted-foreground">
          На Apple Silicon CUDA недоступна; GPU-ускорение обеспечивает встроенный backend{" "}
          <strong className="text-foreground">MPS</strong> (Metal), он входит в стандартную
          сборку:
        </p>
        <CyberCodeBlock language="python" filename="terminal (mlagents)">
          {`pip3 install torch torchvision`}
        </CyberCodeBlock>
      </TabsContent>
    </Tabs>

    <div>
      <h3 className="text-lg font-bold text-foreground mb-3">Проверка установки</h3>
      <CyberCodeBlock language="python" filename="terminal (mlagents)">
        {`python -c "import torch; print(torch.__version__); print('CUDA:', torch.cuda.is_available())"

# Ожидаемый результат:
#   2.x.x
#   CUDA: True   — на машине с NVIDIA GPU
#   CUDA: False  — на CPU-сборке и на Mac (там проверяйте torch.backends.mps.is_available())`}
      </CyberCodeBlock>
      <p className="text-sm text-muted-foreground mt-3">
        Если <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">CUDA: False</code>{" "}
        при наличии видеокарты — обновите драйвер NVIDIA и переустановите пакет из
        cu128-индекса.
      </p>
    </div>

    <a
      href="https://pytorch.org/get-started/locally/"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm text-cyan-300 hover:text-cyan-200 hover:underline"
    >
      <ExternalLink className="w-3.5 h-3.5" />
      Официальный селектор установки PyTorch под вашу связку ОС/CUDA
    </a>
  </div>
);

export default PyTorchSection;
