"use client";

import { useEffect, useState } from "react";
import { useApp, initFromHash } from "@/lib/store";
import { Header } from "@/components/portal/header";
import { Footer } from "@/components/portal/footer";
import { HomeView } from "@/components/portal/home-view";
import { CategoriesView } from "@/components/portal/categories-view";
import { CategoryDetailView } from "@/components/portal/category-detail-view";
import { ApplyView } from "@/components/portal/apply-view";
import { AboutView } from "@/components/portal/about-view";
import { NewsView } from "@/components/portal/news-view";
import { AuthView } from "@/components/portal/auth-view";
import { ApplicantDashboardView } from "@/components/portal/applicant-dashboard-view";
import { ApplicantApplicationView } from "@/components/portal/applicant-application-view";
import { AdminView } from "@/components/admin/admin-view";
import { LogoLoader } from "@/components/portal/logo-loader";

export default function Home() {
  const view = useApp((s) => s.view);
  const [ready, setReady] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  // Initialize view from URL hash on first client render
  useEffect(() => {
    initFromHash();
    // Small delay so the animation is visible
    const t = setTimeout(() => setFadeOut(true), 1200);
    const t2 = setTimeout(() => setReady(true), 1600);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  // Show splash loader on first load
  if (!ready) {
    return (
      <div
        className="logo-loader--fullscreen"
        style={{
          opacity: fadeOut ? 0 : 1,
          transition: "opacity 0.4s ease-out",
        }}
      >
        <LogoLoader message="Loading portal…" inline />
      </div>
    );
  }

  // Admin view is full-screen (no public header/footer)
  if (view.name === "admin") {
    return <AdminView />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {view.name === "home" && <HomeView />}
        {view.name === "categories" && <CategoriesView />}
        {view.name === "category" && (
          <CategoryDetailView code={view.code} num={view.num} />
        )}
        {view.name === "apply" && <ApplyView code={view.code} num={view.num} />}
        {view.name === "about" && <AboutView />}
        {view.name === "news" && <NewsView />}
        {view.name === "login" && <AuthView initialMode="login" />}
        {view.name === "signup" && <AuthView initialMode="signup" />}
        {view.name === "applicant-dashboard" && <ApplicantDashboardView />}
        {view.name === "applicant-application" && (
          <ApplicantApplicationView id={view.id} />
        )}
      </main>
      <Footer />
    </div>
  );
}
