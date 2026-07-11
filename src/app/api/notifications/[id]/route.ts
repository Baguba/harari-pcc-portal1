import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const updated = await db.notification.update({
    where: { id },
    data: { read: body.read ?? true },
  });
  return NextResponse.json({ notification: updated });
}
