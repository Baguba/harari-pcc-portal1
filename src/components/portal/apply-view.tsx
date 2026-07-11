"use client";

import { useEffect, useState, useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  CheckCircle2,
  X,
  Send,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/lib/store";
import { t } from "@/lib/i18n";
import { categories, splitRequirementItems } from "@/lib/data";
import { isMonopolyCategory, type LicenseCategory } from "@/lib/types";
import { toast } from "sonner";

interface Props {
  code: string;
  num: number;
}

interface UploadedFile {
  name: string;
  size: number;
  content?: string;
}

export function ApplyView({ code, num }: Props) {
  const lang = useApp((s) => s.lang);
  const setView = useApp((s) => s.setView);

  const category = useMemo<LicenseCategory | undefined>(
    () => categories.find((c) => c.code === code && c.num === num),
    [code, num]
  );

  // Restore readiness from self-check
  const [readinessPercent, setReadinessPercent] = useState(0);
  useEffect(() => {
    if (typeof window === "undefined" || !category) return;
    const key = `mcit:selfcheck:${code}:${num}`;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const checked: Record<string, boolean> = JSON.parse(raw);
        const items = [
          ...splitRequirementItems(category.personnel),
          ...splitRequirementItems(category.facility),
          ...splitRequirementItems(category.equipment),
          ...splitRequirementItems(category.documents),
        ];
        const total = items.length;
        const done = items.filter((it) =>
          checked[`personnel:${it}`] ||
          checked[`facility:${it}`] ||
          checked[`equipment:${it}`] ||
          checked[`documents:${it}`]
        ).length;
        setReadinessPercent(total === 0 ? 0 : Math.round((done / total) * 100));
      }
    } catch {
      /* ignore */
    }
  }, [code, num, category]);

  // Form state
  const [applicantType, setApplicantType] = useState<"individual" | "organization">("organization");
  const [organizationName, setOrganizationName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("Harari");
  const [city, setCity] = useState("Harar");
  const [addressLine, setAddressLine] = useState("");
  const [tinNumber, setTinNumber] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [notes, setNotes] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  // Prefill from logged-in applicant session
  const session = useApp((s) => s.session);
  useEffect(() => {
    if (session?.role === "applicant") {
      setContactName(session.name || "");
      setEmail(session.email || "");
      setPhone(session.phone || "");
      setRegion(session.region || "Harari");
    }
  }, [session]);

  if (!category) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-20 text-center text-muted-foreground">
        {t("common.loading", lang)}
      </div>
    );
  }

  // Encourage sign-up (but don't block — guests can still apply)
  const showSignupNudge = !session;

  if (isMonopolyCategory(category)) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">
          {t("detail.cta.cannot_apply", lang)}
        </p>
        <Button onClick={() => setView({ name: "categories" })} variant="outline">
          {t("nav.categories", lang)}
        </Button>
      </div>
    );
  }

  const documentItems = splitRequirementItems(category.documents);

  const handleFileChange = (docKey: string, file: File | null) => {
    if (!file) return;
    // Validation: max 10MB, common doc types
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large", { description: "Maximum 10MB per file." });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedFiles((prev) => ({
        ...prev,
        [docKey]: {
          name: file.name,
          size: file.size,
          content: reader.result as string,
        },
      }));
      toast.success(`Uploaded: ${file.name}`);
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (docKey: string) => {
    setUploadedFiles((prev) => {
      const next = { ...prev };
      delete next[docKey];
      return next;
    });
  };

  const validate = (): string | null => {
    if (applicantType === "organization" && !organizationName.trim())
      return t("apply.org_name", lang) + " is required.";
    if (!contactName.trim()) return t("apply.contact_name", lang) + " is required.";
    if (!email.trim() || !email.includes("@"))
      return t("apply.email", lang) + " is required.";
    if (!phone.trim()) return t("apply.phone", lang) + " is required.";
    if (!city.trim()) return t("apply.city", lang) + " is required.";
    if (!addressLine.trim()) return t("apply.address", lang) + " is required.";
    const cleanNid = nationalId.replace(/[\s-]/g, "");
    if (!cleanNid) {
      return t("apply.national_id", lang) + " " + (lang === "en" ? "is required." : "ያስፈልጋል።");
    }
    if (!/^\d{16}$/.test(cleanNid)) {
      return lang === "en"
        ? "National ID must be exactly a 16-digit number."
        : "ብሔራዊ መታወቂያው በትክክል ባለ 16 አሃዝ ቁጥር መሆን አለበት።";
    }
    // Require at least 50% of documents uploaded
    const docKeys = Object.keys(uploadedFiles);
    const uploadedCount = docKeys.length;
    const minRequired = Math.ceil(documentItems.length * 0.5);
    if (uploadedCount < minRequired) {
      return lang === "en"
        ? `Please upload at least ${minRequired} of ${documentItems.length} required documents.`
        : `እባክዎ ቢያንስ ${minRequired} ከ ${documentItems.length} የሚገቡ ሰነዶችን ይስቀሉ።`;
    }
    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      toast.error("Please fix the following", { description: error });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryCode: category.code,
          categoryNum: category.num,
          categoryTitle: category.title_en,
          applicantType,
          organizationName: organizationName || null,
          contactName,
          email,
          phone,
          region,
          city,
          addressLine,
          tinNumber: tinNumber || null,
          nationalId: nationalId.replace(/[\s-]/g, "") || null,
          readinessPercent,
          uploadedDocuments: Object.values(uploadedFiles)
            .map((f) => f.name)
            .join(","),
          documentsData: Object.values(uploadedFiles).map((f) => ({
            name: f.name,
            content: f.content,
          })),
          notes: notes || null,
          submittedById: session?.role === "applicant" ? session.id : null,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Submission failed");
      }
      const data = await res.json();
      setSubmissionId(data.application.id);
      setSubmitted(true);
      toast.success("Application submitted successfully");
      // Clear the self-check state for this category
      try {
        localStorage.removeItem(`mcit:selfcheck:${code}:${num}`);
      } catch {
        /* ignore */
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Submission failed";
      toast.error("Submission failed", { description: msg });
    } finally {
      setSubmitting(false);
    }
  };

  // Confirmation screen
  if (submitted) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <Card className="border-primary/30">
          <CardHeader className="text-center pb-2">
            <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-9 w-9" aria-hidden />
            </div>
            <CardTitle className="text-2xl">
              {t("apply.confirm.title", lang)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              {t("apply.confirm.body", lang)}
            </p>
            <Separator />
            <div className="bg-muted/40 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">
                  {lang === "en" ? "Reference ID" : "ማመልከቻ ቁጥር"}
                </span>
                <span className="font-mono font-semibold text-xs">
                  {submissionId?.slice(0, 18) || "—"}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">
                  {lang === "en" ? "Category" : "ምድብ"}
                </span>
                <span className="font-medium text-right">
                  {category.code} — {category.title_en}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">
                  {lang === "en" ? "Applicant" : "አመልካች"}
                </span>
                <span className="font-medium">
                  {organizationName || contactName}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">
                  {t("detail.selfcheck.progress", lang)}
                </span>
                <span className="font-medium">{readinessPercent}%</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold mb-2">
                {t("apply.confirm.next", lang)}
              </div>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal pl-5">
                <li>
                  {lang === "en"
                    ? "PCC staff will review your application and uploaded documents."
                    : "የPCC ሰራተኞች ማመልከቻዎን እና ሰነዶችዎን ያጣራሉ።"}
                </li>
                <li>
                  {lang === "en"
                    ? "If additional information is needed, you will be contacted at the email/phone provided."
                    : "ተጨማሪ መረጃ ካስፈለገ በኢሜይል/ስልክ ይገናኛሉ።"}
                </li>
                <li>
                  {lang === "en"
                    ? "The service fee is paid per the Ministry's service-fee directive."
                    : "የአገልግሎት ክፍያ በሚኒስቴር የአገልግሎት ክፍያ መመሪያ ይከፈላል።"}
                </li>
                <li>
                  {lang === "en"
                    ? "Once approved, your Professional Competence Certificate will be issued (valid for 1 year)."
                    : "ከጸደቀ የሙያ ብቃት ሰርቲፊኬትዎ ይሰጥልዎታል (1 ዓመት ይከናወናል)።"}
                </li>
              </ol>
            </div>
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              {session?.role === "applicant" && (
                <Button
                  onClick={() =>
                    setView({
                      name: "applicant-application",
                      id: submissionId || "",
                    })
                  }
                  className="gap-2"
                >
                  {lang === "en" ? "Track this application" : "ይህን ማመልከቻ ይከታተሉ"}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setView({ name: "home" })}
                className="gap-2"
              >
                {t("apply.confirm.back_home", lang)}
              </Button>
              <Button
                variant={session?.role === "applicant" ? "outline" : "default"}
                onClick={() => setView({ name: "categories" })}
                className="gap-2"
              >
                {t("apply.confirm.browse", lang)}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Form screen
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setView({ name: "category", code, num })}
        className="gap-2 mb-4"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {t("common.back", lang)}
      </Button>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Badge variant="outline" className="font-mono">
            {category.code}
          </Badge>
          <span className="text-xs text-muted-foreground">#{category.num} / 45</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          {t("apply.title", lang)}
        </h1>
        <p className="text-sm text-muted-foreground amharic" lang="am">
          {category.title_am}
        </p>
        {readinessPercent > 0 && (
          <div className="mt-3 inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" aria-hidden />
            {t("detail.selfcheck.progress", lang)}: {readinessPercent}%
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Sign-up nudge for guests */}
        {showSignupNudge && (
          <div className="rounded-lg border border-accent/30 bg-accent/10 p-3 flex items-center justify-between gap-3 flex-wrap">
            <div className="text-xs text-accent-foreground/90 leading-relaxed flex-1 min-w-[200px]">
              {lang === "en"
                ? "Sign in to track this application, see review feedback, and download your certificate when approved. (You can still apply as a guest.)"
                : "ይህን ማመልከቻ ለመከታተል፣ የግምገማ ግብረመልስ ለማየት፣ እና ሰርቲፊኬትዎ ሲሰጥ ለማውረድ ይግቡ። (እንደ እንግዳ መመዝገብ ይችላሉ።)"}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setView({ name: "login" })}
              >
                {t("nav.login", lang)}
              </Button>
              <Button
                size="sm"
                onClick={() => setView({ name: "signup" })}
              >
                {t("nav.signup", lang)}
              </Button>
            </div>
          </div>
        )}

        {/* Applicant info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("apply.section.applicant", lang)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-2 block">
                {t("apply.applicant_type", lang)}
              </Label>
              <RadioGroup
                value={applicantType}
                onValueChange={(v) => setApplicantType(v as "individual" | "organization")}
                className="flex gap-4"
              >
                <Label
                  htmlFor="r-org"
                  className={`flex items-center gap-2 px-4 py-2 rounded-md border cursor-pointer transition-colors ${
                    applicantType === "organization"
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <RadioGroupItem value="organization" id="r-org" />
                  <span className="text-sm">{t("apply.organization", lang)}</span>
                </Label>
                <Label
                  htmlFor="r-ind"
                  className={`flex items-center gap-2 px-4 py-2 rounded-md border cursor-pointer transition-colors ${
                    applicantType === "individual"
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <RadioGroupItem value="individual" id="r-ind" />
                  <span className="text-sm">{t("apply.individual", lang)}</span>
                </Label>
              </RadioGroup>
            </div>

            {applicantType === "organization" && (
              <div>
                <Label htmlFor="orgName">
                  {t("apply.org_name", lang)} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="orgName"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="mt-1.5"
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="contactName">
                {t("apply.contact_name", lang)} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contactName"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="mt-1.5"
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">
                  {t("apply.email", lang)} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">
                  {t("apply.phone", lang)} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1.5"
                  placeholder="+251912345678"
                  required
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="region">{t("apply.region", lang)}</Label>
                <Input
                  id="region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="city">
                  {t("apply.city", lang)} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1.5"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">
                {t("apply.address", lang)} <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="address"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                className="mt-1.5 min-h-[60px]"
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nationalId">
                  {t("apply.national_id", lang)} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nationalId"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  className="mt-1.5"
                  placeholder="1234567890123456"
                  required
                />
              </div>
              <div>
                <Label htmlFor="tin">{t("apply.tin", lang)}</Label>
                <Input
                  id="tin"
                  value={tinNumber}
                  onChange={(e) => setTinNumber(e.target.value)}
                  className="mt-1.5"
                  placeholder="0001234567"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("apply.section.documents", lang)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {lang === "en"
                ? `Upload at least ${Math.ceil(documentItems.length * 0.5)} of ${documentItems.length} required documents. Max 10MB each.`
                : `ቢያንስ ${Math.ceil(documentItems.length * 0.5)} ከ ${documentItems.length} የሚገቡ ሰነዶችን ይስቀሉ። ከፍተኛ 10MB እያንዳንዱ።`}
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {documentItems.map((doc, i) => {
              const key = `doc:${i}:${doc.slice(0, 30)}`;
              const uploaded = uploadedFiles[key];
              return (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-3 rounded-md border ${
                    uploaded ? "border-primary/40 bg-primary/5" : "border-border"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground mb-1">
                      {i + 1}. {t("apply.upload.label", lang)}
                    </div>
                    <div className="text-sm amharic" lang="am">
                      {doc}
                    </div>
                    {uploaded && (
                      <div className="mt-1.5 text-xs text-primary flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                        {uploaded.name} ({(uploaded.size / 1024).toFixed(1)} KB)
                      </div>
                    )}
                  </div>
                  {uploaded ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(key)}
                      className="text-destructive hover:text-destructive gap-1"
                    >
                      <X className="h-4 w-4" aria-hidden />
                    </Button>
                  ) : (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        className="sr-only"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={(e) =>
                          handleFileChange(key, e.target.files?.[0] || null)
                        }
                      />
                      <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-9 px-3 bg-primary text-primary-foreground hover:bg-primary/90">
                        <Upload className="h-3.5 w-3.5" aria-hidden />
                        <span className="hidden sm:inline">
                          {t("apply.upload.label", lang)}
                        </span>
                      </span>
                    </label>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("apply.notes", lang)}</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                lang === "en"
                  ? "Add any context or special requests for the reviewer…"
                  : "ለግምገማ ሰው ማንኛውንም ተጨማሪ መረጃ ያክሉ…"
              }
              className="min-h-[80px]"
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-2 pb-8">
          <Button
            variant="outline"
            onClick={() => setView({ name: "category", code, num })}
            className="gap-2"
          >
            {t("apply.cancel", lang)}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="gap-2"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Send className="h-4 w-4" aria-hidden />
            )}
            {t("apply.submit", lang)}
          </Button>
        </div>
      </div>
    </div>
  );
}
