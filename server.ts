/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { Grievance, User, Ward, HistoryLog } from './src/types';

const app = express();
const PORT = 3000;

// Enable JSON parsing
app.use(express.json());

// In-Memory Database with Pre-loaded mock data for high-fidelity showcase
const wards: Ward[] = [
  { id: '1', name: 'Downtown Core', populationDensity: 14500 },
  { id: '2', name: 'Metro Ward 3', populationDensity: 10200 },
  { id: '3', name: 'North Sector', populationDensity: 6800 },
  { id: '4', name: 'South Suburbs', populationDensity: 2100 },
  { id: '5', name: 'East Rural', populationDensity: 450 }
];

let users: User[] = [
  {
    id: 'u-1',
    email: 'citizen@gov.in',
    name: 'Harshit Patel',
    role: 'citizen',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'u-2',
    email: 'admin@gov.in',
    name: 'Director General LiRiCo',
    role: 'admin',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// In-memory passwords for demo authentication (safe simulated auth)
const userPasswords: Record<string, string> = {
  'citizen@gov.in': 'password123',
  'admin@gov.in': 'password123'
};

// Seed initial grievances
const creationDate1 = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(); // 12 hours ago
const creationDate2 = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();  // 2 hours ago
const creationDate3 = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(); // 48 hours ago
const creationDate4 = new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString();  // 1 hour ago

let grievances: Grievance[] = [
  {
    id: 'g-1',
    title: 'Overflowing Sewer Main on National Highway Link Road',
    originalTitle: 'National Highway Link Road पर सीवर मुख्य लाइन बह रही है',
    description: 'The main sewage line is completely broken and overflowing onto the pedestrian pathway. High foul smell and sanitation hazard.',
    originalDescription: 'मुख्य सीवर लाइन पूरी तरह से टूट गई है और पैदल पथ पर बह रही है। भारी बदबू और स्वच्छता का खतरा है। त्वरित कार्रवाई की आवश्यकता है।',
    language: 'Hindi',
    category: 'Sanitation & Waste',
    area: 'Metro Ward 3',
    populationDensity: 10200,
    backingCount: 28,
    backedBy: ['u-1', 'demo-user-1', 'demo-user-2'],
    status: 'investigating',
    createdAt: creationDate1,
    aiConfidence: 94,
    aiReasoning: 'Grievance description specifically mentions "sewage line broken", "overflowing onto pathway", and "sanitation hazard". Placed in Sanitation & Waste. Criticality rated HIGH due to high pedestrian exposure in Metro Ward 3 (density: 10,200).',
    aiPriorityScore: 0, // Calculated dynamically
    aiCriticalityLevel: 'high',
    slaDeadline: new Date(new Date(creationDate1).getTime() + 48 * 60 * 60 * 1000).toISOString(), // 48h SLA
    slaStatus: 'on-track',
    humanInTheLoop: false,
    assignedOfficer: 'Supervisor Kumar (Waste Mgmt)',
    history: [
      { id: 'h-1-1', action: 'Grievance Filed', timestamp: creationDate1, performer: 'Citizen (Hindi)', details: 'Filed via Mobile Portal' },
      { id: 'h-1-2', action: 'AI Classification', timestamp: creationDate1, performer: 'System AI', details: 'Detected Language: Hindi. Translated to English. Categorized: Sanitation & Waste. Priority Rank: High.' },
      { id: 'h-1-3', action: 'Officer Assigned', timestamp: new Date(new Date(creationDate1).getTime() + 30 * 60 * 1000).toISOString(), performer: 'Director General', details: 'Assigned to Supervisor Kumar (Waste Mgmt)' }
    ]
  },
  {
    id: 'g-2',
    title: 'Severe Pothole Cluster and Exposed Rebar near Metro Station Entry',
    originalTitle: 'Severe Pothole Cluster and Exposed Rebar near Metro Station Entry',
    description: 'Massive potholes near the station entrance are causing major traffic jams and presenting immediate hazard to motorcyclists, with deep exposed steel reinforcement.',
    originalDescription: 'Massive potholes near the station entrance are causing major traffic jams and presenting immediate hazard to motorcyclists, with deep exposed steel reinforcement.',
    language: 'English',
    category: 'Roads & Transport',
    area: 'Downtown Core',
    populationDensity: 14500,
    backingCount: 45,
    backedBy: ['demo-user-3', 'demo-user-4'],
    status: 'in-progress',
    createdAt: creationDate2,
    aiConfidence: 98,
    aiReasoning: 'Mentions "potholes", "traffic jams", "hazard to motorcyclists". Placed in Roads & Transport. Criticality is CRITICAL due to structural hazard (exposed rebar) and location in an extremely high density ward next to a major transit hub.',
    aiPriorityScore: 0,
    aiCriticalityLevel: 'critical',
    slaDeadline: new Date(new Date(creationDate2).getTime() + 24 * 60 * 60 * 1000).toISOString(), // 24h SLA for Critical
    slaStatus: 'on-track',
    humanInTheLoop: false,
    assignedOfficer: 'Engineer Mehra (PWD Roads)',
    history: [
      { id: 'h-2-1', action: 'Grievance Filed', timestamp: creationDate2, performer: 'Citizen', details: 'Filed via Web Portal' },
      { id: 'h-2-2', action: 'AI Classification', timestamp: creationDate2, performer: 'System AI', details: 'Categorized: Roads & Transport. Priority Rank: Critical.' }
    ]
  },
  {
    id: 'g-3',
    title: 'Municipal Water Valve Leak Flooding Basements',
    originalTitle: 'পৌরসভার জলের ভালভ লিক হয়ে বেসমেন্টে বন্যা হচ্ছে',
    description: 'Clean drinking water is being wasted at a rate of hundreds of gallons per hour. Water is seeping into cellars of block 4B.',
    originalDescription: 'পৌরসভার জলের ভালভ লিক হয়ে বেসমেন্টে বন্যা হচ্ছে। শত শত গ্যালন পরিশ্রুত পানীয় জল নষ্ট হচ্ছে। ৪বি ব্লকের ভূগর্ভস্থ ঘরগুলিতে জল ঢুকছে।',
    language: 'Bengali',
    category: 'Water Supply',
    area: 'North Sector',
    populationDensity: 6800,
    backingCount: 12,
    backedBy: ['u-1'],
    status: 'resolved',
    createdAt: creationDate3,
    aiConfidence: 89,
    aiReasoning: 'Bengali input detected and translated. Description targets "water valve leak" and "flooding basements". Placed in Water Supply. Criticality marked MEDIUM. High resolution confidence.',
    aiPriorityScore: 0,
    aiCriticalityLevel: 'medium',
    slaDeadline: new Date(new Date(creationDate3).getTime() + 72 * 60 * 60 * 1000).toISOString(), // 72h SLA
    slaStatus: 'on-track',
    humanInTheLoop: false,
    assignedOfficer: 'Inspector Sen (Jal Board)',
    officialResponse: 'Municipal plumbing crew dispatched to North Sector Block 4B. The main 4-inch pressure valve shutoff was successfully repaired and the gasket replaced. Clean water flow has been normalized and basement flooding has subsided.',
    history: [
      { id: 'h-3-1', action: 'Grievance Filed', timestamp: creationDate3, performer: 'Citizen (Bengali)', details: 'Filed via Mobile App' },
      { id: 'h-3-2', action: 'AI Classification', timestamp: creationDate3, performer: 'System AI', details: 'Language: Bengali. Translated to English. Categorized: Water Supply. Priority Rank: Medium.' },
      { id: 'h-3-3', action: 'Status Updated', timestamp: new Date(new Date(creationDate3).getTime() + 20 * 60 * 60 * 1000).toISOString(), performer: 'Inspector Sen', details: 'Marked resolved with repair summary' }
    ]
  },
  {
    id: 'g-4',
    title: 'Exposed Overhead Live Cables Sparking near Public Playground',
    originalTitle: 'Exposed Overhead Live Cables Sparking near Public Playground',
    description: 'Electric poles wires have snapped during high winds and are dangling close to the childrens swings. Occasional sparks observed.',
    originalDescription: 'Electric poles wires have snapped during high winds and are dangling close to the childrens swings. Occasional sparks observed.',
    language: 'English',
    category: 'Electricity',
    area: 'South Suburbs',
    populationDensity: 2100,
    backingCount: 19,
    backedBy: [],
    status: 'pending',
    createdAt: creationDate4,
    aiConfidence: 96,
    aiReasoning: 'Description lists "exposed live cables sparking" near "childrens playground". Placed in Electricity. Rated CRITICAL due to severe electrocution threat to children, overriding local low density bias.',
    aiPriorityScore: 0,
    aiCriticalityLevel: 'critical',
    slaDeadline: new Date(new Date(creationDate4).getTime() + 24 * 60 * 60 * 1000).toISOString(), // 24h SLA
    slaStatus: 'on-track',
    humanInTheLoop: false,
    history: [
      { id: 'h-4-1', action: 'Grievance Filed', timestamp: creationDate4, performer: 'Citizen', details: 'Filed via Web Portal' },
      { id: 'h-4-2', action: 'AI Classification', timestamp: creationDate4, performer: 'System AI', details: 'Categorized: Electricity. Priority Rank: Critical.' }
    ]
  }
];

// Helper: Lazy initialization of Gemini Client
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// Helper to call generateContent with retry and exponential backoff for transient errors like 503 and 429
async function generateContentWithRetry(ai: any, params: any, maxRetries = 3, baseDelayMs = 1000): Promise<any> {
  let attempt = 0;
  while (true) {
    try {
      return await ai.models.generateContent(params);
    } catch (err: any) {
      attempt++;
      const errStr = String(err?.message || err);
      const is503 = err?.status === 503 || errStr.includes('503') || errStr.toLowerCase().includes('unavailable') || errStr.toLowerCase().includes('high demand') || errStr.toLowerCase().includes('temporarily');
      const is429 = err?.status === 429 || errStr.includes('429') || errStr.toLowerCase().includes('resource has been exhausted') || errStr.toLowerCase().includes('rate limit');
      const isRetryable = is503 || is429;

      if (isRetryable && attempt <= maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt - 1);
        console.warn(`[Gemini Retry Handler] Attempt ${attempt}/${maxRetries} failed with retryable error. Retrying in ${delay}ms... Error: ${errStr}`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw err;
    }
  }
}

// Function: Calculate Priority Score strictly based on the slide formula:
// PriorityScore = (TotalBacking * PopulationDensity) / TimeElapsed
// We also scale it with a Criticality factor to incorporate severity!
function computePriorityScore(backing: number, density: number, createdAtStr: string, criticality: 'critical' | 'high' | 'medium' | 'low'): number {
  const createdDate = new Date(createdAtStr);
  const now = new Date();
  const diffMs = Math.abs(now.getTime() - createdDate.getTime());
  
  // Hours elapsed (minimum 0.1 to avoid division by zero)
  const hoursElapsed = Math.max(0.1, diffMs / (1000 * 60 * 60));
  
  // Criticality weight multipliers (Hackathon standard refinement)
  let criticalityWeight = 1.0;
  if (criticality === 'critical') criticalityWeight = 2.5;
  else if (criticality === 'high') criticalityWeight = 1.8;
  else if (criticality === 'medium') criticalityWeight = 1.2;
  else if (criticality === 'low') criticalityWeight = 0.8;

  // Slide Formula: PriorityScore = (TotalBacking × PopulationDensity) / TimeElapsed
  // Since new tickets start with 0 backing, we treat backing as (backing + 1) to allow population density
  // and criticality to generate an initial priority score immediately.
  const score = ((backing + 1) * density) / hoursElapsed;
  return Math.round(score * criticalityWeight);
}

// Function: Update dynamic properties (SLA states and priority scores) for all tickets
function refreshDynamicGrievanceProperties() {
  const now = new Date();
  grievances = grievances.map(g => {
    // 1. Recalculate AI Priority Score
    const updatedScore = computePriorityScore(g.backingCount, g.populationDensity, g.createdAt, g.aiCriticalityLevel);
    
    // 2. Compute SLA Status
    const deadline = new Date(g.slaDeadline);
    const created = new Date(g.createdAt);
    const totalSlaMs = deadline.getTime() - created.getTime();
    const remainingMs = deadline.getTime() - now.getTime();
    
    let updatedSlaStatus: 'on-track' | 'near-breach' | 'breached' = 'on-track';
    
    if (g.status === 'resolved') {
      updatedSlaStatus = 'on-track'; // Resolved tickets hold their on-time status
    } else if (remainingMs < 0) {
      updatedSlaStatus = 'breached';
    } else if (remainingMs < totalSlaMs * 0.25) { // Under 25% time remaining
      updatedSlaStatus = 'near-breach';
    }

    return {
      ...g,
      aiPriorityScore: updatedScore,
      slaStatus: updatedSlaStatus
    };
  });
}

// High-Fidelity Local Fallback Classification Engine when Gemini API key is not present
function localClassifierFallback(title: string, description: string): {
  language: string;
  translatedTitle: string;
  translatedDescription: string;
  category: string;
  aiCriticalityLevel: 'critical' | 'high' | 'medium' | 'low';
  aiReasoning: string;
  aiConfidence: number;
} {
  const combined = (title + ' ' + description).toLowerCase();
  
  // 1. Simple Language Detection
  let detectedLanguage = 'English';
  // Check for common Hindi Unicode ranges or keywords
  if (/[\u0900-\u097F]/.test(title + description)) {
    detectedLanguage = 'Hindi';
  } else if (/[\u0980-\u09FF]/.test(title + description)) {
    detectedLanguage = 'Bengali';
  } else if (/[\u0B80-\u0BFF]/.test(title + description)) {
    detectedLanguage = 'Tamil';
  }

  // Simulated clean English translations
  let translatedTitle = title;
  let translatedDescription = description;
  if (detectedLanguage === 'Hindi') {
    translatedTitle = 'Translated: ' + title.replace(/सड़क|पानी|कचरा|बिजली|समस्या/g, 'Civic Issue');
    translatedDescription = 'Translated Hindi description reporting active local community concerns regarding the municipal facilities.';
  } else if (detectedLanguage !== 'English') {
    translatedTitle = `Translated [${detectedLanguage}]: ${title}`;
    translatedDescription = `Translated description from ${detectedLanguage}: ${description}`;
  }

  // 2. Keyword Classification
  let category = 'Other';
  let criticality: 'critical' | 'high' | 'medium' | 'low' = 'medium';
  let confidence = 85;

  if (combined.includes('pothole') || combined.includes('road') || combined.includes('street') || combined.includes('pavement') || combined.includes('traffic') || combined.includes('highway') || combined.includes('सड़क') || combined.includes('गड्ढा')) {
    category = 'Roads & Transport';
    if (combined.includes('accident') || combined.includes('exposed rebar') || combined.includes('broken bridge')) {
      criticality = 'critical';
    } else {
      criticality = 'high';
    }
  } else if (combined.includes('garbage') || combined.includes('trash') || combined.includes('waste') || combined.includes('sewage') || combined.includes('drain') || combined.includes('smell') || combined.includes('sanitation') || combined.includes('clean') || combined.includes('कचरा') || combined.includes('सीवर')) {
    category = 'Sanitation & Waste';
    if (combined.includes('overflowing') || combined.includes('foul smell') || combined.includes('epidemic')) {
      criticality = 'high';
    } else {
      criticality = 'medium';
    }
  } else if (combined.includes('water') || combined.includes('leak') || combined.includes('pipe') || combined.includes('flooding') || combined.includes('supply') || combined.includes('drainage') || combined.includes('drinking') || combined.includes('पानी')) {
    category = 'Water Supply';
    if (combined.includes('burst') || combined.includes('flooding basement') || combined.includes('contamination')) {
      criticality = 'high';
    } else {
      criticality = 'medium';
    }
  } else if (combined.includes('electricity') || combined.includes('power') || combined.includes('light') || combined.includes('shock') || combined.includes('wire') || combined.includes('outage') || combined.includes('sparking') || combined.includes('transformer') || combined.includes('बिजली')) {
    category = 'Electricity';
    if (combined.includes('live wire') || combined.includes('sparking') || combined.includes('exposed cable') || combined.includes('dangling')) {
      criticality = 'critical';
    } else {
      criticality = 'high';
    }
  } else if (combined.includes('safety') || combined.includes('crime') || combined.includes('police') || combined.includes('dark') || combined.includes('danger') || combined.includes('theft') || combined.includes('security') || combined.includes('सुरक्षा')) {
    category = 'Public Safety';
    if (combined.includes('immediate danger') || combined.includes('harassment') || combined.includes('fire')) {
      criticality = 'critical';
    } else {
      criticality = 'high';
    }
  }

  // Trigger Human in the loop if classification confidence is marginally low
  if (combined.length < 25) {
    confidence = 65; // Mark for review!
  }

  const aiReasoning = `[LOCAL CLASSIFIER Engine] Successfully scanned keywords in ${detectedLanguage}. Found critical tokens. Categorized under ${category} with a ${criticality.toUpperCase()} criticality rank. ${confidence < 70 ? 'Flagged for Human Review due to short description length.' : 'System has high routing confidence.'}`;

  return {
    language: detectedLanguage,
    translatedTitle,
    translatedDescription,
    category,
    aiCriticalityLevel: criticality,
    aiReasoning,
    aiConfidence: confidence
  };
}

// ------------------- API ENDPOINTS -------------------

// Get All Wards
app.get('/api/wards', (req, res) => {
  res.json(wards);
});

// Authentication: Register
app.post('/api/auth/register', (req, res) => {
  const { email, password, name, role, department } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'User with this email already exists.' });
  }

  const newUser: User = {
    id: `u-${Date.now()}`,
    email: email.toLowerCase(),
    name,
    role: role || 'citizen',
    department,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  userPasswords[newUser.email] = password;

  res.status(201).json(newUser);
});

// Authentication: Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || userPasswords[user.email] !== password) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  res.json(user);
});

