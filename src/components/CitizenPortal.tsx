/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Megaphone, Users, CheckCircle2, Clock, Activity, FileText, ChevronDown, ChevronUp, 
  ThumbsUp, Languages, BadgeCheck, Globe, Building, AlertTriangle, ShieldCheck, Sparkles, Send, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Grievance, User, Ward } from '../types';
import { AshokaChakra } from '../App';

interface CitizenPortalProps {
  user: User;
  wards: Ward[];
  grievances: Grievance[];
  onRefreshData: () => void;
  onAddGrievance: (title: string, description: string, area: string) => Promise<void>;
  onBackGrievance: (id: string) => Promise<void>;
}

export default function CitizenPortal({
  user,
  wards,
  grievances,
  onRefreshData,
  onAddGrievance,
  onBackGrievance
}: CitizenPortalProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'file' | 'my-cases'>('feed');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [area, setArea] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
  
  // File upload state / simulated attachment
  const [dragActive, setDragActive] = useState(false);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);

  // Form submission loading indicators
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    "Establishing secure encrypted tunnel...",
    "Scanning submission text for PII (DPDP compliant privacy vault)...",
    "Detecting original dialect & language inputs...",
    "Calling Gemini 3.5 AI Engine for neural translation & analysis...",
    "Classifying municipal department & calculating hazard criticality...",
    "Fetching ward density database & computing real-time Priority Score...",
    "Assigning official SLA tracking hash. Registering record..."
  ];

  // Auto-advance loading steps for simulated AI experience
  useEffect(() => {
    let interval: any;
    if (isSubmitting) {
      interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < loadingSteps.length - 1) return prev + 1;
          return prev;
        });
      }, 900);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isSubmitting]);

  const handleFileDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setAttachmentName(e.dataTransfer.files[0].name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachmentName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !area) return;

    setIsSubmitting(true);
    // Simulate premium visual flow before filing
    await new Promise(resolve => setTimeout(resolve, 6000));

    try {
      await onAddGrievance(title, description, area);
      setTitle('');
      setDescription('');
      setArea('');
      setAttachmentName(null);
      setActiveTab('my-cases');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter and Search logic
  const filteredGrievances = grievances.filter(g => {
    const matchesSearch = 
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.originalTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.originalDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || g.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const myGrievances = grievances.filter(g => 
    g.history.some(h => h.performer === user.name) || g.backedBy.includes(user.id)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#128807]/10 text-[#128807] border border-[#128807]/30">✓ RESOLVED / हल हो गया</span>;
      case 'in-progress':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800 border border-blue-300">⚙ IN PROGRESS / प्रगति पर</span>;
      case 'investigating':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#FF9933]/10 text-slate-800 border border-[#FF9933]/30">⚙ INVESTIGATING / जांच जारी</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-slate-100 text-slate-700 border border-slate-300">⌛ PENDING ROUTE / लंबित</span>;
    }
  };

  const getCriticalityBadge = (level: string) => {
    switch (level) {
      case 'critical':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-red-100 text-red-700 border border-red-300 animate-pulse">⚠️ CRITICAL / गंभीर संकट</span>;
      case 'high':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-orange-100 text-orange-800 border border-orange-300">⚠️ HIGH / उच्च</span>;
      case 'medium':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300">MEDIUM / मध्यम</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-slate-100 text-slate-600 border border-slate-200">LOW / सामान्य</span>;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Sanitation & Waste': return 'bg-cyan-50 text-cyan-800 border-cyan-300';
      case 'Roads & Transport': return 'bg-rose-50 text-rose-800 border-rose-300';
      case 'Water Supply': return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'Electricity': return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Public Safety': return 'bg-indigo-50 text-indigo-800 border-indigo-300';
      default: return 'bg-slate-50 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="citizen-dashboard">
      
      {/* Upper Navigation Tabs */}
      <div className="flex border-b border-slate-200 mb-8 overflow-x-auto" id="citizen-portal-tabs">
        <button
          onClick={() => setActiveTab('feed')}
          className={`py-4 px-6 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition flex items-center space-x-2 whitespace-nowrap ${activeTab === 'feed' ? 'border-[#002244] text-[#002244] bg-[#002244]/5' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
        >
          <Megaphone className="w-4 h-4 text-[#FF9933]" />
          <span>Active Grievances Feed / लोक शिकायतें</span>
        </button>
        <button
          onClick={() => setActiveTab('file')}
          className={`py-4 px-6 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition flex items-center space-x-2 whitespace-nowrap ${activeTab === 'file' ? 'border-[#002244] text-[#002244] bg-[#002244]/5' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
        >
          <Sparkles className="w-4 h-4 text-[#FF9933]" />
          <span>File New Grievance / नई शिकायत</span>
        </button>
        <button
          onClick={() => setActiveTab('my-cases')}
          className={`py-4 px-6 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition flex items-center space-x-2 whitespace-nowrap ${activeTab === 'my-cases' ? 'border-[#002244] text-[#002244] bg-[#002244]/5' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
        >
          <FileText className="w-4 h-4 text-[#128807]" />
          <span>My Active Cases / मेरी शिकायतें ({myGrievances.length})</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* TAB: FEED OF ACTIVE GRIEVANCES */}
        {activeTab === 'feed' && (
          <motion.div
            key="feed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
            id="feed-tab-content"
          >
            {/* Filter and search bar */}
            <div className="gov-panel p-6 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search grievances by title, description, ward area, or ticket hash..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#002244] transition"
                />
              </div>

              <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider font-sans mr-2 shrink-0">DEPARTMENT:</span>
                {['All', 'Sanitation & Waste', 'Roads & Transport', 'Water Supply', 'Electricity', 'Public Safety'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition whitespace-nowrap cursor-pointer ${selectedCategory === cat ? 'bg-[#002244] border-[#002244] text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Informational Notice about Priority Algorithm */}
            <div className="p-4 bg-slate-100 border-l-4 border-l-[#FF9933] text-slate-700 rounded-lg flex items-start space-x-3 text-xs leading-relaxed shadow-sm">
              <Activity className="w-5 h-5 text-[#000080] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-[#002244]">Socio-Spatial Resource Priority Engine:</span> Citizens can upvote or <strong>"Back"</strong> any active civic grievance. Every backing upvote dynamically triggers the server to recalculate the <strong>Priority Score</strong> in real-time according to the formula: 
                <span className="font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded font-bold mx-1 text-slate-800">Priority = (Backing × Population Density) / Time Elapsed × Criticality</span>. 
                This ensures high-density, emergency, and popular public issues are automatically boosted to the top of the administrative queue!
              </div>
            </div>

            {/* Tickets Feed List */}
            <div className="space-y-4">
              {filteredGrievances.length === 0 ? (
                <div className="text-center py-16 gov-card border border-dashed border-slate-300 text-slate-500 bg-white">
                  <Megaphone className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-800 font-semibold">No active grievances match your search queries.</p>
                  <p className="text-xs text-slate-500 mt-1">Be the first to file or upvote an issue in your local ward.</p>
                </div>
              ) : (
                filteredGrievances.map((g) => {
                  const isExpanded = expandedTicketId === g.id;
                  const isBackedByUser = g.backedBy.includes(user.id);
                  const isCreatedByUser = g.history[0]?.performer === user.name;

                  return (
                    <motion.div
                      layout
                      key={g.id}
                      className={`gov-card rounded-xl border ${isExpanded ? 'border-[#002244] ring-1 ring-[#002244]/20' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'} transition-all overflow-hidden bg-white`}
                    >
                      {/* Ticket header summary layout */}
                      <div className="p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-bold">{g.id}</span>
                            <span className={`px-2.5 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(g.category)}`}>
                              {g.category}
                            </span>
                            {getCriticalityBadge(g.aiCriticalityLevel)}
                            {getStatusBadge(g.status)}
                          </div>

                          <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                            {g.title}
                          </h3>

                          <div className="flex flex-wrap items-center text-xs text-slate-600 gap-y-1 gap-x-4">
                            <span className="flex items-center space-x-1.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-500" />
                              <span className="font-bold text-slate-800">{g.area}</span>
                              <span className="text-[10px] text-slate-500 font-mono">({g.populationDensity.toLocaleString()} citizens/km²)</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                              <span>Filed {new Date(g.createdAt).toLocaleDateString()} at {new Date(g.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </span>
                          </div>
                        </div>

                        {/* Priority Score and Backing Controls panel */}
                        <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-start gap-4 border-t sm:border-t-0 border-slate-100 pt-4 sm:pt-0">
                          {/* Live Priority Score Badge */}
                          <div className="text-center px-4 py-2 bg-slate-50 border border-slate-200 text-slate-800 rounded-lg min-w-[110px]" id={`priority-score-${g.id}`}>
                            <div className="text-[9px] text-slate-500 font-mono tracking-widest uppercase font-bold">Priority Index</div>
                            <div className="text-xl font-black font-mono tracking-tight text-[#002244]">{g.aiPriorityScore.toLocaleString()}</div>
                          </div>

                          {/* Upvote Button */}
                          <button
                            id={`back-btn-${g.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isBackedByUser && !isCreatedByUser) onBackGrievance(g.id);
                            }}
                            disabled={isBackedByUser || isCreatedByUser}
                            className={`px-4 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center space-x-2 ${isBackedByUser ? 'bg-[#128807]/10 border-[#128807]/30 text-[#128807] cursor-not-allowed' : isCreatedByUser ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-700 hover:border-slate-400 active:bg-slate-300'}`}
                          >
                            <ThumbsUp className={`w-3.5 h-3.5 ${isBackedByUser ? 'fill-[#128807] text-[#128807]' : ''}`} />
                            <span>{isBackedByUser ? 'Backed' : isCreatedByUser ? 'My Report' : 'Back This Issue'}</span>
                            <span className="bg-white border border-slate-200 text-slate-800 px-1.5 py-0.2 rounded font-mono text-[10px]">
                              {g.backingCount}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Expandable toggle button */}
                      <button
                        onClick={() => setExpandedTicketId(isExpanded ? null : g.id)}
                        className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border-t border-slate-200 flex items-center justify-center text-xs text-[#002244] font-bold cursor-pointer transition-colors"
                      >
                        <span>{isExpanded ? 'Collapse Grievance Details / विवरण समेटें' : 'View Full AI Routing & Operational Details / पूर्ण प्रशासनिक विवरण देखें'}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                      </button>

                      {/* Expandable section details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden bg-slate-50 border-t border-slate-200"
                          >
                            <div className="p-6 space-y-6">
                              {/* Grievance Description Texts */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                  <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-500 tracking-wider font-mono">
                                    <span>ENGLISH DESCRIPTION / अंग्रेजी विवरण</span>
                                    <Globe className="w-3.5 h-3.5 text-[#000080]" />
                                  </div>
                                  <p className="text-sm text-slate-800 leading-relaxed font-sans">{g.description}</p>
                                </div>

                                <div className="space-y-2 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                  <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-500 tracking-wider font-mono">
                                    <span>ORIGINAL CIVIL INPUT / मूल इनपुट</span>
                                    <div className="flex items-center space-x-1 text-slate-700 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-[10px]">
                                      <Languages className="w-3 h-3" />
                                      <span>{g.language || 'Detected'}</span>
                                    </div>
                                  </div>
                                  <div className="text-slate-500 text-xs italic mb-1 font-sans">"{g.originalTitle}"</div>
                                  <p className="text-sm text-slate-800 leading-relaxed font-sans">{g.originalDescription}</p>
                                </div>
                              </div>

                              {/* Official Administrative Response */}
                              {g.officialResponse && (
                                <div className="p-4 bg-[#128807]/10 border border-[#128807]/30 rounded-lg text-slate-850 space-y-2" id={`official-response-${g.id}`}>
                                  <div className="flex items-center space-x-2 text-xs font-bold uppercase text-[#128807] tracking-wider font-mono">
                                    <ShieldCheck className="w-4 h-4 text-[#128807]" />
                                    <span>Official Resolution Statement / आधिकारिक समाधान वक्तव्य</span>
                                  </div>
                                  <p className="text-sm text-slate-900 font-extrabold leading-relaxed font-sans">{g.officialResponse}</p>
                                  {g.assignedOfficer && (
                                    <div className="text-xs text-[#128807] font-mono font-bold">Approved by Case Officer: {g.assignedOfficer}</div>
                                  )}
                                </div>
                              )}

                              {/* Explainable AI Decision Log block */}
                              <div className="bg-slate-850 text-white rounded-lg p-5 border border-slate-800 space-y-4 shadow-inner" id={`ai-explainability-${g.id}`}>
                                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                                  <div className="flex items-center space-x-2 text-[#FF9933] font-bold uppercase text-xs font-mono tracking-wider">
                                    <Sparkles className="w-4 h-4" />
                                    <span>EXPLAINABLE AI DECISION LOG</span>
                                  </div>
                                  <div className="bg-[#FF9933]/20 text-white px-2.5 py-0.5 rounded border border-[#FF9933]/30 text-[10px] font-bold font-mono">
                                    Confidence: {g.aiConfidence}%
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                                  <div className="space-y-1">
                                    <div className="text-slate-300 font-bold uppercase text-[10px] font-mono tracking-wider">Routing Explanation:</div>
                                    <p className="text-slate-100 leading-relaxed font-sans">{g.aiReasoning}</p>
                                  </div>

                                  <div className="space-y-3 bg-black/20 p-3 rounded border border-white/10 text-xs font-mono">
                                    <div className="text-slate-300 font-bold uppercase text-[10px] tracking-wider">Operational SLA Metadata:</div>
                                    <div className="space-y-1">
                                      <div className="flex justify-between">
                                        <span>Target Resolution:</span>
                                        <span className="text-slate-100">{new Date(g.slaDeadline).toLocaleDateString()} {new Date(g.slaDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>SLA Target Limit:</span>
                                        <span className="text-slate-100">{g.aiCriticalityLevel === 'critical' ? '24 Hours (Immediate)' : g.aiCriticalityLevel === 'high' ? '48 Hours' : '72 Hours'}</span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span>Status:</span>
                                        <span className={`px-1.5 rounded text-[10px] font-bold ${g.slaStatus === 'breached' ? 'bg-red-950 text-red-400 border border-red-500/30' : g.slaStatus === 'near-breach' ? 'bg-amber-950 text-amber-400 border border-amber-500/30' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'}`}>
                                          {g.slaStatus.toUpperCase()}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Handler Assigned:</span>
                                        <span className="text-slate-100">{g.assignedOfficer || 'Auto-routing queue...'}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Ticket Audit Timeline */}
                              <div className="space-y-3">
                                <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider font-mono">Case History Audit Trail / मामला इतिहास लेखापरीक्षा</div>
                                <div className="relative border-l border-slate-300 ml-3 pl-5 space-y-4 text-xs font-sans">
                                  {g.history.map((log) => (
                                    <div key={log.id} className="relative">
                                      <div className="absolute -left-[25px] top-1 bg-white border border-slate-400 rounded-full w-2.5 h-2.5 flex items-center justify-center">
                                        <div className="bg-[#000080] rounded-full w-1.5 h-1.5"></div>
                                      </div>
                                      <div>
                                        <span className="font-extrabold text-slate-800 font-mono mr-2">{log.action}:</span>
                                        <span className="text-slate-700 font-sans">{log.details}</span>
                                      </div>
                                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                        {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()} • {log.performer}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}

        {/* TAB: FILE NEW GRIEVANCE */}
        {activeTab === 'file' && (
          <motion.div
            key="file"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-3xl mx-auto"
            id="file-tab-content"
          >
            {isSubmitting ? (
              // Stunning simulated loading screen showing steps of the backend algorithm
              <div className="bg-white border border-slate-300 rounded-2xl p-8 text-center text-slate-850 space-y-8 shadow-xl min-h-[450px] flex flex-col justify-center items-center relative overflow-hidden" id="ai-loading-screen">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#128807]"></div>
                
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                  {/* Outer tricolour rotating ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-t-[#FF9933] border-r-[#000080] border-b-[#128807] border-l-transparent animate-spin"></div>
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-200 shadow-sm">
                    <AshokaChakra size={44} />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-black tracking-tight uppercase font-sans text-[#002244]">ANALYZING CIVIC GRIEVANCE / शिकायत प्रसंस्करण</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    National Cognitive Classification Grid is analyzing text semantic depth, executing neural translations, and assessing area demographics for priority calculation.
                  </p>
                </div>

                {/* Stepped progress checklist */}
                <div className="w-full max-w-md bg-slate-50 p-5 rounded-lg border border-slate-200 text-left space-y-2.5 font-mono text-xs shadow-inner">
                  {loadingSteps.map((step, idx) => {
                    const isDone = idx < loadingStep;
                    const isActive = idx === loadingStep;
                    return (
                      <div key={idx} className={`flex items-start space-x-2.5 ${isDone ? 'text-[#128807] font-bold' : isActive ? 'text-[#002244] font-black animate-pulse' : 'text-slate-400'}`}>
                        <span className="font-sans">{isDone ? '✓' : isActive ? '▶' : '○'}</span>
                        <span className="flex-1 leading-snug">{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="gov-panel p-8 space-y-6 shadow-xl rounded-xl bg-white border border-slate-300">
                <div>
                  <h2 className="text-lg font-black text-[#002244] flex items-center space-x-2 font-sans">
                    <Sparkles className="w-5 h-5 text-[#FF9933]" />
                    <span>File Civic Grievance / नई शिकायत दर्ज करें</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter the grievance details below. You can write in your local language (Hindi, Bengali, Tamil, etc.). Our integrated Gemini AI translates, detects semantics, classifies departments, and assigns resolution target deadlines automatically.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6" id="grievance-submission-form">
                  {/* Select Ward */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2 font-sans">Location Ward Jurisdiction / अधिकार क्षेत्र वार्ड</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {wards.map((w) => (
                        <button
                          type="button"
                          key={w.id}
                          id={`ward-opt-${w.id}`}
                          onClick={() => setArea(w.name)}
                          className={`p-3 border rounded-lg text-left cursor-pointer transition ${area === w.name ? 'border-[#002244] bg-[#002244]/5 text-slate-900 font-extrabold ring-2 ring-[#002244]/20' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'}`}
                        >
                          <div className="text-xs font-bold">{w.name}</div>
                          <div className={`text-[9px] font-mono mt-0.5 ${area === w.name ? 'text-slate-800' : 'text-slate-500'}`}>
                            {w.populationDensity.toLocaleString()} citizens/km²
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Grievance Title */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2 font-sans">Grievance Title / शिकायत का विषय</label>
                    <input
                      type="text"
                      required
                      id="grievance-title-input"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Potholes on Main Bazar Road OR सीवर लाइन ओवरफ्लो"
                      className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#002244] focus:ring-2 focus:ring-[#002244]/10 transition"
                    />
                  </div>

                  {/* Grievance Description */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2 font-sans">Full Detailed Narrative / विस्तृत विवरण</label>
                    <textarea
                      required
                      id="grievance-desc-input"
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the issue. Mention specific hazards, proximity to schools/hospitals, or severe blocks to traffic to allow AI to prioritize accordingly."
                      className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#002244] focus:ring-2 focus:ring-[#002244]/10 transition"
                    ></textarea>
                  </div>

                  {/* Premium Touch: Drag-and-drop file uploader */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2 font-sans">Attach Photographic Evidence / साक्ष्य संलग्न करें</label>
                    <div
                      onDragEnter={handleFileDrag}
                      onDragOver={handleFileDrag}
                      onDragLeave={handleFileDrag}
                      onDrop={handleFileDrop}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${dragActive ? 'border-[#FF9933] bg-[#FF9933]/5' : attachmentName ? 'border-[#128807] bg-[#128807]/5' : 'border-slate-300 hover:bg-slate-50'}`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="evidence-file-input"
                      />
                      <label htmlFor="evidence-file-input" className="cursor-pointer space-y-2 block">
                        <div className="flex justify-center">
                          <Megaphone className={`w-8 h-8 ${attachmentName ? 'text-[#128807]' : 'text-slate-400'}`} />
                        </div>
                        {attachmentName ? (
                          <div className="text-xs font-extrabold text-[#128807]">
                            ✓ Evidence Attached: {attachmentName}
                          </div>
                        ) : (
                          <>
                            <div className="text-xs font-bold text-slate-700">
                              Drag and drop your image here, or <span className="text-[#000080] underline">browse</span>
                            </div>
                            <div className="text-[9px] text-slate-400 font-mono">Supports PNG, JPG, JPEG up to 10MB</div>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#002244] hover:bg-[#001122] text-white text-xs font-black uppercase tracking-wider rounded-lg shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-[#FF9933]" />
                      <span>Submit Grievance to AI Engine / शिकायत दर्ज करें</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB: MY FILED CASES */}
        {activeTab === 'my-cases' && (
          <motion.div
            key="my-cases"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
            id="my-cases-tab-content"
          >
            {myGrievances.length === 0 ? (
              <div className="text-center py-16 glass-card border border-dashed border-white/10 text-slate-400">
                <FileText className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-300 font-medium">You haven't filed or backed any grievances yet.</p>
                <p className="text-xs text-slate-400 mt-1">Browse the public feed to upvote community issues, or submit a new ticket.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myGrievances.map((g) => {
                  const isExpanded = expandedTicketId === g.id;
                  const isBackedByUser = g.backedBy.includes(user.id);

                  return (
                    <motion.div
                      layout
                      key={g.id}
                      className={`glass-card rounded-xl border ${isExpanded ? 'border-amber-500/45 shadow-xl' : 'border-white/10 hover:border-white/20'} transition overflow-hidden`}
                    >
                      <div className="p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-[10px] bg-white/5 text-slate-300 border border-white/10 px-2 py-0.5 rounded font-bold">{g.id}</span>
                            <span className={`px-2.5 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(g.category)}`}>
                              {g.category}
                            </span>
                            {getCriticalityBadge(g.aiCriticalityLevel)}
                            {getStatusBadge(g.status)}
                          </div>

                          <h3 className="font-semibold text-slate-100 text-base leading-snug">
                            {g.title}
                          </h3>

                          <div className="flex flex-wrap items-center text-xs text-slate-400 gap-y-1 gap-x-4">
                            <span className="flex items-center space-x-1.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span className="font-medium text-slate-200">{g.area}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>SLA Deadline: {new Date(g.slaDeadline).toLocaleDateString()} {new Date(g.slaDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              <span className={`ml-1.5 px-1 rounded text-[9px] font-bold ${g.slaStatus === 'breached' ? 'bg-red-950 text-red-400 border border-red-500/20' : g.slaStatus === 'near-breach' ? 'bg-amber-950 text-amber-400 border border-amber-500/20' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/20'}`}>
                                {g.slaStatus.toUpperCase()}
                              </span>
                            </span>
                          </div>
                        </div>

                        <div className="flex sm:flex-col sm:items-end justify-between sm:justify-start gap-4">
                          <div className="text-center px-4 py-2 bg-black/40 border border-white/10 text-white rounded-lg min-w-[100px]">
                            <div className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">Support Backing</div>
                            <div className="text-lg font-bold font-mono tracking-tight text-amber-400">{g.backingCount} upvotes</div>
                          </div>
                          
                          <div className="text-xs text-slate-400 flex items-center space-x-1 self-center sm:self-auto">
                            <span className="font-mono">Handler:</span>
                            <span className="font-semibold text-slate-200">{g.assignedOfficer || 'Auto-routing...'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Expand details toggle */}
                      <button
                        onClick={() => setExpandedTicketId(isExpanded ? null : g.id)}
                        className="w-full py-2 bg-black/25 border-t border-white/10 hover:bg-black/40 flex items-center justify-center text-xs text-slate-300 font-semibold cursor-pointer transition-colors"
                      >
                        <span>{isExpanded ? 'Collapse Tracking Details' : 'Track Case & View AI Explanation'}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden bg-black/10 border-t border-white/10"
                          >
                            <div className="p-6 space-y-6">
                              {/* Description and Native logs */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1 bg-white/5 p-4 rounded-lg border border-white/10 shadow-sm">
                                  <div className="text-xs font-bold uppercase text-slate-400 tracking-wider font-mono">Incident Summary</div>
                                  <p className="text-sm text-slate-200 leading-relaxed">{g.description}</p>
                                </div>
                                <div className="space-y-1 bg-white/5 p-4 rounded-lg border border-white/10 shadow-sm">
                                  <div className="text-xs font-bold uppercase text-slate-400 tracking-wider font-mono">Original Language Submission</div>
                                  <div className="text-xs text-slate-400 italic mb-1">Detected Language: {g.language || 'English'}</div>
                                  <p className="text-sm text-slate-300 leading-relaxed font-sans">{g.originalDescription}</p>
                                </div>
                              </div>

                              {/* Official Action Comments */}
                              {g.officialResponse && (
                                <div className="p-4 bg-emerald-500/15 border border-emerald-500/25 rounded-lg text-emerald-200 space-y-1">
                                  <div className="text-xs font-bold uppercase text-emerald-300 tracking-wider font-mono">Case Officer Response Comments</div>
                                  <p className="text-sm text-emerald-100 font-medium leading-relaxed font-sans">{g.officialResponse}</p>
                                </div>
                              )}

                              {/* Explainable AI block */}
                              <div className="bg-black/35 text-slate-200 rounded-lg p-5 border border-white/10 space-y-3">
                                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                  <span className="text-amber-400 font-bold uppercase text-xs font-mono tracking-wider">AI Assessment Details</span>
                                  <span className="text-xs text-slate-400 font-mono">Confidence: {g.aiConfidence}%</span>
                                </div>
                                <div className="text-xs leading-relaxed text-slate-300">
                                  <span className="font-bold text-slate-400 block mb-1">Reasoning Logic:</span>
                                  {g.aiReasoning}
                                </div>
                              </div>

                              {/* Timeline */}
                              <div className="space-y-3">
                                <div className="text-xs font-bold uppercase text-slate-400 tracking-wider font-mono">Case Timeline Track</div>
                                <div className="relative border-l border-white/10 ml-3 pl-5 space-y-4 text-xs font-sans">
                                  {g.history.map((log) => (
                                    <div key={log.id} className="relative">
                                      <div className="absolute -left-[25px] top-1 bg-slate-900 border border-white/15 rounded-full w-2.5 h-2.5 flex items-center justify-center">
                                        <div className="bg-amber-400 rounded-full w-1 h-1"></div>
                                      </div>
                                      <div>
                                        <span className="font-bold text-slate-200 font-mono mr-2">{log.action}:</span>
                                        <span className="text-slate-300 font-sans">{log.details}</span>
                                      </div>
                                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                        {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()} • {log.performer}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
