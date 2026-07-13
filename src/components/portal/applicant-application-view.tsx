"use client";
// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { useEffect, useState, useCallback } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Mail,
  Phone,
  MapPin,
  Building2,
  User,
  Calendar,
  Loader2,
} from "lucide-react";
import { LogoLoader } from "./logo-loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/store";
import { t } from "@/lib/i18n";
import { directive } from "@/lib/data";
import { woredas } from "@/lib/types";
import { CertificateView } from "./certificate-view";
import { useAuthedFetch } from "./use-authed-fetch";

interface MyApp {
  id: string;
  categoryCode: string;
  categoryNum: number;
  categoryTitle: string;
  applicantType: string;
  organizationName: string | null;
  contactName: string;
  email: string;
  phone: string;
  region: string;
  city: string;
  addressLine: string;
  tinNumber: string | null;
  readinessPercent: number;
  uploadedDocuments: string;
  notes: string | null;
  status: string;
  reviewNote: string | null;
  createdAt: string;
  reviewedAt: string | null;
}

const STATUS_META: Record<
  string,
  { label: string; cls: string; icon: typeof Clock }
> = {
  submitted: {
    label: "Submitted",
    cls: "bg-secondary/15 text-secondary-foreground border-secondary/30",
    icon: Clock,
  },
  under_review: {
    label: "Under Review",
    cls: "bg-accent/20 text-accent-foreground border-accent/30",
    icon: Clock,
  },
  reviewed: {
    label: "Reviewed",
    cls: "bg-blue-500/15 text-blue-600 border-blue-500/30",
    icon: CheckCircle2,
  },
  approved: {
    label: "Approved",
    cls: "bg-primary/15 text-primary border-primary/30",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    cls: "bg-destructive/15 text-destructive border-destructive/30",
    icon: XCircle,
  },
  revoked: {
    label: "Revoked",
    cls: "bg-muted text-muted-foreground border-border",
    icon: XCircle,
  },
};

