"use client";

import { useState } from "react";
import {
  Menu,
  ShieldCheck,
  Home,
  Layers,
  Info,
  Newspaper,
  LogOut,
  UserCircle,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useApp } from "@/lib/store";
import { t } from "@/lib/i18n";
import { LanguageToggle } from "./language-toggle";
import { NotificationsBell } from "./notifications-bell";

export function Header() {
  const lang = useApp((s) => s.lang);
  const view = useApp((s) => s.view);
  const setView = useApp((s) => s.setView);
  const session = useApp((s) => s.session);
  const setSession = useApp((s) => s.setSession);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: { label: string; icon: typeof Home; onClick: () => void; active: boolean }[] = [
    {
      label: t("nav.home", lang),
      icon: Home,
      onClick: () => setView({ name: "home" }),
      active: view.name === "home",
    },
    {
      label: t("nav.categories", lang),
      icon: Layers,
      onClick: () => setView({ name: "categories" }),
      active: view.name === "categories" || view.name === "category" || view.name === "apply",
    },
    {
      label: t("nav.news", lang),
      icon: Newspaper,
      onClick: () => setView({ name: "news" }),
      active: view.name === "news",
    },
    {
      label: t("nav.about", lang),
      icon: Info,
      onClick: () => setView({ name: "about" }),
      active: view.name === "about",
    },
  ];

  const isAdminView = view.name === "admin";
  const isApplicantView =
    view.name === "applicant-dashboard" ||
    view.name === "applicant-application" ||
    view.name === "login" ||
    view.name === "signup";

  const isApplicant = session?.role === "applicant";
  const isAdmin = session?.role === "admin" || session?.role === "super_admin";

  const handleLogout = () => {
    setSession(null);
    setView({ name: "home" });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between gap-2 px-4">
        {/* Brand */}
        <button
          type="button"
          onClick={() => setView({ name: "home" })}
          className="flex items-center gap-2.5 group"
          aria-label={t("brand.name", lang)}
        >
          <div className="h-10 w-10 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
            <img src="/logo.png" alt="PCC Logo" className="h-9 w-9 object-contain" />
          </div>
          <div className="hidden sm:block text-left leading-tight">
            <div className="text-sm font-bold text-foreground">
              {t("brand.name", lang)}
            </div>
            <div className="text-[11px] text-muted-foreground">
              {t("brand.subtitle", lang)}
            </div>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.label}
                variant={item.active ? "default" : "ghost"}
                size="sm"
                onClick={item.onClick}
                className="gap-2"
              >
                <Icon className="h-4 w-4" aria-hidden />
                {item.label}
              </Button>
            );
          })}
        </nav>

        {/* Right actions — single Sign in / Sign out for everyone */}
        <div className="flex items-center gap-1.5">
          {session && <NotificationsBell />}
          <LanguageToggle />

          {session ? (
            <>
              {/* Logged in: show role-appropriate dashboard button */}
              {isApplicant && !isApplicantView && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setView({ name: "applicant-dashboard" })}
                  className="gap-2 hidden sm:inline-flex"
                >
                  <LayoutDashboard className="h-4 w-4" aria-hidden />
                  {t("nav.applicant", lang)}
                </Button>
              )}
              {isAdmin && !isAdminView && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setView({ name: "admin" })}
                  className="gap-2 hidden sm:inline-flex"
                >
                  <ShieldCheck className="h-4 w-4" aria-hidden />
                  {t("nav.admin", lang)}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">{t("nav.logout", lang)}</span>
              </Button>
            </>
          ) : (
            <>
              {/* Not logged in: single Sign in button for everyone */}
              <Button
                variant={isApplicantView ? "default" : "outline"}
                size="sm"
                onClick={() => setView({ name: "login" })}
                className="gap-2"
              >
                <UserCircle className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">{t("nav.login", lang)}</span>
                <span className="sm:hidden">{t("nav.login", lang)}</span>
              </Button>
            </>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <SheetHeader>
                <SheetTitle>{t("brand.name", lang)}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 mt-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.label}
                      variant={item.active ? "default" : "ghost"}
                      onClick={() => {
                        item.onClick();
                        setMobileOpen(false);
                      }}
                      className="justify-start gap-2"
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                      {item.label}
                    </Button>
                  );
                })}
                <div className="my-2 border-t border-border" />
                {session ? (
                  <>
                    {isApplicant && (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setView({ name: "applicant-dashboard" });
                          setMobileOpen(false);
                        }}
                        className="justify-start gap-2"
                      >
                        <LayoutDashboard className="h-4 w-4" aria-hidden />
                        {t("nav.applicant", lang)}
                      </Button>
                    )}
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setView({ name: "admin" });
                          setMobileOpen(false);
                        }}
                        className="justify-start gap-2"
                      >
                        <ShieldCheck className="h-4 w-4" aria-hidden />
                        {t("nav.admin", lang)}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleLogout();
                        setMobileOpen(false);
                      }}
                      className="justify-start gap-2"
                    >
                      <LogOut className="h-4 w-4" aria-hidden />
                      {t("nav.logout", lang)}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="default"
                    onClick={() => {
                      setView({ name: "login" });
                      setMobileOpen(false);
                    }}
                    className="justify-start gap-2"
                  >
                    <UserCircle className="h-4 w-4" aria-hidden />
                    {t("nav.login", lang)}
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
