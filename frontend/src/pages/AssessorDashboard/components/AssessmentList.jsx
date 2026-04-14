import React, { useState, useEffect } from 'react';
import { Filter, Eye, FileText, Clock, ClipboardCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../AssessorDashboard.utilities';
import { assessmentService } from '../../../services/assessmentService';

const AssessmentList = () => {
  const navigate = useNavigate();
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [assessments, setAssessments] = useState([]);
  const [sectors, setSectors] = useState([]);

  useEffect(() => {
    const loadAssessments = async () => {
      try {
        const [assessmentRes, clientRes] = await Promise.all([
          assessmentService.getAssessments(),
          assessmentService.getClients(),
        ]);
        const clientsById = Object.fromEntries(
          (clientRes.data || []).map((u) => [u.id, u]),
        );

        const availableSectors = Array.from(
          new Set((assessmentRes.data || []).map((a) => a.sector).filter(Boolean)),
        );
        setSectors(availableSectors);

        const formatted = (assessmentRes.data || []).map(asmt => ({
          id: asmt.id,
          rawId: asmt.id,
          clientName: asmt.client_name || `User #${asmt.user}`,
          companyName: clientsById?.[asmt.user]?.company_name || '—',
          sector: asmt.sector,
          clientStatus:
            asmt.status === 'submitted'
              ? 'Submitted by Client'
              : asmt.status === 'draft'
                ? 'Started by Client'
                : 'Not Started',
          reviewStatus:
            asmt.reviewed_at
              ? 'Reviewed by Assessor'
              : asmt.status === 'submitted'
                ? 'Pending Assessor Review'
                : 'Not Ready for Review',
          status:
            asmt.reviewed_at
              ? 'Done (Assessed)'
              : asmt.status === 'submitted'
                ? 'In Progress (Assessor)'
                : asmt.status === 'draft'
                  ? 'In Progress (Client)'
                  : 'Pending',
          score: asmt.score,
          date: asmt.created_at,
          lastUpdated: asmt.updated_at || asmt.created_at,
        }));
        setAssessments(formatted);
      } catch (err) {
        console.error('Error fetching assessments', err);
      }
    };
    loadAssessments();
  }, []);

  const filteredAssessments = assessments.filter(asmt => {
    const matchesSector = selectedSector === 'All' || asmt.sector === selectedSector;
    const matchesStatus = selectedStatus === 'All' || asmt.status === selectedStatus;
    return matchesSector && matchesStatus;
  });
  const statusOptions = Array.from(new Set(assessments.map((a) => a.status)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-indigo-100/80 bg-gradient-to-br from-white to-indigo-50/20 p-4 shadow-sm ring-1 ring-indigo-50 md:flex-row md:flex-wrap md:items-end md:gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <Filter className="h-4 w-4 text-indigo-500" aria-hidden />
            <span>Sector</span>
          </div>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="form-select min-w-[160px] rounded-xl border-indigo-100 py-2.5 text-sm font-medium focus:border-indigo-400"
          >
            <option value="All">All sectors</option>
            {sectors.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <Clock className="h-4 w-4 text-indigo-500" aria-hidden />
            <span>Status</span>
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="form-select min-w-[200px] rounded-xl border-indigo-100 py-2.5 text-sm font-medium focus:border-indigo-400"
          >
            <option value="All">All statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredAssessments.length > 0 ? (
      <div
        className="table-scroll rounded-2xl border border-slate-200/90 shadow-lg shadow-slate-200/40 ring-1 ring-slate-100/80"
        role="region"
        aria-label="Assessments table"
      >
        <table className="w-full min-w-[1100px] border-collapse bg-white text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-indigo-50/40">
              <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">ID</th>
              <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">Client</th>
              <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">Company</th>
              <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">Sector</th>
              <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">Score</th>
              <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">Client Status</th>
              <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">Review Status</th>
              <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">Last Updated</th>
              <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAssessments.map((asmt) => (
              <tr key={asmt.id} className="transition-colors hover:bg-indigo-50/40">
                <td className="px-4 py-3 text-sm font-semibold text-slate-700">{asmt.id}</td>
                <td className="px-4 py-3 text-sm text-slate-900">{asmt.clientName}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{asmt.companyName}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{asmt.sector || '—'}</td>
                <td className="px-4 py-3 text-sm font-semibold text-slate-900">{asmt.score ?? 0}%</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset ${
                    asmt.clientStatus === 'Submitted by Client'
                      ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                      : asmt.clientStatus === 'Started by Client'
                        ? 'bg-blue-50 text-blue-700 ring-blue-600/20'
                        : 'bg-slate-50 text-slate-700 ring-slate-600/20'
                  }`}>
                    {asmt.clientStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset ${
                    asmt.reviewStatus === 'Reviewed by Assessor'
                      ? 'bg-violet-50 text-violet-700 ring-violet-600/20'
                      : asmt.reviewStatus === 'Pending Assessor Review'
                        ? 'bg-amber-50 text-amber-700 ring-amber-600/20'
                        : 'bg-slate-50 text-slate-700 ring-slate-600/20'
                  }`}>
                    {asmt.reviewStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">{formatDate(asmt.lastUpdated)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/assessor/edit/${asmt.id}`)}
                      className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-indigo-500/25 transition hover:from-indigo-500 hover:to-violet-500"
                    >
                      <Eye className="h-3.5 w-3.5" aria-hidden />
                      Edit / Review
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/assessor/report/${asmt.id}`)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/50"
                    >
                      <FileText className="h-3.5 w-3.5" aria-hidden />
                      Report
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-14 text-slate-500">
          <ClipboardCheck className="mb-3 h-10 w-10 text-indigo-300" aria-hidden />
          <span className="text-sm font-medium">No assessments match your filters.</span>
        </div>
      )}
    </div>
  );
};

export default AssessmentList;
