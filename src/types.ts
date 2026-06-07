/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Workspace {
  id: string;
  name: string;
  industry: string;
  description: string;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  preferredTone: string;
  pricingSensitivity: 'High' | 'Medium' | 'Low';
  preferredFormatting: string;
  decisionMakerNotes: string;
  tags: string[];
}

export interface MemoryEntry {
  id: string;
  sourceType: 'past_proposal' | 'client_profile' | 'feedback_loop' | 'manual_snippet' | 'win_loss_audit';
  clientAssociation?: string; // Client Name
  title: string;
  content: string;
  tags: string[];
  confidence: number; // 0.0 to 1.0 relevance
  timestamp: string;
  outcomeLink?: 'Won' | 'Lost' | 'Pending';
  retrievalCount: number;
}

export interface Proposal {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  rfpTitle: string;
  rfpContent: string;
  baselineDraft: string;
  enhancedDraft: string;
  improvements: string[]; // List of specific differences / highlights of what was added from Hindsight
  retrievedMemories: MemoryEntry[];
  outcome: 'Won' | 'Lost' | 'Pending';
  feedback?: string;
  createdAt: string;
}

export interface Snippet {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  type: 'info' | 'success' | 'warning' | 'memory';
}

export interface GenerateProposalRequest {
  clientId: string;
  rfpTitle: string;
  rfpContent: string;
  customNotes?: string;
}

export interface AppDatabase {
  workspace: Workspace;
  clients: Client[];
  memories: MemoryEntry[];
  proposals: Proposal[];
  snippets: Snippet[];
  auditLogs: AuditLog[];
}
