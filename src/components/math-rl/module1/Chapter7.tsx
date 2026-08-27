import { History } from "lucide-react";
import Math from "@/components/Math";
import { Section, InfoBox } from "./Section";

const Chapter7 = () => (
  <Section icon={<History className="w-5 h-5 text-secondary" />} title="Глава 7. Следы пригодности (Eligibility Traces)" id="глава-7">
    <p>
      Методы TD(0) обновляют значения лишь на один шаг вперёд, а Монте-Карло ждёт конца эпизода — это две крайности одного спектра. <strong className="text-foreground">Следы пригодности</strong> (Eligibility Traces) и метод <Math display={false}>{"\\text{TD}(\\enfPar{\\lambda})"}</Math> — элегантный мост между ними.
    </p>

    <InfoBox variant="accent">
      <p className="font-semibold text-foreground mb-2">Проблема распределения кредита (Credit Assignment Problem)</p>
      <p className="text-sm">
        Робот-пылесос сделал 100 шагов и на последнем врезался в вазу. TD(0) обновит только ценность 99-го состояния. Ценность 98-го узнает об опасности лишь в следующем эпизоде. Это крайне медленный процесс распространения информации.
      </p>
    </InfoBox>

    <h3 id="механизм-кратковременной-памяти" className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3">Механизм кратковременной памяти</h3>
    <p>
      Для каждого состояния <Math display={false}>{"s"}</Math> заводится переменная <Math display={false}>{"e_t(\\enfVar{s})"}</Math> — след пригодности. При посещении состояния его след резко возрастает, затем экспоненциально затухает с коэффициентом <Math display={false}>{"\\enfPar{\\gamma}\\enfPar{\\lambda}"}</Math>:
    </p>
    <Math>{"e_t(\\enfVar{s}) = \\begin{cases} \\enfPar{\\gamma} \\enfPar{\\lambda}\\, e_{t-1}(\\enfVar{s}) & \\text{если } \\enfVar{s} \\neq S_t \\\\ \\enfPar{\\gamma} \\enfPar{\\lambda}\\, e_{t-1}(\\enfVar{s}) + 1 & \\text{если } \\enfVar{s} = S_t \\end{cases}"}</Math>
    <p>
      Параметр <Math display={false}>{"\\enfPar{\\lambda} \\in [0, 1]"}</Math> контролирует скорость затухания. При <Math display={false}>{"\\enfPar{\\lambda} = 0"}</Math> получаем TD(0), при <Math display={false}>{"\\enfPar{\\lambda} = 1"}</Math> — аналог Монте-Карло.
    </p>

    <h3 id="backward-view-мгновенное-распространение" className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3">Backward View: мгновенное распространение</h3>
    <p>
      В алгоритме <Math display={false}>{"\\text{TD}(\\enfPar{\\lambda})"}</Math> ошибка <Math display={false}>{"\\delta_t"}</Math> немедленно транслируется назад во времени и используется для обновления <strong className="text-foreground">всех состояний</strong> пропорционально их следу:
    </p>
    <Math>{"\\enfOp{V}(\\enfVar{s}) \\leftarrow \\enfOp{V}(\\enfVar{s}) + \\enfPar{\\alpha}\\, \\delta_t\\, e_t(\\enfVar{s}) \\quad \\forall\\, \\enfVar{s}"}</Math>
    <p>
      Если робот врезался в вазу, штраф немедленно наложится на 99-й шаг (сильно), 98-й (чуть слабее), 97-й (ещё слабее) — экспоненциально ускоряя сходимость.
    </p>
  </Section>
);

export default Chapter7;
