import React from 'react';
import { Send, Mail, ShieldAlert, Users, PhoneCall, ArrowUpRight, ArrowDownLeft, ShieldCheck, AlertTriangle, ChevronRight, Sparkles, HeartHandshake, Eye } from 'lucide-react';
import { Transaction, AppSettings, SMSMessage } from '../types';

interface HomeScreenProps {
  balance: number;
  transactions: Transaction[];
  messages: SMSMessage[];
  settings: AppSettings;
  onNavigate: (screen: string) => void;
  onSelectTransaction: (tx: Transaction) => void;
  onTriggerScamCall: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  balance,
  transactions,
  messages,
  settings,
  onNavigate,
  onSelectTransaction,
  onTriggerScamCall,
}) => {
  const isTamil = settings.language === 'ta';
  const isLarge = settings.textSize === 'large';
  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6 pb-20">
      {/* Friendly Senior Welcome & Balance Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-7 shadow-xl border border-slate-700">
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
          <div>
            <span className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-1.5">
              <span>{isTamil ? 'வணக்கம், சுந்தரம் ஐயா' : 'Welcome back, Mr. Sundaram'}</span>
              <span className="text-amber-400">👋</span>
            </span>
            <p className="text-[11px] text-slate-400">
              State Bank Account: <span className="font-mono text-slate-200 font-bold">•••• 4012</span>
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black shadow-inner">
            <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>{isTamil ? 'கவசம் செயலில் உள்ளது' : 'Shield Active'}</span>
          </div>
        </div>

        <div className="pt-4 pb-2">
          <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
            {isTamil ? 'சேமிப்பு கணக்கு இருப்பு' : 'Available Safe Balance'}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`${isLarge ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl'} font-black text-white tracking-tight`}>
              ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <span>🛡️ Protected by AI Guardian & Family Safety Network</span>
          </p>
        </div>

        {/* Primary Action Button: Send Money */}
        <div className="pt-4 mt-2 border-t border-slate-700/60 flex gap-3">
          <button
            id="home-send-money-btn"
            onClick={() => onNavigate('send')}
            className="flex-1 py-3.5 px-5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base sm:text-lg flex items-center justify-center gap-2.5 transition-transform hover:scale-[1.02] shadow-lg shadow-amber-400/20"
          >
            <Send className="w-5 h-5 stroke-[2.5]" />
            <span>{isTamil ? 'பணம் அனுப்பு (பாதுகாப்பானது)' : 'Send Money Safely'}</span>
          </button>
        </div>
      </div>

      {/* Quick Action Navigation Grid (Big, Accessible Touch Targets for Seniors) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className={`font-black text-slate-900 ${isLarge ? 'text-2xl' : 'text-xl'}`}>
            {isTamil ? 'பாதுகாப்பு சேவைகள்' : 'Safety Features & Services'}
          </h2>
          <span className="text-xs text-slate-500 font-semibold">Touch to open</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Messages Card */}
          <button
            id="home-nav-inbox-btn"
            onClick={() => onNavigate('inbox')}
            className="p-4 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-amber-400 text-left transition-all shadow-sm group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              {unreadMessagesCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-xs font-black">
                  {unreadMessagesCount} new
                </span>
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                {isTamil ? 'செய்திகள் (SMS)' : 'Inbox & SMS'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isTamil ? 'மோசடி ஆய்வு' : 'AI Scam Scanner'}
              </p>
            </div>
          </button>

          {/* Community Radar Card */}
          <button
            id="home-nav-radar-btn"
            onClick={() => onNavigate('radar')}
            className="p-4 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-amber-400 text-left transition-all shadow-sm group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                Live
              </span>
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                {isTamil ? 'மோசடி ரேடார்' : 'Community Radar'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isTamil ? 'மக்களின் புகார்கள்' : 'Crowdsourced Scams'}
              </p>
            </div>
          </button>

          {/* Trusted Family Contacts */}
          <button
            id="home-nav-contacts-btn"
            onClick={() => onNavigate('contacts')}
            className="p-4 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-amber-400 text-left transition-all shadow-sm group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                2 Active
              </span>
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                {isTamil ? 'குடும்ப கவசம்' : 'Family Shield'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isTamil ? 'நம்பகமான நபர்கள்' : 'Trusted Contacts'}
              </p>
            </div>
          </button>

          {/* Simulate Grandchild Scam Call Challenge */}
          <button
            id="home-simulate-call-card-btn"
            onClick={onTriggerScamCall}
            className="p-4 rounded-2xl bg-rose-50 hover:bg-rose-100/70 border-2 border-rose-300 text-left transition-all shadow-sm group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-11 h-11 rounded-xl bg-rose-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <PhoneCall className="w-6 h-6" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 text-[10px] font-bold">
                Feature 5
              </span>
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                {isTamil ? 'போலி அழைப்பு சோதனை' : 'Test Scam Call'}
              </h3>
              <p className="text-xs text-rose-800 font-semibold mt-0.5">
                {isTamil ? 'ரகசிய கேள்வி சோதனை' : 'Grandchild Challenge'}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Transactions List with Trust Status */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`font-black text-slate-900 ${isLarge ? 'text-2xl' : 'text-xl'}`}>
              {isTamil ? 'சமீபத்திய பரிவர்த்தனைகள்' : 'Recent Transactions'}
            </h3>
            <p className="text-xs text-slate-500">
              {isTamil ? 'ஒவ்வொரு பரிவர்த்தனையும் AI ஆல் சரிபார்க்கப்பட்டது' : 'Each transfer scanned for fraud & coercion'}
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {transactions.slice(0, 5).map((tx) => {
            const isBlocked = tx.status === 'blocked';
            const isSafe = tx.riskLevel === 'LOW';

            return (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction(tx)}
                className="py-3.5 flex items-center justify-between hover:bg-slate-50 rounded-xl px-2 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isBlocked
                        ? 'bg-rose-100 text-rose-600'
                        : isSafe
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-amber-100 text-amber-600'
                    }`}
                  >
                    {isBlocked ? (
                      <ShieldAlert className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      {tx.payeeName}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{tx.timestamp}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-400">{tx.payeeUpi}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`font-black text-sm sm:text-base ${
                      isBlocked ? 'text-rose-600 line-through' : 'text-slate-900'
                    }`}
                  >
                    ₹{tx.amount.toLocaleString('en-IN')}
                  </div>
                  <span
                    className={`inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      isBlocked
                        ? 'bg-rose-100 text-rose-800'
                        : isSafe
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isBlocked ? 'BLOCKED & SAFE' : 'VERIFIED SAFE'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
