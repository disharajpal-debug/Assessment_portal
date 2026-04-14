import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { superuserService } from "../../../services/superuserService";

const statusBadgeClass = (status) => {
  switch (String(status || "").toLowerCase()) {
    case "completed":
    case "submitted":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "in_progress":
    case "in progress":
    case "draft":
      return "bg-amber-100 text-amber-700 border-amber-200";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

const normalize = (value) =>
  String(value || "")
    .replaceAll("_", " ")
    .trim();

const DUMMY_PREVIEW_ROWS = [
  {
    assessorId: "preview-assessor-1",
    assessorName: "Assessor Preview",
    assessorEmail: "assessor.preview@c4i4.org",
    assignedSectors: [
      { code: "textile", name: "Textile" },
      { code: "chemicals", name: "Chemicals" },
    ],
    companiesBySector: {
      textile: [
        {
          id: "c-1",
          companyName: "Disha Textiles Pvt Ltd",
          clientName: "disha_client",
          sectorName: "Textile",
          submittedAssignments: 3,
          submittedStatus: "submitted",
          assessorReviewStatus: "reviewed",
        },
        {
          id: "c-2",
          companyName: "Alpha Looms Ltd",
          clientName: "alpha_client",
          sectorName: "Textile",
          submittedAssignments: 1,
          submittedStatus: "submitted",
          assessorReviewStatus: "pending_review",
        },
      ],
      chemicals: [
        {
          id: "c-3",
          companyName: "ChemPro Industries",
          clientName: "chempro_client",
          sectorName: "Chemicals",
          submittedAssignments: 2,
          submittedStatus: "submitted",
          assessorReviewStatus: "reviewed",
        },
      ],
    },
  },
];

const renderCompanyTable = (companies) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead className="border-b border-slate-100 bg-slate-50">
        <tr>
          <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Company Name</th>
          <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Client Name</th>
          <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Sector</th>
          <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Submitted Assignments</th>
          <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Submitted Status</th>
          <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Assessor Review Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {companies.length === 0 ? (
          <tr>
            <td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-500">
              No companies assigned in this sector.
            </td>
          </tr>
        ) : (
          companies.map((company) => (
            <tr key={company.id} className="hover:bg-slate-50">
              <td className="px-5 py-3 font-semibold text-slate-900">{company.companyName || "—"}</td>
              <td className="px-5 py-3 text-sm text-slate-700">{company.clientName || "—"}</td>
              <td className="px-5 py-3 text-sm text-slate-700">{company.sectorName || "—"}</td>
              <td className="px-5 py-3 text-sm font-bold text-slate-900">{company.submittedAssignments ?? 0}</td>
              <td className="px-5 py-3">
                <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${statusBadgeClass(company.submittedStatus)}`}>
                  {normalize(company.submittedStatus).toUpperCase()}
                </span>
              </td>
              <td className="px-5 py-3">
                <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${statusBadgeClass(company.assessorReviewStatus)}`}>
                  {normalize(company.assessorReviewStatus).toUpperCase()}
                </span>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

const AssessorSectorManagement = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rows, setRows] = useState([]);
  const [selectedSector, setSelectedSector] = useState({});

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [usersRes, assignmentsRes, assessmentsRes, sectorsRes] = await Promise.all([
          superuserService.listUsers(),
          superuserService.listAssignments(),
          superuserService.listAssessments(),
          superuserService.listSectors(),
        ]);
        if (cancelled) return;

        const users = usersRes?.data || [];
        const assignments = assignmentsRes?.data || [];
        const assessments = assessmentsRes?.data || [];
        const sectors = sectorsRes?.data || [];

        const clientsById = new Map(users.filter((u) => u.role === "client").map((u) => [u.id, u]));
        const sectorNameByCode = new Map(sectors.map((s) => [s.code, s.name]));

        const latestByClientSector = new Map();
        const submittedCountByClientSector = new Map();
        for (const a of assessments) {
          const key = `${a.user}::${a.sector}`;
          const prev = latestByClientSector.get(key);
          const prevTime = prev ? new Date(prev.updated_at || prev.created_at || 0).getTime() : 0;
          const currTime = new Date(a.updated_at || a.created_at || 0).getTime();
          if (!prev || currTime >= prevTime) latestByClientSector.set(key, a);
          if (String(a.status || "").toLowerCase() === "submitted") {
            submittedCountByClientSector.set(key, (submittedCountByClientSector.get(key) || 0) + 1);
          }
        }

        const assessorUsers = users.filter((u) => u.role === "assessor");
        const computed = assessorUsers.map((assessor) => {
          const assignedSectorCodes = Array.isArray(assessor.assessor_sectors)
            ? assessor.assessor_sectors
            : [];
          const assignedSectors = assignedSectorCodes.map((code) => ({
            code,
            name: sectorNameByCode.get(code) || code,
          }));

          const companiesBySector = assignedSectorCodes.reduce((acc, code) => {
            acc[code] = [];
            return acc;
          }, {});

          for (const mapping of assignments) {
            if (Number(mapping.assessor) !== Number(assessor.id)) continue;
            const client = clientsById.get(mapping.client);
            if (!client) continue;
            const sectorCode = client.sector || "";
            if (!companiesBySector[sectorCode]) continue;

            const latest = latestByClientSector.get(`${client.id}::${sectorCode}`);
            companiesBySector[sectorCode].push({
              id: client.id,
              companyName: client.company_name || "—",
              clientName: client.username,
              sectorName: sectorNameByCode.get(sectorCode) || sectorCode || "—",
              submittedAssignments: submittedCountByClientSector.get(`${client.id}::${sectorCode}`) || 0,
              submittedStatus: latest?.status || "no_submission",
              assessorReviewStatus: latest?.reviewed_at ? "reviewed" : "pending_review",
            });
          }

          return {
            assessorId: assessor.id,
            assessorName: assessor.username,
            assessorEmail: assessor.email,
            assignedSectors,
            companiesBySector,
          };
        });

        setRows(computed);
        setSelectedSector((prev) => {
          const next = { ...prev };
          for (const row of computed) {
            const current = next[row.assessorId];
            const exists = row.assignedSectors.some((s) => s.code === current);
            if (!exists) {
              next[row.assessorId] = row.assignedSectors[0]?.code || "";
            }
          }
          return next;
        });
      } catch (err) {
        if (cancelled) return;
        setError(err?.response?.data?.detail || err?.message || "Failed to load assessor management data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div className="py-10 text-center text-slate-500">Loading assessor management...</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-sm font-semibold text-indigo-700">
        Preview mode includes dummy data so you can validate layout. We can remove this after your approval.
      </div>
      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-600">{error}</div>}

      {DUMMY_PREVIEW_ROWS.map((row) => {
        const activeSectorCode = selectedSector[row.assessorId] || row.assignedSectors[0]?.code || "";
        const companies = row.companiesBySector[activeSectorCode] || [];

        return (
          <div key={row.assessorId} className="rounded-2xl border border-indigo-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-indigo-100 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">{row.assessorName} (Dummy)</h3>
                <p className="text-sm text-slate-500">{row.assessorEmail}</p>
              </div>
              <select
                value={activeSectorCode}
                onChange={(e) =>
                  setSelectedSector((prev) => ({ ...prev, [row.assessorId]: e.target.value }))
                }
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {row.assignedSectors.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            {renderCompanyTable(companies)}
          </div>
        );
      })}

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <Users className="mx-auto mb-3 h-10 w-10 text-slate-300" />
          <p className="font-medium text-slate-500">No assessors found.</p>
        </div>
      ) : (
        rows.map((row) => {
          const activeSectorCode = selectedSector[row.assessorId] || "";
          const activeSectorName =
            row.assignedSectors.find((s) => s.code === activeSectorCode)?.name || "—";
          const companies = row.companiesBySector[activeSectorCode] || [];

          return (
            <div key={row.assessorId} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900">{row.assessorName}</h3>
                  <p className="text-sm text-slate-500">{row.assessorEmail}</p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  {row.assignedSectors.length > 1 ? (
                    <select
                      value={activeSectorCode}
                      onChange={(e) =>
                        setSelectedSector((prev) => ({ ...prev, [row.assessorId]: e.target.value }))
                      }
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      {row.assignedSectors.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                      {activeSectorName}
                    </span>
                  )}
                  <span className="text-sm font-semibold text-slate-600">
                    Companies: <span className="text-slate-900">{companies.length}</span>
                  </span>
                </div>
              </div>

              {renderCompanyTable(companies.map((c) => ({ ...c, id: `${row.assessorId}-${activeSectorCode}-${c.id}` })))}
            </div>
          );
        })
      )}
    </div>
  );
};

export default AssessorSectorManagement;

