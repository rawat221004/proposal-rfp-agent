/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Client, MemoryEntry } from '../types.js';
import { 
  Users, User, Briefcase, MessageSquare, CreditCard, FileCode, Edit3, Trash2, 
  Brain, Calendar, ArrowRight, CornerDownRight, Tag, Milestone
} from 'lucide-react';

interface ClientProfilesProps {
  clients: Client[];
  memories: MemoryEntry[];
  onUpdateClient: (id: string, updated: Partial<Client>) => Promise<void>;
  onDeleteClient: (id: string) => Promise<void>;
  onSelectClientForProposal: (clientId: string) => void;
}

export default function ClientProfiles({
  clients,
  memories,
  onUpdateClient,
  onDeleteClient,
  onSelectClientForProposal
}: ClientProfilesProps) {
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [search, setSearch] = useState('');
  
  // Editing states
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editIndustry, setEditIndustry] = useState('');
  const [editTone, setEditTone] = useState('');
  const [editSensitivity, setEditSensitivity] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [editFormatting, setEditFormatting] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editTags, setEditTags] = useState('');

  const activeClient = clients.find(c => c.id === selectedClientId) || clients[0];

  // Start editing handler
  const handleStartEdit = () => {
    if (!activeClient) return;
    setEditName(activeClient.name);
    setEditIndustry(activeClient.industry);
    setEditTone(activeClient.preferredTone);
    setEditSensitivity(activeClient.pricingSensitivity);
    setEditFormatting(activeClient.preferredFormatting);
    setEditNotes(activeClient.decisionMakerNotes);
    setEditTags(activeClient.tags.join(', '));
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!activeClient) return;
    const tagsArray = editTags.split(',').map(t => t.trim()).filter(t => t !== '');
    await onUpdateClient(activeClient.id, {
      name: editName,
      industry: editIndustry,
      preferredTone: editTone,
      pricingSensitivity: editSensitivity,
      preferredFormatting: editFormatting,
      decisionMakerNotes: editNotes,
      tags: tagsArray
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!activeClient) return;
    if (confirm(`Are you sure you want to permanently delete client profile for ${activeClient.name}? This will update connected Hindsight index records.`)) {
      await onDeleteClient(activeClient.id);
      setSelectedClientId(clients.find(c => c.id !== activeClient.id)?.id || '');
    }
  };

  // Filter client list
  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.industry.toLowerCase().includes(search.toLowerCase())
  );

  // Grab Hindsight memories associated with selected client
  const clientMemories = activeClient 
    ? memories.filter(m => m.clientAssociation && m.clientAssociation.toLowerCase() === activeClient.name.toLowerCase())
    : [];

  return (
    <div className="animate-fade-in text-slate-800" id="clients-tab">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Client directory selector */}
        <div className="lg:col-span-4 space-y-6 text-left">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold text-sm text-slate-700 uppercase tracking-wider font-mono mb-3">Workspace Directory</h3>
            
            <input
              type="text"
              placeholder="Filter by name/industry..."
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 mb-4"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            {filteredClients.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No matching profiles.</p>
            ) : (
              <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                {filteredClients.map(c => {
                  const isSel = c.id === activeClient?.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSelectedClientId(c.id);
                        setIsEditing(false);
                      }}
                      className={`p-3 rounded-xl cursor-pointer border transition-all text-left ${
                        isSel 
                          ? 'bg-indigo-50/70 border-indigo-300 shadow-xs' 
                          : 'bg-slate-50 border-slate-150 hover:border-indigo-200 hover:bg-white'
                      }`}
                    >
                      <h4 className={`font-bold text-xs ${isSel ? 'text-indigo-700' : 'text-slate-800'}`}>{c.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 truncate">{c.industry}</p>
                      
                      <div className="flex justify-between items-center mt-2 text-[10px] text-slate-500 font-mono">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-450" /> Sens: {c.pricingSensitivity}
                        </span>
                        <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-600">
                          {memories.filter(m => m.clientAssociation === c.name).length} logs
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Detailed Profiler Drawer / Card */}
        <div className="lg:col-span-8 text-left">
          {!activeClient ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-sm text-slate-500">Please register or select a Client profile on the sidebar.</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              
              {/* Profile Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">{activeClient.name}</h2>
                    <p className="text-xs text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                      <Briefcase className="w-3.5 h-3.5" /> {activeClient.industry}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={() => onSelectClientForProposal(activeClient.id)}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-750 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                  >
                    Draft Document <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={isEditing ? handleSaveEdit : handleStartEdit}
                    className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 transition-colors cursor-pointer"
                    title={isEditing ? 'Save Changes' : 'Edit Profile'}
                    id="edit-client-btn"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-1.5 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 rounded-lg text-rose-650 transition-colors cursor-pointer"
                    title="Delete Profile"
                    id="delete-client-btn"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Editable Fields Grid */}
              {isEditing ? (
                <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200 animate-fade-in">
                  <h4 className="text-[10px] font-mono font-bold text-indigo-600 camelcase tracking-widest">Editing Account Profile</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-550 uppercase font-bold mb-1">Company Name</label>
                      <input
                        type="text"
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-550 uppercase font-bold mb-1">Industry Vertical</label>
                      <input
                        type="text"
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-505"
                        value={editIndustry}
                        onChange={e => setEditIndustry(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-550 uppercase font-bold mb-1">Required Tone Mode</label>
                      <input
                        type="text"
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-505"
                        value={editTone}
                        onChange={e => setEditTone(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-550 uppercase font-bold mb-1">Payment/Formatting Guidelines</label>
                      <input
                        type="text"
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-505"
                        value={editFormatting}
                        onChange={e => setEditFormatting(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Pricing Sensitivity</label>
                      <select
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-505"
                        value={editSensitivity}
                        onChange={e => setEditSensitivity(e.target.value as any)}
                      >
                        <option value="Low">Low Sensitivity</option>
                        <option value="Medium">Medium Sensitivity</option>
                        <option value="High">High Sensitivity</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Tags (separated by comma)</label>
                      <input
                        type="text"
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-505"
                        value={editTags}
                        onChange={e => setEditTags(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Decision-Maker Intangibles</label>
                    <textarea
                      rows={3}
                      className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-550"
                      value={editNotes}
                      onChange={e => setEditNotes(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-600 text-xs rounded border border-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-4 py-1 bg-indigo-600 text-white font-bold text-xs rounded hover:bg-indigo-750 cursor-pointer"
                    >
                      Complete Save
                    </button>
                  </div>
                </div>
              ) : (
                /* Interactive Profile Read view */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" id="client-specs-display">
                  
                  {/* Panel 1 */}
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0 mt-0.5">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Preferred Tone</span>
                        <p className="text-xs text-slate-800 mt-0.5 font-bold">{activeClient.preferredTone}</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0 mt-0.5">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Pricing Model Sensitivity</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            activeClient.pricingSensitivity === 'High' 
                              ? 'bg-rose-50 border border-rose-200 text-rose-700' 
                              : activeClient.pricingSensitivity === 'Medium'
                              ? 'bg-amber-50 border border-amber-200 text-amber-705'
                              : 'bg-emerald-50 border border-emerald-250 text-emerald-700'
                          }`}>
                            {activeClient.pricingSensitivity} Sensitivity
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0 mt-0.5">
                        <FileCode className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Layout Formatting Preferences</span>
                        <p className="text-xs text-slate-800 mt-1 font-medium">{activeClient.preferredFormatting}</p>
                      </div>
                    </div>
                  </div>

                  {/* Panel 2 */}
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 h-full flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block mb-1">Decision-Maker & Intangibles Dossier</span>
                        <p className="text-xs text-slate-600 leading-relaxed italic pr-2">
                          "{activeClient.decisionMakerNotes || 'No specific intangibles profile registered yet.'}"
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/60">
                        <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">Classification Tags</span>
                        <div className="flex gap-1 flex-wrap mt-1.5">
                          {activeClient.tags.map((tg, i) => (
                            <span key={i} className="text-[9px] font-mono px-2 py-0.5 bg-white hover:bg-slate-50 text-slate-600 rounded border border-slate-200 inline-flex items-center gap-1">
                              <Tag className="w-2.5 h-2.5 text-indigo-600" /> {tg}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Connected Client Hindsight Memory Trace files list */}
              <div className="border-t border-slate-100 pt-6">
                <h3 className="font-bold text-sm text-slate-800 uppercase tracking-widest font-mono mb-4 flex items-center gap-2">
                  <Brain className="w-4.5 h-4.5 text-indigo-600 animate-pulse" /> Active Hindsight memory Traces ({clientMemories.length})
                </h3>

                {clientMemories.length === 0 ? (
                  <div className="bg-slate-50/70 border border-dashed border-slate-200 p-6 rounded-xl text-center">
                    <p className="text-xs text-slate-500 font-mono">No historical traces mapped exclusively to this company. Standard tags apply.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {clientMemories.map(mem => {
                      let tagClass = 'bg-indigo-50 border-indigo-200 text-indigo-700';
                      if (mem.sourceType === 'past_proposal') tagClass = 'bg-emerald-50 border-emerald-200 text-emerald-700';
                      if (mem.sourceType === 'win_loss_audit') tagClass = 'bg-rose-50 border-rose-200 text-rose-700';

                      return (
                        <div
                          key={mem.id}
                          className="bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-white rounded-xl p-4 space-y-2.5 text-left flex flex-col justify-between transition-all"
                        >
                          <div className="space-y-1">
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{mem.title}</h4>
                              <span className={`text-[8px] px-1.5 py-0.5 rounded border uppercase font-mono tracking-wider ${tagClass}`}>
                                {mem.sourceType.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-tight">
                              {mem.content}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[9px] font-mono text-slate-500 select-none">
                            <span className="flex items-center gap-1">
                              <Milestone className="w-3 h-3 text-indigo-650" /> Confidence: {(mem.confidence * 100).toFixed(0)}%
                            </span>
                            <span>Recalled: {mem.retrievalCount} times</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