export function ApplicantApplicationView({ id }: { id: string }) {
  const lang = useApp((s) => s.lang);
  const session = useApp((s) => s.session);
  const setView = useApp((s) => s.setView);
  const authedFetch = useAuthedFetch();
  const [app, setApp] = useState<MyApp | null>(null);
  const [loading, setLoading] = useState(true);
  const [stampUrl, setStampUrl] = useState<string | null>(null);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      setView({ name: "login" });
      return;
    }
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`/api/applications/${id}`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        if (cancelled) return;
        // Only show if it belongs to the current user
        if (
          data.application.email !== session.email &&
          data.application.submittedById !== session.id
        ) {
          setView({ name: "applicant-dashboard" });
          return;
        }
        setApp(data.application);
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id, session, setView]);

  // Fetch super admin stamp and signature for certificate display
  const fetchProfile = useCallback(async () => {
    try {
      const res = await authedFetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setStampUrl(data.stampUrl);
        setSignatureUrl(data.signatureUrl);
      }
    } catch {
      /* ignore */
    }
  }, [authedFetch]);

  useEffect(() => {
    if (app?.status === "approved") {
      fetchProfile();
    }
  }, [app?.status, fetchProfile]);

  if (loading || !app) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-20 text-center">
        <LogoLoader size="md" inline />
      </div>
    );
  }

  const meta = STATUS_META[app.status] || STATUS_META.submitted;
  const StatusIcon = meta.icon;
  const isApproved = app.status === "approved";

  const pastReview = app.status === "reviewed" || app.status === "approved" || app.status === "rejected" || app.status === "revoked";
  const pastUnderReview = app.status === "under_review" || pastReview;

  // Timeline steps (4-step: submitted → under review → reviewed → final decision)
  const timeline = [
    {
      key: "submitted",
      label: t("applicant.application.submitted", lang),
      date: app.createdAt,
      done: true,
    },
    {
      key: "under_review",
      label: t("applicant.application.under_review", lang),
      date: pastUnderReview ? app.reviewedAt || app.createdAt : null,
      done: pastUnderReview,
    },
    {
      key: "reviewed",
      label: t("applicant.application.reviewed", lang),
      date: pastReview ? app.reviewedAt : null,
      done: pastReview,
    },
    {
      key: "final",
      label:
        app.status === "approved"
          ? t("applicant.application.approved", lang)
          : app.status === "rejected"
            ? t("applicant.application.rejected", lang)
            : app.status === "revoked"
              ? t("applicant.application.revoked", lang)
              : t("applicant.application.approved", lang),
      date: isApproved || app.status === "rejected" || app.status === "revoked" ? app.reviewedAt : null,
      done: isApproved || app.status === "rejected" || app.status === "revoked",
      final: true,
      variant: app.status === "approved" ? "success" : app.status === "rejected" || app.status === "revoked" ? "danger" : "default",
    },
  ];

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setView({ name: "applicant-dashboard" })}
        className="gap-2 mb-4"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {t("applicant.dashboard.title", lang)}
      </Button>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Badge variant="outline" className="font-mono">
            {app.categoryCode}
          </Badge>
          <Badge variant="outline" className={`text-xs gap-1 ${meta.cls}`}>
            <StatusIcon className="h-3 w-3" aria-hidden />
            {meta.label}
          </Badge>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          {t("applicant.application.title", lang)}
        </h1>
        <p className="text-sm text-muted-foreground">{app.categoryTitle}</p>
      </div>

      {/* Certificate (only when approved) */}
      {isApproved && (
        <CertificateView
          holderName={app.organizationName || app.contactName}
          categoryCode={app.categoryCode}
          categoryTitle={app.categoryTitle}
          issuedDate={app.reviewedAt}
          applicationId={app.id}
          lang={lang}
          stampUrl={stampUrl}
          signatureUrl={signatureUrl}
        />
      )}

      {/* Timeline */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">
            {t("applicant.application.timeline", lang)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="relative space-y-5">
            {timeline.map((step, i) => {
              const isLast = i === timeline.length - 1;
              return (
                <li key={step.key} className="flex gap-3">
                  {/* vertical line + dot */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        step.done
                          ? step.variant === "danger"
                            ? "bg-destructive text-destructive-foreground"
                            : step.variant === "success"
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.done ? (
                        step.variant === "danger" ? (
                          <XCircle className="h-4 w-4" aria-hidden />
                        ) : step.variant === "success" ? (
                          <CheckCircle2 className="h-4 w-4" aria-hidden />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" aria-hidden />
                        )
                      ) : (
                        <Clock className="h-4 w-4" aria-hidden />
                      )}
                    </div>
                    {!isLast && (
                      <div
                        className={`w-0.5 flex-1 mt-1 ${
                          step.done ? "bg-primary/30" : "bg-border"
                        }`}
                        style={{ minHeight: "1.5rem" }}
                      />
                    )}
                  </div>
                  {/* text */}
                  <div className="flex-1 pb-1">
                    <div
                      className={`text-sm font-medium ${
                        step.done ? "" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </div>
                    {step.date && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {new Date(step.date).toLocaleString()}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>

      {/* Reviewer feedback */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">
            {t("applicant.application.review", lang)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {app.reviewNote ? (
            <div className="rounded-md bg-muted/40 border border-border p-3 text-sm leading-relaxed">
              {app.reviewNote}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground italic">
              {t("applicant.application.no_review", lang)}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">
            {lang === "en" ? "Application information" : lang === "am" ? "የማመልከቻ መረጃ" : "Odeeffannoo Iyyannoo"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <Info icon={app.applicantType === "organization" ? Building2 : User}
               label={lang === "en" ? "Type" : lang === "am" ? "አይነት" : "Gosa"}
              value={app.applicantType === "organization" ? (lang === "en" ? "Organization" : lang === "am" ? "ድርጅት" : "Dhaabbata") : (lang === "en" ? "Individual" : lang === "am" ? "ግል" : "Dhuunfaa")} />
            {app.organizationName && (
              <Info icon={Building2} label={lang === "en" ? "Organization" : lang === "am" ? "ድርጅት" : "Dhaabbata"} value={app.organizationName} />
            )}
             <Info icon={User} label={lang === "en" ? "Contact" : lang === "am" ? "መገናኛ" : "Nama Quunnamtii"} value={app.contactName} />
            <Info icon={Mail} label="Email" value={app.email} />
             <Info icon={Phone} label={lang === "en" ? "Phone" : lang === "am" ? "ስልክ" : "Bilbila"} value={app.phone} />
             <Info icon={MapPin} label={lang === "en" ? "Address" : lang === "am" ? "አድራሻ" : "Teessoo"}
              value={`${app.addressLine}, ${app.city}, ${woredas.find(w => w.key === app.region)?.[`label_${lang}` as keyof typeof w] || app.region}`} />
            {app.tinNumber && (
              <Info icon={FileText} label="TIN" value={app.tinNumber} />
            )}
             <Info icon={Calendar} label={lang === "en" ? "Submitted" : lang === "am" ? "ቀርቧል" : "Galchamee jira"}
              value={new Date(app.createdAt).toLocaleString()} />
          </div>
          {app.notes && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="text-xs font-semibold text-muted-foreground mb-1">
                 {lang === "en" ? "Your notes" : lang === "am" ? "የእርስዎ ማስታወሻዎች" : "Yaadannoowwan kee"}
              </div>
              <div className="text-xs bg-muted/40 rounded p-2">{app.notes}</div>
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
             {lang === "en" ? "Documents uploaded" : lang === "am" ? "የተሰቀሉ ሰነዶች" : "Sanadoota ol-ka'an"}:{" "}
            {app.uploadedDocuments
              ? app.uploadedDocuments.split(",").length
              : 0}
            {" · "}
             {lang === "en" ? "Readiness at submission" : lang === "am" ? "በማስገባት ጊዜ ዝግጁነት" : "Qophii yeroo galchamuu"}:{" "}
            <span className="font-semibold text-primary">{app.readinessPercent}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Reference ID */}
      <Card className="bg-muted/30">
        <CardContent className="p-4 text-center">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
             {lang === "en" ? "Reference ID" : lang === "am" ? "ማመልከቻ ቁጥር" : "Lakk. Eenyummeessaa"}
          </div>
          <div className="font-mono font-semibold text-sm break-all">
            {app.id}
          </div>
        </CardContent>
      </Card>

      {/* Hidden directive reference for print */}
      <div className="sr-only">
        {directive.directive_number} · {directive.issuing_authority}
      </div>
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" aria-hidden />
      <div className="min-w-0">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</div>
        <div className="text-xs font-medium break-words">{value}</div>
      </div>
    </div>
  );
}
