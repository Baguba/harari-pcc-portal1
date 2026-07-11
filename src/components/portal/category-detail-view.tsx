"use client";

import { useMemo, useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Users,
  Building,
  Wrench,
  FileText,
  Lock,
  CheckCircle2,
  Circle,
  RotateCcw,
  ShieldCheck,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useApp } from "@/lib/store";
import { t } from "@/lib/i18n";
import { directive } from "@/lib/data";
import {
  activityGroups,
  isMonopolyCategory,
  type LicenseCategory,
} from "@/lib/types";
import { splitRequirementItems } from "@/lib/data";
import { ActivityIcon } from "./activity-icon";

interface Props {
  code: string;
  num: number;
}

export function CategoryDetailView({ code, num }: Props) {
  const lang = useApp((s) => s.lang);
  const setView = useApp((s) => s.setView);
  const [category, setCategory] = useState<LicenseCategory | null>(null);

  useEffect(() => {
    // Load categories dynamically (they're already in client bundle via lib/data)
    import("@/lib/data").then((m) => {
      const c = m.categories.find((x) => x.code === code && x.num === num);
      setCategory(c || null);
    });
  }, [code, num]);

  // Self-check state — persisted per category (code+num) in localStorage
  const storageKey = `mcit:selfcheck:${code}:${num}`;
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(checked));
    } catch {
      /* ignore */
    }
  }, [checked, storageKey]);

  const group = useMemo(
    () => activityGroups.find((g) => g.codes.includes(code)) || null,
    [code]
  );

  if (!category) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-20 text-center text-muted-foreground">
        {t("common.loading", lang)}
      </div>
    );
  }

  const monopoly = isMonopolyCategory(category);

  // Build requirement sections
  const personnelItems = splitRequirementItems(category.personnel);
  const facilityItems = splitRequirementItems(category.facility);
  const equipmentItems = splitRequirementItems(category.equipment);
  const documentItems = splitRequirementItems(category.documents);

  // Self-check totals
  const allItems = [
    ...personnelItems.map((t) => ({ section: "personnel", t })),
    ...facilityItems.map((t) => ({ section: "facility", t })),
    ...equipmentItems.map((t) => ({ section: "equipment", t })),
    ...documentItems.map((t) => ({ section: "documents", t })),
  ];
  const totalItems = allItems.length;
  const checkedCount = allItems.filter((it) =>
    checked[`${it.section}:${it.t}`]
  ).length;
  const percent = totalItems === 0 ? 0 : Math.round((checkedCount / totalItems) * 100);
  const isReady = percent === 100;

  const toggle = (key: string) =>
    setChecked((p) => ({ ...p, [key]: !p[key] }));

  const reset = () => setChecked({});

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb / back */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setView({ name: "categories" })}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t("nav.categories", lang)}
        </Button>
        {group && (
          <Badge variant="secondary" className="gap-1.5">
            <ActivityIcon name={group.icon} className="h-3 w-3" />
            {lang === "en" ? group.label_en : group.label_am}
          </Badge>
        )}
      </div>

      {/* Title */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <Badge variant="outline" className="font-mono text-base font-semibold">
            {category.code}
          </Badge>
          {monopoly && (
            <Badge
              variant="secondary"
              className="bg-accent/20 text-accent-foreground border-accent/30 gap-1"
            >
              <Lock className="h-3 w-3" aria-hidden />
              {t("cat.monopoly_badge", lang)}
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            #{category.num} / 45
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          {category.title_en}
        </h1>
        <p className="text-base text-muted-foreground amharic" lang="am">
          {category.title_am}
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Main column */}
        <div className="space-y-6 min-w-0">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" aria-hidden />
                {t("detail.description", lang)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="text-sm leading-relaxed amharic whitespace-pre-line"
                lang="am"
              >
                {category.description}
              </div>
            </CardContent>
          </Card>

          {/* Monopoly notice (replaces checklist) */}
          {monopoly ? (
            <Card className="border-accent/40 bg-accent/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-accent-foreground">
                  <Lock className="h-5 w-5" aria-hidden />
                  {t("detail.cta.cannot_apply", lang)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-accent/15 border border-accent/30 p-4 mb-4">
                  <p className="text-sm leading-relaxed amharic" lang="am">
                    {category.licensing_condition}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("detail.monopoly.notice", lang)}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Requirement sections */}
              <RequirementSection
                title={t("detail.personnel", lang)}
                icon={Users}
                items={personnelItems}
                sectionKey="personnel"
                checked={checked}
                onToggle={toggle}
                lang={lang}
              />
              <RequirementSection
                title={t("detail.facility", lang)}
                icon={Building}
                items={facilityItems}
                sectionKey="facility"
                checked={checked}
                onToggle={toggle}
                lang={lang}
              />
              {equipmentItems.length > 0 && (
                <RequirementSection
                  title={t("detail.equipment", lang)}
                  icon={Wrench}
                  items={equipmentItems}
                  sectionKey="equipment"
                  checked={checked}
                  onToggle={toggle}
                  lang={lang}
                />
              )}
              <RequirementSection
                title={t("detail.documents", lang)}
                icon={FileText}
                items={documentItems}
                sectionKey="documents"
                checked={checked}
                onToggle={toggle}
                lang={lang}
              />

              {/* Self-check tool */}
              <Card className="border-primary/30 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" aria-hidden />
                    {t("detail.selfcheck.title", lang)}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {t("detail.selfcheck.subtitle", lang)}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="font-medium">
                        {t("detail.selfcheck.progress", lang)}
                      </span>
                      <span
                        className={`font-bold ${
                          isReady
                            ? "text-primary"
                            : percent >= 50
                              ? "text-accent-foreground"
                              : "text-muted-foreground"
                        }`}
                      >
                        {percent}%
                      </span>
                    </div>
                    <Progress
                      value={percent}
                      className="h-2"
                      aria-label={t("detail.selfcheck.progress", lang)}
                    />
                    <div className="mt-2 text-xs">
                      {isReady ? (
                        <span className="text-primary font-medium flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                          {t("detail.selfcheck.ready", lang)} ({checkedCount}/{totalItems})
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          {t("detail.selfcheck.missing", lang)}: {totalItems - checkedCount} / {totalItems}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={reset}
                      variant="outline"
                      className="gap-1.5"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                      {t("detail.selfcheck.reset", lang)}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        setView({ name: "apply", code, num })
                      }
                      className="gap-1.5 ml-auto"
                      disabled={percent < 50}
                    >
                      {t("detail.cta.apply", lang)}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </Button>
                  </div>
                  {percent < 50 && (
                    <p className="text-[11px] text-muted-foreground">
                      {lang === "en"
                        ? "Reach at least 50% readiness to start an application."
                        : "ማመልከቻ ለመጀመር ቢያንስ 50% ዝግጁነት ይኑርዎት።"}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Apply CTA */}
              <Card className="border-accent/30">
                <CardContent className="p-5 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="font-semibold text-sm mb-1">
                      {t("detail.cta.apply", lang)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {lang === "en"
                        ? "Submit your application with the required documents."
                        : "ማመልከቻዎን ከሚገቡ ሰነዶች ጋር ያስገቡ።"}
                    </div>
                  </div>
                  <Button
                    onClick={() =>
                      setView({ name: "apply", code, num })
                    }
                    className="gap-2"
                  >
                    {t("nav.apply", lang)}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Sidebar — general rules */}
        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" aria-hidden />
                {lang === "en" ? "General rules" : "አጠቃላይ ህጎች"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  <Calendar className="h-3.5 w-3.5" aria-hidden />
                  {t("detail.sidebar.validity", lang)}
                </div>
                <p className="text-xs leading-relaxed">
                  {directive.validity_period_en}
                </p>
              </div>
              <Separator />
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden />
                  {t("detail.sidebar.renewal", lang)}
                </div>
                <p className="text-xs leading-relaxed">
                  {directive.renewal_en}
                </p>
              </div>
              <Separator />
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  <FileText className="h-3.5 w-3.5" aria-hidden />
                  {t("detail.sidebar.standard_docs", lang)}
                </div>
                <Accordion type="multiple" className="w-full">
                  <AccordionItem value="docs" className="border-0">
                    <AccordionTrigger className="text-xs py-2 hover:no-underline">
                      {directive.standard_required_documents_en.length}{" "}
                      {lang === "en" ? "documents" : "ሰነዶች"}
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="text-[11px] space-y-1.5 list-disc pl-4">
                        {directive.standard_required_documents_en.map((d, i) => (
                          <li key={i} className="leading-relaxed">{d}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/5 border-secondary/20">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground leading-relaxed">
                {lang === "en"
                  ? "A certificate is valid for 1 year and must be renewed for the same period after expiry. No certificate is granted until all requirements are verified."
                  : "ሰርቲፊኬቱ 1 ዓመት ይከናወናል እና ካለቀ በኋላ ለተመሳሳይ ጊዜ መነሳት ይኖርበታል። ሁሉም መስፈርቶች ከመረጋገጣቸው በፊት ምንም ሰርቲፊኬት አይሰጥም።"}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  icon: typeof Users;
  items: string[];
  sectionKey: string;
  checked: Record<string, boolean>;
  onToggle: (key: string) => void;
  lang: "en" | "am";
}

function RequirementSection({
  title,
  icon: Icon,
  items,
  sectionKey,
  checked,
  onToggle,
  lang,
}: SectionProps) {
  if (items.length === 0) return null;
  const checkedCount = items.filter((t) => checked[`${sectionKey}:${t}`]).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" aria-hidden />
            {title}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {checkedCount} / {items.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1.5">
          {items.map((item, i) => {
            const key = `${sectionKey}:${item}`;
            const isChecked = !!checked[key];
            return (
              <li key={i}>
                <label
                  className={`flex items-start gap-2.5 p-2 rounded-md cursor-pointer transition-colors hover:bg-muted/60 ${
                    isChecked ? "bg-primary/5" : ""
                  }`}
                >
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={isChecked}
                    onClick={() => onToggle(key)}
                    className="mt-0.5 flex-shrink-0"
                  >
                    {isChecked ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground/60" aria-hidden />
                    )}
                  </button>
                  <span
                    className={`text-sm leading-relaxed amharic flex-1 ${
                      isChecked ? "line-through text-muted-foreground" : ""
                    }`}
                    lang="am"
                  >
                    {item}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
        {lang === "am" && items.length > 5 && (
          <p className="text-[10px] text-muted-foreground mt-3 italic">
            Tip: የእያንዳንዱን ዕቃ ለማመልከት በክብ ምልክት ላይ ይጫኑ።
          </p>
        )}
      </CardContent>
    </Card>
  );
}
