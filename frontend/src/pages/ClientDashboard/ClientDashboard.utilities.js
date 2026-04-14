/**
 * Formats a date string into a user-friendly format.
 * @param {string} dateString
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

/**
 * Returns a color class based on the assessment status.
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'Draft':
      return 'text-amber-700 bg-amber-50 ring-amber-600/20';
    case 'Submitted':
      return 'text-emerald-700 bg-emerald-50 ring-emerald-600/20';
    case 'Assessed':
      return 'text-violet-700 bg-violet-50 ring-violet-600/20';
    default:
      return 'text-slate-600 bg-slate-50 ring-slate-500/10';
  }
};
