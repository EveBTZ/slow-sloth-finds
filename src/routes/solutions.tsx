import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title: "Choisir sa solution — Slow Worker" },
      {
        name: "description",
        content:
          "Outil clé en main ou freelance sur-mesure : choisissez la solution Slow Worker adaptée à votre besoin.",
      },
      { property: "og:title", content: "Choisir sa solution — Slow Worker" },
      {
        property: "og:description",
        content: "Outil ou freelance : deux façons d'avancer avec Slow Worker.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://slow-sloth-finds.lovable.app/solutions" },
    ],
  }),
  component: SolutionsPage,
});

function SolutionsPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-grain">
          <div className="absolute -top-20 -right-20 size-80 rounded-full bg-brand-yellow/40 blur-3xl" />
          <div className="absolute -bottom-32 -left-10 size-96 rounded-full bg-brand-orange/20 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="font-display text-4xl font-black leading-tight text-secondary sm:text-5xl">
                {t("solutions.title")}
              </h1>
              <p className="mt-4 text-lg text-foreground/75">
                {t("solutions.subtitle")}
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2">
              <Link
                to="/tools"
                className="group relative flex flex-col rounded-3xl border-2 border-border bg-card p-8 shadow-soft transition hover:-translate-y-1 hover:border-brand-orange hover:shadow-pop"
              >
                <span className="inline-flex w-fit items-center rounded-full bg-brand-orange/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-orange">
                  {t("solutions.tool.badge")}
                </span>
                <h2 className="mt-5 font-display text-2xl font-black text-secondary">
                  {t("solutions.tool.title")}
                </h2>
                <p className="mt-3 flex-1 text-foreground/70">
                  {t("solutions.tool.body")}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 font-bold text-brand-orange">
                  {t("solutions.tool.cta")} →
                </span>
              </Link>

              <Link
                to="/browse"
                className="group relative flex flex-col rounded-3xl border-2 border-border bg-card p-8 shadow-soft transition hover:-translate-y-1 hover:border-brand-violet hover:shadow-pop"
              >
                <span className="inline-flex w-fit items-center rounded-full bg-brand-violet/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-violet">
                  {t("solutions.freelance.badge")}
                </span>
                <h2 className="mt-5 font-display text-2xl font-black text-secondary">
                  {t("solutions.freelance.title")}
                </h2>
                <p className="mt-3 flex-1 text-foreground/70">
                  {t("solutions.freelance.body")}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 font-bold text-brand-violet">
                  {t("solutions.freelance.cta")} →
                </span>
              </Link>
            </div>

            <div className="mt-10 text-center">
              <Link
                to="/"
                className="text-sm font-bold text-muted-foreground hover:text-foreground"
              >
                {t("solutions.back")}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
