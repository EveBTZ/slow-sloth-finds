import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SlothIcon } from "@/components/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Slow Worker — Marketplace de freelances bilingue FR/EN" },
      {
        name: "description",
        content:
          "Marketplace de freelances qualifiés. Profils riches, dispos en temps réel, sans inscription côté entreprise.",
      },
      {
        property: "og:title",
        content: "Slow Worker — Marketplace de freelances bilingue FR/EN",
      },
      {
        property: "og:description",
        content: "Marketplace de freelances calmes & qualifiés. Bilingue FR / EN.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://slow-sloth-finds.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://slow-sloth-finds.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Slow Worker",
          url: "https://slow-sloth-finds.lovable.app/",
          inLanguage: ["fr", "en"],
          potentialAction: {
            "@type": "SearchAction",
            target:
              "https://slow-sloth-finds.lovable.app/browse?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      },
    ],
  }),
  component: Index,
});


function Index() {
  const { t } = useTranslation();
  const items = t("features.items", { returnObjects: true }) as Array<{
    title: string;
    body: string;
  }>;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-grain">
          <div className="absolute -top-20 -right-20 size-80 rounded-full bg-brand-yellow/40 blur-3xl" />
          <div className="absolute -bottom-32 -left-10 size-96 rounded-full bg-brand-orange/20 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-12 lg:px-8 lg:py-32">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-violet shadow-soft ring-1 ring-border">
                <span className="size-1.5 rounded-full bg-brand-orange" />
                {t("hero.eyebrow")}
              </span>
              <h1 className="mt-6 text-balance font-display text-5xl font-black leading-[0.95] text-secondary sm:text-6xl lg:text-7xl">
                {t("hero.title")}
              </h1>
              <p className="mt-6 max-w-xl text-balance text-lg text-foreground/75">
                {t("hero.subtitle")}
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  to="/browse"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-bold text-primary-foreground shadow-soft transition hover:-translate-y-0.5 hover:shadow-pop"
                >
                  {t("hero.ctaBrowse")} →
                </Link>
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-secondary bg-card px-6 py-3.5 text-base font-bold text-secondary transition hover:bg-secondary hover:text-secondary-foreground"
                >
                  {t("hero.ctaJoin")}
                </Link>
              </div>
            </div>
            <div className="relative lg:col-span-5">
              <div className="relative mx-auto aspect-square w-full max-w-md">
                <div className="absolute inset-0 rotate-3 rounded-[3rem] bg-brand-violet shadow-pop" />
                <div className="absolute inset-0 -rotate-2 rounded-[3rem] bg-brand-yellow" />
                <div className="absolute inset-0 flex items-center justify-center rounded-[3rem] bg-card ring-2 ring-brand-violet">
                  <SlothIcon className="size-56 text-brand-orange" />
                </div>
                <div className="absolute -bottom-4 -right-4 rotate-6 rounded-2xl bg-card px-4 py-3 text-sm font-bold shadow-soft ring-1 ring-border">
                  <span className="mr-2 inline-block size-2 rounded-full bg-success" />
                  Disponible · Available
                </div>
                <div className="absolute -top-4 -left-4 -rotate-3 rounded-2xl bg-card px-4 py-3 text-sm font-bold text-secondary shadow-soft ring-1 ring-border">
                  ✨ Branding · UX · Dev
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Know-what entry point (for companies) */}
        <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
          <Link
            to="/solutions"
            className="group relative flex flex-col items-start gap-4 overflow-hidden rounded-[2rem] border-2 border-secondary bg-card p-8 shadow-soft transition hover:-translate-y-0.5 hover:shadow-pop md:flex-row md:items-center md:justify-between md:p-10"
          >
            <div className="absolute -right-10 -top-10 size-48 rounded-full bg-brand-yellow/40 blur-3xl transition group-hover:bg-brand-orange/30" />
            <div className="relative">
              <span className="inline-flex items-center rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary">
                {t("knowWhat.eyebrow")}
              </span>
              <h2 className="mt-3 font-display text-2xl font-black text-secondary sm:text-3xl">
                {t("knowWhat.title")}
              </h2>
              <p className="mt-2 max-w-xl text-foreground/70">
                {t("knowWhat.subtitle")}
              </p>
            </div>
            <span className="relative inline-flex shrink-0 items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-bold text-secondary-foreground shadow-soft transition group-hover:-translate-y-0.5">
              {t("knowWhat.cta")}
            </span>
          </Link>
        </section>

        {/* Features */}
        <section className="border-y border-border/60 bg-card/50">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <h2 className="text-center font-display text-4xl font-black text-secondary sm:text-5xl">
              {t("features.title")}
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {items.map((item, i) => (
                <div
                  key={i}
                  className="group relative rounded-3xl border border-border bg-card p-8 shadow-soft transition hover:-translate-y-1 hover:shadow-pop"
                >
                  <div
                    className={`mb-5 inline-flex size-12 items-center justify-center rounded-2xl font-display text-xl font-black ${
                      i === 0
                        ? "bg-brand-orange/15 text-brand-orange"
                        : i === 1
                        ? "bg-brand-yellow/30 text-brand-violet"
                        : "bg-brand-violet text-brand-cream"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <h3 className="font-display text-xl font-extrabold text-secondary">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-foreground/70">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-violet p-10 text-brand-cream shadow-pop md:p-16">
            <div className="absolute -right-10 -top-10 size-64 rounded-full bg-brand-orange/40 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 size-64 rounded-full bg-brand-yellow/30 blur-3xl" />
            <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-display text-3xl font-black sm:text-4xl">
                  {t("cta.title")}
                </h2>
                <p className="mt-2 text-brand-cream/80">{t("cta.subtitle")}</p>
              </div>
              <Link
                to="/auth"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-orange px-6 py-3.5 text-base font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-pop"
              >
                {t("cta.button")} →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
