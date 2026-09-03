import React, { useState, useEffect } from 'react';
import { Send, ArrowLeft, ShieldAlert, CheckCircle2, AlertTriangle, Users, Clock, Moon, Sparkles, Building } from 'lucide-react';
import { Payee, AppSettings, CommunityRadarItem, RiskAnalysisResult } from '../types';
import { analyzeTransactionRisk } from '../utils/riskEngine';

interface SendMoneyScreenProps {
  payees: Payee[];
  communityRadar: CommunityRadarItem[];
  settings: AppSettings;
  onBack: () => void;
  onSubmitTransaction: (amount: number, payee: Payee, isLateNight: boolean) => void;
}

export const SendMoneyScreen: React.FC<SendMoneyScreenProps> = ({
  payees,
  communityRadar,
  settings,
  onBack,
  onSubmitTransaction,
}) => {
  const [selectedPayee, setSelectedPayee] = useState<Payee>(payees[0]);
  const [amount, setAmount] = useState<number>(200);
  const [customUpi, setCustomUpi] = useState<string>('');
  const [customName, setCustomName] = useState<string>('');
  const [isManualPayee, setIsManualPayee] = useState<boolean>(false);
  const [isLateNightSimulated, setIsLateNightSimulated] = useState<boolean>(false);

  const isTamil = settings.language === 'ta';
  const isLarge = settings.textSize === 'large';

  // Active payee evaluation
  const activePayee: Payee = isManualPayee
    ? {
        id: 'custom-payee',
        name: customName || 'Recipient',
        upiId: customUpi || 'unknown@upi',
        isFrequent: false,
        reputation: 'unknown',
      }
    : selectedPayee;

  // Real-time Trust Score Passport Check (Feature 4)
  const radarMatch = communityRadar.find(
    (item) => item.identifier.toLowerCase() === activePayee.upiId.toLowerCase()
  );

  const isFlaggedScam = radarMatch?.type === 'scam' || activePayee.reputation === 'scam';
  const isVerifiedTrusted =
    (radarMatch?.type === 'trusted' || activePayee.reputation === 'trusted') && activePayee.isFrequent;

  // Quick amounts
  const quickAmounts = [200, 1500, 5000, 50000];

  const handleStartTransfer = () => {
    if (amount <= 0) return;
    onSubmitTransaction(amount, activePayee, isLateNightSimulated);
  };

  return (
    <div className="space-y-6 pb-20 max-w-xl mx-auto">
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
              {isTamil ? 'பணம் அனுப்புதல்' : 'Send Money (UPI Transfer)'}
            </h2>
            <p className="text-xs text-slate-500">
              {isTamil ? 'AI மோசடி தடுப்பு அடுக்குடன் பாதுகாக்கப்பட்டது' : 'Protected by AI Guardian Fraud Detection'}
            </p>
          </div>
        </div>
      </div>

      {/* Payee Selection Section */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
            {isTamil ? 'பெறுநரை தேர்வு செய்யவும்:' : 'Select Recipient / Payee:'}
          </label>
          <button
            onClick={() => setIsManualPayee(!isManualPayee)}
            className="text-xs font-bold text-amber-700 hover:text-amber-800"
          >
            {isManualPayee ? '← Choose from frequent' : '+ Enter new UPI / Phone'}
          </button>
        </div>

        {!isManualPayee ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {payees.map((p) => {
              const isSelected = selectedPayee.id === p.id;
              const isScam = p.reputation === 'scam';

              return (
                <button
                  key={p.id}
                  id={`payee-select-${p.id}`}
                  onClick={() => setSelectedPayee(p)}
                  className={`p-3 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/60 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-slate-900 line-clamp-1">
                        {p.name}
                      </span>
                      {isScam ? (
                        <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">
                          SCAM
                        </span>
                      ) : p.isFrequent ? (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                          Frequent
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs font-mono text-slate-500 mt-0.5 truncate">
                      {p.upiId}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 font-semibold block mb-1">
                Recipient Name or Business:
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Courier Delivery Agent"
                className="w-full p-3 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-400 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-semibold block mb-1">
                Recipient UPI ID or Phone:
              </label>
              <input
                type="text"
                value={customUpi}
                onChange={(e) => setCustomUpi(e.target.value)}
                placeholder="e.g. kyc-sbi-update@okaxis or 98401XXXXX"
                className="w-full p-3 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-400 outline-none font-mono"
              />
            </div>
          </div>
        )}

        {/* Feature 4: Trust Score Passport Card */}
        <div
          className={`p-3.5 rounded-2xl border-2 transition-all ${
            isFlaggedScam
              ? 'bg-rose-50 border-rose-400 text-rose-950'
              : isVerifiedTrusted
              ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {isFlaggedScam ? (
              <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            ) : isVerifiedTrusted ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="font-extrabold uppercase text-[11px] tracking-wider">
                  Community Trust Passport:
                </span>
                <span
                  className={`font-black text-[10px] px-2 py-0.5 rounded-full ${
                    isFlaggedScam
                      ? 'bg-rose-600 text-white'
                      : isVerifiedTrusted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-500 text-slate-950'
                  }`}
                >
                  {isFlaggedScam
                    ? 'REPORTED SCAMMER'
                    : isVerifiedTrusted
                    ? 'COMMUNITY VERIFIED'
                    : 'NEW / UNVERIFIED PAYEE'}
                </span>
              </div>

              {isFlaggedScam && (
                <p className="font-bold text-rose-900 mt-1">
                  ⚠️ WARNING: This recipient has been reported {radarMatch?.reportCount || 32} times across {radarMatch?.bankSources?.join(', ') || '3 banks'} for fraudulent extortion.
                </p>
              )}

              {isVerifiedTrusted && (
                <p className="font-semibold text-emerald-900 mt-1">
                  ✅ Verified safe payee. You and community members have completed {activePayee.verifiedTransactionsCount || 34} successful transfers without dispute.
                </p>
              )}

              {!isFlaggedScam && !isVerifiedTrusted && (
                <p className="font-semibold text-amber-900 mt-1">
                  ℹ️ New payee: You have not sent money here before. Extra safety checks and cooling periods may apply.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Amount Entry Section */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
          {isTamil ? 'அனுப்ப வேண்டிய தொகை (ரூபாய்):' : 'Transfer Amount (INR):'}
        </label>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400">
            ₹
          </span>
          <input
            id="send-amount-input"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full pl-11 pr-4 py-4 rounded-2xl border-2 border-slate-300 focus:border-amber-400 outline-none text-3xl font-black text-slate-900"
          />
        </div>

        {/* Quick Amount Chips */}
        <div className="flex flex-wrap gap-2">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              id={`quick-amt-${amt}`}
              onClick={() => setAmount(amt)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-colors ${
                amount === amt
                  ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              ₹{amt.toLocaleString('en-IN')}
              {amt === 200 && ' (Normal test)'}
              {amt === 50000 && ' (High-risk test)'}
            </button>
          ))}
        </div>
      </div>

      {/* Hackathon Demo Feature: Time-of-Day Simulator Toggle */}
      <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Moon className="w-5 h-5 text-indigo-700" />
          <div>
            <span className="text-xs font-extrabold text-indigo-950 uppercase tracking-wide block">
              Demo Rule Trigger: Time of Day
            </span>
            <p className="text-xs text-indigo-800">
              {isLateNightSimulated
                ? 'Simulating 11:45 PM (Triggers late-night coercion rule)'
                : 'Simulating Daytime (10:30 AM regular business hours)'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsLateNightSimulated(!isLateNightSimulated)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            isLateNightSimulated
              ? 'bg-indigo-900 text-white shadow-sm'
              : 'bg-white text-indigo-900 border border-indigo-300'
          }`}
        >
          {isLateNightSimulated ? '🌙 11:45 PM Active' : '☀️ Set to 11:45 PM'}
        </button>
      </div>

      {/* Main Transfer Button */}
      <div>
        <button
          id="send-money-proceed-btn"
          onClick={handleStartTransfer}
          className="w-full py-4 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-amber-400/20 transition-transform hover:scale-[1.01]"
        >
          <Send className="w-5 h-5 stroke-[2.5]" />
          <span>
            {isTamil ? `₹${amount.toLocaleString('en-IN')} பாதுகாப்பாக அனுப்பு` : `Verify & Send ₹${amount.toLocaleString('en-IN')}`}
          </span>
        </button>
        <p className="text-[11px] text-center text-slate-500 mt-2">
          {isTamil
            ? 'அனுப்பும் முன் AI Guardian அனைத்து மோசடி சமிக்ஞைகளையும் சோதிக்கும்'
            : 'AI Guardian will scan for coercion, community fraud, and unusual patterns before money moves.'}
        </p>
      </div>
    </div>
  );
};
