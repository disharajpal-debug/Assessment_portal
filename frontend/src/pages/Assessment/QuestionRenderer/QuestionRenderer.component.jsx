import React from 'react';
import { getAuth } from '../../../utils/auth';
import { ROLES } from '../../../constants/roles';
import { questionStyles as styles } from './QuestionRenderer.style';
import MatrixRenderer from './MatrixRenderer.component';

const MAX_DEPTH = 12;

const QuestionRenderer = ({
  question,
  responses,
  onAnswer,
  onRemarkChange,
  isEditable = true,
  level = 0,
  /** Hierarchical label, e.g. "11", "11.1", "11.2" — roots use question id; nested use parent + index. */
  displayNumber = null,
}) => {
  const user = getAuth();

  const canAddRemarks =
    user?.role === ROLES.ASSESSOR ||
    user?.role === ROLES.ADMIN ||
    user?.role === ROLES.SUPERUSER;

  const response = responses[question.id];
  const selected = response?.selectedOption;
  const selectedOptions = response?.selectedOptions || [];
  const children = question.children || [];

  const hasChildren = children.length > 0;
  const hasOptions = (question.options || []).length > 0;
  const isGroupNode = !question.isMatrix && !hasOptions && hasChildren;
  const showChildren = question.isMatrix
    ? false
    : isGroupNode
      ? true
      : Boolean(selected) && !selected?.isNA && hasChildren;

  const isNAOption = (opt) => Boolean(opt?.isNA);

  const depth = Math.min(level, MAX_DEPTH);
  const indentClass = styles.indentClasses[depth] || styles.indentClasses[MAX_DEPTH];
  const cardBase = isGroupNode
    ? (level > 0 ? styles.groupCardNested : styles.groupCardRoot)
    : (level > 0 ? styles.cardNested : styles.cardRoot);

  const numberLabel =
    displayNumber != null && displayNumber !== ''
      ? String(displayNumber)
      : String(question.id);
  const isCheckboxQuestion =
    question?.type === 'basic' &&
    (String(question?.id) === 'B04' || String(displayNumber) === '4');

  return (
    <section className={`${cardBase} ${indentClass}`}>
      <div
        className={
          isGroupNode
            ? (level > 0 ? styles.groupHeaderNested : styles.groupHeaderRoot)
            : styles.header
        }
      >
        <h3
          id={`question-heading-${question.id}`}
          className={
            isGroupNode
              ? (level > 0 ? styles.groupTitleNested : styles.groupTitleRoot)
              : styles.title
          }
        >
          <span
            className={
              isGroupNode
                ? level > 0
                  ? styles.groupBadgeNested
                  : styles.groupBadge
                : styles.numberBadge
            }
          >
            {numberLabel}
          </span>
          <span className={isGroupNode ? '' : styles.titleText}>
            {question.text}
          </span>
        </h3>
      </div>

      {question.isMatrix ? (
        <MatrixRenderer
          question={question}
          responses={responses}
          onAnswer={onAnswer}
          isEditable={isEditable}
          displayNumber={numberLabel}
        />
      ) : (
        !hasChildren && (question.options || []).length > 0 && (
          <div className={styles.options}>
            {question.text.toLowerCase().includes('others') ? (
              <div className="px-1">
                <textarea
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-3 text-sm transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Please type your response here..."
                  disabled={!isEditable}
                  value={response?.otherText || ''}
                  onChange={(e) =>
                    onAnswer(
                      question.id,
                      { text: 'Other', isOther: true, value: e.target.value },
                      question,
                    )
                  }
                  rows={3}
                />
              </div>
            ) : (
              (question.options || []).map((opt, index) => {
                const checked = isCheckboxQuestion
                  ? selectedOptions.some((o) => o?.text === opt.text)
                  : selected?.text === opt.text;
                const na = isNAOption(opt);
                const optionClasses = [
                  styles.option,
                  checked ? styles.optionChecked : '',
                  !isEditable ? styles.optionDisabled : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <label key={index} className={optionClasses}>
                    <input
                      type={isCheckboxQuestion ? 'checkbox' : 'radio'}
                      name={isCheckboxQuestion ? undefined : `q-${question.id}`}
                      disabled={!isEditable}
                      checked={checked}
                      onChange={() => {
                        if (!isEditable) return;
                        onAnswer(question.id, opt, question);
                      }}
                      className={styles.optionInput}
                    />
                    <span className={styles.optionLabelText}>
                      {opt.text}
                      {na && (
                        <span className={styles.optionNaBadge}>N/A</span>
                      )}
                    </span>
                  </label>
                );
              })
            )}
          </div>
        )
      )}

      {canAddRemarks && !question.isMatrix && !hasChildren && hasOptions && (
        <div className={styles.remarks}>
          <p className={styles.remarksTitle}>Assessor remarks</p>
          <div className={styles.remarksGrid}>
            <div>
              <label className={`${styles.remarkLabel} mb-1.5 block`}>
                Highlight
              </label>
              <input
                placeholder="Optional"
                className={styles.remarkInput}
                value={response?.highlight || ''}
                onChange={(e) =>
                  onRemarkChange(question.id, 'highlight', e.target.value)
                }
              />
            </div>
            <div>
              <label className={`${styles.remarkLabel} mb-1.5 block`}>
                Lowlight
              </label>
              <input
                placeholder="Optional"
                className={styles.remarkInput}
                value={response?.lowlight || ''}
                onChange={(e) =>
                  onRemarkChange(question.id, 'lowlight', e.target.value)
                }
              />
            </div>
            <div>
              <label className={`${styles.remarkLabel} mb-1.5 block`}>
                Recommendation
              </label>
              <input
                placeholder="Optional"
                className={styles.remarkInput}
                value={response?.recommendation || ''}
                onChange={(e) =>
                  onRemarkChange(question.id, 'recommendation', e.target.value)
                }
              />
            </div>
          </div>
        </div>
      )}

      {showChildren && (
        <div className={isGroupNode ? styles.groupBody : styles.childrenWrap}>
          {children.map((child, index) => {
            const subLabel = level === 0 ? String.fromCharCode(97 + index) : index + 1;
            return (
              <QuestionRenderer
                key={child.id}
                question={child}
                responses={responses}
                onAnswer={onAnswer}
                onRemarkChange={onRemarkChange}
                isEditable={isEditable}
                level={level + 1}
                displayNumber={`${numberLabel}.${subLabel}`}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default QuestionRenderer;
