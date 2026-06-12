import Math from "@/components/Math";
import { SECTION_TITLE_CLASS, Code } from "./_shared";

const Summary = () => (
  <>
    <h2 id="итоги" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Итоги урока
    </h2>

    <ul className="space-y-3 my-4 list-disc list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <strong>Задача HPO:</strong>{" "}
        <Math display={false}>{String.raw`\boldsymbol{\lambda}^{\star} = \arg\max_{\boldsymbol{\lambda}} f(\boldsymbol{\lambda})`}</Math>
        , где <Math display={false}>{String.raw`f`}</Math> — дорогой, шумный чёрный ящик; бюджет
        считаем в числе испытаний.
      </li>
      <li>
        <strong>Grid</strong> страдает проклятием размерности (
        <Math display={false}>{String.raw`k^d`}</Math>) и тратит испытания на неважные оси.
      </li>
      <li>
        <strong>Random search</strong> эффективнее из-за низкой эффективной размерности и служит
        обязательным baseline&apos;ом — но не учится на истории.
      </li>
      <li>
        <strong>Байесовская оптимизация (SMBO):</strong> суррогат + функция выгоды (EI). GP точен,
        но дорог (<Math display={false}>{String.raw`O(n^3)`}</Math>).
      </li>
      <li>
        <strong>TPE</strong> — дешёвый (<Math display={false}>{String.raw`O(n)`}</Math>) суррогат
        через две плотности:{" "}
        <Math display={false}>{String.raw`\mathrm{EI} \propto \big(\gamma + \tfrac{g}{\ell}(1-\gamma)\big)^{-1}`}</Math>
        , максимизируем <Math display={false}>{String.raw`\ell/g`}</Math>. Дефолтный сэмплер
        Optuna.
      </li>
      <li>
        <strong>Прунинг</strong> (Median, SHA/ASHA, Hyperband) убивает аутсайдеров на ранних шагах
        — кратно увеличивает охват.
      </li>
      <li>
        <strong>Optuna</strong>: study/trial/objective, define-by-run,{" "}
        <Code>suggest_float(log=True)</Code>, распределёнка через общее хранилище.
      </li>
      <li>
        <strong>W&amp;B Sweeps</strong> — декларативный HPO с визуализацией из коробки; лучшая
        связка — поиск Optuna + логирование W&amp;B через <Code>WeightsAndBiasesCallback</Code>.
      </li>
      <li>
        <strong>Практика:</strong> objective генерирует YAML, запускает{" "}
        <Code>mlagents-learn</Code>, читает награду; прунинг по урезанному бюджету шагов, затем
        дообучение лидеров.
      </li>
    </ul>
  </>
);

export default Summary;
