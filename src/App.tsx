/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, LogOut, Clock, Globe, HelpCircle, Activity, Sparkles, AlertCircle, RefreshCw, Layers 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Grievance, User, Ward } from './types';
import AuthScreen from './components/AuthScreen';
import CitizenPortal from './components/CitizenPortal';
import AdminPortal from './components/AdminPortal';
import GatewayHub from './components/GatewayHub';

// High-fidelity Indian Flag Component
export const IndianFlag = ({ className = "" }: { className?: string }) => (
  <svg width="36" height="24" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`shadow-sm border border-slate-300 rounded-sm inline-block ${className}`}>
    <rect width="36" height="8" fill="#FF9933" />
    <rect y="8" width="36" height="8" fill="#FFFFFF" />
    <rect y="16" width="36" height="8" fill="#128807" />
    <circle cx="18" cy="12" r="3" stroke="#000080" strokeWidth="0.4" fill="none" />
    {Array.from({ length: 12 }).map((_, i) => {
      const angle = (i * 30 * Math.PI) / 180;
      const x1 = 18 - 3 * Math.sin(angle);
      const y1 = 12 - 3 * Math.cos(angle);
      const x2 = 18 + 3 * Math.sin(angle);
      const y2 = 12 + 3 * Math.cos(angle);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#000080" strokeWidth="0.25" />;
    })}
  </svg>
);

// High-fidelity mathematical 24-spoke Ashoka Chakra
export const AshokaChakra = ({ size = 36, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`animate-[spin_60s_linear_infinite] ${className}`}>
    <circle cx="50" cy="50" r="45" stroke="#000080" strokeWidth="4" />
    <circle cx="50" cy="50" r="8" stroke="#000080" strokeWidth="3" fill="#000080" />
    {Array.from({ length: 24 }).map((_, i) => {
      const angle = (i * 15 * Math.PI) / 180;
      const x2 = 50 + 45 * Math.cos(angle);
      const y2 = 50 + 45 * Math.sin(angle);
      return (
        <line
          key={i}
          x1="50"
          y1="50"
          x2={x2}
          y2={y2}
          stroke="#000080"
          strokeWidth="2.5"
        />
      );
    })}
    {Array.from({ length: 24 }).map((_, i) => {
      const angle = ((i * 15 + 7.5) * Math.PI) / 180;
      const x = 50 + 42 * Math.cos(angle);
      const y = 50 + 42 * Math.sin(angle);
      return (
        <circle
          key={`dot-${i}`}
          cx={x}
          cy={y}
          r="1.8"
          fill="#000080"
        />
      );
    })}
  </svg>
);

