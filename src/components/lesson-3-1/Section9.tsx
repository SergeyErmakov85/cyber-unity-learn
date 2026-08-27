import Math from "@/components/Math";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints } from "./_shared";

const ALGO = `Вход: начальные параметры θ₁, θ₂ (два критика), φ (политика)
Инициализация: θ̄₁ ← θ₁,  θ̄₂ ← θ₂        # target-сети
               D ← ∅                       # пустой replay buffer
               α                            # температура (обучаемая)

для каждой итерации:

    # --- ВЗАИМОДЕЙСТВИЕ СО СРЕДОЙ ---
    для каждого шага среды:
        aₜ ~ π_φ(·|sₜ)                      # сэмплируем действие из политики
        sₜ₊₁ ~ p(·|sₜ, aₜ)                  # среда даёт следующее состояние
        D ← D ∪ {(sₜ, aₜ, r(sₜ,aₜ), sₜ₊₁)} # сохраняем переход в буфер

    # --- ОБУЧЕНИЕ (по одному или несколько градиентных шагов) ---
    для каждого градиентного шага:
        # мини-батч случайных переходов из D
        θᵢ ← θᵢ − λ_Q ∇̂_θᵢ J_Q(θᵢ)   для i ∈ {1,2}   # обновить критиков (soft Bellman residual)
        φ  ← φ  − λ_π ∇̂_φ  J_π(φ)                      # обновить политику (reparameterization)
        α  ← α  − λ   ∇̂_α  J(α)                        # подстроить температуру
        θ̄ᵢ ← τ θᵢ + (1−τ) θ̄ᵢ   для i ∈ {1,2}          # soft-update target-сетей

Выход: оптимизированные θ₁, θ₂, φ`;

const Section9 = () => (
  <>
    <h2 className={SECTION_TITLE_CLASS}>Раздел 9. Полный алгоритм SAC</h2>

    <ProseP>Соберём всё вместе (Algorithm 1 из 1812.05905):</ProseP>

    <CyberCodeBlock language="pseudo" filename="SAC — Algorithm 1">
      {ALGO}
    </CyberCodeBlock>

    <ProseP>
      Обратите внимание на ритм:{" "}
      <strong>
        собрали опыт → положили в буфер → сделали несколько градиентных шагов на случайных батчах
      </strong>
      . Цикл повторяется. Все три цели (<Math display={false}>{String.raw`\enfTgt{J}_Q`}</Math>,{" "}
      <Math display={false}>{String.raw`\enfTgt{J}_\pi`}</Math>,{" "}
      <Math display={false}>{String.raw`\enfTgt{J}(\enfPar{\alpha})`}</Math>) минимизируются совместно, а target-сети
      плавно ползут за основными.
    </ProseP>

    <KeyPoints
      items={[
        <>Чередуем сбор опыта в буфер и градиентные шаги на случайных мини-батчах.</>,
        <>
          Обновляем: 2 критика (<Math display={false}>{String.raw`\enfTgt{J}_Q`}</Math>), политику (
          <Math display={false}>{String.raw`\enfTgt{J}_\pi`}</Math>), температуру (
          <Math display={false}>{String.raw`\enfTgt{J}(\enfPar{\alpha})`}</Math>), затем soft-update target.
        </>,
        <>
          Всё обучается на off-policy данных из{" "}
          <Math display={false}>{String.raw`\mathcal{D}`}</Math>.
        </>,
      ]}
    />
  </>
);

export default Section9;
