"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Inbox,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/store";
import { useAuthedFetch } from "../portal/use-authed-fetch";

interface Metrics {
  totals: {
    total: number;
    submitted: number;
    underReview: number;
    approved: number;
    rejected: number;
    recent: number;
  };
  byCategory: { code: string; count: number }[];
  statusBreakdown: { status: string; count: number }[];
  timeseries: { date: string; count: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  submitted: "#1F4E8C",      // royal blue
  under_review: "#C89B3C",   // gold
  approved: "#0F6B4A",        // emerald
  rejected: "#B91C1C",        // red
  revoked: "#525252",         // gray
};

const STATUS_LABEL: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  revoked: "Revoked",
};

export function AdminDashboard() {
  const lang = useApp((s) => s.lang);
  const authedFetch = useAuthedFetch();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const r = await authedFetch("/api/metrics");
        if (!r.ok) throw new Error("Failed to load metrics");
        const data = await r.json();
        if (cancelled) return;
        setMetrics(data);
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
  }, [authedFetch]);

  if (loading || !metrics) {
    return (
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      </div>
    );
  }

  const { totals, byCategory, statusBreakdown, timeseries } = metrics;

  const statCards = [
    {
      label: "Total applications",
      value: totals.total,
      icon: Inbox,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      label: "Pending review",
      value: totals.submitted + totals.underReview,
      icon: Clock,
      color: "text-accent-foreground",
      bg: "bg-accent/15",
    },
    {
      label: "Approved",
      value: totals.approved,
      icon: CheckCircle2,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Rejected",
      value: totals.rejected,
      icon: XCircle,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
  ];

  // Format timeseries dates for chart (e.g. "Jul 9")
  const tsData = timeseries.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
  }));

  const statusData = statusBreakdown.map((s) => ({
    name: STATUS_LABEL[s.status] || s.status,
    value: s.count,
    color: STATUS_COLORS[s.status] || "#999",
  }));

  const catData = byCategory.slice(0, 8).map((c) => ({
    code: c.code,
    applications: c.count,
  }));

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={i} className="card-hover">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className={`h-10 w-10 rounded-lg ${s.bg} ${s.color} flex items-center justify-center`}>
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="text-2xl font-bold">{s.value}</div>
                </div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent banner */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4 flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-primary" aria-hidden />
          <div className="text-sm">
            <span className="font-semibold">{totals.recent}</span>{" "}
            <span className="text-muted-foreground">
              {lang === "en"
                ? "new applications in the last 7 days"
                : lang === "am"
                  ? "አዳዲስ ማመልከቻዎች ባለፉት 7 ቀናት"
                  : "iyyannoolee haaraa guyyoota 7n darban keessatti"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Timeseries */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {lang === "en"
                ? "Applications — last 7 days"
                : lang === "am"
                  ? "ማመልከቻዎች — ያለፉት 7 ቀናት"
                  : "Iyyannoolee — guyyoota 7n darban"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={tsData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D1D5DB" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#6B7280" />
                <YAxis tick={{ fontSize: 11 }} stroke="#6B7280" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #D1D5DB",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#0F6B4A"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#0F6B4A" }}
                  activeDot={{ r: 6 }}
                  name="Applications"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {lang === "en"
                ? "Status distribution"
                : lang === "am"
                  ? "የሁኔታ ስርጭት"
                  : "Raabsama Haalaa"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  label={(entry) =>
                    entry.value > 0 ? `${entry.name}: ${entry.value}` : ""
                  }
                  labelLine={false}
                  style={{ fontSize: 11 }}
                >
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #D1D5DB",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* By category */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {lang === "en"
              ? "Top categories by application count"
              : lang === "am"
                ? "በማመልከቻ ብዛት ከፍተኛ ምድቦች"
                : "Ramaddiiwwan baay'ina iyyannootiin olaanoo ta'an"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {catData.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No applications yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={catData} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D1D5DB" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="#6B7280" allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="code"
                  tick={{ fontSize: 11 }}
                  stroke="#6B7280"
                  width={60}
                />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #D1D5DB",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  cursor={{ fill: "#0F6B4A15" }}
                />
                <Bar
                  dataKey="applications"
                  fill="#1F4E8C"
                  radius={[0, 4, 4, 0]}
                  name="Applications"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Recent activity summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" aria-hidden />
            {lang === "en" ? "Quick stats" : lang === "am" ? "ፈጣን ስታቲስቲክስ" : "Istaatistiksii Saffisaa"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <StatTile label="Submitted" value={totals.submitted} color="border-secondary/30 bg-secondary/5" />
            <StatTile label="Under review" value={totals.underReview} color="border-accent/30 bg-accent/5" />
            <StatTile label="Approved" value={totals.approved} color="border-primary/30 bg-primary/5" />
            <StatTile label="Rejected" value={totals.rejected} color="border-destructive/30 bg-destructive/5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatTile({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`rounded-lg border ${color} p-3`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

// suppress unused import warning
void Badge;
