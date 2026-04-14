import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { assessmentService } from "../../../services/assessmentService";

const PIE_COLORS = ["#f59e0b", "#3b82f6", "#10b981"];

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const buildFallbackAnalytics = (assessments = [], clients = [], overdueDays = 7) => {
  const now = new Date();
  const overdueTs = now.getTime() - overdueDays * 24 * 60 * 60 * 1000;

  const clientById = Object.fromEntries((clients || []).map((c) => [c.id, c]));
  const latestByClient = new Map();
  for (const a of assessments || []) {
    const prev = latestByClient.get(a.user);
    const prevTs = prev ? new Date(prev.updated_at || prev.created_at || 0).getTime() : 0;
    const currTs = new Date(a.updated_at || a.created_at || 0).getTime();
    if (!prev || currTs >= prevTs) latestByClient.set(a.user, a);
  }

  const sectorPerf = {};
  const statusSummary = { total_assigned: clients.length, done: 0, in_review: 0, pending: 0 };
  const longPending = [];
  const notStarted = [];
  const recent = [];
  const daily = {};
  const weekly = {};

  for (const c of clients || []) {
    const sector = c.sector || "unknown";
    if (!sectorPerf[sector]) {
      sectorPerf[sector] = { sector, total_companies: 0, done: 0, pending: 0 };
    }
    sectorPerf[sector].total_companies += 1;

    const latest = latestByClient.get(c.id);
    let status = "pending";
    if (latest?.reviewed_at) status = "done";
    else if (latest?.status === "submitted" || latest?.status === "draft") status = "in_review";

    statusSummary[status] += 1;
    if (status === "done") sectorPerf[sector].done += 1;
    else sectorPerf[sector].pending += 1;

    const refDate = latest?.updated_at || latest?.created_at || null;
    const refTs = refDate ? new Date(refDate).getTime() : 0;
    if (status !== "done") {
      if (!latest) {
        notStarted.push({
          company_name: c.company_name || c.username,
          client_name: c.username,
          sector,
        });
      } else if (refTs < overdueTs) {
        longPending.push({
          company_name: c.company_name || c.username,
          client_name: c.username,
          sector,
          status,
          last_updated: refDate,
        });
      }
    }
  }

  for (const a of assessments || []) {
    const status = a.reviewed_at ? "Done" : a.status === "submitted" || a.status === "draft" ? "In Review" : "Pending";
    recent.push({
      assessment_id: a.id,
      company_name: clientById?.[a.user]?.company_name || a.client_name || `Client ${a.user}`,
      client_name: clientById?.[a.user]?.username || a.client_name || `Client ${a.user}`,
      sector: a.sector,
      status,
      last_updated: a.updated_at || a.created_at,
    });

    if (a.reviewed_at) {
      const reviewedDate = new Date(a.reviewed_at);
      const day = reviewedDate.toISOString().slice(0, 10);
      const weekStart = new Date(reviewedDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const week = weekStart.toISOString().slice(0, 10);
      daily[day] = (daily[day] || 0) + 1;
      weekly[week] = (weekly[week] || 0) + 1;
    }
  }

  return {
    summary: statusSummary,
    status_data: [
      { name: "Done", value: statusSummary.done },
      { name: "In Review", value: statusSummary.in_review },
      { name: "Pending", value: statusSummary.pending },
    ],
    sector_data: Object.values(sectorPerf),
    progress: {
      daily: Object.entries(daily).sort(([a], [b]) => a.localeCompare(b)).map(([date, done]) => ({ date, done })),
      weekly: Object.entries(weekly).sort(([a], [b]) => a.localeCompare(b)).map(([week, done]) => ({ week, done })),
    },
    recent_work: recent
      .sort((a, b) => new Date(b.last_updated || 0) - new Date(a.last_updated || 0))
      .slice(0, 10),
    pending_work: {
      not_started: notStarted.slice(0, 10),
      long_pending: longPending.slice(0, 10),
    },
  };
};

const AssessorAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const [sector, setSector] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [goalType, setGoalType] = useState("weekly");
  const [goalValue, setGoalValue] = useState(() => {
    const saved = localStorage.getItem("assessor_goal_value");
    return saved ? Number(saved) : 10;
  });

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (sector && sector !== "all") params.sector = sector;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      const res = await assessmentService.getAssessorDashboard(params);
      setData(res.data);
    } catch (err) {
      // Fallback path: if analytics endpoint is unauthorized, build analytics
      // from existing assessor endpoints that are already working.
      if (err?.response?.status === 401) {
        try {
          const [asmtRes, clientRes] = await Promise.all([
            assessmentService.getAssessments(),
            assessmentService.getClients(),
          ]);

          const filteredClients =
            sector && sector !== "all"
              ? (clientRes.data || []).filter((c) => c.sector === sector)
              : (clientRes.data || []);
          const filteredAssessments = (asmtRes.data || []).filter((a) => {
            const inSector = !sector || sector === "all" || a.sector === sector;
            const d = new Date(a.created_at || a.updated_at || 0);
            const inStart = !startDate || d >= new Date(startDate);
            const inEnd = !endDate || d <= new Date(endDate);
            return inSector && inStart && inEnd;
          });

          setData(buildFallbackAnalytics(filteredAssessments, filteredClients));
          setError("");
        } catch (fallbackErr) {
          setError(
            fallbackErr?.response?.data?.detail ||
              fallbackErr?.message ||
              "Failed to load analytics.",
          );
          setData(null);
        }
      } else {
        setError(err?.response?.data?.detail || err?.message || "Failed to load analytics.");
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    localStorage.setItem("assessor_goal_value", String(goalValue || 0));
  }, [goalValue]);

  const statusPie = useMemo(() => data?.status_data || [], [data]);

  const sectors = useMemo(() => {
    const rows = data?.sector_data || [];
    return rows.map((r) => r.sector);
  }, [data]);

  const completed = data?.summary?.done || 0;
  const goalPct = goalValue > 0 ? Math.min(100, Math.round((completed / goalValue) * 100)) : 0;

  return (
    <div className="min-w-0 space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-indigo-200/40 bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-900 p-5 text-white shadow-xl shadow-indigo-900/20 sm:p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-3xl" aria-hidden />
        <h2 className="relative text-xl font-extrabold tracking-tight sm:text-2xl">Global analytics</h2>
        <p className="relative mt-2 text-sm font-medium text-indigo-100/95">
          Performance, workload, and progress across your assigned sectors.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-indigo-100/80 bg-gradient-to-br from-white to-indigo-50/30 p-4 shadow-md ring-1 ring-indigo-50 md:grid-cols-5">
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Sector</label>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="form-select w-full rounded-xl border-indigo-100 py-2 text-sm focus:border-indigo-400"
          >
            <option value="all">All</option>
            {sectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="form-input w-full rounded-xl border-indigo-100 py-2 text-sm focus:border-indigo-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="form-input w-full rounded-xl border-indigo-100 py-2 text-sm focus:border-indigo-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Progress View</label>
          <select
            value={goalType}
            onChange={(e) => setGoalType(e.target.value)}
            className="form-select w-full rounded-xl border-indigo-100 py-2 text-sm focus:border-indigo-400"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={load}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-500/25 transition hover:from-indigo-500 hover:to-violet-500"
          >
            Apply filters
          </button>
        </div>
      </div>

      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</div>}
      {loading && <div className="py-8 text-center text-slate-500">Loading analytics...</div>}

      {!loading && data && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Kpi label="Total Assigned" value={data.summary.total_assigned} />
            <Kpi label="Done" value={data.summary.done} />
            <Kpi label="In Review" value={data.summary.in_review} />
            <Kpi label="Pending" value={data.summary.pending} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-indigo-100/80 bg-white p-5 shadow-lg shadow-indigo-100/40 ring-1 ring-slate-100/80">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-indigo-900/60">Work status</h3>
              <div className="h-[240px] sm:h-[280px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusPie} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95}>
                      {statusPie.map((d, i) => (
                        <Cell key={d.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-indigo-100/80 bg-white p-5 shadow-lg shadow-indigo-100/40 ring-1 ring-slate-100/80">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-indigo-900/60">My sectors</h3>
              <div className="h-[240px] sm:h-[280px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.sector_data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="sector" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total_companies" fill="#6366f1" name="Total" />
                    <Bar dataKey="done" fill="#10b981" name="Done" />
                    <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-100/80 bg-white p-5 shadow-lg shadow-indigo-100/40 ring-1 ring-slate-100/80">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-indigo-900/60">My progress</h3>
            <div className="h-[240px] sm:h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={goalType === "daily" ? data.progress.daily : data.progress.weekly}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey={goalType === "daily" ? "date" : "week"} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="done" stroke="#4f46e5" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <InfoCard title="My Goal">
              <div className="mb-2 flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={goalValue}
                  onChange={(e) => setGoalValue(Number(e.target.value || 0))}
                  className="w-20 rounded-md border border-slate-200 px-2 py-1 text-sm"
                />
                <span className="text-sm text-slate-600">Target completed</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200/80">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 shadow-inner transition-[width] duration-500"
                  style={{ width: `${goalPct}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">{completed}/{goalValue} ({goalPct}%)</p>
            </InfoCard>
            <AlertBox title="Not Started Work" items={data.pending_work.not_started} />
            <AlertBox title="Pending For Long Time" items={data.pending_work.long_pending} />
          </div>

          <div className="rounded-2xl border border-indigo-100/80 bg-white p-5 shadow-lg shadow-indigo-100/40 ring-1 ring-slate-100/80">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-900/60">Recent work</h3>
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/50"
              >
                Export PDF
              </button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-left">
                <thead className="bg-gradient-to-r from-slate-50 to-indigo-50/40">
                  <tr>
                    <th className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500">Company</th>
                    <th className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500">Sector</th>
                    <th className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(data.recent_work || []).map((r) => (
                    <tr key={r.assessment_id}>
                      <td className="px-4 py-2 text-sm text-slate-800">{r.company_name}</td>
                      <td className="px-4 py-2 text-sm text-slate-700">{r.sector}</td>
                      <td className="px-4 py-2 text-sm text-slate-700">{r.status}</td>
                      <td className="px-4 py-2 text-sm text-slate-700">{formatDate(r.last_updated)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </>
      )}
    </div>
  );
};

const Kpi = ({ label, value }) => (
  <div className="rounded-2xl border border-indigo-100/80 bg-gradient-to-br from-white to-indigo-50/40 p-4 shadow-md ring-1 ring-slate-100/80 transition hover:shadow-lg">
    <p className="text-[11px] font-bold uppercase tracking-wide text-indigo-900/50">{label}</p>
    <p className="mt-1 text-2xl font-black tabular-nums text-slate-900">{value}</p>
  </div>
);

const InfoCard = ({ title, children }) => (
  <div className="rounded-2xl border border-indigo-100/80 bg-white p-5 shadow-lg shadow-indigo-100/30 ring-1 ring-slate-100/80">
    <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-indigo-900/60">{title}</h3>
    {children}
  </div>
);

const AlertBox = ({ title, items = [] }) => (
  <div className="rounded-2xl border border-indigo-100/80 bg-white p-5 shadow-lg shadow-indigo-100/30 ring-1 ring-slate-100/80">
    <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-indigo-900/60">{title}</h4>
    {items.length === 0 ? (
      <p className="text-sm text-slate-500">No alerts.</p>
    ) : (
      <div className="space-y-2">
        {items.slice(0, 5).map((i, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 text-sm font-medium text-slate-700 transition hover:border-indigo-100 hover:bg-indigo-50/30"
          >
            {i.company_name} ({i.sector})
          </div>
        ))}
      </div>
    )}
  </div>
);

export default AssessorAnalytics;

