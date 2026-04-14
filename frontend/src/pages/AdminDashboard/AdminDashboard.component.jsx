import React, { useEffect, useMemo, useState } from "react";
import { Users, UserCog, Link2, Activity, BarChart3 } from "lucide-react";

import { getAuth } from "../../utils/auth";
import { ROLES } from "../../constants/roles";
import { adminService } from "../../services/adminService";

import { ADMIN_TABS } from "./AdminDashboard.constants";
import {
  ClientManagement,
  AssessorManagement,
  AssignmentManagement,
  AssessmentMonitoring,
  AdminReports,
} from "./components";

const AdminDashboard = () => {
  const user = getAuth();
  const role = user?.role;

  const [activeTab, setActiveTab] = useState("clients");
  const [summary, setSummary] = useState({
    totalClients: 0,
    totalAssessors: 0,
    totalAssessments: 0,
    pendingAssessments: 0,
    completedAssessments: 0,
  });
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [summaryError, setSummaryError] = useState("");

  const canAccess = role === ROLES.ADMIN;

  const tabIcon = useMemo(
    () => ({
      clients: Users,
      assessors: UserCog,
      assignments: Link2,
      monitoring: Activity,
      reports: BarChart3,
    }),
    [],
  );

  const loadSummary = async () => {
    setLoadingSummary(true);
    setSummaryError("");
    try {
      const res = await adminService.getSummary();
      setSummary(res.data || summary);
    } catch (err) {
      setSummaryError(err?.response?.data?.detail || err?.message || "Failed to load admin summary.");
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    if (!canAccess) return;
    loadSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAccess]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm w-full max-w-lg">
          <h1 className="text-xl font-black text-slate-900">Sign in required</h1>
          <p className="mt-2 text-slate-600 text-sm">You must be logged in to access the Admin dashboard.</p>
        </div>
      </div>
    );
  }

  if (!canAccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm w-full max-w-lg">
          <h1 className="text-xl font-black text-slate-900">Access denied</h1>
          <p className="mt-2 text-slate-600 text-sm">
            This dashboard is only available to users with role <span className="font-bold">admin</span>.
          </p>
        </div>
      </div>
    );
  }

  const cards = [
    { label: "Total Clients", value: summary.totalClients },
    { label: "Total Assessors", value: summary.totalAssessors },
    { label: "Total Assessments", value: summary.totalAssessments },
    { label: "Pending Assessments", value: summary.pendingAssessments },
    { label: "Completed Assessments", value: summary.completedAssessments },
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-clip">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 min-w-0">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Admin</p>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Operations Dashboard</h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage clients, assessors, assignments, and monitor assessments.
            </p>
          </div>
          <button
            onClick={loadSummary}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Refresh summary
          </button>
        </header>

        {summaryError && (
          <div className="text-sm text-rose-600 font-semibold bg-rose-50 border border-rose-200 rounded-xl p-3">
            {summaryError}
          </div>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {cards.map((c) => (
            <div key={c.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{c.label}</div>
              <div className="mt-2 text-2xl font-black text-slate-900">
                {loadingSummary ? "…" : c.value}
              </div>
            </div>
          ))}
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50/60 px-3 sm:px-4 py-3">
            <div className="flex flex-nowrap sm:flex-wrap gap-2 overflow-x-auto overscroll-x-contain touch-pan-x pb-1 sm:pb-0">
              {ADMIN_TABS.map((t) => {
                const Icon = tabIcon[t.key] || Users;
                const active = activeTab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`inline-flex shrink-0 items-center gap-2 px-3 py-2 rounded-lg text-sm font-black transition-colors border whitespace-nowrap ${
                      active
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === "clients" && <ClientManagement />}
            {activeTab === "assessors" && <AssessorManagement />}
            {activeTab === "assignments" && <AssignmentManagement />}
            {activeTab === "monitoring" && <AssessmentMonitoring />}
            {activeTab === "reports" && <AdminReports />}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;

