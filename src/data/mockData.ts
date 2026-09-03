import { SMSMessage, Payee, Transaction, TrustedContact, CommunityRadarItem, AppSettings, DuressAlertLog } from '../types';

export const INITIAL_SETTINGS: AppSettings = {
  language: 'en',
  textSize: 'normal',
  highContrast: false,
  normalPin: '1234',
  duressPin: '9999',
  secretFamilyQuestion: 'What did we eat together on your last birthday?',
  secretFamilyAnswer: 'Mango kulfi at Marina beach with little Aarav',
  trustedContacts: [
    {
      id: 'tc-1',
      name: 'Raja Sundaram',
      relationship: 'Son (Lives in Chennai)',
      phone: '+91 98401 23456',
      isActive: true
    },
    {
      id: 'tc-2',
      name: 'Dr. Priya Shankar',
      relationship: 'Daughter',
      phone: '+91 98409 87654',
      isActive: true
    }
  ]
};

export const INITIAL_PAYEES: Payee[] = [
  {
    id: 'payee-1',
    name: 'Ramesh (Daily Vegetables)',
    upiId: 'ramesh.veg@okhdfcbank',
    phone: '+91 98412 34567',
    isFrequent: true,
    relationship: 'Frequent Vendor',
    reputation: 'trusted',
    verifiedTransactionsCount: 34
  },
  {
    id: 'payee-2',
    name: 'Priya (Daughter)',
    upiId: 'priya.s@icici',
    phone: '+91 98409 87654',
    isFrequent: true,
    relationship: 'Family',
    reputation: 'trusted',
    verifiedTransactionsCount: 52
  },
  {
    id: 'payee-3',
    name: 'TNEB Electricity Bill',
    upiId: 'tneb.chennai@sbi',
    isFrequent: true,
    relationship: 'Utility',
    reputation: 'trusted',
    verifiedTransactionsCount: 18
  },
  {
    id: 'payee-4',
    name: 'Unknown Payee (Claims Courier Fee)',
    upiId: 'urgentcourier99@ybl',
    isFrequent: false,
    reputation: 'unknown'
  },
  {
    id: 'payee-5',
    name: 'Fraudster: "KYC Verification Desk"',
    upiId: 'kyc-sbi-update@okaxis',
    isFrequent: false,
    reputation: 'scam',
    reportCount: 32,
    bankSources: ['SBI', 'HDFC Bank', 'Canara Bank']
  },
  {
    id: 'payee-6',
    name: 'Fraudster: "Electricity Disconnect Agent"',
    upiId: 'eb-officer-bill@paytm',
    isFrequent: false,
    reputation: 'scam',
    reportCount: 47,
    bankSources: ['Indian Bank', 'Canara Bank', 'Axis Bank']
  }
];

export const INITIAL_MESSAGES: SMSMessage[] = [
  {
    id: 'msg-1',
    sender: 'HDFC-BANK',
    timestamp: 'Today, 10:14 AM',
    preview: 'Txn alert: Rs 850.00 spent at Nilgiris Supermarket on your card ending 4012...',
    fullText: 'Dear Customer, your account XX4012 has been debited by Rs 850.00 on 03-Sep at Nilgiris Store Chennai. Avail Bal: Rs 84,500.20. If not done by you, call 1800-202-6161.',
    languageType: 'english',
    isRead: false
  },
  {
    id: 'msg-2',
    sender: 'SBI-ALERTS-X',
    timestamp: 'Today, 09:30 AM',
    preview: 'Dear customer your KYC will expire today, click here to update immediately...',
    fullText: 'Dear customer your KYC will expire today, click here http://bit.ly/sbi-kyc-reactivate to update immediately or your bank account XX4012 will be permanently blocked within 24 hours. Do not share your OTP with anyone.',
    languageType: 'english',
    isRead: false
  },
  {
    id: 'msg-3',
    sender: 'TNEB-POWER',
    timestamp: 'Yesterday, 07:15 PM',
    preview: 'Electricity power disconnection notice: Pay immediately or power cut...',
    fullText: 'Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM because previous month bill was not updated. Please immediately contact our electricity officer Mr. Sharma at 98402-XXXXX to pay via UPI or download our app.',
    languageType: 'english',
    isRead: true
  },
  {
    id: 'msg-4',
    sender: 'TN-BANK-ALERT',
    timestamp: 'Yesterday, 03:40 PM',
    preview: 'தமிழ்: உங்கள் வங்கி கணக்கு முடக்கப்படும்... உடனே இந்த லிங்கை கிளிக் செய்யவும்...',
    fullText: 'அன்புள்ள வாடிக்கையாளரே, உங்கள் வங்கி கணக்கு இன்றே முடக்கப்படும். உடனே இந்த லிங்கை http://tn-kyc-verify.xyz கிளிக் செய்து ஆதார் பான் இணைக்கவும். இல்லையெனில் உங்கள் ஏடிஎம் கார்டு செயலிழக்கப்படும்.',
    languageType: 'tamil_formal',
    isRead: false
  },
  {
    id: 'msg-5',
    sender: 'WHATSAPP-CALL',
    timestamp: '2 days ago',
    preview: 'தமிழ் பேச்சுவழக்கு: சார் உடனே ஓடிபி சொல்லுங்க இல்லாட்டி கார்டு பிளாக் ஆகிடும்...',
    fullText: 'சார் வணக்கம், நான் ஹெட் ஆபீஸ் வங்கி மேனேஜர் பேசுகிறேன். கார்டு பிளாக் ஆகிடும், மேனேஜர் சொல்லிட்டாரு சார் உடனே மொபைலுக்கு வந்த 6 டிஜிட் ஓடிபி சொல்லுங்க, காசு போயிடும்னு பயப்படாதீங்க உடனே பண்ணனும்.',
    languageType: 'tamil_slang',
    isRead: false
  },
  {
    id: 'msg-6',
    sender: 'CUSTOMER-SUPPORT',
    timestamp: '3 days ago',
    preview: 'Hinglish: Aapka account block ho jayega immediately, please share your OTP right now...',
    fullText: 'Dear User, aapka account block ho jayega immediately. KYC verification incomplete hai. Turant call karke apna OTP share karo manager ne bola hai.',
    languageType: 'hindi_english',
    isRead: true
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    payeeName: 'Nilgiris Supermarket',
    payeeUpi: 'nilgiris.retail@okhdfcbank',
    amount: 850,
    timestamp: 'Today, 10:14 AM',
    status: 'completed',
    riskLevel: 'LOW'
  },
  {
    id: 'tx-2',
    payeeName: 'Ramesh (Daily Vegetables)',
    payeeUpi: 'ramesh.veg@okhdfcbank',
    amount: 200,
    timestamp: 'Yesterday, 08:30 AM',
    status: 'completed',
    riskLevel: 'LOW'
  },
  {
    id: 'tx-3',
    payeeName: 'TNEB Chennai Electricity',
    payeeUpi: 'tneb.chennai@sbi',
    amount: 1420,
    timestamp: '28 Aug 2026',
    status: 'completed',
    riskLevel: 'LOW'
  },
  {
    id: 'tx-4',
    payeeName: 'Suspicious Investment Club',
    payeeUpi: 'quickwealth99@upi',
    amount: 25000,
    timestamp: '22 Aug 2026, 11:50 PM',
    status: 'blocked',
    riskLevel: 'HIGH',
    riskReason: 'Blocked after cooling-off period & family review'
  }
];

