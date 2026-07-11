/**
 * Seed script — populate initial super_admin, an admin, sample news,
 * and a handful of sample applications so the admin dashboard isn't empty.
 */
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const db = new PrismaClient();

// ---------------------------------------------------------------------------
// Password hashing (duplicated from src/lib/password.ts so seed runs standalone)
// ---------------------------------------------------------------------------
const ITERATIONS = 100_000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";
const SALT_LENGTH = 32;

async function hashPassword(plain: string): Promise<string> {
  const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
  const hash = await new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(plain, salt, ITERATIONS, KEY_LENGTH, DIGEST, (err, key) => {
      if (err) reject(err);
      else resolve(key.toString("hex"));
    });
  });
  return `${salt}:${hash}`;
}

async function main() {
  // --- Super Admin ---
  const superAdmin = await db.user.upsert({
    where: { email: "superadmin@mcit.gov.et" },
    update: {},
    create: {
      email: "superadmin@mcit.gov.et",
      name: "Super Administrator",
      password: await hashPassword("SuperAdmin1"),
      role: "super_admin",
      region: "Harari",
      phone: "+251911000001",
      active: true,
    },
  });

  // --- Regular Admin (MCIT staff reviewer) ---
  const admin = await db.user.upsert({
    where: { email: "admin@mcit.gov.et" },
    update: {},
    create: {
      email: "admin@mcit.gov.et",
      name: "Harari Region Reviewer",
      password: await hashPassword("AdminPass1"),
      role: "admin",
      region: "Harari",
      phone: "+251911000002",
      active: true,
    },
  });

  // --- Sample applicant (a business owner who submitted applications) ---
  const applicant = await db.user.upsert({
    where: { email: "applicant@example.com" },
    update: {},
    create: {
      email: "applicant@example.com",
      name: "Yusuf Ibrahim",
      password: await hashPassword("Applicant1"),
      role: "applicant",
      region: "Harari",
      phone: "+251914567890",
      active: true,
    },
  });

  // --- Sample news / announcements ---
  const newsItems = [
    {
      titleEn: "Directive 1/2007 (Revised) now in effect",
      titleAm: "መመሪያ ቁጥር 1/2007 (ተሻሽሎ የወጣ) አሁን በስራ ላይ ውሏል",
      bodyEn:
        "The revised directive determining professional competence requirements for ICT sector business licenses is now in effect. Applicants should review the standard document list and per-category requirements before applying.",
      bodyAm:
        "በመገናኛና ኢንፎርሜሽን ቴክኖሎጂ ዘርፍ ለሚሰጡ የንግድ ስራ ፈቃዶች ሊሟሉ የሚገባቸውን የሙያ ብቃት መስፈርቶች ለመወሰን ተሻሽሎ የወጣ መመሪያ አሁን በስራ ላይ ውሏል። አመልካቾች ከማመልከት በፊት የመደበኛ ሰነዶች ዝርዝር እና በእያንዳንዱ ምድብ የሚገቡ መስፈርቶችን መገምገም ይኖርባቸዋል።",
      category: "directive_change",
      pinned: true,
      published: true,
      publishedAt: new Date(),
    },
    {
      titleEn: "Service fee adjustment notice",
      titleAm: "የአገልግሎት ክፍያ ማስታወቂያ",
      bodyEn:
        "Effective this quarter, the service fee for professional competence certificate applications is paid per the Ministry's service-fee directive. Refer to your selected category page for any category-specific fee notes.",
      bodyAm:
        "በዚህ ሩብ ዓመት ጀምሮ የሙያ ብቃት ሰርቲፊኬት ማመልከቻ ክፍያ የሚከፈለው በሚኒስቴር የአገልግሎት ክፍያ መመሪያ መሰረት ነው።",
      category: "fee",
      pinned: false,
      published: true,
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      titleEn: "Scheduled maintenance window",
      titleAm: "የታቀደ የጥገና ጊዜ",
      bodyEn:
        "The portal will undergo scheduled maintenance this Saturday from 02:00 to 04:00 EAT. Applications in progress will be preserved.",
      bodyAm:
        "ፖርታሉ በዚህ ቅዳሜ ከጧት 2:00 እስከ 4:00 ሰዓት የታቀደ ጥገና ያደርጋል። በሂደት ላይ ያሉ ማመልከቻዎች አይጠፋሉም።",
      category: "outage",
      pinned: false,
      published: false,
      publishedAt: null,
    },
  ];

  for (const n of newsItems) {
    await db.news.upsert({
      where: { id: n.titleEn }, // not unique; use createMany ignoreDuplicates instead
      update: {},
      create: n,
    }).catch(() => {});
  }

  // --- Sample applications so admin dashboard has data ---
  const sampleApps = [
    {
      categoryCode: "62803",
      categoryNum: 12,
      categoryTitle: "Retail of computers, computer-related equipment, accessories and supplies",
      applicantType: "organization",
      organizationName: "Harar Tech Solutions PLC",
      contactName: "Amanuel Tesfaye",
      email: "amanuel@harartech.et",
      phone: "+251912345678",
      region: "Harari",
      city: "Harar",
      addressLine: "Kebele 04, Around Bisidimo Road",
      tinNumber: "0012345678",
      nationalId: "1000100010001000",
      readinessPercent: 100,
      uploadedDocuments: "application_letter.pdf,tin.pdf,registry.pdf",
      status: "submitted",
    },
    {
      categoryCode: "86200",
      categoryNum: 40,
      categoryTitle: "Software design, development and implementation works",
      applicantType: "organization",
      organizationName: "Dire Dawa Software House",
      contactName: "Hanan Ahmed",
      email: "hanan@ddsh.et",
      phone: "+251913456789",
      region: "Harari",
      city: "Harar",
      addressLine: "Kebele 07, Near Abadir Mosque",
      tinNumber: "0023456789",
      nationalId: "2000200020002000",
      readinessPercent: 75,
      uploadedDocuments: "application_letter.pdf,tin.pdf",
      status: "under_review",
    },
    {
      categoryCode: "63154",
      categoryNum: 15,
      categoryTitle: "Repair of computers and computer-related equipment",
      applicantType: "individual",
      organizationName: null,
      contactName: "Yusuf Ibrahim",
      email: "applicant@example.com",
      phone: "+251914567890",
      region: "Harari",
      city: "Harar",
      addressLine: "Kebele 02, Old Town",
      tinNumber: "0034567890",
      nationalId: "3000300030003000",
      readinessPercent: 90,
      uploadedDocuments: "application_letter.pdf,tin.pdf,registry.pdf,photos.jpg",
      status: "approved",
      reviewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      reviewedById: admin.id,
      reviewNote: "All requirements verified. Certificate issued.",
      submittedById: applicant.id,
    },
    {
      categoryCode: "75210",
      categoryNum: 29,
      categoryTitle: "Telecenter service",
      applicantType: "organization",
      organizationName: "Awash Telecenter Ltd",
      contactName: "Sara Bekele",
      email: "sara@awashtelecenter.et",
      phone: "+251915678901",
      region: "Harari",
      city: "Harar",
      addressLine: "Kebele 05, Around Stadium",
      tinNumber: "0045678901",
      nationalId: "4000400040004000",
      readinessPercent: 60,
      uploadedDocuments: "application_letter.pdf",
      status: "submitted",
    },
    {
      categoryCode: "61523",
      categoryNum: 7,
      categoryTitle: "Wholesale of computers, computer-related equipment, accessories and supplies",
      applicantType: "organization",
      organizationName: "Ethio Wholesale Trading",
      contactName: "Dawit Mengistu",
      email: "dawit@ewt.et",
      phone: "+251916789012",
      region: "Harari",
      city: "Harar",
      addressLine: "Kebele 01, Industrial Area",
      tinNumber: "0056789012",
      nationalId: "5000500050005000",
      readinessPercent: 80,
      uploadedDocuments: "application_letter.pdf,tin.pdf,registry.pdf,articles.pdf",
      status: "rejected",
      reviewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      reviewedById: admin.id,
      reviewNote: "Missing educational credentials of professional staff. Please resubmit with required documents.",
    },
    {
      categoryCode: "86100",
      categoryNum: 39,
      categoryTitle: "Computer network design, installation and implementation works",
      applicantType: "organization",
      organizationName: "Network Pro LLC",
      contactName: "Meriem Osman",
      email: "meriem@networkpro.et",
      phone: "+251917890123",
      region: "Harari",
      city: "Harar",
      addressLine: "Kebele 06, Around University",
      tinNumber: "0067890123",
      nationalId: "6000600060006000",
      readinessPercent: 95,
      uploadedDocuments: "application_letter.pdf,tin.pdf,registry.pdf,articles.pdf,credentials.pdf",
      status: "approved",
      reviewedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      reviewedById: admin.id,
      reviewNote: "Verified and approved.",
    },
    {
      categoryCode: "75220",
      categoryNum: 30,
      categoryTitle: "Internet café service",
      applicantType: "individual",
      organizationName: null,
      contactName: "Yusuf Ibrahim",
      email: "applicant@example.com",
      phone: "+251914567890",
      region: "Harari",
      city: "Harar",
      addressLine: "Kebele 02, Old Town",
      tinNumber: "0034567890",
      nationalId: "7000700070007000",
      readinessPercent: 70,
      uploadedDocuments: "application_letter.pdf,tin.pdf",
      status: "under_review",
      submittedById: applicant.id,
    },
    {
      categoryCode: "88740",
      categoryNum: 45,
      categoryTitle: "ICT consulting services",
      applicantType: "organization",
      organizationName: "Highland Consulting",
      contactName: "Tigist Wolde",
      email: "tigist@highland.et",
      phone: "+251919012345",
      region: "Harari",
      city: "Harar",
      addressLine: "Kebele 08, Around Office Building",
      tinNumber: "0089012345",
      nationalId: "8000800080008000",
      readinessPercent: 100,
      uploadedDocuments: "application_letter.pdf,tin.pdf,registry.pdf,articles.pdf,credentials.pdf,photos.jpg",
      status: "submitted",
    },
  ];

  const fs = require("fs");
  const path = require("path");

  // Minimal PDF mockup
  const mockPdf = Buffer.from(
    "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]/Contents 4 0 R>>endobj\n4 0 obj<</Length 46>>stream\nBT /F1 24 Tf 50 700 Td (MCIT Mock Document File) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000056 00000 n\n0000000111 00000 n\n0000000212 00000 n\ntrailer<</Size 5/Root 1 0 R>>\nstartxref\n307\n%%EOF"
  );
  
  // Minimal PNG mockup (or copy from logo)
  let logoBuffer: Buffer | null = null;
  try {
    logoBuffer = fs.readFileSync(path.join(process.cwd(), "public", "logo.png"));
  } catch (e) {}

  for (const a of sampleApps) {
    const created = await db.application.create({
      data: {
        ...a,
        submittedById: undefined,
      },
    });

    if (created.uploadedDocuments) {
      const uploadDir = path.join(process.cwd(), "public", "uploads", created.id);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      for (const docName of created.uploadedDocuments.split(",")) {
        const trimmed = docName.trim();
        const filePath = path.join(uploadDir, trimmed);
        if (trimmed.toLowerCase().endsWith(".pdf")) {
          fs.writeFileSync(filePath, mockPdf);
        } else if (trimmed.toLowerCase().endsWith(".png") || trimmed.toLowerCase().endsWith(".jpg") || trimmed.toLowerCase().endsWith(".jpeg")) {
          if (logoBuffer) {
            fs.writeFileSync(filePath, logoBuffer);
          } else {
            fs.writeFileSync(filePath, Buffer.from(""));
          }
        } else {
          fs.writeFileSync(filePath, Buffer.from("MCIT Mock Document File Content"));
        }
      }
    }
  }

  // --- Notifications for the super admin ---
  for (const a of (await db.application.findMany({ take: 3 }))) {
    await db.notification.create({
      data: {
        userId: superAdmin.id,
        title: "New application submitted",
        body: `Application from ${a.contactName} for category ${a.categoryCode} — ${a.categoryTitle}`,
        type: "application",
        link: `admin/application/${a.id}`,
        applicationId: a.id,
      },
    });
  }

  console.log("Seed complete.");
  console.log("  super_admin:", superAdmin.email, "(password: SuperAdmin1)");
  console.log("  admin:     ", admin.email, "(password: AdminPass1)");
  console.log("  applicant: ", applicant.email, "(password: Applicant1)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
