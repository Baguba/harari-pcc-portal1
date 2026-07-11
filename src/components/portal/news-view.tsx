"use client";

import { useEffect, useState } from "react";
import { Calendar, Pin, Newspaper, Search, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useApp } from "@/lib/store";
import { t } from "@/lib/i18n";

interface NewsItem {
  id: string;
  titleEn: string;
  titleAm: string;
  bodyEn: string;
  bodyAm: string;
  category: string;
  pinned: boolean;
  publishedAt: string | null;
  createdAt: string;
}

const categoryColors: Record<string, string> = {
  directive_change: "bg-primary/15 text-primary border-primary/30",
  fee: "bg-secondary/15 text-secondary-foreground border-secondary/30",
  outage: "bg-accent/20 text-accent-foreground border-accent/40",
  general: "bg-muted text-muted-foreground border-border",
};

export function NewsView() {
  const lang = useApp((s) => s.lang);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => setNews(data.news || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = news.filter((n) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      n.titleEn.toLowerCase().includes(q) ||
      n.titleAm.toLowerCase().includes(q) ||
      n.bodyEn.toLowerCase().includes(q) ||
      n.bodyAm.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2">
          <Newspaper className="h-7 w-7 text-primary" aria-hidden />
          {t("nav.news", lang)}
        </h1>
        <p className="text-sm text-muted-foreground">
          {lang === "en"
            ? "Directive changes, fee updates, and announcements from PCC."
            : "የመመሪያ ለውጦች፣ የክፍያ ዝመናዎች፣ እና ማስታወቂያዎች ከPCC።"}
        </p>
      </div>

      <div className="relative mb-6">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("cat.search.placeholder", lang)}
          className="pl-9 pr-9"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            {t("common.no_results", lang)}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((n) => (
            <Card
              key={n.id}
              className={n.pinned ? "border-accent/40 bg-accent/5" : ""}
            >
              <CardHeader>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {n.pinned && (
                    <Pin className="h-3.5 w-3.5 text-accent" aria-hidden />
                  )}
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${categoryColors[n.category] || categoryColors.general}`}
                  >
                    {n.category.replace("_", " ")}
                  </Badge>
                  {n.publishedAt && (
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1 ml-auto">
                      <Calendar className="h-3 w-3" aria-hidden />
                      {new Date(n.publishedAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>
                <CardTitle className="text-lg leading-snug">
                  {lang === "en" ? n.titleEn : n.titleAm}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {lang === "en" ? n.bodyEn : n.bodyAm}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
