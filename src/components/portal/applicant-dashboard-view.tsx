"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Plus,
  Loader2,
  Inbox,
  ArrowLeft,
} from "lucide-react";
import { LogoLoader } from "./logo-loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useApp } from "@/lib/store";
import { t } from "@/lib/i18n";

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

export function ApplicantDashboardView() {
  const lang = useApp((s) => s.lang);
  const session = useApp((s) => s.session);
  const setView = useApp((s) => s.setView);
  const [apps, setApps] = useState<MyApp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      setView({ name: "login" });
      return;
    }
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`/api/applications/mine?userId=${session.id}`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        if (cancelled) return;
        setApps(data.applications || []);
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
  }, [session, setView]);

  if (!session) {
    return (
      <div className="container mx-auto max-w-md px-4 py-20 text-center">
        <LogoLoader size="md" inline />
      </div>
    );
  }

  const counts = {
    total: apps.length,
    pending: apps.filter((a) => a.status === "submitted" || a.status === "under_review").length,
    approved: apps.filter((a) => a.status === "approved").length,
    rejected: apps.filter((a) => a.status === "rejected" || a.status === "revoked").length,
  };

  const statCards = [
    { label: "Total", value: counts.total, icon: Inbox, color: "text-secondary", bg: "bg-secondary/10" },
    { label: "Pending", value: counts.pending, icon: Clock, color: "text-accent-foreground", bg: "bg-accent/15" },
    { label: "Approved", value: counts.approved, icon: CheckCircle2, color: "text-primary", bg: "bg-primary/10" },
    { label: "Rejected", value: counts.rejected, icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
  ];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setView({ name: "home" })}
        className="gap-2 mb-4"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {t("nav.home", lang)}
      </Button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            {t("applicant.welcome", lang)}, {session.name || session.email}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("applicant.dashboard.subtitle", lang)}
          </p>
        </div>
        <Button
          onClick={() => setView({ name: "categories" })}
          className="gap-2 self-start"
        >
          <Plus className="h-4 w-4" aria-hidden />
          {t("applicant.dashboard.new", lang)}
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <div className={`h-8 w-8 rounded-md ${s.bg} ${s.color} flex items-center justify-center`}>
                    <Icon className="h-4 w-4" aria-hidden />
                  </div>
                  <span className="text-xl font-bold">{s.value}</span>
                </div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Applications */}
      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : apps.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Inbox className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" aria-hidden />
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              {t("applicant.dashboard.empty", lang)}
            </p>
            <Button onClick={() => setView({ name: "categories" })} className="gap-2">
              {t("home.hero.cta.browse", lang)}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {apps.map((a) => {
            const meta = STATUS_META[a.status] || STATUS_META.submitted;
            const Icon = meta.icon;
            return (
              <Card
                key={a.id}
                className="card-hover cursor-pointer"
                onClick={() =>
                  setView({ name: "applicant-application", id: a.id })
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setView({ name: "applicant-application", id: a.id });
                  }
                }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge variant="outline" className="font-mono text-xs">
                          {a.categoryCode}
                        </Badge>
                        <Badge variant="outline" className={`text-[10px] gap-1 ${meta.cls}`}>
                          <Icon className="h-3 w-3" aria-hidden />
                          {meta.label}
                        </Badge>
                      </div>
                      <div className="font-semibold text-sm leading-snug mb-0.5">
                        {a.categoryTitle}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {a.organizationName ? `${a.organizationName} · ` : ""}
                        {a.contactName}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-1">
                        {lang === "en" ? "Submitted" : lang === "am" ? "ቀርቧል" : "Galchamee jira"}:{" "}
                        {new Date(a.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" aria-hidden />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// suppress unused warning
void FileText;
