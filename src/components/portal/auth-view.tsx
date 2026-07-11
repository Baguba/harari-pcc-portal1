"use client";

import { useState, useMemo } from "react";
import {
  LogIn,
  UserPlus,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp, type SessionUser } from "@/lib/store";
import { t } from "@/lib/i18n";
import { toast } from "sonner";

type Mode = "login" | "signup";

/**
 * Unified authentication view — single entry point for ALL users
 * (applicants, admins, and super_admins all sign in here).
 *
 * After successful login, the user is routed to the right place
 * based on their role:
 *   - super_admin / admin  → Admin portal
 *   - applicant            → Applicant dashboard
 *
 * No separate /admin/login route exists — this is deliberate for
 * security (no public admin login surface to target).
 */
export function AuthView({ initialMode }: { initialMode: Mode }) {
  const lang = useApp((s) => s.lang);
  const setView = useApp((s) => s.setView);
  const setSession = useApp((s) => s.setSession);
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("Harari");
  const [loading, setLoading] = useState(false);

  // Password strength checks
  const passwordRules = useMemo(() => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      digit: /[0-9]/.test(password),
    };
  }, [password]);

  const passwordScore = useMemo(() => {
    const rules = Object.values(passwordRules);
    return rules.filter(Boolean).length;
  }, [passwordRules]);

  const passwordStrengthLabel = useMemo(() => {
    if (password.length === 0) return "";
    if (passwordScore <= 1) return t("password.strength.weak", lang);
    if (passwordScore === 2) return t("password.strength.fair", lang);
    if (passwordScore === 3) return t("password.strength.good", lang);
    return t("password.strength.strong", lang);
  }, [password, passwordScore, lang]);

  const passwordStrengthColor = useMemo(() => {
    if (passwordScore <= 1) return "bg-destructive";
    if (passwordScore === 2) return "bg-orange-500";
    if (passwordScore === 3) return "bg-yellow-500";
    return "bg-emerald-500";
  }, [passwordScore]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const body =
        mode === "login"
          ? { email, password }
          : { email, password, name, phone, region };
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      const user = data.user as SessionUser;
      setSession(user);

      // Sign-up is always applicant role. For login, route by role.
      if (mode === "signup") {
        toast.success("Account created successfully");
        setView({ name: "applicant-dashboard" });
        return;
      }

      // Login: route based on role
      if (user.role === "admin" || user.role === "super_admin") {
        toast.success(
          `${lang === "en" ? "Welcome" : "እንኳን በደህና መጡ"}, ${user.name || user.email}`
        );
        setView({ name: "admin" });
      } else {
        toast.success(
          `${t("applicant.welcome", lang)}, ${user.name || user.email}`
        );
        setView({ name: "applicant-dashboard" });
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Authentication failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode((m) => (m === "login" ? "signup" : "login"));
    setPassword("");
  };

  const isSignup = mode === "signup";

  return (
    <div className="container mx-auto max-w-md px-4 py-12">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setView({ name: "home" })}
        className="gap-2 mb-4"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {t("nav.home", lang)}
      </Button>

      <Card>
        <CardHeader className="text-center">
          <div className="h-14 w-14 flex items-center justify-center mx-auto mb-3">
            <img src="/logo.png" alt="PCC Logo" className="h-14 w-14 object-contain" />
          </div>
          <CardTitle className="text-2xl">
            {isSignup
              ? t("applicant.signup.title", lang)
              : t("auth.login.title", lang)}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {isSignup
              ? t("applicant.signup.subtitle", lang)
              : t("auth.login.subtitle", lang)}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <Label htmlFor="name">
                  {t("applicant.name", lang)} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5"
                  required
                  autoComplete="name"
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">
                {t("admin.login.email", lang)} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <Label htmlFor="password">
                {t("admin.login.password", lang)} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5"
                required
                minLength={8}
                autoComplete={isSignup ? "new-password" : "current-password"}
              />

              {/* Password strength indicator for signup */}
              {isSignup && password.length > 0 && (
                <div className="mt-2.5 space-y-2">
                  {/* Strength bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden flex gap-0.5">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-full transition-colors duration-300 ${
                            i < passwordScore ? passwordStrengthColor : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span
                      className={`text-[11px] font-medium min-w-[44px] text-right ${
                        passwordScore <= 1
                          ? "text-destructive"
                          : passwordScore === 2
                          ? "text-orange-500"
                          : passwordScore === 3
                          ? "text-yellow-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {passwordStrengthLabel}
                    </span>
                  </div>

                  {/* Individual rules */}
                  <ul className="space-y-0.5">
                    {[
                      { key: "length", label: t("password.rule.length", lang), met: passwordRules.length },
                      { key: "uppercase", label: t("password.rule.uppercase", lang), met: passwordRules.uppercase },
                      { key: "lowercase", label: t("password.rule.lowercase", lang), met: passwordRules.lowercase },
                      { key: "digit", label: t("password.rule.digit", lang), met: passwordRules.digit },
                    ].map((rule) => (
                      <li
                        key={rule.key}
                        className={`flex items-center gap-1.5 text-[11px] transition-colors ${
                          rule.met
                            ? "text-emerald-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {rule.met ? (
                          <Check className="h-3 w-3 flex-shrink-0" aria-hidden />
                        ) : (
                          <X className="h-3 w-3 flex-shrink-0" aria-hidden />
                        )}
                        {rule.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {isSignup && (
              <>
                <div>
                  <Label htmlFor="phone">{t("applicant.phone", lang)}</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1.5"
                    placeholder="+251912345678"
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <Label htmlFor="region">{t("applicant.region", lang)}</Label>
                  <Input
                    id="region"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="mt-1.5"
                    autoComplete="address-level1"
                  />
                </div>
              </>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : isSignup ? (
                <UserPlus className="h-4 w-4" aria-hidden />
              ) : (
                <LogIn className="h-4 w-4" aria-hidden />
              )}
              {isSignup ? t("nav.signup", lang) : t("admin.login.button", lang)}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-border text-center text-sm">
            {isSignup ? (
              <span className="text-muted-foreground">
                {t("applicant.have_account", lang)}{" "}
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-primary font-medium hover:underline"
                >
                  {t("admin.login.button", lang)}
                </button>
              </span>
            ) : (
              <span className="text-muted-foreground">
                {t("applicant.no_account", lang)}{" "}
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-primary font-medium hover:underline"
                >
                  {t("nav.signup", lang)}
                </button>
              </span>
            )}
          </div>

          {/* Trust note — no role hint exposed */}
          <div className="mt-4 pt-4 border-t border-border text-center">
            <div className="text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3 w-3" aria-hidden />
              {lang === "en"
                ? "Secure access for registered applicants and agency personnel."
                : "ለተመዘገቡ አመልካቾች እና የኤጀንሲ ሰራተኞች ደህንነቱ የተጠበቀ መዳረሻ።"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
