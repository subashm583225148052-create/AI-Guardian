import React from 'react';
import { ShieldCheck, ShieldAlert, Languages, Eye, Sliders, Building2, PhoneCall } from 'lucide-react';
import { AppSettings } from '../types';

interface HeaderProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onOpenAdmin: () => void;
  onOpenDemoBar: () => void;
  onSimulateCall: () => void;
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  onOpenAdmin,
  onOpenDemoBar,
  onSimulateCall,
  activeScreen,
  setActiveScreen,
}) => {
  const isTamil = settings.language === 'ta';

  return (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-30 border-b border-slate-800">
      {/* Top micro-bar for accessibility & demo controls */}
      <div className="bg-slate-950 px-3 py-1.5 border-b border-slate-800 flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 font-semibold border border-emerald-500/40">
            <ShieldCheck className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">24/7 AI Shield:</span>
            <span>{isTamil ? 'செயலில் உள்ளது' : 'ACTIVE'}</span>
          </span>
          <span className="text-slate-400 text-xs hidden md:inline">
            {isTamil ? 'முதியோர் மற்றும் குடும்ப பாதுகாப்பு அடுக்கு' : 'Senior Banking Protection Layer'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Demo scenarios launcher */}
          <button
            id="header-demo-scenarios-btn"
            onClick={onOpenDemoBar}
            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs flex items-center gap-1 transition-colors shadow-sm"
            title="Open Demo Scenarios for Judges"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isTamil ? 'டெமோ தேர்வுகள்' : 'Demo Cases (1–6)'}</span>
          </button>

          {/* Simulate Scam Call button */}
          <button
            id="header-simulate-call-btn"
            onClick={onSimulateCall}
            className="px-2 py-1 bg-rose-700 hover:bg-rose-600 text-white font-medium rounded text-xs flex items-center gap-1 transition-colors"
            title="Simulate Grandchild Scam Call"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isTamil ? 'போலி அழைப்பு' : 'Test Scam Call'}</span>
          </button>

          {/* Language Switcher */}
          <button
            id="header-lang-toggle-btn"
            onClick={() => onUpdateSettings({ language: isTamil ? 'en' : 'ta' })}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold rounded text-xs flex items-center gap-1 transition-colors border border-slate-700"
            aria-label="Toggle language"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{isTamil ? 'English' : 'தமிழ்'}</span>
          </button>

          {/* Accessibility Font Size Toggle */}
          <button
            id="header-textsize-toggle-btn"
            onClick={() => onUpdateSettings({ textSize: settings.textSize === 'large' ? 'normal' : 'large' })}
            className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
              settings.textSize === 'large'
                ? 'bg-amber-400 text-slate-950'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title="Toggle Larger Text for Seniors"
          >
            <span className="font-extrabold text-sm leading-none">A+</span>
            <span className="hidden sm:inline">{settings.textSize === 'large' ? 'Extra Big' : 'Text'}</span>
          </button>

          {/* High Contrast Toggle */}
          <button
            id="header-contrast-toggle-btn"
            onClick={() => onUpdateSettings({ highContrast: !settings.highContrast })}
            className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
              settings.highContrast
                ? 'bg-yellow-300 text-black border border-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="High Contrast Mode for Low Vision"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{settings.highContrast ? 'Hi-Contrast ON' : 'Contrast'}</span>
          </button>

          {/* Hidden Admin/Bank View */}
          <button
            id="header-admin-view-btn"
            onClick={onOpenAdmin}
            className="px-2 py-1 bg-indigo-900/80 hover:bg-indigo-800 text-indigo-200 rounded text-xs flex items-center gap-1 border border-indigo-700/60"
            title="Bank Security Team View (Duress SOS logs)"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Bank Security Desk</span>
          </button>
        </div>
      </div>

      {/* Main app bar */}
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setActiveScreen('home')}
          className="flex items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-lg p-1"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white leading-tight">
                AI Guardian
              </h1>
              <span className="text-[11px] uppercase tracking-wider bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                Safe Bank
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {isTamil ? 'உங்கள் குடும்பத்தின் நிதிப் பாதுகாப்பு கவசம்' : 'Senior Fraud Defense System'}
            </p>
          </div>
        </button>

        {/* Quick Family Contact Badge */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-slate-300 font-medium">
              {isTamil ? 'பாதுகாப்பு தொடர்பு:' : 'Family Contact:'}{' '}
              <strong className="text-white">Raja (Son)</strong>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
