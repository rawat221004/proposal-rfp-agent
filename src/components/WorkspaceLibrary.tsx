/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Snippet } from '../types.js';
import { 
  Layers, Plus, Trash2, Tag, BookOpen, ShieldCheck, Cpu, DollarSign, ListFilter, Play
} from 'lucide-react';

interface WorkspaceLibraryProps {
  snippets: Snippet[];
  onCreateSnippet: (snippet: Omit<Snippet, 'id'>) => Promise<void>;
  onDeleteSnippet: (id: string) => Promise<void>;
}

export default function WorkspaceLibrary({
  snippets,
  onCreateSnippet,
  onDeleteSnippet
}: WorkspaceLibraryProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Security & Compliance');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const [isAdding, setIsAdding] = useState(false);

  const categories = [
    'All',
    'Security & Compliance',
    'Performance & Tech',
    'Commercials',
    'Enterprise SLA'
  ];

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !content) return;
    setIsAdding(true);
    try {
      const tags = tagInput.split(',').map(t => t.trim()).filter(t => t !== '');
      await onCreateSnippet({
        title,
        category,
        content,
        tags
      });
      setTitle('');
      setContent('');
      setTagInput('');
      setShowAdd(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleApplySample = (tpl: { title: string; category: string; content: string; tags: string }) => {
    setTitle(tpl.title);
    setCategory(tpl.category);
    setContent(tpl.content);
    setTagInput(tpl.tags);
  };

  const sampleSnippets = [
    {
      title: '99.999% Telecommunication Carrier Grade SLA',
      category: 'Enterprise SLA',
      content: 'We guarantee a Carrier-Grade Service Level Agreement (SLA) of 99.999% uptime for core broker operations, underwritten by distributed failover structures across 3 European priority nodes. Penalty credits automatically initiate on aggregate lags above 10 seconds.',
      tags: 'sla, telecom, failover, high-availability'
    },
    {
      title: 'SOC 2 Type II Auditing Schedule',
      category: 'Security & Compliance',
      content: 'Our compliance posture undergoes annual SOC 2 Type II audits audited by certified external CPAs. Audit books contain logical infrastructure mappings, continuous container vulnerability logs, and localized database tenant separation records.',
      tags: 'soc2, auditing, security, compliance'
    }
  ];

  // Filtering snippets
  const filteredSnippets = activeCategoryFilter === 'All'
    ? snippets
    : snippets.filter(s => s.category.toLowerCase() === activeCategoryFilter.toLowerCase());

  return (
    <div className="space-y-8 animate-fade-in text-slate-750" id="library-tab">
      
      {/* Page description */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-left">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Layers className="w-5.5 h-5.5 text-indigo-600" /> Bidding Library & Snippets
          </h2>
          <p className="text-xs text-slate-500">
            Create reusable organizational knowledge bases. These text assets are compiled and indexed by the Hindsight memory layer.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 self-start sm:self-center transition-all cursor-pointer shadow-sm"
          id="add-snippet-toggle"
        >
          <Plus className="w-4 h-4" /> {showAdd ? 'Close Intake' : 'Add Knowledge Snippet'}
        </button>
      </div>

      {/* Main Container splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Filters & add forms */}
        <div className="lg:col-span-4 space-y-6 text-left">
          
          {/* Active Filtering list */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <h3 className="text-xs font-bold font-mono text-slate-500 uppercase mb-3 flex items-center gap-1">
              <ListFilter className="w-3.5 h-3.5" /> Category Filters
            </h3>
            <div className="space-y-1.5">
              {categories.map((cat, i) => {
                const isSel = cat.toLowerCase() === activeCategoryFilter.toLowerCase();
                return (
                  <div
                    key={i}
                    onClick={() => setActiveCategoryFilter(cat)}
                    className={`px-3 py-2 text-xs font-mono font-bold rounded-lg cursor-pointer border transition-all ${
                      isSel 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {cat}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick seed templates tool */}
          {showAdd && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Autoseed Templates</span>
              <div className="space-y-2">
                {sampleSnippets.map((tpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplySample(tpl)}
                    className="p-2 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 text-left text-[11px] font-mono text-slate-655 w-full flex justify-between items-center cursor-pointer group"
                  >
                    <span className="truncate pr-1 font-semibold">{tpl.title}</span>
                    <Play className="w-2.5 h-2.5 text-indigo-600 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right column: Form Expand & Snippet Grid Displays */}
        <div className="lg:col-span-8 text-left space-y-6">
          
          {/* Extended Create Form block */}
          {showAdd && (
            <form onSubmit={handleAddSubmit} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 animate-fade-in" id="add-snippet-form">
              <h3 className="font-bold text-sm text-slate-800 uppercase tracking-widest font-mono">Create Reusable Knowledge</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Snippet Title / Key Phrase *</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-850 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. SOC 2 Type II Security Uptime"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Category Classification *</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                  >
                    <option value="Security & Compliance">Security & Compliance</option>
                    <option value="Performance & Tech">Performance & Tech</option>
                    <option value="Commercials">Commercials</option>
                    <option value="Enterprise SLA">Enterprise SLA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Scope of Text Content *</label>
                <textarea
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-505 leading-normal"
                  placeholder="Paste clear technological figures, precise pricing details, compliance descriptions. These facts protect drafts from AI hallucination."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-505 uppercase font-bold mb-1">Search Keywords (comma-separated)</label>
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                  placeholder="e.g. sla, uptime, compliance, backup"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-3.5 py-1.5 bg-slate-100 text-slate-600 rounded text-xs cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="px-4 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 disabled:opacity-50 cursor-pointer shadow-sm animate-pulse-slow font-sans"
                  id="submit-snippet-btn"
                >
                  {isAdding ? 'Ingesting...' : 'Ingest to memory'}
                </button>
              </div>
            </form>
          )}

          {/* Active Snippet list view */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSnippets.length === 0 ? (
              <div className="col-span-2 py-12 text-center bg-white border border-slate-200 rounded-2xl w-full">
                <p className="text-xs text-slate-400 font-mono">No registered snippets found in this category.</p>
              </div>
            ) : (
              filteredSnippets.map(snp => {
                let catIcon = <BookOpen className="w-4 h-4 text-indigo-600 animate-pulse" />;
                let catClass = 'bg-indigo-50 border-indigo-200 text-indigo-700';
                if (snp.category === 'Security & Compliance') {
                  catIcon = <ShieldCheck className="w-4 h-4 text-emerald-600" />;
                  catClass = 'bg-emerald-50 border-emerald-200 text-emerald-700';
                } else if (snp.category === 'Performance & Tech') {
                  catIcon = <Cpu className="w-4 h-4 text-cyan-600" />;
                  catClass = 'bg-cyan-50 border-cyan-200 text-cyan-700';
                } else if (snp.category === 'Commercials') {
                  catIcon = <DollarSign className="w-4 h-4 text-amber-600" />;
                  catClass = 'bg-amber-50 border-amber-200 text-amber-700';
                }

                return (
                  <div
                    key={snp.id}
                    className="bg-white border border-slate-200 hover:border-indigo-250 transition-all p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-xs"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
                            {catIcon}
                          </div>
                          <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded border ${catClass}`}>
                            {snp.category}
                          </span>
                        </div>
                        <button
                          onClick={() => onDeleteSnippet(snp.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                          title="Delete snippet"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4 className="font-bold text-sm text-slate-800 text-left pt-1.5">{snp.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed text-left line-clamp-4 bg-slate-50 p-2 border border-slate-200 rounded-lg select-text font-mono">
                        "{snp.content}"
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex gap-1 flex-wrap">
                      {snp.tags.map((tg, idx) => (
                        <span key={idx} className="text-[9px] font-mono px-1.5 py-0.5 bg-slate-50 text-slate-500 border border-slate-250 rounded">#{tg}</span>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
