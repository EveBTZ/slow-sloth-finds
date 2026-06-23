import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AvailabilityBadge, type Availability } from "@/components/AvailabilityBadge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { extractTagsFromPdf, extractTagsFromText } from "@/lib/ai.functions";
import { useServerFn } from "@tanstack/react-start";
import { getOwnerSignedFileUrl } from "@/lib/storage";
import { Upload, FileText, Trash2, X, Plus, Eye, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Mon espace · Slow Worker" }] }),
  component: DashboardPage,
});

interface Profile {
  id: string;
  full_name: string;
  job_title: string;
  bio: string;
  availability: Availability;
  hourly_rate_min: number | null;
  hourly_rate_max: number | null;
  currency: string;
  avatar_url: string | null;
  tags: string[];
  portfolio_url: string | null;
  portfolio_filename: string | null;
  published: boolean;
}

function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"profile" | "portfolio" | "preview">("profile");

  const refresh = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("freelancer_profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    if (error) {
      toast.error(error.message);
      return;
    }
    if (!data) {
      const { data: ins } = await supabase
        .from("freelancer_profiles")
        .insert({ id: user.id, full_name: "", job_title: "" })
        .select("*")
        .single();
      setProfile(ins as unknown as Profile);
    } else {
      setProfile(data as unknown as Profile);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (loading || !profile) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <div className="mx-auto w-full max-w-4xl flex-1 animate-pulse px-4 py-12">
          <div className="h-72 rounded-3xl bg-card" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-black text-secondary">
              {t("dashboard.title")}
            </h1>
            <p className="mt-1 text-foreground/70">{t("dashboard.subtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                profile.published
                  ? "bg-success/15 text-success"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {profile.published ? "● " + t("dashboard.published") : t("dashboard.draft")}
            </span>
            <PublishButton profile={profile} onChange={refresh} />
            {profile.published && (
              <Link
                to="/freelancer/$id"
                params={{ id: profile.id }}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:bg-muted"
              >
                <ExternalLink className="size-3.5" /> Public
              </Link>
            )}
          </div>
        </div>

        <div className="mt-6 inline-flex gap-1 rounded-2xl bg-muted p-1">
          {(["profile", "portfolio", "preview"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                tab === k
                  ? "bg-card text-secondary shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(`dashboard.tabs.${k}`)}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "profile" && <ProfileTab profile={profile} onSaved={refresh} />}
          {tab === "portfolio" && <PortfolioTab profile={profile} onChange={refresh} />}
          {tab === "preview" && <PreviewTab profile={profile} />}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function PublishButton({ profile, onChange }: { profile: Profile; onChange: () => void }) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        const { error } = await supabase
          .from("freelancer_profiles")
          .update({ published: !profile.published })
          .eq("id", profile.id);
        setBusy(false);
        if (error) toast.error(error.message);
        else {
          toast.success(profile.published ? t("dashboard.unpublish") : t("dashboard.published"));
          onChange();
        }
      }}
      className={`rounded-full px-4 py-2 text-xs font-bold transition ${
        profile.published
          ? "border border-border bg-card text-foreground hover:bg-muted"
          : "bg-primary text-primary-foreground hover:-translate-y-0.5 shadow-soft"
      }`}
    >
      {profile.published ? t("dashboard.unpublish") : t("dashboard.publish")}
    </button>
  );
}

function ProfileTab({ profile, onSaved }: { profile: Profile; onSaved: () => void }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(profile);
  const [saving, setSaving] = useState(false);

  useEffect(() => setForm(profile), [profile]);

  async function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const path = `${profile.id}/avatar-${Date.now()}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, {
      upsert: true,
      contentType: file.type,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    setForm((f) => ({ ...f, avatar_url: path }));
    toast.success("Avatar uploaded");
  }

  async function save() {
    setSaving(true);
    const { error } = await supabase
      .from("freelancer_profiles")
      .update({
        full_name: form.full_name,
        job_title: form.job_title,
        bio: form.bio.slice(0, 500),
        availability: form.availability,
        hourly_rate_min: form.hourly_rate_min || null,
        hourly_rate_max: form.hourly_rate_max || null,
        currency: form.currency || "EUR",
        avatar_url: form.avatar_url,
      })
      .eq("id", profile.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success(t("dashboard.saved"));
      onSaved();
    }
  }

  return (
    <div className="grid gap-6 rounded-3xl border border-border bg-card p-6 shadow-soft md:grid-cols-2">
      <Field
        label={t("dashboard.fields.fullName")}
        value={form.full_name}
        onChange={(v) => setForm({ ...form, full_name: v })}
      />
      <Field
        label={t("dashboard.fields.jobTitle")}
        value={form.job_title}
        onChange={(v) => setForm({ ...form, job_title: v })}
      />
      <div className="md:col-span-2">
        <FieldLabel>{t("dashboard.fields.bio")}</FieldLabel>
        <textarea
          value={form.bio}
          maxLength={500}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          rows={4}
          className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {t("dashboard.fields.bioHint")} · {form.bio.length}/500
        </p>
      </div>

      <div>
        <FieldLabel>{t("dashboard.fields.availability")}</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {(["available_now", "available_soon", "not_available"] as Availability[]).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setForm({ ...form, availability: a })}
              className={`rounded-full px-3 py-1.5 text-xs font-bold ring-1 transition ${
                form.availability === a
                  ? "bg-secondary text-secondary-foreground ring-secondary"
                  : "bg-card text-foreground ring-border hover:bg-muted"
              }`}
            >
              {t(`availability.${a}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Field
          label={t("dashboard.fields.rateMin")}
          type="number"
          value={form.hourly_rate_min?.toString() ?? ""}
          onChange={(v) => setForm({ ...form, hourly_rate_min: v ? Number(v) : null })}
        />
        <Field
          label={t("dashboard.fields.rateMax")}
          type="number"
          value={form.hourly_rate_max?.toString() ?? ""}
          onChange={(v) => setForm({ ...form, hourly_rate_max: v ? Number(v) : null })}
        />
        <Field
          label={t("dashboard.fields.currency")}
          value={form.currency}
          onChange={(v) => setForm({ ...form, currency: v.toUpperCase().slice(0, 3) })}
        />
      </div>

      <div>
        <FieldLabel>{t("dashboard.fields.avatar")}</FieldLabel>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-bold hover:bg-muted">
          <Upload className="size-4" /> Upload
          <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
        </label>
      </div>

      <div className="flex justify-end md:col-span-2">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-soft transition hover:-translate-y-0.5 disabled:opacity-50"
        >
          {saving ? "…" : t("dashboard.save")}
        </button>
      </div>
    </div>
  );
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    const chunk = bytes.subarray(offset, offset + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

function PortfolioTab({ profile, onChange }: { profile: Profile; onChange: () => void }) {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const extractFn = useServerFn(extractTagsFromText);
  const extractPdfFn = useServerFn(extractTagsFromPdf);
  const [newTag, setNewTag] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error(t("errors.notPdf"));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error(t("errors.pdfTooLarge"));
      return;
    }
    setUploading(true);
    try {
      const path = `${profile.id}/portfolio-${Date.now()}.pdf`;
      const { error: upErr } = await supabase.storage
        .from("portfolios")
        .upload(path, file, { upsert: true, contentType: "application/pdf" });
      if (upErr) throw upErr;

      // remove old file
      if (profile.portfolio_url && profile.portfolio_url !== path) {
        await supabase.storage.from("portfolios").remove([profile.portfolio_url]);
      }

      // Extract selectable PDF text first, then fall back to visual PDF analysis.
      setExtracting(true);
      const arrayBuffer = await file.arrayBuffer();
      let cleaned = "";
      let textExtractionError: string | null = null;
      try {
        const { extractText, getDocumentProxy } = await import("unpdf");
        const buf = new Uint8Array(arrayBuffer);
        const pdf = await getDocumentProxy(buf);
        const { text } = await extractText(pdf, { mergePages: true });
        cleaned = (Array.isArray(text) ? text.join("\n") : text).trim();
      } catch (error: any) {
        console.error(error);
        textExtractionError = error?.message ?? "unknown";
      }

      let tags: string[] = [];
      let extractionSource: "text" | "visual" | "none" = "none";
      if (cleaned.length > 50) {
        try {
          const out = await extractFn({ data: { text: cleaned } });
          tags = out.tags;
          if (tags.length > 0) extractionSource = "text";
        } catch (e: any) {
          console.error(e);
          textExtractionError = e?.message ?? "unknown";
        }
      }

      if (tags.length === 0) {
        if (cleaned.length <= 50) {
          toast.info("Texte PDF peu exploitable : lecture visuelle du dossier lancée.");
        } else if (textExtractionError) {
          toast.info("Extraction texte indisponible : lecture visuelle du dossier lancée.");
        } else {
          toast.info("Aucune compétence trouvée dans le texte : lecture visuelle du dossier lancée.");
        }
        try {
          const out = await extractPdfFn({
            data: {
              filename: file.name,
              fileData: `data:application/pdf;base64,${arrayBufferToBase64(arrayBuffer)}`,
            },
          });
          tags = out.tags;
          if (tags.length > 0) extractionSource = "visual";
        } catch (e: any) {
          console.error(e);
          toast.error("Lecture visuelle du PDF impossible : " + (e?.message ?? "erreur inconnue"));
        }
      }

      const merged = Array.from(new Set([...(profile.tags ?? []), ...tags]));

      const { error: updErr } = await supabase
        .from("freelancer_profiles")
        .update({
          portfolio_url: path,
          portfolio_filename: file.name,
          tags: merged,
        })
        .eq("id", profile.id);
      if (updErr) throw updErr;

      if (tags.length > 0) {
        const mode = extractionSource === "visual" ? " par lecture visuelle" : "";
        toast.success(`Dossier de compétences uploadé · ${tags.length} compétences extraites${mode}`);
      } else {
        toast.warning(
          "Dossier de compétences uploadé · aucune compétence extraite automatiquement. Vous pouvez les ajouter manuellement."
        );
      }
      onChange();
    } catch (e: any) {
      toast.error(e?.message ?? t("errors.generic"));
    } finally {
      setUploading(false);
      setExtracting(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function removeFile() {
    if (!profile.portfolio_url) return;
    await supabase.storage.from("portfolios").remove([profile.portfolio_url]);
    await supabase
      .from("freelancer_profiles")
      .update({ portfolio_url: null, portfolio_filename: null })
      .eq("id", profile.id);
    onChange();
  }

  async function removeTag(tag: string) {
    const next = profile.tags.filter((tg) => tg !== tag);
    await supabase.from("freelancer_profiles").update({ tags: next }).eq("id", profile.id);
    onChange();
  }

  async function addTag() {
    const v = newTag.trim();
    if (!v) return;
    if (profile.tags.includes(v)) {
      setNewTag("");
      return;
    }
    await supabase
      .from("freelancer_profiles")
      .update({ tags: [...profile.tags, v] })
      .eq("id", profile.id);
    setNewTag("");
    onChange();
  }

  const [portfolioLink, setPortfolioLink] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    if (profile.portfolio_url) {
      getOwnerSignedFileUrl("portfolios", profile.portfolio_url, 60 * 60).then((u) => {
        if (active) setPortfolioLink(u);
      });
    } else {
      setPortfolioLink(null);
    }
    return () => {
      active = false;
    };
  }, [profile.portfolio_url]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <h2 className="font-display text-xl font-extrabold text-secondary">
          {t("dashboard.portfolio.title")}
        </h2>
        <p className="mt-1 text-sm text-foreground/70">{t("dashboard.portfolio.subtitle")}</p>

        {profile.portfolio_url ? (
          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl bg-muted/60 p-4">
            <FileText className="size-5 text-brand-orange" />
            <div className="flex-1 text-sm">
              <div className="font-bold text-secondary">{profile.portfolio_filename}</div>
              {portfolioLink && (
                <a
                  href={portfolioLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-brand-orange hover:underline"
                >
                  Open ↗
                </a>
              )}
            </div>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold hover:bg-muted"
            >
              {t("dashboard.portfolio.replace")}
            </button>
            <button
              type="button"
              onClick={removeFile}
              className="rounded-full bg-destructive/10 px-3 py-1.5 text-xs font-bold text-destructive hover:bg-destructive/20"
            >
              <Trash2 className="inline size-3.5" />
            </button>
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border-2 border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">{t("dashboard.portfolio.noFile")}</p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:-translate-y-0.5"
            >
              <Upload className="size-4" /> {t("dashboard.portfolio.upload")}
            </button>
            <p className="mt-2 text-xs text-muted-foreground">{t("dashboard.portfolio.maxSize")}</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFile}
        />
        {(uploading || extracting) && (
          <div className="mt-4 rounded-2xl bg-brand-yellow/20 p-3 text-sm font-bold text-secondary">
            {extracting ? t("dashboard.portfolio.extracting") : t("dashboard.portfolio.uploading")}
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <h2 className="font-display text-xl font-extrabold text-secondary">
          {t("dashboard.tags.title")}
        </h2>
        <p className="mt-1 text-sm text-foreground/70">{t("dashboard.tags.subtitle")}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {profile.tags.length === 0 && (
            <span className="text-sm text-muted-foreground">{t("dashboard.tags.empty")}</span>
          )}
          {profile.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => removeTag(tag)}
              className="group inline-flex items-center gap-1 rounded-full bg-brand-cream px-3 py-1.5 text-sm font-bold text-secondary ring-1 ring-border hover:bg-destructive/10 hover:text-destructive hover:ring-destructive/30"
            >
              {tag}
              <X className="size-3 opacity-0 transition group-hover:opacity-100" />
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTag();
          }}
          className="mt-4 flex gap-2"
        >
          <input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder={t("dashboard.tags.placeholder")}
            className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1 rounded-full bg-secondary px-4 py-2 text-sm font-bold text-secondary-foreground"
          >
            <Plus className="size-4" /> {t("dashboard.tags.add")}
          </button>
        </form>
      </div>
    </div>
  );
}

function PreviewTab({ profile }: { profile: Profile }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
      <div className="mx-auto max-w-sm">
        <PreviewCard p={profile} />
      </div>
    </div>
  );
}

function PreviewCard({ p }: { p: Profile }) {
  const initials =
    p.full_name
      .split(/\s+/)
      .map((s) => s[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "·";
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-muted font-display text-lg font-black text-secondary">
            {initials}
          </div>
          <div>
            <h3 className="font-display text-lg font-extrabold text-secondary">
              {p.full_name || "—"}
            </h3>
            <p className="text-sm font-semibold text-muted-foreground">{p.job_title}</p>
          </div>
        </div>
        <AvailabilityBadge status={p.availability} />
      </div>
      {p.bio && <p className="line-clamp-3 text-sm text-foreground/80">{p.bio}</p>}
      <div className="flex flex-wrap gap-1.5">
        {p.tags.slice(0, 6).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-brand-cream px-2.5 py-1 text-xs font-bold text-secondary ring-1 ring-border"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-secondary">
      {children}
    </span>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}
