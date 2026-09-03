import React, { useState } from 'react';
import { Users, ArrowLeft, PlusCircle, ShieldCheck, Phone, Heart, Check, Trash2 } from 'lucide-react';
import { TrustedContact, AppSettings } from '../types';

interface TrustedContactsScreenProps {
  contacts: TrustedContact[];
  settings: AppSettings;
  onBack: () => void;
  onAddContact: (contact: Omit<TrustedContact, 'id'>) => void;
  onRemoveContact: (id: string) => void;
}

export const TrustedContactsScreen: React.FC<TrustedContactsScreenProps> = ({
  contacts,
  settings,
  onBack,
  onAddContact,
  onRemoveContact,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Son');
  const [phone, setPhone] = useState('');

  const isTamil = settings.language === 'ta';
  const isLarge = settings.textSize === 'large';

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    onAddContact({
      name: name.trim(),
      relationship: relationship.trim(),
      phone: phone.trim(),
      isActive: true,
    });

    setName('');
    setPhone('');
    setShowAddForm(false);
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
              {isTamil ? 'குடும்ப கவசம் (நம்பகமானவர்கள்)' : 'Family Shield (Trusted Contacts)'}
            </h2>
            <p className="text-xs text-slate-500">
              {isTamil ? 'அசாதாரண பரிவர்த்தனைகளை சரிபார்க்கும் குடும்ப உறுப்பினர்கள்' : 'Guardians who receive approval requests for risky transactions'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1 shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showAddForm ? 'Cancel' : 'Add Contact'}</span>
        </button>
      </div>

      {/* Educational Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-4 sm:p-5 flex items-start gap-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="text-xs sm:text-sm text-emerald-950 space-y-1">
          <h3 className="font-extrabold text-sm">
            {isTamil ? 'குடும்ப பாதுகாப்பு வளையம் எவ்வாறு செயல்படுகிறது?' : 'How Family Shield Protects You:'}
          </h3>
          <p className="leading-relaxed text-emerald-900 font-medium">
            Whenever an unusually large transfer (over 2× your average) or a transfer to a brand new recipient at odd hours is initiated, AI Guardian automatically dispatches a secure authorization ping to your family. Money is only transferred after they confirm.
          </p>
        </div>
      </div>

      {/* Add New Contact Form */}
      {showAddForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white p-5 rounded-3xl border-2 border-emerald-300 shadow-md space-y-3 animate-in fade-in"
        >
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Add New Family Guardian
          </h4>

          <div>
            <label className="text-xs text-slate-500 font-semibold block mb-1">
              Full Name:
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Raja Sundaram"
              className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-500 font-semibold block mb-1">
                Relationship:
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              >
                <option>Son</option>
                <option>Daughter</option>
                <option>Spouse</option>
                <option>Grandchild</option>
                <option>Trusted Friend</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 font-semibold block mb-1">
                Mobile Number:
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98401 XXXXX"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition-colors"
          >
            Save Trusted Contact
          </button>
        </form>
      )}

      {/* Contacts List */}
      <div className="space-y-3">
        {contacts.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-lg">
                {c.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-base text-slate-900">
                    {c.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Active Guardian
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">{c.relationship}</p>
                <p className="text-xs font-mono text-slate-400 mt-0.5">{c.phone}</p>
              </div>
            </div>

            {contacts.length > 1 && (
              <button
                onClick={() => onRemoveContact(c.id)}
                className="p-2 text-slate-400 hover:text-rose-600 rounded-xl transition-colors"
                title="Remove contact"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
