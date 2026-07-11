"use client";

/**
 * Authenticated fetch wrapper — attaches the in-memory session user
 * as headers so server API routes can authorize admin actions.
 */
import { useApp } from "@/lib/store";

export function useAuthedFetch() {
  const session = useApp((s) => s.session);

  return async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const headers = new Headers(init.headers || {});
    if (session) {
      headers.set("x-actor-id", session.id);
      headers.set("x-actor-role", session.role);
    }
    return fetch(input, { ...init, headers });
  };
}
