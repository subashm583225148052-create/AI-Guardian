import React, { useState } from 'react';
import { Phone, PhoneOff, ShieldAlert, CheckCircle2, AlertTriangle, HelpCircle, UserX, Share2, Volume2, Mic } from 'lucide-react';
import { AppSettings, Language } from '../types';

interface GrandchildCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onReportNumber: (phone: string, reason: string) => void;
}

export const GrandchildCallModal: React.FC<GrandchildCallModalProps> = ({
  isOpen,
  onClose,
  settings,
  onReportNumber,
}) => {
  const [callState, setCallState] = useState<'incoming' | 'active' | 'question_asked' | 'fraud_flagged'>('incoming');

  if (!isOpen) return null;

  const isTamil = settings.language === 'ta';

  const handleAnswer = () => {
    setCallState('active');
  };

  const handleAskQuestion = () => {
    setCallState('question_asked');
    setTimeout(() => {
      setCallState('fraud_flagged');
    }, 2400);
  };

  const handleBlockAndReport = () => {
    onReportNumber('+91 98401 99988', 'Grandchild voice impersonation scam demanding ₹40,000');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border-2 border-slate-700 text-white shadow-2xl overflow-hidden my-auto p-6 flex flex-col items-center text-center">
        {/* Incoming Call Screen */}
        {callState === 'incoming' && (
          <div className="w-full space-y-6 py-4 animate-in fade-in">
            <div className="flex items-center justify-center gap-2 text-rose-400 text-xs font-black uppercase tracking-widest bg-rose-950/60 border border-rose-800/60 px-3 py-1 rounded-full">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Simulated High-Risk Incoming Call</span>
            </div>

            <div className="space-y-2">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-rose-500 flex items-center justify-center text-3xl shadow-xl animate-pulse">
                  👴📞
                </div>
                <span className="absolute -bottom-1 -right-1 p-1.5 bg-rose-600 rounded-full text-white">
                  <Volume2 className="w-4 h-4 animate-ping" />
                </span>
              </div>
              <h2 className="text-2xl font-black text-white">
                Rahul (Claims Grandson)
              </h2>
              <p className="text-sm font-mono text-rose-300 font-bold">
                +91 98401 99988
              </p>
              <p className="text-xs text-amber-300 bg-amber-950/40 border border-amber-800/40 px-3 py-1 rounded-lg">
                ⚠️ Unsaved number claiming to be family member in urgent distress
              </p>
            </div>

            {/* Accept / Decline Buttons */}
            <div className="flex items-center justify-around pt-6 w-full max-w-xs mx-auto">
              <button
                onClick={onClose}
                className="flex flex-col items-center gap-1.5 text-xs text-slate-300 group"
              >
                <div className="w-16 h-16 rounded-full bg-rose-600 group-hover:bg-rose-700 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                  <PhoneOff className="w-7 h-7 text-white" />
                </div>
                <span>Decline</span>
              </button>

              <button
                id="call-modal-answer-btn"
                onClick={handleAnswer}
                className="flex flex-col items-center gap-1.5 text-xs text-emerald-300 group"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500 group-hover:bg-emerald-600 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 animate-bounce">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <span className="font-bold">Answer Call</span>
              </button>
            </div>
          </div>
        )}

        {/* Active Call In Progress */}
        {callState === 'active' && (
          <div className="w-full space-y-4 py-2 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <p className="text-base font-bold text-white">Rahul (Grandson?)</p>
                <p className="text-xs text-emerald-400 font-mono">00:09 • Call Active</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-amber-400 bg-amber-950/50 px-2 py-1 rounded-md border border-amber-800/40">
                <Mic className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                <span>Voice Analyzing</span>
              </div>
            </div>

            {/* Caller's simulated panicked speech */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 text-xs sm:text-sm text-slate-100 space-y-2">
              <div className="text-[11px] font-bold uppercase text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Caller is saying (Panicked Voice):</span>
              </div>
              <p className="italic leading-relaxed">
                "Grandpa!! Please help me, don't tell mom! I got into a road accident near Chennai central station. The police officer is demanding ₹40,000 right now or he will lock me up in jail! Please transfer to his UPI immediately!!"
              </p>
            </div>

            {/* The Grandchild Challenge Button (Feature 5) */}
            <div className="pt-2 space-y-2">
              <button
                id="call-modal-verify-btn"
                onClick={handleAskQuestion}
                className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl transition-transform hover:scale-[1.02]"
              >
                <HelpCircle className="w-5 h-5 text-slate-950" />
                <span>Verify Caller with Secret Family Question</span>
              </button>
              <p className="text-[11px] text-center text-slate-400">
                Tests if the caller is really your grandson or an AI voice clone.
              </p>
            </div>

            <div className="pt-3 flex justify-center">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <PhoneOff className="w-4 h-4" />
                <span>Hang Up</span>
              </button>
            </div>
          </div>
        )}

        {/* Question Asked State */}
        {callState === 'question_asked' && (
          <div className="w-full space-y-4 py-4 text-left animate-in fade-in">
            <div className="bg-amber-950/60 border border-amber-600 rounded-2xl p-4 text-xs sm:text-sm space-y-2">
              <span className="text-amber-400 font-bold uppercase text-[11px] block">
                You asked your secret question:
              </span>
              <p className="font-bold text-white text-sm">
                "{settings.secretFamilyQuestion}"
              </p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 text-xs sm:text-sm space-y-2 animate-pulse">
              <span className="text-slate-400 font-bold uppercase text-[11px] block">
                Caller is stumbling:
              </span>
              <p className="italic text-slate-200">
                "Uh... what?? Grandpa why are you asking weird questions right now?! We ate... pizza at a luxury hotel! Please hurry, the police officer is getting angry!"
              </p>
            </div>

            <div className="text-center text-xs text-amber-400 font-semibold py-2">
              Verifying answer against family vault...
            </div>
          </div>
        )}

        {/* Fraud Flagged State */}
        {callState === 'fraud_flagged' && (
          <div className="w-full space-y-4 py-2 text-left animate-in zoom-in-95">
            <div className="bg-rose-950/80 border-2 border-rose-500 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-rose-300">
                <ShieldAlert className="w-6 h-6 text-rose-500" />
                <h3 className="text-lg font-black text-white">
                  IMPERSONATION FRAUD DETECTED!
                </h3>
              </div>

              <div className="bg-rose-900/40 p-3 rounded-xl text-xs space-y-1.5 border border-rose-800/60 text-rose-100">
                <p>
                  ❌ <strong>Caller Answer:</strong> "Pizza at a hotel" (WRONG)
                </p>
                <p>
                  ✅ <strong>Real Family Answer:</strong> "{settings.secretFamilyAnswer}"
                </p>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed">
                <strong>Plain English Explanation:</strong> This caller is NOT your grandson. Criminals use emergency panic and AI voice synthesis to extort money from grandparents. Your grandson is safe.
              </p>
            </div>

            {/* Immediate Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                id="call-modal-block-report-btn"
                onClick={handleBlockAndReport}
                className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                <UserX className="w-4 h-4" />
                <span>Hang Up, Block & Add to Community Radar</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold text-center"
              >
                Close Simulation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
