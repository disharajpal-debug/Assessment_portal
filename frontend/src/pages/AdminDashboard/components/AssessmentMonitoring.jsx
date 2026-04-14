import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { adminService } from "../../../services/adminService";
import { badgeClass, formatDate } from "../AdminDashboard.utilities";

const AssessmentMonitoring = () => {
  const [assessments, setAssessments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [asRes, mapRes] = await Promise.all([adminService.listAssessments(), adminService.listAssignments()]);
      setAssessments(asRes.data || []);
      setAssignments(mapRes.data || []);
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || "Failed to load assessments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const assessorNameByClientId = useMemo(() => {
    const map = new Map();
    (assignments || []).forEach((a) => {
      map.set(a.client, a.assessor_name || a.assessor);
    });
    return map;
  }, [assignments]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return assessments;
    return (assessments || []).filter((a) => {
      return (
        String(a.id).includes(q) ||
        String(a.client_name || "").toLowerCase().includes(q) ||
        String(a.sector || "").toLowerCase().includes(q) ||
        String(a.status || "").toLowerCase().includes(q)
      );
    });
  }, [assessments, search]);

  if (loading) return <div className="text-slate-500 py-10 text-center">Loading assessments...</div>;

  return (
    <div className="space-y-6">
      {error && <div className="text-sm text-rose-600 font-semibold bg-rose-50 border border-rose-200 rounded-xl p-3">{error}</div>}

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search assessments..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Assessment ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Assessor</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(filtered || []).map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-600">#{a.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 text-sm">{a.client_name || "—"}</div>
                    <div className="text-xs text-slate-500">{a.sector || "—"}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{assessorNameByClientId.get(a.user) || "—"}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{Number(a.score || 0).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black uppercase border ${badgeClass(a.status)}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{formatDate(a.created_at)}</td>
                </tr>
              ))}
              {filtered?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                    No assessments found.
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

export default AssessmentMonitoring;

