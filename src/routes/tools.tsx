import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const FEEDBACK_LOOP_URL = "https://toolsandskills.lovable.app";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "Outils Slow Worker — Feedback Loop & plus" },
      {
        name: "description",
        content:
          "Découvrez les outils Slow Worker : Feedback Loop pour collecter, traiter et prioriser les remontées produit de vos équipes.",
      },
      { property: "og:title", content: "Outils Slow Worker" },
      {
        property: "og:description",
        content: "Feedback Loop et autres outils Slow Worker pour vos équipes produit.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://slow-sloth-finds.lovable.app/tools" },
    ],
  }),
  component: ToolsPage,
});

function ToolsPage() {
  const { t } = useTranslation();
  const [managedOpen, setManagedOpen] = useState(false);

  const options = [
    { key: "option1", price: 500 },
    { key: "option2", price: 1000 },
    { key: "option3", price: 1500 },
  ] as const;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-grain">
          <div className="absolute -top-20 -left-20 size-80 rounded-full bg-brand-yellow/40 blur-3xl" />
          <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="font-display text-4xl font-black leading-tight text-secondary sm:text-5xl">
                {t("tools.title")}
              </h1>
              <p className="mt-4 text-lg text-foreground/75">{t("tools.subtitle")}</p>
            </div>

            <div className="mt-14 grid gap-6">
              <article className="relative overflow-hidden rounded-3xl border-2 border-border bg-card p-8 shadow-soft md:p-10">
                <div className="absolute -top-16 -right-16 size-56 rounded-full bg-brand-orange/15 blur-3xl" />
                <div className="relative flex flex-col gap-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center rounded-full bg-brand-violet/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-violet">
                        {t("solutions.tool.badge")}
                      </span>
                      <h2 className="mt-3 font-display text-3xl font-black text-secondary">
                        {t("tools.items.feedbackLoop.name")}
                      </h2>
                      <p className="mt-1 text-base font-bold text-brand-orange">
                        {t("tools.items.feedbackLoop.tagline")}
                      </p>
                    </div>
                    <a
                      href={FEEDBACK_LOOP_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex shrink-0 items-center gap-2 rounded-full border-2 border-secondary bg-card px-4 py-2 text-sm font-bold text-secondary transition hover:bg-secondary hover:text-secondary-foreground"
                    >
                      {t("tools.items.feedbackLoop.open")}
                    </a>
                  </div>

                  <p className="text-foreground/75">
                    {t("tools.items.feedbackLoop.description")}
                  </p>

                  <div className="grid gap-3 pt-2 sm:grid-cols-2">
                    <a
                      href={`${FEEDBACK_LOOP_URL}?utm_source=slowworker&utm_medium=tools&utm_campaign=self`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-4 text-center text-sm font-bold text-primary-foreground shadow-soft transition hover:-translate-y-0.5 hover:shadow-pop"
                    >
                      {t("tools.items.feedbackLoop.ctaSelf")}
                    </a>
                    <button
                      type="button"
                      aria-expanded={managedOpen}
                      onClick={() => setManagedOpen((o) => !o)}
                      className={`inline-flex items-center justify-center rounded-2xl border-2 border-brand-violet px-5 py-4 text-center text-sm font-bold transition ${
                        managedOpen
                          ? "bg-brand-violet text-brand-cream"
                          : "bg-card text-brand-violet hover:bg-brand-violet hover:text-brand-cream"
                      }`}
                    >
                      {t("tools.items.feedbackLoop.ctaManaged")}
                    </button>
                  </div>

                  {managedOpen && (
                    <div className="mt-2 rounded-3xl border-2 border-brand-violet/30 bg-brand-cream/60 p-6 md:p-8">
                      <h3 className="font-display text-xl font-black text-secondary">
                        {t("tools.items.feedbackLoop.managed.title")}
                      </h3>
                      <p className="mt-1 text-sm text-foreground/70">
                        {t("tools.items.feedbackLoop.managed.subtitle")}
                      </p>

                      <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {options.map((opt) => {
                          const name = t(`tools.items.feedbackLoop.managed.${opt.key}`);
                          return (
                            <div
                              key={opt.key}
                              className="flex flex-col gap-3 rounded-2xl border-2 border-border bg-card p-5 shadow-soft"
                            >
                              <p className="text-sm font-semibold text-foreground/85">{name}</p>
                              <p className="font-display text-2xl font-black text-brand-violet">
                                {opt.price} €
                                <span className="ml-1 text-sm font-bold text-foreground/60">
                                  {t("tools.items.feedbackLoop.managed.perWeek")}
                                </span>
                              </p>
                              <Link
                                to="/pm-catalog"
                                search={{ formula: opt.price }}
                                className="mt-auto inline-flex items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-soft transition hover:-translate-y-0.5"
                              >
                                {t("tools.items.feedbackLoop.managed.choose")}
                              </Link>
                            </div>
                          );
                        })}

                        <div className="flex flex-col gap-3 rounded-2xl border-2 border-dashed border-brand-violet/50 bg-card p-5">
                          <p className="text-sm font-semibold text-foreground/85">
                            {t("tools.items.feedbackLoop.managed.discuss")}
                          </p>
                          <p className="font-display text-2xl font-black text-brand-violet/70">
                            —
                          </p>
                          <Link
                            to="/pm-catalog"
                            className="mt-auto inline-flex items-center justify-center rounded-full border-2 border-brand-violet bg-card px-4 py-2.5 text-sm font-bold text-brand-violet transition hover:bg-brand-violet hover:text-brand-cream"
                          >
                            {t("tools.items.feedbackLoop.managed.discussCta")}
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            </div>


            <div className="mt-10 text-center">
              <Link
                to="/solutions"
                className="text-sm font-bold text-muted-foreground hover:text-foreground"
              >
                {t("tools.back")}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
