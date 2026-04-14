/**
 * Industry 4.0 maturity labels and styling.
 * Score bands follow the assessment rubric (overall % of max):
 *   Beginner ≤20% | Explorer ≤40% | Investor ≤60% | Accelerator ≤80% | Visionary >80%
 * (equivalently: 0–20, 21–40, 41–60, 61–80, 81–100 when using integer boundaries.)
 */

const LEVEL_META = {
  Visionary: {
    label: "Visionary",
    color: "#1e40af",
    bg: "#dbeafe",
    text: "#1e3a8a",
    summary:
      "One who has created a wholly connected smart factory controlled by one click.",
  },
  Accelerator: {
    label: "Accelerator",
    color: "#2563eb",
    bg: "#eff6ff",
    text: "#1d4ed8",
    summary: "One who has deployed standalone multiple advanced projects.",
  },
  Investor: {
    label: "Investor",
    color: "#3b82f6",
    bg: "#f0f9ff",
    text: "#1e40af",
    summary:
      "One who has invested in one or two full-scale projects using advanced technologies.",
  },
  Explorer: {
    label: "Explorer",
    color: "#0ea5e9",
    bg: "#f0f9ff",
    text: "#0369a1",
    summary:
      "One who has identified and executed one or two pilot projects using advanced technologies.",
  },
  Beginner: {
    label: "Beginner",
    color: "#0284c7",
    bg: "#e0f2fe",
    text: "#0c4a6e",
    summary:
      "One who has just taken the first step towards Industry 4.0 by thinking about it.",
  },
};

/**
 * Ordered high → low for charts / legends.
 */
export const INDUSTRY_MATURITY_LEVELS = [
  LEVEL_META.Visionary,
  LEVEL_META.Accelerator,
  LEVEL_META.Investor,
  LEVEL_META.Explorer,
  LEVEL_META.Beginner,
];

/**
 * @param {number} percentage - Overall obtained ÷ max × 100 (0–100)
 * @returns {typeof INDUSTRY_MATURITY_LEVELS[number]}
 */
export function getIndustryMaturityLevel(percentage) {
  const p = Number(percentage);
  const safe = Number.isFinite(p) ? Math.min(100, Math.max(0, p)) : 0;

  if (safe > 80) return { ...LEVEL_META.Visionary };
  if (safe > 60) return { ...LEVEL_META.Accelerator };
  if (safe > 40) return { ...LEVEL_META.Investor };
  if (safe > 20) return { ...LEVEL_META.Explorer };
  return { ...LEVEL_META.Beginner };
}

export const getMaturityLevel = getIndustryMaturityLevel;

export const MATURITY_LEVELS = INDUSTRY_MATURITY_LEVELS;
