/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Client, Proposal, MemoryEntry } from '../types.js';
import { 
  Building, FileText, ChevronRight, Sparkles, Brain, CheckCircle, HelpCircle, 
  Copy, Edit2, Play, AlertTriangle, HelpCircle as HelpIcon, ArrowRight, CornerDownRight, 
  UploadCloud, FileUp, ListChecks, CheckSquare, RefreshCw, Milestone, ShieldAlert
} from 'lucide-react';

interface GeneratorProps {
  clients: Client[];
  onGenerateProposal: (data: {
    clientId: string;
    rfpTitle: string;
    rfpContent: string;
    customNotes?: string;
  }) => Promise<Proposal>;
  onMarkOutcome: (proposalId: string, outcome: 'Won' | 'Lost', feedback: string) => Promise<void>;
}

export default function Generator({ clients, onGenerateProposal, onMarkOutcome }: GeneratorProps) {
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
  const [rfpTitle, setRfpTitle] = useState('');
  const [rfpContent, setRfpContent] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  
  // Loading & Flow State
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [proposalResult, setProposalResult] = useState<Proposal | null>(null);
  
  // Tab states
  const [activeTab, setActiveTab] = useState<'compare' | 'trace'>('compare');
  const [isEditing, setIsEditing] = useState(false);
  const [editedDraft, setEditedDraft] = useState('');

  // Outcome submission state
  const [outcomeStatus, setOutcomeStatus] = useState<'Won' | 'Lost'>('Won');
  const [outcomeFeedback, setOutcomeFeedback] = useState('');
  const [isSubmittingOutcome, setIsSubmittingOutcome] = useState(false);
  const [outcomeConfirmed, setOutcomeConfirmed] = useState(false);

  // Drag over state
  const [isDragging, setIsDragging] = useState(false);

  // Quick Demo Seed RFP templates
  const rfpTemplates = [
    {
      label: 'MedVanguard Health SLA Integration',
      clientName: 'MedVanguard Healthcare',
      title: 'MedVanguard Secure EHR Clinical Inventory Grid Routing',
      content: 'We seek proposals for an enterprise routing server to sync clinical devices and EMRs. System must be secure and isolated. We require physical HIPAA administrative validation and logical database isolate backups. Specify your standard uptime SLA tier explicitly. We operate standard budget reviews.',
      notes: 'VP InfoSec is Dr. Arthur Pendelton. Strict about HIPAA logic backups.'
    },
    {
      label: 'Apex Retail Black Friday Sync',
      clientName: 'Apex Retail Co.',
      title: 'Apex E-commerce Storefront Real-Time Inventory Routing Queue',
      content: 'Apex Retail requires an enterprise routing queue to update distributed inventory across 4 warehouses. Core requirement: system must handle sub-500ms sync metrics and manage heavy Black Friday transaction bursts (up to 15K orders/min). Preference given to customizable credit options.',
      notes: 'Sarah Vance is logistical lead. Dislikes dry, abstract, generic consultese slides.'
    }
  ];

  const handleApplyTemplate = (tpl: typeof rfpTemplates[0]) => {
    const cli = clients.find(c => c.name.toLowerCase().includes(tpl.clientName.toLowerCase()));
    if (cli) {
      setSelectedClientId(cli.id);
    }
    setRfpTitle(tpl.title);
    setRfpContent(tpl.content);
    setCustomNotes(tpl.notes);
  };

  // Automated loading steps generator
  const loadingStatusMessages = [
    'Initializing OmniBid Bidding parser...',
    'Querying localized Hindsight memory nodes...',
    'Found 3 historical records relating to tags and client profile similarities...',
    'Applying VP InfoSec constraints and historical Net-60 credit terms...',
    'Refining tone parameter boundaries based on Sarah Vance C-suite notes...',
    'Invoking Google Gemini to build Side-by-Side balanced drafts...'
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep(prev => (prev < loadingStatusMessages.length - 1 ? prev + 1 : prev));
      }, 1500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleGenerate = async () => {
    if (!selectedClientId || !rfpTitle || !rfpContent) {
      alert('Please select a recipient client, and provide an RFP Title and Content.');
      return;
    }

    setIsLoading(true);
    setProposalResult(null);
    setOutcomeConfirmed(false);
    setOutcomeFeedback('');
    setIsEditing(false);

    try {
      const res = await onGenerateProposal({
        clientId: selectedClientId,
        rfpTitle,
        rfpContent,
        customNotes
      });
      setProposalResult(res);
      setEditedDraft(res.enhancedDraft);
    } catch (err: any) {
      console.error(err);
      alert(`Bidding generation failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock File Drag Drop Ingestion
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      await handleFileParsing(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      await handleFileParsing(file);
    }
  };

  const handleFileParsing = async (file: File) => {
    try {
      dbProgressLog('PARSING_PDF', `Processing mock structure for PDF file: ${file.name}`);
      const response = await fetch('/api/documents/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, fileContentBase64: 'MOCK_DATA' }),
      });
      const data = await response.json();
      if (data.title && data.content) {
        setRfpTitle(data.title);
        setRfpContent(data.content);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const dbProgressLog = (action: string, detail: string) => {
    console.log(`[DRAG_PARSER] ${action} - ${detail}`);
  };

  // Custom copy Clipboard
  const handleCopy = () => {
    const textToCopy = isEditing ? editedDraft : proposalResult?.enhancedDraft;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      alert('Custom proposal copied successfully to your clipboard!');
    }
  };

  // Dynamic outcome feedback looping
  const handleOutcomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalResult) return;
    setIsSubmittingOutcome(true);
    try {
      await onMarkOutcome(proposalResult.id, outcomeStatus, outcomeFeedback);
      setOutcomeConfirmed(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingOutcome(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-800" id="generator-tab">
      
      {/* Outer Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: RFP Ingestion Deck */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            
            <div>
              <h3 className="text-md sm:text-lg font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-indigo-600" /> Bidding RFP Ingestion & Modeling
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Ingest a client requirement RFP and let Hindsight retrieve matched, proven organizational memory components.
              </p>
            </div>

            {/* Quick click Templates */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150">
              <span className="text-[10px] uppercase tracking-wider text-slate-600 font-mono font-bold block mb-2">Hackathon Demo Templates (Recommended)</span>
              <div className="flex flex-col gap-2">
                {rfpTemplates.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleApplyTemplate(tpl)}
                    className="p-2.5 bg-white hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-mono font-bold flex justify-between items-center text-left border border-slate-200 hover:border-indigo-400 transition-colors w-full cursor-pointer group"
                  >
                    <span>{tpl.label}</span>
                    <Play className="w-3 h-3 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>

            {/* Target Client Dropdown selector */}
            <div className="space-y-1">
              <label className="block text-[11px] font-mono text-slate-500 uppercase font-bold">Target Workspace Client *</label>
              <div className="flex gap-2">
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                  value={selectedClientId}
                  onChange={e => setSelectedClientId(e.target.value)}
                >
                  <option value="" disabled>Select client...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.industry})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Drag & Drop simulated PDF parser */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                isDragging 
                  ? 'border-indigo-500 bg-indigo-50/50' 
                  : 'border-slate-200 hover:border-indigo-300 bg-slate-50'
              }`}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf,.txt,.docx"
                onChange={handleFileSelect}
              />
              <label htmlFor="file-upload" className="cursor-pointer block space-y-1.5">
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto animate-pulse" />
                <div className="text-xs font-bold text-slate-700">Drag & Drop RFP Document</div>
                <div className="text-[10px] text-slate-500 font-mono">Simulates PDF parsing based on metadata (PDF, TXT, DOCX)</div>
              </label>
            </div>

            {/* RFP Title Input */}
            <div className="space-y-1">
              <label className="block text-[11px] font-mono text-slate-550 uppercase font-bold">RFP Opportunity Title *</label>
              <input
                type="text"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-505 font-bold"
                placeholder="e.g. Secure Telehealth Devices RFP"
                value={rfpTitle}
                onChange={e => setRfpTitle(e.target.value)}
                required
              />
            </div>

            {/* RFP Content Input */}
            <div className="space-y-1">
              <label className="block text-[11px] font-mono text-slate-550 uppercase font-bold">RFP Core Requirements / Content *</label>
              <textarea
                rows={4}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 leading-normal"
                placeholder="Paste RFP content paragraphs, SLA demands, pricing sensitivity, security details..."
                value={rfpContent}
                onChange={e => setRfpContent(e.target.value)}
                required
              />
            </div>

            {/* Custom Staff Notes */}
            <div className="space-y-1">
              <label className="block text-[11px] font-mono text-slate-550 uppercase font-bold">Private Staff Directives (Optional)</label>
              <input
                type="text"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 italic"
                placeholder="e.g. Highlight previous Q3 success metrics or specific SLA targets."
                value={customNotes}
                onChange={e => setCustomNotes(e.target.value)}
              />
            </div>

            {/* Trigger generation Button */}
            <button
              onClick={handleGenerate}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 font-bold text-white rounded-xl transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-md shadow-indigo-500/10 active:scale-95"
              id="generate-proposal-btn"
            >
              <Brain className="w-5 h-5 group-hover:animate-bounce" /> Analyze Memory & Generate Proposal
            </button>

          </div>
        </div>

        {/* Right Side: Generation Result Comparison & Hindsight Trace output */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          {/* Active Loading screen */}
          {isLoading ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-lg h-[600px] flex flex-col justify-center items-center space-y-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-slate-50/20 backdrop-blur-xs pointer-events-none" />
              
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin flex items-center justify-center" />
                <Brain className="w-8 h-8 text-indigo-650 absolute inset-0 m-auto animate-pulse" />
              </div>

              <div className="space-y-2 relative z-10 max-w-sm">
                <h3 className="font-bold text-lg text-slate-900 font-mono animate-pulse">Consulting Hindsight Memory</h3>
                <p className="text-xs text-indigo-650 font-mono min-h-[30px]" id="loading-step-msg">
                  {loadingStatusMessages[loadingStep]}
                </p>
                <div className="w-48 bg-slate-100 rounded-full h-1 mx-auto mt-4 overflow-hidden border border-slate-200 font-bold font-medium bg-red-400 select-none hidden" />
                <div className="w-48 bg-slate-100 rounded-full h-1 mx-auto mt-4 overflow-hidden border border-slate-200">
                  <div className="bg-indigo-600 h-full animate-progress rounded" style={{ animationDuration: '8s' }} />
                </div>
              </div>

              <span className="text-[10px] font-mono text-slate-500 font-medium">Gemini 3.5 AI Core compiling logical assets...</span>
            </div>
          ) : !proposalResult ? (
            /* Empty state placeholder */
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center h-[550px] flex flex-col justify-center items-center shadow-sm">
              <Brain className="w-16 h-16 text-slate-300 mb-4 animate-pulse" />
              <h3 className="font-bold text-base text-slate-700">No Active Bid Compiles</h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1 text-center font-normal leading-relaxed">
                Select MedVanguard Healthcare or Apex Retail Co. on the template deck and click Generate to see the before/after effect of Hindsight memory.
              </p>
            </div>
          ) : (
            /* Hydrated Proposal generated panel block with tabs */
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg space-y-6 animate-fade-in" id="proposal-results-panel">
              
              {/* Outcome Header Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 font-mono select-none">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">PROPOSAL COMPILE ACTIVE</h3>
                  <p className="text-[10px] text-slate-500">{proposalResult.clientName} | {proposalResult.rfpTitle}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('compare')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono border cursor-pointer transition-colors ${
                      activeTab === 'compare' 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    Side-by-Side Comparison
                  </button>
                  <button
                    onClick={() => setActiveTab('trace')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono border cursor-pointer transition-colors ${
                      activeTab === 'trace' 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                    id="trace-tab"
                  >
                    Memory Traces ({proposalResult.retrievedMemories.length})
                  </button>
                </div>
              </div>

              {/* TAB 1 CONTENT: SIDE-BY-SIDE COMPARE */}
              {activeTab === 'compare' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* High Quality visual list of Improvement achievements */}
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-indigo-700 uppercase font-mono tracking-wider mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-4.5 h-4.5 text-indigo-600" /> Hindsight Memory Improvements Added
                    </h4>
                    <ul className="text-xs text-slate-600 space-y-1.5">
                      {proposalResult.improvements.map((imp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Side-by-side Draft grids */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Baseline side */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between h-[380px]">
                      <div>
                        <div className="flex justify-between items-center pb-2 mb-3 border-b border-slate-200">
                          <span className="text-[10px] font-mono font-bold text-rose-700 uppercase bg-rose-50 border border-rose-250 px-1.5 py-0.5 rounded">
                            Baseline (No Hindsight)
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1 space-y-3 font-sans h-[300px] overflow-y-auto pr-1 select-text">
                          <div className="whitespace-pre-wrap leading-relaxed">{proposalResult.baselineDraft}</div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced side (Custom edit container block) */}
                    <div className="bg-slate-50 border border-indigo-200 rounded-xl p-4 flex flex-col justify-between h-[380px] shadow-sm">
                      <div>
                        <div className="flex justify-between items-center pb-2 mb-3 border-b border-slate-200">
                          <span className="text-[10px] font-mono font-bold text-indigo-700 uppercase bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Brain className="w-3 h-3 text-indigo-600" /> Memory-Enhanced
                          </span>
                          <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-[10px] text-slate-500 hover:text-indigo-600 font-mono inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" /> {isEditing ? 'Collapse' : 'Manual Edit'}
                          </button>
                        </div>
                        
                        <div className="text-xs text-slate-700 mt-1 font-sans h-[300px] overflow-y-auto pr-1 relative text-left">
                          {isEditing ? (
                            <textarea
                              rows={15}
                              className="w-[100%] bg-white border border-slate-200 text-slate-800 text-xs rounded p-2 focus:outline-none focus:border-indigo-500 font-mono h-[280px]"
                              value={editedDraft}
                              onChange={e => setEditedDraft(e.target.value)}
                            />
                          ) : (
                            <div className="whitespace-pre-wrap leading-relaxed select-text">{editedDraft}</div>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Quick copy, export codes */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      onClick={handleCopy}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white border border-transparent rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer selection:none shadow-sm animate-pulse-slow"
                    >
                      <Copy className="w-4 h-4 text-white" /> Copy Personalized Draft
                    </button>
                    <span className="text-[10px] font-mono text-slate-505 text-right">Fully customized and ready for C-suite submission.</span>
                  </div>

                </div>
              )}

              {/* TAB 2 CONTENT: RELEVANT MEMORY TRACE MAP */}
              {activeTab === 'trace' && (
                <div className="space-y-4 animate-fade-in">
                  
                  <div className="p-3 bg-indigo-950/20 border border-indigo-900/40 text-xs text-indigo-300 rounded-xl leading-relaxed mb-1">
                    Below is the Hindsight organizational trace mapping showing which memories were scored and loaded to defend, correct and structure this custom bid.
                  </div>

                  {proposalResult.retrievedMemories.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-500">No active memory nodes needed recall for this draft.</div>
                  ) : (
                    <div className="space-y-3">
                      {proposalResult.retrievedMemories.map((mem, i) => {
                        let sourceColor = 'border-indigo-800 text-indigo-300 bg-indigo-950/40';
                        if (mem.sourceType === 'past_proposal') sourceColor = 'border-emerald-800 text-emerald-300 bg-emerald-950/40';
                        if (mem.sourceType === 'win_loss_audit') sourceColor = 'border-rose-800 text-rose-300 bg-rose-950/40';

                        return (
                          <div
                            key={mem.id}
                            className="bg-slate-950 border border-slate-850 rounded-xl p-4 relative overflow-hidden text-left"
                          >
                            <div className="flex justify-between items-start gap-4">
                              <div className="space-y-0.5">
                                <span className={`text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 border rounded ${sourceColor}`}>
                                  {mem.sourceType.replace('_', ' ')}
                                </span>
                                <h4 className="font-bold text-xs text-slate-100 mt-2">{mem.title}</h4>
                              </div>
                              
                              <div className="text-right flex-shrink-0">
                                <span className="text-xs font-mono font-bold text-emerald-400 block">{(mem.confidence * 100).toFixed(0)}% RECALL</span>
                                <span className="text-[9px] font-mono text-slate-500">Confidence Score</span>
                              </div>
                            </div>

                            <p className="text-xs text-slate-350 leading-relaxed mt-2.5 bg-slate-900/50 p-2.5 rounded-lg border border-slate-900">
                              "{mem.content}"
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>
              )}

              {/* OUTCOME FEEDBACK LOOP FRAMEWORK TRIGGER CONTAINER */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin-slow" />
                    <h3 className="font-bold text-sm text-slate-900 font-sans">Hindsight Feedback Pipeline</h3>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-4 leading-normal font-sans">
                    This completes the organizational database loop. Recording commercial win/loss outcomes extracts core customer objections, feeding back directly to future biddings.
                  </p>

                  {outcomeConfirmed ? (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg p-3.5 text-xs font-bold text-center flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600" /> Organizational memory updating completed successfully! Check the dashboard timeline.
                    </div>
                  ) : (
                    <form onSubmit={handleOutcomeSubmit} className="space-y-4">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                        <span className="text-xs font-bold text-slate-600">Submission Outcome:</span>
                        <div className="sm:col-span-2 flex gap-4">
                          <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-medium">
                            <input
                              type="radio"
                              name="outcomeStatus"
                              checked={outcomeStatus === 'Won'}
                              onChange={() => setOutcomeStatus('Won')}
                              className="accent-indigo-600"
                            />
                            Mark as <strong className="text-indigo-600">WON</strong> (Success pattern)
                          </label>
                          <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-medium">
                            <input
                              type="radio"
                              name="outcomeStatus"
                              checked={outcomeStatus === 'Lost'}
                              onChange={() => setOutcomeStatus('Lost')}
                              className="accent-rose-600"
                            />
                            Mark as <strong className="text-rose-600">LOST</strong> (Objection log)
                          </label>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold">Feedback / Justification notes</label>
                        <textarea
                          rows={2}
                          className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          placeholder="e.g. Clients bought because SLAs were clear, or clients rejected because security ISO documents were absent..."
                          value={outcomeFeedback}
                          onChange={e => setOutcomeFeedback(e.target.value)}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingOutcome}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1 shadow-sm"
                        id="submit-outcome-btn"
                      >
                        {isSubmittingOutcome ? 'Ingesting outcome...' : 'Submit Ingest Feedback'}
                      </button>

                    </form>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
