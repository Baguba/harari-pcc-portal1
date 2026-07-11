"use client";

import {
  ShieldCheck,
  Calendar,
  Scale,
  Gavel,
  RefreshCw,
  FileText,
  User,
  AlertTriangle,
  ListChecks,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/lib/store";
import { t } from "@/lib/i18n";
import { directive } from "@/lib/data";

export function AboutView() {
  const lang = useApp((s) => s.lang);

  const sections = [
    {
      icon: Info,
      title: t("about.purpose", lang),
      body: directive.purpose_en,
    },
    {
      icon: ListChecks,
      title: t("about.scope", lang),
      body: directive.scope_en,
    },
    {
      icon: ShieldCheck,
      title: t("about.authority", lang),
      body: directive.issuing_authority,
    },
    {
      icon: Scale,
      title: t("about.legal", lang),
      body: directive.legal_basis,
    },
    {
      icon: Calendar,
      title: t("about.validity", lang),
      body: `${directive.validity_period_en}\n\n${directive.renewal_en}`,
    },
    {
      icon: Gavel,
      title: t("about.penalties", lang),
      body: directive.penalties_en,
    },
    {
      icon: RefreshCw,
      title: t("about.amendment", lang),
      body: directive.amendment_en,
    },
    {
      icon: Calendar,
      title: t("about.effective", lang),
      body: directive.effective_date_en,
    },
    {
      icon: User,
      title: t("about.signatory", lang),
      body: directive.signatory,
    },
    {
      icon: FileText,
      title: t("about.repealed", lang),
      body: directive.repealed_directives_en,
    },
  ];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <div className="text-xs text-muted-foreground mb-2">
          {directive.directive_number}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {t("about.title", lang)}
        </h1>
        <div className="rounded-lg bg-surface/40 border border-border p-4 mt-4">
          <div className="text-sm font-semibold mb-1 amharic" lang="am">
            {directive.directive_title_am}
          </div>
          <div className="text-sm text-muted-foreground">
            {directive.directive_title_en}
          </div>
        </div>
      </div>

      {/* Certification rules */}
      <Card className="mb-8 border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-primary" aria-hidden />
            {t("about.rules", lang)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {directive.certification_rules_en.map((rule, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-sm leading-relaxed pt-0.5">{rule}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Detail sections */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {sections.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={i} className="card-hover">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" aria-hidden />
                  {s.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                  {s.body}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Standard documents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" aria-hidden />
            {t("about.standard_docs", lang)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {directive.standard_application_documents_note_en}
          </p>
          <ul className="space-y-2">
            {directive.standard_required_documents_en.map((doc, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{doc}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="mt-8 rounded-lg bg-accent/10 border border-accent/30 p-4 flex gap-3">
        <AlertTriangle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" aria-hidden />
        <div className="text-sm text-accent-foreground/90 leading-relaxed">
          {lang === "en"
            ? "This portal is a compliance and convenience tool. The authoritative legal text remains the official directive published by PCC. In case of any discrepancy, the official directive prevails."
            : "ይህ ፖርታል የመግዛት እና የምቾት መሣሪያ ነው። ህጋዊ የሆነ ጽሑፍ የPCC በሚያወጣው ይፋዊ መመሪያ ላይ ይገኛል። ማንኛውም ልዩነት በሚከሰትበት ጊዜ ይፋዊው መመሪያ ይከበራል።"}
        </div>
      </div>
    </div>
  );
}
