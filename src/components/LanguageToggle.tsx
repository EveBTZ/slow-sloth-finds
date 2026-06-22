import { useTranslation } from "react-i18next";

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const current = i18n.resolvedLanguage ?? "fr";

  function setLang(lng: "fr" | "en") {
    i18n.changeLanguage(lng);
    try {
      localStorage.setItem("sw-lang", lng);
    } catch {}
  }

  return (
    <div className="inline-flex items-center rounded-full bg-muted p-0.5 text-xs font-bold">
      {(["fr", "en"] as const).map((lng) => (
        <button
          key={lng}
          type="button"
          onClick={() => setLang(lng)}
          className={`rounded-full px-2.5 py-1 uppercase transition ${
            current === lng
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {lng}
        </button>
      ))}
    </div>
  );
}