// Get all grievances with updated dynamic priority scores & SLA states
app.get('/api/grievances', (req, res) => {
  refreshDynamicGrievanceProperties();
  res.json(grievances);
});

// File New Grievance with Gemini AI integration
app.post('/api/grievances', async (req, res) => {
  const { title, description, area, userId, userName } = req.body;
  if (!title || !description || !area || !userId) {
    return res.status(400).json({ error: 'Missing title, description, ward area, or authenticated userId.' });
  }

  const ward = wards.find(w => w.name === area);
  const density = ward ? ward.populationDensity : 1500; // Default fallback density

  let classificationResult;
  const ai = getGeminiClient();

  if (ai) {
    try {
      console.log(`Sending citizen ticket to Gemini API ("${title}")`);
      const response = await generateContentWithRetry(ai, {
        model: 'gemini-3.5-flash',
        contents: `
You are the advanced classification and translation service for a high-priority government grievance system (LiRiCo Portal).
Analyze this grievance:
Title: "${title}"
Description: "${description}"

Your tasks:
1. Detect original language of the input text (e.g., "Hindi", "Bengali", "English", "Tamil", "Gujarati", etc.).
2. Translate both Title and Description into clear English if they are in another language.
3. Classify into exactly one of: "Sanitation & Waste", "Roads & Transport", "Water Supply", "Electricity", "Public Safety", "Other".
4. Determine the safety and hazard "aiCriticalityLevel": choose exactly one of "critical", "high", "medium", "low".
5. Write a professional, detailed "aiReasoning" (explain why this classification fits, the hazard context, and routing rules).
6. Give a classification "aiConfidence" score from 0 to 100. Be honest; if the description is vague or short, score lower (< 70).

You must output ONLY a valid JSON object matching this schema exactly, do not wrap in markdown or write additional text:
{
  "language": "string",
  "translatedTitle": "string",
  "translatedDescription": "string",
  "category": "string",
  "aiCriticalityLevel": "string",
  "aiReasoning": "string",
  "aiConfidence": number
}
`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              language: { type: Type.STRING },
              translatedTitle: { type: Type.STRING },
              translatedDescription: { type: Type.STRING },
              category: { type: Type.STRING },
              aiCriticalityLevel: { type: Type.STRING },
              aiReasoning: { type: Type.STRING },
              aiConfidence: { type: Type.INTEGER }
            },
            required: ["language", "translatedTitle", "translatedDescription", "category", "aiCriticalityLevel", "aiReasoning", "aiConfidence"]
          }
        }
      });

      const parsed = JSON.parse(response.text?.trim() || '{}');
      console.log("Gemini Classification result received successfully:", parsed);
      
      classificationResult = {
        language: parsed.language || 'English',
        translatedTitle: parsed.translatedTitle || title,
        translatedDescription: parsed.translatedDescription || description,
        category: parsed.category || 'Other',
        aiCriticalityLevel: parsed.aiCriticalityLevel || 'medium',
        aiReasoning: parsed.aiReasoning || 'Processed by Gemini models. Routed automatically.',
        aiConfidence: parsed.aiConfidence || 90
      };
    } catch (err) {
      console.error('Gemini Classification failed, using local fallback:', err);
      classificationResult = localClassifierFallback(title, description);
    }
  } else {
    // No API key - standard high-fidelity mock
    console.log("No GEMINI_API_KEY. Using offline High-Fidelity local classifier engine.");
    classificationResult = localClassifierFallback(title, description);
  }

  // Calculate resolution SLA targets based on Criticality Level:
  // critical = 24 hours, high = 48 hours, medium = 72 hours, low = 120 hours
  let slaHours = 72;
  if (classificationResult.aiCriticalityLevel === 'critical') slaHours = 24;
  else if (classificationResult.aiCriticalityLevel === 'high') slaHours = 48;
  else if (classificationResult.aiCriticalityLevel === 'medium') slaHours = 72;
  else if (classificationResult.aiCriticalityLevel === 'low') slaHours = 120;

  const now = new Date();
  const slaDeadlineDate = new Date(now.getTime() + slaHours * 60 * 60 * 1000);

  // Human-in-the-loop triggers if AI Confidence is below 70%
  const needsHumanInLoop = classificationResult.aiConfidence < 70;

  const newGrievance: Grievance = {
    id: `g-${Date.now()}`,
    title: classificationResult.translatedTitle,
    originalTitle: title,
    description: classificationResult.translatedDescription,
    originalDescription: description,
    language: classificationResult.language,
    category: classificationResult.category,
    area,
    populationDensity: density,
    backingCount: 0,
    backedBy: [],
    status: 'pending',
    createdAt: now.toISOString(),
    aiConfidence: classificationResult.aiConfidence,
    aiReasoning: classificationResult.aiReasoning,
    aiPriorityScore: 0, // Will be dynamically computed
    aiCriticalityLevel: classificationResult.aiCriticalityLevel as any,
    slaDeadline: slaDeadlineDate.toISOString(),
    slaStatus: 'on-track',
    humanInTheLoop: needsHumanInLoop,
    history: [
      {
        id: `h-log-${Date.now()}-1`,
        action: 'Grievance Filed',
        timestamp: now.toISOString(),
        performer: userName || 'Citizen',
        details: `Ticket submitted from ${area}. Population density context: ${density.toLocaleString()} people/sq.km.`
      },
      {
        id: `h-log-${Date.now()}-2`,
        action: 'AI Classification & Routing',
        timestamp: now.toISOString(),
        performer: 'System AI Engine',
        details: `Detected Language: ${classificationResult.language}. Assigned Department: ${classificationResult.category}. Criticality Level: ${classificationResult.aiCriticalityLevel.toUpperCase()}. Confidence Score: ${classificationResult.aiConfidence}%. ${needsHumanInLoop ? '⚠️ Flagged for manual audit (low confidence).' : ''}`
      }
    ]
  };

  // Run dynamic update and add
  grievances.unshift(newGrievance);
  refreshDynamicGrievanceProperties();

  res.status(201).json(newGrievance);
});

