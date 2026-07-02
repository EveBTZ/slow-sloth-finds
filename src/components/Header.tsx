import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Logo } from "./Logo";
import { LanguageToggle } from "./LanguageToggle";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export function Header() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/browse">{t("nav.browse")}</NavLink>
          <NavLink to="/solutions">{t("nav.diagnostic")}</NavLink>
          {!user && <NavLink to="/auth">{t("nav.forFreelancers")}</NavLink>}
          {user && <NavLink to="/dashboard">{t("nav.dashboard")}</NavLink>}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          {!loading && !user && (
            <Link
              to="/auth"
              className="hidden rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-soft transition hover:-translate-y-0.5 hover:shadow-pop sm:inline-flex"
            >
              {t("nav.signIn")}
            </Link>
          )}
          {!loading && user && (
            <button
              type="button"
              onClick={() => supabase.auth.signOut()}
              className="hidden rounded-full border border-border bg-card px-4 py-2 text-sm font-bold text-foreground transition hover:bg-muted sm:inline-flex"
            >
              {t("nav.signOut")}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="rounded-full px-3 py-2 text-sm font-bold text-foreground/80 transition hover:bg-muted hover:text-foreground"
      activeProps={{ className: "bg-muted text-foreground" }}
    >
      {children}
    </Link>
  );
}
