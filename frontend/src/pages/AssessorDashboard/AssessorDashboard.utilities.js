export const getStatusColor = (status) => {
  if (status === 'In Progress (Assessor)') {
    return 'bg-blue-50 text-blue-700 ring-blue-600/20';
  }
  if (status === 'In Progress (Client)') {
    return 'bg-cyan-50 text-cyan-700 ring-cyan-600/20';
  }
  if (status === 'Done (Assessed)') {
    return 'bg-violet-50 text-violet-700 ring-violet-600/20';
  }

  switch (status) {
    case 'Completed':
      return 'bg-violet-50 text-violet-700 ring-violet-600/20';
    case 'In Review':
      return 'bg-amber-50 text-amber-700 ring-amber-600/20';
    case 'Assessed':
      return 'bg-violet-50 text-violet-700 ring-violet-600/20';
    case 'Submitted':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
    case 'Pending':
      return 'bg-amber-50 text-amber-700 ring-amber-600/20';
    case 'In Progress':
      return 'bg-blue-50 text-blue-700 ring-blue-600/20';
    default:
      return 'bg-slate-50 text-slate-700 ring-slate-600/20';
  }
};

export const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};
