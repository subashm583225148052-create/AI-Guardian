import { RiskAnalysisResult, RiskLevel, RiskSignal, Payee, CommunityRadarItem } from '../types';

export interface TransactionRiskInput {
  amount: number;
  payee: Payee;
  timeHour?: number; // 0 - 23 (e.g., 23 for 11 PM)
  timeMinute?: number;
  isRapidTransfer?: boolean;
  communityRadarList: CommunityRadarItem[];
}

export function analyzeTransactionRisk(input: TransactionRiskInput): RiskAnalysisResult {
  const signals: RiskSignal[] = [];
  let score = 5; // base safe baseline

  const userAverageAmount = 3500;
  const isHighAmount = input.amount > userAverageAmount * 2;
  const isExtremeAmount = input.amount >= 25000;

  // 1. Community Radar Check (Highest Priority)
  const radarMatch = input.communityRadarList.find(
    (item) => item.identifier.toLowerCase() === input.payee.upiId.toLowerCase()
  );

  if (radarMatch && radarMatch.type === 'scam') {
    score += 85;
    signals.push({
      type: 'reputation',
      label: 'Flagged by Fraud Radar',
      detail: `This UPI ID has been reported ${radarMatch.reportCount} times across ${radarMatch.bankSources.join(', ')}.`,
      severity: 'high'
    });
  } else if (input.payee.reputation === 'trusted' && input.payee.isFrequent) {
    score -= 10;
    signals.push({
      type: 'reputation',
      label: 'Verified Frequent Payee',
      detail: `You have sent money to ${input.payee.name} ${input.payee.verifiedTransactionsCount || 18} times safely.`,
      severity: 'low'
    });
  } else if (!input.payee.isFrequent) {
    score += 20;
    signals.push({
      type: 'rule',
      label: 'New Payee',
      detail: 'You have never sent money to this account before.',
      severity: 'med'
    });
  }

  // 2. Amount Analysis
  if (isExtremeAmount) {
    score += 45;
    signals.push({
      type: 'rule',
      label: 'Unusually High Amount',
      detail: `₹${input.amount.toLocaleString('en-IN')} is more than 10× your usual transfer size (₹${userAverageAmount.toLocaleString('en-IN')}).`,
      severity: 'high'
    });
  } else if (isHighAmount) {
    score += 25;
    signals.push({
      type: 'rule',
      label: 'Higher than Average Amount',
      detail: `₹${input.amount.toLocaleString('en-IN')} is larger than your typical transfer of ₹${userAverageAmount.toLocaleString('en-IN')}.`,
      severity: 'med'
    });
  }

  // 3. Time of Day Analysis (11 PM to 6 AM is high risk for senior coercion)
  const hour = input.timeHour !== undefined ? input.timeHour : new Date().getHours();
  const isLateNight = hour >= 23 || hour < 6;
  if (isLateNight) {
    score += 25;
    signals.push({
      type: 'rule',
      label: 'Late-Night Transfer',
      detail: 'Attempted during late hours (11:00 PM – 6:00 AM), when scammers often exploit fatigue.',
      severity: 'high'
    });
  }

  // 4. Rapid repeated transfers
  if (input.isRapidTransfer) {
    score += 20;
    signals.push({
      type: 'rule',
      label: 'Rapid Sequential Transfer',
      detail: 'Multiple transfers attempted within minutes.',
      severity: 'high'
    });
  }

  // Normalize score
  score = Math.max(0, Math.min(100, score));

  let level: RiskLevel = 'LOW';
  if (score >= 60) {
    level = 'HIGH';
  } else if (score >= 35) {
    level = 'MEDIUM';
  }

  // Plain language explanation based on signals
  let explanation = '';
  let explanationTa = '';
  let actionAdvice = '';
  let actionAdviceTa = '';

  if (level === 'HIGH') {
    if (radarMatch && radarMatch.type === 'scam') {
      explanation = `DANGER: This account (${input.payee.upiId}) was reported by ${radarMatch.reportCount} other bank customers for fraud. Real banks have flagged it.`;
      explanationTa = `எச்சரிக்கை: இந்த கணக்கு (${input.payee.upiId}) மோசடிக்காக ${radarMatch.reportCount} வாடிக்கையாளர்களால் புகாரளிக்கப்பட்டது.`;
      actionAdvice = 'Do NOT send money. We have paused this transfer to protect your funds.';
      actionAdviceTa = 'பணம் அனுப்ப வேண்டாம். உங்கள் பணத்தை பாதுகாக்க இந்த பரிவர்த்தனை நிறுத்தப்பட்டுள்ளது.';
    } else {
      explanation = `This transfer of ₹${input.amount.toLocaleString('en-IN')} is very unusual. It is going to a new recipient at an unusual time of night, which matches typical fraud patterns.`;
      explanationTa = `இந்த ₹${input.amount.toLocaleString('en-IN')} பரிவர்த்தனை அசாதாரணமானது. புதிய நபருக்கு இரவு நேரத்தில் பணம் அனுப்புவது மோசடி முறைக்கு பொருந்துகிறது.`;
      actionAdvice = 'We have initiated a 60-second cooling-off period and notified your family contact for safety.';
      actionAdviceTa = 'பாதுகாப்பிற்காக 60 வினாடி அமைதி நேரம் மற்றும் குடும்பத்தினர் ஒப்புதல் தொடங்கப்பட்டுள்ளது.';
    }
  } else if (level === 'MEDIUM') {
    explanation = `Notice: You are sending ₹${input.amount.toLocaleString('en-IN')} to a payee you haven't sent money to before. Please confirm you personally know them.`;
    explanationTa = `கவனிக்க: இதற்கு முன் நீங்கள் பணம் அனுப்பாத புதிய நபருக்கு ₹${input.amount.toLocaleString('en-IN')} அனுப்புகிறீர்கள்.`;
    actionAdvice = 'Take a moment to double-check the recipient name and UPI ID before proceeding.';
    actionAdviceTa = 'பணம் அனுப்புவதற்கு முன் பெறுநர் பெயரை மீண்டும் ஒருமுறை சரிபார்க்கவும்.';
  } else {
    explanation = `This transaction matches your regular safe banking habits. ${input.payee.name} is a known, trusted payee.`;
    explanationTa = `இந்த பரிவர்த்தனை பாதுகாப்பானது. ${input.payee.name} உங்கள் வழக்கமான நம்பகமான நபர்.`;
    actionAdvice = 'Safe to proceed with zero delays.';
    actionAdviceTa = 'தாமதமின்றி பாதுகாப்பாக தொடரலாம்.';
  }

  return {
    level,
    score,
    title: level === 'HIGH' ? 'High Risk Detected' : level === 'MEDIUM' ? 'Caution Recommended' : 'Safe Transaction',
    titleTa: level === 'HIGH' ? 'அதிக ஆபத்து கண்டறியப்பட்டது' : level === 'MEDIUM' ? 'எச்சரிக்கை தேவை' : 'பாதுகாப்பான பரிவர்த்தனை',
    explanation,
    explanationTa,
    actionAdvice,
    actionAdviceTa,
    signals,
    coolingOffRequired: level === 'HIGH' || level === 'MEDIUM',
    trustedApprovalRequired: level === 'HIGH'
  };
}