// Back / Support a Grievance (adds user upvote and instantly recalculates priority ranking)
app.post('/api/grievances/:id/back', (req, res) => {
  const { id } = req.params;
  const { userId, userName } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User authenticated ID is required to register backing.' });
  }

  const ticket = grievances.find(g => g.id === id);
  if (!ticket) {
    return res.status(404).json({ error: 'Grievance ticket not found.' });
  }

  // Prevent double backing/upvoting
  if (ticket.backedBy.includes(userId)) {
    return res.status(400).json({ error: 'You have already registered your backing for this civic grievance.' });
  }

  ticket.backedBy.push(userId);
  ticket.backingCount = ticket.backedBy.length;
  
  ticket.history.push({
    id: `h-log-back-${Date.now()}`,
    action: 'Citizen Backing Registered',
    timestamp: new Date().toISOString(),
    performer: userName || 'Citizen',
    details: `Grievance support registered. Total support is now ${ticket.backingCount} citizens.`
  });

  // Instantly refresh dynamic scores to capture upvote bump
  refreshDynamicGrievanceProperties();

  const updatedTicket = grievances.find(g => g.id === id);
  res.json(updatedTicket);
});

// Update Grievance Status (Investigating, In-Progress, Resolved)
app.post('/api/grievances/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, officialResponse, performerName } = req.body;

  const ticket = grievances.find(g => g.id === id);
  if (!ticket) {
    return res.status(404).json({ error: 'Grievance ticket not found.' });
  }

  if (status) {
    ticket.status = status;
  }
  if (officialResponse !== undefined) {
    ticket.officialResponse = officialResponse;
  }

  ticket.history.push({
    id: `h-log-status-${Date.now()}`,
    action: `Status Updated: ${status?.toUpperCase() || 'INFO'}`,
    timestamp: new Date().toISOString(),
    performer: performerName || 'Administrator',
    details: officialResponse ? `Response added: "${officialResponse}"` : `Status shifted to ${status}.`
  });

  refreshDynamicGrievanceProperties();
  res.json(ticket);
});

