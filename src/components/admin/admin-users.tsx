"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ShieldCheck,
  UserCog,
  User as UserIcon,
  Loader2,
  Power,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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
import { woredas } from "@/lib/types";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  phone: string | null;
  region: string | null;
  active: boolean;
  createdAt: string;
}

const emptyDraft = {
  email: "",
  password: "",
  name: "",
  role: "admin",
  phone: "",
  region: "",
  active: true,
};

export function AdminUsers() {
  const session = useApp((s) => s.session);
  const lang = useApp((s) => s.lang);
  const authedFetch = useAuthedFetch();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await authedFetch("/api/users");
      if (!res.ok) throw new Error("Failed to load users");
      const data = await res.json();
      setUsers(data.users || []);
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

  const openEdit = (u: User) => {
    setEditingId(u.id);
    setDraft({
      email: u.email,
      password: "", // blank = unchanged
      name: u.name || "",
      role: u.role,
      phone: u.phone || "",
      region: u.region || "",
      active: u.active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!draft.email || (!editingId && !draft.password)) {
      toast.error("Email and password are required.");
      return;
    }
    setSaving(true);
    try {
      const url = editingId ? `/api/users/${editingId}` : "/api/users";
      const method = editingId ? "PATCH" : "POST";
      const body: Record<string, unknown> = {
        email: draft.email,
        name: draft.name || null,
        role: draft.role,
        phone: draft.phone || null,
        region: draft.region || null,
        active: draft.active,
      };
      if (draft.password) body.password = draft.password;
      const res = await authedFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Save failed");
      }
      toast.success(editingId ? "User updated" : "User created");
      setDialogOpen(false);
      await load();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Save failed";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (u: User) => {
    try {
      const res = await authedFetch(`/api/users/${u.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !u.active }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed");
      }
      setUsers((prev) =>
        prev.map((x) => (x.id === u.id ? { ...x, active: !x.active } : x))
      );
      toast.success(!u.active ? "User activated" : "User deactivated");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed";
      toast.error(msg);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await authedFetch(`/api/users/${deleteId}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Delete failed");
      }
      toast.success("User deleted");
      setUsers((prev) => prev.filter((x) => x.id !== deleteId));
      setDeleteId(null);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Delete failed";
      toast.error(msg);
    }
  };

  const roleBadge = (role: string) => {
    const map: Record<string, { icon: typeof UserIcon; cls: string }> = {
      super_admin: {
        icon: ShieldCheck,
        cls: "bg-primary/15 text-primary border-primary/30",
      },
      admin: {
        icon: UserCog,
        cls: "bg-secondary/15 text-secondary-foreground border-secondary/30",
      },
      applicant: {
        icon: UserIcon,
        cls: "bg-muted text-muted-foreground border-border",
      },
    };
    const m = map[role] || map.applicant;
    const Icon = m.icon;
    return (
      <Badge variant="outline" className={`text-[10px] gap-1 ${m.cls}`}>
        <Icon className="h-3 w-3" aria-hidden />
        {role.replace("_", " ")}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Users &amp; Admins</h2>
          <p className="text-xs text-muted-foreground">
            Manage admin accounts, reviewers, and applicant accounts.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Add user</span>
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            No users found.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto scroll-area-thin">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 border-b border-border">
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Woreda</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-xs">{u.name || u.email}</div>
                        <div className="text-[11px] text-muted-foreground">{u.email}</div>
                      </td>
                      <td className="px-4 py-3">{roleBadge(u.role)}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {u.region ? (woredas.find(w => w.key === u.region)?.[lang === "en" ? "label_en" : "label_am"] || u.region) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            u.active
                              ? "bg-primary/10 text-primary border-primary/30"
                              : "bg-destructive/10 text-destructive border-destructive/30"
                          }`}
                        >
                          {u.active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-muted-foreground">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => toggleActive(u)}
                            className="h-8 w-8"
                            title={u.active ? "Deactivate" : "Activate"}
                            disabled={u.id === session?.id}
                          >
                            <Power className="h-3.5 w-3.5" aria-hidden />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openEdit(u)}
                            className="h-8 w-8"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" aria-hidden />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setDeleteId(u.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            title="Delete"
                            disabled={u.id === session?.id}
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit user" : "Create user"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="u-email" className="text-xs">Email *</Label>
              <Input
                id="u-email"
                type="email"
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="u-pass" className="text-xs">
                Password {editingId ? "(leave blank to keep current)" : "*"}
              </Label>
              <Input
                id="u-pass"
                type="password"
                value={draft.password}
                onChange={(e) => setDraft({ ...draft, password: e.target.value })}
                className="mt-1.5"
                placeholder={editingId ? "••••••••" : ""}
              />
            </div>
            <div>
              <Label htmlFor="u-name" className="text-xs">Name</Label>
              <Input
                id="u-name"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Role</Label>
                <Select
                  value={draft.role}
                  onValueChange={(v) => setDraft({ ...draft, role: v })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin / Reviewer</SelectItem>
                    <SelectItem value="applicant">Applicant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="u-region" className="text-xs">Woreda</Label>
                <Select
                  value={draft.region || ""}
                  onValueChange={(v) => setDraft({ ...draft, region: v })}
                >
                  <SelectTrigger id="u-region" className="mt-1.5 w-full">
                    <SelectValue placeholder="Select Woreda" />
                  </SelectTrigger>
                  <SelectContent>
                    {woredas.map((w) => (
                      <SelectItem key={w.key} value={w.key}>
                        {lang === "en" ? w.label_en : w.label_am}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="u-phone" className="text-xs">Phone</Label>
              <Input
                id="u-phone"
                value={draft.phone}
                onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                className="mt-1.5"
                placeholder="+251912345678"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="u-active"
                checked={draft.active}
                onCheckedChange={(v) => setDraft({ ...draft, active: v })}
              />
              <Label htmlFor="u-active" className="text-xs">Active</Label>
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

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user account and all their associated data. This action cannot be undone.
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
