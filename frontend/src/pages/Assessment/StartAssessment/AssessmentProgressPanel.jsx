import React from "react";

/**
 * Shared progress sidebar for desktop and slide-over drawer on small screens.
 * `onQuestionJump(idx)` should scroll to #question-{idx} (and close drawer on mobile if needed).
 */
const AssessmentProgressPanel = ({
  styles,
  filteredQuestions,
  responses,
  userSector,
  getScoreSummary,
  scorePreviewSummary,
  attemptedCount,
  naCount,
  checkAttempted,
  checkNA,
  status,
  submitting,
  isComplete,
  handleSubmit,
  handleSaveDraft,
  navigate,
  onQuestionJump,
  showInnerHeader = true,
  rootClassName = "",
}) => {
  const summary = getScoreSummary();
  const completionPct =
    filteredQuestions.length > 0
      ? Math.min(100, Math.round((attemptedCount / filteredQuestions.length) * 100))
      : 0;

  return (
    <div className={`${styles.summaryCard} ${rootClassName}`.trim()}>
      {showInnerHeader && (
        <div className={styles.summaryHeader}>
          <h2 className={styles.summaryTitle}>Assessment Progress</h2>
          <p className="mt-1 text-xs font-medium text-slate-500">Track completion and jump to any question.</p>
        </div>
      )}

      <div className={styles.summaryScroll}>
        <div className="rounded-xl border border-indigo-100/80 bg-gradient-to-br from-white to-indigo-50/30 p-4 shadow-sm ring-1 ring-indigo-50">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wide text-indigo-900/70">
              Completion
            </span>
            <span className="text-sm font-extrabold tabular-nums text-indigo-700">{completionPct}%</span>
          </div>
          <div
            className="h-2.5 overflow-hidden rounded-full bg-slate-200/90 ring-1 ring-slate-200/80"
            role="progressbar"
            aria-valuenow={completionPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${completionPct} percent of questions attempted`}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600 shadow-inner transition-[width] duration-500 ease-out"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <p className="mt-2 text-[10px] font-medium text-slate-500">
            {attemptedCount} of {filteredQuestions.length} questions with a selected answer
          </p>
        </div>

        <div className={styles.summaryStatGrid}>
          <div className={styles.summaryStatBox}>
            <p className={styles.summaryStatLabel}>Obtained Score</p>
            <p className={styles.summaryStatValue}>
              {summary.total.obtained}{" "}
              <span className="text-[10px] text-slate-400">/ {summary.total.max}</span>
            </p>
          </div>
          <div className={styles.summaryStatBox}>
            <p className={styles.summaryStatLabel}>Maturity Level</p>
            <p className={styles.summaryStatValue} style={{ color: scorePreviewSummary.maturityLevel.color }}>
              {scorePreviewSummary.maturityLevel.label}
            </p>
          </div>
          <div className={styles.summaryStatBox}>
            <p className={styles.summaryStatLabel}>Attempted</p>
            <p className={styles.summaryStatValue}>
              {attemptedCount} <span className="text-[10px] text-slate-400">/ {filteredQuestions.length}</span>
            </p>
          </div>
          <div className={styles.summaryStatBox}>
            <p className={styles.summaryStatLabel}>N/A Questions</p>
            <p className={styles.summaryStatValue}>{naCount}</p>
          </div>
        </div>

        <div className="mb-6 space-y-3 rounded-xl border border-slate-100 bg-gradient-to-b from-slate-50/90 to-white p-4 shadow-inner ring-1 ring-slate-100/80">
          <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-900/40">
            Score breakdown (points)
          </p>
          {["basic", "functional", "sector"].map((cat) => {
            const stats = scorePreviewSummary[cat];
            if (stats.max === 0) return null;
            return (
              <div key={cat} className="flex items-center justify-between">
                <span className="text-xs font-medium capitalize text-slate-600">{cat} Area</span>
                <span className="text-xs font-bold text-slate-900">
                  {stats.obtained} / {stats.max}
                </span>
              </div>
            );
          })}
        </div>

        {["basic", "functional", "sector"].map((type) => {
          const sectionQuestions = filteredQuestions.filter((q) => q.type === type);
          if (sectionQuestions.length === 0) return null;

          return (
            <div key={type} className={styles.summarySection}>
              <p className={styles.summarySectionTitle}>
                {type === "sector" ? userSector || "Sector" : type}
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-normal lowercase text-slate-500">
                  {sectionQuestions.length} items
                </span>
              </p>

              {type === "functional" ? (
                <div className="space-y-4">
                  {Array.from(new Set(sectionQuestions.map((q) => q.area))).map((area) => {
                    const areaQuestions = sectionQuestions.filter((q) => q.area === area);
                    return (
                      <div key={area} className={styles.summaryAreaItem}>
                        <p className={styles.summaryAreaTitle}>{area}</p>
                        <div className={styles.summaryGrid}>
                          {areaQuestions.map((q) => {
                            const idx = filteredQuestions.indexOf(q);
                            const isAttempted = checkAttempted(q, responses);
                            const isNA = checkNA(q, responses);
                            return (
                              <button
                                key={q.id}
                                type="button"
                                onClick={() => onQuestionJump(idx)}
                                className={`${styles.summaryDot} ${
                                  isNA ? styles.summaryDotNA : isAttempted ? styles.summaryDotAttempted : styles.summaryDotEmpty
                                }`}
                              >
                                {idx + 1}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={styles.summaryGrid}>
                  {sectionQuestions.map((q) => {
                    const idx = filteredQuestions.indexOf(q);
                    const isAttempted = checkAttempted(q, responses);
                    const isNA = checkNA(q, responses);
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => onQuestionJump(idx)}
                        className={`${styles.summaryDot} ${
                          isNA ? styles.summaryDotNA : isAttempted ? styles.summaryDotAttempted : styles.summaryDotEmpty
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.summaryFooter}>
        <button
          type="button"
          onClick={
            status === "submitted"
              ? () => navigate("/report", { state: { responses, sector: userSector } })
              : isComplete
                ? handleSubmit
                : handleSaveDraft
          }
          disabled={submitting}
          className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/40 active:scale-[0.98] disabled:opacity-50"
        >
          {submitting
            ? "Saving..."
            : status === "submitted"
              ? "View Detailed Report"
              : isComplete
                ? "Submit assessment"
                : "Save assessment"}
        </button>
      </div>
    </div>
  );
};

export default AssessmentProgressPanel;
