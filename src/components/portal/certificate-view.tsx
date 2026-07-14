"use client";

import { useRef, useState, useEffect } from "react";
import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { directive } from "@/lib/data";
import { QRCodeSVG } from "qrcode.react";

interface CertificateProps {
  holderName: string;
  categoryCode: string;
  categoryTitle: string;
  issuedDate: string | null;
  applicationId: string;
  lang: "en" | "am";
  stampUrl?: string | null;
  signatureUrl?: string | null;
}

/* ------------------------------------------------------------------ */
/*  SVG sub-components for the ornamental certificate                 */
/* ------------------------------------------------------------------ */

/** Corner ornament — mirrored into all 4 corners via CSS transform */
function CornerOrnament({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="90"
      height="90"
      viewBox="0 0 90 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Leaf / scroll curves */}
      <path
        d="M4 4 C4 4 4 40 20 56 C36 72 56 72 56 72"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M8 4 C8 4 8 36 22 50 C36 64 52 64 52 64"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M4 8 C4 8 4 36 18 50 C32 64 56 64 56 64"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
      {/* Small circle accent */}
      <circle cx="10" cy="10" r="3" fill="currentColor" opacity="0.6" />
      <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="0.75" fill="none" opacity="0.3" />
      {/* Inner leaf details */}
      <path
        d="M14 14 C14 14 16 28 24 36 C32 44 44 46 44 46"
        stroke="currentColor"
        strokeWidth="0.75"
        fill="none"
        opacity="0.4"
      />
    </svg>
  );
}

/** Official seal — a rosette with text around it */
function OfficialSeal() {
  return (
    <div className="cert-seal">
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {/* Outer ring */}
        <circle cx="60" cy="60" r="56" stroke="#C89B3C" strokeWidth="2" fill="none" />
        <circle cx="60" cy="60" r="52" stroke="#C89B3C" strokeWidth="0.5" fill="none" />
        {/* Gear / rosette teeth */}
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i * 10 * Math.PI) / 180;
          const x1 = 60 + 48 * Math.cos(angle);
          const y1 = 60 + 48 * Math.sin(angle);
          const x2 = 60 + 52 * Math.cos(angle);
          const y2 = 60 + 52 * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#C89B3C"
              strokeWidth="1.2"
              opacity="0.6"
            />
          );
        })}
        {/* Inner circle */}
        <circle cx="60" cy="60" r="44" stroke="#C89B3C" strokeWidth="1" fill="none" />
        <circle cx="60" cy="60" r="40" stroke="#C89B3C" strokeWidth="0.5" fill="none" opacity="0.5" />
        {/* Logo emblem at center of the seal */}
        <image href="/logo.png" x="42" y="42" height="36" width="36" />
        {/* Text around the seal */}
        <defs>
          <path
            id="sealTextTop"
            d="M 18,60 a 42,42 0 1,1 84,0"
          />
          <path
            id="sealTextBottom"
            d="M 102,60 a 42,42 0 1,1 -84,0"
          />
        </defs>
        <text fontSize="6" fill="#C89B3C" fontWeight="600" letterSpacing="1.5">
          <textPath href="#sealTextTop" startOffset="50%" textAnchor="middle">
            PCC • ETHIOPIA
          </textPath>
        </text>
        <text fontSize="5.5" fill="#C89B3C" fontWeight="500" letterSpacing="1">
          <textPath href="#sealTextBottom" startOffset="50%" textAnchor="middle">
            PROFESSIONAL COMPETENCE
          </textPath>
        </text>
      </svg>
    </div>
  );
}

