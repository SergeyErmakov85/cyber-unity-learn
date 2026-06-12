import { SECTION_TITLE_CLASS, H3_CLASS, ProseP, KeyPoints } from "./_shared";

const Section10 = () => (
  <>
    <h2 id="kriterii-i-sertifikat" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 10. Критерии оценки и сертификат
    </h2>

    <h3 className={H3_CLASS}>Обязательные требования (все должны быть выполнены)</h3>
    <ul className="space-y-2 my-4 list-disc list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li>Unity-сцена с агентом и интерактивной средой.</li>
      <li>Работающая функция награды (с dense-членами).</li>
      <li>Обученная модель через <strong>PPO или SAC</strong>.</li>
      <li><strong>ONNX-экспорт</strong> и работающий инференс в Unity (Sentis).</li>
      <li>Игрок может <strong>взаимодействовать</strong> с обученным NPC.</li>
      <li><strong>TensorBoard-графики</strong> процесса обучения.</li>
    </ul>

    <h3 className={H3_CLASS}>Бонусные задания (повышают оценку)</h3>
    <ul className="space-y-2 my-4 list-disc list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li><strong>Curriculum Learning</strong> для постепенного усложнения.</li>
      <li><strong>Self-Play</strong> для конкурентного NPC.</li>
      <li><strong>GAIL</strong> для ускорения обучения из демонстраций.</li>
      <li>Оптимизация гиперпараметров через <strong>Optuna</strong>.</li>
      <li><strong>Квантизация</strong> модели под мобильную платформу.</li>
      <li><strong>W&B-логирование</strong> с наглядными графиками.</li>
    </ul>

    <h3 className={H3_CLASS}>Рубрика приёмки</h3>
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm border border-cyan-500/20 rounded-lg overflow-hidden">
        <thead className="bg-cyan-500/10">
          <tr className="text-left text-cyan-200">
            <th className="p-3">Критерий</th>
            <th className="p-3">Минимум</th>
            <th className="p-3">Отлично</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cyan-500/10 text-foreground/85">
          <tr><td className="p-3">Среда и наблюдения</td><td className="p-3">агент получает осмысленные наблюдения</td><td className="p-3">нормированные, агент-центричные, дублированная арена</td></tr>
          <tr><td className="p-3">Награда</td><td className="p-3">reward растёт, агент решает задачу</td><td className="p-3">защита от reward hacking, потенциальное шейпинг</td></tr>
          <tr><td className="p-3">Обучение</td><td className="p-3">конвергенция на TensorBoard</td><td className="p-3">стабильная кривая, осмысленная энтропия</td></tr>
          <tr><td className="p-3">Деплой</td><td className="p-3">NPC работает в билде (Inference Only)</td><td className="p-3">квантизация / оптимизация под платформу</td></tr>
          <tr><td className="p-3">Геймплей</td><td className="p-3">игрок взаимодействует с NPC</td><td className="p-3">проработанные UI/камера/билд</td></tr>
          <tr><td className="p-3">Бонусы</td><td className="p-3">—</td><td className="p-3">≥2 бонусных задания реализованы</td></tr>
        </tbody>
      </table>
    </div>

    <ProseP>
      Выполнение обязательной части + минимум двух бонусов открывает <strong>сертификат об окончании курса</strong>.
    </ProseP>

    <KeyPoints
      items={[
        <>Обязательная часть = работающий конвейер из шести этапов.</>,
        <>Бонусы — это техники из раздела 8 плюс оптимизация/квантизация/W&B.</>,
        <><strong>Обязательное + ≥2 бонуса → сертификат</strong>.</>,
      ]}
    />
  </>
);

export default Section10;
