/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'citizen' | 'admin';
  department?: string; // e.g. "Sanitation & Waste", "Roads & Transport" (Admin/Officer only)
  createdAt: string;
}

export interface HistoryLog {
  id: string;
  action: string;      // e.g. "Ticket Filed", "AI Classification", "Status Updated", "Officer Assigned", "Re-routed"
  timestamp: string;
  performer: string;   // e.g. "System AI", "Admin ptlharshit123@gmail.com", "Citizen Harshit"
  details: string;
}

export interface Grievance {
  id: string;
  title: string;                 // Translated/English title
  originalTitle: string;         // Original input title
  description: string;           // Translated/English description
  originalDescription: string;   // Original input description
  language?: string;             // Detected language (e.g., "Hindi", "Bengali", "English")
  category: string;              // Auto-assigned or manual department (e.g., "Sanitation & Waste", "Roads & Transport", "Water Supply", "Electricity", "Public Safety", "Other")
  area: string;                  // Neighborhood / Ward name
  populationDensity: number;     // People per sq km in that area
  backingCount: number;          // Total citizen upvotes / backing
  backedBy: string[];            // User IDs who backed this grievance
  status: 'pending' | 'investigating' | 'in-progress' | 'resolved';
  createdAt: string;
  aiConfidence: number;          // AI confidence score (0-100)
  aiReasoning: string;           // Explanation of routing & priority
  aiPriorityScore: number;       // Calculated: (TotalBacking * PopulationDensity) / (HoursElapsed + 1) * Criticality
  aiCriticalityLevel: 'critical' | 'high' | 'medium' | 'low';
  slaDeadline: string;           // Calculated resolution target date
  slaStatus: 'on-track' | 'near-breach' | 'breached';
  humanInTheLoop: boolean;       // Set to true if aiConfidence < 70% or flagged manually
  officialResponse?: string;     // Response from administration
  assignedOfficer?: string;      // Assigned officer name
  history: HistoryLog[];
}

export interface Ward {
  id: string;
  name: string;
  populationDensity: number;     // People per sq km
}

export interface SLAStats {
  total: number;
  onTrack: number;
  nearBreach: number;
  breached: number;
}
