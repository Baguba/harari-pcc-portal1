/**
 * Audit helper — wraps db.auditLog.create so we can call it from any API route.
 */
import { db } from "./db";

export interface AuditInput {
  actorId?: string | null;
  action: string;
  target?: string | null;
  detail?: string | null;
  ip?: string | null;
}

export async function audit(input: AuditInput) {
  try {
    await db.auditLog.create({
      data: {
        actorId: input.actorId || null,
        action: input.action,
        target: input.target || null,
        detail: input.detail || null,
        ip: input.ip || null,
      },
    });
  } catch (e) {
    // audit failures should never break the main flow
    console.error("audit log failed:", e);
  }
}
