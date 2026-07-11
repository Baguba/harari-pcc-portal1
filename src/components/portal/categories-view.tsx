"use client";

import { useMemo, useState } from "react";
import { Search, Lock, ArrowRight, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/lib/store";
import { t } from "@/lib/i18n";
import { categories } from "@/lib/data";
import {
  activityGroups,
  isMonopolyCategory,
  type ActivityGroupKey,
} from "@/lib/types";
import { ActivityIcon } from "./activity-icon";

export function CategoriesView() {
  const lang = useApp((s) => s.lang);
  const setView = useApp((s) => s.setView);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<ActivityGroupKey | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories.filter((c) => {
      // group filter
      if (group !== "all") {
        const g = activityGroups.find((x) => x.key === group);
        if (!g || !g.codes.includes(c.code)) return false;
      }
      // search filter
      if (q) {
        const hay = [
          c.code,
          c.title_en,
          c.title_am,
          c.description,
          c.personnel,
          c.facility,
          c.equipment,
          c.documents,
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [query, group]);

  const grouped = useMemo(() => {
    const map = new Map<ActivityGroupKey | "other", typeof categories>();
    for (const c of filtered) {
      const g = activityGroups.find((x) => x.codes.includes(c.code));
      const key = g?.key ?? "other";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(c);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {t("cat.title", lang)}
        </h1>
        <p className="text-muted-foreground">{t("cat.subtitle", lang)}</p>
      </div>

      {/* Search + filter */}
      <div className="sticky top-16 z-30 -mx-4 px-4 py-3 bg-background/95 backdrop-blur border-b border-border mb-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("cat.search.placeholder", lang)}
              className="pl-9 pr-9"
              aria-label={t("common.search", lang)}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" aria-hidden />
            <Select
              value={group}
              onValueChange={(v) => setGroup(v as ActivityGroupKey | "all")}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("cat.filter.all", lang)}</SelectItem>
                {activityGroups.map((g) => (
                  <SelectItem key={g.key} value={g.key}>
                    {lang === "en" ? g.label_en : g.label_am}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          {filtered.length} {t("cat.results", lang)}
          {(query || group !== "all") && (
            <button
              onClick={() => {
                setQuery("");
                setGroup("all");
              }}
              className="ml-2 text-primary hover:underline"
            >
              {lang === "en" ? "Clear filters" : "ማጣሪያዎችን አጽዳ"}
            </button>
          )}
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Search className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" aria-hidden />
            <p className="text-muted-foreground">{t("cat.empty", lang)}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {grouped.map(([key, items]) => {
            const g = activityGroups.find((x) => x.key === key);
            const label = g
              ? lang === "en"
                ? g.label_en
                : g.label_am
              : lang === "en"
                ? "Other"
                : "ሌሎች";
            return (
              <section key={key} aria-label={label}>
                <div className="flex items-center gap-2 mb-3">
                  {g && (
                    <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                      <ActivityIcon name={g.icon} className="h-4 w-4" />
                    </div>
                  )}
                  <h2 className="text-lg font-semibold">{label}</h2>
                  <Badge variant="secondary" className="text-xs">
                    {items.length}
                  </Badge>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((c) => {
                    const monopoly = isMonopolyCategory(c);
                    return (
                      <Card
                        key={`${c.code}-${c.num}`}
                        className={`card-hover cursor-pointer ${
                          monopoly ? "border-accent/40 bg-accent/5" : ""
                        }`}
                        onClick={() =>
                          setView({ name: "category", code: c.code, num: c.num })
                        }
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setView({ name: "category", code: c.code, num: c.num });
                          }
                        }}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <Badge
                              variant="outline"
                              className="font-mono text-xs font-semibold"
                            >
                              {c.code}
                              {c.num > 32 && c.num <= 34 && c.code === "75240" && (
                                <span className="ml-1 text-accent">
                                  L{c.num - 32}
                                </span>
                              )}
                              {c.num > 34 && c.num <= 36 && c.code === "75250" && (
                                <span className="ml-1 text-accent">
                                  L{c.num - 34}
                                </span>
                              )}
                              {c.num > 36 && c.num <= 38 && c.code === "75260" && (
                                <span className="ml-1 text-accent">
                                  L{c.num - 36}
                                </span>
                              )}
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
                          </div>
                          <h3 className="font-semibold text-sm leading-snug mb-1 line-clamp-2">
                            {c.title_en}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 amharic" lang="am">
                            {c.title_am}
                          </p>
                          <div className="mt-3 flex items-center text-xs text-primary font-medium">
                            {lang === "en" ? "View requirements" : "መስፈርቶችን ይዩ"}
                            <ArrowRight className="h-3 w-3 ml-1" aria-hidden />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