// Highly detailed state emblem representation (Satyamev Jayate)
export const SatyamevJayateLogo = ({ dark = false }: { dark?: boolean }) => (
  <div className="flex flex-col items-center justify-center p-1 select-none text-center">
    <svg width="40" height="52" viewBox="0 0 100 135" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 100 H75 V104 H25 Z" fill={dark ? "#94a3b8" : "#475569"} />
      <path d="M30 104 H70 V108 H30 Z" fill={dark ? "#64748b" : "#334155"} />
      <circle cx="50" cy="85" r="13" fill="none" stroke={dark ? "#94a3b8" : "#475569"} strokeWidth="4" />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        return (
          <line
            key={i}
            x1="50"
            y1="85"
            x2={50 + 13 * Math.cos(angle)}
            y2={85 + 13 * Math.sin(angle)}
            stroke={dark ? "#94a3b8" : "#475569"}
            strokeWidth="2"
          />
        );
      })}
      <path d="M22 80 C22 75, 33 75, 33 82" stroke={dark ? "#cbd5e1" : "#475569"} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M78 80 C78 75, 67 75, 67 82" stroke={dark ? "#cbd5e1" : "#475569"} strokeWidth="3" fill="none" strokeLinecap="round" />
      
      {/* Central Lion lioness motif outline */}
      <path d="M35 50 C32 40, 32 25, 45 15 C45 25, 40 35, 42 50" fill={dark ? "#1e293b" : "#b45309"} stroke={dark ? "#cbd5e1" : "#78350f"} strokeWidth="2.5" />
      <path d="M65 50 C68 40, 68 25, 55 15 C55 25, 60 35, 58 50" fill={dark ? "#1e293b" : "#b45309"} stroke={dark ? "#cbd5e1" : "#78350f"} strokeWidth="2.5" />
      <path d="M42 12 C46 5, 54 5, 58 12" stroke={dark ? "#cbd5e1" : "#78350f"} strokeWidth="3" strokeLinecap="round" />
      
      <path d="M35 45 C25 40, 20 28, 28 20 C32 25, 32 35, 35 45" fill={dark ? "#334155" : "#d97706"} stroke={dark ? "#cbd5e1" : "#78350f"} strokeWidth="2" />
      <path d="M65 45 C75 40, 80 28, 72 20 C68 25, 68 35, 65 45" fill={dark ? "#334155" : "#d97706"} stroke={dark ? "#cbd5e1" : "#78350f"} strokeWidth="2" />
      
      <path d="M42 50 Q50 65 58 50" stroke={dark ? "#cbd5e1" : "#78350f"} strokeWidth="2" fill="none" />
      <path d="M46 52 Q50 60 54 52" stroke={dark ? "#cbd5e1" : "#78350f"} strokeWidth="1.5" fill="none" />
      <path d="M40 30 H60" stroke={dark ? "#cbd5e1" : "#78350f"} strokeWidth="1.5" />
      <path d="M45 22 H55" stroke={dark ? "#cbd5e1" : "#78350f"} strokeWidth="1.5" />
    </svg>
    <span className={`text-[7px] font-black tracking-widest uppercase mt-0.5 font-sans ${dark ? "text-slate-300" : "text-slate-700"}`}>सत्यमेव जयते</span>
  </div>
);

