"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pin,
  PinOff,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Newspaper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useApp } from "@/lib/store";
import { useAuthedFetch } from "../portal/use-authed-fetch";
import { toast } from "sonner";

interface NewsItem {
  id: string;
  titleEn: string;
  titleAm: string;
  bodyEn: string;
  bodyAm: string;
  category: string;
  pinned: boolean;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
}

const emptyDraft: Omit<NewsItem, "id" | "publishedAt" | "createdAt"> = {
  titleEn: "",
  titleAm: "",
  bodyEn: "",
  bodyAm: "",
  category: "general",
  pinned: false,
  published: true,
};

export function AdminNews() {
  const lang = useApp((s) => s.lang);
  const session = useApp((s) => s.session);
  const authedFetch = useAuthedFetch();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isSuperAdmin = session?.role === "super_admin";

  const load = async () => {
    setLoading(true);
    try {
      const res = await authedFetch("/api/news");
      if (!res.ok) throw new Error("Failed to load news");
      const data = await res.json();
      setItems(data.news || []);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Load failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setDraft(emptyDraft);
    setDialogOpen(true);
  };

  const openEdit = (n: NewsItem) => {
    setEditingId(n.id);
    setDraft({
      titleEn: n.titleEn,
      titleAm: n.titleAm,
      bodyEn: n.bodyEn,
      bodyAm: n.bodyAm,
      category: n.category,
      pinned: n.pinned,
      published: n.published,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!draft.titleEn || !draft.titleAm || !draft.bodyEn || !draft.bodyAm) {
      toast.error("All title and body fields (both languages) are required.");
      return;
    }
    setSaving(true);
    try {
      const url = editingId ? `/api/news/${editingId}` : "/api/news";
      const method = editingId ? "PATCH" : "POST";
      const res = await authedFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Save failed");
      }
      toast.success(editingId ? "News updated" : "News created");
      setDialogOpen(false);
      await load();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Save failed";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const togglePin = async (n: NewsItem) => {
    try {
      const res = await authedFetch(`/api/news/${n.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinned: !n.pinned }),
      });
      if (!res.ok) throw new Error("Failed");
      setItems((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, pinned: !x.pinned } : x))
      );
    } catch {
      toast.error("Failed to toggle pin");
    }
  };

  const togglePublish = async (n: NewsItem) => {
    try {
      const res = await authedFetch(`/api/news/${n.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !n.published }),
      });
      if (!res.ok) throw new Error("Failed");
      setItems((prev) =>
        prev.map((x) =>
          x.id === n.id
            ? {
                ...x,
                published: !x.published,
                publishedAt: !x.published ? new Date().toISOString() : x.publishedAt,
              }
            : x
        )
      );
      toast.success(!n.published ? "News published" : "News unpublished");
    } catch {
      toast.error("Failed to toggle publish");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await authedFetch(`/api/news/${deleteId}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Delete failed");
      }
      toast.success("News deleted");
      setItems((prev) => prev.filter((x) => x.id !== deleteId));
      setDeleteId(null);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Delete failed";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-primary" aria-hidden />
            {lang === "en" ? "News & Announcements" : lang === "am" ? "ዜና እና ማስታወቂያዎች" : "Oduu fi Beeksisa"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {lang === "en"
              ? "Publish directive changes, fee updates, and announcements."
              : lang === "am"
                ? "የመመሪያ ለውጦችን፣ የክፍያ ዝመናዎችን እና ማስታወቂያዎችን ያውጡ።"
                : "Haaromsawwan qajeelfamaa, kaffaltiiwwanii fi beeksisa adda addaa maxxansi."}
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">New</span>
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            No news yet. Click &ldquo;New&rdquo; to create one.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <Card key={n.id} className={n.pinned ? "border-accent/40 bg-accent/5" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {n.pinned && (
                        <Pin className="h-3.5 w-3.5 text-accent" aria-hidden />
                      )}
                      <Badge variant="outline" className="text-[10px]">
                        {n.category.replace("_", " ")}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          n.published
                            ? "bg-primary/10 text-primary border-primary/30"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {n.published ? "Published" : "Draft"}
                      </Badge>
                      {n.publishedAt && (
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(n.publishedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-sm leading-snug">
                      {n.titleEn}
                    </div>
                    <div className="text-xs text-muted-foreground amharic mt-0.5" lang="am">
                      {n.titleAm}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                      {n.bodyEn}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => togglePin(n)}
                      className="h-8 w-8"
                      title={n.pinned ? "Unpin" : "Pin to top"}
                    >
                      {n.pinned ? (
                        <PinOff className="h-3.5 w-3.5" aria-hidden />
                      ) : (
                        <Pin className="h-3.5 w-3.5" aria-hidden />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => togglePublish(n)}
                      className="h-8 w-8"
                      title={n.published ? "Unpublish" : "Publish"}
                    >
                      {n.published ? (
                        <EyeOff className="h-3.5 w-3.5" aria-hidden />
                      ) : (
                        <Eye className="h-3.5 w-3.5" aria-hidden />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openEdit(n)}
                      className="h-8 w-8"
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden />
                    </Button>
                    {isSuperAdmin && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setDeleteId(n.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        title="Delete (super admin only)"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create / edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto scroll-area-thin">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit news" : "Create news"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="t-en" className="text-xs">Title (English) *</Label>
                <Input
                  id="t-en"
                  value={draft.titleEn}
                  onChange={(e) => setDraft({ ...draft, titleEn: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="t-am" className="text-xs">Title (Amharic) *</Label>
                <Input
                  id="t-am"
                  value={draft.titleAm}
                  onChange={(e) => setDraft({ ...draft, titleAm: e.target.value })}
                  className="mt-1.5 amharic"
                  dir="ltr"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="b-en" className="text-xs">Body (English) *</Label>
              <Textarea
                id="b-en"
                value={draft.bodyEn}
                onChange={(e) => setDraft({ ...draft, bodyEn: e.target.value })}
                className="mt-1.5 min-h-[80px]"
              />
            </div>
            <div>
              <Label htmlFor="b-am" className="text-xs">Body (Amharic) *</Label>
              <Textarea
                id="b-am"
                value={draft.bodyAm}
                onChange={(e) => setDraft({ ...draft, bodyAm: e.target.value })}
                className="mt-1.5 min-h-[80px] amharic"
              />
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Category</Label>
                <Select
                  value={draft.category}
                  onValueChange={(v) => setDraft({ ...draft, category: v })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="directive_change">Directive Change</SelectItem>
                    <SelectItem value="fee">Fee</SelectItem>
                    <SelectItem value="outage">Outage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  id="pin"
                  checked={draft.pinned}
                  onCheckedChange={(v) => setDraft({ ...draft, pinned: v })}
                />
                <Label htmlFor="pin" className="text-xs">Pin to top</Label>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  id="pub"
                  checked={draft.published}
                  onCheckedChange={(v) => setDraft({ ...draft, published: v })}
                />
                <Label htmlFor="pub" className="text-xs">Publish</Label>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="gap-1.5">
              {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              {editingId ? "Save changes" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete news item?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The news item will be permanently removed and any associated notifications cleared.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
