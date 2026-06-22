import { useTranslation } from "react-i18next";
import { Logo } from "./Logo";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row sm:px-6 lg:px-8">
        <Logo />
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Slow Worker. {t("footer.rights")}
        </p>
        <p className="text-sm font-bold text-brand-orange">{t("footer.made")}</p>
      </div>
    </footer>
  );
}
