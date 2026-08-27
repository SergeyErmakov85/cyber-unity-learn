import { Cpu } from "lucide-react";
import Math from "@/components/Math";
import { Section, InfoBox } from "./Section";

const Chapter8 = () => (
  <Section icon={<Cpu className="w-5 h-5 text-primary" />} title="Глава 8. Аппроксимация функций и Deep RL" id="глава-8">
    <p>
      Все описанные алгоритмы в классическом виде опираются на <strong className="text-foreground">табличные методы</strong>: таблица, где строки — состояния, столбцы — действия, а ячейки хранят Q-значения.
    </p>
    <p>
      Для сетки <Math display={false}>{"10 \\times 10"}</Math> это работает (100 состояний, 4 действия). Но если состояние — экран <Math display={false}>{"84 \\times 84"}</Math> пикселей в 3 каналах, число комбинаций превышает число атомов во Вселенной. Это <strong className="text-primary">Проклятие размерности</strong> (Curse of Dimensionality).
    </p>

    <h3 id="нейросети-как-аппроксиматоры" className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3">Нейросети как аппроксиматоры</h3>
    <p>
      Вместо таблицы — нейронная сеть с весами <Math display={false}>{"w"}</Math>, принимающая на вход состояние <Math display={false}>{"s"}</Math> и предсказывающая <Math display={false}>{"\\hat{\\enfOp{Q}}(\\enfVar{s}, a, w)"}</Math>. Ключевое свойство — <strong className="text-foreground">генерализация</strong>: увидев опасность при координатах <Math display={false}>{"(10.1, 5.0)"}</Math>, сеть автоматически распознает <Math display={false}>{"(10.2, 5.0)"}</Math> как опасные.
    </p>

    <h3 id="dqn-deep-q-network" className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3">DQN: Deep Q-Network</h3>
    <p>
      DQN решает задачу регрессии, минимизируя MSE между предсказанием сети и «целью» Беллмана:
    </p>
    <Math>{"L(w) = \\mathbb{E}\\left[\\Big( \\underbrace{\\enfTgt{R}_{t+1} + \\enfPar{\\gamma} \\max_{a'} \\hat{\\enfOp{Q}}(S_{t+1}, a', w^-)}_{\\text{Target (заморожен)}} - \\hat{\\enfOp{Q}}(S_t, A_t, w) \\Big)^2\\right]"}</Math>

    <InfoBox>
      <p className="font-semibold text-foreground mb-3">Два ключевых инженерных решения DQN</p>
      <div className="space-y-3 text-sm">
        <div>
          <strong className="text-primary">1. Experience Replay Buffer</strong>
          <p>Переходы <Math display={false}>{"(S_t, A_t, \\enfTgt{R}_{t+1}, S_{t+1})"}</Math> складываются в базу данных. Сеть обучается на случайных мини-батчах, разбивая временную корреляцию и стабилизируя обучение.</p>
        </div>
        <div>
          <strong className="text-primary">2. Target Network</strong>
          <p>Веса <Math display={false}>{"w^-"}</Math> для расчёта цели замораживаются и обновляются до актуальных <Math display={false}>{"w"}</Math> лишь раз в несколько тысяч шагов. Это предотвращает нестабильные петли обратной связи.</p>
        </div>
      </div>
    </InfoBox>
  </Section>
);

export default Chapter8;
