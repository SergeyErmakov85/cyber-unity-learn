import { SECTION_TITLE_CLASS, ProseP, KeyPoints, Callout } from "./_shared";

const Section7 = () => (
  <>
    <h2 id="etap-6-geympley" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 7. Этап 6 — Геймплей
    </h2>

    <ProseP>
      NPC обучен и работает автономно — но это ещё не игра. Финальный этап превращает «сцену с агентом» в продукт.
    </ProseP>

    <ul className="space-y-2 my-4 list-disc list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li><strong>Управление игроком.</strong> Добавьте ручной контроль персонажа (Input System), чтобы человек противостоял обученному NPC или сотрудничал с ним.</li>
      <li><strong>Камера.</strong> Follow-камера, Cinemachine, либо фиксированный ракурс — в зависимости от жанра.</li>
      <li><strong>UI / HUD.</strong> Здоровье, счёт, таймер, экран победы/поражения. Состояние эпизода NPC уже считает — свяжите его с UI.</li>
      <li><strong>Сборка билда.</strong> Выберите целевую платформу (PC/WebGL/мобайл), проверьте, что назначена ONNX-модель, и соберите. Для WebGL учитывайте, что Sentis на CPU-бэкенде через Burst компилируется в WebAssembly (медленнее GPU).</li>
    </ul>

    <Callout title="Связь с курсом" color="purple">
      Здесь сходятся все нити: среда из этапа 1 даёт NPC наблюдения <strong>в реальном времени</strong>, а инференс из этапа 5 превращает их в действия. Игрок видит результат всего конвейера.
    </Callout>

    <KeyPoints
      items={[
        <>Игра = NPC + <strong>управление, камера, UI и билд</strong>.</>,
        <>NPC уже знает состояние эпизода — переиспользуйте его для HUD.</>,
        <>Под целевую платформу проверяйте бэкенд Sentis (GPU vs CPU/WebAssembly для WebGL).</>,
      ]}
    />
  </>
);

export default Section7;
