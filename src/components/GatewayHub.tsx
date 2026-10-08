/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, Sliders, Shield, ArrowRight, Clock, HelpCircle, 
  ExternalLink, FileText, CheckCircle2, Award, Sparkles, Building2, Phone, Mail
} from 'lucide-react';
import { IndianFlag, AshokaChakra, AshokStambh } from '../App';

interface GatewayHubProps {
  onSelectCitizen: () => void;
  onSelectAdmin: () => void;
}

export default function GatewayHub({ onSelectCitizen, onSelectAdmin }: GatewayHubProps) {
  return (
    <div className="space-y-12 py-4" id="gateway-hub-root">
      
      {/* 1. National Emblem & Hero Introduction */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          {/* Majestic Ashok Stambh National Emblem SVG */}
          <AshokStambh size={110} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-3"
        >
          <div className="inline-flex items-center space-x-2 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold text-amber-800 uppercase tracking-widest font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" />
            <span>AI-Driven Public Administration Initiative</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#002244] tracking-tight leading-tight">
            राष्ट्रीय लोक शिकायत निवारण द्वार
          </h2>
          <h3 className="text-lg sm:text-xl font-bold text-slate-700 tracking-wide font-sans">
            National Lok Grievance Redressal Gateway
          </h3>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Welcome to the centralized government compliance portal. Select your authorized service pathway to lodge public complaints or perform operational SLA monitoring and administrative overrides.
          </p>
        </motion.div>
      </div>

      {/* 2. Side-by-Side Dual Portal Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto" id="portal-cards-grid">
        
        {/* Portal A: Citizen Portal */}
        <motion.div
          whileHover={{ y: -6, scale: 1.01 }}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl border-2 border-slate-200 hover:border-[#FF9933] shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
          id="gateway-citizen-card"
        >
          {/* Card Top Accent (Saffron) */}
          <div className="h-2.5 bg-[#FF9933]" />
          
          <div className="p-8 flex flex-col flex-grow space-y-6">
            <div className="flex items-start justify-between">
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-[#FF9933]">
                <Users className="w-8 h-8" />
              </div>
              <span className="bg-[#FF9933]/10 text-[#FF9933] px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider border border-[#FF9933]/20">
                PUBLIC SERVICE
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-[#002244] tracking-tight">
                नागरिक सेवा पोर्टल
              </h3>
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest font-mono">
                Citizen Grievance Portal
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                For citizens of India to lodge civil, municipal, and structural grievances. View automated real-time translation, track SLA progress, and back local community initiatives.
              </p>
            </div>

            {/* List of features */}
            <div className="space-y-3 flex-grow pt-2">
              <div className="flex items-start space-x-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#128807] shrink-0 mt-0.5" />
                <span><strong>Instant Multi-Language Filing:</strong> Translate local dialects (Hindi, Bengali, Tamil) into centralized English automatically.</span>
              </div>
              <div className="flex items-start space-x-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#128807] shrink-0 mt-0.5" />
                <span><strong>Community Upvote Backing:</strong> Upvote local issues to dynamic priority indexing.</span>
              </div>
              <div className="flex items-start space-x-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#128807] shrink-0 mt-0.5" />
                <span><strong>Real-Time SLA Clock:</strong> Continuous SLA countdown with transparency.</span>
              </div>
            </div>

            <button
              onClick={onSelectCitizen}
              id="enter-citizen-portal-btn"
              className="w-full py-3.5 bg-[#002244] hover:bg-[#FF9933] text-white hover:text-slate-950 font-black uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer group text-xs sm:text-sm"
            >
              <span>Citizen Portal / नागरिक प्रवेश</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Portal B: SLA Officer Portal */}
        <motion.div
          whileHover={{ y: -6, scale: 1.01 }}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl border-2 border-slate-200 hover:border-[#128807] shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
          id="gateway-admin-card"
        >
          {/* Card Top Accent (Green) */}
          <div className="h-2.5 bg-[#128807]" />
          
          <div className="p-8 flex flex-col flex-grow space-y-6">
            <div className="flex items-start justify-between">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-[#128807]">
                <Sliders className="w-8 h-8" />
              </div>
              <span className="bg-[#128807]/10 text-[#128807] px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider border border-[#128807]/20">
                ADMIN SECURE
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-[#002244] tracking-tight">
                अधिकारी नियंत्रण कक्ष
              </h3>
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest font-mono">
                SLA Officer Control Portal
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                For administrative officers, supervisors, and municipal coordinators. Track automated priority scores, coordinate dispatch assignments, and override AI routing instantly.
              </p>
            </div>

            {/* List of features */}
            <div className="space-y-3 flex-grow pt-2">
              <div className="flex items-start space-x-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#128807] shrink-0 mt-0.5" />
                <span><strong>AI Routing Overwrites:</strong> Re-assign categories or departments with a single click.</span>
              </div>
              <div className="flex items-start space-x-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#128807] shrink-0 mt-0.5" />
                <span><strong>Priority Index Dispatch:</strong> Monitor live population-adjusted urgency metrics.</span>
              </div>
              <div className="flex items-start space-x-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#128807] shrink-0 mt-0.5" />
                <span><strong>Official Audit Logging:</strong> Maintain permanent records of all officer decisions.</span>
              </div>
            </div>

            <button
              onClick={onSelectAdmin}
              id="enter-admin-portal-btn"
              className="w-full py-3.5 bg-[#002244] hover:bg-[#128807] text-white font-black uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer group text-xs sm:text-sm"
            >
              <span>Officer Portal / अधिकारी प्रवेश</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </motion.div>

      </div>

      {/* 3. National Dignitaries Banner (Featuring Generated PM Modi Photo) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-5xl mx-auto shadow-sm"
        id="gateway-dignitaries-panel"
      >
        <div className="text-center mb-5">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] font-mono leading-none">
            भारत सरकार के नेतृत्व में | UNDER THE LEADERSHIP OF THE GOVERNMENT OF INDIA
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center justify-center max-w-3xl mx-auto">
          
          {/* Prime Minister Panel */}
          <div className="flex items-center space-x-4 bg-white p-3 rounded-xl border border-slate-100 shadow-sm justify-center sm:justify-start">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FF9933] via-white to-[#128807] p-1 shadow-md flex items-center justify-center overflow-hidden shrink-0">
              <img 
                src="/src/assets/images/pm_modi_avatar_1783690338362.jpg" 
                alt="Shri Narendra Modi" 
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-left select-none">
              <h5 className="text-sm font-extrabold text-slate-800 leading-tight">श्री नरेंद्र मोदी</h5>
              <h6 className="text-xs font-bold text-slate-500 leading-tight">Shri Narendra Modi</h6>
              <p className="text-[10px] text-amber-600 font-extrabold uppercase tracking-wider mt-0.5 font-sans leading-none">
                Hon'ble Prime Minister
              </p>
            </div>
          </div>

          {/* Union Minister Panel */}
          <div className="flex items-center space-x-4 bg-white p-3 rounded-xl border border-slate-100 shadow-sm justify-center sm:justify-start">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FF9933] via-white to-[#128807] p-1 shadow-md flex items-center justify-center overflow-hidden shrink-0">
              <div className="w-full h-full rounded-full bg-[#1e293b] flex items-center justify-center text-white text-base font-black font-mono">
                AV
              </div>
            </div>
            <div className="text-left select-none">
              <h5 className="text-sm font-extrabold text-slate-800 leading-tight">श्री अश्विनी वैष्णव</h5>
              <h6 className="text-xs font-bold text-slate-500 leading-tight">Shri Ashwini Vaishnaw</h6>
              <p className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-wider mt-0.5 font-sans leading-none">
                Hon'ble Union Minister (MeitY)
              </p>
            </div>
          </div>

        </div>
      </motion.div>

      {/* 4. Secure Trust Infrastructure Disclaimers */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] text-slate-400 font-mono text-center max-w-4xl mx-auto border-t border-slate-200 pt-6">
        <span className="flex items-center space-x-1 justify-center">
          <Shield className="w-4.5 h-4.5 text-[#128807]" />
          <span>STQC Certified Security Compliance</span>
        </span>
        <span>•</span>
        <span>NIC Cloud Network Server Core Grid v8.2</span>
        <span>•</span>
        <span>Digital Personal Data Protection (DPDP) 2023 Compliant</span>
      </div>

    </div>
  );
}
