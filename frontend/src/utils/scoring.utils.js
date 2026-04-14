/**
 * Scoring Utility for Assessment Portal
 *
 * Implements a maturity-based scoring logic:
 * - Each answered question (non-N/A) has a max possible score of 5.
 * - Obtained score is the sum of selected option scores.
 * - "N/A" questions are completely excluded from the calculation.
 * - Maturity levels are derived from the overall percentage using the industry five-stage model.
 */

import {
  INDUSTRY_MATURITY_LEVELS,
  getIndustryMaturityLevel,
} from "../constants/industryMaturity";

export const MATURITY_LEVELS = INDUSTRY_MATURITY_LEVELS;

export const getMaturityLevel = getIndustryMaturityLevel;

/**
 * Recursively collects all scorable questions from a queston list (handling nested/matrix)
 */
export const collectAllScorableQuestions = (questions) => {
  let all = [];

  questions.forEach(q => {
    if (q?.excludeFromScoring) return;

    // If it has options, it's a scorable unit
    if ((q.options || []).length > 0) {
      all.push(q);
    }
    // If it has children, recurse
    if ((q.children || []).length > 0) {
      all = all.concat(collectAllScorableQuestions(q.children));
    }
  });
  return all;
};

/**
 * Calculates scores for a list of questions based on provided responses
 */
export const calculateMaturityScore = (allQuestions, responses) => {
  const result = {
    total: { obtained: 0, max: 0, percentage: 0 },
    basic: { obtained: 0, max: 0, percentage: 0 },
    functional: { obtained: 0, max: 0, percentage: 0 },
    sector: { obtained: 0, max: 0, percentage: 0 },
    maturityLevel: null
  };

  const scorableQuestions = collectAllScorableQuestions(allQuestions);

  scorableQuestions.forEach(q => {
    const res = responses[q.id];
    const selected = res?.selectedOption;

    // Ignore if not answered OR if N/A
    if (!selected || selected.isNA) return;

    // Ignore if it's a non-scored question (no score property on option)
    if (selected.score === undefined) return;

    const type = q.type || 'basic'; // Default to basic if missing
    const score = selected.score;
    const maxPossible = 5;

    // Update Category Stats
    if (result[type]) {
      result[type].obtained += score;
      result[type].max += maxPossible;
    }

    // Update Global Stats
    result.total.obtained += score;
    result.total.max += maxPossible;
  });

  // Calculate percentages and maturity labels
  ['total', 'basic', 'functional', 'sector'].forEach(key => {
    const cat = result[key];
    cat.percentage = cat.max > 0 ? parseFloat(((cat.obtained / cat.max) * 100).toFixed(2)) : 0;
  });

  result.maturityLevel = getMaturityLevel(result.total.percentage);

  return result;
};
