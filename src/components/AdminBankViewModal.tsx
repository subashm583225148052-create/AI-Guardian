import React from 'react';
import { Building2, ShieldAlert, Radio, AlertOctagon, MapPin, Database, CheckCircle, X, RefreshCw } from 'lucide-react';
import { DuressAlertLog, CommunityRadarItem } from '../types';

interface AdminBankViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  duressLogs: DuressAlertLog[];
  communityRadar: CommunityRadarItem[];
}

export const AdminBankViewModal: React.FC<AdminBankViewModalProps> = ({
  isOpen,
  onClose,
  duressLogs,
  communityRadar,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-2xl bg-slate-950 border border-indigo-500/50 text-slate-100 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 p-4 sm:p-5 border-b border-indigo-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500 flex items-center justify-center text-indigo-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] uppercase font-black px-2 py-0.5 rounded">
                  Internal Telemetry View
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Live Bank Cyber Cell Desk
                </span>
              </div>
              <h2 className="text-lg font-black text-white">
                Bank Security & Duress SOS Monitoring Center
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* Duress SOS Section (Feature 6 demonstration) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-500" />
                <h3 className="font-extrabold text-white text-base">
                  Feature 6: Silent SOS Duress Logs (Real-Time Ingress)
                </h3>
              </div>
              <span className="text-xs bg-rose-950 text-rose-400 border border-rose-800 px-2 py-0.5 rounded font-mono">
                {duressLogs.length} Active Distress Intercepts
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              When a victim is coerced by physical criminals and enters their secret Duress PIN (<span className="text-amber-300 font-mono font-bold">9999</span>), the customer's phone displays a standard success screen to keep them unharmed. Behind the scenes, the bank system immediately generates these rapid response actions:
            </p>

            <div className="space-y-3">
              {duressLogs.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-900/60 rounded-xl border border-slate-800">
                  No silent duress alerts triggered yet. Test it by sending money and typing PIN "9999"!
                </div>
              ) : (
                duressLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-xl bg-slate-900 border-l-4 border-rose-500 border-t border-r border-b border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 font-mono text-rose-400 font-bold">
                        <Radio className="w-4 h-4 animate-pulse" />
                        <span>ALERT: {log.id}</span>
                        <span className="text-slate-500">•</span>
                        <span>{log.timestamp}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-black">
                        {log.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 font-mono pt-1">
                      <div>
                        Amount Intercepted:{' '}
                        <strong className="text-white">
                          ₹{log.amount.toLocaleString('en-IN')}
                        </strong>
                      </div>
                      <div>
                        Destination:{' '}
                        <strong className="text-amber-300 truncate">
                          {log.payeeName} ({log.payeeUpi})
                        </strong>
                      </div>
                      <div className="flex items-center gap-1 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>{log.location}</span>
                      </div>
                      <div>
                        PIN Used:{' '}
                        <span className="text-rose-400 font-bold">
                          {log.duressPinEntered} (Silent SOS Code)
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed font-sans text-xs">
                      <strong>Security Countermeasure:</strong> {log.actionTaken}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Cross-Bank Intelligence Sharing (Feature 7) */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-5 h-5 text-indigo-400" />
              <h3 className="font-extrabold text-white text-base">
                Feature 7: Scam Pattern DNA (Cross-Bank Sharing Network)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Demonstrates the RBI-level shared fraud intelligence protocol where accounts flagged by one participating institution (Bank A) are instantly synchronized across all others (Bank B, Bank C):
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {communityRadar.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-300 truncate">
                      {item.identifier}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        item.type === 'scam'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}
                    >
                      {item.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-300 font-medium text-[11px]">{item.scamCategory}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.bankSources.map((bank, bIdx) => (
                      <span
                        key={bIdx}
                        className="bg-indigo-950 text-indigo-300 border border-indigo-800 px-1.5 py-0.5 rounded text-[10px] font-semibold"
                      >
                        {bank}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
          >
            Close Telemetry Desk
          </button>
        </div>
      </div>
    </div>
  );
};
