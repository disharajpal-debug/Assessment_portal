import { getIndustryMaturityLevel } from "../../../constants/industryMaturity";

export const calculateGlobalMetrics = (assessments) => {
  if (!assessments || assessments.length === 0) {
    return {
      totalAssessments: 0,
      reviewedAssessments: 0,
      averageScore: 0,
      sectorAverages: [],
      bestSector: null,
      lowestSector: null,
      maturityDistribution: [],
      insights: { strengths: [], weaknesses: [], highlights: [], lowlights: [], recommendations: [] }
    };
  }

  // 1. Total and Classifications
  const totalAssessments = assessments.length;
  const reviewedAssessments = assessments.filter((a) => Boolean(a.reviewedAt)).length;
  let sumScore = 0;
  const sectorMap = {};
  
  const maturityCounts = {
    Visionary: 0,
    Accelerator: 0,
    Investor: 0,
    Explorer: 0,
    Beginner: 0,
  };

  const allResponses = [];
  const remarkPool = {
    highlight: {},
    lowlight: {},
    recommendation: {},
  };

  assessments.forEach(asmt => {
    const pc = asmt.score.percentage;
    sumScore += pc;

    // Maturity Classification
    const lvl = getIndustryMaturityLevel(pc).label;
    maturityCounts[lvl] += 1;

    // Sector Grouping
    if (!sectorMap[asmt.sector]) {
      sectorMap[asmt.sector] = { totalScore: 0, count: 0 };
    }
    sectorMap[asmt.sector].totalScore += pc;
    sectorMap[asmt.sector].count += 1;

    // Aggregate Responses for Insights
    if (asmt.responses && Array.isArray(asmt.responses)) {
      allResponses.push(...asmt.responses);
      asmt.responses.forEach((r) => {
        if (r.highlight) {
          const key = `${r.q}::${r.highlight}`;
          remarkPool.highlight[key] = (remarkPool.highlight[key] || 0) + 1;
        }
        if (r.lowlight) {
          const key = `${r.q}::${r.lowlight}`;
          remarkPool.lowlight[key] = (remarkPool.lowlight[key] || 0) + 1;
        }
        if (r.recommendation) {
          const key = `${r.q}::${r.recommendation}`;
          remarkPool.recommendation[key] = (remarkPool.recommendation[key] || 0) + 1;
        }
      });
    }
  });

  // 2. Averages
  const averageScore = Math.round(sumScore / totalAssessments);

  const sectorAverages = Object.keys(sectorMap).map(sector => ({
    name: sector.replace('_', ' '),
    score: Math.round(sectorMap[sector].totalScore / sectorMap[sector].count)
  })).sort((a, b) => b.score - a.score); // Highest first

  const bestSector = sectorAverages[0] || { name: 'N/A', score: 0 };
  const lowestSector = sectorAverages[sectorAverages.length - 1] || { name: 'N/A', score: 0 };

  // 3. Maturity Distribution Array for PieChart
  const maturityDistribution = Object.keys(maturityCounts).map(level => ({
    name: level,
    value: maturityCounts[level]
  })).filter(x => x.value > 0);

  // 4. Strengths & Weaknesses mapped
  const responseFreq = {};
  allResponses.forEach(r => {
    if (!responseFreq[r.q]) {
      responseFreq[r.q] = { sum: 0, count: 0 };
    }
    responseFreq[r.q].sum += r.score;
    responseFreq[r.q].count += 1;
  });

  const responseAverages = Object.keys(responseFreq).map(q => ({
    q,
    avg: responseFreq[q].sum / responseFreq[q].count
  }));

  const strengths = responseAverages.filter(r => r.avg >= 4).sort((a, b) => b.avg - a.avg).slice(0, 5);
  const weaknesses = responseAverages.filter(r => r.avg <= 2).sort((a, b) => a.avg - b.avg).slice(0, 5);

  const toTopRemarks = (poolObj) =>
    Object.entries(poolObj)
      .map(([key, count]) => {
        const [q, text] = key.split("::");
        return { q, text, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

  return {
    totalAssessments,
    reviewedAssessments,
    averageScore,
    sectorAverages,
    bestSector,
    lowestSector,
    maturityDistribution,
    insights: {
      strengths,
      weaknesses,
      highlights: toTopRemarks(remarkPool.highlight),
      lowlights: toTopRemarks(remarkPool.lowlight),
      recommendations: toTopRemarks(remarkPool.recommendation),
    }
  };
};
