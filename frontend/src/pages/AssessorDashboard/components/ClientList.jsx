import React, { useState, useEffect } from 'react';
import { Search, Filter, Users } from 'lucide-react';
import { getStatusColor } from '../AssessorDashboard.utilities';
import { assessmentService } from '../../../services/assessmentService';
import { getIndustryMaturityLevel } from '../../../constants/industryMaturity';

const ClientList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [clients, setClients] = useState([]);
  const [sectors, setSectors] = useState([]);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const [clientsRes, assessmentsRes] = await Promise.all([
          assessmentService.getClients(),
          assessmentService.getAssessments(),
        ]);

        const assessments = assessmentsRes.data || [];
        const latestByClient = new Map();
        for (const a of assessments) {
          const prev = latestByClient.get(a.user);
          const prevTime = prev ? new Date(prev.updated_at || prev.created_at || 0).getTime() : 0;
          const currTime = new Date(a.updated_at || a.created_at || 0).getTime();
          if (!prev || currTime >= prevTime) latestByClient.set(a.user, a);
        }

        // Map backend User data to UI format
        const formattedClients = (clientsRes.data || []).map(user => {
          const latest = latestByClient.get(user.id);
          const status = latest?.reviewed_at
            ? 'Completed'
            : latest?.status === 'submitted'
              ? 'In Review'
              : latest?.status === 'draft'
                ? 'Submitted'
                : 'Pending';
          const score = typeof latest?.score === 'number' ? latest.score : Number(latest?.score || 0);
          const maturityStatus = score > 0 ? getIndustryMaturityLevel(score).label : '—';
          return ({
            id: user.id,
            companyName: user.company_name || user.username,
            contactPersonName: user.username || '—',
            email: user.email || '—',
            phone: user.phone || '—',
            location: user.location || '—',
            sector: user.sector || 'Unknown',
            status,
            assessmentDate: latest?.created_at || null,
            overallScore: score > 0 ? score : 0,
            maturityStatus,
            latestAssessmentId: latest?.id || null,
          });
        });
        setClients(formattedClients);
        setSectors(Array.from(new Set(formattedClients.map((c) => c.sector).filter(Boolean))));
      } catch (err) {
        console.error('Error fetching clients', err);
      }
    };
    loadClients();
  }, []);

  const filteredClients = clients.filter(client => {
    const matchesSearch =
      client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactPersonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'All' || client.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-indigo-100/80 bg-gradient-to-br from-white to-indigo-50/20 p-4 shadow-sm ring-1 ring-indigo-50 sm:flex-row sm:items-end sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-400" aria-hidden />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input rounded-xl border-indigo-100 py-2.5 pl-10 pr-4 focus:border-indigo-400 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <Filter className="h-4 w-4 text-indigo-500" aria-hidden />
            <span>Sector</span>
          </div>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="form-select max-w-[200px] rounded-xl border-indigo-100 py-2.5 text-sm font-medium focus:border-indigo-400"
          >
            <option value="All">All sectors</option>
            {sectors.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredClients.length > 0 ? (
      <div
        className="table-scroll rounded-2xl border border-slate-200/90 shadow-lg shadow-slate-200/40 ring-1 ring-slate-100/80"
        role="region"
        aria-label="Client list table"
      >
        <table className="w-full min-w-[1280px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-indigo-50/40">
              <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Client / Company
              </th>
              <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Sector
              </th>
              <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Contact Person
              </th>
              <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Email
              </th>
              <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Phone
              </th>
              <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Location
              </th>
              <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Current Status
              </th>
              <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Assessment Date
              </th>
              <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Overall Score
              </th>
              <th className="min-w-[10rem] whitespace-nowrap px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Maturity Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredClients.map((client) => (
              <tr
                key={client.id}
                className="group transition-colors hover:bg-indigo-50/40"
              >
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900">{client.companyName}</span>
                    <span className="text-xs text-slate-500">Client: {client.contactPersonName}</span>
                    <span className="text-xs text-slate-400 tracking-wider">ID: {client.id}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-slate-600">{client.sector}</span>
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">{client.contactPersonName}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{client.email}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{client.phone}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{client.location}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${getStatusColor(client.status)}`}>
                    {client.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">{client.assessmentDate ? new Date(client.assessmentDate).toLocaleDateString('en-IN') : '—'}</td>
                <td className="px-4 py-4 text-center">
                  <span className={`text-sm font-bold ${client.overallScore > 75 ? 'text-emerald-600' : 'text-slate-700'}`}>
                    {client.overallScore > 0 ? `${client.overallScore}%` : '—'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-700">
                  {client.maturityStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-14 text-slate-500">
          <Users className="mb-3 h-10 w-10 text-indigo-300" aria-hidden />
          <span className="text-sm font-medium">No clients match your search.</span>
        </div>
      )}
    </div>
  );
};

export default ClientList;
