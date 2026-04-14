import React, { useEffect, useMemo } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { getAuth } from '../../../utils/auth';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { calculateReportData } from './Report.utilities';

const Report = () => {
  const location = useLocation();
  const assessmentData = location.state?.responses;
  const sector = location.state?.sector;
  const autoDownload = Boolean(location.state?.autoDownload);
  const user = getAuth();

  const getDashboardRoute = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'client':
        return '/client';
      case 'assessor':
        return '/assessor';
      case 'admin':
        return '/admin';
      case 'superuser':
        return '/superuser';
      default:
        return '/';
    }
  };

  const data = useMemo(() => {
    if (!assessmentData) return null;
    return calculateReportData(assessmentData, sector);
  }, [assessmentData, sector]);

  if (!assessmentData) {
    return <Navigate to="/assessment" />;
  }

  const { scores, sectionQuestionStats, maturity, insights } = data;

  // Chart Data Preparation
  const barData = [
    { name: 'Basic Assessment', score: scores.basic.percentage },
    { name: 'Functional Assessment', score: scores.functional.percentage },
    { name: 'Sector Assessment', score: scores.sector.percentage },
  ];
  const maturityPyramid = [
    {
      label: 'Visionary',
      range: '> 80%',
      description:
        'One who has created a wholly connected smart factory controlled by one click.',
    },
    {
      label: 'Accelerator',
      range: '61% - 80%',
      description:
        'One who has deployed standalone multiple advanced projects.',
    },
    {
      label: 'Investor',
      range: '41% - 60%',
      description:
        'One who has invested in one or two full-scale projects using advanced technologies.',
    },
    {
      label: 'Explorer',
      range: '21% - 40%',
      description:
        'One who has identified and executed one or two pilot projects using advanced technologies.',
    },
    {
      label: 'Beginner',
      range: '< 20%',
      description:
        'One who has just taken the first step towards Industry 4.0 by thinking about it.',
    },
  ];

  useEffect(() => {
    if (!autoDownload) return;
    const timer = setTimeout(() => {
      window.print();
    }, 250);
    return () => clearTimeout(timer);
  }, [autoDownload]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 overflow-x-clip">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 no-print">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Assessment Report
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium uppercase tracking-wide truncate">
              {sector} Industry · Readiness Analysis
            </p>
          </div>
          <Link
            to="/assessment"
            className="inline-flex shrink-0 justify-center text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg transition-all w-full sm:w-auto text-center"
          >
            ← New Assessment
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 min-w-0">
        {/* Maturity Hero Section */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between print-card min-w-0">
            <div>
              <div
                className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
                style={{ backgroundColor: maturity.bg, color: maturity.text }}
              >
                {maturity.label} Level
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-4 break-words">
                Your Digital Maturity is{' '}
                <span style={{ color: maturity.color }}>
                  {scores.total.percentage}%
                </span>
              </h2>
              <p className="text-slate-600 max-w-xl text-base sm:text-lg leading-relaxed">
                Based on your responses across all business functions, your
                organization is currently in the
                <span className="font-bold"> {maturity.label} </span> stage of
                Industry 4.0 transformation.
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-5 gap-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Obtained
                </p>
                <p className="text-2xl font-black text-slate-900">
                  {scores.total.obtained}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Max Possible
                </p>
                <p className="text-2xl font-black text-slate-900">
                  {scores.total.max}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Answered
                </p>
                <p className="text-2xl font-black text-slate-900">
                  {scores.answeredCount}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  N/A Items
                </p>
                <p className="text-2xl font-black text-slate-900">
                  {scores.naCount}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Total Questions
                </p>
                <p className="text-2xl font-black text-slate-900">
                  {scores.answeredCount + scores.naCount}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Combined Category Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm print-card min-w-0">
          <h3 className="text-lg font-bold text-slate-900 mb-2 border-l-4 border-indigo-600 pl-4">
            Category Performance
          </h3>
          <p className="text-sm text-slate-600 mb-6">
            Score is obtained by summing selected option points in each category and comparing against the
            maximum possible points.
          </p>
          <p className="text-xs text-slate-500 mb-6">
            <span className="font-semibold text-slate-700">Total</span> = all questions in that category ·{' '}
            <span className="font-semibold text-slate-700">Answered</span> = questions with a selected response ·{' '}
            <span className="font-semibold text-slate-700">N/A</span> = questions marked as not applicable.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-[240px] sm:h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  layout="vertical"
                  margin={{ left: 20, right: 40 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    width={150}
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Bar
                    dataKey="score"
                    fill="#4f46e5"
                    radius={[0, 4, 4, 0]}
                    barSize={28}
                    label={{
                      position: 'right',
                      fill: '#1e293b',
                      fontSize: 12,
                      fontWeight: 800,
                      formatter: (val) => `${val}%`,
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-5">
              {[
                { key: 'basic', label: 'Basic Assessment' },
                { key: 'functional', label: 'Functional Assessment' },
                { key: 'sector', label: 'Sector Assessment' },
              ].map(({ key, label }) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-slate-700">
                      {label}
                    </span>
                    <span className="text-xs font-black text-slate-900">
                      Score: {scores[key].obtained} / {scores[key].max}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600">
                    Total: {sectionQuestionStats?.[key]?.totalQuestions || 0} · Answered: {sectionQuestionStats?.[key]?.answeredCount || 0} · N/A: {sectionQuestionStats?.[key]?.naCount || 0}
                  </div>
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner p-1">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-1000"
                      style={{ width: `${scores[key].percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print-section">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm print-card min-w-0">
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-l-4 border-indigo-600 pl-4">
              How scoring works
            </h3>
            <div className="space-y-3 text-sm text-slate-700">
              <p className="leading-relaxed">
                For each answered (non N/A) question, we sum the selected option
                scores. Each scored question has a maximum of{' '}
                <span className="font-bold">5</span>.
              </p>
              <p className="leading-relaxed">
                <span className="font-bold">Percentage</span> is calculated as{' '}
                <span className="font-mono font-semibold">
                  obtained ÷ max × 100
                </span>
                .
              </p>
              <p className="leading-relaxed">
                <span className="font-bold">Overall score (out of 5)</span> is
                derived from the overall percentage:{' '}
                <span className="font-mono font-semibold">(% ÷ 100) × 5</span>{' '}
                (range: <span className="font-bold">0.0–5.0</span>).
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm print-card min-w-0">
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-l-4 border-indigo-600 pl-4">
              Maturity bands (industry model)
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              Your overall percentage is mapped to the five-stage Industry 4.0
              readiness model used across the sector: Beginner, Explorer,
              Investor, Accelerator, and Visionary.
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-700">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold">Beginner</span>
                <span className="font-mono">≤ 20%</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold">Explorer</span>
                <span className="font-mono">≤ 40%</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold">Investor</span>
                <span className="font-mono">≤ 60%</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold">Accelerator</span>
                <span className="font-mono">≤ 80%</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold">Visionary</span>
                <span className="font-mono">&gt; 80%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Industry 4.0 maturity pyramid (reference) */}
        <section className="print-section print-card rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
            Industry 4.0 maturity model — Reference
          </h2>
          <p className="text-sm text-slate-600 mb-4 max-w-3xl">
            The triangle below shows all five Industry 4.0 stages. Your score
            dynamically highlights the current stage and maps it to the
            corresponding maturity description (current level:{' '}
            <span className="font-semibold text-slate-800">
              {maturity.label}
            </span>
            ).
          </p>
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 sm:p-6">
            {/* Sketch layout: large triangle (labels only) + five boxed explanations aligned per level */}
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-5">
              <div className="mx-auto w-full max-w-[min(100%,520px)] shrink-0 sm:max-w-[560px] lg:mx-0 lg:min-w-0 lg:flex-1 lg:max-w-none">
                <div
                  className="relative h-[min(90vw,520px)] overflow-hidden border-2 border-slate-300 bg-[#d9d9d9] shadow-md lg:h-full lg:min-h-[580px]"
                  style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}
                >
                  {maturityPyramid.map((level, index) => {
                    const isActive = level.label === maturity.label;
                    const narrowBand = index <= 1;
                    const titleSize = narrowBand
                      ? 'text-[7px] sm:text-[9px]'
                      : 'text-[9px] sm:text-xs';
                    return (
                      <div
                        key={level.label}
                        className="absolute left-0 right-0 flex items-center justify-center border-t border-slate-400/80 px-1.5"
                        style={{
                          top: `${index * 20}%`,
                          height: '20%',
                          backgroundColor: isActive ? '#0a79bd' : 'transparent',
                        }}
                      >
                        <div
                          className={`flex max-h-full w-full max-w-[min(88%,13rem)] flex-col items-center justify-center gap-0.5 text-center leading-tight ${
                            isActive ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {!narrowBand ? (
                            <>
                              <span
                                className={`font-extrabold uppercase tracking-wide ${titleSize}`}
                              >
                                I4.0 {level.label}
                              </span>
                              <span
                                className={`font-semibold normal-case ${titleSize}`}
                              >
                                ({level.range})
                              </span>
                            </>
                          ) : (
                            <>
                              <span
                                className={`font-extrabold uppercase tracking-wide ${titleSize}`}
                              >
                                I4.0
                              </span>
                              <span
                                className={`font-extrabold uppercase tracking-tight ${titleSize}`}
                              >
                                {level.label}
                              </span>
                              <span
                                className={`font-semibold normal-case ${titleSize}`}
                              >
                                ({level.range})
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex min-h-[360px] w-full flex-col gap-1.5 sm:gap-2 lg:min-h-[580px] lg:max-w-[260px] lg:shrink-0 lg:justify-between xl:max-w-[280px]">
                {maturityPyramid.map((level) => {
                  const isActive = level.label === maturity.label;
                  return (
                    <div
                      key={`${level.label}-explain`}
                      className={`flex min-h-0 flex-1 flex-col justify-center break-inside-avoid rounded-md border px-2 py-2 shadow-sm sm:px-2.5 sm:py-2 ${
                        isActive
                          ? 'border-sky-400 bg-sky-50 ring-1 ring-sky-200/80'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <p
                        className={`text-left text-[11px] leading-snug sm:text-xs ${
                          isActive
                            ? 'font-semibold text-sky-950'
                            : 'text-slate-600'
                        }`}
                      >
                        {level.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            The highlighted band indicates your current maturity level.
          </p>
        </section>

        {/* Insights Section */}
        <div className="space-y-6 print-section">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Qualitative Insights
          </h2>
          <p className="text-xs text-slate-500">
            These insights become visible and meaningful after an assessor has
            reviewed the assessment and recorded professional highlights, gaps,
            and recommendations.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Highlights */}
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 print-card">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-emerald-900 font-bold uppercase tracking-widest text-xs">
                  Highlights
                </h4>
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  ✓
                </div>
              </div>
              <div className="space-y-4">
                {insights.highlights.length > 0 ? (
                  insights.highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white/60 p-3 rounded-lg border border-emerald-100 shadow-sm"
                    >
                      <p className="text-[10px] text-emerald-600 font-bold uppercase mb-1">
                        {item.q}
                      </p>
                      <p className="text-emerald-950 font-medium text-sm leading-snug">
                        {item.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-emerald-600 text-sm italic">
                    No highlights recorded yet.
                  </p>
                )}
              </div>
            </div>

            {/* Lowlights */}
            <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100 print-card">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-rose-900 font-bold uppercase tracking-widest text-xs">
                  Critical Gaps
                </h4>
                <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                  !
                </div>
              </div>
              <div className="space-y-4">
                {insights.lowlights.length > 0 ? (
                  insights.lowlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white/60 p-3 rounded-lg border border-rose-100 shadow-sm"
                    >
                      <p className="text-[10px] text-rose-600 font-bold uppercase mb-1">
                        {item.q}
                      </p>
                      <p className="text-rose-950 font-medium text-sm leading-snug">
                        {item.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-rose-600 text-sm italic">
                    No critical gaps recorded yet.
                  </p>
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 print-card">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-indigo-900 font-bold uppercase tracking-widest text-xs">
                  Recommendations
                </h4>
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  💡
                </div>
              </div>
              <div className="space-y-4">
                {insights.recommendations.length > 0 ? (
                  insights.recommendations.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white/60 p-3 rounded-lg border border-indigo-100 shadow-sm"
                    >
                      <p className="text-[10px] text-indigo-600 font-bold uppercase mb-1">
                        {item.q}
                      </p>
                      <p className="text-indigo-950 font-medium text-sm leading-snug">
                        {item.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-indigo-600 text-sm italic">
                    No specific recommendations yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-center pt-8 border-t border-slate-200 gap-4 no-print">
          <button
            onClick={() => window.print()}
            className="bg-white text-slate-800 font-bold px-8 py-3 rounded-xl border-2 border-slate-200 shadow-lg hover:bg-slate-50 transition-all active:scale-95"
          >
            Download PDF Report
          </button>
          <Link
            to={getDashboardRoute()}
            className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Report;