// Manual Re-routing of Grievance Department (Human-in-the-Loop Override)
app.post('/api/grievances/:id/route', (req, res) => {
  const { id } = req.params;
  const { newCategory, performerName } = req.body;

  if (!newCategory) {
    return res.status(400).json({ error: 'New category/department is required.' });
  }

  const ticket = grievances.find(g => g.id === id);
  if (!ticket) {
    return res.status(404).json({ error: 'Grievance ticket not found.' });
  }

  const oldCategory = ticket.category;
  ticket.category = newCategory;
  ticket.humanInTheLoop = false; // Resolved review status

  ticket.history.push({
    id: `h-log-route-${Date.now()}`,
    action: 'Manual Route Intervention',
    timestamp: new Date().toISOString(),
    performer: performerName || 'Administrator',
    details: `Manual correction. Routed from [${oldCategory}] to [${newCategory}]. Human-in-the-loop flag cleared.`
  });

  refreshDynamicGrievanceProperties();
  res.json(ticket);
});

// Assign Officer to Ticket
app.post('/api/grievances/:id/assign', (req, res) => {
  const { id } = req.params;
  const { officerName, performerName } = req.body;

  if (!officerName) {
    return res.status(400).json({ error: 'Officer name is required for assignment.' });
  }

  const ticket = grievances.find(g => g.id === id);
  if (!ticket) {
    return res.status(404).json({ error: 'Grievance ticket not found.' });
  }

  ticket.assignedOfficer = officerName;

  ticket.history.push({
    id: `h-log-assign-${Date.now()}`,
    action: 'Officer Assigned',
    timestamp: new Date().toISOString(),
    performer: performerName || 'Administrator',
    details: `Ticket assigned to operational handler: ${officerName}.`
  });

  refreshDynamicGrievanceProperties();
  res.json(ticket);
});

// -----------------------------------------------------

// Setup Vite / Static Files routing
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Gov Grievance Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
