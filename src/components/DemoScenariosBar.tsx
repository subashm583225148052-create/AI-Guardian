import React from 'react';
import { PlayCircle, RefreshCw, CheckCircle2, AlertTriangle, ShieldAlert, PhoneCall, ArrowRight, X } from 'lucide-react';
import { Language } from '../types';

interface DemoScenariosBarProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onTriggerScenario: (scenarioId: number) => void;
  onResetDemo: () => void;
}

export const DemoScenariosBar: React.FC<DemoScenariosBarProps> = ({
  isOpen,
  onClose,
  language,
  onTriggerScenario,
  onResetDemo,
}) => {
  if (!isOpen) return null;

  const isTamil = language === 'ta';

  const scenarios = [
    {
      id: 1,
      badge: 'Scenario 1',
      title: 'Legitimate Bank SMS (Safe)',
      desc: 'Bill payment debit alert. Evaluates as SAFE, zero false alarm.',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
    },
    {
      id: 2,
      badge: 'Scenario 2',
      title: 'Scam SMS: KYC Expiry + OTP Urgency',
      desc: 'Urgent phishing link & OTP threat. Triggers HIGH risk with plain-language explanation.',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: ShieldAlert,
      iconColor: 'text-rose-600',
    },
    {
      id: 3,
      badge: 'Scenario 3',
      title: 'Safe ₹200 Transfer (Zero Friction)',
      desc: 'Sending ₹200 to frequent vegetable vendor Ramesh. Instant smooth completion.',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
    },
    {
      id: 4,
      badge: 'Scenario 4',
      title: 'Risky ₹50,000 Transfer at 11:45 PM',
      desc: '10× usual transfer to unknown payee at midnight. Triggers 60s Cooling-Off + Raja family approval.',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
    },
    {
      id: 5,
      badge: 'Scenario 5',
      title: 'Simulate Grandchild Scam Call',
      desc: 'Impersonator claims to be grandson. Uses Secret Family Question challenge to catch the scammer.',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: PhoneCall,
      iconColor: 'text-rose-600',
    },
    {
      id: 6,
      badge: 'Scenario 6',
      title: 'Transfer to Flagged Scam UPI',
      desc: 'Attempting transfer to UPI flagged across 3 banks. Triggers Community Trust Score alert.',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: ShieldAlert,
      iconColor: 'text-rose-600',
    },
    {
      id: 7,
      badge: 'Scenario 7',
      title: 'Tamil Dialect Phishing SMS',
      desc: 'Rural / colloquial Tamil scam message with dialect pattern recognition.',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      icon: ShieldAlert,
      iconColor: 'text-indigo-600',
    },
  ];

  return (
    <div className="bg-amber-50 border-b-2 border-amber-400 p-3 sm:p-4 shadow-md transition-all">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-200">
          <div className="flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-amber-700" />
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">
              {isTamil ? 'நீதிபதி மற்றும் டெமோ சோதனைக் குழு' : 'Hackathon Judge Demo Control Center'}
            </h2>
            <span className="text-xs bg-amber-200 text-amber-900 font-semibold px-2 py-0.5 rounded">
              1-Click Triggers
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onResetDemo}
              className="px-2.5 py-1 text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg flex items-center gap-1.5 shadow-sm"
              title="Reset all demo mock data"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>{isTamil ? 'மீட்டமை' : 'Reset Demo'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
              aria-label="Close demo panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-3">
          {isTamil
            ? 'கீழே உள்ள எந்த ஒரு சோதனையையும் நேரடியாக கிளிக் செய்து பார்க்கலாம். நீங்கள் எதையும் தட்டச்சு செய்ய வேண்டியதில்லை.'
            : 'Click any scenario below to instantly simulate the exact case in front of judges without manual typing:'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {scenarios.map((sc) => {
            const Icon = sc.icon;
            return (
              <button
                key={sc.id}
                id={`demo-scenario-btn-${sc.id}`}
                onClick={() => onTriggerScenario(sc.id)}
                className="text-left bg-white hover:bg-amber-100/50 p-2.5 rounded-xl border border-amber-200 shadow-sm transition-all hover:border-amber-400 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${sc.badgeColor}`}>
                      {sc.badge}
                    </span>
                    <Icon className={`w-4 h-4 ${sc.iconColor}`} />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-amber-900 line-clamp-1">
                    {sc.title}
                  </h3>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {sc.desc}
                  </p>
                </div>
                <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-end text-[11px] font-semibold text-amber-700 group-hover:text-amber-800">
                  <span>Run Scenario</span>
                  <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
