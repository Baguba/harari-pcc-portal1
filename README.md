# MCIT Professional Competence Certificate Portal

A production-ready, bilingual (Amharic/English) web portal for the **Ministry of Communication and Information Technology (MCIT)** of the Federal Democratic Republic of Ethiopia, designed specifically for the **Harari Region**.

The portal implements the **Revised Directive No. 1/2007 E.C.** that defines the professional competence requirements for businesses operating in the Communication and Information Technology (ICT) sector, under Commercial Registration and Business Licensing Proclamation No. 686/2002, Article 30(3).

---

## What this portal does

A business owner picks the **business license category** they operate in (45 fixed options, no free text), sees exactly what they must have to qualify — required staff qualifications, facility, equipment, and documents — and submits an application. MCIT staff then review and verify the application through the admin portal.

## Key features

### Public portal
- **Home** — Hero, how-it-works steps, activity-type groups, legal-basis summary, latest news, CTA
- **Categories directory** (`/categories`) — All 45 fixed ICT sector license categories, searchable, filterable, grouped by activity type (Manufacturing, Wholesale, Retail, Repair, Import, Export, Postal & Courier, Telecom Services, Computer/Software Services, ICT Consulting)
- **Category detail** (`/categories/[code]/[num]`) — Full description + four requirement checklists (Personnel, Facility, Equipment, Documents) + **interactive Eligibility Self-Check tool** with completion %, "Ready to apply" status, and persistent progress (localStorage). For the 2 monopoly categories (national postal #25, national telecom #28) the checklist is replaced with a prominent notice that the field is reserved for the state enterprise
- **Application form** (`/apply/[code]/[num]`) — Applicant info (individual or organization), address, TIN, per-category document upload fields, mock file validation, confirmation screen with reference ID and next-steps. If signed in as an applicant, the form prefills contact info and links the submission to the applicant's account. A sign-up nudge appears for guests (but they can still apply as guests)
- **About** — Full directive metadata: purpose, scope, issuing authority, legal basis, 4 certification rules, validity (1 year) & renewal, penalties, repealed directives, amendment clause, effective date, signatory, standard required documents
- **News & Updates** — Directive changes, fee updates, outage notices published by admins
- **Bilingual toggle** — Amharic/English for all UI chrome. Legal-text fields (description, personnel, facility, equipment, documents) are always rendered in their authoritative Amharic from the directive JSON — never auto-translated
- **Notifications** — In-app bell for signed-in users (admins and applicants) showing new applications, status changes, news

### Applicant portal (sign-up / sign in required)
- **Applicant sign-up** (`/applicant/signup`) — Create a new applicant account (email, password, name, phone, region)
- **Applicant sign-in** (`/applicant/login`) — Sign in with email + password. The same form also serves admins (they get redirected to the admin portal)
- **Applicant dashboard** (`/applicant/dashboard`) — Personalized welcome, stat cards (total/pending/approved/rejected), and a list of all applications the user has submitted. Click any application to see its detail
- **Application detail** (`/applicant/application/[id]`) — Full status timeline (Submitted → Under Review → Approved/Rejected), reviewer feedback, application info, reference ID. **When approved, displays a Professional Competence Certificate card** with holder name, license category, issue date, valid-until date (1 year), and a Print/Download button

### Admin portal (sign in required)
- **Dashboard** — Stat cards (total/pending/approved/rejected), 7-day timeseries line chart, status distribution pie chart, top-categories bar chart, quick stats (Recharts)
- **Applications** — Searchable/filterable list, detail modal with applicant info, uploaded documents, readiness %, status update (submitted → under_review → approved/rejected/revoked) with applicant-visible review note
- **News & Announcements** — Full CRUD; bilingual fields; pin-to-top; publish/unpublish; super_admin-only delete
- **Users & Admins** (super_admin only) — Create/edit/deactivate/delete admins and applicants; cannot delete last super_admin or self; full role management
- **Audit log** — Last 100 privileged actions (login, application status change, news create/update/delete, user create/update/delete) with actor, IP, target, detail

## Tech stack
- **Framework**: Next.js 16 (App Router) + TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui (New York)
- **Database**: Prisma ORM + SQLite (file-based, no external DB needed)
- **State**: Zustand (client state) + TanStack Query patterns
- **Charts**: Recharts
- **Icons**: lucide-react
- **Toasts**: Sonner
- **Fonts**: Geist Sans + Noto Sans Ethiopic (for Amharic)

## Brand palette (per directive spec)

| Purpose    | Color         | HEX       |
| ---------- | ------------- | --------- |
| Primary    | Emerald Green | `#0F6B4A` |
| Secondary  | Royal Blue    | `#1F4E8C` |
| Accent     | Gold          | `#C89B3C` |
| Background | Soft White    | `#FAFBFC` |
| Surface    | Warm Sand     | `#E8DDC8` |
| Text       | Dark Gray     | `#1F2937` |
| Border     | Light Gray    | `#D1D5DB` |

## Data sources (read from JSON, never hardcoded)
- `src/lib/data/directive.json` — Directive-level info (title, authority, legal basis, 4 certification rules, validity, renewal, penalties, repealed directives, amendment, effective date, signatory, standard document list)
- `src/lib/data/categories.json` — Array of all 45 license categories with `code`, `title_am`, `title_en`, `description`, `personnel`, `facility`, `equipment`, `documents`, and (for 2 monopoly categories) `licensing_condition`

## Database schema (Prisma)
- `User` — super_admin / admin / applicant with email, password (demo: plaintext), role, phone, region, active flag
- `Application` — links to category code+num, applicant info, readiness snapshot, uploaded document names, status, review note, reviewer
- `News` — bilingual title/body, category, pinned, published flags
- `Notification` — in-app notifications linked to user, application, or news
- `AuditLog` — every privileged admin action with actor, target, detail, IP

## Default credentials (demo seed)
- **Super Admin**: `superadmin@mcit.gov.et` / `superadmin123`
- **Admin (Harari Region reviewer)**: `admin@mcit.gov.et` / `admin123`
- **Applicant (sample business owner with 2 applications)**: `applicant@example.com` / `applicant123`

## Project structure
```
prisma/
  schema.prisma              # Database models
  scripts/seed.ts            # Seed data (admins, news, sample applications)
src/
  app/
    page.tsx                 # Single-page router (Zustand view state)
    layout.tsx               # Root layout with fonts + toaster
    globals.css              # Brand palette + Amharic font rendering
    api/
      auth/login/            # POST sign in (any role)
      auth/signup/           # POST applicant self-registration
      applications/          # GET list (admin) / POST create (public or applicant)
      applications/mine/     # GET applications for a specific applicant
      applications/[id]/     # GET / PATCH (admin)
      news/                  # GET (public/admin) / POST (admin)
      news/[id]/             # PATCH (admin) / DELETE (super_admin)
      notifications/         # GET list for user
      notifications/[id]/    # PATCH mark as read
      notifications/read-all/ # POST bulk mark read
      users/                 # GET (admin) / POST (super_admin)
      users/[id]/            # PATCH (super_admin) / DELETE (super_admin)
      metrics/               # GET dashboard stats (admin)
      audit/                 # GET audit log (admin)
  components/
    portal/                  # Public-facing components
      header.tsx, footer.tsx
      home-view.tsx, categories-view.tsx
      category-detail-view.tsx, apply-view.tsx
      about-view.tsx, news-view.tsx
      admin-login-view.tsx
      applicant-auth-view.tsx         # Sign in / Sign up (applicants)
      applicant-dashboard-view.tsx    # Applicant's applications list
      applicant-application-view.tsx  # Application detail + certificate
      language-toggle.tsx, notifications-bell.tsx
      activity-icon.tsx, use-authed-fetch.ts
    admin/                   # Admin-only components
      admin-view.tsx         # Top-level tabbed shell
      admin-dashboard.tsx    # Charts + stats
      admin-applications.tsx # Review/approve/reject
      admin-news.tsx         # News CRUD
      admin-users.tsx        # User management (super_admin)
      admin-audit.tsx        # Audit log viewer
    ui/                       # shadcn/ui components
  lib/
    data.ts                  # Categories + directive loaders
    types.ts                 # TypeScript types + activity groups
    store.ts                 # Zustand store (view, lang, session)
    i18n.ts                  # Bilingual UI strings
    db.ts                    # Prisma client
    audit.ts                 # Audit-log helper
```

## Local development

> Requires **Node.js 18+** and **npm**. No Bun needed.

```bash
npm install
npm run db:push       # Apply Prisma schema to SQLite
npx prisma generate   # (auto-runs on db:push, but safe to re-run)
npm run seed          # Seed demo data (super_admin, admin, applicant, news, sample applications)
npm run dev           # Start dev server on http://localhost:3000
```

The `seed` script is wired to `scripts/seed.ts` via `tsx` (already a dev dependency). If `npm run seed` is not defined in your `package.json`, run it directly with:

```bash
npx tsx scripts/seed.ts
```

## Notes & disclaimers
- This is a compliance and convenience tool. The authoritative legal text remains the official directive published by MCIT. In case of any discrepancy, the official directive prevails.
- Amharic legal-text fields (`description`, `personnel`, `facility`, `equipment`, `documents`) are rendered verbatim from the source JSON — never translated or paraphrased in a way that could change legal meaning.
- The Eligibility Self-Check tool only assesses readiness — it never issues or guarantees a certificate. No certificate is implied as granted until MCIT verifies all category requirements.
- A Professional Competence Certificate is valid for **1 year** from issuance and must be renewed for the same period after expiry.
- The 2 monopoly categories (national postal #25, national telecom #28) are never shown an "Apply" button — private applicants are not eligible by law.
- Demo credentials use plaintext passwords for convenience. In a production deployment, replace with hashed passwords (bcrypt/argon2) and a proper session/JWT layer.
- File uploads are currently stored as filename strings (mock storage). In production, integrate with S3-compatible object storage with proper validation, virus scanning, and access control.

## License
© MCIT, Federal Democratic Republic of Ethiopia. All rights reserved.