export const INITIAL_COMMUNITY_RADAR: CommunityRadarItem[] = [
  {
    id: 'radar-1',
    identifier: 'kyc-sbi-update@okaxis',
    type: 'scam',
    reportCount: 38,
    reportedBy: '24 Customers in T. Nagar, Chennai',
    bankSources: ['State Bank of India', 'HDFC Bank', 'Canara Bank'],
    scamCategory: 'Fake Bank KYC Phishing',
    lastReported: '24 mins ago',
    notes: 'Sending SMS claiming bank account will close unless victim shares OTP or visits phishing portal.'
  },
  {
    id: 'radar-2',
    identifier: 'eb-officer-bill@paytm',
    type: 'scam',
    reportCount: 47,
    reportedBy: '41 Senior Citizens across Tamil Nadu',
    bankSources: ['Indian Bank', 'Canara Bank', 'Axis Bank'],
    scamCategory: 'Electricity Power Cut Extortion',
    lastReported: '1 hour ago',
    notes: 'Threatens power disconnect within 30 minutes; demands urgent ₹3,000+ UPI payment.'
  },
  {
    id: 'radar-3',
    identifier: '+91 98401 99988',
    type: 'scam',
    reportCount: 19,
    reportedBy: '19 Family Members',
    bankSources: ['State Bank of India', 'Bank of Baroda'],
    scamCategory: 'Grandchild Impersonation Call',
    lastReported: '3 hours ago',
    notes: 'Caller claims to be grandchild in hospital or police station needing urgent bail transfer.'
  },
  {
    id: 'radar-4',
    identifier: 'urgentcourier99@ybl',
    type: 'scam',
    reportCount: 12,
    reportedBy: '8 Users',
    bankSources: ['ICICI Bank', 'HDFC Bank'],
    scamCategory: 'Customs / Fake Courier Fee',
    lastReported: 'Yesterday',
    notes: 'Demands ₹500 - ₹2,000 for parcel release.'
  },
  {
    id: 'radar-5',
    identifier: 'tneb.chennai@sbi',
    type: 'trusted',
    reportCount: 240,
    reportedBy: 'Tamil Nadu Electricity Board Official',
    bankSources: ['All Major Banks', 'RBI Verified UPI'],
    scamCategory: 'Government Verified Utility',
    lastReported: 'Active Official Gateway',
    notes: 'Official Tamil Nadu Generation and Distribution Corporation consumer collection handle.'
  }
];

export const INITIAL_DURESS_LOGS: DuressAlertLog[] = [
  {
    id: 'sos-demo-1',
    timestamp: '01-Sep-2026, 11:22 PM',
    amount: 15000,
    payeeName: 'Unknown Extortionist Account',
    payeeUpi: 'cashnow62@paytm',
    duressPinEntered: '9999',
    location: 'Anna Nagar, Chennai (GPS: 13.0850, 80.2101)',
    status: 'ACTIVE_POLICE_DISPATCH',
    actionTaken: 'Screen showed normal completion. Real transaction frozen in shadow escrow. Local cyber cell alerted with cell tower telemetry.'
  }
];
