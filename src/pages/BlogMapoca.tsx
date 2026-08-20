import BlogLayout from "@/components/BlogLayout";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import { blogPosts } from "@/pages/Blog";
import LabPracticeSection from "@/components/LabPracticeSection";

const post = blogPosts.find((p) => p.slug === "mapoca-guide")!;

const toc = [
  { id: "intro", title: "Введение" },
  { id: "types", title: "Типы мультиагентных задач" },
  { id: "mapoca", title: "Что такое MA-POCA" },
  { id: "soccer", title: "Пример: Soccer в ML-Agents" },
  { id: "yaml", title: "YAML-конфигурация" },
  { id: "selfplay", title: "Self-Play для конкурентных задач" },
  { id: "tips", title: "Практические советы" },
  { id: "conclusion", title: "Заключение" },
];

const BlogMapoca = () => (
  <BlogLayout post={post} toc={toc}>
    <section id="intro">
      <h2 className="text-2xl font-bold text-foreground mb-3">Введение</h2>
      <p className="text-muted-foreground leading-relaxed">
        Большинство туториалов по RL фокусируются на одном агенте. Но реальные игры — это
        взаимодействие множества сущностей: команды, противники, союзники. <strong className="text-secondary">MA-POCA</strong>
        (Multi-Agent POsthumous Credit Assignment) — алгоритм от Unity Technologies, разработанный
        специально для кооперативных мультиагентных сценариев. Он решает фундаментальную проблему:
        как распределить групповую награду между отдельными агентами, особенно если некоторые из
        них «погибли» до получения награды. В этой статье мы разберём MA-POCA от теории до
        практической реализации в Unity ML-Agents.
      </p>
    </section>

    <section id="types">
      <h2 className="text-2xl font-bold text-foreground mb-3">Типы мультиагентных задач</h2>
      <p className="text-muted-foreground leading-relaxed">
        Мультиагентные задачи делятся на три категории. <strong className="text-primary">Кооперативные</strong>:
        все агенты работают вместе для общей цели (защита базы, перенос объекта).
        <strong className="text-primary"> Конкурентные</strong>: агенты соревнуются друг с другом
        (бои, гонки). <strong className="text-primary">Смешанные</strong>: команды сотрудничают
        внутри группы, но конкурируют с другими командами (футбол 2v2, capture the flag).
      </p>
      <p className="text-muted-foreground leading-relaxed mt-3">
        MA-POCA оптимален для кооперативных и смешанных задач. Для чисто конкурентных сценариев
        лучше подходит Self-Play, который мы тоже рассмотрим. В реальных играх чаще всего
        встречаются смешанные сценарии — именно для них MA-POCA + Self-Play дают лучшие результаты.
      </p>
    </section>

    <section id="mapoca">
      <h2 className="text-2xl font-bold text-foreground mb-3">Что такое MA-POCA</h2>
      <p className="text-muted-foreground leading-relaxed">
        Ключевая проблема кооперативного RL — <strong className="text-foreground">credit assignment</strong>.
        Когда команда забивает гол, кто заслуживает награду: нападающий, который забил, или
        защитник, который начал атаку? MA-POCA решает это через «централизованного критика»,
        который оценивает вклад каждого агента в общий результат.
      </p>
      <p className="text-muted-foreground leading-relaxed mt-3">
        «Posthumous» в названии означает, что алгоритм корректно обрабатывает ситуации,
        когда агент выбывает из игры до получения награды. Если защитник «погиб», защищая базу,
        а команда потом победила — MA-POCA ретроспективно присвоит ему часть награды. Это
        критически важно для игр с «гибелью» персонажей.
      </p>
      <p className="text-muted-foreground leading-relaxed mt-3">
        Технически MA-POCA использует attention-механизм для агрегации наблюдений всех агентов
        в команде. Централизованный критик видит состояния всех членов группы, а каждый
        актор принимает решения только на основе своих наблюдений. Это архитектура
        «централизованное обучение — децентрализованное выполнение» (CTDE).
      </p>
    </section>

    <section id="soccer">
      <h2 className="text-2xl font-bold text-foreground mb-3">Пример: Soccer в ML-Agents</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        ML-Agents включает готовый пример Soccer — игру 2v2, где две команды соревнуются
        за мяч. Каждый агент управляется отдельно, но команды получают групповые награды:
        +1 за гол своей команды, -1 за пропущенный. Это идеальный showcase для MA-POCA.
      </p>
      <CyberCodeBlock language="csharp" filename="SoccerGroupSetup.cs">
{`using Unity.MLAgents;

public class SoccerManager : MonoBehaviour
{
    public TeamAgent[] blueTeam;
    public TeamAgent[] purpleTeam;

    private SimpleMultiAgentGroup blueGroup;
    private SimpleMultiAgentGroup purpleGroup;

    void Start()
    {
        blueGroup = new SimpleMultiAgentGroup();
        purpleGroup = new SimpleMultiAgentGroup();

        foreach (var agent in blueTeam)
            blueGroup.RegisterAgent(agent);
        foreach (var agent in purpleTeam)
            purpleGroup.RegisterAgent(agent);
    }

    public void OnGoalScored(int scoringTeamId)
    {
        if (scoringTeamId == 0) // Blue scored
        {
            blueGroup.AddGroupReward(1.0f);
            purpleGroup.AddGroupReward(-1.0f);
        }
        else // Purple scored
        {
            purpleGroup.AddGroupReward(1.0f);
            blueGroup.AddGroupReward(-1.0f);
        }
        blueGroup.EndGroupEpisode();
        purpleGroup.EndGroupEpisode();
    }
}`}
      </CyberCodeBlock>
    </section>

    <section id="yaml">
      <h2 className="text-2xl font-bold text-foreground mb-3">YAML-конфигурация</h2>
      <CyberCodeBlock language="python" filename="soccer_mapoca.yaml">
{`behaviors:
  SoccerPlayer:
    trainer_type: poca          # ← MA-POCA!
    max_steps: 5000000
    time_horizon: 128

    hyperparameters:
      learning_rate: 3.0e-4
      batch_size: 1024
      buffer_size: 10240
      beta: 0.01               # entropy bonus
      epsilon: 0.2

    network_settings:
      normalize: true
      hidden_units: 256
      num_layers: 2
      vis_encode_type: simple

    reward_signals:
      extrinsic:
        gamma: 0.99
        strength: 1.0

    # Self-Play для конкурентного обучения
    self_play:
      save_steps: 50000
      team_change: 200000
      swap_steps: 10000
      window: 10
      play_against_latest_model_ratio: 0.5
      initial_elo: 1200.0`}
      </CyberCodeBlock>
    </section>

    <section id="selfplay">
      <h2 className="text-2xl font-bold text-foreground mb-3">Self-Play для конкурентных задач</h2>
      <p className="text-muted-foreground leading-relaxed">
        Self-Play решает проблему «кого тренировать против кого». Вместо фиксированного противника
        агент играет против копий самого себя разных «возрастов». Это создаёт естественную
        прогрессию сложности: по мере улучшения агента его противники тоже становятся сильнее.
      </p>
      <p className="text-muted-foreground leading-relaxed mt-3">
        Ключевые параметры Self-Play: <code className="text-primary">save_steps</code> — как часто сохранять
        снапшот текущей политики; <code className="text-primary">team_change</code> — как часто менять
        стороны; <code className="text-primary">window</code> — сколько прошлых версий хранить для выборки
        противника. ELO-рейтинг отслеживает прогресс: если ELO растёт — агент улучшается.
      </p>
    </section>

    <section id="tips">
      <h2 className="text-2xl font-bold text-foreground mb-3">Практические советы</h2>
      <p className="text-muted-foreground leading-relaxed">
        <strong className="text-foreground">1. Начните с кооперации.</strong> Обучите команду работать вместе
        до добавления противников. Кооперативное поведение — основа, конкуренция — надстройка.
      </p>
      <p className="text-muted-foreground leading-relaxed mt-3">
        <strong className="text-foreground">2. Индивидуальные + групповые награды.</strong> Комбинируйте
        AddReward (личная) и AddGroupReward (командная). Личная награда за владение мячом,
        командная за голы.
      </p>
      <p className="text-muted-foreground leading-relaxed mt-3">
        <strong className="text-foreground">3. Следите за ELO.</strong> Если ELO перестал расти — обучение
        застопорилось. Попробуйте изменить reward или увеличить window в Self-Play.
      </p>
      <p className="text-muted-foreground leading-relaxed mt-3">
        <strong className="text-foreground">4. Больше шагов.</strong> Мультиагентные задачи требуют
        значительно больше шагов обучения: 5-10 миллионов вместо типичного 1 миллиона.
      </p>
    </section>

    <section id="conclusion">
      <h2 className="text-2xl font-bold text-foreground mb-3">Заключение</h2>
      <p className="text-muted-foreground leading-relaxed">
        MA-POCA открывает двери в мир мультиагентного RL. Кооперативные NPC, конкурентные
        противники, командные стратегии — всё это становится возможным с правильной настройкой.
        Начните с простого 2v2 сценария, убедитесь что агенты учатся координировать действия,
        и постепенно усложняйте. ML-Agents делает это доступным без PhD в мультиагентных системах.
      </p>
    </section>
  {/* Практика: собранная среда лаборатории для этой темы. */}
  <LabPracticeSection contextKey="/blog/mapoca-guide" />

  </BlogLayout>
);

export default BlogMapoca;
