import React, { useEffect, useMemo, useState } from "react";
import { Filter } from "lucide-react";
import { adminService } from "../../../services/adminService";

const AdminReports = () => {
  const [assessments, setAssessments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sector, setSector] = useState("all");
  const [assessor, setAssessor] = useState("all");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [asRes, mapRes] = await Promise.all([adminService.listAssessments(), adminService.listAssignments()]);
      setAssessments(asRes.data || []);
      setAssignments(mapRes.data || []);
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const assessorOptions = useMemo(() => {
    const set = new Set();
    (assignments || []).forEach((a) => {
      if (a.assessor_name) set.add(a.assessor_name);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [assignments]);

  const sectorOptions = useMemo(() => {
    const set = new Set();
    (assessments || []).forEach((a) => {
      if (a.sector) set.add(a.sector);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [assessments]);

  const assessorByClientId = useMemo(() => {
    const map = new Map();
    (assignments || []).forEach((a) => map.set(a.client, a.assessor_name || a.assessor));
    return map;
  }, [assignments]);

  const filtered = useMemo(() => {
    return (assessments || []).filter((a) => {
      const sOk = sector === "all" ? true : a.sector === sector;
      const assName = assessorByClientId.get(a.user);
      const aOk = assessor === "all" ? true : assName === assessor;
      return sOk && aOk;
    });
  }, [assessments, sector, assessor, assessorByClientId]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const completed = filtered.filter((a) => a.status === "submitted").length;
    const pending = filtered.filter((a) => a.status === "draft").length;
    const avgScore =
      total > 0 ? filtered.reduce((sum, a) => sum + Number(a.score || 0), 0) / total : 0;
    return { total, completed, pending, avgScore };
  }, [filtered]);

  if (loading) return <div className="text-slate-500 py-10 text-center">Loading reports...</div>;

  return (
    <div className="space-y-6">
      {error && <div className="text-sm text-rose-600 font-semibold bg-rose-50 border border-rose-200 rounded-xl p-3">{error}</div>}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-end md:justify-between">
          <div className="flex items-center gap-2 text-sm font-black text-slate-900">
            <Filter className="w-4 h-4 text-indigo-600" />
            Report Filters
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Sector</label>
              <select value={sector} onChange={(e) => setSector(e.target.value)} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20">
                <option value="all">All</option>
                {sectorOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Assessor</label>
              <select value={assessor} onChange={(e) => setAssessor(e.target.value)} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20">
                <option value="all">All</option>
                {assessorOptions.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Assessments", value: stats.total },
          { label: "Completed", value: stats.completed },
          { label: "Pending", value: stats.pending },
          { label: "Avg Score", value: stats.avgScore.toFixed(2) },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{c.label}</div>
            <div className="mt-2 text-2xl font-black text-slate-900">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Assessment</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Assessor</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sector</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-600">#{a.id}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{a.client_name || "—"}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{assessorByClientId.get(a.user) || "—"}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{a.sector || "—"}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{Number(a.score || 0).toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{a.status}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                    No assessments match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;

