export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type Language = 'en' | 'ta';

export type TextSize = 'normal' | 'large';

export interface RiskSignal {
  type: 'rule' | 'text' | 'reputation';
  label: string;
  detail: string;
  severity: 'low' | 'med' | 'high';
}

export interface RiskAnalysisResult {
  level: RiskLevel;
  score: number; // 0 to 100
  title: string;
  titleTa?: string;
  explanation: string;
  explanationTa?: string;
  actionAdvice: string;
  actionAdviceTa?: string;
  dialectDetected?: string;
  signals: RiskSignal[];
  coolingOffRequired: boolean;
  trustedApprovalRequired: boolean;
}

export interface SMSMessage {
  id: string;
  sender: string;
  timestamp: string;
  preview: string;
  fullText: string;
  languageType: 'english' | 'tamil_formal' | 'tamil_slang' | 'hindi_english';
  isRead: boolean;
  isReported?: boolean;
}

export interface Payee {
  id: string;
  name: string;
  upiId: string;
  phone?: string;
  isFrequent: boolean;
  relationship?: string;
  reputation: 'trusted' | 'unknown' | 'scam';
  reportCount?: number;
  verifiedTransactionsCount?: number;
  bankSources?: string[];
}

export interface Transaction {
  id: string;
  payeeName: string;
  payeeUpi: string;
  amount: number;
  timestamp: string;
  status: 'completed' | 'blocked' | 'cooling_off' | 'pending_approval' | 'duress_completed';
  riskLevel: RiskLevel;
  isDuress?: boolean;
  riskReason?: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isActive: boolean;
}

export interface CommunityRadarItem {
  id: string;
  identifier: string; // phone or UPI
  type: 'scam' | 'trusted';
  reportCount: number;
  reportedBy: string;
  bankSources: string[];
  scamCategory: string;
  lastReported: string;
  notes: string;
}

export interface DuressAlertLog {
  id: string;
  timestamp: string;
  amount: number;
  payeeName: string;
  payeeUpi: string;
  duressPinEntered: string;
  location: string;
  status: 'ACTIVE_POLICE_DISPATCH' | 'SHADOW_TRANSACTION_FLAGGED' | 'BANK_FRAUD_DESK_ALERTED';
  actionTaken: string;
}

export interface AppSettings {
  language: Language;
  textSize: TextSize;
  highContrast: boolean;
  normalPin: string;
  duressPin: string;
  secretFamilyQuestion: string;
  secretFamilyAnswer: string;
  trustedContacts: TrustedContact[];
}
