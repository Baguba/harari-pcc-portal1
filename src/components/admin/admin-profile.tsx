"use client";

import { useEffect, useState, useRef } from "react";
import {
  Upload,
  Stamp,
  PenTool,
  Loader2,
  Trash2,
  FileText,
  CheckCircle2,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuthedFetch } from "../portal/use-authed-fetch";
import { toast } from "sonner";

interface ProfileData {
  stampUrl: string | null;
  signatureUrl: string | null;
}

export function AdminProfile() {
  const authedFetch = useAuthedFetch();
  const [profile, setProfile] = useState<ProfileData>({
    stampUrl: null,
    signatureUrl: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Pending uploads (base64)
  const [pendingStamp, setPendingStamp] = useState<{
    data: string;
    filename: string;
    preview: string;
  } | null>(null);
  const [pendingSignature, setPendingSignature] = useState<{
    data: string;
    filename: string;
    preview: string;
  } | null>(null);

  const stampInputRef = useRef<HTMLInputElement>(null);
  const sigInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await authedFetch("/api/profile");
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        if (cancelled) return;
        setProfile(data);
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

  const handleFileSelect = (
    file: File,
    setter: typeof setPendingStamp
  ) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Extract base64 data
      const base64 = result.split(",")[1];
      setter({
        data: base64,
        filename: file.name,
        preview: result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!pendingStamp && !pendingSignature) {
      toast.info("No new files to upload.");
      return;
    }

    setSaving(true);
    try {
      const body: Record<string, { data: string; filename: string }> = {};
      if (pendingStamp) {
        body.stamp = {
          data: pendingStamp.data,
          filename: pendingStamp.filename,
        };
      }
      if (pendingSignature) {
        body.signature = {
          data: pendingSignature.data,
          filename: pendingSignature.filename,
        };
      }

      const res = await authedFetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Upload failed");
      }

      const data = await res.json();
      setProfile(data);
      setPendingStamp(null);
      setPendingSignature(null);
      toast.success("Profile updated successfully!");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Upload failed";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold">Profile Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Upload your official stamp and signature. These will appear on
          Professional Competence Certificates issued to approved applicants.
        </p>
      </div>

      {/* Stamp Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Stamp className="h-4 w-4 text-primary" aria-hidden />
            Official Stamp
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Upload a scanned image of your official stamp (PNG, JPG, or PDF).
            This will be displayed on all certificates.
          </p>

          {/* Current stamp preview */}
          {(profile.stampUrl || pendingStamp) && (
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <Label className="text-xs text-muted-foreground mb-2 block">
                {pendingStamp ? "New stamp (pending save)" : "Current stamp"}
              </Label>
              <div className="flex items-center gap-3">
                {pendingStamp ? (
                  isImageFile(pendingStamp.filename) ? (
                    <img
                      src={pendingStamp.preview}
                      alt="Stamp preview"
                      className="h-24 w-24 object-contain rounded border border-border bg-white"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded border border-border bg-white flex flex-col items-center justify-center text-muted-foreground">
                      <FileText className="h-8 w-8" />
                      <span className="text-[10px] mt-1">PDF</span>
                    </div>
                  )
                ) : profile.stampUrl ? (
                  isImageUrl(profile.stampUrl) ? (
                    <img
                      src={profile.stampUrl}
                      alt="Current stamp"
                      className="h-24 w-24 object-contain rounded border border-border bg-white"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded border border-border bg-white flex flex-col items-center justify-center text-muted-foreground">
                      <FileText className="h-8 w-8" />
                      <span className="text-[10px] mt-1">PDF</span>
                    </div>
                  )
                ) : null}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {pendingStamp ? pendingStamp.filename : "Uploaded"}
                  </div>
                  {pendingStamp && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPendingStamp(null)}
                      className="gap-1 text-xs text-destructive mt-1 h-7 px-2"
                    >
                      <Trash2 className="h-3 w-3" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Upload button */}
          <input
            ref={stampInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file, setPendingStamp);
              e.target.value = "";
            }}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => stampInputRef.current?.click()}
            className="gap-1.5"
          >
            <Upload className="h-3.5 w-3.5" aria-hidden />
            {profile.stampUrl || pendingStamp
              ? "Replace stamp"
              : "Upload stamp"}
          </Button>
        </CardContent>
      </Card>

      {/* Signature Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <PenTool className="h-4 w-4 text-primary" aria-hidden />
            Signature
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Upload a scanned image of your signature (PNG, JPG, or PDF). This
            will be displayed on all certificates.
          </p>

          {/* Current signature preview */}
          {(profile.signatureUrl || pendingSignature) && (
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <Label className="text-xs text-muted-foreground mb-2 block">
                {pendingSignature
                  ? "New signature (pending save)"
                  : "Current signature"}
              </Label>
              <div className="flex items-center gap-3">
                {pendingSignature ? (
                  isImageFile(pendingSignature.filename) ? (
                    <img
                      src={pendingSignature.preview}
                      alt="Signature preview"
                      className="h-24 w-auto max-w-[200px] object-contain rounded border border-border bg-white"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded border border-border bg-white flex flex-col items-center justify-center text-muted-foreground">
                      <FileText className="h-8 w-8" />
                      <span className="text-[10px] mt-1">PDF</span>
                    </div>
                  )
                ) : profile.signatureUrl ? (
                  isImageUrl(profile.signatureUrl) ? (
                    <img
                      src={profile.signatureUrl}
                      alt="Current signature"
                      className="h-24 w-auto max-w-[200px] object-contain rounded border border-border bg-white"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded border border-border bg-white flex flex-col items-center justify-center text-muted-foreground">
                      <FileText className="h-8 w-8" />
                      <span className="text-[10px] mt-1">PDF</span>
                    </div>
                  )
                ) : null}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {pendingSignature
                      ? pendingSignature.filename
                      : "Uploaded"}
                  </div>
                  {pendingSignature && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPendingSignature(null)}
                      className="gap-1 text-xs text-destructive mt-1 h-7 px-2"
                    >
                      <Trash2 className="h-3 w-3" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Upload button */}
          <input
            ref={sigInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file, setPendingSignature);
              e.target.value = "";
            }}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => sigInputRef.current?.click()}
            className="gap-1.5"
          >
            <Upload className="h-3.5 w-3.5" aria-hidden />
            {profile.signatureUrl || pendingSignature
              ? "Replace signature"
              : "Upload signature"}
          </Button>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleSave}
          disabled={saving || (!pendingStamp && !pendingSignature)}
          className="gap-1.5"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Upload className="h-4 w-4" aria-hidden />
          )}
          Save Changes
        </Button>
        {pendingStamp || pendingSignature ? (
          <span className="text-xs text-muted-foreground">
            You have unsaved changes
          </span>
        ) : null}
      </div>

      {/* Info box */}
      <Card className="bg-blue-500/5 border-blue-500/20">
        <CardContent className="p-4 flex items-start gap-3">
          <ImageIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" aria-hidden />
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">
              How stamp and signature are used
            </p>
            <p>
              Your uploaded stamp and signature will automatically appear on
              Professional Competence Certificates that are issued to approved
              applicants. For best results, use a high-resolution scan with a
              transparent or white background.
            </p>
            <p>Supported formats: PNG, JPG, WebP, or PDF.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function isImageFile(filename: string): boolean {
  return /\.(png|jpe?g|gif|webp)$/i.test(filename);
}

function isImageUrl(url: string): boolean {
  return /\.(png|jpe?g|gif|webp)$/i.test(url);
}

// Suppress unused import warnings
void ImageIcon;
