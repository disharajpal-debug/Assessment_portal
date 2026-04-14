import React, { useEffect, useState } from "react";
import {
  Users,
  Layers,
  Settings,
  Database,
  BarChartBig,
  Shield,
  ClipboardList,
} from "lucide-react";

import { getAuth } from "../../utils/auth";
import { superuserService } from "../../services/superuserService";

import UserManagement from "./components/UserManagement";
import SectorManagement from "./components/SectorManagement";
import QuestionManagement from "./components/QuestionManagement";
import SuperUserGlobalReport from "./components/SuperUserGlobalReport";
import AssessorSectorManagement from "./components/AssessorSectorManagement";

const SuperUserDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalAssessments: 0,
    totalSectors: 0,
    activeAssessors: 0,
  });
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [summaryError, setSummaryError] = useState("");

  const user = getAuth();
  const role = user?.role;

  // Strict role protection (require role === "superuser")
  if (role !== "superuser") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md border border-slate-200">
          <Shield className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-black text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-500 font-medium text-sm">
            You do not have the required <span className="font-bold">superuser</span> clearance.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    let cancelled = false;
    const loadSummary = async () => {
      setLoadingSummary(true);
      setSummaryError("");
      try {
        const res = await superuserService.getSummary();
        if (cancelled) return;
        setSummary({
          totalUsers: res.data.totalUsers ?? 0,
          totalAssessments: res.data.totalAssessments ?? 0,
          totalSectors: res.data.totalSectors ?? 0,
          activeAssessors: res.data.activeAssessors ?? 0,
        });
      } catch (err) {
        if (cancelled) return;
        setSummaryError(err?.response?.data?.detail || err?.message || "Failed to load summary.");
      } finally {
        if (!cancelled) setLoadingSummary(false);
      }
    };
    loadSummary();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = [
    { label: "Total Users", value: summary.totalUsers, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Total Assessments", value: summary.totalAssessments, icon: Database, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Total Sectors", value: summary.totalSectors, icon: Layers, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Active Assessors", value: summary.activeAssessors, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-6 lg:p-8 pb-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight break-words">SuperUser Control Panel</h1>
            <p className="text-slate-500 font-medium text-sm sm:text-base">Manage platform architecture, user roles, routing and core analytics.</p>
          </div>
          <div className="flex items-stretch sm:items-center gap-3 shrink-0">
            <button type="button" className="hidden sm:inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
              <Settings className="w-4 h-4" />
              Platform Settings
            </button>
          </div>
        </div>

        {/* Global Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-900 leading-none">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {loadingSummary === false && summaryError && (
          <div className="text-sm text-rose-600 font-semibold bg-rose-50 border border-rose-200 rounded-xl p-3">
            {summaryError}
          </div>
        )}

        {/* Content Tabs Area */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row md:min-h-[560px]">
          
          {/* Vertical Sidebar Tabs on Desktop */}
          <div className="w-full md:w-64 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 shrink-0">
            <div className="p-3 sm:p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible overscroll-x-contain touch-pan-x">
              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap 
                  ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'}
                `}
              >
                <Users className="w-5 h-5 flex-shrink-0" />
                User Access Management
              </button>
              
              <button
                onClick={() => setActiveTab('sectors')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap 
                  ${activeTab === 'sectors' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'}
                `}
              >
                <Layers className="w-5 h-5 flex-shrink-0" />
                Sector Configurations
              </button>

              <button
                onClick={() => setActiveTab('questions')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap 
                  ${activeTab === 'questions' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'}
                `}
              >
                <Database className="w-5 h-5 flex-shrink-0" />
                Question Database
              </button>

              <button
                onClick={() => setActiveTab('assessor-management')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap 
                  ${activeTab === 'assessor-management' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'}
                `}
              >
                <ClipboardList className="w-5 h-5 flex-shrink-0" />
                Assessor Management
              </button>

              <div className="my-2 border-t border-slate-200 hidden md:block"></div>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap 
                  ${activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'}
                `}
              >
                <BarChartBig className="w-5 h-5 flex-shrink-0" />
                Global Analytics
              </button>
            </div>
          </div>

          {/* Tab Render Area */}
          <div className="flex-1 bg-slate-50">
            {activeTab === 'analytics' ? (
              <SuperUserGlobalReport />
            ) : (
              <div className="p-4 sm:p-6 md:p-8 h-full bg-white rounded-tl-2xl border-t md:border-t-0 md:border-l border-slate-200 min-w-0">
                {activeTab === "users" && <UserManagement />}
                {activeTab === "sectors" && <SectorManagement />}
                {activeTab === "questions" && <QuestionManagement />}
                {activeTab === "assessor-management" && <AssessorSectorManagement />}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default SuperUserDashboard;
