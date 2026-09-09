import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, Mail } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import { MONETIZATION_ENABLED } from "@/config/monetization";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

const categories: FAQCategory[] = [
  {
    title: "Начало работы",
    items: [
      {
        question: "Нужен ли опыт в Machine Learning для старта?",
        answer:
          "Нет. Уровень 1 начинается с основ RL — что такое агент, среда и награда. Достаточно базового знания Python и математики на уровне школьной программы.",
      },
      {
        question: "Какой стек технологий нужно установить?",
        answer:
          "Python 3.10+, PyTorch 2.x, Unity 2022 LTS, mlagents Python пакет (pip install mlagents). Все версии фиксированы в каждом проекте для воспроизводимости.",
      },
      {
        question: "Работают ли материалы на Windows, Mac и Linux?",
        answer:
          "Да. Unity и PyTorch поддерживают все три ОС. Код в Colab-ноутбуках запускается в облаке без установки.",
      },
    ],
  },
  {
    title: "Обучение и контент",
    items: [
      {
        question: "Сколько времени занимает прохождение каждого уровня?",
        answer:
          "Уровень 1 — ~4 недели (20–30 мин в день). Уровень 2 — ~6 недель. Уровень 3 — ~8 недель. Итого ~18 недель при регулярном обучении.",
      },
      {
        question: "Можно ли скачать код проектов?",
        answer:
          "Да. Каждый проект содержит ссылку на GitHub-репозиторий с полным кодом, фиксированными seed-значениями и requirements.txt.",
      },
      {
        question: "Есть ли видеоуроки или только текст?",
        answer:
          'Основной формат — текст + интерактивный код + визуализации. Видеодемонстрации обучения агентов есть в разделе "Посмотреть в действии".',
      },
    ],
  },
  // Раздел о тарифах показывается только при включённой монетизации.
  ...(MONETIZATION_ENABLED
    ? [
        {
          title: "Тарифы и оплата",
          items: [
            {
              question: "Что входит в бесплатный план?",
              answer:
                "Полный доступ к Уровню 1 (4 урока + 1 проект), 2 сниппета из библиотеки кода, доступ к FAQ и блогу.",
            },
            {
              question: "Можно ли отменить PRO-подписку в любой момент?",
              answer:
                "Да, отмена одним кликом в личном кабинете. Доступ сохраняется до конца оплаченного периода.",
            },
            {
              question: "Есть ли скидка при оплате за год?",
              answer:
                "Да, 20% скидка при годовой оплате. Переключатель «Месяц/Год» есть на странице /pricing.",
            },
          ],
        },
      ]
    : [
        {
          title: "Доступ и стоимость",
          items: [
            {
              question: "Сколько стоит доступ к курсу?",
              answer:
                "Нисколько. Все уроки, проекты, примеры кода и учебник по математике открыты бесплатно — в том числе без регистрации.",
            },
            {
              question: "Зачем тогда регистрироваться?",
              answer:
                "Только ради удобства: аккаунт сохраняет прогресс, XP, бейджи и стрики между устройствами. На доступ к материалам он никак не влияет.",
            },
            {
              question: "Как можно поддержать проект?",
              answer:
                "Добровольным пожертвованием — блок «Поддержать проект» есть на главной странице. Это помогает развивать материалы и держать их открытыми.",
            },
          ],
        },
      ]),
];

const FAQ = () => {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: categories.flatMap((c) =>
      c.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      }))
    ),
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="FAQ | RL Platform — часто задаваемые вопросы"
        description="Ответы на популярные вопросы о курсах по Reinforcement Learning, Unity ML-Agents, PyTorch и обучении с подкреплением."
        path="/faq"
        jsonLd={faqJsonLd}
      />
      <Navbar />

      <main className="container mx-auto px-4 pt-28 pb-20">
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-12 space-y-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            На главную
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-neon bg-clip-text text-transparent">
              Часто задаваемые вопросы
            </span>
          </h1>
        </div>

        {/* Categories */}
        <div className="max-w-3xl mx-auto space-y-10">
          {categories.map((category, catIdx) => (
            <section key={category.title}>
              {catIdx > 0 && (
                <div className="border-t border-border/40 mb-8" />
              )}
              <h2 className="text-xl font-semibold text-foreground mb-5 pl-4 border-l-[3px] border-primary">
                {category.title}
              </h2>

              <Accordion type="single" collapsible className="space-y-2">
                {category.items.map((item, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`${catIdx}-${idx}`}
                    className="border border-border/50 rounded-lg px-4 bg-card/30 hover:bg-card/60 transition-colors data-[state=open]:border-primary/40 data-[state=open]:shadow-[0_0_15px_-5px_hsl(var(--primary)/0.3)]"
                  >
                    <AccordionTrigger className="hover:no-underline text-left text-foreground">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="max-w-3xl mx-auto mt-16 text-center space-y-4 p-8 rounded-2xl border border-border/50 bg-card/30">
          <p className="text-lg font-medium text-foreground">
            Не нашли ответ?
          </p>
          <p className="text-muted-foreground text-sm">
            Напишите нам — мы ответим в течение 24 часов
          </p>
          <Button className="bg-gradient-neon hover:shadow-glow-cyan" asChild>
            <a href="mailto:support@rlplatform.ru">
              <Mail className="w-4 h-4 mr-2" />
              support@rlplatform.ru
            </a>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
