---
Task ID: 1
Agent: main (Super Z)
Task: Build a full-stack MCIT Professional Competence Certificate Portal for Ethiopia's Harari region based on three uploaded files (website_build_prompt.md, directive_meta.json, categories_clean.json). Read the JSON data, implement all required pages/features, super admin controls, notifications, charts, bilingual support, and ship as a zip file.

Work Log:
- Read all three uploaded files in /home/z/my-project/upload/
- Initialized fullstack dev environment via init-fullstack.sh
- Analyzed categories_clean.json: 45 license categories, 2 monopoly (national postal #25, national telecom #28)
- Set up brand color palette (Emerald #0F6B4A / Royal Blue #1F4E8C / Gold #C89B3C / Soft White / Warm Sand / Dark Gray / Light Gray) in globals.css with oklch conversions + light/dark theme
- Updated layout.tsx with Noto Sans Ethiopic font for Amharic rendering + proper metadata
- Copied directive_meta.json and categories_clean.json into src/lib/data/
- Created src/lib/types.ts with LicenseCategory, DirectiveMeta, ActivityGroup types and 10 activity-type groupings
- Created src/lib/data.ts with category/directive loaders + splitRequirementItems parser (handles pandoc/markdown artifacts)
- Designed Prisma schema with 5 models: User, Application, News, Notification, AuditLog
- Pushed schema to SQLite (file:/home/z/my-project/db/custom.db)
- Created scripts/seed.ts with super_admin, admin, 3 news items, 8 sample applications, notifications
- Built Zustand store (src/lib/store.ts) with view routing via URL hash, language toggle, session, unread count
- Built bilingual i18n module (src/lib/i18n.ts) covering all UI chrome in EN+AM
- Built 11 API routes: auth/login, applications (GET/POST), applications/[id] (GET/PATCH), news (GET/POST), news/[id] (PATCH/DELETE), notifications (GET), notifications/[id] (PATCH), notifications/read-all (POST), users (GET/POST), users/[id] (PATCH/DELETE), metrics (GET), audit (GET)
- Built public components: header, footer, language-toggle, notifications-bell (with 30s polling), use-authed-fetch hook, activity-icon, home-view, categories-view, category-detail-view (with self-check tool + monopoly lock), apply-view (with mock file upload + validation), about-view, news-view, admin-login-view
- Built admin components: admin-view (tabbed shell), admin-dashboard (4 stat cards + 7-day line chart + status pie chart + top-categories bar chart via Recharts), admin-applications (searchable table + detail modal with approve/reject/under-review actions), admin-news (full CRUD + pin/publish toggles + super_admin delete), admin-users (super_admin only, create/edit/deactivate/delete with safeguards), admin-audit (last 100 actions with actor/IP/target)
- Wired up src/app/page.tsx as single-page router (sandbox only exposes / route)
- Fixed all lint errors (parsing error in store.ts arrow function type, setState-in-effect errors, unused eslint-disable directives)
- Verified with Agent Browser:
  * Home renders with hero, stats, how-it-works, activity groups, news, CTA
  * Categories directory shows all 45 in 10 activity groups with bilingual titles
  * Category detail shows description, 4 requirement checklists (Personnel/Facility/Equipment/Documents), self-check tool with progress %, sidebar with validity/renewal/standard docs
  * Monopoly categories (75110, 75200) correctly show "Not open to private applicants" notice + licensing_condition text, no Apply button
  * Apply form: organization/individual toggle, all fields, per-category document upload fields, validation, confirmation screen with reference ID
  * About page: full directive metadata, 4 certification rules, all 8 standard documents
  * News page: searchable list of published news
  * Admin login: works with superadmin@mcit.gov.et / superadmin123
  * Admin dashboard: charts render correctly with seed data (8 apps, status breakdown, 7-day series)
  * Admin applications: searchable/filterable table, detail modal with status update + review note
  * Admin news: list with pin/publish/edit/delete actions
  * Admin users (super_admin only): full table with create/edit/delete
  * Admin audit log: last 100 actions with actor details
  * Notifications bell: shows unread count badge, opens popover, mark-all-read works
  * Language toggle: switches UI between EN/AM, legal text stays in Amharic
  * Mobile responsive (375x812 viewport tested)
- Took screenshots of home (desktop + mobile) and admin dashboard
- Wrote comprehensive README.md with features, tech stack, schema, file structure, credentials
- Created scripts/package_zip.sh to bundle project (excludes node_modules, .next, db, logs, upload, tool-results)
- Generated /home/z/my-project/download/mcit-portal.zip (261KB, 140 files)

Stage Summary:
- Full-stack Next.js 16 + TypeScript + Prisma + Tailwind + shadcn/ui portal successfully built and verified end-to-end
- All 45 ICT license categories loaded from JSON, never hardcoded
- Bilingual (Amharic/English) UI with Amharic legal text preserved verbatim
- Super admin can manage users, news, applications; audit log captures all privileged actions
- Recharts dashboards show real metrics from seeded + submitted applications
- ZIP deliverable at /home/z/my-project/download/mcit-portal.zip (261KB, ready for download)
- Demo credentials: superadmin@mcit.gov.et/superadmin123 (super admin), admin@mcit.gov.et/admin123 (Harari reviewer)
- Dev server running cleanly on port 3000, lint passes with zero errors
