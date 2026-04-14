export const startAssessmentStyles = {
  guestRoot:
    'flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-white to-indigo-50/50 px-4',
  guestCard: 'auth-card max-w-md text-center',
  guestIconWrap:
    'mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700',
  guestIcon: 'h-6 w-6',
  guestTitle: 'text-lg font-semibold text-slate-900',
  guestText: 'mt-2 text-sm text-slate-600',
  guestLink: 'btn-primary mt-6 no-underline hover:text-white',

  page:
    'min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_100%_60%_at_50%_-10%,rgba(99,102,241,0.09),transparent)]',
  header:
    'sticky top-0 z-10 border-b border-indigo-100/80 bg-white/85 shadow-sm shadow-indigo-100/40 backdrop-blur-xl',
  headerInner:
    'mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8',
  kicker:
    'text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-600',
  heading:
    'mt-1 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 bg-clip-text text-xl font-extrabold tracking-tight text-transparent sm:text-2xl',
  meta: 'mt-2 text-sm text-slate-600',
  metaStrong: 'font-semibold text-slate-900',
  metaCap: 'font-semibold capitalize text-indigo-950/90',
  badges: 'flex flex-wrap items-center gap-2',
  badgeSector:
    'inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-gradient-to-br from-white to-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/60',
  badgeStatusBase:
    'inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-bold shadow-sm ring-1',
  badgeStatusDraft: 'bg-amber-100 text-amber-950 ring-amber-300/50',
  badgeStatusSubmitted: 'bg-emerald-100 text-emerald-900 ring-emerald-300/50',
  badgeScore:
    'inline-flex items-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1 text-xs font-bold text-white shadow-md shadow-indigo-500/25',
  popupOverlay:
    'fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 px-4',
  popupCard: 'w-full max-w-md rounded-2xl border bg-white p-5 shadow-2xl',
  popupError: 'border-rose-200',
  popupSuccess: 'border-emerald-200',
  popupInfo: 'border-indigo-200',
  popupText: 'text-sm font-medium text-slate-800',
  popupButton:
    'mt-4 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500',

  main: 'mx-auto flex max-w-[1400px] min-w-0 flex-col gap-6 sm:gap-8 px-3 py-6 sm:px-4 sm:py-8 lg:flex-row lg:px-8',
  content: 'flex-1 min-w-0',
  sidebar: 'hidden lg:flex lg:w-[360px] lg:sticky lg:top-[130px] lg:h-[calc(100vh-160px)] lg:flex-col',
  summaryCard:
    'flex h-full flex-col overflow-hidden rounded-2xl border border-indigo-100/80 bg-white shadow-xl shadow-indigo-200/30 ring-1 ring-indigo-50',
  progressDrawerCard:
    '!rounded-none !border-0 !shadow-none flex min-h-0 h-full max-h-full flex-1 flex-col bg-white',
  progressFab:
    'lg:hidden fixed z-[45] flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white py-2 pl-3 pr-4 text-sm font-bold text-indigo-900 shadow-lg shadow-indigo-200/50 ring-2 ring-indigo-100/60 transition hover:bg-indigo-50 active:scale-[0.98]',
  progressFabPosition:
    'bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))]',
  progressBackdrop: 'fixed inset-0 z-[55] bg-slate-900/50 lg:hidden',
  progressDrawerShell:
    'fixed inset-y-0 right-0 z-[60] flex w-full max-w-md flex-col bg-white shadow-2xl lg:hidden',
  progressDrawerHeader: 'flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-3',
  progressDrawerBody:
    'flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain bg-slate-50',
  summaryHeader:
    'border-b border-indigo-100/80 bg-gradient-to-br from-indigo-50/90 via-white to-violet-50/40 p-5',
  summaryTitle:
    'text-base font-extrabold tracking-tight text-slate-900',
  summaryScroll: 'flex-1 space-y-6 overflow-y-auto p-5',
  summaryStatGrid: 'grid grid-cols-2 gap-3',
  summaryStatBox:
    'rounded-xl border border-indigo-100/60 bg-gradient-to-br from-white to-slate-50/80 p-3 shadow-sm ring-1 ring-slate-100/80 transition hover:shadow-md',
  summaryStatLabel: 'text-[10px] font-bold uppercase tracking-wide text-slate-500',
  summaryStatValue: 'mt-0.5 text-lg font-extrabold tabular-nums text-slate-900',
  summarySection: 'space-y-3',
  summarySectionTitle:
    'flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-indigo-900/50',
  summaryAreaItem: 'space-y-2 border-l-2 border-indigo-200/60 pl-3',
  summaryAreaTitle:
    'text-[10px] font-bold uppercase tracking-wide text-indigo-800/80',
  summaryGrid: 'flex flex-wrap gap-2',
  summaryDot:
    'flex h-9 min-w-[2.25rem] cursor-pointer items-center justify-center rounded-xl border text-[10px] font-bold shadow-sm transition-all duration-150 hover:scale-110 hover:shadow-md active:scale-95',
  summaryDotAttempted:
    'border-indigo-500 bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-indigo-500/30 ring-1 ring-white/20',
  summaryDotNA: 'border-amber-300/80 bg-amber-50 text-amber-800 ring-1 ring-amber-200/50',
  summaryDotEmpty:
    'border-slate-200/90 bg-white text-slate-500 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700',
  summaryFooter:
    'border-t border-indigo-100/80 bg-gradient-to-b from-slate-50/80 to-white p-5',
  alert:
    'mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900',
  questions: 'space-y-6',
  
  // Section nav — pill-style, touch-friendly
  navWrapper:
    'sticky top-[73px] z-[9] border-b border-indigo-100/60 bg-white/75 shadow-sm shadow-indigo-100/30 backdrop-blur-md',
  navInner:
    'mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto overscroll-x-contain touch-pan-x px-3 py-3 sm:gap-3 sm:px-6 lg:px-8',
  navItem:
    'group relative shrink-0 cursor-pointer rounded-full border border-transparent bg-white/90 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200/60 transition-all hover:border-indigo-200 hover:bg-indigo-50/80 hover:text-indigo-800 hover:shadow-md',
  navItemActive: 'border-indigo-300 bg-indigo-50 text-indigo-800 ring-indigo-200',
  dropdown:
    'invisible absolute left-0 top-full z-20 mt-2 w-56 origin-top-left rounded-xl border border-indigo-100 bg-white/95 p-2 shadow-xl shadow-indigo-200/40 ring-1 ring-indigo-50 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 -translate-y-1 opacity-0',
  dropdownItem:
    'block rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700',

  actions:
    'mt-12 flex flex-col gap-4 rounded-2xl border border-indigo-100/80 bg-gradient-to-br from-white to-indigo-50/30 p-6 shadow-md shadow-indigo-100/40 ring-1 ring-indigo-50 sm:flex-row sm:items-center sm:justify-between',
  actionsHint: 'text-sm font-medium leading-relaxed text-slate-600',
  submit:
    'inline-flex w-full min-w-[200px] cursor-pointer items-center justify-center rounded-xl border-0 bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 sm:w-auto',
};

