import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  ClipboardCheck,
  Clock,
  CheckCircle2,
  Settings,
  Plus,
  Globe,
  LogOut,
  LayoutDashboard,
  Sparkles,
  ArrowRight,
  ClipboardList,
} from 'lucide-react';
import ClientList from './components/ClientList';
import AssessmentList from './components/AssessmentList';
import AssessorAnalytics from './components/AssessorAnalytics';
import { assessmentService } from '../../services/assessmentService';
import { getAuth, logout } from '../../utils/auth';

const STAT_ACCENTS = {
  indigo: {
    iconWrap: 'bg-indigo-100 text-indigo-600 ring-indigo-500/15',
    glow: 'group-hover:shadow-indigo-500/20',
  },
  violet: {
    iconWrap: 'bg-violet-100 text-violet-600 ring-violet-500/15',
    glow: 'group-hover:shadow-violet-500/20',
  },
  amber: {
    iconWrap: 'bg-amber-100 text-amber-700 ring-amber-500/15',
    glow: 'group-hover:shadow-amber-500/20',
  },
  emerald: {
    iconWrap: 'bg-emerald-100 text-emerald-600 ring-emerald-500/15',
    glow: 'group-hover:shadow-emerald-500/20',
  },
};

const AssessorDashboard = () => {
  const navigate = useNavigate();
  const user = getAuth();
  const [activeTab, setActiveTab] = useState('clients');
  const [statsData, setStatsData] = useState({
    totalClients: 0,
    totalAssessments: 0,
    pending: 0,
    completed: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await assessmentService.getStats();
        setStatsData(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const stats = [
    {
      label: 'Total clients',
      value: statsData.totalClients,
      Icon: Users,
      accent: 'indigo',
    },
    {
      label: 'Total assessments',
      value: statsData.totalAssessments,
      Icon: ClipboardList,
      accent: 'violet',
    },
    {
      label: 'Pending',
      value: statsData.pending,
      Icon: Clock,
      accent: 'amber',
    },
    {
      label: 'Completed',
      value: statsData.completed,
      Icon: CheckCircle2,
      accent: 'emerald',
    },
  ];

  return (
    <div className="assessor-shell pb-12">
      <header className="sticky top-0 z-20 border-b border-white/60 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex min-h-14 max-w-7xl items-center justify-between gap-2 px-3 py-2 sm:h-16 sm:px-6 sm:py-0 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 ring-2 ring-white/40">
              A
            </div>
            <div className="min-w-0">
              <span className="block truncate text-base font-bold text-slate-900 sm:text-lg">
                Assessment Portal
              </span>
              <span className="hidden text-xs text-slate-500 sm:block">Assessor workspace</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden text-sm text-slate-600 sm:inline">
              Welcome,{' '}
              <strong className="font-semibold text-slate-800">{user?.username}</strong>
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-indigo-700"
            >
              <LogOut className="h-4 w-4 opacity-70" aria-hidden />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto min-w-0 max-w-7xl px-3 pb-6 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <section className="relative mb-8 overflow-hidden rounded-2xl border border-indigo-200/40 bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-900 px-6 py-8 text-white shadow-2xl shadow-indigo-900/25 sm:px-10 sm:py-10">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-fuchsia-400/15 blur-3xl"
            aria-hidden
          />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200/95">
                Your command center
              </p>
              <div className="mt-2 flex items-center gap-2">
                <LayoutDashboard className="h-8 w-8 shrink-0 text-indigo-200 sm:h-9 sm:w-9" aria-hidden />
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                  Assessor dashboard
                </h1>
              </div>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-indigo-100/95 sm:text-base">
                Manage clients, review submissions, and track performance — aligned with your assessment
                workflow.
              </p>
            </div>
            <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <button
                type="button"
                className="hidden items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-semibold text-white shadow-sm backdrop-blur-sm transition hover:bg-white/20 sm:inline-flex"
              >
                <Settings className="h-4 w-4" aria-hidden />
                Settings
              </button>
              <button
                type="button"
                onClick={() => navigate('/assessor/create')}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-indigo-800 shadow-lg shadow-black/10 transition hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-700 active:scale-[0.98] sm:w-auto"
              >
                <Sparkles className="h-5 w-5 text-amber-500" aria-hidden />
                Start new assessment
                <ArrowRight className="h-4 w-4 opacity-80" aria-hidden />
              </button>
            </div>
          </div>
        </section>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const { Icon } = stat;
            const accent = STAT_ACCENTS[stat.accent];
            return (
              <div
                key={stat.label}
                className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${accent.glow}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${accent.iconWrap}`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                  </div>
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-slate-900">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="min-w-0 rounded-2xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/50">
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-indigo-50/40 px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Workspace</h2>
                <p className="text-sm text-slate-500">Clients, assessments, and analytics in one place.</p>
              </div>
            </div>
          </div>

          <nav
            className="flex flex-wrap gap-2 border-b border-slate-100 bg-white/95 p-2 sm:gap-2 sm:px-4 sm:py-3"
            aria-label="Assessor sections"
          >
            <button
              type="button"
              onClick={() => setActiveTab('clients')}
              className={`inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition sm:flex-none ${
                activeTab === 'clients'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25'
                  : 'border border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
              aria-current={activeTab === 'clients' ? 'page' : undefined}
            >
              <Users className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
              <span className="truncate">Client database</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('assessments')}
              className={`inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition sm:flex-none ${
                activeTab === 'assessments'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25'
                  : 'border border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
              aria-current={activeTab === 'assessments' ? 'page' : undefined}
            >
              <ClipboardCheck className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
              <span className="truncate">All assessments</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('global')}
              className={`inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition sm:flex-none ${
                activeTab === 'global'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25'
                  : 'border border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
              aria-current={activeTab === 'global' ? 'page' : undefined}
            >
              <Globe className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
              <span className="truncate">Global analytics</span>
            </button>
          </nav>

          <div className="min-w-0 p-4 sm:p-6">
            {activeTab === 'clients' ? (
              <ClientList />
            ) : activeTab === 'assessments' ? (
              <AssessmentList />
            ) : (
              <AssessorAnalytics />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AssessorDashboard;
