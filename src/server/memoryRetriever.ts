/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Client, MemoryEntry } from '../types.js';

/**
 * Searches and scores Hindsight memory entries for an RFP and Client context.
 * Returns memories sorted by descending confidence.
 */
export function retrieveMemories(
  allMemories: MemoryEntry[],
  client: Client,
  rfpTitle: string,
  rfpContent: string
): MemoryEntry[] {
  const query = `${rfpTitle} ${rfpContent}`.toLowerCase();
  
  // Create a list of keyword tags from the RFP text
  const rfpKeywords = new Set<string>();
  const commonKeywords = [
    'compliance', 'security', 'hipaa', 'aws', 'govcloud', 'scalability', 'redis', 
    'sync', 'logistics', 'pricing', 'volume', 'sla', 'uptime', 'retail', 'healthcare', 'telecom'
  ];
  
  for (const word of commonKeywords) {
    if (query.includes(word)) {
      rfpKeywords.add(word);
    }
  }

  // Score each memory entry in the database
  const scoredMemories = allMemories.map(entry => {
    let score = 0;

    // 1. Client Association match (highest weight)
    if (entry.clientAssociation && entry.clientAssociation.toLowerCase() === client.name.toLowerCase()) {
      score += 0.50; // High base boost for exact client profile match
    }

    // 2. Tag intersections
    let tagMatches = 0;
    if (entry.tags && entry.tags.length > 0) {
      entry.tags.forEach(tag => {
        const normalizedTag = tag.toLowerCase();
        // Check if RFP keywords, text query, or client tags have an intersection
        if (rfpKeywords.has(normalizedTag) || query.includes(normalizedTag) || client.tags.includes(normalizedTag)) {
          tagMatches++;
        }
      });
    }
    score += Math.min(tagMatches * 0.15, 0.40); // Cap tag contribution at 0.40

    // 3. Past outcome premium high-confidence boost
    if (entry.outcomeLink === 'Won') {
      score += 0.10; // Extra credibility boost for won proposals
    } else if (entry.outcomeLink === 'Lost') {
      score += 0.08; // Proactive risk mitigation value
    }

    // Convert score to a stable confidence level between 0.0 and 1.0
    // Always guarantee that a minimal relevance exists if client matches or keywords intersect
    const baseConfidence = entry.confidence || 0.80;
    const finalConfidence = Math.min(Math.max(baseConfidence * (0.4 + score), 0.3), 0.99);

    return {
      ...entry,
      confidence: parseFloat(finalConfidence.toFixed(2))
    };
  });

  // Filter out completely irrelevant memories (e.g. low base score and not associate with the client)
  const filtered = scoredMemories.filter(entry => {
    const isClientMatch = entry.clientAssociation && entry.clientAssociation.toLowerCase() === client.name.toLowerCase();
    const hasSomeOverlap = entry.tags.some(tag => {
      const t = tag.toLowerCase();
      return query.includes(t) || client.tags.includes(t);
    });
    return isClientMatch || hasSomeOverlap;
  });

  // Return the sorted list by confidence (descending)
  return filtered.sort((a, b) => b.confidence - a.confidence);
}
