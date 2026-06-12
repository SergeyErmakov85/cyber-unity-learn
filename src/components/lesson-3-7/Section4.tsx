import Math from "@/components/Math";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints, Callout, Anchor } from "./_shared";

const Section4 = () => (
  <>
    <h2 id="razdel-4-memory" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 4. Память: POMDP и рекуррентные сети
    </h2>

    <ProseP>
      Гоночный агент с дальномером в один момент времени <strong>не знает свою скорость</strong> —
      луч даёт расстояние, но не его производную. Он не помнит, был ли занос секунду назад. Формально
      текущее наблюдение <Math display={false}>{String.raw`o_t`}</Math> <strong>не равно</strong>{" "}
      истинному состоянию <Math display={false}>{String.raw`s_t`}</Math>: это{" "}
      <strong>частично наблюдаемый марковский процесс (POMDP)</strong>. Марковость, на которой стоит
      весь аппарат уравнений Беллмана (↗{" "}
      <CrossLinkToHub hubPath="/math-rl/module-5" hubTitle="Math RL — Фундамент RL">
        /math-rl/module-5
      </CrossLinkToHub>
      ), нарушается на уровне наблюдений.
    </ProseP>

    <ProseP>
      Есть <strong>два способа</strong> вернуть агенту недостающий контекст.
    </ProseP>

    <ProseP>
      <strong>Способ 1 — кадровый стек.</strong> Склеить последние{" "}
      <Math display={false}>{String.raw`n`}</Math> наблюдений в одно:{" "}
      <Math display={false}>{String.raw`\tilde o_t = (o_{t-n+1},\dots,o_t)`}</Math>. Именно так DQN
      получал скорость мяча из 4 кадров (<Anchor to="razdel-3-cnn">раздел 3</Anchor>). Просто и без
      новых параметров, но окно памяти жёстко ограничено{" "}
      <Math display={false}>{String.raw`n`}</Math>, и при больших{" "}
      <Math display={false}>{String.raw`n`}</Math> вход раздувается.
    </ProseP>

    <ProseP>
      <strong>Способ 2 — рекуррентность (LSTM).</strong> Дать энкодеру внутреннее{" "}
      <strong>скрытое состояние</strong> <Math display={false}>{String.raw`m_t`}</Math>, которое он
      сам обновляет на каждом шаге:
    </ProseP>

    <Math>
      {String.raw`m_t = \mathrm{LSTM}_\phi(o_t,\, m_{t-1}),\qquad z_t = m_t .`}
    </Math>

    <ProseP>
      Теперь <Math display={false}>{String.raw`m_t`}</Math> — это обучаемое сжатие{" "}
      <strong>всей истории</strong> до момента <Math display={false}>{String.raw`t`}</Math>, а не
      фиксированного окна. Сеть сама решает, что запомнить (была ли коллизия, в какую сторону
      входили в поворот) и что забыть. Подробный разбор гейтов LSTM и проблемы затухающего
      градиента — в хабе ↗{" "}
      <CrossLinkToHub hubPath="/deep-rl" hubTitle="Deep RL">
        /deep-rl
      </CrossLinkToHub>
      .
    </ProseP>

    <ProseP>
      <strong>Как это включается в ML-Agents.</strong> Под <code>network_settings</code> добавляется
      блок <code>memory</code> с тремя смыслами:
    </ProseP>

    <ul className="space-y-2 my-4 list-disc list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <code>memory_size</code> (дефолт 128, <strong>должно делиться на 2</strong>, диапазон
        32–256) — размер скрытого вектора <Math display={false}>{String.raw`m_t`}</Math>; сколько
        информации агент способен удержать.
      </li>
      <li>
        <code>sequence_length</code> (дефолт 64) — на каких по длине отрезках траектории сеть
        обучается через время; слишком короткие — нет долгой памяти, слишком длинные — обучение
        медленнее.
      </li>
    </ul>

    <Callout title="Важный нюанс для гоночного агента" color="amber">
      Официальная документация предупреждает: <strong>LSTM плохо работает с непрерывным
      пространством действий.</strong> Руль и газ — непрерывны, поэтому рекуррентность для машины —
      это компромисс: включайте её, только если частичная наблюдаемость реально мешает (например,
      нет сенсора скорости), и при этом <strong>уменьшайте <code>num_layers</code></strong>, т.к.
      рекуррентный слой и так повышает сложность сети.
    </Callout>

    <KeyPoints
      items={[
        <>
          <Math display={false}>{String.raw`o_t \ne s_t`}</Math> — это <strong>POMDP</strong>;
          агенту не хватает контекста, и марковость наблюдений нарушена.
        </>,
        <>
          <strong>Кадровый стек</strong> — дешёвое фиксированное окно памяти; <strong>LSTM</strong>{" "}
          — обучаемое сжатие всей истории.
        </>,
        <>
          В ML-Agents память — блок <code>memory</code> с <code>memory_size</code> (кратно 2) и{" "}
          <code>sequence_length</code>.
        </>,
        <>
          LSTM конфликтует с непрерывными действиями и повышает сложность — при включении уменьшайте{" "}
          <code>num_layers</code>.
        </>,
      ]}
    />
  </>
);

export default Section4;
