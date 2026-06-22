import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/slow-worker-logo.asset.json";

export function Logo({ className = "" }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <Link to="/" className={`group inline-flex items-center ${className}`} aria-label={t("brand.name")}>
      <img
        src={logoAsset.url}
        alt={t("brand.name")}
        className="h-10 w-auto transition-transform group-hover:-rotate-3"
      />
    </Link>
  );
}

export function SlothIcon({ className = "" }: { className?: string }) {
  return (
    <img src={logoAsset.url} alt="" aria-hidden className={className} />
  );
}
