/**
 * Bilingual UI strings. The legal-text fields (description, personnel,
 * facility, equipment, documents) are always rendered in their original
 * Amharic from the directive JSON — they are NOT translated here.
 *
 * Only UI chrome (nav labels, buttons, section titles) is translated.
 */
import type { Lang } from "./store";

type StringMap = Record<string, { en: string; am: string }>;

const strings: StringMap = {
  // Brand
  "brand.name": { en: "PCC Portal", am: "የPCC ፖርታል" },
  "brand.subtitle": {
    en: "Professional Competence Certificate",
    am: "የሙያ ብቃት ሰርቲፊኬት",
  },

  // Nav
  "nav.home": { en: "Home", am: "መነሻ" },
  "nav.categories": { en: "License Categories", am: "የፈቃድ ምድቦች" },
  "nav.about": { en: "About", am: "ስለ እኛ" },
  "nav.news": { en: "News & Updates", am: "ዜና እና ዝመናዎች" },
  "nav.apply": { en: "Apply", am: "ማመልከቻ" },
  "nav.admin": { en: "Admin", am: "አስተዳዳሪ" },
  "nav.login": { en: "Sign in", am: "ግባ" },
  "nav.logout": { en: "Sign out", am: "ውጣ" },

  // Applicant account
  "nav.applicant": { en: "My Account", am: "መለያዬ" },
  "nav.signup": { en: "Sign up", am: "ተመዝገብ" },
  "applicant.login.title": { en: "Applicant sign in", am: "የአመልካች መግቢያ" },
  "applicant.login.subtitle": {
    en: "Track your applications, see review feedback, and download your certificate when issued.",
    am: "ማመልከቻዎችን ይከታተሉ፣ የግምገማ ግብረመልስ ይዩ፣ እና ሰርቲፊኬትዎ ሲሰጥ ያውርዱ።",
  },
  "applicant.signup.title": { en: "Create an applicant account", am: "የአመልካች መለያ ይፍጠሩ" },
  "applicant.signup.subtitle": {
    en: "Sign up to submit and track your Professional Competence Certificate applications.",
    am: "የሙያ ብቃት ሰርቲፊኬት ማመልከቻዎችን ለማስገባት እና ለመከታተል ይመዝገቡ።",
  },
  "applicant.name": { en: "Full name", am: "ሙሉ ስም" },
  "applicant.phone": { en: "Phone number", am: "የስልክ ቁጥር" },
  "applicant.region": { en: "Woreda", am: "ወረዳ" },
  "applicant.have_account": { en: "Already have an account?", am: "መለያ አለዎት?" },
  "applicant.no_account": { en: "Don't have an account?", am: "መለያ የለዎትም?" },
  "applicant.dashboard.title": { en: "My applications", am: "የእኔ ማመልከቻዎች" },
  "applicant.dashboard.subtitle": {
    en: "Track the status of your submitted applications and view reviewer feedback.",
    am: "የቀረቡ ማመልከቻዎችን ሁኔታ ይከታተሉ እና የግምገማውን ግብረመልስ ይዩ።",
  },
  "applicant.dashboard.empty": {
    en: "You haven't submitted any applications yet. Browse the 45 ICT sector license categories to get started.",
    am: "እስካሁን ምንም ማመልከቻ አላስገቡም። ለመጀመር 45 የአይሲቲ ዘርፍ የፈቃድ ምድቦችን ይመልከቱ።",
  },
  "applicant.dashboard.new": { en: "New application", am: "አዲስ ማመልከቻ" },
  "applicant.application.title": { en: "Application details", am: "የማመልከቻ ዝርዝሮች" },
  "applicant.application.timeline": { en: "Timeline", am: "ጊዜ መስመር" },
  "applicant.application.review": { en: "Reviewer feedback", am: "የግምገማ ግብረመልስ" },
  "applicant.application.no_review": {
    en: "No reviewer feedback yet. Your application is awaiting review.",
    am: "እስካሁን የግምገማ ግብረመልስ የለም። ማመልከቻዎ ግምገማ በመጠበቅ ላይ ነው።",
  },
  "applicant.application.submitted": { en: "Submitted", am: "ቀርቧል" },
  "applicant.application.under_review": { en: "Under review", am: "በግምገማ ላይ" },
  "applicant.application.approved": { en: "Approved", am: "ጸድቋል" },
  "applicant.application.rejected": { en: "Rejected", am: "ተቋርጧል" },
  "applicant.application.revoked": { en: "Revoked", am: "ተሰርዟል" },
  "applicant.application.certificate": {
    en: "Your Professional Competence Certificate",
    am: "የሙያ ብቃት ሰርቲፊኬትዎ",
  },
  "applicant.application.certificate_valid": {
    en: "This certificate is valid for 1 (one) year from the date of issuance and must be renewed for the same period after expiry.",
    am: "ይህ ሰርቲፊኬት ከተሰጠበት ቀን ጀምሮ 1 (አንድ) ዓመት ይከናወናል እና ካለቀ በኋላ ለተመሳሳይ ጊዜ መነሳት ይኖርበታል።",
  },
  "applicant.application.download": {
    en: "Download certificate",
    am: "ሰርቲፊኬት አውርድ",
  },
  "applicant.welcome": { en: "Welcome back", am: "እንኳን በደህና መጡ" },

  // Home hero
  "home.hero.badge": {
    en: "Harari Regional State of Ethiopia · PCC",
    am: "የሐረሪ ሕዝብ ብሔራዊ ክልላዊ መንግሥት · PCC",
  },
  "home.hero.title": {
    en: "Get your ICT sector Professional Competence Certificate",
    am: "የአይሲቲ ዘርፍ የሙያ ብቃት ሰርቲፊኬትዎን ያግኙ",
  },
  "home.hero.subtitle": {
    en: "Pick the business license category you operate in, see exactly what you need to qualify, and submit your application to the Innovation and Technology Agency.",
    am: "በሚሰሩበት የንግድ ፈቃድ ምድብ ይምረጡ፣ ለማገዘት ምን መሟላት እንዳለብዎት ይወቁ፣ እና ማመልከቻዎን ወደ ሚኒስቴር ያስገቡ።",
  },
  "home.hero.cta.browse": { en: "Browse 45 categories", am: "45 ምድቦችን ይመልከቱ" },
  "home.hero.cta.about": { en: "About this certificate", am: "ስለ ዚህ ሰርቲፊኬት" },

  // Stats
  "home.stats.categories": { en: "License categories", am: "የፈቃድ ምድቦች" },
  "home.stats.validity": { en: "Certificate validity", am: "የሰርቲፊኬት ጊዜ" },
  "home.stats.region": { en: "Region served", am: "የሚሰራበት ክልል" },
  "home.stats.years": { en: "Directive in force since", am: "መመሪያ ከሚከተለው ጊዜ ጀምሮ በስራ ላይ" },

  // Section titles
  "home.section.how.title": { en: "How it works", am: "እንዴት እንደሚሰራ" },
  "home.section.how.subtitle": {
    en: "Three guided steps from browsing to applying.",
    am: "ከመመልከት እስከ ማመልከቻ ሦስት የመሪ ደረጃዎች።",
  },
  "home.section.groups.title": { en: "Browse by activity type", am: "በእንቅስቃሴ ዓይነት ያስሱ" },
  "home.section.groups.subtitle": {
    en: "All 45 ICT sector license categories, grouped for easier browsing.",
    am: "ሁሉም 45 የአይሲቲ ዘርፍ የፈቃድ ምድቦች፣ ለቀላል አሰሳ ተመድበዋል።",
  },
  "home.section.news.title": { en: "Latest news & updates", am: "የቅርብ ጊዜ ዜናዎች" },
  "home.section.news.subtitle": {
    en: "Directive changes, fee updates, and announcements from PCC.",
    am: "የመመሪያ ለውጦች፣ የክፍያ ዝመናዎች፣ እና ማስታወቂያዎች ከPCC።",
  },

  // Steps
  "home.step1.title": { en: "Pick your category", am: "ምድብዎን ይምረጡ" },
  "home.step1.body": {
    en: "Browse all 45 fixed license categories. There is no free-text category — choose the one that matches your business.",
    am: "ሁሉንም 45 የተወሰኑ የፈቃድ ምድቦች ይመልከቱ። ነፃ-ጽሁፍ ምድብ የለም — ንግድዎ ጋር የሚገጣጠሙትን ይምረጡ።",
  },
  "home.step2.title": { en: "Check your readiness", am: "ዝግጁነትዎን ያረጋግጡ" },
  "home.step2.body": {
    en: "Each category shows exactly what personnel, facility, equipment, and documents you must have. Use the self-check tool to see what you are missing.",
    am: "እያንዳንዱ ምድብ ምን አይነት ሰራተኛ፣ መገኛ፣ መሣሪያ እና ሰነድ እንደሚገባዎት ያሳያል። የሚጎድለዎትን ለማየት የራስ-ምርጫ መሣሪያውን ይጠቀሙ።",
  },
  "home.step3.title": { en: "Submit your application", am: "ማመልከቻዎን ያስገቡ" },
  "home.step3.body": {
    en: "Fill out the application form, upload the required documents, and PCC staff will review and verify before a certificate is issued.",
    am: "የማመልከቻ ቅጹን ይሙሉ፣ የሚገባቸውን ሰነዶች ይስቀሉ፣ ሰርቲፊኬቱ ከመሰጠቱ በፊት የPCC ሰራተኞች ግምገማ እና ማረጋገጥ ያደርጋሉ።",
  },

  // Categories page
  "cat.title": { en: "License categories", am: "የፈቃድ ምድቦች" },
  "cat.subtitle": {
    en: "45 fixed ICT sector license categories. Pick the one that matches your business.",
    am: "45 የተወሰኑ የአይሲቲ ዘርፍ የፈቃድ ምድቦች። ንግድዎ ጋር የሚገጣጠሙትን ይምረጡ።",
  },
  "cat.search.placeholder": {
    en: "Search by code, name, or keyword…",
    am: "በኮድ፣ ስም ወይም ቁልፍ ቃል ይፈልጉ…",
  },
  "cat.filter.all": { en: "All groups", am: "ሁሉም ቡድኖች" },
  "cat.results": { en: "categories", am: "ምድቦች" },
  "cat.empty": {
    en: "No categories match your search. Try a different keyword or clear the filter.",
    am: "ምንም ምድቦች አልተገኙም። ሌላ ቁልፍ ቃል ይሞክሩ ወይም ማጣሪያውን ያጽዱ።",
  },
  "cat.monopoly_badge": { en: "State monopoly", am: "የመንግስት ቁጥጥር" },

  // Category detail
  "detail.description": { en: "What this license covers", am: "ይህ ፈቃድ ምን ይሸፍናል" },
  "detail.personnel": { en: "Personnel", am: "ሰራተኞች" },
  "detail.facility": { en: "Facility", am: "መገኛ" },
  "detail.equipment": { en: "Equipment", am: "መሣሪያዎች" },
  "detail.documents": { en: "Documents to submit", am: "ለማስገባት የሚገቡ ሰነዶች" },
  "detail.selfcheck.title": { en: "Eligibility self-check", am: "የብቃት ራስ-ምርጫ" },
  "detail.selfcheck.subtitle": {
    en: "Tick the items you already have. This tool only assesses readiness — it does not issue or guarantee a certificate.",
    am: "ያለዎትን ዕቃ ይምረጡ። ይህ መሣሪያ ዝግጁነትን ብቻ ይገመግማል — ሰርቲፊኬት አይሰጥም ወይም አያረጋግጥም።",
  },
  "detail.selfcheck.ready": { en: "Ready to apply", am: "ለማመልከቻ ዝግጁ" },
  "detail.selfcheck.missing": { en: "Missing items", am: "የጎደሉ ዕቃዎች" },
  "detail.selfcheck.progress": { en: "Readiness", am: "ዝግጁነት" },
  "detail.selfcheck.reset": { en: "Reset", am: "ዳግም አስጀምር" },
  "detail.cta.apply": { en: "Apply for this category", am: "ለዚህ ምድብ ያመልክቱ" },
  "detail.cta.cannot_apply": {
    en: "Not open to private applicants",
    am: "ለግል አመልካቾች አይከፈትም",
  },
  "detail.monopoly.notice": {
    en: "This field is reserved for the state enterprise and is not open to private licensing.",
    am: "ይህ ዘርፍ ለመንግስት ድርጅት የተወሰነ ሲሆን ለግል ፈቃድ አይከፈትም።",
  },
  "detail.sidebar.validity": { en: "Certificate validity", am: "የሰርቲፊኬት ጊዜ" },
  "detail.sidebar.renewal": { en: "Renewal", am: "እድሳት" },
  "detail.sidebar.standard_docs": { en: "Standard documents", am: "የመደበኛ ሰነዶች" },

  // Apply form
  "apply.title": { en: "Application form", am: "የማመልከቻ ቅጽ" },
  "apply.section.applicant": { en: "Applicant information", am: "የአመልካች መረጃ" },
  "apply.section.documents": { en: "Documents to upload", am: "ለመስቀል ሰነዶች" },
  "apply.section.review": { en: "Review and submit", am: "ግምገማ እና ማስገባት" },
  "apply.applicant_type": { en: "Applicant type", am: "የአመልካች አይነት" },
  "apply.individual": { en: "Individual", am: "ግል" },
  "apply.organization": { en: "Organization / Company", am: "ድርጅት / ኩባንያ" },
  "apply.org_name": { en: "Organization name", am: "የድርጅት ስም" },
  "apply.contact_name": { en: "Contact person full name", am: "የመገናኛ ሰው ሙሉ ስም" },
  "apply.email": { en: "Email address", am: "የኢሜይል አድራሻ" },
  "apply.phone": { en: "Phone number", am: "የስልክ ቁጥር" },
  "apply.region": { en: "Woreda", am: "ወረዳ" },
  "apply.city": { en: "City / Town", am: "ከተማ / ከተማ" },
  "apply.address": { en: "Address line", am: "የአድራሻ መስመር" },
  "apply.tin": { en: "TIN number", am: "የTIN ቁጥር" },
  "apply.national_id": { en: "National ID (16-digit number)", am: "ብሔራዊ መታወቂያ (ባለ 16 አሃዝ ቁጥር)" },
  "password.strength.weak": { en: "Weak", am: "ደካማ" },
  "password.strength.fair": { en: "Fair", am: "መካከለኛ" },
  "password.strength.good": { en: "Good", am: "ጥሩ" },
  "password.strength.strong": { en: "Strong", am: "ጠንካራ" },
  "password.rule.length": { en: "At least 8 characters", am: "ቢያንስ 8 ቁምፊዎች" },
  "password.rule.uppercase": { en: "One uppercase letter", am: "አንድ ትልቅ ፊደል" },
  "password.rule.lowercase": { en: "One lowercase letter", am: "አንድ ትንሽ ፊደል" },
  "password.rule.digit": { en: "One digit", am: "አንድ ቁጥር" },
  "apply.notes": { en: "Notes (optional)", am: "ማስታወሻዎች (አማራጭ)" },
  "apply.upload.label": { en: "Upload", am: "ይስቀሉ" },
  "apply.uploaded": { en: "Uploaded", am: "ተሰቅሏል" },
  "apply.submit": { en: "Submit application", am: "ማመልከቻ ያስገቡ" },
  "apply.cancel": { en: "Cancel", am: "ይቅር" },
  "apply.confirm.title": {
    en: "Application submitted",
    am: "ማመልከቻ ተሰብኳል",
  },
  "apply.confirm.body": {
    en: "Thank you. Your application has been received. PCC staff will review and verify your submission before a certificate is issued. The service fee is paid per the Ministry's service-fee directive.",
    am: "እናመሰግናለን። ማመልከቻዎ ተቀብለናል። ሰርቲፊኬት ከመሰጠቱ በፊት የPCC ሰራተኞች ግምገማ እና ማረጋገጥ ያደርጋሉ። የአገልግሎት ክፍያ በሚኒስቴር የአገልግሎት ክፍያ መመሪያ መሰረት ይከፈላል።",
  },
  "apply.confirm.next": { en: "Next steps", am: "ቀጣይ ደረጃዎች" },
  "apply.confirm.back_home": { en: "Back to home", am: "ወደ መነሻ ተመለስ" },
  "apply.confirm.browse": { en: "Browse other categories", am: "ሌላ ምድቦችን ይመልከቱ" },

  // About
  "about.title": { en: "About this certificate", am: "ስለ ዚህ ሰርቲፊኬት" },
  "about.purpose": { en: "Purpose", am: "ዓላማ" },
  "about.scope": { en: "Scope", am: "ወሰን" },
  "about.authority": { en: "Issuing authority", am: "የሚሰጠው ባለስልጣን" },
  "about.legal": { en: "Legal basis", am: "ህጋዊ መሠረት" },
  "about.rules": { en: "Certification rules", am: "የሰርቲፊኬት ህጎች" },
  "about.validity": { en: "Validity & renewal", am: "ጊዜ እና እድሳት" },
  "about.penalties": { en: "Penalties", am: "ቅጣቶች" },
  "about.effective": { en: "Effective date", am: "የመጀመሪያ ቀን" },
  "about.signatory": { en: "Signatory", am: "ተፈራሚ" },
  "about.repealed": { en: "Repealed directives", am: "የተሻሩ መመሪያዎች" },
  "about.amendment": { en: "Amendment", am: "ማስተካከያ" },
  "about.standard_docs": { en: "Standard required documents", am: "የመደበኛ የሚገቡ ሰነዶች" },

  // Admin
  "admin.login.title": { en: "Admin sign in", am: "የአስተዳዳሪ መግቢያ" },
  "admin.login.subtitle": {
    en: "Restricted to PCC staff and super administrators.",
    am: "ለPCC ሰራተኞች እና ለዋና አስተዳዳሪዎች ብቻ ተወስኗል።",
  },

  // Unified auth
  "auth.login.title": { en: "Sign in", am: "ግባ" },
  "auth.login.subtitle": {
    en: "Access your dashboard to manage applications and certifications.",
    am: "ማመልከቻዎችን እና የምስክር ወረቀቶችን ለማስተዳደር ወደ ዳሽቦርድዎ ይግቡ።",
  },
  "admin.login.email": { en: "Email", am: "ኢሜይል" },
  "admin.login.password": { en: "Password", am: "የይለፍ ቃል" },
  "admin.login.button": { en: "Sign in", am: "ግባ" },
  "admin.login.demo": {
    en: "Demo credentials",
    am: "የሙከራ ማረጋገጫ",
  },
  "admin.dashboard": { en: "Dashboard", am: "ዳሽቦርድ" },
  "admin.applications": { en: "Applications", am: "ማመልከቻዎች" },
  "admin.news": { en: "News & Announcements", am: "ዜና እና ማስታወቂያዎች" },
  "admin.users": { en: "Users & Admins", am: "ተጠቃሚዎች እና አስተዳዳሪዎች" },
  "admin.audit": { en: "Audit log", am: "የግምገማ ምዝገባ" },

  // Common
  "common.back": { en: "Back", am: "ተመለስ" },
  "common.next": { en: "Next", am: "ቀጣይ" },
  "common.previous": { en: "Previous", am: "ቀዳሚ" },
  "common.save": { en: "Save", am: "አስቀምጥ" },
  "common.cancel": { en: "Cancel", am: "ይቅር" },
  "common.delete": { en: "Delete", am: "ሰርዝ" },
  "common.edit": { en: "Edit", am: "አስተካክል" },
  "common.search": { en: "Search", am: "ፈልግ" },
  "common.loading": { en: "Loading…", am: "በመጫን ላይ…" },
  "common.language": { en: "Language", am: "ቋንቋ" },
  "common.notifications": { en: "Notifications", am: "ማስታወቂያዎች" },
  "common.no_results": { en: "No results", am: "ምንም ውጤት የለም" },

  // Footer
  "footer.rights": {
    en: "© PCC, Harari Regional State of Ethiopia. All rights reserved.",
    am: "© PCC፣ የሐረሪ ሕዝብ ብሔራዊ ክልላዊ መንግሥት። ሁሉም መብቶች የተጠበቁ ናቸው።",
  },
  "footer.disclaimer": {
    en: "This portal is a compliance tool. The authoritative legal text remains the official directive published by PCC.",
    am: "ይህ ፖርታል የመግዛት መሣሪያ ነው። ህጋዊ የሆነ ጽሑፍ የPCC በሚያወጣው ይፋዊ መመሪያ ላይ ይገኛል።",
  },
};

export function t(key: string, lang: Lang): string {
  const entry = strings[key];
  if (!entry) return key;
  return entry[lang] || entry.en || key;
}

/** Translate a {en, am} object using current language. */
export function tr(field: { en: string; am: string } | undefined, lang: Lang): string {
  if (!field) return "";
  return field[lang] || field.en || "";
}
