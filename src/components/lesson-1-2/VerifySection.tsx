import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import SetupChecklist from "@/components/SetupChecklist";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

const CHECKLIST_ITEMS = [
  { id: "anaconda", label: "Anaconda установлена (conda --version работает)" },
  { id: "conda-env", label: "Среда mlagents создана (Python 3.10.12) и активируется" },
  { id: "pytorch", label: "PyTorch установлен, import torch работает, CUDA/MPS определяется" },
  { id: "unity", label: "Unity 6 (6000.x) установлен через Unity Hub" },
  { id: "git-clone", label: "Репозиторий ml-agents клонирован (ветка release_22)" },
  { id: "mlagents-pip", label: "ml-agents-envs и ml-agents установлены через pip install -e" },
  { id: "unity-package", label: "Unity-пакет com.unity.ml-agents подключён «с диска», сцена 3DBall работает" },
  { id: "vscode", label: "VS Code + расширения, интерпретатор mlagents выбран, ноутбук выполняется" },
  { id: "verify", label: "mlagents-learn --help выводит справку без ошибок" },
];

const COMMON_ERRORS = [
  {
    id: "python-ver",
    error: "ERROR: Package requires a different Python version",
    solution:
      "ML-Agents Release 22 работает только с Python 3.10.1–3.10.12. Пересоздайте среду с точной версией:",
    fix: "conda env remove -n mlagents\nconda create -n mlagents python=3.10.12",
  },
  {
    id: "module-not-found",
    error: "ModuleNotFoundError: No module named 'mlagents'",
    solution:
      "Скорее всего, conda-среда не активирована (или в VS Code выбран не тот интерпретатор). Активируйте её:",
    fix: "conda activate mlagents",
  },
  {
    id: "cuda-false",
    error: "torch.cuda.is_available() = False при наличии NVIDIA GPU",
    solution:
      "Либо установлена CPU-сборка PyTorch, либо драйвер NVIDIA устарел. Обновите драйвер (nvidia-smi) и переустановите PyTorch из CUDA-индекса:",
    fix: "pip3 install torch torchvision --index-url https://download.pytorch.org/whl/cu128 --force-reinstall",
  },
  {
    id: "numpy-protobuf",
    error: "pip понизил numpy / protobuf при установке ml-agents",
    solution:
      "Это штатное поведение: ML-Agents требует numpy<1.24 и protobuf<3.21. Не обновляйте их вручную — конфликт сломает mlagents-learn.",
    fix: "# Ничего делать не нужно — так и должно быть",
  },
  {
    id: "unity-version",
    error: "Unity-пакет ML-Agents не устанавливается / ошибки компиляции в редакторе",
    solution:
      "Ветка release_22 требует Unity 6000.0+. Проверьте версию редактора в Unity Hub и подключайте пакет строго «с диска» из клонированного репозитория:",
    fix: "Window → Package Manager → + → Add package from disk…\n→ ml-agents/com.unity.ml-agents/package.json",
  },
];

const VerifySection = () => (
  <div className="space-y-6">
    <p className="text-muted-foreground leading-relaxed">
      Контрольная проверка — все команды выполняются в активированной среде (
      <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">
        conda activate mlagents
      </code>
      ):
    </p>

    <CyberCodeBlock language="python" filename="terminal (mlagents)">
      {`python --version
# Python 3.10.12

python -c "import torch; print(torch.cuda.is_available())"
# True (NVIDIA) / False (CPU, Mac)

mlagents-learn --help
# справка ML-Agents без ошибок`}
    </CyberCodeBlock>

    <Card className="bg-green-500/5 border-green-500/20">
      <CardContent className="p-4 flex gap-3 items-start">
        <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          Если <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">mlagents-learn --help</code>{" "}
          выводит справку — окружение полностью готово. В следующих уроках мы запустим
          первое обучение агента 3DBall командой{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">
            mlagents-learn config/ppo/3DBall.yaml --run-id=first_run
          </code>{" "}
          и разберём, что происходит под капотом.
        </p>
      </CardContent>
    </Card>

    <SetupChecklist items={CHECKLIST_ITEMS} storageKey="lesson-1-2-checklist-v2" />

    <div>
      <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-destructive" />
        Типичные ошибки и решения
      </h3>
      <Accordion type="multiple" className="space-y-2">
        {COMMON_ERRORS.map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="border-destructive/20 rounded-lg overflow-hidden bg-card/30"
          >
            <AccordionTrigger className="px-4 text-sm hover:no-underline">
              <span className="flex items-center gap-2 text-left">
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
                <code className="font-mono text-xs text-destructive">{item.error}</code>
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <p className="text-sm text-muted-foreground mb-2">{item.solution}</p>
              <CyberCodeBlock language="pseudo" filename="fix">
                {item.fix}
              </CyberCodeBlock>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </div>
);

export default VerifySection;
