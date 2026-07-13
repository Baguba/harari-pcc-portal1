/**
 * Trilingual UI strings. The legal-text fields (description, personnel,
 * facility, equipment, documents) are always rendered in their original
 * Amharic from the directive JSON — they are NOT translated here.
 *
 * Only UI chrome (nav labels, buttons, section titles) is translated.
 */
import type { Lang } from "./store";

type StringMap = Record<string, { en: string; am: string; om: string }>;

const strings: StringMap = {
  // Brand
  "brand.name": { en: "PCC Portal", am: "የPCC ፖርታል", om: "Portaala PCC" },
  "brand.subtitle": {
    en: "Professional Competence Certificate",
    am: "የሙያ ብቃት ሰርቲፊኬት",
    om: "Waraqaa Ragaa Dandeettii Ogummaa",
  },

  // Nav
  "nav.home": { en: "Home", am: "መነሻ", om: "Fuula Jalqabaa" },
  "nav.categories": { en: "License Categories", am: "የፈቃድ ምድቦች", om: "Ramaddii Hayyamaa" },
  "nav.about": { en: "About", am: "ስለ እኛ", om: "Waa'ee" },
  "nav.news": { en: "News & Updates", am: "ዜና እና ዝመናዎች", om: "Oduu fi Haaromsa" },
  "nav.apply": { en: "Apply", am: "ማመልከቻ", om: "Iyyadhu" },
  "nav.admin": { en: "Admin", am: "አስተዳዳሪ", om: "Bulchiinsaa" },
  "nav.login": { en: "Sign in", am: "ግባ", om: "Seeni" },
  "nav.logout": { en: "Sign out", am: "ውጣ", om: "Ba'i" },

  // Applicant account
  "nav.applicant": { en: "My Account", am: "መለያዬ", om: "Herrega Koo" },
  "nav.signup": { en: "Register", am: "ተመዝገብ", om: "Galmaa'i" },
  "applicant.login.title": { en: "Applicant sign in", am: "የአመልካች መግቢያ", om: "Seensa iyyataa" },
  "applicant.login.subtitle": {
    en: "Track your applications, see review feedback, and download your certificate when issued.",
    am: "ማመልከቻዎችን ይከታተሉ፣ የግምገማ ግብረመልስ ይዩ፣ እና ሰርቲፊኬትዎ ሲሰጥ ያውርዱ።",
    om: "Iyyannoo kee hordofi, yaada gamaaggamaa ilaali, waraqaa ragaa kee yeroo kennamu buufadhu.",
  },
  "applicant.signup.title": { en: "Create an applicant account", am: "የአመልካች መለያ ይፍጠሩ", om: "Herrega iyyataa uumi" },
  "applicant.signup.subtitle": {
    en: "Register to submit and track your Professional Competence Certificate applications.",
    am: "የሙያ ብቃት ሰርቲፊኬት ማመልከቻዎችን ለማስገባት እና ለመከታተል ይመዝገቡ።",
    om: "Iyyannoo Waraqaa Ragaa Dandeettii Ogummaa galchuuf fi hordofuuf galmaa'i.",
  },
  "applicant.name": { en: "Full name", am: "ሙሉ ስም", om: "Maqaa guutuu" },
  "applicant.phone": { en: "Phone number", am: "የስልክ ቁጥር", om: "Lakkoofsa bilbilaa" },
  "applicant.region": { en: "Woreda", am: "ወረዳ", om: "Aanaa" },
  "applicant.have_account": { en: "Already have an account?", am: "መለያ አለዎት?", om: "Duraan herrega qabdaa?" },
  "applicant.no_account": { en: "Don't have an account?", am: "መለያ የለዎትም?", om: "Herrega hin qabduu?" },
  "applicant.dashboard.title": { en: "My applications", am: "የእኔ ማመልከቻዎች", om: "Iyyannoo koo" },
  "applicant.dashboard.subtitle": {
    en: "Track the status of your submitted applications and view reviewer feedback.",
    am: "የቀረቡ ማመልከቻዎችን ሁኔታ ይከታተሉ እና የግምገማውን ግብረመልስ ይዩ።",
    om: "Haala iyyannoo galchitanii hordofaa fi yaada gamaaggamtootaa ilaalaa.",
  },
  "applicant.dashboard.empty": {
    en: "You haven't submitted any applications yet. Browse the 45 ICT sector license categories to get started.",
    am: "እስካሁን ምንም ማመልከቻ አላስገቡም። ለመጀመር 45 የአይሲቲ ዘርፍ የፈቃድ ምድቦችን ይመልከቱ።",
    om: "Hanga ammaatti iyyannoo tokkollee hin galchine. Jalqabuuf ramaddii hayyama sektara ICT 45 ilaali.",
  },
  "applicant.dashboard.new": { en: "New application", am: "አዲስ ማመልከቻ", om: "Iyyannoo haaraa" },
  "applicant.application.title": { en: "Application details", am: "የማመልከቻ ዝርዝሮች", om: "Bal'ina iyyannoo" },
  "applicant.application.timeline": { en: "Timeline", am: "ጊዜ መስመር", om: "Sarara yeroo" },
  "applicant.application.review": { en: "Reviewer feedback", am: "የግምገማ ግብረመልስ", om: "Yaada gamaaggamtuu" },
  "applicant.application.no_review": {
    en: "No reviewer feedback yet. Your application is awaiting review.",
    am: "እስካሁን የግምገማ ግብረመልስ የለም። ማመልከቻዎ ግምገማ በመጠበቅ ላይ ነው።",
    om: "Hanga ammaatti yaadni gamaaggamaa hin jiru. Iyyannoon kee gamaaggama eegaa jira.",
  },
  "applicant.application.submitted": { en: "Submitted", am: "ቀርቧል", om: "Galchamee jira" },
  "applicant.application.under_review": { en: "Under review", am: "በግምገማ ላይ", om: "Gamaaggama irra" },
  "applicant.application.approved": { en: "Approved", am: "ጸድቋል", om: "Mirkanaa'ee jira" },
  "applicant.application.rejected": { en: "Rejected", am: "ተቋርጧል", om: "Diddamee jira" },
  "applicant.application.revoked": { en: "Revoked", am: "ተሰርዟል", om: "Haqamee jira" },
  "applicant.application.certificate": {
    en: "Your Professional Competence Certificate",
    am: "የሙያ ብቃት ሰርቲፊኬትዎ",
    om: "Waraqaa Ragaa Dandeettii Ogummaa kee",
  },
  "applicant.application.certificate_valid": {
    en: "This certificate is valid for 1 (one) year from the date of issuance and must be renewed for the same period after expiry.",
    am: "ይህ ሰርቲፊኬት ከተሰጠበት ቀን ጀምሮ 1 (አንድ) ዓመት ይከናወናል እና ካለቀ በኋላ ለተመሳሳይ ጊዜ መነሳት ይኖርበታል።",
    om: "Waraqaan ragaa kun guyyaa kennamee kaasee waggaa 1 (tokko) ni hojjata, erga yeroon isaa darbees yeroo walfakkaataaf haaromfamuu qaba.",
  },
  "applicant.application.download": {
    en: "Download certificate",
    am: "ሰርቲፊኬት አውርድ",
    om: "Waraqaa ragaa buufadhu",
  },
  "applicant.welcome": { en: "Welcome back", am: "እንኳን በደህና መጡ", om: "Baga nagaan dhufte" },

  // Home hero
  "home.hero.badge": {
    en: "Harari Regional State of Ethiopia · PCC",
    am: "የሐረሪ ሕዝብ ብሔራዊ ክልላዊ መንግሥት · PCC",
    om: "Mootummaa Naannoo Hararii Itoophiyaa · PCC",
  },
  "home.hero.title": {
    en: "Get your ICT sector Professional Competence Certificate",
    am: "የአይሲቲ ዘርፍ የሙያ ብቃት ሰርቲፊኬትዎን ያግኙ",
    om: "Waraqaa Ragaa Dandeettii Ogummaa sektara ICT kee argadhu",
  },
  "home.hero.subtitle": {
    en: "Pick the business license category you operate in, see exactly what you need to qualify, and submit your application to the Innovation and Technology Agency.",
    am: "በሚሰሩበት የንግድ ፈቃድ ምድብ ይምረጡ፣ ለማገዘት ምን መሟላት እንዳለብዎት ይወቁ፣ እና ማመልከቻዎን ወደ ሚኒስቴር ያስገቡ።",
    om: "Ramaddii hayyama daldalaa keessa hojjattu filadhu, ulaagaa guutuu qabdu sirriitti ilaali, iyyannoo kee gara Eejansiitti galchi.",
  },
  "home.hero.cta.browse": { en: "Browse 45 categories", am: "45 ምድቦችን ይመልከቱ", om: "Ramaddii 45 ilaali" },
  "home.hero.cta.about": { en: "About this certificate", am: "ስለ ዚህ ሰርቲፊኬት", om: "Waa'ee waraqaa ragaa kanaa" },

  // Stats
  "home.stats.categories": { en: "License categories", am: "የፈቃድ ምድቦች", om: "Ramaddii hayyamaa" },
  "home.stats.validity": { en: "Certificate validity", am: "የሰርቲፊኬት ጊዜ", om: "Yeroo waraqaa ragaa" },
  "home.stats.region": { en: "Region served", am: "የሚሰራበት ክልል", om: "Naannoo tajaajilamuu" },
  "home.stats.years": { en: "Directive in force since", am: "መመሪያ ከሚከተለው ጊዜ ጀምሮ በስራ ላይ", om: "Qajeelfamni hojiirra kan oole" },

  // Section titles
  "home.section.how.title": { en: "How it works", am: "እንዴት እንደሚሰራ", om: "Akkamiin akka hojjatu" },
  "home.section.how.subtitle": {
    en: "Three guided steps from browsing to applying.",
    am: "ከመመልከት እስከ ማመልከቻ ሦስት የመሪ ደረጃዎች።",
    om: "Sadarkaalee sadii ilaaluu irraa hanga iyyachuutti.",
  },
  "home.section.groups.title": { en: "Browse by activity type", am: "በእንቅስቃሴ ዓይነት ያስሱ", om: "Gosa hojiin barbaadi" },
  "home.section.groups.subtitle": {
    en: "All 45 ICT sector license categories, grouped for easier browsing.",
    am: "ሁሉም 45 የአይሲቲ ዘርፍ የፈቃድ ምድቦች፣ ለቀላል አሰሳ ተመድበዋል።",
    om: "Ramaddii hayyama sektara ICT 45 hundi, ilaaluu salphisuuf gareedhaan qoodamanii.",
  },
  "home.section.news.title": { en: "Latest news & updates", am: "የቅርብ ጊዜ ዜናዎች", om: "Oduu fi haaromsa dhiheenya" },
  "home.section.news.subtitle": {
    en: "Directive changes, fee updates, and announcements from PCC.",
    am: "የመመሪያ ለውጦች፣ የክፍያ ዝመናዎች፣ እና ማስታወቂያዎች ከPCC።",
    om: "Jijjiirama qajeelfamaa, haaromsa kaffaltii, fi beeksisa PCC irraa.",
  },

  // Steps
  "home.step1.title": { en: "Pick your category", am: "ምድብዎን ይምረጡ", om: "Ramaddii kee fili" },
  "home.step1.body": {
    en: "Browse all 45 fixed license categories. There is no free-text category — choose the one that matches your business.",
    am: "ሁሉንም 45 የተወሰኑ የፈቃድ ምድቦች ይመልከቱ። ነፃ-ጽሁፍ ምድብ የለም — ንግድዎ ጋር የሚገጣጠሙትን ይምረጡ።",
    om: "Ramaddii hayyama dhaabbataa 45 hunda ilaali. Ramaddiin barreeffama bilisaa hin jiru — kan daldalaa kee waliin walsimatu fili.",
  },
  "home.step2.title": { en: "Check your readiness", am: "ዝግጁነትዎን ያረጋግጡ", om: "Qophii kee mirkaneessi" },
  "home.step2.body": {
    en: "Each category shows exactly what personnel, facility, equipment, and documents you must have. Use the self-check tool to see what you are missing.",
    am: "እያንዳንዱ ምድብ ምን አይነት ሰራተኛ፣ መገኛ፣ መሣሪያ እና ሰነድ እንደሚገባዎት ያሳያል። የሚጎድለዎትን ለማየት የራስ-ምርጫ መሣሪያውን ይጠቀሙ።",
    om: "Ramaddiin tokko tokkoon hojjettoota, dhaabbata, meeshaa, fi sanadoota qabaachuu qabdu sirriitti agarsiisa. Waan si hanqate ilaaluuf meeshaa ofiin-sakatta'uu fayyadami.",
  },
  "home.step3.title": { en: "Submit your application", am: "ማመልከቻዎን ያስገቡ", om: "Iyyannoo kee galchi" },
  "home.step3.body": {
    en: "Fill out the application form, upload the required documents, and PCC staff will review and verify before a certificate is issued.",
    am: "የማመልከቻ ቅጹን ይሙሉ፣ የሚገባቸውን ሰነዶች ይስቀሉ፣ ሰርቲፊኬቱ ከመሰጠቱ በፊት የPCC ሰራተኞች ግምገማ እና ማረጋገጥ ያደርጋሉ።",
    om: "Unka iyyannoo guuti, sanadoota barbaachisan ol-kaa'i, hojjettoonni PCC waraqaan ragaa osoo hin kennamiiniif dura ni gamaaggamu ni mirkaneessu.",
  },

  // Categories page
  "cat.title": { en: "License categories", am: "የፈቃድ ምድቦች", om: "Ramaddii hayyamaa" },
  "cat.subtitle": {
    en: "45 fixed ICT sector license categories. Pick the one that matches your business.",
    am: "45 የተወሰኑ የአይሲቲ ዘርፍ የፈቃድ ምድቦች። ንግድዎ ጋር የሚገጣጠሙትን ይምረጡ።",
    om: "Ramaddii hayyama sektara ICT dhaabbataa 45. Kan daldalaa kee waliin walsimatu fili.",
  },
  "cat.search.placeholder": {
    en: "Search by code, name, or keyword…",
    am: "በኮድ፣ ስም ወይም ቁልፍ ቃል ይፈልጉ…",
    om: "Koodii, maqaa, ykn jecha furtuudhaan barbaadi…",
  },
  "cat.filter.all": { en: "All groups", am: "ሁሉም ቡድኖች", om: "Garee hundaa" },
  "cat.results": { en: "categories", am: "ምድቦች", om: "ramaddiiwwan" },
  "cat.empty": {
    en: "No categories match your search. Try a different keyword or clear the filter.",
    am: "ምንም ምድቦች አልተገኙም። ሌላ ቁልፍ ቃል ይሞክሩ ወይም ማጣሪያውን ያጽዱ።",
    om: "Ramaddiin barbaacha kee waliin walsimu hin argamne. Jecha furtuu biraa yaali ykn calaltuutti qulqulleessi.",
  },
  "cat.monopoly_badge": { en: "State monopoly", am: "የመንግስት ቁጥጥር", om: "Dhuunfaa mootummaa" },

  // Category detail
  "detail.description": { en: "What this license covers", am: "ይህ ፈቃድ ምን ይሸፍናል", om: "Hayyamni kun maal haguuga" },
  "detail.personnel": { en: "Personnel", am: "ሰራተኞች", om: "Hojjettoota" },
  "detail.facility": { en: "Facility", am: "መገኛ", om: "Dhaabbata" },
  "detail.equipment": { en: "Equipment", am: "መሣሪያዎች", om: "Meeshaalee" },
  "detail.documents": { en: "Documents to submit", am: "ለማስገባት የሚገቡ ሰነዶች", om: "Sanadoota galchuu qabdu" },
  "detail.selfcheck.title": { en: "Eligibility self-check", am: "የብቃት ራስ-ምርጫ", om: "Ofiin-sakatta'a ulaagaa" },
  "detail.selfcheck.subtitle": {
    en: "Tick the items you already have. This tool only assesses readiness — it does not issue or guarantee a certificate.",
    am: "ያለዎትን ዕቃ ይምረጡ። ይህ መሣሪያ ዝግጁነትን ብቻ ይገመግማል — ሰርቲፊኬት አይሰጥም ወይም አያረጋግጥም።",
    om: "Wantoota duraan qabdu tuqi. Meeshaan kun qophii qofa madaala — waraqaa ragaa hin kennu ykn hin waaduu.",
  },
  "detail.selfcheck.ready": { en: "Ready to apply", am: "ለማመልከቻ ዝግጁ", om: "Iyyachuuf qophii" },
  "detail.selfcheck.missing": { en: "Missing items", am: "የጎደሉ ዕቃዎች", om: "Wantoota hanqatan" },
  "detail.selfcheck.progress": { en: "Readiness", am: "ዝግጁነት", om: "Qophii" },
  "detail.selfcheck.reset": { en: "Reset", am: "ዳግም አስጀምር", om: "Irra deebi'i" },
  "detail.cta.apply": { en: "Apply for this category", am: "ለዚህ ምድብ ያመልክቱ", om: "Ramaddii kanaaf iyyadhu" },
  "detail.cta.cannot_apply": {
    en: "Not open to private applicants",
    am: "ለግል አመልካቾች አይከፈትም",
    om: "Iyyattota dhuunfaaf hin banamu",
  },
  "detail.monopoly.notice": {
    en: "This field is reserved for the state enterprise and is not open to private licensing.",
    am: "ይህ ዘርፍ ለመንግስት ድርጅት የተወሰነ ሲሆን ለግል ፈቃድ አይከፈትም።",
    om: "Sektarri kun dhaabbata mootummaaf kan qophaa'e yoo ta'u hayyama dhuunfaaf hin banamu.",
  },
  "detail.sidebar.validity": { en: "Certificate validity", am: "የሰርቲፊኬት ጊዜ", om: "Yeroo waraqaa ragaa" },
  "detail.sidebar.renewal": { en: "Renewal", am: "እድሳት", om: "Haaromsaa" },
  "detail.sidebar.standard_docs": { en: "Standard documents", am: "የመደበኛ ሰነዶች", om: "Sanadoota idilee" },

  // Apply form
  "apply.title": { en: "Application form", am: "የማመልከቻ ቅጽ", om: "Unka iyyannoo" },
  "apply.section.applicant": { en: "Applicant information", am: "የአመልካች መረጃ", om: "Odeeffannoo iyyataa" },
  "apply.section.documents": { en: "Documents to upload", am: "ለመስቀል ሰነዶች", om: "Sanadoota ol-kaa'uu" },
  "apply.section.review": { en: "Review and submit", am: "ግምገማ እና ማስገባት", om: "Gamaaggamii galchi" },
  "apply.applicant_type": { en: "Applicant type", am: "የአመልካች አይነት", om: "Gosa iyyataa" },
  "apply.individual": { en: "Individual", am: "ግል", om: "Dhuunfaa" },
  "apply.organization": { en: "Organization / Company", am: "ድርጅት / ኩባንያ", om: "Dhaabbata / Komppaanii" },
  "apply.org_name": { en: "Organization name", am: "የድርጅት ስም", om: "Maqaa dhaabbataa" },
  "apply.contact_name": { en: "Contact person full name", am: "የመገናኛ ሰው ሙሉ ስም", om: "Maqaa guutuu nama quunnamtii" },
  "apply.email": { en: "Email address", am: "የኢሜይል አድራሻ", om: "Teessoo imeelii" },
  "apply.phone": { en: "Phone number", am: "የስልክ ቁጥር", om: "Lakkoofsa bilbilaa" },
  "apply.region": { en: "Woreda", am: "ወረዳ", om: "Aanaa" },
  "apply.city": { en: "City / Town", am: "ከተማ / ከተማ", om: "Magaalaa / Magaalaa" },
  "apply.address": { en: "Address line", am: "የአድራሻ መስመር", om: "Sarara teessoo" },
  "apply.tin": { en: "TIN number", am: "የTIN ቁጥር", om: "Lakkoofsa TIN" },
  "apply.national_id": { en: "National ID (16-digit number)", am: "ብሔራዊ መታወቂያ (ባለ 16 አሃዝ ቁጥር)", om: "Eenyummaa biyyaalessaa (lakkoofsa dijiitii 16)" },
  "password.strength.weak": { en: "Weak", am: "ደካማ", om: "Laafaa" },
  "password.strength.fair": { en: "Fair", am: "መካከለኛ", om: "Giddu-galeessa" },
  "password.strength.good": { en: "Good", am: "ጥሩ", om: "Gaarii" },
  "password.strength.strong": { en: "Strong", am: "ጠንካራ", om: "Cimaa" },
  "password.rule.length": { en: "At least 8 characters", am: "ቢያንስ 8 ቁምፊዎች", om: "Yoo xiqqaate arfii 8" },
  "password.rule.uppercase": { en: "One uppercase letter", am: "አንድ ትልቅ ፊደል", om: "Qubee guddaa tokko" },
  "password.rule.lowercase": { en: "One lowercase letter", am: "አንድ ትንሽ ፊደል", om: "Qubee xinnoo tokko" },
  "password.rule.digit": { en: "One digit", am: "አንድ ቁጥር", om: "Lakkoofsa tokko" },
  "apply.notes": { en: "Notes (optional)", am: "ማስታወሻዎች (አማራጭ)", om: "Yaadannoo (dirqama miti)" },
  "apply.upload.label": { en: "Upload", am: "ይስቀሉ", om: "Ol-kaa'i" },
  "apply.uploaded": { en: "Uploaded", am: "ተሰቅሏል", om: "Ol-kaa'amee jira" },
  "apply.submit": { en: "Submit application", am: "ማመልከቻ ያስገቡ", om: "Iyyannoo galchi" },
  "apply.cancel": { en: "Cancel", am: "ይቅር", om: "Haqi" },
  "apply.confirm.title": {
    en: "Application submitted",
    am: "ማመልከቻ ተሰብኳል",
    om: "Iyyannoon galchamee jira",
  },
  "apply.confirm.body": {
    en: "Thank you. Your application has been received. PCC staff will review and verify your submission before a certificate is issued. The service fee is paid per the Ministry's service-fee directive.",
    am: "እናመሰግናለን። ማመልከቻዎ ተቀብለናል። ሰርቲፊኬት ከመሰጠቱ በፊት የPCC ሰራተኞች ግምገማ እና ማረጋገጥ ያደርጋሉ። የአገልግሎት ክፍያ በሚኒስቴር የአገልግሎት ክፍያ መመሪያ መሰረት ይከፈላል።",
    om: "Galatoomi. Iyyannoon kee simatamee jira. Hojjettoonni PCC waraqaan ragaa osoo hin kennamiiniif dura ni gamaaggamu ni mirkaneessu. Kaffaltiin tajaajilaa qajeelfama kaffaltii tajaajila Ministeerichaatiin kaffalama.",
  },
  "apply.confirm.next": { en: "Next steps", am: "ቀጣይ ደረጃዎች", om: "Sadarkaalee itti aananu" },
  "apply.confirm.back_home": { en: "Back to home", am: "ወደ መነሻ ተመለስ", om: "Gara fuula jalqabaatti deebi'i" },
  "apply.confirm.browse": { en: "Browse other categories", am: "ሌላ ምድቦችን ይመልከቱ", om: "Ramaddii biroo ilaali" },

  // About
  "about.title": { en: "About this certificate", am: "ስለ ዚህ ሰርቲፊኬት", om: "Waa'ee waraqaa ragaa kanaa" },
  "about.purpose": { en: "Purpose", am: "ዓላማ", om: "Kaayyoo" },
  "about.scope": { en: "Scope", am: "ወሰን", om: "Daangaa" },
  "about.authority": { en: "Issuing authority", am: "የሚሰጠው ባለስልጣን", om: "Qaamni kennu" },
  "about.legal": { en: "Legal basis", am: "ህጋዊ መሠረት", om: "Bu'uura seeraa" },
  "about.rules": { en: "Certification rules", am: "የሰርቲፊኬት ህጎች", om: "Seerota waraqaa ragaa" },
  "about.validity": { en: "Validity & renewal", am: "ጊዜ እና እድሳት", om: "Yeroo fi haaromsaa" },
  "about.penalties": { en: "Penalties", am: "ቅጣቶች", om: "Adabbii" },
  "about.effective": { en: "Effective date", am: "የመጀመሪያ ቀን", om: "Guyyaa hojiirra oolu" },
  "about.signatory": { en: "Signatory", am: "ተፈራሚ", om: "Mallattoo" },
  "about.repealed": { en: "Repealed directives", am: "የተሻሩ መመሪያዎች", om: "Qajeelfamoota haqaman" },
  "about.amendment": { en: "Amendment", am: "ማስተካከያ", om: "Fooyyessaa" },
  "about.standard_docs": { en: "Standard required documents", am: "የመደበኛ የሚገቡ ሰነዶች", om: "Sanadoota idilee barbaachisan" },

  // Admin
  "admin.login.title": { en: "Admin sign in", am: "የአስተዳዳሪ መግቢያ", om: "Seensa bulchiinsaa" },
  "admin.login.subtitle": {
    en: "Restricted to PCC staff and super administrators.",
    am: "ለPCC ሰራተኞች እና ለዋና አስተዳዳሪዎች ብቻ ተወስኗል።",
    om: "Hojjettoota PCC fi bulchituu olaanaaf qofa daangeffame.",
  },

  // Unified auth
  "auth.login.title": { en: "Sign in", am: "ግባ", om: "Seeni" },
  "auth.login.subtitle": {
    en: "Access your dashboard to manage applications and certifications.",
    am: "ማመልከቻዎችን እና የምስክር ወረቀቶችን ለማስተዳደር ወደ ዳሽቦርድዎ ይግቡ።",
    om: "Iyyannoo fi waraqaalee ragaa bulchuuf daashboordii keetti seeni.",
  },
  "admin.login.email": { en: "Email", am: "ኢሜይል", om: "Imeelii" },
  "admin.login.password": { en: "Password", am: "የይለፍ ቃል", om: "Jecha icciitii" },
  "admin.login.button": { en: "Sign in", am: "ግባ", om: "Seeni" },
  "admin.login.demo": {
    en: "Demo credentials",
    am: "የሙከራ ማረጋገጫ",
    om: "Ragaa agarsiisaa",
  },
  "admin.dashboard": { en: "Dashboard", am: "ዳሽቦርድ", om: "Daashboordii" },
  "admin.applications": { en: "Applications", am: "ማመልከቻዎች", om: "Iyyannoolee" },
  "admin.news": { en: "News & Announcements", am: "ዜና እና ማስታወቂያዎች", om: "Oduu fi Beeksisa" },
  "admin.users": { en: "Users & Admins", am: "ተጠቃሚዎች እና አስተዳዳሪዎች", om: "Fayyadamtoota fi Bulchitoota" },
  "admin.audit": { en: "Audit log", am: "የግምገማ ምዝገባ", om: "Galmee odiitii" },

  // Common
  "common.back": { en: "Back", am: "ተመለስ", om: "Duubatti" },
  "common.next": { en: "Next", am: "ቀጣይ", om: "Itti aanee" },
  "common.previous": { en: "Previous", am: "ቀዳሚ", om: "Duraa" },
  "common.save": { en: "Save", am: "አስቀምጥ", om: "Olkaa'i" },
  "common.cancel": { en: "Cancel", am: "ይቅር", om: "Haqi" },
  "common.delete": { en: "Delete", am: "ሰርዝ", om: "Haqi" },
  "common.edit": { en: "Edit", am: "አስተካክል", om: "Gulaali" },
  "common.search": { en: "Search", am: "ፈልግ", om: "Barbaadi" },
  "common.loading": { en: "Loading…", am: "በመጫን ላይ…", om: "Fe'aa jira…" },
  "common.language": { en: "Language", am: "ቋንቋ", om: "Afaan" },
  "common.notifications": { en: "Notifications", am: "ማስታወቂያዎች", om: "Beeksisa" },
  "common.no_results": { en: "No results", am: "ምንም ውጤት የለም", om: "Bu'aan hin argamne" },

  // Footer
  "footer.rights": {
    en: "© PCC, Harari Regional State of Ethiopia. All rights reserved.",
    am: "© PCC፣ የሐረሪ ሕዝብ ብሔራዊ ክልላዊ መንግሥት። ሁሉም መብቶች የተጠበቁ ናቸው።",
    om: "© PCC, Mootummaa Naannoo Hararii Itoophiyaa. Mirgi hunduu kan eegamedha.",
  },
  "footer.disclaimer": {
    en: "This portal is a compliance tool. The authoritative legal text remains the official directive published by PCC.",
    am: "ይህ ፖርታል የመግዛት መሣሪያ ነው። ህጋዊ የሆነ ጽሑፍ የPCC በሚያወጣው ይፋዊ መመሪያ ላይ ይገኛል።",
    om: "Portaalli kun meeshaa hordoffii seera eeguuti. Barreeffamni seeraa angessaan qajeelfama iffaa PCC'n maxxanfamedha.",
  },
};

export function t(key: string, lang: Lang): string {
  const entry = strings[key];
  if (!entry) return key;
  return entry[lang] || entry.en || key;
}

/** Translate a {en, am, om} object using current language. */
export function tr(field: { en: string; am: string; om?: string } | undefined, lang: Lang): string {
  if (!field) return "";
  return (field as Record<string, string>)[lang] || field.en || "";
}
