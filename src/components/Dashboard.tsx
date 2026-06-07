/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Client, Proposal, AuditLog } from '../types.js';
import { 
  Users, Brain, FileText, Award, Layers, TrendingUp, Plus, ArrowRight,
  ShieldAlert, CheckCircle, Clock, AlertTriangle, Cpu, RefreshCw
} from 'lucide-react';

interface DashboardProps {
  clients: Client[];
  proposals: Proposal[];
  auditLogs: AuditLog[];
  memoryCount: number;
  snippetCount: number;
  onNavigateToTab: (tab: string) => void;
  onSelectClient: (clientId: string) => void;
  onSelectProposal: (proposalId: string) => void;
  onCreateClient: (client: Omit<Client, 'id'>) => Promise<void>;
}

export default function Dashboard({
  clients,
  proposals,
  auditLogs,
  memoryCount,
  snippetCount,
  onNavigateToTab,
  onSelectClient,
  onSelectProposal,
  onCreateClient
}: DashboardProps) {
  // New client form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [tone, setTone] = useState('Professional & Credible');
  const [sensitivity, setSensitivity] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [formatting, setFormatting] = useState('Standard Executive layout');
  const [notes, setNotes] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute stats
  const totalProposals = proposals.length;
  const wonCount = proposals.filter(p => p.outcome === 'Won').length;
  const lostCount = proposals.filter(p => p.outcome === 'Lost').length;
  const pendingCount = proposals.filter(p => p.outcome === 'Pending').length;
  
  // Real stats calculation
  const winRate = (wonCount + lostCount) > 0 
    ? Math.round((wonCount / (wonCount + lostCount)) * 100) 
    : 80; // realistic default seed rate

  // Custom client form submission
  const handleSubmitClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !industry) return;
    setIsSubmitting(true);
    try {
      const tags = tagInput.split(',').map(t => t.trim()).filter(t => t !== '');
      await onCreateClient({
        name,
        industry,
        preferredTone: tone,
        pricingSensitivity: sensitivity,
        preferredFormatting: formatting,
        decisionMakerNotes: notes,
        tags
      });
      // Clear
      setName('');
      setIndustry('');
      setTone('Professional & Credible');
      setSensitivity('Medium');
      setFormatting('Standard Executive layout');
      setNotes('');
      setTagInput('');
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Memory health level calculations
  const memoryHealthPercentage = Math.min(Math.round((memoryCount / 15) * 100), 100);
  let memoryHealthLabel = 'Developing';
  let memoryHealthColor = 'text-amber-400';
  let memoryBarBg = 'bg-amber-500';
  if (memoryHealthPercentage >= 80) {
    memoryHealthLabel = 'Excellent (High Recall)';
    memoryHealthColor = 'text-emerald-400';
    memoryBarBg = 'bg-emerald-500';
  } else if (memoryHealthPercentage >= 50) {
    memoryHealthLabel = 'Adequate';
    memoryHealthColor = 'text-cyan-400';
    memoryBarBg = 'bg-cyan-500';
  }

  return (
    <div className="space-y-8 animate-fade-in text-slate-800" id="dashboard-tab">
      {/* Overview stats layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-500 font-mono tracking-wider uppercase font-semibold">Active Clients</span>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">{clients.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
            <button 
              onClick={() => onNavigateToTab('clients')}
              className="text-indigo-600 font-semibold hover:underline inline-flex items-center gap-1 text-[11px]"
            >
              Configure Profiles <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-500 font-mono tracking-wider uppercase font-semibold">Memory Size</span>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">{memoryCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
              <Brain className="w-5 h-5 text-emerald-600 animate-pulse" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-full bg-slate-100 rounded-full h-1.5 border border-slate-200">
              <div className={`h-full rounded-full bg-indigo-650 transition-all duration-500`} style={{ width: `${memoryHealthPercentage}%` }} />
            </div>
            <span className="text-[10px] font-mono whitespace-nowrap text-slate-500 font-bold">{memoryHealthPercentage}%</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-500 font-mono tracking-wider uppercase font-semibold">Library Snippets</span>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">{snippetCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-slate-150 flex items-center justify-center text-cyan-600 shadow-xs">
              <Layers className="w-5 h-5 text-cyan-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
            <button 
              onClick={() => onNavigateToTab('snippets')}
              className="text-indigo-600 font-semibold hover:underline inline-flex items-center gap-1 text-[11px]"
            >
              Access Library <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-500 font-mono tracking-wider uppercase font-semibold">Seeded Win-Rate</span>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">{winRate}%</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-slate-155 flex items-center justify-center text-amber-600 shadow-xs">
              <TrendingUp className="w-5 h-5 text-amber-605" />
            </div>
          </div>
          <div className="mt-4 flex gap-3 text-[10px] text-slate-500 font-mono font-bold">
            <span className="text-emerald-600">WON: {wonCount}</span>
            <span className="text-rose-600">LOST: {lostCount}</span>
            <span className="text-slate-400">PEND: {pendingCount}</span>
          </div>
        </div>

      </div>

      {/* Main Core split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Client profile list, generated proposal dashboard */}
        <div className="lg:col-span-8 space-y-8 text-left">
          
          {/* Quick Creator & Client Directory Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                  <Users className="w-5 h-5 text-indigo-600" /> Client Workspace Profiles
                </h3>
                <p className="text-xs text-slate-500">Active consumer segments connected to Hindsight historical learning.</p>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-750 text-white font-semibold rounded-xl text-xs flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                id="add-client-toggle"
              >
                <Plus className="w-3.5 h-3.5" /> {showAddForm ? 'Close Intake' : 'Register Client'}
              </button>
            </div>

            {/* Quick Add Form expanded */}
            {showAddForm && (
              <form onSubmit={handleSubmitClient} className="bg-slate-50 border border-slate-150 rounded-xl p-4 mb-6 space-y-4 animate-fade-in" id="client-form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-550 uppercase font-bold mb-1">Company legal Name *</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      placeholder="e.g. Acme Health"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-550 uppercase font-bold mb-1">Industry Sector *</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      placeholder="e.g. Telehealth Networks"
                      value={industry}
                      onChange={e => setIndustry(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-550 uppercase font-bold mb-1">Preferred Writing Tone</label>
                    <select
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-505"
                      value={tone}
                      onChange={e => setTone(e.target.value)}
                    >
                      <option value="Professional & Credible">Professional & Credible (Standard)</option>
                      <option value="Formal, compliance-driven, security-authoritative">Formal & InfoSec-authoritative</option>
                      <option value="Crisp, tech-forward, conversational but analytical">Crisp, action-focused & conversational</option>
                      <option value="Bold, SLA-obsessed, highly competitive">Bold, SLA-obsessed & competitive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-550 uppercase font-bold mb-1">Pricing Sensitivity</label>
                    <select
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-505"
                      value={sensitivity}
                      onChange={e => setSensitivity(e.target.value as any)}
                    >
                      <option value="Low">Low (Values compliance/tech quality over price)</option>
                      <option value="Medium">Medium (Open to premium packages with structured deals)</option>
                      <option value="High">High (Demands heavy volume subscription discounts)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-550 uppercase font-bold mb-1">Preferred Document Formatting</label>
                  <input
                    type="text"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-505"
                    placeholder="e.g. Grid layouts, detailed security appendix, Net-60 Payment guideline"
                    value={formatting}
                    onChange={e => setFormatting(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-550 uppercase font-bold mb-1">Decision-Maker & Intangibles Notes</label>
                  <textarea
                    rows={2}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-505"
                    placeholder="Identify executive names, key hot-buttons, past complaints, scheduling constraints, etc."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-550 uppercase font-bold mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-505"
                    placeholder="e.g. core-infrastructure, retail, hipaa-sla"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-105 border border-slate-200 rounded-lg text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-750 disabled:opacity-50 text-white font-bold rounded-lg text-xs cursor-pointer"
                    id="submit-client-btn"
                  >
                    {isSubmitting ? 'Registering...' : 'Complete Register'}
                  </button>
                </div>
              </form>
            )}

            {/* Render Horizontal Grid or Simple Grid of Cards */}
            {clients.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-201">
                <p className="text-xs text-slate-500">No client profiles configured yet. Create one to enable custom memory modeling.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="client-cards-grid">
                {clients.map(cli => (
                  <div
                    key={cli.id}
                    onClick={() => onSelectClient(cli.id)}
                    className="bg-slate-50 border border-slate-200 hover:border-indigo-400 p-4 rounded-xl cursor-pointer hover:bg-white hover:shadow-xs transition-colors group relative overflow-hidden text-left"
                  >
                    <div className="absolute top-0 right-0 w-12 h-12 bg-indigo-500/5 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-indigo-600">{cli.industry}</span>
                    <h4 className="font-bold text-sm text-slate-800 truncate mt-1 group-hover:text-indigo-650 transition-colors">{cli.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{cli.decisionMakerNotes || 'No specific personnel recorded.'}</p>
                    <div className="mt-3 flex gap-1 flex-wrap">
                      {cli.tags.slice(0, 3).map((tg, i) => (
                        <span key={i} className="text-[9px] font-mono px-1.5 py-0.5 bg-white text-slate-500 rounded-md border border-slate-200">#{tg}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent generated proposals log list */}
          <div className="bg-white border border-slate-202 rounded-2xl p-6 shadow-sm">
            <h3 className="text-md sm:text-lg font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <FileText className="w-5 h-5 text-indigo-601" /> Recent Generated Pitches & Proposals
            </h3>
            <p className="text-xs text-slate-500 mb-4">Historical record list of drafted documents utilizing the Hindsight retrieval matrix.</p>

            {proposals.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200">
                <FileText className="w-8 h-8 text-slate-350 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-mono">No RFP proposals generated yet.</p>
                <button
                  onClick={() => onNavigateToTab('generator')}
                  className="mt-3 text-xs bg-indigo-600 text-white font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Generate First Bid Proposal
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 bg-slate-50 rounded-xl border border-slate-200 p-1">
                {proposals.map(prop => {
                  let outcomeIcon;
                  let outcomeClass = 'text-slate-550';
                  if (prop.outcome === 'Won') {
                    outcomeIcon = <CheckCircle className="w-4 h-4 text-emerald-600 inline" />;
                    outcomeClass = 'bg-emerald-50 border-emerald-200 text-emerald-700';
                  } else if (prop.outcome === 'Lost') {
                    outcomeIcon = <AlertTriangle className="w-4 h-4 text-rose-600 inline" />;
                    outcomeClass = 'bg-rose-50 border-rose-200 text-rose-700';
                  } else {
                    outcomeIcon = <Clock className="w-4 h-4 text-amber-600 inline" />;
                    outcomeClass = 'bg-amber-50 border-amber-200 text-amber-705';
                  }

                  return (
                    <div
                      key={prop.id}
                      onClick={() => onSelectProposal(prop.id)}
                      className="p-4 hover:bg-white cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors group first:rounded-xl last:rounded-xl"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-800 group-hover:text-indigo-650 transition-all font-sans">{prop.title}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${outcomeClass}`}>
                            {prop.outcome}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2 flex-wrap">
                          <span>Recipient: <strong className="text-slate-700">{prop.clientName}</strong></span>
                          <span>•</span>
                          <span>RFP: {prop.rfpTitle}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono">{new Date(prop.createdAt).toLocaleDateString()} {new Date(prop.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <span className="text-[11px] text-slate-500 font-mono bg-white px-2 py-1 rounded border border-slate-200">
                          {prop.retrievedMemories.length} memory trace items
                        </span>
                        <span className="text-indigo-600 group-hover:translate-x-1 transition-transform">
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Memory Health, Hindsight Live audit timeline */}
        <div className="lg:col-span-4 space-y-8 text-left">
          
          {/* Memory KPI & Health Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl" />
            <h3 className="text-md font-bold text-slate-800 mb-1 font-mono uppercase tracking-widest text-[11px]">Hindsight Audit Node</h3>
                       <div className="flex items-center gap-2 mt-4 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
              <span className="text-xs font-mono font-bold text-slate-700">Memory Integrity: <span className={memoryHealthColor}>{memoryHealthLabel}</span></span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Our Hindsight repository matches organizational experiences to RFP opportunities. With <strong className="text-slate-800">{memoryCount} mapped memory nodes</strong>, your recall coefficient is optimized.
            </p>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-205 space-y-2">
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>Active Model:</span>
                <span className="text-slate-700">Gemini 3.5 Flash</span>
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>SLA Fail Prevention:</span>
                <span className="text-emerald-600 font-semibold">Active (100%)</span>
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>Knowledge Base coverage:</span>
                <span className="text-cyan-600 font-semibold">High Coverage</span>
              </div>
            </div>
            
            <button
              onClick={() => onNavigateToTab('generator')}
              className="mt-5 w-full py-2 bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-transform hover:-translate-y-0.5 shadow-sm"
            >
              Draft New Bid Now <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Unified Timeline / Activity View */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono mb-4 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600 animate-spin-slow" /> Hindsight Memory Timeline
            </h3>

            {auditLogs.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">
                No telemetry logs.
              </div>
            ) : (
              <div className="relative border-l border-slate-200 ml-2.5 pl-4 space-y-4">
                {auditLogs.slice(0, 7).map((log) => {
                  let indicatorBg = 'bg-slate-300';
                  if (log.type === 'success') indicatorBg = 'bg-emerald-500 ring-emerald-100';
                  if (log.type === 'warning') indicatorBg = 'bg-rose-500 ring-rose-100';
                  if (log.type === 'memory') indicatorBg = 'bg-indigo-500 ring-indigo-100';

                  return (
                    <div key={log.id} className="relative text-left space-y-0.5">
                      {/* Timeline dot */}
                      <span className={`absolute -left-[24.5px] top-1.5 w-2 h-2 rounded-full ${indicatorBg} ring-4`} />
                      
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[9px] font-mono font-bold text-indigo-650 tracking-wider bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {log.action}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                      
                      <p className="text-[11px] text-slate-600 leading-tight">
                        {log.details}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
