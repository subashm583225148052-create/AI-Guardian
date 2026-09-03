import React, { useState } from 'react';
import { Mail, ShieldAlert, CheckCircle2, AlertTriangle, ArrowLeft, Share2, Trash2, Eye, ShieldBan, Sparkles } from 'lucide-react';
import { SMSMessage, AppSettings, RiskAnalysisResult } from '../types';
import { analyzeMessageRisk } from '../utils/riskEngine';

interface InboxScreenProps {
  messages: SMSMessage[];
  settings: AppSettings;
  onBack: () => void;
  onReportMessage: (msg: SMSMessage) => void;
  onInspectRisk: (result: RiskAnalysisResult, title: string) => void;
}

export const InboxScreen: React.FC<InboxScreenProps> = ({
  messages,
  settings,
  onBack,
  onReportMessage,
  onInspectRisk,
}) => {
  const [selectedMessage, setSelectedMessage] = useState<SMSMessage | null>(null);

  const isTamil = settings.language === 'ta';
  const isLarge = settings.textSize === 'large';

  const handleOpenMessage = (msg: SMSMessage) => {
    setSelectedMessage(msg);
    const analysis = analyzeMessageRisk(msg.fullText, msg.sender);
    onInspectRisk(analysis, `Incoming SMS from ${msg.sender}`);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 transition-colors shadow-sm"
            aria-label="Back to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className={`font-black text-slate-900 ${isLarge ? 'text-2xl' : 'text-xl'}`}>
              {isTamil ? 'செய்திகள் & வங்கி SMS' : 'SMS Inbox & Scanner'}
            </h2>
            <p className="text-xs text-slate-500">
              {isTamil
                ? 'ஒவ்வொரு SMS-ஐயும் தட்டி AI மோசடி சோதனையை பார்க்கலாம்'
                : 'Tap any message to run instant explainable AI risk analysis'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold border border-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Scam Scanner Ready</span>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {messages.map((msg) => {
          // Pre-analyze risk for visual pill
          const quickAnalysis = analyzeMessageRisk(msg.fullText, msg.sender);
          const isHigh = quickAnalysis.level === 'HIGH';
          const isMed = quickAnalysis.level === 'MEDIUM';

          return (
            <div
              key={msg.id}
              id={`sms-item-${msg.id}`}
              onClick={() => handleOpenMessage(msg)}
              className={`p-4 sm:p-5 rounded-2xl bg-white border-2 transition-all cursor-pointer shadow-sm hover:shadow-md ${
                isHigh
                  ? 'border-rose-300 hover:border-rose-500 bg-rose-50/20'
                  : isMed
                  ? 'border-amber-300 hover:border-amber-500 bg-amber-50/20'
                  : 'border-slate-200 hover:border-emerald-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base text-slate-900">
                    {msg.sender}
                  </span>
                  {quickAnalysis.dialectDetected && (
                    <span className="hidden sm:inline text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded">
                      {quickAnalysis.dialectDetected.split(' ')[0]}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">
                    {msg.timestamp}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      isHigh
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : isMed
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}
                  >
                    {isHigh ? '🚨 High Scam Risk' : isMed ? '⚠️ Caution' : '✅ Verified Safe'}
                  </span>
                </div>
              </div>

              <p className="text-sm font-medium text-slate-700 line-clamp-2 leading-relaxed">
                {msg.fullText}
              </p>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span className="flex items-center gap-1 text-indigo-600">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Tap to view AI Fraud Explanation</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  AI Risk Score: {quickAnalysis.score}/100
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
