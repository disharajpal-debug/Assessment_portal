import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  Users, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Globe, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Calendar
} from 'lucide-react';
import { SECTORS } from './GlobalReport.constants';
import { calculateGlobalMetrics } from './GlobalReport.utilities';
import { assessmentService } from '../../../services/assessmentService';
import { getAllQuestions } from '../../Assessment/questions';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'];
const PIE_COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];

const GlobalReport = () => {
  const [selectedSector, setSelectedSector] = useState('All');

  const [rawAssessments, setRawAssessments] = useState([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setFetching(true);
      try {
        const res = await assessmentService.getAssessments();
        if (!cancelled) {
          const next = (res.data || []).map((a) => ({
            ...a,
            responses: a.responses_out || a.responses || [],
          }));
          setRawAssessments(next);
        }
      } catch (err) {
        console.error('GlobalReport fetch error:', err);
        if (!cancelled) setRawAssessments([]);
      } finally {
        if (!cancelled) setFetching(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const normalizedAssessments = useMemo(() => {
    if (!rawAssessments || rawAssessments.length === 0) return [];

    const sectorCache = new Map();

    const flattenQuestions = (questions) => {
      const flat = [];
      const walk = (nodes) => {
        (nodes || []).forEach((q) => {
          flat.push(q);
          if (q.children && q.children.length > 0) {
            walk(q.children);
          }
        });
      };
      walk(questions);
      return flat;
    };

    const getSectorCache = (sector) => {
      if (sectorCache.has(sector)) return sectorCache.get(sector);

      const questionsTree = getAllQuestions(sector);
      const flatQuestions = flattenQuestions(questionsTree);

      const qTextById = {};
      const optByQidText = {};

      flatQuestions.forEach((q) => {
        if (q?.id != null) qTextById[String(q.id)] = q.text;

        if (Array.isArray(q?.options) && q.options.length > 0) {
          optByQidText[String(q.id)] = {};
          q.options.forEach((opt) => {
            if (opt && typeof opt.text === 'string') {
              optByQidText[String(q.id)][opt.text] = opt;
            }
          });
        }
      });

      const cache = { qTextById, optByQidText };
      sectorCache.set(sector, cache);
      return cache;
    };

    return rawAssessments.map((asmt) => {
      const sector = asmt.sector;
      const { qTextById, optByQidText } = getSectorCache(sector);

      const percentage = typeof asmt.score === 'number' ? asmt.score : parseFloat(asmt.score) || 0;

      const normalizedResponses = (asmt.responses || [])
        .map((r) => {
          const qid = r.question_id ?? r.questionId;
          const selectedText = r.selected_option ?? r.selectedOption;
          if (qid == null || typeof selectedText !== 'string') return null;

          const qidStr = String(qid);
          const opt = optByQidText?.[qidStr]?.[selectedText];
          if (!opt || opt.isNA) return null;
          if (typeof opt.score !== 'number') return null;

          const qText = qTextById?.[qidStr];
          if (!qText) return null;

          return {
            q: qText,
            score: opt.score,
            highlight: r.highlight || '',
            lowlight: r.lowlight || '',
            recommendation: r.recommendation || '',
          };
        })
        .filter(Boolean);

      return {
        id: asmt.id,
        sector: asmt.sector,
        date: asmt.created_at,
        reviewedAt: asmt.reviewed_at || null,
        score: { percentage },
        responses: normalizedResponses,
      };
    });
  }, [rawAssessments]);

  const filteredData = useMemo(() => {
    if (selectedSector === 'All') return normalizedAssessments;
    return normalizedAssessments.filter((a) => a.sector === selectedSector);
  }, [selectedSector, normalizedAssessments]);

  const metrics = useMemo(() => calculateGlobalMetrics(filteredData), [filteredData]);

  const summaryCards = [
    { 
      label: 'Total Assessments', 
      value: metrics.totalAssessments, 
      icon: Users, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      trend: { val: '+12%', pos: true }
    },
    { 
      label: 'Average Score (%)', 
      value: `${metrics.averageScore}%`, 
      icon: TrendingUp, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50',
      trend: { val: '+5%', pos: true }
    },
    { 
      label: 'Best Sector', 
      value: metrics.bestSector.name, 
      sub: `${metrics.bestSector.score}% avg`,
      icon: CheckCircle2, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50'
    },
    { 
      label: 'Lowest Sector', 
      value: metrics.lowestSector.name, 
      sub: `${metrics.lowestSector.score}% avg`,
      icon: AlertTriangle, 
      color: 'text-rose-600', 
      bg: 'bg-rose-50'
    },
    {
      label: 'Reviewed Assessments',
      value: metrics.reviewedAssessments,
      icon: CheckCircle2,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      {fetching && (
        <div className="mb-6 text-sm font-semibold text-slate-600">
          Loading analytics from database...
        </div>
      )}
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200">
              <Globe className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Global Analytics</h1>
              <p className="text-slate-500 font-medium tracking-wide flex items-center gap-2">
                Unified performance metrics across all industry sectors
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 border-l border-slate-100 pl-6">
            <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 cursor-default">
              <Calendar className="w-4 h-4" />
              FY 2026-27
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Filter:</span>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select 
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="All">All Sectors</option>
                  {SECTORS.map(s => (
                    <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Global Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {summaryCards.map((card, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${card.bg} group-hover:scale-110 transition-transform`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                {card.trend && (
                  <span className={`flex items-center gap-0.5 text-xs font-black px-2 py-1 rounded-full ${card.trend.pos ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {card.trend.pos ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {card.trend.val}
                  </span>
                )}
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
              <h3 className="text-3xl font-black text-slate-900 leading-none">{card.value}</h3>
              {card.sub && <p className="mt-2 text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-md inline-block uppercase tracking-tighter">{card.sub}</p>}
            </div>
          ))}
        </div>

        {/* Analytics Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sector Performance Bar Chart */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Sector Benchmarking</h3>
              </div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.sectorAverages} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                    padding={{ left: 20, right: 20 }}
                  />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 800 }}
                  />
                  <Bar 
                    dataKey="score" 
                    fill="#6366f1" 
                    radius={[12, 12, 0, 0]} 
                    barSize={40}
                    label={{ position: 'top', fill: '#1e293b', fontSize: 12, fontWeight: 900, formatter: v => `${v}%` }}
                  >
                    {metrics.sectorAverages.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Maturity Distribution Pie Chart */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Global Maturity Distribution</h3>
            <div className="h-[300px] w-full flex-grow">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.maturityDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {metrics.maturityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    align="center" 
                    iconType="circle"
                    formatter={(val) => <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Dynamic Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Strengths Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-emerald-500 p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-white" />
              <h4 className="text-sm font-black text-white uppercase tracking-widest">Global Strengths</h4>
            </div>
            <div className="p-6 space-y-4">
              {metrics.insights.strengths.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-sm font-bold text-slate-700">{item.q}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-emerald-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${(item.avg / 5) * 100}%` }} />
                    </div>
                    <span className="text-xs font-black text-emerald-600">{item.avg.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weaknesses Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-rose-500 p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-white" />
              <h4 className="text-sm font-black text-white uppercase tracking-widest">Growth Opportunities</h4>
            </div>
            <div className="p-6 space-y-4">
              {metrics.insights.weaknesses.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-sm font-bold text-slate-700">{item.q}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-rose-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500" style={{ width: `${(item.avg / 5) * 100}%` }} />
                    </div>
                    <span className="text-xs font-black text-rose-600">{item.avg.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Assessor Insight Signals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h4 className="text-sm font-black text-emerald-700 uppercase tracking-wider mb-3">Common Highlights</h4>
            <div className="space-y-3">
              {(metrics.insights.highlights || []).length ? (
                metrics.insights.highlights.map((i, idx) => (
                  <div key={idx} className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                    <p className="text-[11px] font-bold text-emerald-700">{i.q}</p>
                    <p className="text-sm text-emerald-900">{i.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No highlight insights captured yet.</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h4 className="text-sm font-black text-rose-700 uppercase tracking-wider mb-3">Common Lowlights</h4>
            <div className="space-y-3">
              {(metrics.insights.lowlights || []).length ? (
                metrics.insights.lowlights.map((i, idx) => (
                  <div key={idx} className="rounded-lg border border-rose-100 bg-rose-50 p-3">
                    <p className="text-[11px] font-bold text-rose-700">{i.q}</p>
                    <p className="text-sm text-rose-900">{i.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No lowlight insights captured yet.</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h4 className="text-sm font-black text-indigo-700 uppercase tracking-wider mb-3">Top Recommendations</h4>
            <div className="space-y-3">
              {(metrics.insights.recommendations || []).length ? (
                metrics.insights.recommendations.map((i, idx) => (
                  <div key={idx} className="rounded-lg border border-indigo-100 bg-indigo-50 p-3">
                    <p className="text-[11px] font-bold text-indigo-700">{i.q}</p>
                    <p className="text-sm text-indigo-900">{i.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No recommendations captured yet.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GlobalReport;
