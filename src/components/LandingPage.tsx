/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, Brain, Zap, ArrowRight, ShieldCheck, RefreshCw, BarChart } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onEnterApp: () => void;
}

export default function LandingPage({ onEnterApp }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between select-none relative" id="landing-page">
      {/* Radial Grid Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-80" />

      {/* Header element */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-[0_4px_12px_rgba(79,70,229,0.15)] border border-indigo-500">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-indigo-850 bg-clip-text text-transparent">
                OmniBid AI
              </span>
              <span className="hidden sm:block text-[10px] text-slate-500 font-mono -mt-1 font-semibold uppercase tracking-wider">
                HINDSIGHT PROPOSAL AGENT
              </span>
            </div>
          </div>

          <button
            onClick={onEnterApp}
            className="group px-4 py-2 text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl flex items-center gap-2 cursor-pointer transition-all duration-300 font-medium"
            id="login-btn"
          >
            Enter Platform <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col md:grid md:grid-cols-12 md:gap-12 justify-center items-center relative z-10">
        <div className="md:col-span-7 flex flex-col gap-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-xs text-indigo-750 font-mono self-start font-medium leading-none">
            <Zap className="w-3.5 h-3.5 text-indigo-600 animate-pulse" /> Unified Bidding Memory Layer Deployed
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Stop Recreating the Same{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Winning Proposals
            </span>
          </h1>

          <p className="text-slate-605 text-base sm:text-lg max-w-2xl leading-relaxed">
            Organizations spend thousands of hours manually copying past bid response content. 
            OmniBid registers client preferences, compliance details, and past win/loss objections into 
            <strong className="text-indigo-950 font-bold"> Hindsight</strong>, a localized organizational memory layer 
            that injects historical intelligence back into future opportunities.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-2">
            <button
              onClick={onEnterApp}
              className="px-8 py-4 text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-750 shadow-lg shadow-indigo-600/20 cursor-pointer flex items-center justify-center gap-2.5 transition-all duration-300 hover:-translate-y-0.5"
              id="cta-launch"
            >
              Launch RFP Proposal Workspace <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-6 pt-8 mt-4 border-t border-slate-200">
            <div>
              <div className="text-3xl font-extrabold text-indigo-600 font-mono">92%</div>
              <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Proposal Draft Speedup</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-sky-600 font-mono">4.1x</div>
              <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Hindsight Recall Score</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-emerald-600 font-mono">81.4%</div>
              <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Seeded Win-Rate</div>
            </div>
          </div>
        </div>

        {/* Floating Concept Animation Panel (Bento Block) */}
        <div className="md:col-span-12 lg:col-span-5 w-full mt-12 lg:mt-0 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl blur-xl opacity-10" />
          <div className="relative bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 font-mono flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin-slow animate-spin" /> Hindsight Memory Loop in Action
            </h3>

            {/* Loop Timeline simulation */}
            <div className="flex flex-col gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-amber-600 font-mono uppercase">1. Ingest Past Outlay</span>
                  <span className="text-[10px] text-slate-500 font-mono font-semibold">PROPOSAL #041</span>
                </div>
                <p className="text-xs text-slate-600 leading-normal">
                  Client objected: "Lacks GovCloud HIPAA SLA guarantees..."
                </p>
                <div className="mt-1.5 flex gap-1.5 flex-wrap">
                  <span className="text-[9px] px-1.5 bg-white text-slate-500 rounded border border-slate-200 font-mono">Objection Saved</span>
                </div>
              </div>

              <div className="flex justify-center my-0.5">
                <div className="h-4 w-0.5 bg-gradient-to-b from-amber-200 to-indigo-500" />
              </div>

              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-indigo-700 font-mono uppercase">2. Retrieve memory layer</span>
                  <span className="text-[10px] text-indigo-600 font-mono font-bold">HINDSIGHT GOSSIPED</span>
                </div>
                <p className="text-xs text-indigo-950 font-medium leading-normal">
                  Matches healthcare RFP → Automatically queries & ranks security isolation snippets and SLA objections.
                </p>
              </div>

              <div className="flex justify-center my-0.5">
                <div className="h-4 w-0.5 bg-gradient-to-b from-indigo-300 to-emerald-500" />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-202">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-emerald-700 font-mono uppercase">3. Generate tailored bid</span>
                  <span className="text-[10px] text-emerald-600 font-mono font-semibold">99.99% PERFECTED</span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 font-mono leading-relaxed">
                  "...We provide MedVanguard a carrier-grade 99.99% SLA hosted natively inside AWS GovCloud HIPAA isolation..."
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Feature Section */}
      <section className="bg-white/50 border-y border-slate-150 px-6 py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Why Judges Love Hindsight Proposal Agent
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-2">
              Unlike traditional text models that output general boilerplate, OmniBid relies on stored organizational memory files to construct precise, proven structures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all text-left">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                <BookOpen className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="font-semibold text-lg text-slate-800">Visible Memory Traces</h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
                Watch exactly which files, customer preference points, and past feedback bundles were queried and implemented before drafting begins.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all text-left">
              <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-slate-800">Before & After Comparative View</h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
                Visually examine side-by-side drafts. Compare the baseline draft (tainted with bad abstract buzzwords) with the memory-enhanced target response.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-205 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all text-left">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                <BarChart className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-slate-800">Outcome Feedback Loop</h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
                Mark proposal outcomes as Won or Lost. The system automatically extracts objections & justifications, instantly self-training future generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 60 Second Demo Quick Story */}
      <section className="max-w-7xl mx-auto px-6 py-12 text-left relative z-10 w-full">
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="max-w-3xl">
              <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider mb-2">
                60-Second Demo walkthrough for Hackathon Evaluators
              </h3>
              <ol className="text-indigo-200 text-xs sm:text-sm space-y-2 list-decimal list-inside leading-relaxed">
                <li>Click <strong className="text-white">Launch RFP Proposal Workspace</strong>.</li>
                <li>Go to the <strong className="text-white">Generate Bid</strong> tab.</li>
                <li>Select client <strong className="text-white">MedVanguard Healthcare</strong>, then click the preloaded RFP template button.</li>
                <li>Click <strong className="text-white font-bold bg-indigo-800 px-1.5 py-0.5 rounded border border-indigo-700">Analyze Memory & Generate Proposal</strong>. Watch the memory system recall credentials and SLA objections.</li>
                <li>Analyze the <strong className="text-white">Comparative view</strong>: Inspect how Hindsight fixed pricing limits and injected GovCloud HIPAA terms.</li>
                <li>Mark the proposal as <strong className="text-white font-bold bg-emerald-800 px-1.5 py-0.5 rounded border border-emerald-700">Won</strong> and observe the timeline database auto-train instantly.</li>
              </ol>
            </div>
            
            <button
              onClick={onEnterApp}
              className="px-6 py-3 bg-white hover:bg-slate-50 text-indigo-950 text-sm font-semibold rounded-xl self-start md:self-center transition-all cursor-pointer shadow-lg active:scale-95"
            >
              Start Quick Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer element */}
      <footer className="border-t border-slate-200 bg-white p-6 text-center text-xs text-slate-500 select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 OmniBid AI Inc. Running securely on Cloud Run isolation.</p>
          <div className="flex gap-4 font-mono text-[10px]">
            <span>Hindsight DB Status: <strong className="text-emerald-600 font-bold">● Healthy</strong></span>
            <span className="text-slate-300">|</span>
            <span>API Gateway Node: <strong className="text-slate-550">v2.4.0 (Express)</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
