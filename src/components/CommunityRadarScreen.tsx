import React, { useState } from 'react';
import { ShieldAlert, ArrowLeft, Search, PlusCircle, Building2, Share2, CheckCircle2, AlertTriangle, Info, MapPin } from 'lucide-react';
import { CommunityRadarItem, AppSettings } from '../types';

interface CommunityRadarScreenProps {
  radarItems: CommunityRadarItem[];
  settings: AppSettings;
  onBack: () => void;
  onAddNewReport: (item: Omit<CommunityRadarItem, 'id'>) => void;
}

export const CommunityRadarScreen: React.FC<CommunityRadarScreenProps> = ({
  radarItems,
  settings,
  onBack,
  onAddNewReport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showReportForm, setShowReportForm] = useState(false);
  const [newIdentifier, setNewIdentifier] = useState('');
  const [newCategory, setNewCategory] = useState('Fake Bank KYC Call');
  const [newNotes, setNewNotes] = useState('');
  const [selectedBankSource, setSelectedBankSource] = useState('SBI');

  const isTamil = settings.language === 'ta';
  const isLarge = settings.textSize === 'large';

  const filteredItems = radarItems.filter(
    (item) =>
      item.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.scamCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdentifier.trim()) return;

    onAddNewReport({
      identifier: newIdentifier.trim(),
      type: 'scam',
      reportCount: 1,
      reportedBy: 'You (Reported just now)',
      bankSources: [selectedBankSource, 'AI Guardian Network'],
      scamCategory: newCategory,
      lastReported: 'Just now',
      notes: newNotes || 'Suspicious scam attempt reported by senior citizen.',
    });

    setNewIdentifier('');
    setNewNotes('');
    setShowReportForm(false);
  };

  return (
    <div className="space-y-6 pb-20">
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
              {isTamil ? 'சமூக மோசடி ரேடார்' : 'Community Fraud Radar'}
            </h2>
            <p className="text-xs text-slate-500">
              {isTamil ? 'வங்கி வாடிக்கையாளர்களால் பகிரப்பட்ட மோசடி தரவுதளம்' : 'Real-time crowdsourced scam intelligence across banks'}
            </p>
          </div>
        </div>

        <button
          id="radar-report-new-btn"
          onClick={() => setShowReportForm(!showReportForm)}
          className="py-2 px-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showReportForm ? 'Cancel' : 'Report Scam'}</span>
        </button>
      </div>

      {/* Local Area Alert Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/90 flex items-center justify-center shrink-0 shadow-inner">
            <MapPin className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950 text-amber-300 px-2 py-0.5 rounded-full">
              Live Regional Telemetry
            </span>
            <h3 className="text-base sm:text-lg font-black leading-tight mt-0.5">
              {isTamil
                ? 'உங்கள் பகுதியில் இந்த வாரம் 142 மோசடி முயற்சிகள் தடுக்கப்பட்டன'
                : '142 Scam Attempts Blocked in Your District This Week'}
            </h3>
            <p className="text-xs text-slate-900 font-semibold mt-0.5">
              High activity: Electricity bill disconnection threats & fake SBI KYC renewal SMS.
            </p>
          </div>
        </div>
      </div>

      {/* Feature 7: How This Works / Cross-Bank Scam Pattern DNA Card */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-3xl p-5 space-y-2">
        <div className="flex items-center gap-2 text-indigo-950 font-black text-sm">
          <Building2 className="w-5 h-5 text-indigo-700" />
          <span>Feature 7: Cross-Bank Fraud Sharing (Scam Pattern DNA)</span>
        </div>
        <p className="text-xs sm:text-sm text-indigo-900 leading-relaxed">
          Fraudsters change bank accounts frequently. When a scam UPI handle or phone number is reported by a customer at <strong>State Bank of India</strong>, AI Guardian's cross-institution network instantly synchronizes that alert to <strong>HDFC, Canara, and ICICI Bank</strong> users before they can be targeted.
        </p>
        <div className="pt-1 flex flex-wrap gap-2 text-[11px] font-bold text-indigo-800">
          <span className="bg-white px-2 py-0.5 rounded border border-indigo-200">
            🏛️ RBI Fraud Intelligence Model
          </span>
          <span className="bg-white px-2 py-0.5 rounded border border-indigo-200">
            ⚡ Instant Sync Across 30+ Banks
          </span>
        </div>
      </div>

      {/* Report Form (Feature 4 requirement: add to mock shared list) */}
      {showReportForm && (
        <form
          onSubmit={handleSubmitReport}
          className="bg-white p-5 rounded-3xl border-2 border-rose-300 shadow-md space-y-4 animate-in fade-in"
        >
          <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <span>Report a Fraud Number or UPI ID</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                Scammer UPI ID or Phone Number:
              </label>
              <input
                type="text"
                required
                value={newIdentifier}
                onChange={(e) => setNewIdentifier(e.target.value)}
                placeholder="e.g. 9840199988 or lottery@paytm"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-rose-400 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                Scam Category:
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-400 outline-none"
              >
                <option>Fake Bank KYC Call / Phishing</option>
                <option>Electricity Power Cut Threat</option>
                <option>Grandchild / Family Emergency Impersonation</option>
                <option>Courier / Customs Parcel Release Fee</option>
                <option>Fake Digital Arrest / Police Impersonation</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">
              What did the scammer claim or say?
            </label>
            <input
              type="text"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="e.g. Demanded OTP claiming my debit card will be blocked"
              className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-400 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-md transition-colors"
          >
            Submit Scam Report (Adds to Community Radar Instantly)
          </button>
        </form>
      )}

      {/* Search / Lookup Bar */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search phone number, UPI ID, or scam type (e.g. 'electricity', 'sbi')..."
          className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-300 focus:border-amber-400 outline-none text-sm font-medium shadow-sm"
        />
      </div>

      {/* Radar Database Feed */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isScam = item.type === 'scam';

          return (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-3xl bg-white border-2 shadow-sm transition-all ${
                isScam ? 'border-rose-200' : 'border-emerald-200'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-base text-slate-900">
                    {item.identifier}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      isScam
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    {isScam ? `⚠️ ${item.reportCount} Reports` : '✅ Verified Legit'}
                  </span>
                </div>

                <span className="text-xs text-slate-400 font-medium">
                  {item.lastReported}
                </span>
              </div>

              <h4 className="font-extrabold text-sm text-slate-900 mb-1">
                {item.scamCategory}
              </h4>

              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {item.notes}
              </p>

              {/* Cross-bank badges (Feature 7) */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-slate-500 font-bold text-[11px]">
                    Reported across:
                  </span>
                  {item.bankSources.map((bank, bIdx) => (
                    <span
                      key={bIdx}
                      className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[10px]"
                    >
                      🏛️ {bank}
                    </span>
                  ))}
                </div>

                <span className="text-[11px] text-slate-400 font-semibold">
                  Reported by: {item.reportedBy}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
