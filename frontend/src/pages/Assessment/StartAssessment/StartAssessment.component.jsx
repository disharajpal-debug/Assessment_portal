import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MoreVertical, X } from 'lucide-react';
import QuestionRenderer from '../QuestionRenderer/QuestionRenderer.component';
import { getAllQuestions } from '../questions';
import { getAuth } from '../../../utils/auth';
import { ROLES } from '../../../constants/roles';
import { calculateMaturityScore, collectAllScorableQuestions } from '../../../utils/scoring.utils';
import { assessmentService } from '../../../services/assessmentService';
import { startAssessmentStyles as styles } from './StartAssessment.style';
import AssessmentProgressPanel from './AssessmentProgressPanel';

const collectDescendantQuestionIds = (question) => {
  const ids = [];
  for (const child of question.children || []) {
    ids.push(child.id, ...collectDescendantQuestionIds(child));
  }
  return ids;
};

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

const checkAttempted = (question, responses) => {
  if (question.children && question.children.length > 0) {
    return question.children.every(c => checkAttempted(c, responses));
  }
  return hasSelection(question, responses[question.id]);
};

const checkNA = (question, responses) => {
  if (question.children && question.children.length > 0) {
    return question.children.every(c => checkNA(c, responses));
  }
  const response = responses[question.id];
  if (isMultiSelectQuestion(question)) {
    return Boolean((response?.selectedOptions || []).some((opt) => opt?.isNA));
  }
  return response?.selectedOption?.isNA;
};

