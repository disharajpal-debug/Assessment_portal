export const getRoleColor = (role) => {
  switch (role) {
    case 'client': return 'text-blue-700 bg-blue-100 ring-blue-600/20';
    case 'assessor': return 'text-emerald-700 bg-emerald-100 ring-emerald-600/20';
    case 'admin': return 'text-purple-700 bg-purple-100 ring-purple-600/20';
    case 'superuser': return 'text-rose-700 bg-rose-100 ring-rose-600/20';
    default: return 'text-slate-700 bg-slate-100 ring-slate-600/20';
  }
};

export const getQuestionTypeColor = (type) => {
  switch(type) {
    case 'basic': return 'bg-slate-100 text-slate-700';
    case 'functional': return 'bg-indigo-100 text-indigo-700';
    case 'sector': return 'bg-amber-100 text-amber-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};
