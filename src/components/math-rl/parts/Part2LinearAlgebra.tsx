import React from "react";
import { BookOpen, Layers, Brain, Lightbulb, Code2, GraduationCap } from "lucide-react";
import Math from "@/components/Math";

const Part2LinearAlgebra = () => (
  <>
    {/* Section 1: Vectors */}
    <Section icon={<BookOpen className="w-5 h-5 text-primary" />} title="1. Векторы">
      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-6 mb-3" id="1-4-линейная-комбинация-векторов">1.4. Линейная комбинация векторов</h3>
      <p>
        Линейная комбинация векторов <Math display={false}>{"\\enfVar{\\vec{v}}_1, \\enfVar{\\vec{v}}_2, \\ldots, \\enfVar{\\vec{v}}_m"}</Math> с коэффициентами <Math display={false}>{"\\enfPar{c}_1, \\enfPar{c}_2, \\ldots, \\enfPar{c}_m"}</Math>:
      </p>
      <Math>{"\\enfVar{\\vec{w}} = \\enfPar{c}_1\\enfVar{\\vec{v}}_1 + \\enfPar{c}_2\\enfVar{\\vec{v}}_2 + \\cdots + \\enfPar{c}_m\\enfVar{\\vec{v}}_m = \\sum_{i=1}^{m} \\enfPar{c}_i\\enfVar{\\vec{v}}_i"}</Math>
      <p>В RL функция ценности часто аппроксимируется как линейная комбинация базисных функций:</p>
      <Math>{"\\enfOp{V}(\\enfVar{s}) \\approx \\sum_{i=1}^{k} \\enfPar{w}_i\\,\\enfFun{\\varphi}_i(\\enfVar{s}) = \\enfPar{\\mathbf{w}}^\\top \\enfFun{\\boldsymbol{\\varphi}}(\\enfVar{s})"}</Math>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="1-5-линейная-зависимость-и-независимость">1.5. Линейная зависимость и независимость</h3>
      <p>
        Система векторов <strong className="text-foreground">линейно зависима</strong>, если существуют не все нулевые коэффициенты:
      </p>
      <Math>{"\\enfPar{c}_1\\enfVar{\\vec{v}}_1 + \\enfPar{c}_2\\enfVar{\\vec{v}}_2 + \\cdots + \\enfPar{c}_m\\enfVar{\\vec{v}}_m = \\vec{0},\\quad \\text{где хотя бы один } \\enfPar{c}_i \\neq 0"}</Math>
      <p>
        <strong className="text-foreground">Линейно независимые</strong> векторы указывают на «разные» направления — ни один не выражается через остальные. Это важно при выборе признаков: линейно зависимые признаки ведут к мультиколлинеарности.
      </p>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="1-6-базис-и-размерность">1.6. Базис и размерность</h3>
      <p>
        <strong className="text-foreground">Базис</strong> — набор линейно независимых векторов <Math display={false}>{"\\{\\vec{e}_1, \\ldots, \\vec{e}_n\\}"}</Math>, через которые единственным образом выражается любой вектор пространства:
      </p>
      <Math>{"\\enfVar{\\vec{v}} = \\enfVar{x}_1\\vec{e}_1 + \\enfVar{x}_2\\vec{e}_2 + \\cdots + \\enfVar{x}_n\\vec{e}_n"}</Math>
      <p>
        PCA ищет новый базис, сохраняя максимум информации меньшим числом координат — борьба с «проклятием размерности» в RL.
      </p>
    </Section>

    {/* Section 2: Matrices */}
    <Section icon={<Layers className="w-5 h-5 text-secondary" />} title="2. Матрицы">
      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-6 mb-3" id="2-1-определение-и-типы-матриц">2.1. Определение и типы матриц</h3>
      <p>Матрица <Math display={false}>{"\\enfFun{A}"}</Math> размера <Math display={false}>{"n \\times m"}</Math>:</p>
      <Math>{"\\enfFun{A} = \\begin{pmatrix} a_{11} & a_{12} & \\cdots & a_{1m} \\\\ a_{21} & a_{22} & \\cdots & a_{2m} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ a_{n1} & a_{n2} & \\cdots & a_{nm} \\end{pmatrix}"}</Math>
      <ul className="list-disc list-inside mt-2 space-y-1">
        <li><strong className="text-foreground">Единичная:</strong> <Math display={false}>{"I_n"}</Math>, <strong className="text-foreground">диагональная:</strong> <Math display={false}>{"\\enfFun{D} = \\operatorname{diag}(d_1, \\ldots, d_n)"}</Math></li>
        <li><strong className="text-foreground">Симметрическая:</strong> <Math display={false}>{"\\enfFun{A} = \\enfFun{A}^\\top"}</Math>, <strong className="text-foreground">кососимметрическая:</strong> <Math display={false}>{"\\enfFun{A} = -\\enfFun{A}^\\top"}</Math></li>
      </ul>
      <InfoBox color="primary" title="Применение в RL">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Матрицы переходных вероятностей <Math display={false}>{"\\enfFun{P}^a_{ss'} = \\enfFun{P}(\\enfVar{s}_{t+1} = \\enfVar{s}' \\mid \\enfVar{s}_t = \\enfVar{s}, \\enfFun{a}_t = \\enfFun{a})"}</Math></li>
          <li>Весовые матрицы нейронных сетей в Deep RL</li>
          <li>Уравнения Беллмана: <Math display={false}>{"\\enfOp{\\mathbf{V}} = (I - \\enfPar{\\gamma} \\enfFun{P}^\\pi)^{-1} \\enfTgt{\\mathbf{R}}^\\pi"}</Math></li>
        </ul>
      </InfoBox>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="2-2-операции-над-матрицами">2.2. Операции над матрицами</h3>
      <p><strong className="text-foreground">Произведение матриц</strong> <Math display={false}>{"\\enfFun{A}_{n \\times s} \\cdot \\enfFun{B}_{s \\times m} = \\enfFun{C}_{n \\times m}"}</Math>:</p>
      <Math>{"\\enfPar{c}_{ij} = \\sum_{k=1}^{s} a_{ik}\\, b_{kj}"}</Math>
      <p className="text-sm">⚠️ В общем случае <Math display={false}>{"\\enfFun{A}\\enfFun{B} \\neq \\enfFun{B}\\enfFun{A}"}</Math> (некоммутативность).</p>
      <p className="mt-2"><strong className="text-foreground">Транспонирование:</strong> <Math display={false}>{"(\\enfFun{A}\\enfFun{B})^\\top = \\enfFun{B}^\\top \\enfFun{A}^\\top"}</Math></p>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="2-3-определитель-матрицы">2.3. Определитель матрицы</h3>
      <p><Math display={false}>{"\\enfOp{\\det}(\\enfFun{A})"}</Math> — если <Math display={false}>{"\\enfOp{\\det}(\\enfFun{A}) = 0"}</Math>, матрица вырождена (необратима).</p>
      <Math>{"\\enfOp{\\det}(\\enfFun{A}\\enfFun{B}) = \\enfOp{\\det}(\\enfFun{A}) \\cdot \\enfOp{\\det}(\\enfFun{B}),\\quad \\enfOp{\\det}(\\enfFun{A}^\\top) = \\enfOp{\\det}(\\enfFun{A}),\\quad \\enfOp{\\det}(\\enfFun{A}^{-1}) = \\frac{1}{\\enfOp{\\det}(\\enfFun{A})}"}</Math>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="2-4-ранг-матрицы">2.4. Ранг матрицы</h3>
      <p><Math display={false}>{"\\operatorname{rank}(\\enfFun{A})"}</Math> — максимальное число линейно независимых строк (или столбцов). <Math display={false}>{"\\operatorname{rank}(\\enfFun{A}) \\leq \\min(n, m)"}</Math>.</p>
      <InfoBox color="secondary" title="Теорема Кронекера-Капелли">
        <Math>{"\\enfFun{A}\\enfVar{x} = \\enfTgt{b} \\text{ совместна} \\;\\Longleftrightarrow\\; \\operatorname{rank}(\\enfFun{A}) = \\operatorname{rank}(\\enfFun{A} \\mid \\enfTgt{b})"}</Math>
      </InfoBox>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="2-5-обратная-матрица">2.5. Обратная матрица</h3>
      <Math>{"\\enfFun{A}\\enfFun{A}^{-1} = \\enfFun{A}^{-1}\\enfFun{A} = I_n, \\quad \\text{существует} \\;\\Leftrightarrow\\; \\enfOp{\\det}(\\enfFun{A}) \\neq 0"}</Math>
      <p className="mt-2">Решение уравнений Беллмана:</p>
      <Math>{"\\enfOp{\\mathbf{V}}^\\pi = (I - \\enfPar{\\gamma} \\enfFun{P}^\\pi)^{-1}\\, \\enfTgt{\\mathbf{R}}^\\pi"}</Math>
    </Section>

    {/* Section 3: Dot Product */}
    <Section icon={<Brain className="w-5 h-5 text-accent" />} title="3. Скалярное произведение">
      <p><strong className="text-foreground">Геометрическое определение:</strong></p>
      <Math>{"\\enfVar{\\vec{a}} \\cdot \\enfVar{\\vec{b}} = \\|\\enfVar{\\vec{a}}\\| \\cdot \\|\\enfVar{\\vec{b}}\\| \\cdot \\cos\\enfVar{\\theta}"}</Math>
      <p><strong className="text-foreground">Алгебраическое (в координатах):</strong></p>
      <Math>{"\\enfVar{\\vec{a}} \\cdot \\enfVar{\\vec{b}} = \\sum_{i=1}^{n} a_i\\, b_i = a_1 b_1 + a_2 b_2 + \\cdots + a_n b_n"}</Math>
      <div className="mt-4 space-y-2">
        <p>• <Math display={false}>{"\\enfVar{\\theta} < 90^\\circ"}</Math> → произведение &gt; 0 (сонаправлены)</p>
        <p>• <Math display={false}>{"\\enfVar{\\theta} = 90^\\circ"}</Math> → произведение = 0 (<strong className="text-primary">ортогональность</strong>)</p>
        <p>• <Math display={false}>{"\\enfVar{\\theta} > 90^\\circ"}</Math> → произведение &lt; 0 (противонаправлены)</p>
      </div>
      <InfoBox color="accent" title="В RL">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><Math display={false}>{"\\enfOp{V}(\\enfVar{s}) \\approx \\enfPar{\\mathbf{w}}^\\top \\enfFun{\\boldsymbol{\\varphi}}(\\enfVar{s})"}</Math> — скалярное произведение весов и признаков</li>
          <li>Косинусное сходство: <Math display={false}>{"\\cos\\enfVar{\\theta} = \\frac{\\enfVar{\\vec{a}}\\cdot\\enfVar{\\vec{b}}}{\\|\\enfVar{\\vec{a}}\\|\\,\\|\\enfVar{\\vec{b}}\\|}"}</Math></li>
          <li>Градиентный спуск: <Math display={false}>{"\\enfOp{\\nabla} \\enfTgt{J}(\\enfPar{\\theta})"}</Math></li>
        </ul>
      </InfoBox>
    </Section>

    {/* Section 4: Eigenvalues */}
    <Section icon={<Lightbulb className="w-5 h-5 text-primary" />} title="4. Собственные значения и собственные векторы">
      <Math>{"\\enfFun{A}\\enfVar{\\vec{v}} = \\enfPar{\\lambda}\\enfVar{\\vec{v}}, \\quad \\enfVar{\\vec{v}} \\neq \\vec{0}"}</Math>
      <p className="mt-3">
        <Math display={false}>{"\\enfPar{\\lambda}"}</Math> — собственное значение, <Math display={false}>{"\\enfVar{\\vec{v}}"}</Math> — собственный вектор. Находим из характеристического уравнения:
      </p>
      <Math>{"\\enfOp{\\det}(\\enfFun{A} - \\enfPar{\\lambda} I) = 0"}</Math>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="спектральное-разложение">Спектральное разложение</h3>
      <p>Если <Math display={false}>{"\\enfFun{A}"}</Math> диагонализуема:</p>
      <Math>{"\\enfFun{A} = \\enfFun{P} \\enfFun{D} \\enfFun{P}^{-1}, \\quad \\enfFun{D} = \\operatorname{diag}(\\enfPar{\\lambda}_1, \\ldots, \\enfPar{\\lambda}_n) \\;\\Rightarrow\\; \\enfFun{A}^k = \\enfFun{P}\\enfFun{D}^k\\enfFun{P}^{-1}"}</Math>

      <InfoBox color="primary" title="В RL">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Сходимость: <Math display={false}>{"\\enfFun{\\rho}(\\enfPar{\\gamma} \\enfFun{P}^\\pi) < 1"}</Math> гарантирует сходимость итерации ценности</li>
          <li>PCA = собственное разложение ковариационной матрицы → понижение размерности</li>
          <li>Гессиан <Math display={false}>{"\\enfOp{H}"}</Math>: собственные значения определяют выпуклость целевой функции</li>
        </ul>
      </InfoBox>
    </Section>

    {/* Section 5: SVD */}
    <Section icon={<Code2 className="w-5 h-5 text-secondary" />} title="5. Сингулярное разложение (SVD)">
      <Math>{"\\enfFun{A} = \\enfFun{U} \\enfFun{\\Sigma} \\enfFun{V}^\\top"}</Math>
      <ul className="list-disc list-inside mt-3 space-y-2">
        <li><Math display={false}>{"\\enfFun{U}"}</Math> (<Math display={false}>{"m \\times m"}</Math>) — ортогональная, столбцы = левые сингулярные векторы</li>
        <li><Math display={false}>{"\\enfFun{\\Sigma}"}</Math> (<Math display={false}>{"m \\times n"}</Math>) — диагональная, <Math display={false}>{"\\enfPar{\\sigma}_1 \\geq \\enfPar{\\sigma}_2 \\geq \\cdots \\geq \\enfPar{\\sigma}_r > 0"}</Math></li>
        <li><Math display={false}>{"\\enfFun{V}"}</Math> (<Math display={false}>{"n \\times n"}</Math>) — ортогональная, столбцы = правые сингулярные векторы</li>
      </ul>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="связь-с-собственными-значениями">Связь с собственными значениями</h3>
      <Math>{"\\enfFun{A}^\\top \\enfFun{A} = \\enfFun{V}(\\enfFun{\\Sigma}^\\top\\enfFun{\\Sigma})\\enfFun{V}^\\top, \\quad \\enfFun{A}\\enfFun{A}^\\top = \\enfFun{U}(\\enfFun{\\Sigma}\\enfFun{\\Sigma}^\\top)\\enfFun{U}^\\top"}</Math>
      <p>Сингулярные числа: <Math display={false}>{"\\enfPar{\\sigma}_i = \\sqrt{\\enfPar{\\lambda}_i(\\enfFun{A}^\\top \\enfFun{A})}"}</Math></p>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="теорема-эккарта-янга">Теорема Эккарта-Янга</h3>
      <p>Лучшая аппроксимация ранга <Math display={false}>{"k"}</Math>:</p>
      <Math>{"\\enfFun{A}_k = \\enfFun{U}\\enfFun{\\Sigma}_k \\enfFun{V}^\\top, \\quad \\|\\enfFun{A} - \\enfFun{A}_k\\|_F = \\sqrt{\\enfPar{\\sigma}_{k+1}^2 + \\cdots + \\enfPar{\\sigma}_r^2}"}</Math>

      <InfoBox color="secondary" title="Применение SVD в RL">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Понижение размерности пространства состояний</li>
          <li>Аппроксимация Q-таблицы матрицей меньшего ранга</li>
          <li>Псевдообратная: <Math display={false}>{"\\enfFun{A}^+ = \\enfFun{V}\\enfFun{\\Sigma}^+ \\enfFun{U}^\\top"}</Math> для LSTD</li>
          <li>Робастность к шуму через низкоранговую аппроксимацию</li>
        </ul>
      </InfoBox>
    </Section>

    {/* Section 6: Additional Topics */}
    <Section icon={<GraduationCap className="w-5 h-5 text-accent" />} title="6. Дополнительные темы">
      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-6 mb-3" id="6-1-квадратичные-формы">6.1. Квадратичные формы</h3>
      <Math>{"\\enfOp{Q}(\\enfVar{\\mathbf{x}}) = \\enfVar{\\mathbf{x}}^\\top \\enfFun{A}\\, \\enfVar{\\mathbf{x}}, \\quad \\enfFun{A} = \\enfFun{A}^\\top"}</Math>
      <p>
        Классификация: <strong className="text-primary">положительно определённая</strong> (все <Math display={false}>{"\\enfPar{\\lambda}_i > 0"}</Math>), <strong className="text-secondary">отрицательно определённая</strong> (все <Math display={false}>{"\\enfPar{\\lambda}_i < 0"}</Math>), <strong className="text-accent">знакопеременная</strong>.
      </p>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="6-2-ортогональная-проекция">6.2. Ортогональная проекция</h3>
      <Math>{"\\text{proj}_{\\mathcal{C}(A)}\\, \\enfTgt{\\mathbf{b}} = \\enfFun{A}(\\enfFun{A}^\\top \\enfFun{A})^{-1}\\enfFun{A}^\\top \\enfTgt{\\mathbf{b}}"}</Math>
      <p className="mt-2 text-sm">Основа метода наименьших квадратов и аппроксимации <Math display={false}>{"\\enfOp{V}(\\enfVar{s}) \\approx \\enfFun{\\Phi}\\enfPar{\\mathbf{w}}"}</Math>.</p>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="6-3-изменение-базиса">6.3. Изменение базиса</h3>
      <Math>{"[\\enfVar{\\vec{v}}]_B = \\enfFun{P}_{B\\to B'}\\,[\\enfVar{\\vec{v}}]_{B'}, \\quad \\enfFun{M}_{B'} = \\enfFun{P}^{-1} \\enfFun{M}_B\\, \\enfFun{P}"}</Math>
      <p className="mt-2 text-sm">PCA — переход к базису из собственных векторов ковариационной матрицы.</p>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="6-4-разложения-lu-и-qr">6.4. Разложения LU и QR</h3>
      <Math>{"\\enfFun{A} = \\enfFun{L}\\enfFun{U} \\quad \\text{(LU)}, \\qquad \\enfFun{A} = \\enfFun{Q}\\enfFun{R} \\quad \\text{(QR)}"}</Math>
      <p className="mt-2">
        <strong className="text-foreground">LU:</strong> <Math display={false}>{"\\enfFun{L}"}</Math> — нижнетреугольная, <Math display={false}>{"\\enfFun{U}"}</Math> — верхнетреугольная.
      </p>
      <p className="mt-2">
        <strong className="text-foreground">QR:</strong> <Math display={false}>{"\\enfFun{Q}"}</Math> — ортогональная, <Math display={false}>{"\\enfFun{R}"}</Math> — верхнетреугольная. Численно устойчиво для наименьших квадратов.
      </p>
      <InfoBox color="accent" title="В RL">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Решение <Math display={false}>{"(I - \\enfPar{\\gamma} \\enfFun{P}^\\pi)\\enfOp{V} = \\enfTgt{R}^\\pi"}</Math> через LU</li>
          <li>LSTD использует QR или SVD</li>
          <li>Натуральный градиент: обращение <Math display={false}>{"\\enfOp{F}^{-1}"}</Math> (матрица Фишера)</li>
        </ul>
      </InfoBox>
    </Section>
  </>
);

/* ─── Local helpers ─── */

const slugify = (t: string) => t.toLowerCase().replace(/[^\wа-яё]+/gi, "-").replace(/^-|-$/g, "").slice(0, 60);

const Section = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <section className="mt-12 first:mt-0 scroll-mt-28" id={slugify(title)}>
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

export default Part2LinearAlgebra;