const StartAssessment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getAuth();

  if (!user) {
    return (
      <div className={styles.guestRoot}>
        <div className={styles.guestCard}>
          <div className={styles.guestIconWrap}>
            <svg
              className={styles.guestIcon}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className={styles.guestTitle}>Sign in required</h1>
          <p className={styles.guestText}>
            You need an account to complete this assessment.
          </p>
          <Link to="/" className={styles.guestLink}>
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  const clientData = location.state?.clientData;
  const userSector = location.state?.sector || user.sector;
  const editAssessmentId = location.state?.assessmentId;
  const draftClientId = location.state?.clientId;
  const draftSessionKey = location.state?.sessionKey;
  const userRole = user.role;

  const [responses, setResponses] = useState({});
  const [status, setStatus] = useState('draft');
  const [submitting, setSubmitting] = useState(false);
  const [currentAssessmentId, setCurrentAssessmentId] = useState(editAssessmentId || null);
  const [popup, setPopup] = useState({ open: false, type: 'info', message: '' });
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [mobileProgressOpen, setMobileProgressOpen] = useState(false);
  const assessmentIdRef = useRef(currentAssessmentId);
  const draftCreatePromiseRef = useRef(null);

  useEffect(() => {
    assessmentIdRef.current = currentAssessmentId;
  }, [currentAssessmentId]);

  const showPopup = useCallback((message, type = 'info') => {
    setPopup({ open: true, type, message: String(message || '') });
  }, []);

  const filteredQuestions = getAllQuestions(userSector);
  const numberedRootQuestions = useMemo(() => {
    const roots = filteredQuestions || [];
    // Display numbering is purely UI-based and always ascending from 1.
    // Types (basic/functional/sector) remain unchanged and drive grouping.
    return roots.map((q, idx) => ({ ...q, _displayNumber: String(idx + 1) }));
  }, [filteredQuestions]);

  const isEditable =
    status === 'draft' ||
    userRole === ROLES.ASSESSOR ||
    userRole === ROLES.ADMIN ||
    userRole === ROLES.SUPERUSER;

  const handleAnswer = useCallback(
    (questionId, option, question) => {
      if (!isEditable) return;

      setResponses((prev) => {
        const next = { ...prev };
        const descendantIds = collectDescendantQuestionIds(question);
        descendantIds.forEach((id) => {
          delete next[id];
        });

        const prevResponse = prev[questionId] || {};
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

          next[questionId] = {
            ...prevResponse,
            selectedOptions: updated,
            selectedOption: updated[0] || null,
          };
          return next;
        }

        next[questionId] = {
          ...prevResponse,
          selectedOption: option,
          otherText: option?.isOther ? option.value : prevResponse?.otherText,
        };

        return next;
      });
    },
    [isEditable],
  );

  const handleRemarkChange = (questionId, field, value) => {
    if (!isEditable) return;

    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [field]: value,
      },
    }));
  };

  const getScoreSummary = () => {
    return calculateMaturityScore(filteredQuestions, responses);
  };

  const scorableQuestions = useMemo(
    () => collectAllScorableQuestions(filteredQuestions || []),
    [filteredQuestions],
  );

  const isComplete = useMemo(() => {
    if (!scorableQuestions.length) return false;
    return scorableQuestions.every((q) => {
      return hasSelection(q, responses?.[q.id]); // counts both answered and N/A as complete for flow
    });
  }, [scorableQuestions, responses]);

  /** Ensures a draft row exists on the server (assessor: linked to client_id; client: own user). */
  const ensureAssessmentDraft = useCallback(async () => {
    if (editAssessmentId) {
      return editAssessmentId;
    }
    if (assessmentIdRef.current) {
      return assessmentIdRef.current;
    }

    const storageKey = draftSessionKey ? `ap-draft-${draftSessionKey}` : null;
    if (storageKey) {
      const existing = sessionStorage.getItem(storageKey);
      if (existing) {
        const id = Number(existing);
        if (!Number.isNaN(id)) {
          setCurrentAssessmentId(id);
          return id;
        }
      }
    }

    if (draftCreatePromiseRef.current) {
      return draftCreatePromiseRef.current;
    }

    const isClient = userRole === ROLES.CLIENT;
    const isAssessorLike =
      userRole === ROLES.ASSESSOR ||
      userRole === ROLES.ADMIN ||
      userRole === ROLES.SUPERUSER;

    if (!isClient && !isAssessorLike) {
      throw new Error('NOT_ALLOWED');
    }
    if (isAssessorLike && !draftClientId) {
      throw new Error('MISSING_CLIENT');
    }

    const scoreSummary = calculateMaturityScore(filteredQuestions, {});
    const basePayload = {
      sector: userSector,
      score: scoreSummary.total.percentage,
      status: 'draft',
      responses: [],
    };

    draftCreatePromiseRef.current = (async () => {
      try {
        const res = isClient
          ? await assessmentService.createAssessment(basePayload)
          : await assessmentService.createAssessment({
              ...basePayload,
              client_id: draftClientId,
            });
        const id = res?.data?.id;
        if (!id) {
          throw new Error('NO_ID');
        }
        setCurrentAssessmentId(id);
        if (storageKey) {
          sessionStorage.setItem(storageKey, String(id));
        }
        return id;
      } finally {
        draftCreatePromiseRef.current = null;
      }
    })();

    return draftCreatePromiseRef.current;
  }, [
    editAssessmentId,
    userSector,
    userRole,
    draftClientId,
    draftSessionKey,
    filteredQuestions,
  ]);

  useEffect(() => {
    if (!mobileProgressOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setMobileProgressOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileProgressOpen]);

  useEffect(() => {
    let cancelled = false;
    const loadExistingAssessment = async () => {
      if (!editAssessmentId) return;
      try {
        const res = await assessmentService.getAssessmentById(editAssessmentId);
        if (cancelled) return;
        const asmt = res?.data;
        setCurrentAssessmentId(asmt?.id || editAssessmentId);
        setStatus(asmt?.status || 'draft');

        // Map API response rows back to UI shape used by QuestionRenderer.
        const optionIndex = {};
        const questionsForSector = getAllQuestions(asmt.sector || userSector);
        const walk = (nodes) => {
          (nodes || []).forEach((q) => {
            const qid = String(q.id);
            if (Array.isArray(q.options)) {
              optionIndex[qid] = {};
              q.options.forEach((opt) => {
                if (opt && typeof opt.text === 'string') optionIndex[qid][opt.text] = opt;
              });
            }
            if (q.children?.length) walk(q.children);
          });
        };
        walk(questionsForSector);

        const nextResponses = {};
        (asmt?.responses_out || []).forEach((r) => {
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
              .map((text) => optionIndex?.[qid]?.[text] || { text });
            nextResponses[qid] = {
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
          nextResponses[qid] = {
            selectedOption: optionIndex?.[qid]?.[selectedText] || { text: selectedText },
            highlight: h.text,
            lowlight: l.text,
            recommendation: rec.text,
            includeHighlight: h.include,
            includeLowlight: l.include,
            includeRecommendation: rec.include,
          };
        });
        setResponses(nextResponses);
      } catch (error) {
        showPopup(error?.response?.data?.detail || 'Failed to load draft assessment.', 'error');
      }
    };
    loadExistingAssessment();
    return () => {
      cancelled = true;
    };
  }, [editAssessmentId, userSector, showPopup]);

  // Create a server draft as soon as the page opens (so assessor/client work is saved to the DB).
  useEffect(() => {
    if (editAssessmentId || !userSector) return;

    const isClient = userRole === ROLES.CLIENT;
    const isAssessorLike =
      userRole === ROLES.ASSESSOR ||
      userRole === ROLES.ADMIN ||
      userRole === ROLES.SUPERUSER;
    if (!isClient && !isAssessorLike) return;

    ensureAssessmentDraft().catch((error) => {
      if (error?.message === 'MISSING_CLIENT') {
        showPopup(
          'Missing client link. Go back, enter a registered client email, and try again.',
          'error',
        );
        return;
      }
      if (error?.message === 'NOT_ALLOWED') return;
      showPopup(
        error?.response?.data?.detail ||
          error?.response?.data?.error ||
          error?.message ||
          'Could not save the new assessment draft.',
        'error',
      );
    });
  }, [editAssessmentId, userSector, userRole, ensureAssessmentDraft, showPopup]);

  const handleSaveDraft = async () => {
    setSubmitting(true);
    let assessmentId = currentAssessmentId;
    try {
      assessmentId = await ensureAssessmentDraft();
    } catch (error) {
      if (error?.message === 'MISSING_CLIENT') {
        showPopup(
          'Missing client link. Go back, enter a registered client email, and try again.',
          'error',
        );
      } else {
        showPopup(
          error?.response?.data?.detail ||
            error?.response?.data?.error ||
            error?.message ||
            'Could not prepare assessment.',
          'error',
        );
      }
      setSubmitting(false);
      return;
    }

    const scoreSummary = getScoreSummary();
    const payload = {
      sector: userSector,
      score: scoreSummary.total.percentage,
      status: 'draft',
      scoring_details: scoreSummary,
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

    try {
      await assessmentService.updateAssessment(assessmentId, payload);
      showPopup('Assessment saved as draft. You can complete it later.', 'success');
      setPendingNavigation({
        path: userRole === ROLES.CLIENT ? '/client' : '/assessor',
        state: undefined,
      });
    } catch (error) {
      console.error('Assessment draft save error:', error?.response?.data || error?.message || error);
      showPopup(
        error?.response?.data?.detail || error?.response?.data?.error || 'Error saving draft',
        'error',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    let assessmentId = currentAssessmentId;
    try {
      assessmentId = await ensureAssessmentDraft();
    } catch (error) {
      if (error?.message === 'MISSING_CLIENT') {
        showPopup(
          'Missing client link. Go back, enter a registered client email, and try again.',
          'error',
        );
      } else {
        showPopup(
          error?.response?.data?.detail ||
            error?.response?.data?.error ||
            error?.message ||
            'Could not prepare assessment.',
          'error',
        );
      }
      setSubmitting(false);
      return;
    }

    const scoreSummary = getScoreSummary();
    const payload = {
      sector: userSector,
      score: scoreSummary.total.percentage,
      status: 'submitted',
      scoring_details: scoreSummary,
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

    try {
      const res = await assessmentService.updateAssessment(assessmentId, payload);
      showPopup('Assessment saved successfully!', 'success');
      setStatus('submitted');

      // Navigate to report (use stored responses if returned)
      setPendingNavigation({
        path: '/report',
        state: {
          responses: res?.data?.responses || responses,
          sector: userSector,
        },
      });
    } catch (error) {
      console.error(
        'Assessment save error:',
        error?.response?.data || error?.message || error,
      );
      showPopup(
        error?.response?.data?.detail ||
          error?.response?.data?.error ||
          'Error saving assessment',
        'error',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const scorePreviewSummary = getScoreSummary();
  const sectorLabel = userSector || '—';

  const attemptedCount = filteredQuestions.filter(q => checkAttempted(q, responses)).length;
  const naCount = filteredQuestions.filter(q => checkNA(q, responses)).length;

  return (
    <div className={styles.page}>
      {popup.open && (
        <div className={styles.popupOverlay} role="dialog" aria-modal="true">
          <div
            className={`${styles.popupCard} ${
              popup.type === 'error'
                ? styles.popupError
                : popup.type === 'success'
                  ? styles.popupSuccess
                  : styles.popupInfo
            }`}
          >
            <p className={styles.popupText}>{popup.message}</p>
            <button
              type="button"
              className={styles.popupButton}
              onClick={() => {
                setPopup({ open: false, type: 'info', message: '' });
                if (pendingNavigation?.path) {
                  navigate(pendingNavigation.path, pendingNavigation.state ? { state: pendingNavigation.state } : undefined);
                }
                setPendingNavigation(null);
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div>
            <p className={styles.kicker}>Assessment</p>
            <h1 className={styles.heading}>
              {clientData ? `Assessment for ${clientData.companyName}` : 'Industry 4.0 readiness'}
            </h1>
            <p className={styles.meta}>
              Signed in as{' '}
              <span className={styles.metaStrong}>{user.username}</span>
              {' · '}
              Role:{' '}
              <span className={styles.metaCap}>{userRole}</span>
            </p>
          </div>
          <div className={styles.badges}>
            <span className={styles.badgeSector}>
              Sector: {sectorLabel}
            </span>
            <span
              className={`${styles.badgeStatusBase} ${
                status === 'submitted'
                  ? styles.badgeStatusSubmitted
                  : styles.badgeStatusDraft
              }`}
            >
              {status === 'submitted' ? 'Submitted' : 'Draft'}
            </span>

          </div>
        </div>
      </header>
      <nav className={styles.navWrapper}>
        <div className={styles.navInner}>
          <a
            href="#section-basic"
            className={styles.navItem}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('section-basic')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            Basic
          </a>
          <div className={styles.navItem}>
            <span>Functional</span>
            <div className={styles.dropdown}>
              {Array.from(new Set(filteredQuestions.filter(q => q.type === 'functional').map(q => q.area))).map(area => (
                <a
                  key={area}
                  href={`#area-${area.replace(/\s+/g, '-').toLowerCase()}`}
                  className={styles.dropdownItem}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(`area-${area.replace(/\s+/g, '-').toLowerCase()}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                >
                  {area}
                </a>
              ))}
            </div>
          </div>
          <a
            href="#section-sector"
            className={styles.navItem}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('section-sector')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            {userSector ? userSector.charAt(0).toUpperCase() + userSector.slice(1) : 'Sector'}
          </a>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.content}>
          {status === 'submitted' && userRole === ROLES.CLIENT && (
            <div className={styles.alert} role="status">
              This assessment is submitted. You can no longer edit your answers.
            </div>
          )}

          <div className={styles.questions}>
            {numberedRootQuestions.map((q, index) => {
              const prevType = index > 0 ? numberedRootQuestions[index - 1]?.type : null;
              const isFirstType = q.type !== prevType;

              const prevArea = index > 0 ? numberedRootQuestions[index - 1]?.area : null;
              const isFirstArea = q.type === 'functional' && q.area !== prevArea;

              const sectionId =
                q.type === 'basic'
                  ? 'section-basic'
                  : q.type === 'functional'
                    ? null
                    : 'section-sector';

              return (
                <React.Fragment key={q.id}>
                  {isFirstType && sectionId && (
                    <div
                      className="relative mt-4 scroll-mt-32 overflow-hidden rounded-2xl border border-indigo-200/50 bg-gradient-to-br from-indigo-50/90 via-white to-violet-50/40 p-5 shadow-md shadow-indigo-100/40 ring-1 ring-indigo-100/30 sm:p-6"
                      id={sectionId}
                    >
                      <div
                        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-violet-400/15 blur-2xl"
                        aria-hidden
                      />
                      <h2 className="relative text-lg font-extrabold uppercase tracking-[0.12em] text-indigo-800 sm:text-xl">
                        {q.type === 'basic'
                          ? 'Basic Questions'
                          : `${q.sector.charAt(0).toUpperCase() + q.sector.slice(1)} Specific Questions`}
                      </h2>
                      <p className="relative mt-2 text-sm font-medium leading-relaxed text-slate-600">
                        {q.type === 'basic'
                          ? 'General industry and company information'
                          : `Specialized questions for the ${q.sector} industry.`}
                      </p>
                    </div>
                  )}

                  {isFirstType && q.type === 'functional' && (
                    <div
                      className="relative mt-4 scroll-mt-32 overflow-hidden rounded-2xl border border-indigo-200/50 bg-gradient-to-br from-indigo-50/90 via-white to-violet-50/40 p-5 shadow-md shadow-indigo-100/40 ring-1 ring-indigo-100/30 sm:p-6"
                      id="section-functional"
                    >
                      <div
                        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-indigo-400/15 blur-2xl"
                        aria-hidden
                      />
                      <h2 className="relative text-lg font-extrabold uppercase tracking-[0.12em] text-indigo-800 sm:text-xl">
                        Functional Specific Questions
                      </h2>
                      <p className="relative mt-2 text-sm font-medium leading-relaxed text-slate-600">
                        Assessments across key business functions
                      </p>
                    </div>
                  )}

                  {isFirstArea && (
                    <div
                      className="mt-8 scroll-mt-48 rounded-xl border border-indigo-100 bg-white/80 py-3 pl-4 pr-3 shadow-sm ring-1 ring-indigo-50 backdrop-blur-sm"
                      id={`area-${q.area.replace(/\s+/g, '-').toLowerCase()}`}
                    >
                      <div className="flex items-center gap-2 border-l-[3px] border-indigo-500 pl-3">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full bg-indigo-500 shadow-sm shadow-indigo-400/50"
                          aria-hidden
                        />
                        <h3 className="text-base font-bold tracking-tight text-slate-900">{q.area}</h3>
                      </div>
                    </div>
                  )}
                  <div id={`question-${index}`}>
                    <QuestionRenderer
                      question={q}
                      responses={responses}
                      onAnswer={handleAnswer}
                      onRemarkChange={handleRemarkChange}
                      isEditable={isEditable}
                      displayNumber={q._displayNumber}
                    />
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          <div className={styles.actions}>
            <p className={styles.actionsHint}>
              {isComplete
                ? 'All questions are completed. You can submit your assessment.'
                : 'Assessment is incomplete. Save now and complete it later.'}
            </p>
            <button
              type="button"
              onClick={isComplete ? handleSubmit : handleSaveDraft}
              disabled={status === 'submitted' || submitting}
              className={styles.submit}
            >
              {submitting
                ? 'Saving…'
                : status === 'submitted'
                  ? 'Submitted'
                  : isComplete
                    ? 'Submit assessment'
                    : 'Save assessment'}
            </button>
          </div>
        </div>

        <aside className={styles.sidebar} aria-label="Assessment progress">
          <AssessmentProgressPanel
            styles={styles}
            filteredQuestions={filteredQuestions}
            responses={responses}
            userSector={userSector}
            getScoreSummary={getScoreSummary}
            scorePreviewSummary={scorePreviewSummary}
            attemptedCount={attemptedCount}
            naCount={naCount}
            checkAttempted={checkAttempted}
            checkNA={checkNA}
            status={status}
            submitting={submitting}
            isComplete={isComplete}
            handleSubmit={handleSubmit}
            handleSaveDraft={handleSaveDraft}
            navigate={navigate}
            showInnerHeader
            onQuestionJump={(idx) =>
              document.getElementById(`question-${idx}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
          />
        </aside>
      </main>

      <button
        type="button"
        className={`${styles.progressFab} ${styles.progressFabPosition}`}
        aria-expanded={mobileProgressOpen}
        aria-controls="assessment-progress-drawer"
        onClick={() => setMobileProgressOpen(true)}
      >
        <MoreVertical className="h-5 w-5 shrink-0 text-indigo-600" aria-hidden />
        Progress
      </button>

      {mobileProgressOpen && (
        <>
          <div
            className={styles.progressBackdrop}
            aria-hidden
            onClick={() => setMobileProgressOpen(false)}
          />
          <div
            id="assessment-progress-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="progress-drawer-title"
            className={styles.progressDrawerShell}
          >
            <div className={styles.progressDrawerHeader}>
              <h2 id="progress-drawer-title" className="text-lg font-bold text-slate-900">
                Assessment Progress
              </h2>
              <button
                type="button"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close progress panel"
                onClick={() => setMobileProgressOpen(false)}
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className={styles.progressDrawerBody}>
              <AssessmentProgressPanel
                styles={styles}
                filteredQuestions={filteredQuestions}
                responses={responses}
                userSector={userSector}
                getScoreSummary={getScoreSummary}
                scorePreviewSummary={scorePreviewSummary}
                attemptedCount={attemptedCount}
                naCount={naCount}
                checkAttempted={checkAttempted}
                checkNA={checkNA}
                status={status}
                submitting={submitting}
                isComplete={isComplete}
                handleSubmit={handleSubmit}
                handleSaveDraft={handleSaveDraft}
                navigate={navigate}
                showInnerHeader={false}
                rootClassName={styles.progressDrawerCard}
                onQuestionJump={(idx) => {
                  document.getElementById(`question-${idx}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  setMobileProgressOpen(false);
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StartAssessment;