// High-fidelity full Ashok Stambh (National Emblem of India)
export const AshokStambh = ({ size = 110, className = "" }: { size?: number; className?: string }) => (
  <div className={`flex flex-col items-center justify-center text-center p-2 select-none ${className}`}>
    <svg width={size} height={size * 1.3} viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#F3E5AB" />
          <stop offset="100%" stopColor="#AA7C11" />
        </linearGradient>
      </defs>
      
      {/* 3 Lions standing back-to-back */}
      {/* Center Lion */}
      <path d="M42 15 C42 10, 58 10, 58 15 C58 20, 56 25, 55 35 C55 45, 45 45, 45 35 C44 25, 42 20, 42 15 Z" fill="url(#gold-grad)" stroke="#78350f" strokeWidth="1" />
      <path d="M46 15 C46 12, 54 12, 54 15 C54 18, 53 22, 52 28 C51 32, 49 32, 48 28 C47 22, 46 18, 46 15 Z" fill="#fff" fillOpacity="0.2" />
      
      {/* Left Lion */}
      <path d="M35 22 C30 18, 26 26, 32 35 C34 38, 38 42, 43 45 C41 38, 38 32, 35 22 Z" fill="url(#gold-grad)" stroke="#78350f" strokeWidth="1" />
      {/* Right Lion */}
      <path d="M65 22 C70 18, 74 26, 68 35 C66 38, 62 42, 57 45 C59 38, 62 32, 65 22 Z" fill="url(#gold-grad)" stroke="#78350f" strokeWidth="1" />

      {/* Mane details */}
      <path d="M42 25 Q50 20 58 25" stroke="#78350f" strokeWidth="1" fill="none" />
      <path d="M44 30 Q50 25 56 30" stroke="#78350f" strokeWidth="1" fill="none" />
      <path d="M40 35 Q50 30 60 35" stroke="#78350f" strokeWidth="1" fill="none" />
      <path d="M42 40 Q50 36 58 40" stroke="#78350f" strokeWidth="1" fill="none" />

      {/* Faces of Lions */}
      <circle cx="47" cy="18" r="1" fill="#78350f" />
      <circle cx="53" cy="18" r="1" fill="#78350f" />
      <path d="M48 21 Q50 23 52 21" stroke="#78350f" strokeWidth="1" fill="none" />
      <circle cx="34" cy="24" r="0.8" fill="#78350f" />
      <circle cx="66" cy="24" r="0.8" fill="#78350f" />

      {/* Abacus plate */}
      <path d="M22 68 C22 60, 78 60, 78 68 C78 72, 72 75, 50 75 C28 75, 22 72, 22 68 Z" fill="url(#gold-grad)" stroke="#78350f" strokeWidth="1.5" />
      <rect x="25" y="62" width="50" height="6" rx="2" fill="url(#gold-grad)" stroke="#78350f" strokeWidth="1" />

      {/* Dharma Chakra & Animals */}
      <circle cx="50" cy="68" r="7" fill="#fff" stroke="#000080" strokeWidth="1.5" />
      <circle cx="50" cy="68" r="1.5" fill="#000080" />
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 22.5 * Math.PI) / 180;
        return (
          <line
            key={i}
            x1="50"
            y1="68"
            x2={50 + 7 * Math.cos(angle)}
            y2={68 + 7 * Math.sin(angle)}
            stroke="#000080"
            strokeWidth="0.5"
          />
        );
      })}

      {/* Galloping horse and walking bull outlines */}
      <path d="M30 65 Q33 63 36 65 Q38 67 36 69 Q32 70 30 68" stroke="#78350f" strokeWidth="0.75" fill="none" />
      <path d="M70 65 Q67 63 64 65 Q62 67 64 69 Q68 70 70 68" stroke="#78350f" strokeWidth="0.75" fill="none" />

      {/* Bell lotus base */}
      <path d="M30 75 C30 85, 26 95, 20 98 C30 102, 70 102, 80 98 C74 95, 70 85, 70 75 Z" fill="url(#gold-grad)" stroke="#78350f" strokeWidth="1.5" />
      <path d="M35 75 Q40 88 30 96" stroke="#78350f" strokeWidth="1" fill="none" />
      <path d="M42 75 Q45 90 40 98" stroke="#78350f" strokeWidth="1" fill="none" />
      <line x1="50" y1="75" x2="50" y2="99" stroke="#78350f" strokeWidth="1" />
      <path d="M58 75 Q55 90 60 98" stroke="#78350f" strokeWidth="1" fill="none" />
      <path d="M65 75 Q60 88 70 96" stroke="#78350f" strokeWidth="1" fill="none" />

      {/* Base Plinth */}
      <rect x="18" y="98" width="64" height="6" rx="1.5" fill="url(#gold-grad)" stroke="#78350f" strokeWidth="1" />
      <rect x="12" y="104" width="76" height="4" rx="1" fill="#78350f" />
    </svg>
    <div className="text-[10px] font-black tracking-widest text-[#002244] uppercase mt-2 font-sans flex flex-col items-center leading-none">
      <span className="text-[11px] text-amber-700 font-extrabold tracking-widest">सत्यमेव जयते</span>
      <span className="text-[7px] text-slate-500 tracking-[0.15em] mt-1">SATYAMEVA JAYATE</span>
    </div>
  </div>
);

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [wards, setWards] = useState<Ward[]>([]);
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  
  // Separate portals router state
  const [selectedPortal, setSelectedPortal] = useState<'citizen' | 'admin' | null>(null);
  
  // Real-time local digital clock
  const [timeStr, setTimeStr] = useState('');

  // 1. Digital Clock effect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleDateString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }) + ' | ' + now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }) + ' (IST)');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Fetch data from backend
  const fetchData = async (silent = false) => {
    if (!silent) setSyncStatus('syncing');
    try {
      // Fetch both resources in parallel for maximum speed
      const [grievancesRes, wardsRes] = await Promise.all([
        fetch('/api/grievances'),
        fetch('/api/wards')
      ]);

      if (grievancesRes.ok && wardsRes.ok) {
        const grievancesData = await grievancesRes.json();
        const wardsData = await wardsRes.json();
        setGrievances(grievancesData);
        setWards(wardsData);
        setSyncStatus('synced');
      } else {
        setSyncStatus('offline');
      }
    } catch (err) {
      console.error('Error synchronizing data with server:', err);
      setSyncStatus('offline');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchData();
  }, []);

  // 3. Real-Time Synchronization Polling Loop
  // This satisfies requirement #2 (seamless real-time sync across devices)
  useEffect(() => {
    // Poll every 5 seconds to get instantaneous upvotes, assignments, or state updates!
    const pollTimer = setInterval(() => {
      fetchData(true);
    }, 5000);
    return () => clearInterval(pollTimer);
  }, []);

  // 4. API Operations
  const handleAddGrievance = async (title: string, description: string, area: string) => {
    if (!user) return;
    setSyncStatus('syncing');
    try {
      const res = await fetch('/api/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          area,
          userId: user.id,
          userName: user.name
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to file grievance');
      }

      // Re-fetch database to catch new ticket
      await fetchData();
    } catch (err) {
      console.error(err);
      alert('Grievance submission error. Check server logs.');
    }
  };

  const handleBackGrievance = async (id: string) => {
    if (!user) return;
    setSyncStatus('syncing');
    try {
      const res = await fetch(`/api/grievances/${id}/back`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to register backing');
      }

      await fetchData(true); // silent refresh
    } catch (err: any) {
      alert(err.message || 'Double upvote error.');
    }
  };

  const handleUpdateStatus = async (id: string, status: string, officialResponse: string) => {
    if (!user || user.role !== 'admin') return;
    setSyncStatus('syncing');
    try {
      const res = await fetch(`/api/grievances/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          officialResponse,
          performerName: user.name
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update status');
      }

      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleManualReRoute = async (id: string, newCategory: string) => {
    if (!user || user.role !== 'admin') return;
    setSyncStatus('syncing');
    try {
      const res = await fetch(`/api/grievances/${id}/route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newCategory,
          performerName: user.name
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to reroute');
      }

      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignOfficer = async (id: string, officerName: string) => {
    if (!user || user.role !== 'admin') return;
    setSyncStatus('syncing');
    try {
      const res = await fetch(`/api/grievances/${id}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officerName,
          performerName: user.name
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to assign officer');
      }

      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedPortal(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center space-y-6 relative overflow-hidden" id="global-loading">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#128807]"></div>
        
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-20 h-20 flex items-center justify-center bg-white rounded-full shadow-lg border border-slate-200">
            <AshokaChakra size={64} className="text-[#000080]" />
          </div>
          <div className="flex flex-col items-center text-center space-y-1">
            <h2 className="text-sm font-bold text-slate-800 tracking-wider font-sans">NATIONAL COMPLIANCE ENGINE</h2>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Department of Information Technology • Govt. of India</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm animate-pulse">
          <div className="w-2 h-2 rounded-full bg-[#128807]"></div>
          <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest">Contacting Central Grid Directory...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col relative overflow-x-hidden" id="app-viewport">
      
      {/* 1. Indian Government Top Utility Bar (Screen Reader, Font Adjust, National Marker) */}
      <div className="bg-[#1e293b] text-white text-[10px] font-medium py-1.5 px-4 border-b border-slate-700 select-none" id="gov-utility-bar">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          
          {/* Left: National Identifier */}
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1 items-center">
              <IndianFlag />
              <span className="font-bold text-slate-200 uppercase tracking-wider text-[9px] sm:text-[10px]">
                भारत सरकार | Government of India
              </span>
            </div>
            <span className="text-slate-500 hidden md:inline">|</span>
            <span className="text-slate-300 hidden md:inline uppercase tracking-widest text-[9px]">
              राष्ट्रीय लोक शिकायत ग्रिड (CPGRAMS-Core)
            </span>
          </div>

          {/* Right: Accessibility Options & Language Toggler */}
          <div className="flex items-center space-x-4 text-slate-300">
            <a href="#main-content" className="hover:text-white transition uppercase text-[9px] tracking-wider hidden sm:inline">
              मुख्य विषय-वस्तु पर जाएं | Skip to Main Content
            </a>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="hover:text-white transition cursor-pointer hidden md:inline">
              स्क्रीन रीडर एक्सेस | Screen Reader Access
            </span>
            <span className="text-slate-600 hidden md:inline">|</span>
            
            {/* Accessibility Buttons */}
            <div className="flex items-center space-x-1.5">
              <button className="px-1.5 py-0.2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-[8px] font-bold rounded" title="Decrease font size">A-</button>
              <button className="px-1.5 py-0.2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-[8px] font-bold rounded" title="Normal font size">A</button>
              <button className="px-1.5 py-0.2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-[8px] font-bold rounded" title="Increase font size">A+</button>
            </div>
            
            <span className="text-slate-600">|</span>
            
            {/* Language switches */}
            <span className="font-bold hover:text-[#FF9933] cursor-pointer transition text-[9px]">
              हिन्दी
            </span>
            <span className="text-slate-600">/</span>
            <span className="font-bold text-[#FF9933] hover:text-white cursor-pointer transition text-[9px]">
              English
            </span>
          </div>
        </div>
      </div>

      {/* 2. Official Logo & Department Header Banner */}
      <header className="bg-white border-b-4 border-[#000080] shadow-md relative z-30 py-4 px-4 sm:px-6 lg:px-8" id="portal-header">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-6">
          
          {/* Logo Brand Panel with Satyamev Jayate State Emblem & Ashoka Chakra */}
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            
            {/* Satyamev Jayate emblem representation */}
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center justify-center shadow-inner">
              <SatyamevJayateLogo />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <span className="bg-[#FF9933] h-2.5 w-1 rounded-full"></span>
                <span className="font-sans text-[11px] font-extrabold text-[#128807] uppercase tracking-widest">
                  डिजिटल इंडिया | DIGITAL INDIA PLATFORM
                </span>
              </div>
              
              <h1 className="text-xl sm:text-2xl font-black uppercase text-[#002244] tracking-tight leading-none font-sans">
                राष्ट्रीय लोक शिकायत निवारण प्रणाली
              </h1>
              <h2 className="text-sm sm:text-base font-bold text-slate-700 tracking-wide font-sans">
                National Lok Grievance Redressal Portal
              </h2>
              
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                प्रशासनिक सुधार और लोक शिकायत विभाग | Dept. of Administrative Reforms & Public Grievances
              </p>
            </div>
          </div>

          {/* Right Panel: Active Ashoka Chakra, Sync Status, Digital Clock & Honorable Ministers */}
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-5">
            
            {/* Dignitaries Portfolios (Modi & Minister) - Standard signature of official sites! */}
            <div className="hidden xl:flex items-center space-x-4 border-r border-slate-200 pr-5">
              
              {/* Dignitary 1: Honorable Prime Minister */}
              <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-100 shadow-sm">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF9933] via-white to-[#128807] p-0.5 shadow-md flex items-center justify-center overflow-hidden">
                  <img 
                    src="/src/assets/images/pm_modi_avatar_1783690338362.jpg" 
                    alt="PM Narendra Modi" 
                    className="w-full h-full rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-left select-none">
                  <div className="text-[9px] font-extrabold text-slate-800 leading-none">श्री नरेंद्र मोदी</div>
                  <div className="text-[8px] font-bold text-slate-500 leading-tight">Shri Narendra Modi</div>
                  <div className="text-[7px] text-amber-600 font-bold uppercase tracking-widest leading-none">Hon'ble Prime Minister</div>
                </div>
              </div>

              {/* Dignitary 2: Union Minister (DARPG/MeitY) */}
              <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-100 shadow-sm">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF9933] via-white to-[#128807] p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#1e293b] flex items-center justify-center text-white text-[9px] font-black font-mono">AV</div>
                </div>
                <div className="text-left select-none">
                  <div className="text-[9px] font-extrabold text-slate-800 leading-none">श्री अश्विनी वैष्णव</div>
                  <div className="text-[8px] font-bold text-slate-500 leading-tight">Shri Ashwini Vaishnaw</div>
                  <div className="text-[7px] text-emerald-600 font-bold uppercase tracking-widest leading-none">Hon'ble Union Minister</div>
                </div>
              </div>
            </div>

            {/* Live Data Sync Panel */}
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1.5 text-xs bg-slate-100 border border-slate-200 px-3 py-1 rounded">
                  <span className={`w-2 h-2 rounded-full ${syncStatus === 'synced' ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : syncStatus === 'syncing' ? 'bg-amber-500 animate-spin' : 'bg-red-500'}`}></span>
                  <span className="font-mono text-[9px] text-slate-600 uppercase tracking-widest font-bold">
                    {syncStatus === 'synced' ? 'CPGRAMS Sync Active' : syncStatus === 'syncing' ? 'UPDATING...' : 'DISCONNECTED'}
                  </span>
                </div>
                
                {/* Official Spinning Ashoka Chakra Icon */}
                <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center shadow-inner bg-slate-50">
                  <AshokaChakra size={22} className="text-[#000080]" />
                </div>
              </div>

              {/* Real-time IST Clock */}
              <div className="flex items-center space-x-1.5 text-[10px] bg-slate-900 text-amber-400 px-3 py-1 rounded font-mono font-bold shadow-sm">
                <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
                <span>{timeStr}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Official Announcements Marquee Ticker */}
      <div className="ticker-wrap border-b border-slate-300 shadow-inner text-white select-none" id="news-marquee-bar">
        <div className="max-w-7xl mx-auto flex items-center">
          <div className="bg-[#FF9933] text-slate-950 font-black text-[9px] sm:text-[10px] uppercase px-3 py-1 font-sans flex items-center space-x-1 tracking-wider shrink-0 z-10 shadow-md">
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            <span>नवीनतम समाचार / NEWS MARQUEE :</span>
          </div>
          <div className="ticker text-[10px] sm:text-[11px] font-sans font-medium text-slate-200 pl-4 py-1 flex items-center space-x-8">
            <span>🔊 <strong>SLA Monitoring:</strong> Citizens can upvote active grievances to trigger automatic AI severity escalation.</span>
            <span className="text-[#FF9933]">•</span>
            <span>🎯 <strong>Department SLA Targets:</strong> All assigned cases must undergo automated routing assessment within 3 minutes of filing.</span>
            <span className="text-[#FF9933]">•</span>
            <span>⚡ <strong>Digital India 2026:</strong> Core classification models utilize neural translation trained across multiple official Indian languages.</span>
            <span className="text-[#FF9933]">•</span>
            <span>🤝 <strong>Transparency:</strong> Citizens retain full verification authority. AI routing results can be overridden by SLA Officers instantly.</span>
          </div>
        </div>
      </div>

      {/* 4. Active Session Indicator bar (only shown if logged in) */}
      {user && (
        <div className="bg-[#002244] text-white py-2 px-4 shadow-sm border-b border-slate-700" id="session-info-bar">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 text-[10px] font-mono">AUTHORIZED SECURE SESSION:</span>
              <span className="text-xs font-extrabold text-[#FF9933]">{user.name}</span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="bg-white/10 px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider text-slate-300">
                {user.role === 'admin' ? `SLA ADMINISTRATIVE OFFICER [${user.department || 'All Departments'}]` : 'VERIFIED CITIZEN'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                id="header-logout-btn"
                className="px-3 py-1 bg-white/5 hover:bg-red-600/30 text-slate-300 hover:text-white border border-slate-700 hover:border-red-500/50 rounded text-[10px] uppercase font-bold tracking-wider transition cursor-pointer flex items-center space-x-1"
                title="Securely close portal session"
              >
                <LogOut className="w-3 h-3" />
                <span>लॉग आउट | LOGOUT</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Primary Page Content Router */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10" id="main-content">
        <AnimatePresence mode="wait">
          {!user ? (
            selectedPortal === null ? (
              <motion.div
                key="gateway-hub"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
              >
                <GatewayHub 
                  onSelectCitizen={() => setSelectedPortal('citizen')}
                  onSelectAdmin={() => setSelectedPortal('admin')}
                />
              </motion.div>
            ) : (
              <motion.div
                key={`auth-${selectedPortal}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <AuthScreen 
                  onLoginSuccess={(u) => {
                    setUser(u);
                  }} 
                  portalType={selectedPortal}
                  onBackToGateway={() => setSelectedPortal(null)}
                />
              </motion.div>
            )
          ) : user.role === 'admin' ? (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AdminPortal
                user={user}
                wards={wards}
                grievances={grievances}
                onRefreshData={fetchData}
                onUpdateStatus={handleUpdateStatus}
                onManualReRoute={handleManualReRoute}
                onAssignOfficer={handleAssignOfficer}
              />
            </motion.div>
          ) : (
            <motion.div
              key="citizen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CitizenPortal
                user={user}
                wards={wards}
                grievances={grievances}
                onRefreshData={fetchData}
                onAddGrievance={handleAddGrievance}
                onBackGrievance={handleBackGrievance}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 6. Official Indian Government Digital Footnote */}
      <footer className="bg-[#1e293b] text-slate-300 border-t-4 border-[#128807] pt-10 pb-6 relative z-10 text-xs font-sans" id="portal-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-slate-700 pb-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <SatyamevJayateLogo dark={true} />
                <div className="text-left">
                  <div className="font-extrabold text-white text-[11px] leading-tight">राष्ट्रीय लोक शिकायत निवारण प्रणाली</div>
                  <div className="text-[10px] text-slate-400">National Lok Grievance Portal</div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                An advanced AI-powered service interface built for high-trust grievance categorization, verification, and automated routing under strict SLA targets.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-bold text-white uppercase text-[10px] tracking-wider text-[#FF9933]">महत्वपूर्ण लिंक / QUICK LINKS</h3>
              <ul className="space-y-1.5 text-[10px] text-slate-400 font-sans">
                <li><a href="#" className="hover:text-[#FF9933] transition">CPGRAMS Central Portal</a></li>
                <li><a href="#" className="hover:text-[#FF9933] transition">MyGov Innovation Centre</a></li>
                <li><a href="#" className="hover:text-[#FF9933] transition">National Portal of India</a></li>
                <li><a href="#" className="hover:text-[#FF9933] transition">Ministry of IT (MeitY)</a></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-white uppercase text-[10px] tracking-wider text-[#FF9933]">शिकायत नीति / HELPDESK & SUPPORT</h3>
              <ul className="space-y-1.5 text-[10px] text-slate-400 font-sans">
                <li>📞 Toll Free National Support: 1800-11-3555</li>
                <li>✉️ Official Helpdesk: support-darpg@gov.in</li>
                <li>🏢 DARPG Office, Sardar Patel Bhavan, Sansad Marg, New Delhi</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-white uppercase text-[10px] tracking-wider text-[#FF9933]">WEBSITE CERTIFIED SECURE</h3>
              <div className="flex items-center space-x-2 bg-slate-800/50 p-2.5 rounded border border-slate-700">
                <Shield className="w-8 h-8 text-emerald-400 shrink-0" />
                <div className="text-[9px] text-slate-300 font-mono leading-tight">
                  <div className="font-bold uppercase text-emerald-400">NIC SECURE LINK</div>
                  <div>Certified 256-Bit SSL Encryption</div>
                  <div>Audit Compliant: STQC 2026</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-400 font-mono gap-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1">
              <span className="flex items-center space-x-1">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>Administrative Reforms Commission Service Gate</span>
              </span>
              <span>•</span>
              <span>NIC Cloud Sandbox 2026 Host</span>
            </div>
            
            <div className="text-center md:text-right space-y-0.5">
              <div>DPDP Act 2023 Digital Framework • CPGRAMS v8.02 Compliant</div>
              <div className="text-[9px] text-slate-500">Designed and maintained under National Informatics Centre (NIC) regulations.</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
