"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Search,
  X,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  FileText,
  Mail,
  Phone,
  MapPin,
  Building2,
  User,
  Calendar,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/lib/store";
import { useAuthedFetch } from "../portal/use-authed-fetch";
import { toast } from "sonner";
import { categories } from "@/lib/data";

interface Application {
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
  nationalId: string | null;
  readinessPercent: number;
  uploadedDocuments: string;
  notes: string | null;
  status: string;
  reviewNote: string | null;
  createdAt: string;
  reviewedAt: string | null;
}

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  submitted: { label: "Submitted", cls: "bg-secondary/15 text-secondary-foreground border-secondary/30" },
  under_review: { label: "Under Review", cls: "bg-accent/20 text-accent-foreground border-accent/30" },
  approved: { label: "Approved", cls: "bg-primary/15 text-primary border-primary/30" },
  rejected: { label: "Rejected", cls: "bg-destructive/15 text-destructive border-destructive/30" },
  revoked: { label: "Revoked", cls: "bg-muted text-muted-foreground border-border" },
};

export function AdminApplications() {
  const lang = useApp((s) => s.lang);
  const authedFetch = useAuthedFetch();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Application | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [newStatus, setNewStatus] = useState<string>("");
  const [updating, setUpdating] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (query.trim()) params.set("q", query.trim());
      const res = await authedFetch(`/api/applications?${params}`);
      if (!res.ok) throw new Error("Failed to load applications");
      const data = await res.json();
      setApps(data.applications || []);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [query]);

  const openDetail = (a: Application) => {
    setSelected(a);
    setReviewNote(a.reviewNote || "");
    setNewStatus(a.status);
  };

  const closeDetail = () => {
    setSelected(null);
    setReviewNote("");
    setNewStatus("");
  };

  const handleUpdate = async () => {
    if (!selected) return;
    setUpdating(true);
    try {
      const res = await authedFetch(`/api/applications/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, reviewNote }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Update failed");
      }
      const data = await res.json();
      setApps((prev) =>
        prev.map((a) => (a.id === data.application.id ? data.application : a))
      );
      toast.success(`Application marked as ${newStatus.replace("_", " ")}`);
      closeDetail();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Update failed";
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  const statusBadge = (status: string) => {
    const s = STATUS_BADGE[status] || { label: status, cls: "" };
    return (
      <Badge variant="outline" className={`text-[10px] ${s.cls}`}>
        {s.label}
      </Badge>
    );
  };

  // Resolve the full category object for the detail modal (to show full document list)
  const detailCategory = useMemo(() => {
    if (!selected) return null;
    return (
      categories.find(
        (c) => c.code === selected.categoryCode && c.num === selected.categoryNum
      ) || null
    );
  }, [selected]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, org, email, category code…"
            className="pl-9 pr-9"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="revoked">Revoked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : apps.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            No applications match your filter.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto scroll-area-thin">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 border-b border-border">
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Applicant</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Readiness</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Submitted</th>
                    <th className="px-4 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {apps.map((a) => (
                    <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-xs">
                          {a.organizationName || a.contactName}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate max-w-[180px]">
                          {a.email}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-mono text-xs font-semibold">
                          {a.categoryCode}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                          {a.categoryTitle}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${a.readinessPercent}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-muted-foreground">
                            {a.readinessPercent}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{statusBadge(a.status)}</td>
                      <td className="px-4 py-3 text-[11px] text-muted-foreground">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDetail(a)}
                          className="gap-1.5 h-8"
                        >
                          <Eye className="h-3.5 w-3.5" aria-hidden />
                          Review
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detail modal */}
      <Dialog open={!!selected} onOpenChange={(v) => !v && closeDetail()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto scroll-area-thin">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 flex-wrap">
                  <span>Application Review</span>
                  {statusBadge(selected.status)}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Category */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" aria-hidden />
                      Category
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">
                        {selected.categoryCode}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        #{selected.categoryNum} / 45
                      </span>
                    </div>
                    <div className="font-medium">{selected.categoryTitle}</div>
                    {detailCategory && (
                      <div className="text-xs text-muted-foreground amharic mt-1" lang="am">
                        {detailCategory.title_am}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Applicant */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" aria-hidden />
                      Applicant
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Info icon={selected.applicantType === "organization" ? Building2 : User}
                        label="Type"
                        value={selected.applicantType === "organization" ? "Organization" : "Individual"} />
                      {selected.organizationName && (
                        <Info icon={Building2} label="Organization" value={selected.organizationName} />
                      )}
                      <Info icon={User} label="Contact" value={selected.contactName} />
                      <Info icon={Mail} label="Email" value={selected.email} />
                      <Info icon={Phone} label="Phone" value={selected.phone} />
                      <Info icon={MapPin} label="Address" value={`${selected.addressLine}, ${selected.city}, ${selected.region}`} />
                      {selected.tinNumber && (
                        <Info icon={FileText} label="TIN" value={selected.tinNumber} />
                      )}
                      {selected.nationalId && (
                        <Info icon={ShieldCheck} label="National ID" value={selected.nationalId} />
                      )}
                      <Info icon={Calendar} label="Submitted" value={new Date(selected.createdAt).toLocaleString()} />
                    </div>
                    {selected.notes && (
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-1">Notes</div>
                        <div className="text-xs bg-muted/40 rounded p-2">{selected.notes}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Documents */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Uploaded documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selected.uploadedDocuments ? (
                      <ul className="text-xs space-y-1.5">
                        {selected.uploadedDocuments.split(",").map((f, i) => {
                          const filename = f.trim();
                          return (
                            <li key={i} className="flex items-center justify-between gap-2 bg-muted/40 rounded px-2.5 py-1.5 border border-border/50">
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className="h-3.5 w-3.5 text-primary flex-shrink-0" aria-hidden />
                                <span className="font-mono truncate">{filename}</span>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs text-primary hover:text-primary-foreground hover:bg-primary px-2"
                                onClick={() => setPreviewDoc(filename)}
                              >
                                View
                              </Button>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="text-xs text-muted-foreground">No documents uploaded.</p>
                    )}
                    <div className="mt-2 text-[11px] text-muted-foreground">
                      Readiness at submission: <span className="font-semibold text-primary">{selected.readinessPercent}%</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Review action */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Review action</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs">Set status</Label>
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="submitted">Submitted</SelectItem>
                          <SelectItem value="under_review">Under Review</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="revoked">Revoked</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="reviewNote" className="text-xs">Review note (sent to applicant)</Label>
                      <Textarea
                        id="reviewNote"
                        value={reviewNote}
                        onChange={(e) => setReviewNote(e.target.value)}
                        className="mt-1.5 min-h-[80px]"
                        placeholder="Add a note for the applicant…"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={closeDetail}>
                  Cancel
                </Button>
                <div className="flex-1" />
                {newStatus !== "approved" && (
                  <Button
                    variant="outline"
                    onClick={() => setNewStatus("approved")}
                    className="gap-1.5 text-primary border-primary/30 hover:bg-primary/5"
                  >
                    <CheckCircle2 className="h-4 w-4" aria-hidden />
                    Approve
                  </Button>
                )}
                {newStatus !== "rejected" && (
                  <Button
                    variant="outline"
                    onClick={() => setNewStatus("rejected")}
                    className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5"
                  >
                    <XCircle className="h-4 w-4" aria-hidden />
                    Reject
                  </Button>
                )}
                {newStatus !== "under_review" && (
                  <Button
                    variant="outline"
                    onClick={() => setNewStatus("under_review")}
                    className="gap-1.5"
                  >
                    <Clock className="h-4 w-4" aria-hidden />
                    Under review
                  </Button>
                )}
                <Button onClick={handleUpdate} disabled={updating} className="gap-1.5">
                  {updating ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <RotateCcw className="h-4 w-4" aria-hidden />
                  )}
                  Save
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Document Preview Modal */}
      <Dialog open={!!previewDoc} onOpenChange={(v) => !v && setPreviewDoc(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="truncate font-mono text-sm">
              Document Preview: {previewDoc}
            </DialogTitle>
          </DialogHeader>
          {previewDoc && selected && (() => {
            const isImage = /\.(png|jpe?g|gif|webp)$/i.test(previewDoc);
            const isPdf = /\.pdf$/i.test(previewDoc);
            const docUrl = `/uploads/${selected.id}/${previewDoc}`;

            return (
              <div className="space-y-4 flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between text-xs border-b pb-2">
                  <span className="text-muted-foreground font-mono truncate max-w-[70%]">
                    {previewDoc}
                  </span>
                  <a
                    href={docUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline font-medium flex items-center gap-1"
                  >
                    Open in new tab
                  </a>
                </div>

                <div className="border border-border rounded-lg overflow-hidden bg-muted/10 flex-1 flex flex-col items-center justify-center min-h-[350px] relative">
                  {isImage ? (
                    <img
                      src={docUrl}
                      alt={previewDoc}
                      className="max-w-full max-h-[50vh] object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const sibling = e.currentTarget.nextElementSibling as HTMLElement;
                        if (sibling) sibling.classList.remove('hidden');
                      }}
                    />
                  ) : isPdf ? (
                    <iframe
                      src={docUrl}
                      title={previewDoc}
                      className="w-full h-[50vh] border-0"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <FileText className="h-16 w-16 text-muted-foreground mb-3" />
                      <span className="font-mono font-semibold text-sm mb-1">{previewDoc}</span>
                      <span className="text-xs text-muted-foreground mb-4">No direct preview available for this file type.</span>
                    </div>
                  )}

                  {/* Fallback container shown only if loading fails (e.g. for seeded data files that aren't on disk) */}
                  {isImage && (
                    <div className="hidden flex flex-col items-center justify-center p-6 text-center absolute inset-0 bg-background/95">
                      <FileText className="h-12 w-12 text-muted-foreground mb-3" />
                      <span className="font-mono font-semibold text-xs mb-1">{previewDoc}</span>
                      <p className="text-xs text-muted-foreground max-w-xs mb-4">
                        This is a sample document name from seeded database data and does not exist on disk.
                      </p>
                      <a
                        href={docUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                      >
                        Try opening in new tab
                      </a>
                    </div>
                  )}
                </div>

                <DialogFooter className="gap-2 pt-2 border-t mt-auto">
                  <Button variant="outline" onClick={() => setPreviewDoc(null)}>
                    Close
                  </Button>
                  <Button asChild className="gap-1.5">
                    <a href={docUrl} download={previewDoc}>
                      Download Document
                    </a>
                  </Button>
                </DialogFooter>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
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
