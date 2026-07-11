/**
 * Types for the PCC Professional Competence Certificate portal.
 * These mirror the JSON data shape published in the directive.
 */

export interface LicenseCategory {
  num: number;
  code: string;
  title_am: string;
  title_en: string;
  description: string;
  personnel: string;
  facility: string;
  equipment: string;
  documents: string;
  licensing_condition?: string;
}

export interface DirectiveMeta {
  directive_title_am: string;
  directive_title_en: string;
  directive_number: string;
  issuing_authority: string;
  legal_basis: string;
  purpose_en: string;
  scope_en: string;
  certification_rules_en: string[];
  validity_period_en: string;
  renewal_en: string;
  penalties_en: string;
  repealed_directives_en: string;
  amendment_en: string;
  effective_date_en: string;
  signatory: string;
  total_business_categories: number;
  standard_application_documents_note_en: string;
  standard_required_documents_en: string[];
}

/** Activity-type grouping used by the directory view. */
export type ActivityGroupKey =
  | "manufacturing"
  | "wholesale"
  | "retail"
  | "repair"
  | "import"
  | "export"
  | "postal_courier"
  | "telecom_services"
  | "computer_software"
  | "ict_consulting";

export interface ActivityGroup {
  key: ActivityGroupKey;
  label_en: string;
  label_am: string;
  /** code prefix or set of code prefixes that belong to this group */
  codes: string[];
  icon: string;
}

export const activityGroups: ActivityGroup[] = [
  {
    key: "manufacturing",
    label_en: "Manufacturing",
    label_am: "ማምረት",
    codes: ["39121", "39122", "39123", "39129"],
    icon: "Factory",
  },
  {
    key: "wholesale",
    label_en: "Wholesale",
    label_am: "የአሳይ ስርጭት",
    codes: ["61521", "61522", "61523", "61524", "61529"],
    icon: "Package",
  },
  {
    key: "retail",
    label_en: "Retail",
    label_am: "ችርቻሮ",
    codes: ["62801", "62802", "62803", "62804", "62809"],
    icon: "ShoppingBag",
  },
  {
    key: "repair",
    label_en: "Repair",
    label_am: "ጥገና",
    codes: ["63154"],
    icon: "Wrench",
  },
  {
    key: "import",
    label_en: "Import",
    label_am: "ኢምፖርት",
    codes: ["65521", "65522", "65523", "65524", "65529"],
    icon: "Ship",
  },
  {
    key: "export",
    label_en: "Export",
    label_am: "ኤክስፖርት",
    codes: ["66421", "66422", "66423", "66429"],
    icon: "Plane",
  },
  {
    key: "postal_courier",
    label_en: "Postal & Courier",
    label_am: "የደብዳቄ እና ኮሪዬር አገልግሎት",
    codes: ["75110", "75120", "75190"],
    icon: "Mail",
  },
  {
    key: "telecom_services",
    label_en: "Telecom Services",
    label_am: "የቴሌኮሙኒኬሽን አገልግሎቶች",
    codes: ["75200", "75210", "75220", "75230", "75240", "75250", "75260", "75270"],
    icon: "Radio",
  },
  {
    key: "computer_software",
    label_en: "Computer/Software Services",
    label_am: "የኮምፒውተር/ሶፍትዌር አገልግሎቶች",
    codes: ["86100", "86200", "86300", "86400", "86500", "86900"],
    icon: "Code",
  },
  {
    key: "ict_consulting",
    label_en: "ICT Consulting",
    label_am: "የአይሲቲ ምክር",
    codes: ["88740"],
    icon: "Lightbulb",
  },
];

export function getGroupForCategory(code: string, num: number): ActivityGroup | null {
  // Special case: 75240 / 75250 / 75260 each have two levels with same code, both fall in telecom_services
  return (
    activityGroups.find((g) => g.codes.includes(code)) || null
  );
}

export function isMonopolyCategory(c: LicenseCategory): boolean {
  return Boolean(c.licensing_condition && c.licensing_condition.trim().length > 0);
}