export function analyzeMessageRisk(messageText: string, sender: string): RiskAnalysisResult {
  const text = messageText.toLowerCase();
  const signals: RiskSignal[] = [];
  let score = 5;
  let dialectDetected: string | undefined = undefined;

  // 1. Regional Dialect Recognition
  const hasTamilFormal = /முடக்கப்படும்|உடனே|வங்கி|இன்றே|தொடர்பு கொள்ளவும்|கிளிக்|கணக்கு|ஆதார்|பான்|செயலிழக்க/.test(messageText);
  const hasTamilSlang = /ஓடிபி|பிளாக்|மேனேஜர் சொல்லிட்டாரு|சார் உடனே|காசு போயிடும்|கார்டு பிளாக்|போன் பண்ணுங்க|அவசரம்/.test(messageText);
  const hasHindiEnglish = /block ho jayega|jaldi|karo|turant|aapka account|otp share karo|paise cut|manager ne bola/.test(text);

  if (hasTamilSlang) {
    dialectDetected = 'Tamil (Colloquial / Urgency Dialect - தமிழ் பேச்சுவழக்கு)';
  } else if (hasTamilFormal) {
    dialectDetected = 'Tamil (Formal Phrasing - தமிழ் எழுத்துவழக்கு)';
  } else if (hasHindiEnglish) {
    dialectDetected = 'Hindi-English Colloquial Mix (हिंग्लिश दबाव)';
  } else {
    dialectDetected = 'English (Standard Financial Phrasing)';
  }

  // 2. Urgent / Threat Language
  const urgencyKeywords = [
    'immediately', 'expire today', 'expires today', 'blocked', 'will be blocked',
    'suspended', 'urgent', 'act now', 'within 24 hours', 'electricity will be cut',
    'electricity disconnected', 'arrest', 'police complaint',
    'உடனே', 'முடக்கப்படும்', 'இன்றே', 'துண்டிக்கப்படும்',
    'jaldi', 'turant', 'block ho jayega'
  ];
  const foundUrgency = urgencyKeywords.filter(k => text.includes(k) || messageText.includes(k));
  if (foundUrgency.length > 0) {
    score += 35;
    signals.push({
      type: 'text',
      label: 'False Urgency Phrasing',
      detail: `Creates intense urgency ("${foundUrgency.slice(0, 2).join(', ')}") to rush you into acting without thinking.`,
      severity: 'high'
    });
  }

  // 3. Credential Harvesting (OTP / PIN / Password / KYC)
  const otpKeywords = [
    'otp', 'pin', 'password', 'cvv', 'share otp', 'enter pin', 'kyc update',
    'kyc will expire', 'pan update', 'aadhaar', 'ஓடிபி', 'பாஸ்வேர்ட்', 'கேஒய்சி'
  ];
  const foundOtp = otpKeywords.filter(k => text.includes(k) || messageText.includes(k));
  if (foundOtp.length > 0) {
    score += 45;
    signals.push({
      type: 'text',
      label: 'Request for Sensitive Credentials',
      detail: 'Asks for OTP, PIN, or confidential KYC details. Real banks NEVER ask for these via SMS or phone.',
      severity: 'high'
    });
  }

  // 4. Impersonation & Suspicious Links
  const impersonationKeywords = [
    'dear customer', 'bank manager', 'electricity officer', 'sbi team', 'support executive',
    'வங்கி மேனேஜர்', 'மின்துறை அதிகாரி'
  ];
  const hasLinks = /(http:\/\/|https:\/\/|bit\.ly|tinyurl|\.apk|click here|download app|இங்கே கிளிக்)/.test(text);

  if (hasLinks) {
    score += 30;
    signals.push({
      type: 'text',
      label: 'Unverified Link / App Download',
      detail: 'Contains an unverified external link or download request that may steal your banking session.',
      severity: 'high'
    });
  }

  if (impersonationKeywords.some(k => text.includes(k) || messageText.includes(k))) {
    score += 15;
    signals.push({
      type: 'text',
      label: 'Authority Impersonation',
      detail: 'Claims to represent your bank or an essential public utility to manufacture trust.',
      severity: 'med'
    });
  }

  // Check sender legitimacy
  const isSafeSender = /HDFC|SBI|CANARA|AXIS|ICICI|BANK/.test(sender) && !hasLinks && foundOtp.length === 0 && foundUrgency.length === 0;
  if (isSafeSender) {
    score = 5;
    signals.push({
      type: 'reputation',
      label: 'Verified Bank Notification',
      detail: 'Standard debit confirmation without requests for action, links, or passwords.',
      severity: 'low'
    });
  }

  score = Math.max(0, Math.min(100, score));

  let level: RiskLevel = 'LOW';
  if (score >= 60) {
    level = 'HIGH';
  } else if (score >= 35) {
    level = 'MEDIUM';
  }

  let explanation = '';
  let explanationTa = '';
  let actionAdvice = '';
  let actionAdviceTa = '';

  if (level === 'HIGH') {
    explanation = 'This message is almost certainly a scam. It claims your account or utility will be blocked and pushes you to click a link or share private details. Your real bank will NEVER ask for your OTP or password.';
    explanationTa = 'இந்த செய்தி நிச்சயமாக மோசடி. உங்கள் கணக்கு முடக்கப்படும் என்று கூறி லிங்க் கிளிக் செய்யவோ அல்லது ஓடிபி பகிரவோ தூண்டுகிறது. உங்கள் வங்கி ஒருபோதும் ஓடிபி கேட்காது.';
    actionAdvice = 'DO NOT click any link. DO NOT call any number in the message. Delete and report it to the Community Radar.';
    actionAdviceTa = 'எந்த இணைப்பையும் கிளிக் செய்யாதீர்கள். செய்தியில் உள்ள எண்ணை அழைக்காதீர்கள். இதை நீக்கி புகார் அளிக்கவும்.';
  } else if (level === 'MEDIUM') {
    explanation = 'This message contains unverified links or urgent wording from an unknown sender. Proceed with caution.';
    explanationTa = 'இந்த செய்தியில் சரிபார்க்கப்படாத இணைப்புகள் அல்லது அவசர வார்த்தைகள் உள்ளன. எச்சரிக்கையுடன் இருக்கவும்.';
    actionAdvice = 'Verify directly by opening your official banking app or calling the helpline on the back of your debit card.';
    actionAdviceTa = 'உங்கள் டெபிட் கார்டின் பின்னால் உள்ள அதிகாரப்பூர்வ வங்கி எண்ணை அழைத்து சரிபார்க்கவும்.';
  } else {
    explanation = 'This is a routine transactional alert confirming a completed payment or bill. It requires no action and requests no secrets.';
    explanationTa = 'இது ஒரு வழக்கமான வங்கி தகவல் அறிவிப்பு. எந்த ரகசிய விவரங்களையும் கேட்கவில்லை.';
    actionAdvice = 'Safe to read. No action needed.';
    actionAdviceTa = 'பாதுகாப்பானது. எந்த நடவடிக்கையும் தேவையில்லை.';
  }

  return {
    level,
    score,
    title: level === 'HIGH' ? 'Scam Warning: High Risk' : level === 'MEDIUM' ? 'Caution Advised' : 'Safe Bank Notification',
    titleTa: level === 'HIGH' ? 'மோசடி எச்சரிக்கை: அதிக ஆபத்து' : level === 'MEDIUM' ? 'கவனம் தேவை' : 'பாதுகாப்பான வங்கி தகவல்',
    explanation,
    explanationTa,
    actionAdvice,
    actionAdviceTa,
    dialectDetected,
    signals,
    coolingOffRequired: false,
    trustedApprovalRequired: false
  };
}
