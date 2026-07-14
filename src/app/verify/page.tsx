"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface CertificateData {
  holderName: string;
  categoryCode: string;
  categoryTitle: string;
  certificateNo: string;
  issuedDate: string | null;
  validUntil: string | null;
  status: string;
}

interface VerifyResponse {
  valid: boolean;
  expired?: boolean;
  certificate?: CertificateData;
  error?: string;
  status?: string;
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<VerifyResponse | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    fetch(`/api/verify?id=${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => setData({ valid: false, error: "Network error" }))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="verify-page">
      {/* Background decorations */}
      <div className="verify-bg-pattern" aria-hidden />

      <div className="verify-container">
        {/* Header */}
        <div className="verify-header">
          <img src="/logo.png" alt="PCC Logo" className="verify-logo" />
          <h1 className="verify-agency-name">Innovation and Technology Agency</h1>
          <p className="verify-agency-sub">
            Harari Regional State of Ethiopia
          </p>
          <div className="verify-divider" />
          <h2 className="verify-page-title">Certificate Verification</h2>
        </div>

        {/* Content */}
        {loading ? (
          <div className="verify-loading">
            <div className="verify-spinner" />
            <p>Verifying certificate…</p>
          </div>
        ) : !id ? (
          <div className="verify-card verify-invalid">
            <div className="verify-icon-circle verify-icon-error">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h3 className="verify-status-title">Invalid Request</h3>
            <p className="verify-status-desc">
              No certificate ID provided. Please scan a valid QR code from a
              certificate.
            </p>
          </div>
        ) : data?.valid ? (
          <div className="verify-card verify-valid">
            <div className="verify-icon-circle verify-icon-success">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className="verify-status-title">
              {data.expired ? "Certificate Expired" : "Certificate Verified"}
            </h3>
            <p className="verify-status-desc">
              {data.expired
                ? "This certificate was valid but has expired."
                : "This is an authentic and valid Professional Competence Certificate."}
            </p>

            {/* Certificate details */}
            <div className="verify-details">
              <div className="verify-detail-row">
                <span className="verify-detail-label">Certificate Holder</span>
                <span className="verify-detail-value">
                  {data.certificate?.holderName}
                </span>
              </div>
              <div className="verify-detail-row">
                <span className="verify-detail-label">Category</span>
                <span className="verify-detail-value">
                  <strong>{data.certificate?.categoryCode}</strong> —{" "}
                  {data.certificate?.categoryTitle}
                </span>
              </div>
              <div className="verify-detail-row">
                <span className="verify-detail-label">Certificate No.</span>
                <span className="verify-detail-value verify-mono">
                  {data.certificate?.certificateNo}
                </span>
              </div>
              <div className="verify-detail-row">
                <span className="verify-detail-label">Date of Issue</span>
                <span className="verify-detail-value">
                  {formatDate(data.certificate?.issuedDate ?? null)}
                </span>
              </div>
              <div className="verify-detail-row">
                <span className="verify-detail-label">Valid Until</span>
                <span className="verify-detail-value">
                  {formatDate(data.certificate?.validUntil ?? null)}
                </span>
              </div>
              <div className="verify-detail-row">
                <span className="verify-detail-label">Status</span>
                <span className={`verify-detail-value ${data.expired ? "verify-text-expired" : "verify-text-valid"}`}>
                  {data.expired ? "⚠ Expired" : "✓ Active & Valid"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="verify-card verify-invalid">
            <div className="verify-icon-circle verify-icon-error">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h3 className="verify-status-title">Certificate Not Valid</h3>
            <p className="verify-status-desc">
              {data?.error === "Certificate not found"
                ? "No certificate was found with this ID. It may be counterfeit or the QR code may be damaged."
                : data?.status === "revoked"
                  ? "This certificate has been revoked by the issuing authority."
                  : data?.status === "rejected"
                    ? "This application was rejected and no valid certificate exists."
                    : "This certificate could not be verified. Please contact the Innovation and Technology Agency."}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="verify-footer">
          <p>
            Professional Competence Certificate Portal — Innovation and
            Technology Agency, Harari Regional State
          </p>
          <p className="verify-footer-note">
            This verification was performed on{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="verify-page">
          <div className="verify-container">
            <div className="verify-loading">
              <div className="verify-spinner" />
              <p>Loading…</p>
            </div>
          </div>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
