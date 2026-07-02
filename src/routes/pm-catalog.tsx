import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AvailabilityBadge, type Availability } from "@/components/AvailabilityBadge";
import { supabase } from "@/integrations/supabase/client";
import { getSignedFileUrl } from "@/lib/storage";
import { Calendar } from "lucide-react";

interface PMProfile {
  id: string;
  full_name: string;
  job_title: string;
  bio: string;
  availability: Availability;
  avatar_url: string | null;
  calendly_url: string | null;
}

const pmCatalogSearchSchema = z.object({
  formula: z.coerce.number().optional(),
});

export const Route = createFileRoute("/pm-catalog")({
  validateSearch: zodValidator(pmCatalogSearchSchema),
  head: () => ({
    meta: [
      { title: "Catalogue des PM · Slow Worker" },
      {
        name: "description",
        content:
          "Trouvez un Product Manager Slow Worker pour piloter votre Feedback Loop. Prise de rendez-vous directe.",
      },
      { property: "og:title", content: "Catalogue des PM · Slow Worker" },
      {
        property: "og:description",
        content: "Product Managers Slow Worker disponibles pour votre Feedback Loop.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://slow-sloth-finds.lovable.app/pm-catalog" },
    ],
  }),
  component: PMCatalogPage,
});

const AVAILABILITY_ORDER: Record<Availability, number> = {
  available_now: 0,
  available_soon: 1,
  not_available: 2,
};

function PMCatalogPage() {
  const { t } = useTranslation();
  const { formula } = Route.useSearch();
  const [data, setData] = useState<PMProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"all" | "noPref">("all");

  useEffect(() => {
    let active = true;
    setLoading(true);
    supabase
      .from("freelancer_profiles")
      .select("id, full_name, job_title, bio, availability, avatar_url, calendly_url")
      .eq("published", true)
      .eq("job_title", "Product Manager")
      .then(({ data, error }) => {
        if (!active) return;
        if (error) console.error(error);
        setData((data as unknown as PMProfile[]) ?? []);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const list = useMemo(() => {
    const copy = [...data];
    if (mode === "noPref") {
      copy.sort(
        (a, b) => AVAILABILITY_ORDER[a.availability] - AVAILABILITY_ORDER[b.availability],
      );
    }
    return copy;
  }, [data, mode]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-grain">
          <div className="absolute -top-20 -right-20 size-80 rounded-full bg-brand-yellow/30 blur-3xl" />
          <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="font-display text-4xl font-black leading-tight text-secondary sm:text-5xl">
                {t("pmCatalog.title")}
              </h1>
              <p className="mt-4 text-lg text-foreground/75">{t("pmCatalog.subtitle")}</p>
            </div>

            {formula && (
              <div className="mx-auto mt-6 max-w-xl rounded-2xl border-2 border-brand-orange/30 bg-brand-cream/70 p-4 text-center shadow-soft">
                <p className="text-sm font-bold text-secondary">
                  {t("pmCatalog.formulaContext", { price: formula })}
                </p>
              </div>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              {(["all", "noPref"] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setMode(k)}
                  className={`rounded-full px-4 py-2 text-sm font-bold ring-1 transition ${
                    mode === k
                      ? "bg-secondary text-secondary-foreground ring-secondary"
                      : "bg-card text-foreground ring-border hover:bg-muted"
                  }`}
                >
                  {t(`pmCatalog.mode${k === "all" ? "All" : "NoPref"}`)}
                </button>
              ))}
            </div>
            {mode === "noPref" && (
              <p className="mt-3 text-center text-sm text-muted-foreground">
                {t("pmCatalog.noPrefHint")}
              </p>
            )}

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-64 animate-pulse rounded-3xl bg-card" />
                ))
              ) : list.length === 0 ? (
                <p className="sm:col-span-2 lg:col-span-3 rounded-3xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
                  {t("pmCatalog.empty")}
                </p>
              ) : (
                list.map((pm) => <PMCard key={pm.id} pm={pm} />)
              )}
            </div>

            <div className="mt-10 text-center">
              <Link
                to="/tools"
                className="text-sm font-bold text-muted-foreground hover:text-foreground"
              >
                {t("pmCatalog.back")}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function PMCard({ pm }: { pm: PMProfile }) {
  const { t } = useTranslation();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (pm.avatar_url) {
      getSignedFileUrl("avatars", pm.avatar_url).then((u) => {
        if (active) setAvatarUrl(u);
      });
    }
    return () => {
      active = false;
    };
  }, [pm.avatar_url]);

  const initials =
    pm.full_name
      .split(/\s+/)
      .map((s) => s[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "·";

  return (
    <article className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative size-14 overflow-hidden rounded-2xl bg-muted ring-2 ring-background">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-lg font-black text-secondary">
                {initials}
              </span>
            )}
          </div>
          <div>
            <h2 className="font-display text-lg font-extrabold leading-tight text-secondary">
              {pm.full_name || "—"}
            </h2>
            <p className="text-sm font-semibold text-muted-foreground">{pm.job_title}</p>
          </div>
        </div>
        <AvailabilityBadge status={pm.availability} />
      </div>

      {pm.bio && <p className="line-clamp-4 text-sm text-foreground/80">{pm.bio}</p>}

      <div className="mt-auto pt-2">
        {pm.calendly_url ? (
          <a
            href={pm.calendly_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-soft transition hover:-translate-y-0.5"
          >
            <Calendar className="size-4" />
            {t("pmCatalog.book")}
          </a>
        ) : (
          <span className="inline-flex w-full items-center justify-center rounded-full border border-dashed border-border bg-muted px-4 py-2.5 text-xs font-bold text-muted-foreground">
            {t("pmCatalog.noCalendly")}
          </span>
        )}
      </div>
    </article>
  );
}
