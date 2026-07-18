import CyberCodeBlock from "@/components/CyberCodeBlock";
import { ExternalLink } from "lucide-react";

const EXTENSIONS = [
  { id: "ms-python.python", name: "Python", note: "интерпретаторы, отладка, запуск" },
  { id: "ms-python.vscode-pylance", name: "Pylance", note: "ставится вместе с Python" },
  { id: "ms-toolsai.jupyter", name: "Jupyter", note: "ноутбуки прямо в VS Code" },
];

const VSCodeSection = () => (
  <div className="space-y-6">
    <p className="text-muted-foreground leading-relaxed">
      Дальнейшая работа в курсе организована в VS Code с Jupyter-ноутбуками.
    </p>

    <div>
      <h3 className="text-lg font-bold text-foreground mb-3">Установка и расширения</h3>
      <p className="text-sm text-muted-foreground mb-3">
        Установите{" "}
        <a
          href="https://code.visualstudio.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-300 hover:text-cyan-200 hover:underline"
        >
          VS Code
        </a>
        , затем расширения (Ctrl+Shift+X):
      </p>
      <div className="overflow-x-auto rounded-lg border border-cyan-500/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cyan-500/20 bg-muted/20">
              <th className="text-left p-3 font-semibold text-foreground">Расширение</th>
              <th className="text-left p-3 font-semibold text-foreground">ID</th>
              <th className="text-left p-3 font-semibold text-foreground">Зачем</th>
            </tr>
          </thead>
          <tbody>
            {EXTENSIONS.map((ext) => (
              <tr key={ext.id} className="border-b border-border/20 last:border-0">
                <td className="p-3 text-foreground font-medium">{ext.name}</td>
                <td className="p-3 font-mono text-cyan-300 text-xs">{ext.id}</td>
                <td className="p-3 text-muted-foreground">{ext.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div>
      <h3 className="text-lg font-bold text-foreground mb-3">
        Подключение conda-среды
      </h3>
      <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
        <li>
          Откройте папку курса: <em>File → Open Folder…</em> →{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">rl-course</code>.
        </li>
        <li>
          Ctrl+Shift+P → <strong className="text-foreground">Python: Select Interpreter</strong>{" "}
          → выберите{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">
            Python 3.10.12 ('mlagents')
          </code>{" "}
          — VS Code автоматически находит conda-среды в списке.
        </li>
        <li>Добавьте ядро Jupyter в среду (в терминале с активированной mlagents):</li>
      </ol>
      <div className="mt-3">
        <CyberCodeBlock language="python" filename="terminal (mlagents)">
          {`pip install ipykernel`}
        </CyberCodeBlock>
      </div>
    </div>

    <div>
      <h3 className="text-lg font-bold text-foreground mb-3">Проверка ноутбука</h3>
      <p className="text-sm text-muted-foreground mb-3">
        Создайте файл{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">check_env.ipynb</code>{" "}
        (Ctrl+Shift+P → <em>Create: New Jupyter Notebook</em>), в правом верхнем углу через{" "}
        <em>Select Kernel</em> выберите среду{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">mlagents</code> и
        выполните ячейку:
      </p>
      <CyberCodeBlock language="python" filename="check_env.ipynb">
        {`import torch
import mlagents_envs
from mlagents_envs.environment import UnityEnvironment

print("PyTorch:", torch.__version__)
print("CUDA:", torch.cuda.is_available())
print("ml-agents-envs: OK")`}
      </CyberCodeBlock>
      <p className="text-sm text-muted-foreground mt-3">
        Ячейка должна отработать без ошибок и показать версию PyTorch 2.x.
      </p>
    </div>

    <a
      href="https://code.visualstudio.com/docs/datascience/jupyter-notebooks"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm text-cyan-300 hover:text-cyan-200 hover:underline"
    >
      <ExternalLink className="w-3.5 h-3.5" />
      Документация: Jupyter в VS Code
    </a>
  </div>
);

export default VSCodeSection;
