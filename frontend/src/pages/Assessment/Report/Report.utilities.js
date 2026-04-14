import { getAllQuestions } from "../questions";
import {
  INDUSTRY_MATURITY_LEVELS,
  getIndustryMaturityLevel,
} from "../../../constants/industryMaturity";

export const MATURITY_LEVELS = INDUSTRY_MATURITY_LEVELS;

export const getMaturityLevel = getIndustryMaturityLevel;

/**
 * Collects all scorable questions recursively
 */
const collectQuestions = (qs) => {
  let all = [];
  qs.forEach(q => {
    if ((q.options || []).length > 0) all.push(q);
    if ((q.children || []).length > 0) all = all.concat(collectQuestions(q.children));
  });
  return all;
};

const HIDDEN_PREFIX = "[HIDDEN]";
const decodeInsightField = (rawValue) => {
  const raw = String(rawValue || "");
  if (!raw) return { text: "", include: true };
  if (raw.startsWith(HIDDEN_PREFIX)) {
    return { text: raw.slice(HIDDEN_PREFIX.length).trim(), include: false };
  }
  return { text: raw, include: true };
};

const normalizeResponsesInput = ({ responsesInput, sector }) => {
  // UI shape (in-memory): { [qid]: { selectedOption: { text, score, isNA }, ... } }
  if (responsesInput && !Array.isArray(responsesInput) && typeof responsesInput === "object") {
    return responsesInput;
  }

  // Backend shape: [{ question_id, selected_option, highlight, lowlight, recommendation }]
  const backendRows = Array.isArray(responsesInput) ? responsesInput : [];

  const questionsTree = getAllQuestions(sector);
  const flatQuestions = collectQuestions(questionsTree);

  const optByQidText = {};
  flatQuestions.forEach((q) => {
    const qid = String(q.id);
    if (Array.isArray(q.options)) {
      optByQidText[qid] = {};
      q.options.forEach((opt) => {
        if (opt && typeof opt.text === "string") optByQidText[qid][opt.text] = opt;
      });
    }
  });

  const out = {};
  backendRows.forEach((r) => {
    const qid = r?.question_id ?? r?.questionId;
    const selectedText = r?.selected_option ?? r?.selectedOption;
    if (qid == null) return;

    const qidStr = String(qid);
    const rawSelected = typeof selectedText === "string" ? selectedText : "";
    const selectedParts = rawSelected
      .split("||")
      .map((s) => s.trim())
      .filter(Boolean);
    const firstSelected = selectedParts[0] || "";

    // Keep report rows even if option text no longer matches current catalog.
    const fallbackOpt = firstSelected
      ? { text: firstSelected, isNA: firstSelected === "N/A" }
      : null;
    const opt =
      (firstSelected ? optByQidText?.[qidStr]?.[firstSelected] : null) || fallbackOpt;
    const selectedOptions = selectedParts
      .map((text) => optByQidText?.[qidStr]?.[text] || { text, isNA: text === "N/A" });

    out[qidStr] = {
      selectedOption: opt,
      selectedOptions,
      ...(() => {
        const h = decodeInsightField(r?.highlight);
        const l = decodeInsightField(r?.lowlight);
        const rec = decodeInsightField(r?.recommendation);
        return {
          highlight: h.text,
          lowlight: l.text,
          recommendation: rec.text,
          includeHighlight: h.include,
          includeLowlight: l.include,
          includeRecommendation: rec.include,
        };
      })(),
    };
  });

  return out;
};

/**
 * Main scoring function for the report
 */
export const calculateReportData = (responses, sector) => {
  const responseMap = normalizeResponsesInput({ responsesInput: responses, sector });
  const allQs = collectQuestions(getAllQuestions(sector));
  const sectionQuestionStats = {
    basic: { totalQuestions: 0, answeredCount: 0, naCount: 0 },
    functional: { totalQuestions: 0, answeredCount: 0, naCount: 0 },
    sector: { totalQuestions: 0, answeredCount: 0, naCount: 0 },
  };

  const scores = {
    total: { obtained: 0, max: 0, percentage: 0 },
    basic: { obtained: 0, max: 0, percentage: 0 },
    functional: { obtained: 0, max: 0, percentage: 0 },
    sector: { obtained: 0, max: 0, percentage: 0 },
    answeredCount: 0,
    naCount: 0
  };

  const insights = {
    highlights: [],
    lowlights: [],
    recommendations: []
  };

  allQs.forEach(q => {
    const type = q.type || 'basic';
    if (sectionQuestionStats[type]) {
      sectionQuestionStats[type].totalQuestions += 1;
    }

    const res = responseMap[String(q.id)];
    if (!res) return;

    if (res.highlight && res.includeHighlight !== false) {
      insights.highlights.push({ q: q.text, text: res.highlight });
    }
    if (res.lowlight && res.includeLowlight !== false) {
      insights.lowlights.push({ q: q.text, text: res.lowlight });
    }
    if (res.recommendation && res.includeRecommendation !== false) {
      insights.recommendations.push({ q: q.text, text: res.recommendation });
    }

    if (!res.selectedOption) return;

    if (res.selectedOption.isNA) {
      scores.naCount++;
      if (sectionQuestionStats[type]) {
        sectionQuestionStats[type].naCount += 1;
      }
      return;
    }

    if (sectionQuestionStats[type]) {
      sectionQuestionStats[type].answeredCount += 1;
    }
    
    // Skip if this question has no scoring logic
    if (res.selectedOption.score === undefined) return;

    const score = res.selectedOption.score;
    
    scores.answeredCount++;
    scores.total.obtained += score;
    scores.total.max += 5;

    if (scores[type]) {
      scores[type].obtained += score;
      scores[type].max += 5;
    }

  });

  // Final Calculations
  ['total', 'basic', 'functional', 'sector'].forEach(key => {
    const s = scores[key];
    s.percentage = s.max > 0 ? parseFloat(((s.obtained / s.max) * 100).toFixed(1)) : 0;
  });

  return {
    scores,
    sectionQuestionStats,
    maturity: getMaturityLevel(scores.total.percentage),
    insights
  };
};
