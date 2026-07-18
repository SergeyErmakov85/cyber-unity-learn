import { Card, CardContent } from "@/components/ui/card";
import { HardDrive } from "lucide-react";

const OS_REQUIREMENTS = [
  {
    os: "Windows 10/11",
    items: [
      "Windows 10 64-bit (21H2+) или Windows 11",
      "CPU x86-64, 4+ ядра, 8–16 ГБ RAM",
      "GPU NVIDIA с драйвером ≥ 570 (для CUDA, опционально)",
      "Git, PowerShell",
    ],
  },
  {
    os: "macOS (M1/M2/M3)",
    items: [
      "macOS 13 Ventura или новее",
      "Apple Silicon (arm64), 8–16 ГБ RAM",
      "GPU-ускорение через Metal (MPS), CUDA недоступна",
      "Git, Xcode Command Line Tools",
    ],
  },
  {
    os: "Linux (Ubuntu)",
    items: [
      "Ubuntu 22.04 LTS / 24.04 LTS",
      "CPU x86-64, 4+ ядра, 8–16 ГБ RAM",
      "GPU NVIDIA с драйвером ≥ 570 (для CUDA, опционально)",
      "Git, build-essential",
    ],
  },
];

const COMPAT_TABLE = [
  { component: "Anaconda", version: "последняя стабильная (Distribution 2024.x+)" },
  { component: "Python", version: "3.10.12 (диапазон 3.10.1–3.10.12), через conda" },
  { component: "PyTorch", version: "последняя стабильная 2.x (минимум 2.1.1), сборка CUDA 12.8 (cu128)" },
  { component: "Unity", version: "Unity 6 (6000.0 LTS или новее)" },
  { component: "ML-Agents", version: "Release 22 (ветка release_22, пакет mlagents 1.1.0)" },
  { component: "VS Code", version: "последняя стабильная + Python, Pylance, Jupyter" },
];

const RequirementsSection = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {OS_REQUIREMENTS.map((req) => (
        <Card key={req.os} className="bg-card/60 backdrop-blur-sm border border-cyan-500/10">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-bold text-foreground">{req.os}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {req.items.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>

    <Card className="bg-yellow-500/5 border-yellow-500/20">
      <CardContent className="p-4 flex gap-3 items-start">
        <HardDrive className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm text-yellow-400">Дисковое пространство</p>
          <p className="text-xs text-muted-foreground mt-1">
            Полная установка занимает ~15 ГБ: Anaconda (~5 ГБ), Unity (~3–5 ГБ), PyTorch с
            CUDA (~5 ГБ), репозиторий ML-Agents (~1 ГБ).
          </p>
        </div>
      </CardContent>
    </Card>

    <div>
      <h3 className="text-lg font-bold text-foreground mb-3">
        Таблица совместимости версий
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        <strong className="text-foreground">Ключевое ограничение:</strong> ML-Agents
        Release 22 жёстко требует Python ≥ 3.10.1 и ≤ 3.10.12 — Python 3.11+ не
        поддерживается. PyTorch требуется ≥ 2.1.1 без верхнего предела, поэтому ставим
        последнюю стабильную сборку с CUDA.
      </p>
      <div className="overflow-x-auto rounded-lg border border-cyan-500/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cyan-500/20 bg-muted/20">
              <th className="text-left p-3 font-semibold text-foreground">Компонент</th>
              <th className="text-left p-3 font-semibold text-foreground">Версия</th>
            </tr>
          </thead>
          <tbody>
            {COMPAT_TABLE.map((row) => (
              <tr key={row.component} className="border-b border-border/20 last:border-0">
                <td className="p-3 font-mono text-cyan-300 text-xs">{row.component}</td>
                <td className="p-3 text-muted-foreground">{row.version}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default RequirementsSection;
