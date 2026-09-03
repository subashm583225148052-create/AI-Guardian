import React from 'react';
import { CheckCircle2, ShieldCheck, Radio, ArrowRight, Share2, AlertOctagon } from 'lucide-react';
import { Language } from '../types';

interface TransactionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  payeeName: string;
  payeeUpi: string;
  isDuress: boolean;
  language: Language;
  onOpenAdmin: () => void;
}

export const TransactionSuccessModal: React.FC<TransactionSuccessModalProps> = ({
  isOpen,
  onClose,
  amount,
  payeeName,
  payeeUpi,
  isDuress,
  language,
  onOpenAdmin,
}) => {
  if (!isOpen) return null;

  const isTamil = language === 'ta';
  const txnId = `UPI-${Math.floor(100000000000 + Math.random() * 900000000000)}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden my-auto p-6 text-center space-y-4 animate-in zoom-in-95">
        {/* Animated Green Checkmark */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
        </div>

        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {isTamil ? 'பரிவர்த்தனை வெற்றி' : 'Transaction Successful'}
          </span>
          <h2 className="text-3xl font-black text-slate-900 mt-2">
            ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h2>
          <p className="text-sm text-slate-600 font-semibold mt-1">
            Transferred to <strong className="text-slate-900">{payeeName}</strong>
          </p>
          <p className="text-xs font-mono text-slate-400">{payeeUpi}</p>
        </div>

        {/* Transaction Details Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-left space-y-1.5 font-mono text-slate-600">
          <div className="flex justify-between">
            <span>UPI Reference ID:</span>
            <span className="font-bold text-slate-900">{txnId}</span>
          </div>
          <div className="flex justify-between">
            <span>Debited from:</span>
            <span className="font-bold text-slate-900">SBI A/C •••• 4012</span>
          </div>
          <div className="flex justify-between">
            <span>Security Status:</span>
            <span className="font-bold text-emerald-700">Protected by AI Guardian</span>
          </div>
        </div>

        {/* Feature 6 Demonstration Banner (Visible for Judge / Demo Audience) */}
        {isDuress && (
          <div className="bg-rose-950 text-rose-200 border-2 border-rose-500 rounded-2xl p-4 text-left space-y-2 shadow-lg animate-pulse">
            <div className="flex items-center gap-2 text-rose-400 font-extrabold text-xs uppercase tracking-wide">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <span>Feature 6 Active: Silent SOS Triggered</span>
            </div>
            <p className="text-xs text-rose-100 leading-relaxed font-medium">
              Because you entered the secret <strong>Duress PIN (9999)</strong>, the perpetrator standing next to you sees this normal "Successful" screen. Behind the scenes, the funds are held in shadow escrow and high-priority police dispatch has been logged.
            </p>
            <button
              onClick={onOpenAdmin}
              className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Inspect Bank Security SOS Log</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm transition-colors shadow-md"
        >
          {isTamil ? 'முடிந்தது / முகப்பு பக்கத்திற்கு செல்' : 'Done & Return to Dashboard'}
        </button>
      </div>
    </div>
  );
};
