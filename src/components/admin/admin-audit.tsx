"use client";

import { useEffect, useState } from "react";
import { History, User as UserIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthedFetch } from "../portal/use-authed-fetch";
import { toast } from "sonner";

interface LogEntry {
  id: string;
  actorId: string | null;
  action: string;
  target: string | null;
  detail: string | null;
  ip: string | null;
  createdAt: string;
  actor: { email: string; name: string | null; role: string } | null;
}

const actionColor: Record<string, string> = {
  "auth.login": "bg-secondary/10 text-secondary-foreground border-secondary/30",
  "application.submit": "bg-secondary/10 text-secondary-foreground border-secondary/30",
  "application.approved": "bg-primary/10 text-primary border-primary/30",
  "application.reviewed": "bg-blue-500/10 text-blue-600 border-blue-500/30",
  "application.rejected": "bg-destructive/10 text-destructive border-destructive/30",
  "application.under_review": "bg-accent/15 text-accent-foreground border-accent/30",
  "application.submitted": "bg-secondary/10 text-secondary-foreground border-secondary/30",
  "news.create": "bg-primary/10 text-primary border-primary/30",
  "news.update": "bg-accent/15 text-accent-foreground border-accent/30",
  "news.delete": "bg-destructive/10 text-destructive border-destructive/30",
  "user.create": "bg-primary/10 text-primary border-primary/30",
  "user.update": "bg-accent/15 text-accent-foreground border-accent/30",
  "user.delete": "bg-destructive/10 text-destructive border-destructive/30",
};

export function AdminAudit() {
  const authedFetch = useAuthedFetch();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const r = await authedFetch("/api/audit");
        if (!r.ok) throw new Error("Failed");
        const data = await r.json();
        if (cancelled) return;
        setLogs(data.logs || []);
      } catch {
        toast.error("Failed to load audit log");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [authedFetch]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <History className="h-5 w-5 text-primary" aria-hidden />
          Audit Log
        </h2>
        <p className="text-xs text-muted-foreground">
          Last 100 privileged actions performed in the admin portal.
        </p>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            No audit entries yet.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-border max-h-[70vh] overflow-y-auto scroll-area-thin">
              {logs.map((l) => (
                <li key={l.id} className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-mono ${
                            actionColor[l.action] ||
                            "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {l.action}
                        </Badge>
                        {l.target && (
                          <span className="text-[10px] text-muted-foreground font-mono">
                            → {l.target}
                          </span>
                        )}
                      </div>
                      {l.detail && (
                        <div className="text-xs text-foreground leading-relaxed">
                          {l.detail}
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground flex-wrap">
                        {l.actor ? (
                          <>
                            <UserIcon className="h-3 w-3" aria-hidden />
                            <span>
                              {l.actor.name || l.actor.email}{" "}
                              <span className="text-muted-foreground/70">
                                ({l.actor.role.replace("_", " ")})
                              </span>
                            </span>
                          </>
                        ) : (
                          <span className="italic">system</span>
                        )}
                        <span>·</span>
                        <span>{new Date(l.createdAt).toLocaleString()}</span>
                        {l.ip && (
                          <>
                            <span>·</span>
                            <span className="font-mono">{l.ip}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
