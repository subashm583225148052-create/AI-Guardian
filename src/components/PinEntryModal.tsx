import React, { useState } from 'react';
import { Lock, Delete, CheckCircle2, ShieldAlert, ArrowLeft, X, Eye, EyeOff } from 'lucide-react';
import { AppSettings, Language } from '../types';

interface PinEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  payeeName: string;
  payeeUpi: string;
  settings: AppSettings;
  onSuccess: (isDuress: boolean) => void;
}

export const PinEntryModal: React.FC<PinEntryModalProps> = ({
  isOpen,
  onClose,
  amount,
  payeeName,
  payeeUpi,
  settings,
  onSuccess,
}) => {
  const [enteredPin, setEnteredPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    if (enteredPin.length < 4) {
      const nextPin = enteredPin + digit;
      setEnteredPin(nextPin);
      setErrorMessage('');

      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    setEnteredPin((prev) => prev.slice(0, -1));
    setErrorMessage('');
  };

  const handleClear = () => {
    setEnteredPin('');
    setErrorMessage('');
  };

  const verifyPin = (pin: string) => {
    if (pin === settings.duressPin) {
      // DURESS PIN entered!
      // Trigger silent SOS internally, but show successful UI to user!
      onSuccess(true);
    } else if (pin === settings.normalPin) {
      // Normal PIN entered
      onSuccess(false);
    } else {
      setErrorMessage('Incorrect PIN. Please try again.');
      setTimeout(() => {
        setEnteredPin('');
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-sm rounded-3xl bg-white border border-slate-300 shadow-2xl overflow-hidden my-auto p-5 sm:p-6 text-center space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Enter UPI Security PIN</span>
          </div>
          <div className="w-6"></div>
        </div>

        {/* Transfer preview */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
          <p className="text-xs text-slate-500">Paying to</p>
          <p className="text-base font-extrabold text-slate-900 truncate">{payeeName}</p>
          <p className="text-2xl font-black text-slate-950 mt-1">
            ₹{amount.toLocaleString('en-IN')}
          </p>
        </div>

        {/* PIN Dots display */}
        <div className="py-2">
          <div className="flex justify-center gap-4 my-2">
            {[0, 1, 2, 3].map((idx) => {
              const hasChar = idx < enteredPin.length;
              return (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    hasChar
                      ? 'bg-slate-900 border-slate-900 scale-110'
                      : 'border-slate-300 bg-slate-100'
                  }`}
                >
                  {showPin && hasChar && (
                    <span className="text-[10px] text-white flex items-center justify-center h-full">
                      {enteredPin[idx]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setShowPin(!showPin)}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 mx-auto mt-1"
          >
            {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showPin ? 'Hide digits' : 'Show digits'}</span>
          </button>

          {errorMessage && (
            <p className="text-xs font-bold text-rose-600 mt-2 animate-bounce">
              {errorMessage}
            </p>
          )}
        </div>

        {/* Big accessible touch keypad for seniors */}
        <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              id={`keypad-digit-${digit}`}
              onClick={() => handleDigit(digit)}
              className="h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-900 font-bold text-xl transition-colors shadow-sm flex items-center justify-center"
            >
              {digit}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold text-xs transition-colors flex items-center justify-center uppercase"
          >
            Clear
          </button>
          <button
            id="keypad-digit-0"
            onClick={() => handleDigit('0')}
            className="h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-900 font-bold text-xl transition-colors shadow-sm flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold transition-colors flex items-center justify-center"
            aria-label="Delete last digit"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Helper Box for Feature 6 testing */}
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-2.5 text-left text-xs">
          <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
            <span>Feature 6 Demo Guidance:</span>
          </div>
          <div className="text-[11px] text-amber-800 space-y-0.5">
            <p>
              • <strong>Normal PIN:</strong> <span className="font-mono font-bold bg-amber-200/80 px-1 rounded">{settings.normalPin}</span> (Regular transfer)
            </p>
            <p>
              • <strong>Silent Duress PIN:</strong> <span className="font-mono font-bold bg-amber-200/80 px-1 rounded">{settings.duressPin}</span> (If forced by scammer: screen shows 'Success' to fool them, but alerts bank & police!)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
