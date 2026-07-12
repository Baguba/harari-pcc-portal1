"use client";

import { Languages, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApp, type Lang } from "@/lib/store";

const langOptions: { value: Lang; label: string; shortLabel: string }[] = [
  { value: "en", label: "English", shortLabel: "EN" },
  { value: "am", label: "አማርኛ", shortLabel: "አማ" },
  { value: "om", label: "Afaan Oromoo", shortLabel: "Oro" },
];

export function LanguageToggle() {
  const lang = useApp((s) => s.lang);
  const setLang = useApp((s) => s.setLang);

  const current = langOptions.find((o) => o.value === lang) ?? langOptions[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          aria-label="Language"
        >
          <Languages className="h-4 w-4" aria-hidden />
          <span className="font-semibold text-xs">{current.shortLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {langOptions.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => setLang(opt.value)}
            className="flex items-center justify-between gap-3"
          >
            <span className={lang === opt.value ? "font-semibold" : ""}>
              {opt.label}
            </span>
            {lang === opt.value && (
              <Check className="h-4 w-4 text-primary" aria-hidden />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
