/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, AlertOctagon, ShieldCheck, Check, CheckSquare, Edit, UserPlus, 
  RefreshCw, Sliders, Filter, Clock, ThumbsUp, MapPin, Sparkles, Building, AlertTriangle, ArrowRight, CornerDownRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell 
} from 'recharts';
import { Grievance, User, Ward } from '../types';

interface AdminPortalProps {
  user: User;
  wards: Ward[];
  grievances: Grievance[];
  onRefreshData: () => void;
  onUpdateStatus: (id: string, status: string, officialResponse: string) => Promise<void>;
  onManualReRoute: (id: string, newCategory: string) => Promise<void>;
  onAssignOfficer: (id: string, officerName: string) => Promise<void>;
}

export default function AdminPortal({
  user,
  wards,
  grievances,
  onRefreshData,
  onUpdateStatus,
  onManualReRoute,
  onAssignOfficer
}: AdminPortalProps) {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [activeQueueFilter, setActiveQueueFilter] = useState<'all' | 'human-audit' | 'breached' | 'resolved'>('all');
  
  // Modal / forms inputs state
  const [statusInput, setStatusInput] = useState('');
  const [responseNotesInput, setResponseNotesInput] = useState('');
  const [routeInput, setRouteInput] = useState('');
  const [officerInput, setOfficerInput] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

  const selectedTicket = grievances.find(g => g.id === selectedTicketId);

  // ------------------- ANALYTICS AGGREGATION -------------------
  
  // Key performance indicators (KPIs)
  const totalTicketsCount = grievances.length;
  const activeTicketsCount = grievances.filter(g => g.status !== 'resolved').length;
  const resolvedCount = grievances.filter(g => g.status === 'resolved').length;
  const humanReviewCount = grievances.filter(g => g.humanInTheLoop).length;
  
  const avgConfidence = Math.round(
    grievances.reduce((acc, curr) => acc + curr.aiConfidence, 0) / (totalTicketsCount || 1)
  );

  const totalCivicBacking = grievances.reduce((acc, curr) => acc + curr.backingCount, 0);

  // SLA count
  const onTrackSla = grievances.filter(g => g.slaStatus === 'on-track' && g.status !== 'resolved').length;
  const nearBreachSla = grievances.filter(g => g.slaStatus === 'near-breach' && g.status !== 'resolved').length;
  const breachedSla = grievances.filter(g => g.slaStatus === 'breached' && g.status !== 'resolved').length;

  // Pie chart SLA representation
  const slaChartData = [
    { name: 'SLA On Track', value: onTrackSla, color: '#10b981' }, // emerald-500
    { name: 'Near SLA Breach', value: nearBreachSla, color: '#f59e0b' }, // amber-500
    { name: 'SLA Breached', value: breachedSla, color: '#ef4444' } // red-500
  ].filter(d => d.value > 0);

  // Bar chart department representation
  const categoriesList = ["Sanitation & Waste", "Roads & Transport", "Water Supply", "Electricity", "Public Safety", "Other"];
  const departmentChartData = categoriesList.map(cat => {
    const total = grievances.filter(g => g.category === cat).length;
    const resolved = grievances.filter(g => g.category === cat && g.status === 'resolved').length;
    return {
      name: cat,
      "Active Tickets": total - resolved,
      "Resolved Tickets": resolved
    };
  });

  // Sort queue by Priority Score
  const sortedQueue = [...grievances].sort((a, b) => b.aiPriorityScore - a.aiPriorityScore);

  const filteredQueue = sortedQueue.filter(g => {
    if (activeQueueFilter === 'human-audit') return g.humanInTheLoop;
    if (activeQueueFilter === 'breached') return g.slaStatus === 'breached' && g.status !== 'resolved';
    if (activeQueueFilter === 'resolved') return g.status === 'resolved';
    return true; // All
  });

  // Handle action triggers
  const handleUpdateStatusAndNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId || !statusInput) return;
    setSubmittingAction(true);
    try {
      await onUpdateStatus(selectedTicketId, statusInput, responseNotesInput);
      setStatusInput('');
      setResponseNotesInput('');
      setSelectedTicketId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleManualReRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId || !routeInput) return;
    setSubmittingAction(true);
    try {
      await onManualReRoute(selectedTicketId, routeInput);
      setRouteInput('');
      setSelectedTicketId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleAssignOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId || !officerInput) return;
    setSubmittingAction(true);
    try {
      await onAssignOfficer(selectedTicketId, officerInput);
      setOfficerInput('');
      setSelectedTicketId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingAction(false);
    }
  };

  const selectGrievance = (g: Grievance) => {
    setSelectedTicketId(g.id);
    setStatusInput(g.status);
    setResponseNotesInput(g.officialResponse || '');
    setRouteInput(g.category);
    setOfficerInput(g.assignedOfficer || '');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="admin-portal-dashboard">
      
      {/* Real-time Header & Refresh Control */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl font-black text-[#002244] font-sans uppercase tracking-wide flex items-center space-x-2.5">
            <Building className="w-5 h-5 text-[#000080]" />
            <span>OPERATIONAL SLA COMMANDER BOARD / प्रबंधन नियंत्रण बोर्ड</span>
          </h2>
          <p className="text-xs text-slate-600 font-bold font-sans mt-0.5">
            Logged In: <span className="text-[#FF9933] font-black">{user.name}</span> • State Administrative Officer (SLA Jurisdiction)
          </p>
        </div>

        <button
          onClick={onRefreshData}
          className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm text-xs font-bold text-[#002244] uppercase tracking-wider flex items-center space-x-2 cursor-pointer transition active:bg-slate-100"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Manual Sync Grid / डेटा सिंक</span>
        </button>
      </div>

      {/* Real-Time KPIs Cards Section */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8" id="admin-kpis">
        
        {/* Card 1: Active Grievances */}
        <div className="gov-card p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-1.5">
          <div className="text-[10px] font-bold text-slate-500 font-mono tracking-wider uppercase">Active Cases / सक्रिय मामले</div>
          <div className="text-2xl font-black font-mono text-[#002244] tracking-tight">{activeTicketsCount}</div>
          <div className="text-[10px] text-slate-500 font-medium">Resolution pending</div>
        </div>

        {/* Card 2: Resolved Cases */}
        <div className="gov-card p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-1.5">
          <div className="text-[10px] font-bold text-slate-500 font-mono tracking-wider uppercase">Resolved Cases / निराकृत</div>
          <div className="text-2xl font-black font-mono text-[#128807] tracking-tight">{resolvedCount}</div>
          <div className="text-[10px] text-[#128807] font-bold font-sans">
            {totalTicketsCount > 0 ? Math.round((resolvedCount / totalTicketsCount) * 100) : 0}% Solved
          </div>
        </div>

        {/* Card 3: Human-in-the-loop */}
        <div className="gov-card p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-1.5">
          <div className="text-[10px] font-bold text-slate-500 font-mono tracking-wider uppercase">AI Audit Queue / एआई ऑडिट</div>
          <div className="text-2xl font-black font-mono text-[#FF9933] tracking-tight">{humanReviewCount}</div>
          <div className="text-[10px] text-[#FF9933] font-bold">Confidence &lt; 70%</div>
        </div>

        {/* Card 4: Breached SLAs */}
        <div className="gov-card p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-1.5">
          <div className="text-[10px] font-bold text-slate-500 font-mono tracking-wider uppercase">SLA Breached / समय-सीमा पार</div>
          <div className="text-2xl font-black font-mono text-red-600 tracking-tight animate-pulse">{breachedSla}</div>
          <div className="text-[10px] text-red-600 font-bold">Immediate intervention</div>
        </div>

        {/* Card 5: Avg AI Confidence */}
        <div className="gov-card p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-1.5">
          <div className="text-[10px] font-bold text-slate-500 tracking-wider uppercase font-mono">AI Accuracy / सटीकता</div>
          <div className="text-2xl font-black font-mono text-[#000080] tracking-tight">{avgConfidence}%</div>
          <div className="text-[10px] text-slate-500 font-medium">Gemini categorization</div>
        </div>

        {/* Card 6: Civic Backing Upvotes */}
        <div className="gov-card p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-1.5">
          <div className="text-[10px] font-bold text-slate-500 font-mono tracking-wider uppercase">Public Backing / जन समर्थन</div>
          <div className="text-2xl font-black font-mono text-slate-800 tracking-tight">{totalCivicBacking}</div>
          <div className="text-[10px] text-slate-500 font-medium">Citizen backing votes</div>
        </div>
      </div>

      {/* COMPREHENSIVE ANALYTICS CHARTS DASHBOARD (REAL-TIME PERFORMANCE) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8" id="admin-charts">
        
        {/* Chart 1: Category distribution */}
        <div className="gov-card border border-slate-300 bg-white shadow-sm rounded-xl p-6 space-y-4 col-span-2 text-slate-800">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <h3 className="text-sm font-black text-[#002244] uppercase tracking-wide font-sans">
              Department Classification Volumes / विभाग-वार शिकायत गणना
            </h3>
            <span className="text-[10px] bg-slate-100 border border-slate-300 px-2 py-0.5 rounded font-mono text-slate-700 font-bold uppercase tracking-wider">Live Breakdown</span>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentChartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', color: '#1e293b', border: '1px solid #cbd5e1', borderRadius: '12px' }}
                  labelClassName="text-slate-700 text-xs font-bold"
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Active Tickets" stackId="a" fill="#FF9933" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Resolved Tickets" stackId="a" fill="#128807" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: SLA Breach Status Distribution */}
        <div className="gov-card border border-slate-300 bg-white shadow-sm rounded-xl p-6 space-y-4 text-slate-800">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <h3 className="text-sm font-black text-[#002244] uppercase tracking-wide font-sans">
              Active SLA Target Status / सेवा-स्तर स्थिति
            </h3>
            <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200 font-mono font-bold uppercase tracking-wider">Breach Risk</span>
          </div>

          <div className="h-[220px] flex justify-center items-center relative">
            {slaChartData.length === 0 ? (
              <div className="text-center text-xs text-slate-500 font-sans">
                No active outstanding tickets currently tracking SLA limits.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={slaChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {slaChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}

            {/* Micro-legend inside the chart frame */}
            <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
              <span className="text-xs text-slate-500 uppercase font-mono tracking-widest text-[9px] font-bold">Active Cases</span>
              <span className="text-xl font-black font-mono text-[#002244]">{activeTicketsCount}</span>
            </div>
          </div>

          {/* SLA Legend cards */}
          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-200">
            <div className="space-y-0.5">
              <div className="text-[9px] text-slate-500 font-mono uppercase font-bold">On Track</div>
              <div className="text-xs font-bold text-emerald-600 font-mono">{onTrackSla}</div>
            </div>
            <div className="space-y-0.5 border-x border-slate-200">
              <div className="text-[9px] text-slate-500 font-mono uppercase font-bold">Near Breach</div>
              <div className="text-xs font-bold text-amber-600 font-mono">{nearBreachSla}</div>
            </div>
            <div className="space-y-0.5">
              <div className="text-[9px] text-slate-500 font-mono uppercase font-bold">Breached</div>
              <div className="text-xs font-bold text-red-600 font-mono">{breachedSla}</div>
            </div>
          </div>
        </div>
      </div>

      {/* TWO PORTAL SEPARATION: ACTIVE QUEUE AND AUDIT CONTROLS PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="admin-management-grid">
        
        {/* COLUMN 1: OPERATIONAL TICKETS QUEUE */}
        <div className="gov-card border border-slate-300 bg-white shadow-md rounded-xl p-6 col-span-2 space-y-6 text-slate-850">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-sm font-black text-[#002244] uppercase tracking-wide font-sans">
                Grievance Execution Queue / शिकायत निष्पादन कतार
              </h3>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5 uppercase tracking-widest font-bold">Sorted by real-time Priority index</p>
            </div>

            {/* Queue Filters */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0" id="queue-filter-tabs">
              <button
                onClick={() => setActiveQueueFilter('all')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md border transition whitespace-nowrap cursor-pointer ${activeQueueFilter === 'all' ? 'bg-[#002244] border-[#002244] text-white shadow-sm' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'}`}
              >
                All ({totalTicketsCount})
              </button>
              <button
                id="filter-human-audit-btn"
                onClick={() => setActiveQueueFilter('human-audit')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md border transition whitespace-nowrap cursor-pointer ${activeQueueFilter === 'human-audit' ? 'bg-[#FF9933] border-[#FF9933] text-white shadow-sm' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'}`}
              >
                AI Audit ({humanReviewCount})
              </button>
              <button
                id="filter-breached-btn"
                onClick={() => setActiveQueueFilter('breached')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md border transition whitespace-nowrap cursor-pointer ${activeQueueFilter === 'breached' ? 'bg-red-600 border-red-600 text-white shadow-sm' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'}`}
              >
                Breached ({breachedSla})
              </button>
              <button
                onClick={() => setActiveQueueFilter('resolved')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md border transition whitespace-nowrap cursor-pointer ${activeQueueFilter === 'resolved' ? 'bg-[#128807] border-[#128807] text-white shadow-sm' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'}`}
              >
                Resolved ({resolvedCount})
              </button>
            </div>
          </div>

          {/* List queue items */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredQueue.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <Sliders className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-800 font-bold text-xs">No tickets match this queue filter constraints.</p>
              </div>
            ) : (
              filteredQueue.map((g) => {
                const isSelected = selectedTicketId === g.id;
                const catStyle = g.category === 'Sanitation & Waste' ? 'bg-cyan-50 text-cyan-800 border-cyan-200' : g.category === 'Roads & Transport' ? 'bg-rose-50 text-rose-800 border-rose-200' : g.category === 'Water Supply' ? 'bg-blue-50 text-blue-800 border-blue-200' : g.category === 'Electricity' ? 'bg-amber-50 text-amber-800 border-amber-200' : g.category === 'Public Safety' ? 'bg-indigo-50 text-indigo-800 border-indigo-200' : 'bg-slate-50 text-slate-700 border-slate-200';
                
                return (
                  <div
                    key={g.id}
                    id={`queue-item-${g.id}`}
                    onClick={() => selectGrievance(g)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition flex items-center justify-between gap-4 ${isSelected ? 'bg-[#002244]/5 border-[#002244] ring-1 ring-[#002244]/20 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'}`}
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-mono text-[9px] bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.2 rounded font-bold">{g.id}</span>
                        <span className={`px-1.5 py-0.2 rounded border text-[9px] font-bold uppercase tracking-wider ${catStyle}`}>
                          {g.category}
                        </span>
                        {g.humanInTheLoop && (
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-[#FF9933]/15 text-[#FF9933] border border-[#FF9933]/30 uppercase tracking-widest font-mono animate-pulse">AI AUDIT / मानव समीक्षा</span>
                        )}
                        <span className={`px-1.5 rounded text-[9px] font-bold border ${g.slaStatus === 'breached' ? 'bg-red-50 text-red-700 border-red-200' : g.slaStatus === 'near-breach' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                          {g.slaStatus.toUpperCase()}
                        </span>
                      </div>

                      <h4 className="text-xs font-extrabold text-slate-900 font-sans truncate pr-4">
                        {g.title}
                      </h4>

                      <div className="flex flex-wrap items-center text-[10px] text-slate-600 gap-x-3 gap-y-0.5 font-sans">
                        <span className="flex items-center space-x-1 font-bold text-[#002244]">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>{g.area}</span>
                        </span>
                        <span>Backing: <strong className="text-slate-800 font-black">{g.backingCount}</strong> upvotes</span>
                        <span>SLA: {new Date(g.slaDeadline).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Priority score indicator */}
                    <div className="text-right min-w-[70px]">
                      <div className="text-[8px] text-slate-500 font-mono uppercase tracking-widest font-bold">Priority Index</div>
                      <div className="text-sm font-black font-mono tracking-tight text-[#002244]">{g.aiPriorityScore.toLocaleString()}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMN 2: OPERATIONS AUDIT CONTROLS OVERRIDE PANEL */}
        <div className="gov-card border border-slate-300 bg-white shadow-md rounded-xl p-6 h-fit space-y-6 text-slate-800" id="admin-operational-controls">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-sm font-black text-[#002244] uppercase tracking-wide font-sans flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-[#000080]" />
              <span>SLA Officer Audit Panel / अधिकारी ऑडिट पैनल</span>
            </h3>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5 uppercase tracking-widest font-bold">Select a grievance queue ticket to control</p>
          </div>

          <AnimatePresence mode="wait">
            {!selectedTicket ? (
              <motion.div
                key="empty-controls"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 text-center text-slate-500 font-mono text-xs space-y-2"
              >
                <ArrowRight className="w-8 h-8 text-slate-400 mx-auto animate-bounce rotate-90" />
                <p className="font-bold text-slate-600">Click any grievance in the queue to initiate manual overrides or resolve issues.</p>
              </motion.div>
            ) : (
              <motion.div
                key={selectedTicket.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-6"
                id="active-controls"
              >
                {/* Active selection summary */}
                <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-sans">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono font-bold">
                    <span>ACTIVE TICKET ID: {selectedTicket.id}</span>
                    <span className="bg-[#FF9933]/15 text-[#FF9933] px-1.5 py-0.2 border border-[#FF9933]/30 rounded font-mono font-bold">CONFIDENCE: {selectedTicket.aiConfidence}%</span>
                  </div>
                  <h4 className="font-extrabold text-[#002244] line-clamp-2">{selectedTicket.title}</h4>
                  <div className="text-[10px] text-slate-600 font-sans italic line-clamp-2">"{selectedTicket.description}"</div>
                </div>

                {/* ACTION 1: ASSIGN OFFICER */}
                <form onSubmit={handleAssignOfficer} className="space-y-2 border-b border-slate-200 pb-4" id="assign-officer-form">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Operational Dispatch Assignment</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={officerInput}
                      onChange={(e) => setOfficerInput(e.target.value)}
                      placeholder="e.g., Supervisor Kumar, Inspector Sen"
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#002244] transition"
                    />
                    <button
                      type="submit"
                      disabled={submittingAction}
                      className="px-3 py-1.5 bg-[#002244] hover:bg-[#003366] text-white rounded text-xs font-bold uppercase tracking-wider cursor-pointer font-mono text-[10px] shadow-sm active:bg-[#001122] transition"
                    >
                      Dispatch
                    </button>
                  </div>
                  {selectedTicket.assignedOfficer && (
                    <div className="text-[10px] text-slate-600 font-mono flex items-center space-x-1.5">
                      <CornerDownRight className="w-3 h-3 text-[#FF9933]" />
                      <span>Current Dispatch: <strong className="text-slate-800 font-bold">{selectedTicket.assignedOfficer}</strong></span>
                    </div>
                  )}
                </form>

                {/* ACTION 2: MANUAL RE-ROUTING (HUMAN OVERRIDE) */}
                <form onSubmit={handleManualReRoute} className="space-y-2 border-b border-slate-200 pb-4" id="manual-route-form">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">AI Routing Overwrite</label>
                  <div className="flex gap-2">
                    <select
                      value={routeInput}
                      onChange={(e) => setRouteInput(e.target.value)}
                      required
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#002244] transition"
                    >
                      <option value="Sanitation & Waste">Sanitation & Waste</option>
                      <option value="Roads & Transport">Roads & Transport</option>
                      <option value="Water Supply">Water Supply</option>
                      <option value="Electricity">Electricity</option>
                      <option value="Public Safety">Public Safety</option>
                      <option value="Other">Other</option>
                    </select>
                    <button
                      type="submit"
                      disabled={submittingAction}
                      className="px-3 py-1.5 bg-[#FF9933] hover:bg-orange-600 text-white rounded text-xs font-bold uppercase tracking-wider cursor-pointer font-mono text-[10px] shadow-sm active:bg-orange-700 transition"
                    >
                      Override
                    </button>
                  </div>
                  <div className="text-[9px] text-slate-500 font-sans italic leading-relaxed">
                    Overriding this value clears the AI low-confidence audit warning log and writes an administrative correction log.
                  </div>
                </form>

                {/* ACTION 3: CASE STATUS & OFFICIAL STATEMENT NOTES */}
                <form onSubmit={handleUpdateStatusAndNotes} className="space-y-3 pt-2" id="resolve-status-form">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Update Status Jurisdiction</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['investigating', 'in-progress', 'resolved'].map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setStatusInput(s)}
                          className={`py-1 rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer transition border ${statusInput === s ? 'bg-[#002244] text-white border-[#002244] shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Official Response / Resolution Remarks</label>
                    <textarea
                      rows={3}
                      value={responseNotesInput}
                      onChange={(e) => setResponseNotesInput(e.target.value)}
                      placeholder="Add operational notes or resolved feedback remarks here..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#002244] transition"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingAction}
                    className="w-full py-2 bg-[#128807] hover:bg-green-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer transition flex items-center justify-center space-x-1.5 shadow-sm active:bg-green-800"
                  >
                    <CheckSquare className="w-4 h-4" />
                    <span>Submit Status Record / रिकॉर्ड दर्ज करें</span>
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
