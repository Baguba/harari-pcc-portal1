/**
 * Public Certificate Verification API
 *   GET /api/verify?id=<applicationId>  — verify a certificate's authenticity
 *
 * No authentication required — this is a public endpoint used by QR code scans.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { valid: false, error: "Missing certificate ID" },
      { status: 400 }
    );
  }

  try {
    const app = await db.application.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        categoryCode: true,
        categoryTitle: true,
        contactName: true,
        organizationName: true,
        reviewedAt: true,
        createdAt: true,
      },
    });

    if (!app) {
      return NextResponse.json(
        { valid: false, error: "Certificate not found" },
        { status: 404 }
      );
    }

    if (app.status !== "approved") {
      return NextResponse.json(
        {
          valid: false,
          error: "Certificate is not valid",
          status: app.status,
        },
        { status: 200 }
      );
    }

    // Calculate validity dates
    const issuedDate = app.reviewedAt
      ? new Date(app.reviewedAt)
      : null;
    const validUntil = issuedDate
      ? new Date(
          new Date(issuedDate).setFullYear(issuedDate.getFullYear() + 1)
        )
      : null;
    const isExpired = validUntil ? new Date() > validUntil : false;

    return NextResponse.json({
      valid: !isExpired,
      expired: isExpired,
      certificate: {
        holderName: app.organizationName || app.contactName,
        categoryCode: app.categoryCode,
        categoryTitle: app.categoryTitle,
        certificateNo: app.id.slice(0, 16).toUpperCase(),
        issuedDate: issuedDate?.toISOString() || null,
        validUntil: validUntil?.toISOString() || null,
        status: app.status,
      },
    });
  } catch {
    return NextResponse.json(
      { valid: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}
