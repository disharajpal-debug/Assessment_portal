export const questionStyles = {
  // Indentation matches prior CSS margin-left: 0, 12, 24, ... => Tailwind ml-0, ml-3, ml-6, ... ml-36
  indentClasses: [
    'ml-0',
    'ml-3',
    'ml-6',
    'ml-9',
    'ml-12',
    'ml-15',
    'ml-18',
    'ml-21',
    'ml-24',
    'ml-27',
    'ml-30',
    'ml-33',
    'ml-36',
  ],

  cardRoot:
    'rounded-2xl border border-slate-200/90 bg-white shadow-md shadow-slate-200/40 ring-1 ring-slate-100/80 transition-all duration-200 hover:border-indigo-200/60 hover:shadow-lg hover:shadow-indigo-100/50',
  cardNested:
    'mt-4 rounded-2xl border border-indigo-200/50 bg-white shadow-md shadow-indigo-100/30 ring-1 ring-indigo-100/40 transition-all hover:shadow-lg',

  header: 'border-b border-slate-100/90 bg-gradient-to-r from-slate-50/50 to-white px-4 py-4 sm:px-5',
  title:
    'flex flex-wrap items-start gap-x-3 gap-y-1.5 text-sm font-semibold leading-snug text-slate-900 sm:text-base',

  numberBadge:
    'inline-flex shrink-0 items-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 px-2.5 py-1 text-xs font-extrabold tabular-nums text-white shadow-sm ring-2 ring-amber-200/60',
  titleText: 'min-w-0 flex-1 font-semibold leading-relaxed',

  options: 'space-y-2 p-4 sm:p-5',
  option:
    'group/option flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200/90 bg-slate-50/40 px-3.5 py-3 text-sm shadow-sm transition-all duration-150 hover:border-indigo-300/70 hover:bg-white hover:shadow-md',
  optionChecked:
    'border-indigo-500 bg-gradient-to-r from-indigo-50 to-violet-50/80 text-slate-900 shadow-md ring-2 ring-indigo-500/25',
  optionDisabled: 'cursor-not-allowed opacity-60 grayscale-[0.3]',
  optionInput:
    'mt-1 h-4 w-4 shrink-0 border-slate-300 text-indigo-600 transition-transform focus:ring-2 focus:ring-indigo-500/30 group-hover/option:scale-110',
  optionLabelText: 'flex-1 leading-relaxed',
  optionNaBadge:
    'ml-2 rounded bg-slate-200 px-1.5 py-0.5 text-xs font-medium text-slate-600',

  remarks: 'border-t border-slate-100 bg-slate-50/50 px-4 py-4 sm:px-5',
  remarksTitle:
    'mb-3 text-xs font-medium uppercase tracking-wide text-slate-500',
  remarksGrid: 'grid gap-3 sm:grid-cols-3',
  remarkLabel: 'form-label text-xs',
  remarkInput: 'form-input text-sm',

  childrenWrap:
    'border-t border-slate-100 bg-slate-50/30 px-2 pb-2 pt-1 sm:px-3',

  // Group-style nodes (no options, only children) used for basic section/category headings
  groupCardRoot:
    'overflow-hidden rounded-2xl border border-indigo-200/40 bg-white shadow-lg shadow-indigo-100/40 ring-1 ring-indigo-100/50',
  groupCardNested:
    'overflow-hidden rounded-2xl border border-indigo-300/30 bg-white shadow-md shadow-indigo-100/30 ring-1 ring-indigo-50',
  groupHeaderRoot:
    'border-b border-indigo-100/60 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 px-4 py-4 sm:px-6',
  groupHeaderNested:
    'border-b border-indigo-100 bg-gradient-to-r from-indigo-50/90 to-white px-4 py-3 sm:px-6',
  groupTitleRoot:
    'flex flex-wrap items-center gap-x-3 gap-y-1 text-base font-extrabold tracking-tight text-white sm:text-lg',
  groupTitleNested:
    'flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-bold text-slate-800 sm:text-base',
  groupBadge:
    'inline-flex shrink-0 items-center rounded-lg bg-white/20 px-2.5 py-1 text-xs font-extrabold tabular-nums text-white shadow-inner ring-1 ring-white/30 backdrop-blur-sm',
  groupBadgeNested:
    'inline-flex shrink-0 items-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 px-2.5 py-1 text-xs font-extrabold tabular-nums text-white shadow-sm ring-1 ring-indigo-500/30',
  groupBody: 'px-2 pb-2 pt-1 sm:px-3 bg-white',
};

