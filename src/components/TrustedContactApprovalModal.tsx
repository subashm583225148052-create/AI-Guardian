import React, { useState } from 'react';
import { Users, BellRing, CheckCircle, XCircle, ShieldAlert, Smartphone, Clock, ArrowRight } from 'lucide-react';
import { TrustedContact, Language } from '../types';

interface TrustedContactApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  trustedContact: TrustedContact;
  amount: number;
  payeeName: string;
  payeeUpi: string;
  language: Language;
  onApprove: () => void;
  onDecline: () => void;
}

export const TrustedContactApprovalModal: React.FC<TrustedContactApprovalModalProps> = ({
  isOpen,
  onClose,
  trustedContact,
  amount,
  payeeName,
  payeeUpi,
  language,
  onApprove,
  onDecline,
}) => {
  const [simulatedStatus, setSimulatedStatus] = useState<'waiting' | 'approved' | 'declined'>('waiting');

  if (!isOpen) return null;

  const isTamil = language === 'ta';

  const handleSimulateApprove = () => {
    setSimulatedStatus('approved');
    setTimeout(() => {
      onApprove();
    }, 1200);
  };

  const handleSimulateDecline = () => {
    setSimulatedStatus('declined');
    setTimeout(() => {
      onDecline();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-white border-2 border-indigo-400 shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        {/* Banner Header */}
        <div className="bg-indigo-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/30 border border-indigo-400 flex items-center justify-center text-indigo-300">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500 text-slate-950 px-2 py-0.5 rounded-full">
                {isTamil ? 'குடும்ப பாதுகாப்பு வளையம்' : 'Family Safety Loop'}
              </span>
              <h2 className="text-lg sm:text-xl font-bold">
                {isTamil ? 'குடும்ப உறுப்பினர் ஒப்புதல் தேவை' : 'Trusted Family Approval Required'}
              </h2>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {/* Simulated SMS Notification Phone Banner */}
          <div className="bg-slate-900 text-white rounded-xl p-3.5 shadow-md border border-slate-700">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <BellRing className="w-3.5 h-3.5 animate-bounce" />
                <span>Simulated Push Alert to {trustedContact.name} ({trustedContact.relationship})</span>
              </div>
              <span>Just Now</span>
            </div>
            <div className="bg-slate-800 rounded-lg p-2.5 text-xs sm:text-sm text-slate-200 font-mono leading-relaxed border border-slate-700">
              "🚨 <strong className="text-white">AI Guardian Alert:</strong> Your family member is attempting an unusual transfer of <span className="text-amber-400 font-bold">₹{amount.toLocaleString('en-IN')}</span> to <span className="text-amber-300">{payeeName}</span> ({payeeUpi}). Due to high fraud indicators, your approval is required to unlock."
            </div>
          </div>

          {/* Current Status Box */}
          {simulatedStatus === 'waiting' && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-center space-y-2">
              <div className="inline-flex p-3 rounded-full bg-amber-100 text-amber-700 animate-pulse">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-amber-950">
                {isTamil
                  ? `${trustedContact.name} ஒப்புதலுக்காக காத்திருக்கிறது...`
                  : `Waiting for ${trustedContact.name} to approve this transaction...`}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {isTamil
                  ? 'உங்கள் குடும்ப உறுப்பினர் சரிபார்த்து உறுதி செய்யும் வரை இந்த பரிவர்த்தனை நிறுத்தி வைக்கப்படும்.'
                  : 'For your protection, money will not leave your account until your trusted contact confirms this is legitimate.'}
              </p>
            </div>
          )}

          {simulatedStatus === 'approved' && (
            <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-4 text-center space-y-2 animate-in fade-in">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-black text-emerald-950">
                {trustedContact.name} Approved the Transaction!
              </h3>
              <p className="text-xs text-emerald-800 font-medium">
                Proceeding to secure PIN verification...
              </p>
            </div>
          )}

          {simulatedStatus === 'declined' && (
            <div className="bg-rose-50 border-2 border-rose-500 rounded-xl p-4 text-center space-y-2 animate-in fade-in">
              <XCircle className="w-10 h-10 text-rose-600 mx-auto" />
              <h3 className="text-lg font-black text-rose-950">
                {trustedContact.name} Declined This Transfer!
              </h3>
              <p className="text-xs text-rose-800 font-bold">
                Transaction Cancelled. No money was deducted. Your account is completely safe.
              </p>
            </div>
          )}

          {/* Hackathon Demo Simulation Buttons */}
          <div className="pt-2 border-t border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
              Judges & Demo Simulation Controls:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                id="trusted-simulate-approve-btn"
                onClick={handleSimulateApprove}
                disabled={simulatedStatus !== 'waiting'}
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Simulate Approval by {trustedContact.name.split(' ')[0]}</span>
              </button>

              <button
                id="trusted-simulate-decline-btn"
                onClick={handleSimulateDecline}
                disabled={simulatedStatus !== 'waiting'}
                className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Simulate Decline by {trustedContact.name.split(' ')[0]}</span>
              </button>
            </div>
          </div>

          <div className="text-center pt-1">
            <button
              onClick={onClose}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold underline"
            >
              {isTamil ? 'ரத்து செய்து பின்செல்லவும்' : 'Cancel & Go Back'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
