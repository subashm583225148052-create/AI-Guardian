import React, { useState } from 'react';
import { ArrowLeft, Lock, HelpCircle, Languages, Eye, ShieldAlert, CheckCircle2, Save } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsScreenProps {
  settings: AppSettings;
  onBack: () => void;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onBack,
  onUpdateSettings,
}) => {
  const [normalPin, setNormalPin] = useState(settings.normalPin);
  const [duressPin, setDuressPin] = useState(settings.duressPin);
  const [question, setQuestion] = useState(settings.secretFamilyQuestion);
  const [answer, setAnswer] = useState(settings.secretFamilyAnswer);
  const [saveToast, setSaveToast] = useState(false);

  const isTamil = settings.language === 'ta';
  const isLarge = settings.textSize === 'large';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      normalPin,
      duressPin,
      secretFamilyQuestion: question,
      secretFamilyAnswer: answer,
    });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
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
              {isTamil ? 'அமைப்புகள் & பாதுகாப்பு' : 'Settings & Safety Preferences'}
            </h2>
            <p className="text-xs text-slate-500">
              {isTamil ? 'ரகசிய குறியீடுகள் மற்றும் அணுகல் விருப்பங்கள்' : 'Duress codes, secret challenges & accessibility'}
            </p>
          </div>
        </div>
      </div>

      {saveToast && (
        <div className="p-3 bg-emerald-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg animate-in fade-in text-sm">
          <CheckCircle2 className="w-5 h-5" />
          <span>Preferences saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        {/* Feature 6: Silent SOS Duress PIN configuration */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-base border-b border-slate-100 pb-2">
            <Lock className="w-5 h-5 text-amber-600" />
            <span>Feature 6: PIN Codes (Normal vs Silent SOS)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Normal Daily PIN (4-Digits):
              </label>
              <input
                type="password"
                maxLength={4}
                value={normalPin}
                onChange={(e) => setNormalPin(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 font-mono text-xl tracking-widest text-center focus:ring-2 focus:ring-amber-400 outline-none"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Standard PIN for normal daily transfers.
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-rose-700 block mb-1">
                Silent SOS Duress PIN:
              </label>
              <input
                type="password"
                maxLength={4}
                value={duressPin}
                onChange={(e) => setDuressPin(e.target.value)}
                className="w-full p-3 rounded-xl border-2 border-rose-300 font-mono text-xl tracking-widest text-center text-rose-900 focus:ring-2 focus:ring-rose-400 outline-none"
              />
              <span className="text-[11px] text-rose-700 font-medium mt-1 block">
                Enter if someone is forcing you. App pretends transfer succeeded, but triggers silent police alert.
              </span>
            </div>
          </div>
        </div>

        {/* Feature 5: Secret Family Question Setup */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-base border-b border-slate-100 pb-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <span>Feature 5: Grandchild Verification Challenge</span>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Secret Family Question (Only real family knows):
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. What did we do on your last birthday?"
              className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Secret Correct Answer:
            </label>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="e.g. Mango kulfi at Marina beach with little Aarav"
              className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              When an urgent call claims to be family, AI Guardian will ask this challenge to defeat voice clones.
            </span>
          </div>
        </div>

        {/* Accessibility & Language Section */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-base border-b border-slate-100 pb-2">
            <Languages className="w-5 h-5 text-emerald-600" />
            <span>Language & Accessibility</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Display Language:
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ language: 'en' })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border ${
                    settings.language === 'en'
                      ? 'bg-amber-400 text-slate-950 border-amber-500'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ language: 'ta' })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border ${
                    settings.language === 'ta'
                      ? 'bg-amber-400 text-slate-950 border-amber-500'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  தமிழ் (Tamil)
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Text Readability Size:
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ textSize: 'normal' })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border ${
                    settings.textSize === 'normal'
                      ? 'bg-amber-400 text-slate-950 border-amber-500'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Standard
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ textSize: 'large' })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border ${
                    settings.textSize === 'large'
                      ? 'bg-amber-400 text-slate-950 border-amber-500'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Large (A+)
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 transition-transform hover:scale-[1.01]"
        >
          <Save className="w-5 h-5 text-amber-400" />
          <span>Save All Security Settings</span>
        </button>
      </form>
    </div>
  );
};
