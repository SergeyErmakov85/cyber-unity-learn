import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/landing/Navbar";

const SUPPORT_EMAIL = "support@rlplatform.ru";
/** Дата последнего пересмотра текста. Меняется вручную при правке политики. */
const UPDATED_AT = "23 августа 2026";

const SECTION_CLASS = "space-y-3";
const H2_CLASS =
  "text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent";
const P_CLASS = "text-muted-foreground leading-relaxed";
const UL_CLASS = "space-y-2 list-disc pl-5 text-muted-foreground leading-relaxed";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="Политика конфиденциальности | CyberUnityCode"
      description="Какие данные собирает платформа, зачем они нужны, сколько хранятся и как их удалить."
      path="/privacy"
    />
    <Navbar />

    <main className="container max-w-3xl mx-auto px-4 py-12 space-y-10">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        На главную
      </Link>

      <header className="space-y-4">
        <div
          className="w-16 h-16 rounded-2xl border border-cyan-400/40 bg-cyan-500/10 flex items-center justify-center
                     shadow-[0_0_32px_hsl(var(--primary)/0.45)]"
        >
          <ShieldCheck className="w-9 h-9 text-cyan-400 drop-shadow-[0_0_10px_hsl(var(--primary)/0.7)]" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Политика конфиденциальности
        </h1>
        <p className="text-sm text-muted-foreground">Обновлено: {UPDATED_AT}</p>
        <p className={P_CLASS}>
          Документ описывает, какие данные собирает образовательная платформа CyberUnityCode,
          зачем они нужны, кому передаются и как их удалить.
        </p>
      </header>

      <section className={SECTION_CLASS}>
        <h2 className={H2_CLASS}>1. Какие данные мы собираем</h2>
        <p className={P_CLASS}>
          Без регистрации сайт можно читать целиком: учебные материалы открыты и не требуют
          учётной записи. Персональные данные появляются только там, где вы сами их вводите.
        </p>
        <ul className={UL_CLASS}>
          <li>
            <strong className="text-foreground">Учётная запись.</strong> Адрес электронной почты
            и пароль при регистрации. При входе через Яндекс или Mail.ru — почта и имя из профиля
            провайдера; пароль в этом случае мы не получаем.
          </li>
          <li>
            <strong className="text-foreground">Профиль.</strong> Имя и ссылка на аватар — вы
            указываете их сами и в любой момент можете изменить или стереть.
          </li>
          <li>
            <strong className="text-foreground">Отзывы.</strong> Текст отзыва и оценка, если вы
            решите его оставить. Отзывы видны другим посетителям.
          </li>
          <li>
            <strong className="text-foreground">Подписка на рассылку.</strong> Только адрес почты
            и метка о том, с какой страницы пришла подписка.
          </li>
          <li>
            <strong className="text-foreground">Прогресс обучения.</strong> Пройденные уроки,
            результаты квизов, опыт и достижения хранятся в localStorage вашего браузера и на наши
            серверы не отправляются. Очистка данных сайта в браузере стирает их безвозвратно.
          </li>
          <li>
            <strong className="text-foreground">Статистика посещений.</strong> Обезличенные данные
            о просмотрах страниц — см. раздел 3.
          </li>
        </ul>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className={H2_CLASS}>2. Зачем мы их используем</h2>
        <ul className={UL_CLASS}>
          <li>чтобы вы могли войти в аккаунт и вернуться к своему обучению;</li>
          <li>чтобы отобразить ваш профиль и оставленные вами отзывы;</li>
          <li>чтобы отправлять письма по подписке, если вы на неё согласились;</li>
          <li>чтобы понимать, какие материалы читают, и улучшать курс.</li>
        </ul>
        <p className={P_CLASS}>
          Мы не продаём персональные данные, не передаём их рекламным сетям и не используем для
          автоматического принятия решений, влияющих на ваши права.
        </p>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className={H2_CLASS}>3. Аналитика и cookie</h2>
        <p className={P_CLASS}>
          Сайт использует <strong className="text-foreground">Яндекс.Метрику</strong> — сервис
          веб-аналитики Яндекса. Она собирает обезличенные данные о посещении: просмотренные
          страницы, источник перехода, тип устройства и браузера, приблизительный регион. Для
          этого Метрика записывает cookie. Запись сессий (Вебвизор) отключена.
        </p>
        <p className={P_CLASS}>
          Условия обработки данных Метрикой описаны в документах Яндекса. Отказаться от сбора
          можно, включив в браузере запрет на cookie сторонних сервисов или установив официальное
          дополнение Яндекса для отключения Метрики. На доступ к учебным материалам это не влияет.
        </p>
        <p className={P_CLASS}>
          Кроме аналитических, используются технические cookie: они хранят вашу сессию входа. Без
          них невозможно оставаться авторизованным.
        </p>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className={H2_CLASS}>4. Кому передаются данные</h2>
        <p className={P_CLASS}>Мы пользуемся сторонними сервисами, каждый — для своей задачи:</p>
        <ul className={UL_CLASS}>
          <li>
            <strong className="text-foreground">Supabase</strong> — база данных и аутентификация:
            хранит учётные записи, профили, отзывы и подписки.
          </li>
          <li>
            <strong className="text-foreground">Vercel</strong> — хостинг сайта; обрабатывает
            технические журналы запросов.
          </li>
          <li>
            <strong className="text-foreground">Яндекс.Метрика</strong> — статистика посещений.
          </li>
          <li>
            <strong className="text-foreground">Яндекс ID и Mail.ru</strong> — только если вы
            выбрали вход через них.
          </li>
        </ul>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className={H2_CLASS}>5. Сколько храним</h2>
        <p className={P_CLASS}>
          Данные учётной записи хранятся, пока аккаунт существует. После удаления аккаунта запись
          и связанный профиль удаляются безвозвратно. Адрес в списке рассылки хранится до отписки.
          Обезличенная статистика Метрики хранится по правилам сервиса Яндекса.
        </p>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className={H2_CLASS}>6. Ваши права</h2>
        <p className={P_CLASS}>Вы в любой момент можете:</p>
        <ul className={UL_CLASS}>
          <li>посмотреть и изменить свои данные в личном кабинете;</li>
          <li>
            удалить аккаунт вместе со всеми связанными данными — кнопка удаления находится в{" "}
            <Link to="/dashboard" className="text-primary hover:underline">
              личном кабинете
            </Link>
            ;
          </li>
          <li>отписаться от рассылки по ссылке в письме;</li>
          <li>
            запросить сведения об обработке ваших данных или их удаление письмом на{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
              {SUPPORT_EMAIL}
            </a>
            .
          </li>
        </ul>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className={H2_CLASS}>7. Защита данных</h2>
        <p className={P_CLASS}>
          Соединение с сайтом защищено TLS. Доступ к записям в базе ограничен на уровне строк:
          пользователь видит и меняет только свои данные. Пароли хранятся в виде хешей и в
          открытом виде недоступны даже нам.
        </p>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className={H2_CLASS}>8. Дети</h2>
        <p className={P_CLASS}>
          Платформа рассчитана на аудиторию от 16 лет. Мы сознательно не собираем данные детей
          младшего возраста. Если вы считаете, что ребёнок оставил здесь свои данные, напишите
          нам — мы их удалим.
        </p>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className={H2_CLASS}>9. Изменения политики</h2>
        <p className={P_CLASS}>
          Мы можем обновлять этот документ. Дата последнего пересмотра указана в начале страницы.
          Существенные изменения мы анонсируем на сайте.
        </p>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className={H2_CLASS}>10. Контакты</h2>
        <p className={P_CLASS}>
          Вопросы об обработке данных —{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </section>
    </main>
  </div>
);

export default PrivacyPolicy;
