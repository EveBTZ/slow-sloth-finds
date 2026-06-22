import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { AvailabilityBadge, type Availability } from "./AvailabilityBadge";
import { getSignedFileUrl } from "@/lib/storage";

export interface FreelancerCardData {
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
}

export function FreelancerCard({ f }: { f: FreelancerCardData }) {
  const { t } = useTranslation();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (f.avatar_url) {
      getSignedFileUrl("avatars", f.avatar_url).then((u) => {
        if (active) setAvatarUrl(u);
      });
    }
    return () => {
      active = false;
    };
  }, [f.avatar_url]);

  const initials = f.full_name
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "·";

  return (
    <Link
      to="/freelancer/$id"
      params={{ id: f.id }}
      className="group flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-pop"
    >
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
            <h3 className="font-display text-lg font-extrabold leading-tight text-secondary">
              {f.full_name || "—"}
            </h3>
            <p className="text-sm font-semibold text-muted-foreground">{f.job_title}</p>
          </div>
        </div>
        <AvailabilityBadge status={f.availability} />
      </div>

      {f.bio && (
        <p className="line-clamp-3 text-sm text-foreground/80">{f.bio}</p>
      )}

      {f.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {f.tags.slice(0, 6).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-brand-cream px-2.5 py-1 text-xs font-bold text-secondary ring-1 ring-border"
            >
              {tag}
            </span>
          ))}
          {f.tags.length > 6 && (
            <span className="rounded-full px-2 py-1 text-xs font-bold text-muted-foreground">
              +{f.tags.length - 6}
            </span>
          )}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="text-sm font-bold text-brand-violet">
          {formatRate(f, t)}
        </span>
        <span className="inline-flex items-center gap-1 text-sm font-bold text-brand-orange group-hover:underline">
          {t("card.viewProfile")} →
        </span>
      </div>
    </Link>
  );
}

function formatRate(f: FreelancerCardData, t: ReturnType<typeof useTranslation>["t"]) {
  if (f.hourly_rate_min && f.hourly_rate_max) {
    return t("card.rateRange", {
      min: f.hourly_rate_min,
      max: f.hourly_rate_max,
      currency: f.currency,
    });
  }
  if (f.hourly_rate_min) {
    return `${t("card.rate")} ${t("card.rateFrom", { min: f.hourly_rate_min, currency: f.currency })}`;
  }
  return "—";
}
