import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { superuserService } from "../../../services/superuserService";
import { getAllQuestions } from "../../Assessment/questions";

const CHART_TYPES = [
  { value: "bar", label: "Bar Chart" },
  { value: "pie", label: "Pie Chart" },
];

const COLORS = ["#4f46e5", "#6366f1", "#8b5cf6", "#06b6d4", "#10b981"];

const flattenQuestions = (nodes) => {
  const out = [];
  const walk = (arr) => {
    (arr || []).forEach((q) => {
      out.push(q);
      if (q.children?.length) walk(q.children);
    });
  };
  walk(nodes);
  return out;
};

const SuperUserGlobalReport = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sectors, setSectors] = useState([]);
  const [users, setUsers] = useState([]);
  const [assessments, setAssessments] = useState([]);

  const [selectedSector, setSelectedSector] = useState("");
  const [selectedQuestionType, setSelectedQuestionType] = useState("basic");
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [selectedChartType, setSelectedChartType] = useState("bar");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [sectorsRes, usersRes, assessmentsRes] = await Promise.all([
          superuserService.listSectors(),
          superuserService.listUsers(),
          superuserService.listAssessments(),
        ]);
        if (cancelled) return;
        setSectors(sectorsRes?.data || []);
        setUsers(usersRes?.data || []);
        setAssessments(assessmentsRes?.data || []);
      } catch (err) {
        if (cancelled) return;
        setError(err?.response?.data?.detail || err?.message || "Failed to load analytics data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedSector && sectors.length > 0) {
      setSelectedSector(sectors[0].code);
    }
  }, [selectedSector, sectors]);

  const questionsForSector = useMemo(() => {
    if (!selectedSector) return [];
    return flattenQuestions(getAllQuestions(selectedSector)).filter(
      (q) => Array.isArray(q.options) && q.options.length > 0,
    );
  }, [selectedSector]);

  const questionTypeOptions = useMemo(
    () => questionsForSector.filter((q) => q.type === selectedQuestionType),
    [questionsForSector, selectedQuestionType],
  );

  useEffect(() => {
    if (!questionTypeOptions.length) {
      setSelectedQuestionId("");
      return;
    }
    const exists = questionTypeOptions.some((q) => String(q.id) === String(selectedQuestionId));
    if (!exists) {
      setSelectedQuestionId(String(questionTypeOptions[0].id));
    }
  }, [questionTypeOptions, selectedQuestionId]);

  const selectedQuestion = useMemo(
    () => questionTypeOptions.find((q) => String(q.id) === String(selectedQuestionId)),
    [questionTypeOptions, selectedQuestionId],
  );

  const usersById = useMemo(() => new Map((users || []).map((u) => [u.id, u])), [users]);

  const analytics = useMemo(() => {
    const base = [1, 2, 3, 4, 5].map((score) => ({
      score,
      label: `Option ${score}`,
      count: 0,
      companies: [],
    }));
    if (!selectedQuestion || !selectedSector) return base;

    const optionScoreByText = new Map(
      (selectedQuestion.options || [])
        .filter((o) => typeof o?.text === "string" && typeof o?.score === "number")
        .map((o) => [o.text, o.score]),
    );

    const submittedInSector = (assessments || []).filter(
      (a) => a?.sector === selectedSector && String(a?.status || "").toLowerCase() === "submitted",
    );

    for (const a of submittedInSector) {
      const responses = a?.responses_out || a?.responses || [];
      const match = responses.find((r) => String(r?.question_id) === String(selectedQuestion.id));
      if (!match) continue;

      const score = optionScoreByText.get(match?.selected_option);
      if (![1, 2, 3, 4, 5].includes(score)) continue;

      const idx = score - 1;
      base[idx].count += 1;
      const user = usersById.get(a.user);
      const companyName = user?.company_name || user?.username || `Company-${a.user}`;
      base[idx].companies.push(companyName);
    }

    return base;
  }, [assessments, selectedQuestion, selectedSector, usersById]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-slate-900">Global Analytics</h2>
        <p className="mt-1 text-sm text-slate-500">
          Sector-wise question analytics with option distribution and company-level drilldown.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Sector</label>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            disabled={loading}
          >
            {sectors.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Question Type</label>
          <select
            value={selectedQuestionType}
            onChange={(e) => setSelectedQuestionType(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="basic">Basic</option>
            <option value="functional">Functional</option>
            <option value="sector">Sector</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Question</label>
          <select
            value={selectedQuestionId}
            onChange={(e) => setSelectedQuestionId(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            disabled={!questionTypeOptions.length}
          >
            {questionTypeOptions.length === 0 ? (
              <option value="">No questions</option>
            ) : (
              questionTypeOptions.map((q) => (
                <option key={q.id} value={String(q.id)}>
                  {q.id} - {q.text}
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Chart Type</label>
          <select
            value={selectedChartType}
            onChange={(e) => setSelectedChartType(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {CHART_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Selected Question</h3>
        <p className="mt-1 text-sm font-semibold text-slate-800">{selectedQuestion?.text || "—"}</p>
        <div className="mt-5 h-[340px] w-full">
          {selectedChartType === "pie" ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={analytics} dataKey="count" nameKey="label" innerRadius={70} outerRadius={110}>
                  {analytics.map((entry, index) => (
                    <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 12, fontWeight: 700 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {analytics.map((entry, index) => (
                    <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">Companies by Option</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-100 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Option</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Count</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Companies</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {analytics.map((row) => (
                <tr key={row.label} className="align-top">
                  <td className="px-4 py-3 text-sm font-bold text-slate-800">{row.label}</td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-900">{row.count}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {row.companies.length ? row.companies.join(", ") : "No companies"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperUserGlobalReport;
