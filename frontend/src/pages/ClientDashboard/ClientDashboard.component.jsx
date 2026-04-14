import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  ClipboardList,
  Clock,
  Download,
  Eye,
  FileStack,
  LayoutDashboard,
  LogOut,
  Pencil,
  Sparkles,
  TrendingUp,
  UserCircle,
} from 'lucide-react';
import {
  formatDate,
  getStatusColor,
} from './ClientDashboard.utilities';
import { getAuth, logout } from '../../utils/auth';
import { assessmentService } from '../../services/assessmentService';
import CreateAssessment from '../AssessorDashboard/CreateAssessment/CreateAssessment.component';
import ClientProfileTab from './ClientProfileTab.component';

const STAT_ACCENTS = {
  indigo: {
    iconWrap: 'bg-indigo-100 text-indigo-600 ring-indigo-500/15',
    glow: 'group-hover:shadow-indigo-500/20',
  },
  emerald: {
    iconWrap: 'bg-emerald-100 text-emerald-600 ring-emerald-500/15',
    glow: 'group-hover:shadow-emerald-500/20',
  },
  violet: {
    iconWrap: 'bg-violet-100 text-violet-600 ring-violet-500/15',
    glow: 'group-hover:shadow-violet-500/20',
  },
  amber: {
    iconWrap: 'bg-amber-100 text-amber-700 ring-amber-500/15',
    glow: 'group-hover:shadow-amber-500/20',
  },
};

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [showTargetForm, setShowTargetForm] = useState(false);
  const [mainTab, setMainTab] = useState('dashboard');

  useEffect(() => {
    const userData = getAuth();
    if (!userData) {
      navigate('/');
      return;
    }
    setUser(userData);

    const fetchAssessments = async () => {
      try {
        const response = await assessmentService.getAssessments();
        const formatted = response.data.map(asmt => ({
          id: asmt.id,
          date: asmt.created_at,
          score: asmt.score,
          status: asmt.reviewed_at
            ? 'Assessed'
            : asmt.status === 'submitted'
              ? 'Submitted'
              : 'Draft',
          responses: asmt.responses_out || asmt.responses
        }));
        setAssessments(formatted);
      } catch (err) {
        console.error("Error fetching assessments", err);
      }
    };

    fetchAssessments();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const openLatestReport = async (assessmentId, autoDownload = false) => {
    try {
      const res = await assessmentService.getAssessmentById(assessmentId);
      const asmt = res.data || {};
      navigate('/report', {
        state: {
          responses: asmt.responses_out || asmt.responses || [],
          sector: asmt.sector || user?.sector,
          autoDownload,
        },
      });
    } catch (err) {
      console.error('Error opening latest report', err);
    }
  };

  if (showTargetForm) {
    return (
      <CreateAssessment
        variant="client"
        onBack={() => setShowTargetForm(false)}
      />
    );
  }

  const latestAssessment = assessments
    .filter(a => a.status === 'Submitted' || a.status === 'Assessed')
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  const statusSummary = assessments.some(a => a.status === 'Draft')
    ? 'Draft pending'
    : assessments.some(a => a.status === 'Assessed')
      ? 'Assessor reviewed'
      : 'All submitted';

  const stats = [
    {
      label: 'Total assessments',
      value: assessments.length,
      Icon: FileStack,
      accent: 'indigo',
    },
    {
      label: 'Latest score',
      value: latestAssessment ? `${latestAssessment.score}%` : '—',
      Icon: TrendingUp,
      accent: 'emerald',
    },
    {
      label: 'Sector',
      value: user?.sector ? String(user.sector).replace(/_/g, ' ') : 'Not set',
      Icon: Building2,
      accent: 'violet',
    },
    {
      label: 'Current status',
      value: statusSummary,
      Icon: Clock,
      accent: 'amber',
    },
  ];

  return (
    <div className="client-shell pb-12">
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
              <span className="hidden text-xs text-slate-500 sm:block">Client workspace</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden text-sm text-slate-600 sm:inline">
              Welcome, <strong className="font-semibold text-slate-800">{user?.username}</strong>
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

      <main className="mx-auto max-w-7xl px-3 pb-6 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <nav
          className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-slate-200/90 bg-white/90 p-1.5 shadow-sm backdrop-blur-sm"
          aria-label="Client sections"
        >
          <button
            type="button"
            onClick={() => setMainTab('dashboard')}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition sm:flex-none ${
              mainTab === 'dashboard'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
            aria-current={mainTab === 'dashboard' ? 'page' : undefined}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
            Overview
          </button>
          <button
            type="button"
            onClick={() => setMainTab('profile')}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition sm:flex-none ${
              mainTab === 'profile'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
            aria-current={mainTab === 'profile' ? 'page' : undefined}
          >
            <UserCircle className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
            Profile
          </button>
        </nav>

        {mainTab === 'profile' && user && <ClientProfileTab user={user} />}

        {mainTab === 'dashboard' && (
          <>
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
                Your workspace
              </p>
              <div className="mt-2 flex items-center gap-2">
                <LayoutDashboard className="h-8 w-8 shrink-0 text-indigo-200 sm:h-9 sm:w-9" aria-hidden />
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                  Client dashboard
                </h1>
              </div>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-indigo-100/95 sm:text-base">
                Track maturity scores, resume drafts, and open reports — a clearer view of your digital journey.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowTargetForm(true)}
              className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-indigo-800 shadow-lg shadow-black/10 transition hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-700 active:scale-[0.98] sm:w-auto"
            >
              <Sparkles className="h-5 w-5 text-amber-500" aria-hidden />
              Start new assessment
              <ArrowRight className="h-4 w-4 opacity-80" aria-hidden />
            </button>
          </div>
        </section>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => {
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
                  {i === 0 && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-500/20">
                      Live
                    </span>
                  )}
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-slate-900 capitalize">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/50">
          <div className="flex flex-col gap-2 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-indigo-50/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-indigo-600" aria-hidden />
              <h2 className="text-lg font-bold text-slate-900">Assessment history</h2>
            </div>
            <div className="text-xs font-medium text-slate-500">
              {assessments.length} {assessments.length === 1 ? 'record' : 'records'}
            </div>
          </div>

          <div className="table-scroll">
            <table className="w-full text-center">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/90 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-3 py-3.5 text-center sm:px-6">Assessment ID</th>
                  <th className="px-3 py-3.5 text-center sm:px-6">Date</th>
                  <th className="px-3 py-3.5 text-center sm:px-6">Score</th>
                  <th className="px-3 py-3.5 text-center sm:px-6">Status</th>
                  <th className="px-3 py-3.5 text-center sm:px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assessments.map((assessment) => (
                  <tr
                    key={assessment.id}
                    className="transition-colors hover:bg-indigo-50/40"
                  >
                    <td className="px-3 py-4 sm:px-6 align-middle">
                      <span className="font-mono text-sm font-semibold text-slate-900">
                        {assessment.id}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-600 sm:px-6 align-middle">
                      {formatDate(assessment.date)}
                    </td>
                    <td className="px-3 py-4 sm:px-6 align-middle">
                      <div className="mx-auto flex max-w-[200px] items-center gap-2 sm:max-w-[220px]">
                        <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200/80">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all"
                            style={{ width: `${Math.min(100, Math.max(0, Number(assessment.score) || 0))}%` }}
                          />
                        </div>
                        <span className="shrink-0 text-sm font-semibold tabular-nums text-slate-700">
                          {assessment.score}%
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-4 sm:px-6 align-middle">
                      <span
                        className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusColor(assessment.status)}`}
                      >
                        {assessment.status}
                      </span>
                    </td>
                    <td className="px-3 py-4 sm:px-6 align-middle">
                      <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-2">
                        {assessment.status === 'Draft' ? (
                          <button
                            type="button"
                            onClick={() =>
                              navigate('/assessment', {
                                state: {
                                  assessmentId: assessment.id,
                                  sector: user?.sector,
                                },
                              })
                            }
                            className="inline-flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
                          >
                            <Pencil className="h-3.5 w-3.5" aria-hidden />
                            Edit
                          </button>
                        ) : (
                          <span className="inline-flex items-center justify-center gap-1 py-1.5 text-xs italic text-slate-400">
                            Locked
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => openLatestReport(assessment.id, false)}
                          className="inline-flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 hover:text-indigo-700"
                        >
                          <Eye className="h-3.5 w-3.5" aria-hidden />
                          View
                        </button>
                        {(assessment.status === 'Submitted' || assessment.status === 'Assessed') && (
                          <button
                            type="button"
                            onClick={() => openLatestReport(assessment.id, true)}
                            className="inline-flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-indigo-600"
                          >
                            <Download className="h-3.5 w-3.5" aria-hidden />
                            Download
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {assessments.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 ring-1 ring-indigo-200/60">
                <ClipboardList className="h-8 w-8 text-indigo-600" aria-hidden />
              </div>
              <p className="text-base font-semibold text-slate-800">No assessments yet</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                Start your first assessment to see scores and reports here.
              </p>
              <button
                type="button"
                onClick={() => setShowTargetForm(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition hover:bg-indigo-500"
              >
                Begin assessment
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          )}
        </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ClientDashboard;
