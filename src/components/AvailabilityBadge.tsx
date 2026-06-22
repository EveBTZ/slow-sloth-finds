import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export type Availability = "available_now" | "available_soon" | "not_available";

export function AvailabilityBadge({
  status,
  className,
}: {
  status: Availability;
  className?: string;
}) {
  const { t } = useTranslation();
  const styles: Record<Availability, string> = {
    available_now: "bg-success/15 text-success ring-success/30",
    available_soon: "bg-brand-yellow/25 text-brand-violet ring-brand-yellow/50",
    not_available: "bg-destructive/15 text-destructive ring-destructive/30",
  };
  const dot: Record<Availability, string> = {
    available_now: "bg-success",
    available_soon: "bg-brand-yellow",
    not_available: "bg-destructive",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1",
        styles[status],
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", dot[status])} />
      {t(`availability.${status}`)}
    </span>
  );
}
