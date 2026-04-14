import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, AlertCircle, Printer } from 'lucide-react';
import { getStatusColor, formatDate } from '../AssessorDashboard.utilities';
import { assessmentService } from '../../../services/assessmentService';
import { getAllQuestions } from '../../Assessment/questions';
import QuestionRenderer from '../../Assessment/QuestionRenderer/QuestionRenderer.component';
import { calculateMaturityScore, collectAllScorableQuestions } from '../../../utils/scoring.utils';
import { startAssessmentStyles as styles } from '../../Assessment/StartAssessment/StartAssessment.style';
import AssessmentProgressPanel from '../../Assessment/StartAssessment/AssessmentProgressPanel';

const MULTI_SELECT_QUESTION_IDS = new Set(['4', 'B04']);
const HIDDEN_PREFIX = '[HIDDEN]';
const isMultiSelectQuestion = (question) =>
  Boolean(question) && question.type === 'basic' && MULTI_SELECT_QUESTION_IDS.has(String(question.id));
const hasSelection = (question, response) => {
  if (!response) return false;
  if (isMultiSelectQuestion(question)) return (response.selectedOptions || []).length > 0;
  return Boolean(response.selectedOption);
};
const decodeInsightField = (rawValue) => {
  const raw = String(rawValue || '');
  if (!raw) return { text: '', include: true };
  if (raw.startsWith(HIDDEN_PREFIX)) {
    return { text: raw.slice(HIDDEN_PREFIX.length).trim(), include: false };
  }
  return { text: raw, include: true };
};
const encodeInsightField = (value, include) => {
  const text = String(value || '').trim();
  if (!text) return '';
  return include === false ? `${HIDDEN_PREFIX}${text}` : text;
};

const EditAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [assessment, setAssessment] = useState(null);
  const [responses, setResponses] = useState({});

  const sector = assessment?.sector;
  const questions = useMemo(() => (sector ? getAllQuestions(sector) : []), [sector]);
  const numberedRootQuestions = useMemo(() => {
    const roots = questions || [];
    return roots.map((q, idx) => ({ ...q, _displayNumber: String(idx + 1) }));
  }, [questions]);
  const scorableQuestions = useMemo(
    () => collectAllScorableQuestions(questions || []),
    [questions],
  );

  const checkAttempted = (question, currentResponses) => {
    if (question.children && question.children.length > 0) {
      return question.children.every((c) => checkAttempted(c, currentResponses));
    }
    return hasSelection(question, currentResponses[String(question.id)] || currentResponses[question.id]);
  };

  const checkNA = (question, currentResponses) => {
    if (question.children && question.children.length > 0) {
      return question.children.every((c) => checkNA(c, currentResponses));
    }
    const response = currentResponses[String(question.id)] || currentResponses[question.id];
    if (isMultiSelectQuestion(question)) {
      return Boolean((response?.selectedOptions || []).some((opt) => opt?.isNA));
    }
    return response?.selectedOption?.isNA;
  };

  const buildOptionIndex = (qs) => {
    const flat = [];
    const walk = (nodes) => {
      (nodes || []).forEach((q) => {
        flat.push(q);
        if (q.children && q.children.length > 0) walk(q.children);
      });
    };
    walk(qs);
    const optByQidText = {};
    flat.forEach((q) => {
      const qid = String(q.id);
      if (Array.isArray(q.options) && q.options.length > 0) {
        optByQidText[qid] = {};
        q.options.forEach((opt) => {
          if (opt && typeof opt.text === 'string') optByQidText[qid][opt.text] = opt;
        });
      }
    });
    return optByQidText;
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await assessmentService.getAssessmentForReview(id);
        const asmt = res.data;
        if (cancelled) return;
        setAssessment(asmt);

        const qs = getAllQuestions(asmt.sector);
        const optByQidText = buildOptionIndex(qs);

        const map = {};
        const rows = asmt.responses_out || [];
        rows.forEach((r) => {
          const qid = String(r.question_id);
          const selectedText = r.selected_option;
          const h = decodeInsightField(r.highlight);
          const l = decodeInsightField(r.lowlight);
          const rec = decodeInsightField(r.recommendation);
          if (MULTI_SELECT_QUESTION_IDS.has(qid)) {
            const selectedOptions = String(selectedText || '')
              .split('||')
              .map((s) => s.trim())
              .filter(Boolean)
              .map((text) => optByQidText?.[qid]?.[text] || { text });
            map[qid] = {
              selectedOptions,
              selectedOption: selectedOptions[0] || null,
              highlight: h.text,
              lowlight: l.text,
              recommendation: rec.text,
              includeHighlight: h.include,
              includeLowlight: l.include,
              includeRecommendation: rec.include,
            };
            return;
          }
          const opt = optByQidText?.[qid]?.[selectedText] || { text: selectedText };
          map[qid] = {
            selectedOption: opt,
            highlight: h.text,
            lowlight: l.text,
            recommendation: rec.text,
            includeHighlight: h.include,
            includeLowlight: l.include,
            includeRecommendation: rec.include,
          };
        });
        setResponses(map);
      } catch (err) {
        setError(err?.response?.data?.detail || err?.message || 'Failed to load assessment for review.');
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const collectDescendantQuestionIds = (question) => {
    const ids = [];
    for (const child of question.children || []) {
      ids.push(String(child.id), ...collectDescendantQuestionIds(child));
    }
    return ids;
  };

  const handleAnswer = (questionId, option, question) => {
    setResponses((prev) => {
      const next = { ...prev };
      const descendantIds = collectDescendantQuestionIds(question);
      descendantIds.forEach((qid) => {
        delete next[qid];
      });

      const qid = String(questionId);
      const prevResponse = prev[qid] || {};
      if (isMultiSelectQuestion(question)) {
        const currentSelected = Array.isArray(prevResponse.selectedOptions)
          ? prevResponse.selectedOptions
          : prevResponse.selectedOption
            ? [prevResponse.selectedOption]
            : [];

        const optionText = option?.text;
        let updated = currentSelected;
        if (!optionText) {
          updated = [];
        } else if (option?.isNA) {
          updated = [option];
        } else if (currentSelected.some((opt) => opt?.text === optionText)) {
          updated = currentSelected.filter((opt) => opt?.text !== optionText);
        } else {
          updated = [...currentSelected.filter((opt) => !opt?.isNA), option];
        }

        next[qid] = {
          ...prevResponse,
          selectedOptions: updated,
          selectedOption: updated[0] || null,
        };
        return next;
      }

      next[qid] = {
        ...prevResponse,
        selectedOption: option,
        otherText: option?.isOther ? option.value : prevResponse?.otherText,
      };
      return next;
    });
  };

  const handleRemarkChange = (questionId, field, value) => {
    const qid = String(questionId);
    setResponses((prev) => ({
      ...prev,
      [qid]: {
        ...prev[qid],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    if (!assessment) return;
    setSaving(true);
    setError('');
    setSaveMessage('');
    try {
      const scoreSummary = calculateMaturityScore(questions, responses);
      const payload = {
        sector: assessment.sector,
        score: scoreSummary.total.percentage,
        status: 'submitted',
        responses: Object.entries(responses).map(([qid, res]) => ({
          question_id: qid,
          selected_option: MULTI_SELECT_QUESTION_IDS.has(String(qid))
            ? (res.selectedOptions || []).map((opt) => opt?.text).filter(Boolean).join('||')
            : res.selectedOption?.text,
          highlight: encodeInsightField(res.highlight, res.includeHighlight),
          lowlight: encodeInsightField(res.lowlight, res.includeLowlight),
          recommendation: encodeInsightField(res.recommendation, res.includeRecommendation),
        })),
      };
      const res = await assessmentService.reviewAssessment(assessment.id, payload);
      const reviewed = res?.data || {};
      setAssessment((prev) => ({
        ...(prev || {}),
        ...reviewed,
      }));
      setSaveMessage('Changes saved successfully. Redirecting to updated report...');

      navigate('/report', {
        state: {
          responses: reviewed.responses_out || payload.responses || [],
          sector: reviewed.sector || assessment.sector,
          autoDownload: false,
        },
      });
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to save review.');
    } finally {
      setSaving(false);
    }
  };

  const handlePrintReport = () => {
    if (!assessment) return;
    navigate('/report', {
      state: {
        responses,
        sector: assessment.sector,
        autoDownload: true,
      },
    });
  };

  const scorePreviewSummary = calculateMaturityScore(questions, responses);
  const attemptedCount = questions.filter((q) => checkAttempted(q, responses)).length;
  const naCount = questions.filter((q) => checkNA(q, responses)).length;
  const isComplete = useMemo(() => {
    if (!scorableQuestions.length) return false;
    return scorableQuestions.every((q) => hasSelection(q, responses[String(q.id)] || responses[q.id]));
  }, [scorableQuestions, responses]);

  const handleQuestionJump = (idx) => {
    const target = document.getElementById(`question-${idx}`);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="assessor-shell min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1400px] space-y-6">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate('/assessor')}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          {loading ? (
            <div className="text-slate-500">Loading assessment…</div>
          ) : assessment ? (
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">#{assessment.id}</p>
                <h1 className="text-2xl font-bold text-slate-900">{assessment.client_name || `Client #${assessment.user}`}</h1>
                <p className="text-slate-500">
                  {assessment.sector} Sector · Created {formatDate(assessment.created_at)}
                </p>
                {assessment.reviewed_at && (
                  <p className="text-xs text-slate-400 mt-1">
                    Last reviewed: {formatDate(assessment.reviewed_at)}
                  </p>
                )}
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ring-1 ring-inset ${getStatusColor(assessment.status === 'submitted' ? 'Submitted' : 'In Progress')}`}>
                {assessment.status === 'submitted' ? 'Submitted' : 'In Progress'}
              </div>
            </div>
          ) : (
            <div className="text-rose-600 font-semibold">{error || 'Assessment not found.'}</div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white shadow-sm min-h-[400px]">
            <div className="p-6">
            {error && (
              <div className="mb-4 text-sm text-rose-600 font-semibold bg-rose-50 border border-rose-200 rounded-xl p-3">
                {error}
              </div>
            )}
            {saveMessage && (
              <div className="mb-4 text-sm text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                {saveMessage}
              </div>
            )}

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <AlertCircle className="w-5 h-5 text-blue-500" />
              <p className="text-slate-600">
                Reviewing the client’s submitted responses. You can adjust answers and add remarks (highlight/lowlight/recommendation) per question. You can reassess this assessment multiple times; each save updates the latest report.
              </p>
            </div>

              {assessment && (
                <div className="space-y-4">
                  {numberedRootQuestions.map((q, idx) => (
                    <div id={`question-${idx}`} key={q.id}>
                      <QuestionRenderer
                        question={q}
                        responses={responses}
                        onAnswer={handleAnswer}
                        onRemarkChange={handleRemarkChange}
                        isEditable={true}
                        displayNumber={q._displayNumber}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={handlePrintReport}
                  disabled={!assessment}
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60"
                >
                  <Printer className="h-4 w-4" />
                  Print Report
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !assessment}
                  className="flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>

          {assessment && (
            <aside className={styles.sidebar} aria-label="Assessment progress">
              <AssessmentProgressPanel
                styles={styles}
                filteredQuestions={questions}
                responses={responses}
                userSector={assessment.sector}
                getScoreSummary={() => calculateMaturityScore(questions, responses)}
                scorePreviewSummary={scorePreviewSummary}
                attemptedCount={attemptedCount}
                naCount={naCount}
                checkAttempted={checkAttempted}
                checkNA={checkNA}
                status="draft"
                submitting={saving}
                isComplete={isComplete}
                handleSubmit={handleSave}
                handleSaveDraft={handleSave}
                navigate={navigate}
                onQuestionJump={handleQuestionJump}
              />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditAssessment;
