/**
 * Static data loaders for the directive and license categories.
 * Data is read from JSON files at build/runtime — never hardcoded.
 */
import type { DirectiveMeta, LicenseCategory } from "./types";
import directiveRaw from "./data/directive.json";
import categoriesRaw from "./data/categories.json";

export const directive: DirectiveMeta = directiveRaw as DirectiveMeta;

export const categories: LicenseCategory[] = (
  categoriesRaw as LicenseCategory[]
).map((c) => ({
  ...c,
  // normalize empty equipment to "" (already done in source but be defensive)
  equipment: c.equipment ?? "",
}));

export function getCategoryByCodeAndNum(
  code: string,
  num: number
): LicenseCategory | undefined {
  return categories.find((c) => c.code === code && c.num === num);
}

export function getCategoryByNum(num: number): LicenseCategory | undefined {
  return categories.find((c) => c.num === num);
}

export function getCategoryByCode(code: string): LicenseCategory | undefined {
  // For codes that are unique (most), this is fine.
  // For the levelled telecom categories (75240/75250/75260), returns the first.
  return categories.find((c) => c.code === code);
}

/** Helper: split a verbatim multi-line Amharic requirement text into items. */
export function splitRequirementItems(text: string): string[] {
  if (!text || !text.trim()) return [];
  return text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    // strip leading enumeration like "1." "1)" "ሀ/" "ለ/" "ሐ/" "a)" "1.1" etc.
    .map((l) => l.replace(/^(\d+[.)](\d+[.)])*|[a-zA-Z][.)]|[ሀ-ፐ][/.)]|[-•*]\s+)\s*/, ""))
    .map((l) => l.trim())
    // Filter out pandoc/markdown artifacts left over from the source document
    .filter((l) => {
      if (!l) return false;
      if (/^```/.test(l)) return false;            // code fence
      if (/^\{=html\}$/.test(l)) return false;     // pandoc raw-attr
      if (/^<!--.*-->$/.test(l)) return false;     // HTML comment
      if (/^<!--$/.test(l)) return false;          // dangling open
      if (/^-->$/.test(l)) return false;           // dangling close
      if (/^\*+$/.test(l)) return false;           // stray asterisks
      return true;
    })
    // Unwrap remaining markdown bold/italic markers for display
    .map((l) =>
      l
        .replace(/\*\*(.+?)\*\*/g, "$1")
        .replace(/(?<!\*)\*(?!\s)(.+?)(?<!\s)\*(?!\*)/g, "$1")
    )
    .filter((l) => l.length > 0);
}
