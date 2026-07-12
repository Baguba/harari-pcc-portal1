"use client";

import { ShieldCheck, Mail, Phone, MapPin } from "lucide-react";
import { useApp } from "@/lib/store";
import { t } from "@/lib/i18n";

export function Footer() {
  const lang = useApp((s) => s.lang);
  const setView = useApp((s) => s.setView);

  return (
    <footer className="mt-auto border-t border-border bg-surface/40">
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 flex items-center justify-center">
                <img src="/logo.png" alt="PCC Logo" className="h-7 w-7 object-contain" />
              </div>
              <div>
                <div className="font-bold text-sm">
                  {t("brand.name", lang)}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {t("brand.subtitle", lang)}
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("footer.disclaimer", lang)}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <div className="font-semibold text-sm mb-3">
              {lang === "en" ? "Quick links" : lang === "am" ? "ፈጣን አገናኞች" : "Fungasoota Saffisaa"}
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setView({ name: "categories" })}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("nav.categories", lang)}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView({ name: "about" })}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("nav.about", lang)}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView({ name: "news" })}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("nav.news", lang)}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView({ name: "login" })}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("nav.login", lang)}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="font-semibold text-sm mb-3">
              {lang === "en" ? "Contact" : lang === "am" ? "አግኙን" : "Quunnamtii"}
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden />
                <span>
                  {lang === "en"
                    ? "Innovation and Technology Agency, Harari, Ethiopia"
                    : lang === "am"
                      ? "የመገናኛና ኢንፎርሜሽን ቴክኖሎጂ ሚኒስቴር፣ ሐረሪ፣ ኢትዮጵያ"
                      : "Eejansii Inoviishinii fi Teknolojii, Hararii, Itoophiyaa"}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" aria-hidden />
                <a
                  href="mailto:info@pcc.gov.et"
                  className="hover:text-primary transition-colors"
                >
                  info@pcc.gov.et
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" aria-hidden />
                <span>+251 11 551 9999</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-xs text-muted-foreground text-center">
          {t("footer.rights", lang)}
          <span className="mx-2">·</span>
          {lang === "en"
            ? "Harari Region · Directive No. 1/2007 E.C. (Revised)"
            : lang === "am"
              ? "የሐረሪ ክልል · መመሪያ ቁጥር 1/2007 ዓ.ም. (ተሻሽሎ)"
              : "Naannoo Hararii · Qajeelfama Lakk. 1/2007 B.A. (Fooyya'e)"}
        </div>
      </div>
    </footer>
  );
}
