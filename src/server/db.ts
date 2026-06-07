/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import { AppDatabase, Client, MemoryEntry, Proposal, Snippet, AuditLog } from '../types.js';

const DB_FILE_PATH = path.join(process.cwd(), 'database.json');

// Helper to get fresh mock dates relative to current date
function getDateAgo(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

const defaultDatabase: AppDatabase = {
  workspace: {
    id: 'ws-1',
    name: 'OmniBid Enterprise Systems',
    industry: 'Enterprise Software & Integration Solutions',
    description: 'AI-driven bidding, RFP generation, and organizational historical content memory layer.'
  },
  clients: [
    {
      id: 'client-1',
      name: 'Apex Retail Co.',
      industry: 'E-commerce & Retail Logistics',
      preferredTone: 'Crisp, tech-forward, conversational but highly analytical',
      pricingSensitivity: 'Medium',
      preferredFormatting: 'Strict Executive Summary followed by structured benefit tables and Net-60 Payment Terms',
      decisionMakerNotes: 'Sarah Vance (Chief of Commerce Logistics). Deeply dislikes generic consultese and dry cloud jargon. Always asks about inventory lag-time and scalability during peak Black Friday events.',
      tags: ['retail', 'logistics', 'saas', 'scalability']
    },
    {
      id: 'client-2',
      name: 'MedVanguard Healthcare',
      industry: 'Healthcare Technology & Medical Networks',
      preferredTone: 'Formal, compliance-driven, security-authoritative, highly evidence-backed',
      pricingSensitivity: 'Low',
      preferredFormatting: 'Numbered lists for functional requirements, dedicated section for HIPAA Compliance & SOC3 Certifications',
      decisionMakerNotes: 'Dr. Arthur Pendelton (VP of Medical Security & InfoSec). Priority number one is patient data encryption, AWS GovCloud logical backup isolation, and rapid response SLAs during system health updates.',
      tags: ['healthcare', 'compliance', 'security', 'hipaa', 'aws-govcloud']
    },
    {
      id: 'client-3',
      name: 'Globex Telecom Corp',
      industry: 'Telecommunications & Broadband Infrastructure',
      preferredTone: 'Bold, highly technical, SLA-obsessed, outcome-oriented',
      pricingSensitivity: 'High',
      preferredFormatting: 'Grid layouts for pricing packages, explicit bullet-point comparison metrics with legacy carriers',
      decisionMakerNotes: 'Marcus Brody (VP of Global Infrastructure). Highly sensitive to pricing discounts for volume licensing. Always asks about 5G integration architecture and backward compatibility with copper-wire setups.',
      tags: ['telecom', 'infrastructure', '5g', 'sla', 'volume-pricing']
    }
  ],
  snippets: [
    {
      id: 'snp-1',
      title: 'AWS GovCloud HIPAA Isolation Framework',
      category: 'Security & Compliance',
      content: 'Our platform is deployed natively within AWS GovCloud, maintaining logical database separation and compliance with strictly isolated server tenances. Direct database access is gated by IAM OAuth2 authentication tokens, backed up hourly with AES-256 local encrypted file structures. Standard recovery tests are performed biannually to maintain HIPAA strict administrative parameters.',
      tags: ['aws-govcloud', 'hipaa', 'security', 'compliance']
    },
    {
      id: 'snp-2',
      title: 'Ultra-Lag Real-Time Sync Strategy',
      category: 'Performance & Tech',
      content: 'Using event-driven Redis cluster queues and distributed message brokers, our platform guarantees inventory synchronization across active warehouse hubs within less than 250 milliseconds, processing up to 35,000 requests per second. Failover backups instantly re-route logistics loads to secondary availability grids in under 4 seconds without active process interruptions.',
      tags: ['scalability', 'redis', 'sync', 'logistics']
    },
    {
      id: 'snp-3',
      title: 'Tiered Enterprise Volume Discount Tiering',
      category: 'Commercials',
      content: 'For infrastructure scale deployment over 5,000 active nodes, we extend a structured monthly recurring volume discount: 5,000-10,000 active nodes: $10.50/user/month (12.5% discount); 10,000+ active nodes: $8.90/user/month (25.8% discount). All subscription tiers operate under Net-60 commercial guidelines as requested by executive finance boards.',
      tags: ['pricing', 'volume-pricing', 'commercials']
    }
  ],
  memories: [
    {
      id: 'mem-1',
      sourceType: 'client_profile',
      clientAssociation: 'Apex Retail Co.',
      title: 'Apex Retail Critical Communication Preferences',
      content: 'Apex Retail C-Suite strongly prefers that technical proposals focus on direct business metrics (e.g., inventory lag reduced to <300ms, operational cost savings) instead of generic buzzwords like "paradigm shift" or "synergy". Highlighting Net-60 credit flexibility builds high initial purchasing trust.',
      tags: ['Apex Retail Co.', 'pricing', 'tone', 'notes'],
      confidence: 0.95,
      timestamp: getDateAgo(12),
      retrievalCount: 22
    },
    {
      id: 'mem-2',
      sourceType: 'past_proposal',
      clientAssociation: 'MedVanguard Healthcare',
      title: 'Proven Healthcare Security Pitch (2025 Won Proposal)',
      content: 'MedVanguard VP of InfoSec explicitly approved and bought our service in Q3 2025 because we detailed AWS GovCloud dedicated firewalls, hourly data sanitization procedures, and provided a clear, bulleted list of HIPAA mapping compliance rules. It won against competitors because of this precise level of detailed compliance verification.',
      tags: ['MedVanguard Healthcare', 'security', 'compliance', 'won-pattern'],
      confidence: 0.88,
      timestamp: getDateAgo(30),
      outcomeLink: 'Won',
      retrievalCount: 14
    },
    {
      id: 'mem-3',
      sourceType: 'feedback_loop',
      clientAssociation: 'Globex Telecom Corp',
      title: 'Objection Log: 2025 Core Upgrade Loss Analysis',
      content: 'Failed Q1 2025 bid for Globex because the proposed SLA guarantee of 99.9% was considered too low for telecom carrier requirements, and the pricing model was fixed (no bulk volume discount). Correction rule for future Globex Telecom bids: We must always propose our Tiered Volume Discount Sheet and offer a 99.999% SLA carrier tier explicitly.',
      tags: ['Globex Telecom Corp', 'sla', 'pricing', 'objections', 'lost-pattern'],
      confidence: 0.92,
      timestamp: getDateAgo(45),
      outcomeLink: 'Lost',
      retrievalCount: 19
    },
    {
      id: 'mem-4',
      sourceType: 'manual_snippet',
      clientAssociation: 'Apex Retail Co.',
      title: 'Apex Black Friday Stress Audit Guarantee',
      content: 'Apex requires an explicit guarantee that operations can handle a 10x traffic spike during holiday periods. In our next RFP responding to them, reference our 2025 stress audit where our warehouse broker successfully dispatched 24 million transactions over 24 hours with zero dropped payloads.',
      tags: ['Apex Retail Co.', 'scalability', 'ref-cases'],
      confidence: 0.90,
      timestamp: getDateAgo(8),
      retrievalCount: 11
    }
  ],
  proposals: [
    {
      id: 'prop-1',
      title: 'Apex Retail Inventory Hub Sync 2.0',
      clientId: 'client-1',
      clientName: 'Apex Retail Co.',
      rfpTitle: 'Logistics Queue and Real-time Inventory Automation',
      rfpContent: 'We are seeking an enterprise logistics portal to centralize inventory data from 4 major distribution hubs. Primary needs are latency <500ms, support for 15,000 requests per minute, a clear description of scalability during major retail holiday peaks, and flexible payment plans.',
      baselineDraft: `### Executive Summary
Our company is a leading provider of innovative cloud logistics platforms. We synergize systems to drive paradigm-shifting digital transformations. Our world-class infrastructure offers maximum uptime and extreme performance to modern retail players.

### Technical Solution
We deploy modern microservices that connect all your distribution hubs smoothly. The queue is managed via industry-standard protocols, guaranteeing very fast delivery and real-time dashboard updates. It supports up to 15,000 requests per minute easily.

### Pricing & Terms
Our standard license package starts at a high fee of $15,000/month setup, following standard Net-30 payment structures.`,
      enhancedDraft: `### Executive Summary: Apex Inventory Sync Solution
We propose a dedicated, low-latency integration portal specifically designed to sync Apex Retail Co.'s 4 major distribution hubs in real-time. By prioritizing direct operational metrics and avoiding fluff, our architecture directly targets Apex's core requirements.

### Real-Time Performance & Peak Holiday Scalability
Our technical solution addresses requirements for sub-500ms latency and scales effectively during high-volume events:
1. **Inventory Sync Latency**: Leveraging event-driven Redis cluster queues, we guarantee inventory updates across Apex hubs in under 250 milliseconds—well beneath the requested 500ms limit.
2. **Black Friday Peak Guarantee**: Grounded in our 2025 stress audit where our warehouse system dispatched 24 million active transactions over 24 hours with zero dropped payloads, we guarantee capacity for traffic surges up to 10x standard volumes.

### Competitive Commercials & Payment Terms
To align with Apex Retail's financial requirements:
* **Pricing Model**: Standard usage tier structured with volume growth considerations.
* **Friendly Payment Guidelines**: We operate fully under Net-60 Payment Terms as preferred by your executive board.
* **Direct Point of Contact**: To satisfy Sarah Vance, we provide a dedicated logistics account lead to coordinate implementation onboarding.`,
      improvements: [
        'Removed generic words like "synergy", "paradigm-shifting" and "world-class" based on communication preferences.',
        'Injected the Redis Sync latency metric (<250ms) derived from Hindsight past snippets.',
        'Injected the 2025 Stress Audit data with 24 million peak transactions to address peak scalability.',
        'Configured pricing terms directly as Net-60 to match client preferred formatting memories.',
        'Highlighted client logistical priorities based on Chief of Commerce notes.'
      ],
      retrievedMemories: [
        {
          id: 'mem-1',
          sourceType: 'client_profile',
          clientAssociation: 'Apex Retail Co.',
          title: 'Apex Retail Critical Communication Preferences',
          content: 'Apex Retail C-Suite strongly prefers that technical proposals focus on direct business metrics instead of generic buzzwords like "paradigm shift" or "synergy". Highlighting Net-60 credit flexibility builds high initial purchasing trust.',
          tags: ['Apex Retail Co.', 'pricing', 'tone', 'notes'],
          confidence: 0.95,
          timestamp: getDateAgo(12),
          retrievalCount: 23
        },
        {
          id: 'mem-4',
          sourceType: 'manual_snippet',
          clientAssociation: 'Apex Retail Co.',
          title: 'Apex Black Friday Stress Audit Guarantee',
          content: 'Apex requires an explicit guarantee that operations can handle a 10x traffic spike during holiday periods. In our next RFP responding to them, reference our 2025 stress audit where our warehouse broker successfully dispatched 24 million transactions over 24 hours with zero dropped payloads.',
          tags: ['Apex Retail Co.', 'scalability', 'ref-cases'],
          confidence: 0.90,
          timestamp: getDateAgo(8),
          retrievalCount: 12
        }
      ],
      outcome: 'Won',
      feedback: 'Excellent work. The team was highly impressed by the exact SLA transaction figures and the Net-60 commercial structures. They didn\'t have to push back at all.',
      createdAt: getDateAgo(5)
    }
  ],
  auditLogs: [
    {
      id: 'log-1',
      timestamp: getDateAgo(12),
      action: 'INGESTED_MEMORY_PROFILE',
      details: 'Added Apex Retail custom communication preferences directly to Hindsight memory.',
      type: 'memory'
    },
    {
      id: 'log-2',
      timestamp: getDateAgo(10),
      action: 'LEARNED_OBJECTIONS_LOCKED',
      details: 'Analysed Globex Telecom Q1 2025 failure. Identified critical obections: insufficient 99.9% SLA and fixed pricing structures.',
      type: 'warning'
    },
    {
      id: 'log-3',
      timestamp: getDateAgo(5),
      action: 'GENERATED_PROPOSAL_MATCH',
      details: 'Apex Inventory Hub Sync proposal generated. Injected 2 relevant historical records with average memory confidence of 92.5%.',
      type: 'success'
    },
    {
      id: 'log-4',
      timestamp: getDateAgo(5),
      action: 'PROPOSAL_WON_CONFIRMED',
      details: 'Proposal "Apex Retail Inventory Hub Sync 2.0" marked as WON. Ingested winning pattern into Hindsight memory pipeline.',
      type: 'success'
    }
  ]
};

export class MemoryDatabase {
  private data: AppDatabase;

  constructor() {
    this.data = this.load();
  }

  private load(): AppDatabase {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(fileContent);
        // Ensure standard objects exist
        return {
          workspace: parsed.workspace || defaultDatabase.workspace,
          clients: parsed.clients || defaultDatabase.clients,
          snippets: parsed.snippets || defaultDatabase.snippets,
          memories: parsed.memories || defaultDatabase.memories,
          proposals: parsed.proposals || defaultDatabase.proposals,
          auditLogs: parsed.auditLogs || defaultDatabase.auditLogs,
        };
      }
    } catch (e) {
      console.error('Error loading database file. Initializing defaults instead.', e);
    }

    // Initialize default database
    this.saveData(defaultDatabase);
    return defaultDatabase;
  }

  private saveData(data: AppDatabase): void {
    try {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write database file:', e);
    }
  }

  public get(): AppDatabase {
    return this.data;
  }

  public save(): void {
    this.saveData(this.data);
  }

  // --- Clients CRUD ---
  public getClients(): Client[] {
    return this.data.clients;
  }

  public getClient(id: string): Client | undefined {
    return this.data.clients.find(c => c.id === id);
  }

  public createClient(client: Omit<Client, 'id'>): Client {
    const newClient: Client = {
      ...client,
      id: `client-${Date.now()}`
    };
    this.data.clients.push(newClient);
    this.logAndSave('CLIENT_CREATED', `Client profile created for ${newClient.name}`, 'success');
    
    // Auto-create initial Hindsight entry for this client profile
    this.createMemory({
      sourceType: 'client_profile',
      clientAssociation: newClient.name,
      title: `${newClient.name} Profile Preferences`,
      content: `Client Industry: ${newClient.industry}. Preferred Tone: ${newClient.preferredTone}. Pricing Sensitivity: ${newClient.pricingSensitivity}. Preferred Formatting Constraints: ${newClient.preferredFormatting}. Extra Notes: ${newClient.decisionMakerNotes}`,
      tags: [newClient.name, ...newClient.tags, 'preferences'],
      confidence: 0.95
    });

    return newClient;
  }

  public updateClient(id: string, updatedFields: Partial<Client>): Client | undefined {
    const idx = this.data.clients.findIndex(c => c.id === id);
    if (idx === -1) return undefined;

    const oldClient = this.data.clients[idx];
    const updatedClient = { ...oldClient, ...updatedFields };
    this.data.clients[idx] = updatedClient;
    this.logAndSave('CLIENT_UPDATED', `Client profile updated for ${updatedClient.name}`, 'info');

    // Sync to Hindsight memory
    const existingMemIdx = this.data.memories.findIndex(
      m => m.sourceType === 'client_profile' && m.clientAssociation === updatedClient.name
    );
    if (existingMemIdx !== -1) {
      this.data.memories[existingMemIdx].content = `Client Industry: ${updatedClient.industry}. Preferred Tone: ${updatedClient.preferredTone}. Pricing Sensitivity: ${updatedClient.pricingSensitivity}. Preferred Formatting Constraints: ${updatedClient.preferredFormatting}. Extra Notes: ${updatedClient.decisionMakerNotes}`;
      this.data.memories[existingMemIdx].tags = [updatedClient.name, ...updatedClient.tags, 'preferences'];
    } else {
      this.createMemory({
        sourceType: 'client_profile',
        clientAssociation: updatedClient.name,
        title: `${updatedClient.name} Profile Preferences`,
        content: `Client Industry: ${updatedClient.industry}. Preferred Tone: ${updatedClient.preferredTone}. Pricing Sensitivity: ${updatedClient.pricingSensitivity}. Preferred Formatting Constraints: ${updatedClient.preferredFormatting}. Extra Notes: ${updatedClient.decisionMakerNotes}`,
        tags: [updatedClient.name, ...updatedClient.tags, 'preferences'],
        confidence: 0.95
      });
    }

    return updatedClient;
  }

  public deleteClient(id: string): boolean {
    const client = this.getClient(id);
    if (!client) return false;
    this.data.clients = this.data.clients.filter(c => c.id !== id);
    this.logAndSave('CLIENT_DELETED', `Deleted client profile for ${client.name}`, 'info');
    return true;
  }

  // --- Hindsight-Memory CRUD ---
  public getMemories(): MemoryEntry[] {
    return this.data.memories;
  }

  public createMemory(memory: Omit<MemoryEntry, 'id' | 'timestamp' | 'retrievalCount'>): MemoryEntry {
    const newEntry: MemoryEntry = {
      ...memory,
      id: `mem-${Date.now()}`,
      timestamp: new Date().toISOString(),
      retrievalCount: 0
    };
    this.data.memories.unshift(newEntry);
    this.logAndSave('INGESTED_MEMORY', `Hindsight ingested record: "${newEntry.title}"`, 'memory');
    return newEntry;
  }

  public incrementMemoryCount(id: string): void {
    const mem = this.data.memories.find(m => m.id === id);
    if (mem) {
      mem.retrievalCount++;
      this.save();
    }
  }

  public deleteMemory(id: string): boolean {
    const mem = this.data.memories.find(m => m.id === id);
    if (!mem) return false;
    this.data.memories = this.data.memories.filter(m => m.id !== id);
    this.logAndSave('MEMORY_DELETED', `Removed Hindsight memory: "${mem.title}"`, 'info');
    return true;
  }

  // --- Snippet List CRUD ---
  public getSnippets(): Snippet[] {
    return this.data.snippets;
  }

  public createSnippet(snippet: Omit<Snippet, 'id'>): Snippet {
    const newSnp: Snippet = {
      ...snippet,
      id: `snp-${Date.now()}`
    };
    this.data.snippets.unshift(newSnp);
    
    // Automatically ingest this content snippet into Hindsight as a reusable manual memory trace
    this.createMemory({
      sourceType: 'manual_snippet',
      title: `Library Snippet: ${newSnp.title}`,
      content: newSnp.content,
      tags: [...newSnp.tags, newSnp.category.toLowerCase(), 'snippet'],
      confidence: 0.90
    });

    this.logAndSave('SNIPPET_CREATED', `Custom knowledge snippet added: "${newSnp.title}"`, 'success');
    return newSnp;
  }

  public deleteSnippet(id: string): boolean {
    const snp = this.data.snippets.find(s => s.id === id);
    if (!snp) return false;
    this.data.snippets = this.data.snippets.filter(s => s.id !== id);
    this.logAndSave('SNIPPET_DELETED', `Deleted knowledge snippet: "${snp.title}"`, 'info');
    return true;
  }

  // --- Proposal CRUD ---
  public getProposals(): Proposal[] {
    return this.data.proposals;
  }

  public getProposal(id: string): Proposal | undefined {
    return this.data.proposals.find(p => p.id === id);
  }

  public createProposal(proposal: Proposal): Proposal {
    this.data.proposals.unshift(proposal);
    this.logAndSave('PROPOSAL_RECORDED', `Generated bid draft proposal for ${proposal.clientName}: "${proposal.title}"`, 'success');
    return proposal;
  }

  public updateProposalOutcome(id: string, outcome: 'Won' | 'Lost' | 'Pending', feedback?: string): Proposal | undefined {
    const prop = this.data.proposals.find(p => p.id === id);
    if (!prop) return undefined;

    prop.outcome = outcome;
    if (feedback !== undefined) prop.feedback = feedback;

    this.logAndSave(
      'OUTCOME_RECORDED',
      `Proposal "${prop.title}" marked as ${outcome.toUpperCase()}`,
      outcome === 'Won' ? 'success' : (outcome === 'Lost' ? 'warning' : 'info')
    );

    // Feed outcome + feedback into Hindsight pipeline to update organizational memory trace
    let actionFeedbackMsg = feedback ? ` User Feedback received: "${feedback}".` : '';
    this.createMemory({
      sourceType: 'win_loss_audit',
      clientAssociation: prop.clientName,
      title: `Submission Audit: ${prop.title} (${outcome})`,
      content: `Proposal for "${prop.rfpTitle}" submitted on ${new Date(prop.createdAt).toLocaleDateString()} was marked as [${outcome.toUpperCase()}].${actionFeedbackMsg} Key historical relevance of baseline: Client priorities met. Retained tags: ${prop.improvements.length} enhancements successfully incorporated.`,
      tags: [prop.clientName, outcome.toLowerCase(), 'proposal-outcome'],
      confidence: 0.98,
      outcomeLink: outcome
    });

    return prop;
  }

  // --- Audit Logs ---
  public getAuditLogs(): AuditLog[] {
    return this.data.auditLogs;
  }

  public logAndSave(action: string, details: string, type: 'info' | 'success' | 'warning' | 'memory' = 'info'): void {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      details,
      type
    };
    this.data.auditLogs.unshift(newLog);
    // Trim audit logs to keep file light
    if (this.data.auditLogs.length > 100) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 100);
    }
    this.save();
  }
}

export const dbConnection = new MemoryDatabase();
