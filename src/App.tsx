/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage.js';
import Dashboard from './components/Dashboard.js';
import ClientProfiles from './components/ClientProfiles.js';
import Generator from './components/Generator.js';
import WorkspaceLibrary from './components/WorkspaceLibrary.js';
import AnalyticsPage from './components/AnalyticsPage.js';
import { Client, Proposal, Snippet, MemoryEntry, AuditLog } from './types.js';
import { 
  Brain, LayoutDashboard, Users, Sparkles, Layers, BarChart2, CornerDownRight, 
  Settings, Loader, LogOut, CheckCircle, RefreshCw
} from 'lucide-react';

type TabType = 'landing' | 'dashboard' | 'clients' | 'generator' | 'snippets' | 'analytics';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('landing');
  
  // App data states
  const [workspaceName, setWorkspaceName] = useState('OmniBid Bidding Systems');
  const [clients, setClients] = useState<Client[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  
  // Platform loader status
  const [loading, setLoading] = useState(true);

  // Load all initial state on start hydrate
  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      const [wsRes, cliRes, propRes, snipRes, memRes, auditRes] = await Promise.all([
        fetch('/api/workspace'),
        fetch('/api/clients'),
        fetch('/api/proposals'),
        fetch('/api/snippets'),
        fetch('/api/memories'),
        fetch('/api/analytics') // retrieves logs directly
      ]);

      const ws = await wsRes.json();
      const cl = await cliRes.json();
      const pr = await propRes.json();
      const sn = await snipRes.json();
      const me = await memRes.json();
      const au = await auditRes.json();

      setWorkspaceName(ws.name || 'OmniBid Bidding Systems');
      setClients(cl || []);
      setProposals(pr || []);
      setSnippets(sn || []);
      setMemories(me || []);
      setAuditLogs(au.auditLogs || []);
    } catch (e) {
      console.error('Error fetching baseline workspace data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Soft refresh pipeline
  const handleReloadData = async () => {
    await fetchAllData();
  };

  // --- Core API state interactions ---

  // Register new Client profile
  const handleCreateClient = async (newClientData: Omit<Client, 'id'>) => {
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClientData)
      });
      if (response.ok) {
        await handleReloadData();
      } else {
        const err = await response.json();
        alert(`Failed to register client: ${err.error}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Update Client preferences profile
  const handleUpdateClient = async (id: string, updatedFields: Partial<Client>) => {
    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      if (response.ok) {
        await handleReloadData();
      } else {
        const err = await response.json();
        alert(`Failed to save client update: ${err.error}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Remove Client
  const handleDeleteClient = async (id: string) => {
    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await handleReloadData();
      } else {
        alert('Could not remove target client.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Add customized Library snippet
  const handleCreateSnippet = async (newSnippetData: Omit<Snippet, 'id'>) => {
    try {
      const response = await fetch('/api/snippets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSnippetData)
      });
      if (response.ok) {
        await handleReloadData();
      } else {
        alert('Could not create organizational snippet.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Snippet
  const handleDeleteSnippet = async (id: string) => {
    try {
      const response = await fetch(`/api/snippets/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await handleReloadData();
      } else {
        alert('Could not delete knowledge snippet.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Call main AI Proposal generator incorporating Hindsight memories retrieves
  const handleGenerateProposal = async (request: {
    clientId: string;
    rfpTitle: string;
    rfpContent: string;
    customNotes?: string;
  }): Promise<Proposal> => {
    const response = await fetch('/api/proposals/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Server-side proposal compiler failed.');
    }
    const prop: Proposal = await response.json();
    await handleReloadData();
    return prop;
  };

  // Outcome submission feedback loop
  const handleMarkOutcome = async (proposalId: string, outcome: 'Won' | 'Lost', feedback: string) => {
    try {
      const response = await fetch(`/api/proposals/${proposalId}/outcome`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outcome, feedback })
      });
      if (response.ok) {
        await handleReloadData();
      } else {
        alert('Could not submit outcome feedback trace.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Sidebar shortcut navigation selectors
  const handleSelectClient = (clientId: string) => {
    setActiveTab('clients');
  };

  const handleSelectProposal = (proposalId: string) => {
    // Jump straight to generator tab and populate view
    setActiveTab('generator');
  };

  const handleClientProposalShortPath = (clientId: string) => {
    setActiveTab('generator');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-center items-center space-y-4" id="app-loader">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin" />
          <Brain className="w-7 h-7 text-indigo-600 absolute inset-0 m-auto animate-pulse" />
        </div>
        <p className="text-xs font-mono text-slate-500 animate-pulse uppercase tracking-wider">Hydrating OmniBid Hindsight Bidding Workspace...</p>
      </div>
    );
  }

  // Under Landing mode
  if (activeTab === 'landing') {
    return <LandingPage onEnterApp={() => setActiveTab('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between select-none relative" id="app-root">
      
      {/* Background ambient grid mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-70" />

      {/* Main SaaS App shell header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          
          {/* Brand Launcher Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center border border-indigo-500 shadow-[0_4px_12px_rgba(79,70,229,0.15)]">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="font-bold text-sm tracking-tight text-slate-900">{workspaceName}</h1>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                <span className="text-[10px] text-slate-500 font-mono tracking-wider font-bold uppercase">Memory Active</span>
              </div>
            </div>
          </div>

          {/* Navigation Bar links */}
          <nav className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono tracking-wide flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'dashboard' 
                  ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                  : 'text-slate-550 hover:text-slate-800 hover:bg-slate-200/50'
              }`}
              id="tab-dashboard"
            >
              <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
            </button>

            <button
              onClick={() => setActiveTab('clients')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono tracking-wide flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'clients' 
                  ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                  : 'text-slate-550 hover:text-slate-800 hover:bg-slate-200/50'
              }`}
              id="tab-clients"
            >
              <Users className="w-3.5 h-3.5" /> Clients
            </button>

            <button
              onClick={() => setActiveTab('generator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono tracking-wide flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'generator' 
                  ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                  : 'text-slate-550 hover:text-slate-800 hover:bg-slate-200/50'
              }`}
              id="tab-generator"
            >
              <Sparkles className="w-3.5 h-3.5" /> Generate Bid
            </button>

            <button
              onClick={() => setActiveTab('snippets')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono tracking-wide flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'snippets' 
                  ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                  : 'text-slate-550 hover:text-slate-800 hover:bg-slate-200/50'
              }`}
              id="tab-snippets"
            >
              <Layers className="w-3.5 h-3.5" /> Library
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono tracking-wide flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'analytics' 
                  ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                  : 'text-slate-550 hover:text-slate-800 hover:bg-slate-200/50'
              }`}
              id="tab-analytics"
            >
              <BarChart2 className="w-3.5 h-3.5" /> Analytics
            </button>
          </nav>

          {/* Quick exit context */}
          <button
            onClick={() => setActiveTab('landing')}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-550 hover:text-rose-600 transition-colors border border-transparent hover:bg-rose-50 hover:border-rose-200 rounded-lg cursor-pointer font-mono"
            id="nav-exit-landing"
          >
            <LogOut className="w-3.5 h-3.5" /> Exit to Pitch
          </button>

        </div>
      </header>

      {/* Main Container Core Viewport */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full z-10 relative">
        {activeTab === 'dashboard' && (
          <Dashboard
            clients={clients}
            proposals={proposals}
            auditLogs={auditLogs}
            memoryCount={memories.length}
            snippetCount={snippets.length}
            onNavigateToTab={(tab: any) => setActiveTab(tab)}
            onSelectClient={handleSelectClient}
            onSelectProposal={handleSelectProposal}
            onCreateClient={handleCreateClient}
          />
        )}

        {activeTab === 'clients' && (
          <ClientProfiles
            clients={clients}
            memories={memories}
            onUpdateClient={handleUpdateClient}
            onDeleteClient={handleDeleteClient}
            onSelectClientForProposal={handleClientProposalShortPath}
          />
        )}

        {activeTab === 'generator' && (
          <Generator
            clients={clients}
            onGenerateProposal={handleGenerateProposal}
            onMarkOutcome={handleMarkOutcome}
          />
        )}

        {activeTab === 'snippets' && (
          <WorkspaceLibrary
            snippets={snippets}
            onCreateSnippet={handleCreateSnippet}
            onDeleteSnippet={handleDeleteSnippet}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsPage
            proposalsCount={proposals.length}
            memoriesCount={memories.length}
          />
        )}
      </main>

      {/* Soft interactive floating refresh */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleReloadData}
          className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-full shadow-lg text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer group"
          title="Force Sync Workspace"
        >
          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>

      {/* Simple Clean Master App Footer */}
      <footer className="border-t border-slate-200 bg-white/60 p-6 text-center text-xs text-slate-500 mt-12 select-none relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 OmniBid Platform. Powered by Hindsight organizational memory context layer.</p>
          <div className="flex gap-4 font-mono text-[10px]">
            <span>Cloud Run Status: <strong className="text-emerald-600">● Live</strong></span>
            <span className="text-slate-300">|</span>
            <span>Local Time: <strong className="text-slate-500">2026-06-07 07:50 (UTC)</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
