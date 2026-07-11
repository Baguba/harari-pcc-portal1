"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { t } from "@/lib/i18n";

export function LanguageToggle() {
  const lang = useApp((s) => s.lang);
  const toggleLang = useApp((s) => s.toggleLang);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLang}
      className="gap-2"
      aria-label={t("common.language", lang)}
      title={t("common.language", lang)}
    >
      <Languages className="h-4 w-4" aria-hidden />
      <span className="font-semibold text-xs">
        {lang === "en" ? "አማ" : "EN"}
      </span>
    </Button>
  );
}
