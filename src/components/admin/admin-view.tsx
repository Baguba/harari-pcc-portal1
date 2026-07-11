"use client";

import { useEffect, useState, useCallback } from "react";
import {
  LayoutDashboard,
  FileText,
  Newspaper,
  Users,
  History,
  LogOut,
  ShieldCheck,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useApp } from "@/lib/store";
import { t } from "@/lib/i18n";
import { toast } from "sonner";
import { useAuthedFetch } from "../portal/use-authed-fetch";
import { AdminDashboard } from "./admin-dashboard";
import { AdminApplications } from "./admin-applications";
import { AdminNews } from "./admin-news";
import { AdminUsers } from "./admin-users";
import { AdminAudit } from "./admin-audit";

type Tab = "dashboard" | "applications" | "news" | "users" | "audit";

export function AdminView() {
  const lang = useApp((s) => s.lang);
  const session = useApp((s) => s.session);
  const setSession = useApp((s) => s.setSession);
  const setView = useApp((s) => s.setView);
  const authedFetch = useAuthedFetch();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [refreshKey, setRefreshKey] = useState(0);

  // Guard: must be signed in as admin (any non-admin session or no session → unified login)
  useEffect(() => {
    if (!session || (session.role !== "admin" && session.role !== "super_admin")) {
      setView({ name: "login" });
    }
  }, [session, setView]);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const handleLogout = async () => {
    try {
      await authedFetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    } catch {
      /* no-op */
    }
    setSession(null);
    setView({ name: "home" });
    toast.success("Signed out");
  };

  if (!session || (session.role !== "admin" && session.role !== "super_admin")) {
    return (
      <div className="container mx-auto max-w-md px-4 py-20 text-center">
        <Loader2 className="h-6 w-6 mx-auto animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isSuperAdmin = session.role === "super_admin";

  const tabs: { key: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { key: "dashboard", label: t("admin.dashboard", lang), icon: LayoutDashboard },
    { key: "applications", label: t("admin.applications", lang), icon: FileText },
    { key: "news", label: t("admin.news", lang), icon: Newspaper },
    ...(isSuperAdmin
      ? [{ key: "users" as Tab, label: t("admin.users", lang), icon: Users }]
      : []),
    { key: "audit", label: t("admin.audit", lang), icon: History },
  ];

  return (
    <div className="min-h-screen bg-surface/20">
      {/* Top bar */}
      <div className="border-b border-border bg-background">
        <div className="container mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 flex items-center justify-center flex-shrink-0">
              <img src="/logo.png" alt="PCC Logo" className="h-7 w-7 object-contain" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold truncate">
                PCC Admin Portal
              </div>
              <div className="text-[11px] text-muted-foreground truncate">
                {session.email}
              </div>
            </div>
            <Badge
              variant={isSuperAdmin ? "default" : "secondary"}
              className="ml-1 text-[10px] capitalize"
            >
              {session.role.replace("_", " ")}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={refresh}
              className="gap-1.5"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView({ name: "home" })}
              className="text-xs"
            >
              {t("nav.home", lang)}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-1.5"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">{t("nav.logout", lang)}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-background sticky top-0 z-30">
        <div className="container mx-auto max-w-7xl px-4">
          <nav
            className="flex gap-1 overflow-x-auto scroll-area-thin"
            aria-label="Admin sections"
          >
            {tabs.map((tb) => {
              const Icon = tb.icon;
              return (
                <Button
                  key={tb.key}
                  variant="ghost"
                  size="sm"
                  onClick={() => setTab(tb.key)}
                  className={`gap-2 border-b-2 rounded-none px-4 py-3 h-auto ${
                    tab === tb.key
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  <span className="whitespace-nowrap">{tb.label}</span>
                </Button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-7xl px-4 py-6">
        {tab === "dashboard" && (
          <AdminDashboard key={`dash-${refreshKey}`} />
        )}
        {tab === "applications" && (
          <AdminApplications key={`apps-${refreshKey}`} />
        )}
        {tab === "news" && <AdminNews key={`news-${refreshKey}`} />}
        {tab === "users" && isSuperAdmin && (
          <AdminUsers key={`users-${refreshKey}`} />
        )}
        {tab === "audit" && <AdminAudit key={`audit-${refreshKey}`} />}
      </div>
    </div>
  );
}

// Suppress unused warning
void Card;
void CardContent;
