"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  ShieldCheck,
  Search,
  ClipboardCheck,
  Send,
  ArrowRight,
  ArrowLeft,
  Calendar,
  FileText,
  Building2,
  Pin,
  Newspaper,
  ChevronLeft,
  ChevronRight,
  Play,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useApp } from "@/lib/store";
import { t } from "@/lib/i18n";
import { directive } from "@/lib/data";
import { activityGroups } from "@/lib/types";
import { ActivityIcon } from "./activity-icon";

interface NewsItem {
  id: string;
  titleEn: string;
  titleAm: string;
  bodyEn: string;
  bodyAm: string;
  category: string;
  pinned: boolean;
  publishedAt: string | null;
}

export function HomeView() {
  const lang = useApp((s) => s.lang);
  const setView = useApp((s) => s.setView);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setNews((data.news || []).slice(0, 5));
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoadingNews(false));
    return () => {
      cancelled = true;
    };
  }, []);

  // Default slides when no news
  const defaultSlides = [
    {
      title: lang === "en"
        ? "Get Your ICT Sector Professional Competence Certificate"
        : "የአይሲቲ ዘርፍ የሙያ ብቃት ሰርቲፊኬትዎን ያግኙ",
      summary: lang === "en" ? "PCC Portal" : "የPCC ፖርታል",
      image: "/hero-bg.png",
      action: () => setView({ name: "categories" }),
    },
    {
      title: lang === "en"
        ? "Browse 45 ICT License Categories"
        : "45 የአይሲቲ የፈቃድ ምድቦችን ይመልከቱ",
      summary: lang === "en" ? "License categories" : "የፈቃድ ምድቦች",
      image: "/hero-bg-2.jpg", // Used user uploaded image
      action: () => setView({ name: "categories" }),
    },
    {
      title: lang === "en"
        ? "Apply Online — Track Your Application Status"
        : "በመስመር ላይ ያመልክቱ — ማመልከቻዎን ይከታተሉ",
      summary: lang === "en" ? "Applications" : "ማመልከቻዎች",
      image: "/hero-bg.png", // Change to another image like "/hero-bg-3.png" if you have one
      action: () => setView({ name: "login" }),
    },
  ];

  const slides = news.length > 0
    ? news.map((n, index) => {
        // Cycle images or map categories to different images
        const images = ["/hero-bg.png", "/hero-bg-2.jpg"]; // Add more images to the array here to cycle them
        return {
          title: lang === "en" ? n.titleEn : n.titleAm,
          summary: n.category,
          image: images[index % images.length],
          action: () => setView({ name: "news" }),
        };
      })
    : defaultSlides;

  const slideCount = slides.length;

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, 6000);
  }, [slideCount]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const goTo = (idx: number) => {
    setCurrentSlide(idx);
    resetTimer();
  };

  const goPrev = () => goTo((currentSlide - 1 + slideCount) % slideCount);
  const goNext = () => goTo((currentSlide + 1) % slideCount);



  const steps = [
    {
      icon: Search,
      title: t("home.step1.title", lang),
      body: t("home.step1.body", lang),
    },
    {
      icon: ClipboardCheck,
      title: t("home.step2.title", lang),
      body: t("home.step2.body", lang),
    },
    {
      icon: Send,
      title: t("home.step3.title", lang),
      body: t("home.step3.body", lang),
    },
  ];

  const stats = [
    { label: t("home.stats.categories", lang), value: "45" },
    { label: t("home.stats.validity", lang), value: lang === "en" ? "1 year" : "1 ዓመት" },
    { label: t("home.stats.region", lang), value: lang === "en" ? "Harari" : "ሐረሪ" },
    { label: t("home.stats.years", lang), value: "2007 E.C." },
  ];

  return (
    <div className="flex flex-col">
      {/* ===== SPLIT HERO ===== */}
      <section className="split-hero">
        {/* LEFT PANEL */}
        <div className="split-hero__left">
          {/* Brand */}
          <div className="split-hero__brand">
            <img src="/logo.png" alt="PCC Logo" />
            <div className="split-hero__brand-text">
              {lang === "en"
                ? "Harari Regional State of Ethiopia"
                : "የሐረሪ ሕዝብ ብሔራዊ ክልላዊ መንግሥት"}
              <strong>
                {lang === "en"
                  ? "INNOVATION AND TECHNOLOGY AGENCY"
                  : "የኢኖቬሽን እና ቴክኖሎጂ ኤጀንሲ"}
              </strong>
            </div>
          </div>

          {/* Title */}
          <h1 className="split-hero__title">
            {lang === "en" ? (
              <>
                ICT SECTOR: <span>PROFESSIONAL COMPETENCE</span> CERTIFICATE
              </>
            ) : (
              <>
                የአይሲቲ ዘርፍ: <span>የሙያ ብቃት</span> ሰርቲፊኬት
              </>
            )}
          </h1>

          {/* Quote */}
          <div className="split-hero__quote">
            <div className="split-hero__quote-icon">
              <Quote size={28} />
            </div>
            <p>
              {t("home.hero.subtitle", lang)}
            </p>
            <cite>— {lang === "en" ? "Innovation and Technology Agency" : "የኢኖቬሽን እና ቴክኖሎጂ ኤጀንሲ"}</cite>
          </div>

          {/* CTA */}
          <button
            className="split-hero__cta"
            onClick={() => setView({ name: "categories" })}
          >
            <div className="split-hero__cta-circle">
              <Play size={20} fill="currentColor" />
            </div>
            <span className="split-hero__cta-label">
              {t("home.hero.cta.browse", lang)}
            </span>
          </button>
        </div>

        {/* RIGHT PANEL — News Slider */}
        <div className="split-hero__right">
          {/* Slides */}
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`split-hero__slide ${i === currentSlide ? "split-hero__slide--active" : ""}`}
            >
              <img
                src={slide.image}
                alt=""
                className="split-hero__slide-img"
                aria-hidden
              />
              <div className="split-hero__slide-overlay" />
              <div className="split-hero__slide-content">
                <h2 className="split-hero__slide-title">{slide.title}</h2>
                <div className="split-hero__slide-summary">{slide.summary}</div>
                <button className="split-hero__slide-btn" onClick={slide.action}>
                  {lang === "en" ? "READ MORE" : "ተጨማሪ ያንብቡ"}
                </button>
              </div>
            </div>
          ))}

          {/* Arrows */}
          <div className="split-hero__arrows">
            <button className="split-hero__arrow" onClick={goPrev} aria-label="Previous slide">
              <ChevronLeft size={20} />
            </button>
            <button className="split-hero__arrow" onClick={goNext} aria-label="Next slide">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Indicators */}
          <div className="split-hero__indicators">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`split-hero__indicator ${i === currentSlide ? "split-hero__indicator--active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-surface/30">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((s, i) => (
              <div key={i} className="text-center md:text-left">
                <div className="text-2xl md:text-4xl font-bold text-primary">
                  {s.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              {t("home.section.how.title", lang)}
            </h2>
            <p className="text-muted-foreground">
              {t("home.section.how.subtitle", lang)}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <Card
                  key={i}
                  className="card-hover relative overflow-hidden"
                >
                  <div className="absolute top-4 right-4 text-5xl font-bold text-primary/10">
                    {i + 1}
                  </div>
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                      <Icon className="h-6 w-6" aria-hidden />
                    </div>
                    <CardTitle className="text-lg">{s.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {s.body}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Browse by activity type */}
      <section className="py-16 bg-surface/30">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              {t("home.section.groups.title", lang)}
            </h2>
            <p className="text-muted-foreground">
              {t("home.section.groups.subtitle", lang)}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {activityGroups.map((g) => (
              <button
                key={g.key}
                onClick={() => setView({ name: "categories" })}
                className="group text-left"
              >
                <Card className="card-hover h-full">
                  <CardContent className="p-4 flex flex-col items-start gap-2">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <ActivityIcon name={g.icon} className="h-5 w-5" />
                    </div>
                    <div className="font-semibold text-sm leading-tight">
                      {lang === "en" ? g.label_en : g.label_am}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {g.codes.length} {lang === "en" ? "categories" : "ምድቦች"}
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setView({ name: "categories" })}
              className="gap-2"
            >
              {t("nav.categories", lang)}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </div>
      </section>

      {/* Directive info banner */}
      <section className="py-12">
        <div className="container mx-auto max-w-7xl px-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="h-14 w-14 rounded-lg bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                  <FileText className="h-7 w-7" aria-hidden />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    {lang === "en" ? "Legal basis" : "ህጋዊ መሠረት"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {directive.legal_basis}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" aria-hidden />
                      <div>
                        <div className="font-medium">{t("about.effective", lang)}</div>
                        <div className="text-muted-foreground">{directive.effective_date_en}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" aria-hidden />
                      <div>
                        <div className="font-medium">{t("about.authority", lang)}</div>
                        <div className="text-muted-foreground text-xs">
                          {directive.issuing_authority}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="default"
                  onClick={() => setView({ name: "about" })}
                  className="gap-2 self-start md:self-center"
                >
                  {t("nav.about", lang)}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* News */}
      <section className="py-16 bg-surface/30">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                {t("home.section.news.title", lang)}
              </h2>
              <p className="text-muted-foreground text-sm">
                {t("home.section.news.subtitle", lang)}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setView({ name: "news" })}
              className="gap-2 self-start"
            >
              <Newspaper className="h-4 w-4" aria-hidden />
              {lang === "en" ? "View all" : "ሁሉንም ይዩ"}
            </Button>
          </div>
          {loadingNews ? (
            <div className="grid md:grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          ) : news.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                {lang === "en"
                  ? "No news published yet."
                  : "እስካሁን ዜና አልተወጣም።"}
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {news.map((n) => (
                <Card key={n.id} className="card-hover flex flex-col">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-1">
                      {n.pinned && (
                        <Pin className="h-3.5 w-3.5 text-accent" aria-hidden />
                      )}
                      <Badge variant="secondary" className="text-[10px]">
                        {n.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-base leading-snug">
                      {lang === "en" ? n.titleEn : n.titleAm}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-xs text-muted-foreground line-clamp-3 mb-3 flex-1">
                      {lang === "en" ? n.bodyEn : n.bodyAm}
                    </p>
                    {n.publishedAt && (
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" aria-hidden />
                        {new Date(n.publishedAt).toLocaleDateString()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <Card className="bg-secondary text-secondary-foreground border-0">
            <CardContent className="p-8 md:p-12 text-center">
              <Building2 className="h-10 w-10 mx-auto mb-4 opacity-80" aria-hidden />
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                {lang === "en"
                  ? "Ready to start your application?"
                  : "ማመልከቻ ለመጀመር ዝግጁ ነዎት?"}
              </h2>
              <p className="text-white/80 mb-6 max-w-2xl mx-auto text-sm">
                {lang === "en"
                  ? "Browse the 45 fixed ICT sector license categories, check your readiness, and submit your application to PCC."
                  : "45 የተወሰኑ የአይሲቲ ዘርፍ የፈቃድ ምድቦችን ይመልከቱ፣ ዝግጁነትዎን ያረጋግጡ፣ እና ማመልከቻዎን ወደ PCC ያስገቡ።"}
              </p>
              <Button
                size="lg"
                onClick={() => setView({ name: "categories" })}
                className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
              >
                {t("home.hero.cta.browse", lang)}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
