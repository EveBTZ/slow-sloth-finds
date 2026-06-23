import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FreelancerCard, type FreelancerCardData } from "@/components/FreelancerCard";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";
import type { Availability } from "@/components/AvailabilityBadge";

export const Route = createFileRoute("/browse")({
  head: () => ({
    meta: [
      { title: "Trouver un freelance · Slow Worker" },
      {
        name: "description",
        content:
          "Parcourez la meute de freelances Slow Worker. Filtrez par compétence, disponibilité, spécialité.",
      },
      { property: "og:title", content: "Trouver un freelance · Slow Worker" },
      {
        property: "og:description",
        content: "Annuaire de freelances bilingues FR/EN. Filtrez par skill et dispo.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://slow-sloth-finds.lovable.app/browse" },
    ],
    links: [{ rel: "canonical", href: "https://slow-sloth-finds.lovable.app/browse" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Annuaire des freelances Slow Worker",
          url: "https://slow-sloth-finds.lovable.app/browse",
          about: "Freelance directory",
          inLanguage: ["fr", "en"],
        }),
      },
    ],
  }),
  component: BrowsePage,
});


function BrowsePage() {
  const { t } = useTranslation();
  const [data, setData] = useState<FreelancerCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [availFilter, setAvailFilter] = useState<Availability | "all">("all");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    supabase
      .from("freelancer_profiles")
      .select(
        "id, full_name, job_title, bio, availability, tags, hourly_rate_min, hourly_rate_max, currency, avatar_url",
      )
      .eq("published", true)
      .order("updated_at", { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) console.error(error);
        setData((data as unknown as FreelancerCardData[]) ?? []);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    data.forEach((f) => f.tags.forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [data]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return data.filter((f) => {
      if (availFilter !== "all" && f.availability !== availFilter) return false;
      if (activeTag && !f.tags.includes(activeTag)) return false;
      if (term) {
        const hay = `${f.full_name} ${f.job_title} ${f.bio} ${f.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
  }, [data, q, availFilter, activeTag]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="font-display text-4xl font-black text-secondary sm:text-5xl">
            {t("directory.title")}
          </h1>
          <p className="mt-2 max-w-2xl text-foreground/70">{t("directory.subtitle")}</p>
        </div>

        <div className="mb-8 flex flex-col gap-3 rounded-3xl border border-border bg-card p-3 shadow-soft sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("directory.searchPlaceholder")}
              aria-label={t("directory.searchPlaceholder")}
              className="w-full rounded-2xl bg-transparent py-2.5 pl-11 pr-4 text-sm font-medium outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex gap-2 px-1 sm:px-0">

            <AvailFilter value={availFilter} onChange={setAvailFilter} />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[14rem_1fr]">
          <aside className="space-y-6">
            <div>
              <h2 className="mb-3 font-display text-sm font-extrabold uppercase tracking-wider text-secondary">
                {t("directory.allTags")}
              </h2>

              <div className="flex flex-wrap gap-1.5">
                {allTags.length === 0 && (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 transition ${
                      activeTag === tag
                        ? "bg-brand-violet text-brand-cream ring-brand-violet"
                        : "bg-card text-secondary ring-border hover:bg-muted"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {(activeTag || availFilter !== "all" || q) && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTag(null);
                    setAvailFilter("all");
                    setQ("");
                  }}
                  className="mt-4 text-xs font-bold text-brand-orange hover:underline"
                >
                  {t("directory.clear")} ✕
                </button>
              )}
            </div>
          </aside>

          <section>
            <p className="mb-4 text-sm font-bold text-muted-foreground">
              {filtered.length === 1
                ? t("directory.resultsOne")
                : t("directory.resultsMany", { count: filtered.length })}
            </p>

            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-64 animate-pulse rounded-3xl border border-border bg-card/50"
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-3xl border-2 border-dashed border-border bg-card/50 p-16 text-center">
                <p className="text-foreground/70">{t("directory.empty")}</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((f) => (
                  <FreelancerCard key={f.id} f={f} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function AvailFilter({
  value,
  onChange,
}: {
  value: Availability | "all";
  onChange: (v: Availability | "all") => void;
}) {
  const { t } = useTranslation();
  const opts: Array<{ v: Availability | "all"; label: string }> = [
    { v: "all", label: "Tous · All" },
    { v: "available_now", label: t("availability.available_now") },
    { v: "available_soon", label: t("availability.available_soon") },
    { v: "not_available", label: t("availability.not_available") },
  ];
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-2xl bg-muted p-1">
      {opts.map((o) => (
        <button
          key={o.v}
          type="button"
          onClick={() => onChange(o.v)}
          className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
            value === o.v
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
