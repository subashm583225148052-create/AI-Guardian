import React, { useState, useEffect } from 'react';
import { Clock, ShieldCheck, AlertCircle, HeartHandshake, ArrowRight, X, FastForward, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface CoolingCompanionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmProceed: () => void;
  onCancelTransfer: () => void;
  amount: number;
  payeeName: string;
  payeeUpi: string;
  language: Language;
}

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
}

export const CoolingCompanionModal: React.FC<CoolingCompanionModalProps> = ({
  isOpen,
  onClose,
  onConfirmProceed,
  onCancelTransfer,
  amount,
  payeeName,
  payeeUpi,
  language,
}) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<{ reason?: string; urgentCall?: string; knowPerson?: string }>({});
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: `Hello! I noticed you are transferring a large amount of ₹${amount.toLocaleString(
        'en-IN'
      )} to ${payeeName}. Scammers often create rush situations to trick honest people. Let's take a calm 60-second pause together. Why are you making this transfer?`,
    },
  ]);

  const isTamil = language === 'ta';

  // Timer countdown
  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(60);
      setStep(1);
      setAnswers({});
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectReason = (reasonText: string, isSuspicious: boolean) => {
    setAnswers((prev) => ({ ...prev, reason: reasonText }));
    setChatHistory((prev) => [
      ...prev,
      { sender: 'user', text: reasonText },
      {
        sender: 'ai',
        text: isSuspicious
          ? `Thank you for sharing. Please remember: real bank managers or electricity officers NEVER instruct you to transfer money to personal UPI accounts. Did someone call or message you asking you to do this urgently?`
          : `Understood. Quick follow-up: Did someone call or message you asking you to do this transfer urgently today?`,
      },
    ]);
    setStep(2);
  };

  const handleSelectUrgent = (urgentText: string, isUrgent: boolean) => {
    setAnswers((prev) => ({ ...prev, urgentCall: urgentText }));
    setChatHistory((prev) => [
      ...prev,
      { sender: 'user', text: urgentText },
      {
        sender: 'ai',
        text: isUrgent
          ? `That is a massive red flag. Scammers deliberately create panic ("Account blocked! Power cut!") so you don't have time to consult your family. Lastly: Do you know this person or account personally in real life?`
          : `Good to know there is no outside rush. One last question: Do you personally know this person or business in real life?`,
      },
    ]);
    setStep(3);
  };

  const handleSelectKnowPerson = (knowText: string, knowsPerson: boolean) => {
    setAnswers((prev) => ({ ...prev, knowPerson: knowText }));
    const detectedHighFraud = !knowsPerson || answers.reason?.includes('bank manager') || answers.urgentCall?.includes('Yes');

    setChatHistory((prev) => [
      ...prev,
      { sender: 'user', text: knowText },
      {
        sender: 'ai',
        text: detectedHighFraud
          ? `🚨 IMPORTANT ADVICE: All signs point to an impersonation scam. Please DO NOT transfer this money. We will alert your trusted contact Raja Sundaram (Son) to review this together.`
          : `✅ Thank you for taking this calm breath with me. Once the cooling timer finishes, your trusted contact will receive a quick verification request before final completion.`,
      },
    ]);
    setStep(4);
  };

  const isTimerDone = timeLeft === 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-2xl bg-white border-2 border-amber-300 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header with 60-Second Cooling Timer */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-inner">
              <Clock className="w-7 h-7 stroke-[2.5] animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-950 text-[10px] uppercase font-black px-2 py-0.5 rounded-full">
                  {isTamil ? 'அமைதி பாதுகாப்பு நேரம்' : 'Protective Cooling-Off Period'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black">
                {isTamil ? '60-வினாடி பாதுகாப்பு இடைவேளை' : 'Cooling-Off Companion'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Speedup button for demo judges */}
            {timeLeft > 5 && (
              <button
                onClick={() => setTimeLeft(5)}
                className="px-2 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold flex items-center gap-1 border border-white/30"
                title="Speed up for hackathon demo"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Demo: 5s</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-lg"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Timer Bar */}
        <div className="bg-amber-100 px-4 py-2.5 border-b border-amber-200 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-amber-950 font-bold">
            <Clock className="w-4 h-4 text-amber-700" />
            <span>
              {isTimerDone
                ? isTamil
                  ? 'பாதுகாப்பு நேரம் முடிந்தது'
                  : 'Cooling-off complete. Next safety step unlocked.'
                : isTamil
                ? `பொத்தானை இயக்க இன்னும் ${timeLeft} வினாடிகள் உள்ளன...`
                : `Transfer buttons unlock in ${timeLeft}s...`}
            </span>
          </div>
          <span
            className={`font-mono font-black text-base px-2.5 py-0.5 rounded-md ${
              isTimerDone ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
            }`}
          >
            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </span>
        </div>

        {/* Transfer context reminder */}
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 text-xs text-slate-600 flex justify-between items-center">
          <span>
            Recipient: <strong className="text-slate-900">{payeeName}</strong> ({payeeUpi})
          </span>
          <span>
            Amount:{' '}
            <strong className="text-slate-950 font-bold text-sm">
              ₹{amount.toLocaleString('en-IN')}
            </strong>
          </span>
        </div>

        {/* Chat / Companion Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 bg-slate-50/50">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider pb-1">
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
            <span>AI Guardian Companion (Calm, friendly check-in)</span>
          </div>

          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'ai'
                    ? 'bg-white border border-slate-200 text-slate-900 rounded-tl-sm'
                    : 'bg-amber-500 text-slate-950 font-semibold rounded-tr-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Interactive Pre-Scripted Response Options */}
          {step === 1 && (
            <div className="pt-2 space-y-2">
              <p className="text-xs font-bold text-slate-600 uppercase">
                Tap your reason:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    handleSelectReason('A bank officer / manager called and told me to transfer', true)
                  }
                  className="p-2.5 text-left text-xs sm:text-sm font-semibold rounded-xl bg-white hover:bg-rose-50 border border-slate-300 hover:border-rose-400 text-slate-900 transition-colors shadow-sm"
                >
                  ⚠️ Bank officer told me to transfer urgently
                </button>
                <button
                  onClick={() =>
                    handleSelectReason('Paying an overdue electricity or KYC bill from SMS', true)
                  }
                  className="p-2.5 text-left text-xs sm:text-sm font-semibold rounded-xl bg-white hover:bg-rose-50 border border-slate-300 hover:border-rose-400 text-slate-900 transition-colors shadow-sm"
                >
                  ⚠️ Paying electricity/KYC disconnect notice
                </button>
                <button
                  onClick={() =>
                    handleSelectReason('Sending help to a known friend or family member', false)
                  }
                  className="p-2.5 text-left text-xs sm:text-sm font-semibold rounded-xl bg-white hover:bg-emerald-50 border border-slate-300 hover:border-emerald-400 text-slate-900 transition-colors shadow-sm"
                >
                  🤝 Sending to friend or family member
                </button>
                <button
                  onClick={() =>
                    handleSelectReason('Lottery prize fee or quick high-return investment', true)
                  }
                  className="p-2.5 text-left text-xs sm:text-sm font-semibold rounded-xl bg-white hover:bg-rose-50 border border-slate-300 hover:border-rose-400 text-slate-900 transition-colors shadow-sm"
                >
                  ⚠️ Investment scheme / lottery processing fee
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="pt-2 space-y-2">
              <p className="text-xs font-bold text-slate-600 uppercase">
                Did someone rush you?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    handleSelectUrgent('Yes, they insisted I do it within minutes or face consequences', true)
                  }
                  className="p-2.5 text-left text-xs sm:text-sm font-semibold rounded-xl bg-white hover:bg-rose-50 border border-slate-300 hover:border-rose-400 text-slate-900 transition-colors shadow-sm"
                >
                  🚨 Yes, they demanded immediate action!
                </button>
                <button
                  onClick={() =>
                    handleSelectUrgent('No, this is my own calm, planned transfer', false)
                  }
                  className="p-2.5 text-left text-xs sm:text-sm font-semibold rounded-xl bg-white hover:bg-emerald-50 border border-slate-300 hover:border-emerald-400 text-slate-900 transition-colors shadow-sm"
                >
                  🌿 No, this is my own planned decision
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="pt-2 space-y-2">
              <p className="text-xs font-bold text-slate-600 uppercase">
                Do you know this payee?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    handleSelectKnowPerson('No, I have never met or spoken to this person in person', false)
                  }
                  className="p-2.5 text-left text-xs sm:text-sm font-semibold rounded-xl bg-white hover:bg-rose-50 border border-slate-300 hover:border-rose-400 text-slate-900 transition-colors shadow-sm"
                >
                  ❌ No, never met them before
                </button>
                <button
                  onClick={() =>
                    handleSelectKnowPerson('Yes, I personally know them well', true)
                  }
                  className="p-2.5 text-left text-xs sm:text-sm font-semibold rounded-xl bg-white hover:bg-emerald-50 border border-slate-300 hover:border-emerald-400 text-slate-900 transition-colors shadow-sm"
                >
                  ✅ Yes, I know them personally
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-200 space-y-2.5">
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              id="cooling-cancel-btn"
              onClick={onCancelTransfer}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>{isTamil ? 'பரிவர்த்தனையை ரத்து செய் (பணம் பாதுகாப்பு)' : 'Cancel & Keep My Money Safe'}</span>
            </button>

            <button
              id="cooling-proceed-btn"
              onClick={onConfirmProceed}
              disabled={!isTimerDone}
              className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-md ${
                isTimerDone
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              }`}
            >
              <span>
                {isTimerDone
                  ? isTamil
                    ? 'குடும்ப ஒப்புதலுக்கு செல்'
                    : 'Proceed to Trusted Contact Approval'
                  : isTamil
                  ? `காத்திருக்கவும் (${timeLeft}s)`
                  : `Please wait (${timeLeft}s)`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-center text-slate-500">
            {isTamil
              ? 'உங்கள் வங்கிக் கணக்கை பாதுகாக்க 60 வினாடி அமைதி நேரம் கட்டாயமாக்கப்பட்டுள்ளது.'
              : 'Cooling-off pauses prevent hurried decisions caused by emotional social engineering.'}
          </p>
        </div>
      </div>
    </div>
  );
};
