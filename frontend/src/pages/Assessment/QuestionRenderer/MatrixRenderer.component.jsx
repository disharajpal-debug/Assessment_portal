import React from 'react';
import { questionStyles as styles } from './QuestionRenderer.style';

const MatrixRenderer = ({
  question,
  responses,
  onAnswer,
  isEditable,
  displayNumber,
}) => {
  const children = question.children || [];
  if (children.length === 0) return null;

  // Assume all children have the same options, or use the first one's options as columns
  const columnOptions = children[0]?.options || [];

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full table-fixed border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/50">
            <th className="px-4 py-3 font-semibold text-slate-700 w-[40%]">{question.matrixHeader || 'Category'}</th>
            {columnOptions.map((opt, i) => (
              <th key={i} className="px-2 py-3 text-center font-semibold text-slate-700">
                {opt.text}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {children.map((child, rowIndex) => {
            const childResponse = responses[child.id];
            const isOthers = child.text.toLowerCase().includes('others');

            return (
              <tr key={child.id} className="hover:bg-slate-50/30 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-900">
                  <span className="mr-2 text-slate-400">{displayNumber}.{String.fromCharCode(97 + rowIndex)}</span>
                  {child.text}
                </td>
                
                {isOthers ? (
                  <td colSpan={columnOptions.length} className="px-4 py-2">
                    <input
                      type="text"
                      className="w-full rounded-md border border-slate-200 px-3 py-1.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      placeholder="Please specify..."
                      disabled={!isEditable}
                      value={childResponse?.otherText || ''}
                      onChange={(e) => onAnswer(child.id, { text: 'Other', isOther: true, value: e.target.value }, child)}
                    />
                  </td>
                ) : (
                  columnOptions.map((opt, colIndex) => {
                    const checked = childResponse?.selectedOption?.text === opt.text;
                    return (
                      <td key={colIndex} className="px-2 py-3 text-center">
                        <input
                          type="radio"
                          name={`matrix-q-${child.id}`}
                          disabled={!isEditable}
                          checked={checked}
                          onChange={() => onAnswer(child.id, opt, child)}
                          className="h-4 w-4 cursor-pointer text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                    );
                  })
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MatrixRenderer;