/** Guilloche-style wave border pattern */
function GuillochePattern() {
  return (
    <svg
      className="cert-guilloche"
      viewBox="0 0 800 20"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M0,10 C20,2 40,18 60,10 C80,2 100,18 120,10 C140,2 160,18 180,10 C200,2 220,18 240,10 C260,2 280,18 300,10 C320,2 340,18 360,10 C380,2 400,18 420,10 C440,2 460,18 480,10 C500,2 520,18 540,10 C560,2 580,18 600,10 C620,2 640,18 660,10 C680,2 700,18 720,10 C740,2 760,18 780,10 C790,6 800,10 800,10"
        stroke="#C89B3C"
        strokeWidth="0.8"
        opacity="0.4"
      />
      <path
        d="M0,10 C20,18 40,2 60,10 C80,18 100,2 120,10 C140,18 160,2 180,10 C200,18 220,2 240,10 C260,18 280,2 300,10 C320,18 340,2 360,10 C380,18 400,2 420,10 C440,18 460,2 480,10 C500,18 520,2 540,10 C560,18 580,2 600,10 C620,18 640,2 660,10 C680,18 700,2 720,10 C740,18 760,2 780,10 C790,14 800,10 800,10"
        stroke="#0F6B4A"
        strokeWidth="0.8"
        opacity="0.3"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Certificate component                                        */
/* ------------------------------------------------------------------ */

export function CertificateView({
  holderName,
  categoryCode,
  categoryTitle,
  issuedDate,
  applicationId,
  lang,
  stampUrl,
  signatureUrl,
}: CertificateProps) {
  const certRef = useRef<HTMLDivElement>(null);
  const [verifyUrl, setVerifyUrl] = useState("");

  const issued = issuedDate ? new Date(issuedDate) : null;
  const validUntil = issued
    ? new Date(new Date(issuedDate!).setFullYear(issued.getFullYear() + 1))
    : null;

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // Build the verification URL on the client (needs window.location.origin)
  useEffect(() => {
    setVerifyUrl(`${window.location.origin}/verify?id=${applicationId}`);
  }, [applicationId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="cert-wrapper mb-6">
      {/* Action buttons — hidden on print */}
      <div className="flex justify-end gap-2 mb-3 no-print">
        <Button variant="outline" size="sm" className="gap-1.5" onClick={handlePrint}>
          <Printer className="h-3.5 w-3.5" aria-hidden />
          {lang === "en" ? "Print" : lang === "am" ? "አትም" : "Maxxansi"}
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={handlePrint}>
          <Download className="h-3.5 w-3.5" aria-hidden />
          {lang === "en" ? "Download PDF" : lang === "am" ? "PDF አውርድ" : "PDF Buusi"}
        </Button>
      </div>

      {/* Certificate document */}
      <div ref={certRef} className="cert-document" id="certificate">
        {/* Decorative outer border */}
        <div className="cert-border-outer">
          <div className="cert-border-inner">
            {/* Corner ornaments */}
            <CornerOrnament className="cert-corner cert-corner-tl" />
            <CornerOrnament className="cert-corner cert-corner-tr" />
            <CornerOrnament className="cert-corner cert-corner-bl" />
            <CornerOrnament className="cert-corner cert-corner-br" />

            {/* Top guilloche */}
            <GuillochePattern />

            {/* Watermark pattern behind content */}
            <div className="cert-watermark" aria-hidden>
              <img src="/logo.png" alt="" className="w-56 h-56 object-contain opacity-[0.03]" />
            </div>

            {/* Certificate content */}
            <div className="cert-content">
              {/* Header */}
              <div className="cert-header">
                <div className="cert-authority-badge">
                  <img src="/logo.png" alt="PCC Logo" className="h-12 w-12 object-contain" />
                </div>

                <div className="cert-authority-text">
                  <p className="cert-country">
                    {lang === "en"
                      ? "Harari Regional State of Ethiopia"
                      : lang === "am"
                        ? "የሐረሪ ሕዝብ ብሔራዊ ክልላዊ መንግሥት"
                        : "Mootummaa Naannoo Hararii Itoophiyaa"}
                  </p>
                  <p className="cert-ministry">
                    {lang === "en"
                      ? "Innovation and Technology Agency"
                      : lang === "am"
                        ? "የኮሙኒኬሽንና ኢንፎርሜሽን ቴክኖሎጂ ሚኒስቴር"
                        : "Eejansii Inoviishinii fi Teknolojii"}
                  </p>
                </div>
              </div>

              {/* Divider line */}
              <div className="cert-divider">
                <div className="cert-divider-line" />
                <div className="cert-divider-diamond" />
                <div className="cert-divider-line" />
              </div>

              {/* Title */}
              <h2 className="cert-title">
                {lang === "en"
                  ? "Professional Competence Certificate"
                  : lang === "am"
                    ? "የሙያ ብቃት ሰርቲፊኬት"
                    : "Waraqaa Ragaa Dandeettii Ogummaa"}
              </h2>
              <p className="cert-subtitle">
                {directive.directive_number}
              </p>

              {/* Seal positioned absolutely */}
              <OfficialSeal />

              {/* Body text */}
              <div className="cert-body">
                <p className="cert-preamble">
                  {lang === "en"
                    ? "This is to certify that"
                    : lang === "am"
                      ? "ይህ የሚረጋግጠው"
                      : "Kuni kan mirkaneessu"}
                </p>

                <p className="cert-holder-name">{holderName}</p>

                <p className="cert-description">
                  {lang === "en"
                    ? `has fulfilled the professional competence requirements and is hereby granted authorization to operate in the following business field under the Communication and Information Technology sector:`
                    : lang === "am"
                      ? `የሙያ ብቃት መስፈርቶችን በማሟላት በኮሙኒኬሽንና ኢንፎርሜሽን ቴክኖሎጂ ዘርፍ በሚከተለው የንግድ ስራ መስክ ለመስራት ፈቃድ ተሰጥቶታል/ታለች:`
                      : `ulaagaalee dandeettii ogummaa guutee jiruuf sektara Komunikeeshinii fi Teknolojii Odeeffannoo jalatti hojii daldalaa armaan gadii irratti akka bobba'uuf eeyyamni kennameefii jira:`}
                </p>

                <div className="cert-category-box">
                  <span className="cert-category-code">{categoryCode}</span>
                  <span className="cert-category-title">{categoryTitle}</span>
                </div>
              </div>

              {/* Date fields */}
              <div className="cert-dates">
                <div className="cert-date-item">
                  <span className="cert-date-label">
                    {lang === "en" ? "Date of Issue" : lang === "am" ? "የተሰጠበት ቀን" : "Guyyaa Kenname"}
                  </span>
                  <span className="cert-date-value">
                    {issued ? formatDate(issued) : "—"}
                  </span>
                </div>
                <div className="cert-date-item">
                  <span className="cert-date-label">
                    {lang === "en" ? "Valid Until" : lang === "am" ? "የሚያበቃበት ቀን" : "Hanga Guyyaa"}
                  </span>
                  <span className="cert-date-value">
                    {validUntil ? formatDate(validUntil) : "—"}
                  </span>
                </div>
                <div className="cert-date-item">
                  <span className="cert-date-label">
                    {lang === "en" ? "Certificate No." : lang === "am" ? "ሰርቲፊኬት ቁጥር" : "Lakk. Waraqaa Ragaa"}
                  </span>
                  <span className="cert-date-value cert-ref-id">
                    {applicationId.slice(0, 16).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* QR Code for verification */}
              {verifyUrl && (
                <div className="cert-qr-section">
                  <div className="cert-qr-box">
                    <QRCodeSVG
                      value={verifyUrl}
                      size={82}
                      level="M"
                      bgColor="transparent"
                      fgColor="#1F2937"
                      className="cert-qr-code"
                    />
                    <span className="cert-qr-label">
                      {lang === "en"
                        ? "Scan to verify"
                        : lang === "am"
                          ? "ለማረጋገጥ ስካን ያድርጉ"
                          : "Mirkaneessuuf Iskaan godhi"}
                    </span>
                  </div>
                </div>
              )}

              {/* Signature section */}
              <div className="cert-signatures">
                <div className="cert-sig-block relative flex flex-col items-center">
                  {signatureUrl && (
                    <img
                      src={signatureUrl}
                      alt="Signature"
                      className="absolute -top-12 h-14 object-contain pointer-events-none"
                    />
                  )}
                  <div className="cert-sig-line w-full" />
                  <p className="cert-sig-title">
                    {lang === "en" ? "Authorized Signatory" : lang === "am" ? "ሥልጣን የተሰጠው ፈራሚ" : "Mallattoo Eeyyamame"}
                  </p>
                  <p className="cert-sig-name">
                    {lang === "en" ? "Director, Licensing Division" : lang === "am" ? "ዳይሬክተር፣ ፈቃድ ክፍል" : "Daayirektara, Damee Hayyamaa"}
                  </p>
                </div>
                <div className="cert-sig-block relative flex flex-col items-center">
                  {stampUrl && (
                    <img
                      src={stampUrl}
                      alt="Official Stamp"
                      className="absolute -top-14 h-20 w-20 object-contain opacity-85 pointer-events-none mix-blend-multiply"
                    />
                  )}
                  <div className="cert-sig-line w-full" />
                  <p className="cert-sig-title">
                    {lang === "en" ? "Minister / Authorized Official" : lang === "am" ? "ሚኒስቴር / ሥልጣን ያለው ባለሥልጣን" : "Ministeera / Abbaa Taayitaa Eeyyamame"}
                  </p>
                  <p className="cert-sig-name">PCC</p>
                </div>
              </div>

              {/* Bottom security strip */}
              <div className="cert-security-strip">
                <div className="cert-security-inner">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M8 1L14 4V8C14 11.3 11.4 14.2 8 15C4.6 14.2 2 11.3 2 8V4L8 1Z" stroke="currentColor" strokeWidth="1" fill="none"/>
                    <path d="M5.5 8L7 9.5L10.5 6" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>
                    {lang === "en"
                      ? "This certificate is issued pursuant to Proclamation No. 686/2002, Article 30(3). Valid for one year from date of issue."
                      : lang === "am"
                        ? "ይህ ሰርቲፊኬት በአዋጅ ቁጥር 686/2002 አንቀጽ 30(3) መሠረት የተሰጠ ነው። ከተሰጠበት ቀን ጀምሮ ለአንድ ዓመት ተፈጻሚ ይሆናል።"
                        : "Waraqaan ragaa kun Labsa Lakk. 686/2002, Keewwata 30(3) bu'uura godhachuun kan kennamedha. Guyyaa kennamee kaasee waggaa tokkof kan hojjetudha."}
                  </span>
                </div>
              </div>

              {/* Bottom guilloche */}
              <GuillochePattern />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
