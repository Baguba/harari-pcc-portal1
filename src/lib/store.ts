/**
 * App-wide Zustand store for the PCC portal.
 * Handles client-side view routing (since the sandbox only exposes one URL),
 * selected category, language toggle, admin/applicant auth session, and notifications.
 */
import { create } from "zustand";

export type View =
  | { name: "home" }
  | { name: "categories" }
  | { name: "category"; code: string; num: number }
  | { name: "apply"; code: string; num: number }
  | { name: "about" }
  | { name: "news" }
  | { name: "login" }
  | { name: "signup" }
  | { name: "admin" }
  | { name: "applicant-dashboard" }
  | { name: "applicant-application"; id: string };

export type Lang = "en" | "am";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: "super_admin" | "admin" | "applicant";
  phone?: string | null;
  region?: string | null;
}

interface AppState {
  view: View;
  lang: Lang;
  scrollPositions: Record<string, number>;
  session: SessionUser | null;
  unreadCount: number;
  redirectAfterAuth: View | null;

  setView: (v: View) => void;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  setSession: (s: SessionUser | null) => void;
  setUnreadCount: (n: number) => void;
  saveScroll: (key: string, y: number) => void;
  restoreScroll: (key: string) => number | undefined;
}

export const useApp = create<AppState>((set, get) => ({
  view: { name: "home" },
  lang: "en",
  scrollPositions: {},
  session: null,
  unreadCount: 0,
  redirectAfterAuth: null,

  setView: (v) => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });

      // If user tries to apply and is not logged in, redirect to signup
      if (v.name === "apply" && !get().session) {
        set({ redirectAfterAuth: v });
        v = { name: "signup" };
      }

      const hash =
        v.name === "home" ? "" :
        v.name === "categories" ? "#/categories" :
        v.name === "category" ? `#/categories/${v.code}/${v.num}` :
        v.name === "apply" ? `#/apply/${v.code}/${v.num}` :
        v.name === "about" ? "#/about" :
        v.name === "news" ? "#/news" :
        v.name === "login" ? "#/login" :
        v.name === "signup" ? "#/signup" :
        v.name === "admin" ? "#/admin" :
        v.name === "applicant-dashboard" ? "#/dashboard" :
        v.name === "applicant-application" ? `#/application/${v.id}` :
        "";
      if (window.location.hash !== hash) {
        window.history.pushState(null, "", hash || window.location.pathname);
      }
    }
    set({ view: v });
  },
  setLang: (l) => set({ lang: l }),
  toggleLang: () => set((s) => ({ lang: s.lang === "en" ? "am" : "en" })),
  setSession: (s) => set({ session: s }),
  setUnreadCount: (n) => set({ unreadCount: n }),
  saveScroll: (key, y) =>
    set((s) => ({ scrollPositions: { ...s.scrollPositions, [key]: y } })),
  restoreScroll: (key) => get().scrollPositions[key],
}));

/** Initialize view from URL hash on first client render. */
export function initFromHash() {
  if (typeof window === "undefined") return;
  const h = window.location.hash;
  const setView = useApp.getState().setView;
  if (!h || h === "#" || h === "#/") {
    setView({ name: "home" });
    return;
  }
  const parts = h.replace(/^#\/?/, "").split("/");
  if (parts[0] === "categories" && parts.length === 1) {
    setView({ name: "categories" });
  } else if (parts[0] === "categories" && parts.length === 3) {
    setView({ name: "category", code: parts[1], num: Number(parts[2]) });
  } else if (parts[0] === "apply" && parts.length === 3) {
    setView({ name: "apply", code: parts[1], num: Number(parts[2]) });
  } else if (parts[0] === "about") {
    setView({ name: "about" });
  } else if (parts[0] === "news") {
    setView({ name: "news" });
  } else if (parts[0] === "login") {
    setView({ name: "login" });
  } else if (parts[0] === "signup") {
    setView({ name: "signup" });
  } else if (parts[0] === "admin") {
    setView({ name: "admin" });
  } else if (parts[0] === "dashboard") {
    setView({ name: "applicant-dashboard" });
  } else if (parts[0] === "application" && parts[1]) {
    setView({ name: "applicant-application", id: parts[1] });
  } else {
    setView({ name: "home" });
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => initFromHash());
  window.addEventListener("hashchange", () => initFromHash());
}
