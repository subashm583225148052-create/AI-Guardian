import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Info, ArrowRight, ShieldBan, Share2, X } from 'lucide-react';
import { RiskAnalysisResult, Language } from '../types';

interface RiskAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: RiskAnalysisResult;
  language: Language;
  onProceed?: () => void;
  proceedLabel?: string;
  onReportToRadar?: () => void;
  contextTitle?: string;
}

export const RiskAlertModal: React.FC<RiskAlertModalProps> = ({
  isOpen,
  onClose,
  result,
  language,
  onProceed,
  proceedLabel,
  onReportToRadar,
  contextTitle,
}) => {
  if (!isOpen) return null;

  const isTamil = language === 'ta';
  const isHigh = result.level === 'HIGH';
  const isMed = result.level === 'MEDIUM';

  const badgeTheme = isHigh
    ? {
        bg: 'bg-rose-50 border-rose-400',
        headerBg: 'bg-rose-600 text-white',
        icon: ShieldAlert,
        iconColor: 'text-rose-600',
        title: isTamil && result.titleTa ? result.titleTa : result.title,
        badgeText: isTamil ? 'ஆபத்து: அதிக எச்சரிக்கை' : 'HIGH RISK DETECTED',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      }
    : isMed
    ? {
        bg: 'bg-amber-50 border-amber-400',
        headerBg: 'bg-amber-600 text-white',
        icon: AlertTriangle,
        iconColor: 'text-amber-600',
        title: isTamil && result.titleTa ? result.titleTa : result.title,
        badgeText: isTamil ? 'கவனம்: நடுத்தர எச்சரிக்கை' : 'CAUTION ADVISED',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      }
    : {
        bg: 'bg-emerald-50 border-emerald-400',
        headerBg: 'bg-emerald-600 text-white',
        icon: CheckCircle2,
        iconColor: 'text-emerald-600',
        title: isTamil && result.titleTa ? result.titleTa : result.title,
        badgeText: isTamil ? 'பாதுகாப்பானது' : 'VERIFIED SAFE',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      };

  const IconComponent = badgeTheme.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div
        className={`w-full max-w-lg rounded-2xl border-2 shadow-2xl overflow-hidden bg-white ${badgeTheme.bg} my-auto transition-all animate-in fade-in zoom-in duration-200`}
        role="alertdialog"
        aria-modal="true"
      >
        {/* Banner Header */}
        <div className={`px-5 py-4 ${badgeTheme.headerBg} flex items-center justify-between`}>
          <div className="flex items-center gap-2.5">
            <IconComponent className="w-7 h-7 stroke-[2.5]" />
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider opacity-90 block">
                {badgeTheme.badgeText}
              </span>
              <h2 className="text-xl font-black leading-tight">
                {badgeTheme.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-black/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {/* Dialect / Regional Tag if present */}
          {result.dialectDetected && (
            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3 py-2 rounded-xl text-xs sm:text-sm text-indigo-900 font-semibold">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span>Regional Detection:</span>
              <span className="text-indigo-950 font-bold bg-indigo-100 px-2 py-0.5 rounded">
                {result.dialectDetected}
              </span>
            </div>
          )}

          {/* Context note (e.g. Message or Payee) */}
          {contextTitle && (
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {contextTitle}
            </div>
          )}

          {/* Large Plain-Language Explanation (Crucial accessible design) */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-slate-700" />
              {isTamil ? 'ஏன் இது ஆபத்தானது? (எளிய விளக்கம்)' : 'Why This Is Flagged (Plain English):'}
            </h3>
            <p className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
              {isTamil && result.explanationTa ? result.explanationTa : result.explanation}
            </p>
          </div>

          {/* Specific Fraud Signals Breakdown */}
          {result.signals && result.signals.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                {isTamil ? 'கண்டறியப்பட்ட காரணங்கள்:' : 'Key Signals Detected:'}
              </h4>
              <div className="space-y-1.5">
                {result.signals.map((sig, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/90 border border-slate-200 text-xs sm:text-sm"
                  >
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase mt-0.5 ${
                        sig.severity === 'high'
                          ? 'bg-rose-100 text-rose-800'
                          : sig.severity === 'med'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {sig.severity}
                    </span>
                    <div>
                      <strong className="text-slate-900 font-bold block">{sig.label}</strong>
                      <span className="text-slate-600 font-medium">{sig.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Advice Box */}
          <div
            className={`p-4 rounded-xl border ${
              isHigh
                ? 'bg-rose-100/70 border-rose-300 text-rose-950'
                : isMed
                ? 'bg-amber-100/70 border-amber-300 text-amber-950'
                : 'bg-emerald-100/70 border-emerald-300 text-emerald-950'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <ShieldBan className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <strong className="block text-sm font-black uppercase tracking-wide">
                  {isTamil ? 'நீங்கள் என்ன செய்ய வேண்டும்:' : 'Recommended Action:'}
                </strong>
                <p className="text-sm sm:text-base font-bold mt-0.5">
                  {isTamil && result.actionAdviceTa ? result.actionAdviceTa : result.actionAdvice}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            {onReportToRadar && isHigh && (
              <button
                id="risk-modal-report-btn"
                onClick={onReportToRadar}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>{isTamil ? 'மோசடி ரேடாரில் புகார் அளிக்கவும்' : 'Report to Community Radar'}</span>
              </button>
            )}

            {onProceed && (
              <button
                id="risk-modal-proceed-btn"
                onClick={onProceed}
                className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors shadow-md ${
                  isHigh
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : isMed
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <span>{proceedLabel || (isTamil ? 'பாதுகாப்பு படிநிலைக்கு செல்' : 'Continue with Safety Checks')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-sm transition-colors text-center"
            >
              {isTamil ? 'மூடு' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
