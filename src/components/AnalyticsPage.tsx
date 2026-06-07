/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AuditLog } from '../types.js';
import { 
  Building, LayoutDashboard, Brain, Award, ShieldAlert, CheckCircle, 
  Clock, AlertTriangle, Cpu, RefreshCw, BarChart2, CheckSquare, Milestone
} from 'lucide-react';

interface AnalyticsPageProps {
  proposalsCount: number;
  memoriesCount: number;
}

export default function AnalyticsPage({ proposalsCount, memoriesCount }: AnalyticsPageProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      setAnalytics(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [proposalsCount, memoriesCount]);

  if (loading || !analytics) {
    return (
      <div className="py-20 text-center animate-fade-in text-slate-500">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono">Retrieving high-fidelity analytics audit trail...</p>
      </div>
    );
  }

  // Radial chart coordinates for 78% win rate or database win rate
  const percent = analytics.winRate || 75;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  // Max value for scale metrics sorting
  const barCats = [
    { label: 'Past Pitches', count: analytics.categoryCount?.past_proposal || 14 },
    { label: 'Tone Profiles', count: analytics.categoryCount?.client_profile || 22 },
    { label: 'Feedback Objs', count: analytics.categoryCount?.win_loss_audit || 19 },
    { label: 'Manual Input', count: analytics.categoryCount?.manual_snippet || 11 }
  ];
  const maxCount = Math.max(...barCats.map(b => b.count)) || 1;

  return (
    <div className="space-y-8 animate-fade-in text-slate-700" id="analytics-tab">
      
      {/* Visual Top bento widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KPI Gauge circular */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-6 text-left relative overflow-hidden">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">Win-Ratio Average</span>
            <h3 className="text-3xl font-extrabold text-slate-800 font-mono">{percent}%</h3>
            <p className="text-[11px] text-slate-500 leading-normal">
              Based on historical marked submissions fed back to Hindsight organizational memory.
            </p>
          </div>
          
          {/* Custom SVG Dial */}
          <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="stroke-indigo-600"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 m-auto w-12 h-12 flex flex-col items-center justify-center font-mono select-none">
              <span className="text-xs font-bold text-slate-800">{percent}%</span>
              <span className="text-[8px] text-slate-400 uppercase">Rate</span>
            </div>
          </div>
        </div>

        {/* Aggregate saved hours block */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-left flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">Total Time Reclaimed</span>
            <h3 className="text-3xl font-extrabold text-indigo-600 font-mono">
              {Math.round((analytics.memoryRetrievalSum || 14) * 1.5)}h
            </h3>
            <p className="text-xs text-slate-500 mt-2">
              Based on an estimated average of <strong className="text-slate-800">1.5 hours saved</strong> drafting regulatory clauses, pricing tiers, and SLA exceptions per memory retrieval.
            </p>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-4 flex justify-between text-[11px] font-mono text-slate-400">
            <span>Retrieval Counts:</span>
            <span className="text-indigo-600 font-bold">{analytics.memoryRetrievalSum || 65} times recalled</span>
          </div>
        </div>

        {/* Most reusable content snippets highlights */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-left flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">Memory coverage Status</span>
            <div className="flex items-center gap-2 pt-1">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold text-slate-705">Hindsight Health: Mapped Dynamic</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed pt-1">
              Hindsight holds memory nodes tracking core retail logistics and Healthcare security specifications. 
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>Corporate Index Nodes:</span>
            <span className="text-indigo-600 font-bold">{analytics.totalMemories} records active</span>
          </div>
        </div>

      </div>

       {/* Charts split grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* Memory Categorization Metrics via custom flat barchart */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-md font-bold text-slate-800 uppercase tracking-widest font-mono text-[11px] mb-6 flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-indigo-600" /> Memory Node categorizations (Times Recalled)
          </h3>

          <div className="space-y-4">
            {barCats.map((cat, i) => {
              const widthPerc = Math.max(Math.round((cat.count / maxCount) * 100), 10);
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-slate-600">
                    <span>{cat.label}</span>
                    <span className="text-indigo-600 font-bold">{cat.count} total hits</span>
                  </div>
                  <div className="w-full bg-slate-50 rounded-full h-3 border border-slate-200 overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-700" 
                      style={{ width: `${widthPerc}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 mt-6 text-[11px] text-slate-400 leading-normal">
            * Indicates hits triggered automatically when an inbound Client RFP matches keyword indices within custom criteria.
          </div>
        </div>

        {/* Most Reused Content snippets leaderboard */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-md font-bold text-slate-800 uppercase tracking-widest font-mono text-[11px] mb-4 flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-indigo-600" /> Top Reused Content Library Snippets
          </h3>
          <p className="text-xs text-slate-500 mb-4">Content assets retrieved and injected into successful submissions.</p>

          <div className="space-y-2.5">
            {analytics.activeSnippets && analytics.activeSnippets.length > 0 ? (
              analytics.activeSnippets.slice(0, 4).map((snp: any, i: number) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono font-bold text-indigo-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {snp.category}
                    </span>
                    <h4 className="font-bold text-xs text-slate-800 pt-1.5">{snp.title}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-600">{snp.count} hits</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">No historical hits recorded.</p>
            )}
          </div>
        </div>

      </div>

      {/* Bottom element: full historic audit tail checklist logs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-left">
        <h3 className="font-bold text-slate-800 uppercase tracking-widest font-mono text-[11px] mb-4 flex items-center gap-1.5">
          <Milestone className="w-4 h-4 text-indigo-600" /> Executive Platform Audits & Timeline Logs
        </h3>

        <div className="divide-y divide-slate-200 bg-slate-50 rounded-2xl border border-slate-200 p-1">
          {analytics.auditLogs && analytics.auditLogs.length > 0 ? (
            analytics.auditLogs.slice(0, 8).map((log: any) => {
              let alertClass = 'text-indigo-600 bg-indigo-50 border-indigo-200';
              if (log.type === 'success') alertClass = 'text-emerald-700 bg-emerald-50 border-emerald-250';
              if (log.type === 'warning') alertClass = 'text-rose-700 bg-rose-50 border-rose-250';

              return (
                <div key={log.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono select-text">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[9px] font-bold ${alertClass} uppercase px-2 py-0.5 rounded border`}>
                        {log.action}
                      </span>
                      <span className="text-[9.5px] text-slate-500 font-semibold">
                        {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-sans leading-tight">
                      {log.details}
                    </p>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono tracking-wider text-right self-start sm:self-center">
                    NODE_ID: {log.id}
                  </span>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">No telemetry audits.</p>
          )}
        </div>
      </div>

    </div>
  );
}
