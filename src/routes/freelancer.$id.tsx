import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AvailabilityBadge, type Availability } from "@/components/AvailabilityBadge";
import { supabase } from "@/integrations/supabase/client";
import { getSignedFileUrl } from "@/lib/storage";
import { ArrowLeft, FileText } from "lucide-react";

interface PublicProfile {
  id: string;
  full_name: string;
  job_title: string;
  bio: string;
  availability: Availability;
  tags: string[];
  hourly_rate_min: number | null;
  hourly_rate_max: number | null;
  currency: string;
  avatar_url: string | null;
  portfolio_url: string | null;
  portfolio_filename: string | null;
}

export const Route = createFileRoute("/freelancer/$id")({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("freelancer_profiles")
      .select(
        "id, full_name, job_title, bio, availability, tags, hourly_rate_min, hourly_rate_max, currency, avatar_url, portfolio_url, portfolio_filename, published",
      )
      .eq("id", params.id)
      .eq("published", true)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw notFound();
    return data as unknown as PublicProfile;
  },
  head: ({ params, loaderData }) => {
    const url = `https://slow-sloth-finds.lovable.app/freelancer/${params.id}`;
    if (!loaderData) {
      return {
        meta: [
          { title: "Profil freelance · Slow Worker" },
          { property: "og:url", content: url },
        ],
        links: [{ rel: "canonical", href: url }],
      };
    }
    const title = `${loaderData.full_name} — ${loaderData.job_title} · Slow Worker`;
    const desc = (loaderData.bio || `${loaderData.job_title} freelance sur Slow Worker.`).slice(0, 155);
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "profile" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            mainEntity: {
              "@type": "Person",
              name: loaderData.full_name,
              jobTitle: loaderData.job_title,
              description: loaderData.bio || undefined,
              knowsAbout: loaderData.tags,
              url,
            },
          }),
        },
      ],
    };
  },
  component: FreelancerProfilePage,
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center text-center">
      <p>{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <p>Profile not found</p>
    </div>
  ),
});

function FreelancerProfilePage() {
  const profile = Route.useLoaderData() as PublicProfile | undefined;
  const { t } = useTranslation();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [portfolioUrl, setPortfolioUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      if (profile?.avatar_url) {
        const u = await getSignedFileUrl("avatars", profile.avatar_url);
        if (active) setAvatarUrl(u);
      }
      if (profile?.portfolio_url) {
        const u = await getSignedFileUrl("portfolios", profile.portfolio_url, 60 * 60 * 24);
        if (active) setPortfolioUrl(u);
      }
    })();
    return () => {
      active = false;
    };
  }, [profile?.avatar_url, profile?.portfolio_url]);

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-16 text-center">
          <h1 className="font-display text-3xl font-black text-secondary">
            {t("profile.notFound")}
          </h1>
          <Link
            to="/browse"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
          >
            <ArrowLeft className="size-4" /> {t("profile.back")}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const initials = profile.full_name
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "·";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/browse"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-orange hover:underline"
        >
          <ArrowLeft className="size-4" /> {t("profile.back")}
        </Link>

        <header className="mt-6 overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
          <div className="h-32 bg-gradient-to-br from-brand-yellow via-brand-orange to-brand-violet" />
          <div className="-mt-12 px-8 pb-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <div className="size-24 overflow-hidden rounded-3xl bg-muted ring-4 ring-card">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center font-display text-3xl font-black text-secondary">
                      {initials}
                    </span>
                  )}
                </div>
                <div className="pb-1">
                  <h1 className="font-display text-3xl font-black text-secondary">
                    {profile.full_name}
                  </h1>
                  <p className="font-semibold text-muted-foreground">{profile.job_title}</p>
                </div>
              </div>
              <AvailabilityBadge status={profile.availability} className="text-sm" />
            </div>

            {(profile.hourly_rate_min || profile.hourly_rate_max) && (
              <p className="mt-6 inline-block rounded-2xl bg-muted px-4 py-2 text-sm font-bold text-secondary">
                {profile.hourly_rate_min && profile.hourly_rate_max
                  ? `${profile.hourly_rate_min}–${profile.hourly_rate_max} ${profile.currency}/h`
                  : `${profile.hourly_rate_min ?? profile.hourly_rate_max} ${profile.currency}/h`}
              </p>
            )}

            {profile.bio && (
              <section className="mt-8">
                <h2 className="font-display text-sm font-extrabold uppercase tracking-wider text-secondary">
                  {t("profile.about")}
                </h2>
                <p className="mt-3 whitespace-pre-line text-foreground/85">{profile.bio}</p>
              </section>
            )}

            {profile.tags.length > 0 && (
              <section className="mt-8">
                <h2 className="font-display text-sm font-extrabold uppercase tracking-wider text-secondary">
                  {t("profile.skills")}
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-brand-cream px-3 py-1.5 text-sm font-bold text-secondary ring-1 ring-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {portfolioUrl && (
              <section className="mt-8">
                <a
                  href={portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-3 text-sm font-bold text-secondary-foreground shadow-soft transition hover:-translate-y-0.5"
                >
                  <FileText className="size-4" /> {t("profile.portfolio")}
                </a>
              </section>
            )}
          </div>
        </header>
      </main>
      <Footer />
    </div>
  );
}
