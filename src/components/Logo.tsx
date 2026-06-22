import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <Link to="/" className={`group inline-flex items-center gap-2 ${className}`}>
      <SlothIcon className="size-9 text-brand-orange transition-transform group-hover:-rotate-6" />
      <span className="font-display text-xl font-black tracking-tight text-secondary">
        {t("brand.name")}
      </span>
    </Link>
  );
}

export function SlothIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      {/* branch */}
      <path
        d="M4 14 Q24 6, 60 14"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.45"
      />
      {/* body */}
      <ellipse cx="32" cy="36" rx="14" ry="16" fill="currentColor" />
      {/* face circle */}
      <ellipse cx="32" cy="32" rx="9" ry="9" fill="#FFF3EB" />
      {/* eye masks */}
      <ellipse cx="27.5" cy="31" rx="3" ry="3.5" fill="#2D0033" />
      <ellipse cx="36.5" cy="31" rx="3" ry="3.5" fill="#2D0033" />
      <circle cx="28.4" cy="30" r="0.9" fill="#FFF3EB" />
      <circle cx="37.4" cy="30" r="0.9" fill="#FFF3EB" />
      {/* nose */}
      <path d="M30.5 35 Q32 36.5 33.5 35" stroke="#2D0033" strokeWidth="1.5" strokeLinecap="round" />
      {/* smile */}
      <path d="M29 38.5 Q32 41 35 38.5" stroke="#2D0033" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* arms hugging branch */}
      <path
        d="M22 22 Q18 14 14 14 M42 22 Q46 14 50 14"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
