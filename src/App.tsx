import React, { useState } from 'react';
import { Header } from './components/Header';
import { DemoScenariosBar } from './components/DemoScenariosBar';
import { BottomNavigation } from './components/BottomNavigation';
import { HomeScreen } from './components/HomeScreen';
import { InboxScreen } from './components/InboxScreen';
import { SendMoneyScreen } from './components/SendMoneyScreen';
import { CommunityRadarScreen } from './components/CommunityRadarScreen';
import { TrustedContactsScreen } from './components/TrustedContactsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { RiskAlertModal } from './components/RiskAlertModal';
import { CoolingCompanionModal } from './components/CoolingCompanionModal';
import { TrustedContactApprovalModal } from './components/TrustedContactApprovalModal';
import { PinEntryModal } from './components/PinEntryModal';
import { GrandchildCallModal } from './components/GrandchildCallModal';
import { AdminBankViewModal } from './components/AdminBankViewModal';
import { TransactionSuccessModal } from './components/TransactionSuccessModal';

import {
  INITIAL_SETTINGS,
  INITIAL_PAYEES,
  INITIAL_MESSAGES,
  INITIAL_TRANSACTIONS,
  INITIAL_COMMUNITY_RADAR,
  INITIAL_DURESS_LOGS,
} from './data/mockData';

import {
  AppSettings,
  Payee,
  SMSMessage,
  Transaction,
  CommunityRadarItem,
  DuressAlertLog,
  RiskAnalysisResult,
} from './types';

import { analyzeTransactionRisk, analyzeMessageRisk } from './utils/riskEngine';

export default function App() {
  // Main state
  const [balance, setBalance] = useState<number>(84500.2);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [messages, setMessages] = useState<SMSMessage[]>(INITIAL_MESSAGES);
  const [payees, setPayees] = useState<Payee[]>(INITIAL_PAYEES);
  const [communityRadar, setCommunityRadar] = useState<CommunityRadarItem[]>(INITIAL_COMMUNITY_RADAR);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [duressLogs, setDuressLogs] = useState<DuressAlertLog[]>(INITIAL_DURESS_LOGS);

  // Active Screen
  const [activeScreen, setActiveScreen] = useState<string>('home');
  const [isDemoBarOpen, setIsDemoBarOpen] = useState<boolean>(true);

  // Modals
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState<boolean>(false);

  // Risk Alert Modal state
  const [riskModalState, setRiskModalState] = useState<{
    isOpen: boolean;
    result?: RiskAnalysisResult;
    title?: string;
    onProceed?: () => void;
    proceedLabel?: string;
    onReport?: () => void;
  }>({ isOpen: false });

  // Cooling-off Modal state
  const [coolingModalState, setCoolingModalState] = useState<{
    isOpen: boolean;
    amount: number;
    payee?: Payee;
  }>({ isOpen: false, amount: 0 });

  // Trusted Contact Approval Modal state
  const [approvalModalState, setApprovalModalState] = useState<{
    isOpen: boolean;
    amount: number;
    payee?: Payee;
  }>({ isOpen: false, amount: 0 });

  // PIN Entry Modal state
  const [pinModalState, setPinModalState] = useState<{
    isOpen: boolean;
    amount: number;
    payee?: Payee;
  }>({ isOpen: false, amount: 0 });

  // Success Modal state
  const [successModalState, setSuccessModalState] = useState<{
    isOpen: boolean;
    amount: number;
    payeeName: string;
    payeeUpi: string;
    isDuress: boolean;
  }>({
    isOpen: false,
    amount: 0,
    payeeName: '',
    payeeUpi: '',
    isDuress: false,
  });

  // Settings update helper
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Reset Demo to pristine state
  const handleResetDemo = () => {
    setBalance(84500.2);
    setTransactions(INITIAL_TRANSACTIONS);
    setMessages(INITIAL_MESSAGES);
    setPayees(INITIAL_PAYEES);
    setCommunityRadar(INITIAL_COMMUNITY_RADAR);
    setSettings(INITIAL_SETTINGS);
    setDuressLogs(INITIAL_DURESS_LOGS);
    setActiveScreen('home');
    alert('Demo environment reset successfully to original mock baseline!');
  };

  // 1-Click Trigger for Demo Scenarios
  const handleTriggerScenario = (scenarioId: number) => {
    switch (scenarioId) {
      case 1: {
        // Safe Bank SMS
        setActiveScreen('inbox');
        const safeMsg = messages.find((m) => m.id === 'msg-1') || messages[0];
        const analysis = analyzeMessageRisk(safeMsg.fullText, safeMsg.sender);
        setRiskModalState({
          isOpen: true,
          result: analysis,
          title: `SMS from ${safeMsg.sender}`,
        });
        break;
      }
      case 2: {
        // Scam SMS: KYC Expiry + OTP urgency
        setActiveScreen('inbox');
        const scamMsg = messages.find((m) => m.id === 'msg-2') || messages[1];
        const analysis = analyzeMessageRisk(scamMsg.fullText, scamMsg.sender);
        setRiskModalState({
          isOpen: true,
          result: analysis,
          title: `High-Risk Phishing SMS from ${scamMsg.sender}`,
          onReport: () => {
            handleReportMessageToRadar(scamMsg);
            setRiskModalState({ isOpen: false });
          },
        });
        break;
      }
      case 3: {
        // Safe ₹200 transaction to frequent payee (Ramesh) -> Zero friction
        const frequentPayee = payees.find((p) => p.isFrequent) || payees[0];
        const analysis = analyzeTransactionRisk({
          amount: 200,
          payee: frequentPayee,
          communityRadarList: communityRadar,
        });

        // Direct to PIN with zero friction!
        setPinModalState({
          isOpen: true,
          amount: 200,
          payee: frequentPayee,
        });
        break;
      }
      case 4: {
        // Risky ₹50,000 at 11:45 PM to brand new payee
        const unknownPayee = payees.find((p) => !p.isFrequent) || payees[3];
        const analysis = analyzeTransactionRisk({
          amount: 50000,
          payee: unknownPayee,
          timeHour: 23, // 11:45 PM
          timeMinute: 45,
          communityRadarList: communityRadar,
        });

        // Opens Explainable Risk Alert, with action to start Cooling Companion
        setRiskModalState({
          isOpen: true,
          result: analysis,
          title: `Unusual ₹50,000 Transfer at 11:45 PM to ${unknownPayee.name}`,
          proceedLabel: 'Start 60s Cooling-Off Companion',
          onProceed: () => {
            setRiskModalState({ isOpen: false });
            setCoolingModalState({
              isOpen: true,
              amount: 50000,
              payee: unknownPayee,
            });
          },
        });
        break;
      }
      case 5: {
        // Simulated incoming scam call (Grandchild challenge)
        setIsCallModalOpen(true);
        break;
      }
      case 6: {
        // Transfer to flagged scam UPI
        setActiveScreen('send');
        const scamPayee = payees.find((p) => p.reputation === 'scam') || payees[4];
        const analysis = analyzeTransactionRisk({
          amount: 3500,
          payee: scamPayee,
          communityRadarList: communityRadar,
        });

        setRiskModalState({
          isOpen: true,
          result: analysis,
          title: `Recipient ${scamPayee.upiId} Flagged by 3 Banks`,
          proceedLabel: 'View Community Radar Report',
          onProceed: () => {
            setRiskModalState({ isOpen: false });
            setActiveScreen('radar');
          },
        });
        break;
      }
      case 7: {
        // Tamil dialect phishing SMS
        setActiveScreen('inbox');
        const tamilMsg = messages.find((m) => m.languageType === 'tamil_slang') || messages[4];
        const analysis = analyzeMessageRisk(tamilMsg.fullText, tamilMsg.sender);
        setRiskModalState({
          isOpen: true,
          result: analysis,
          title: `Colloquial Dialect SMS: ${tamilMsg.sender}`,
        });
        break;
      }
      default:
        break;
    }
  };

  // Transaction initiation from SendMoney screen
  const handleInitiateTransaction = (amount: number, payee: Payee, isLateNight: boolean) => {
    const analysis = analyzeTransactionRisk({
      amount,
      payee,
      timeHour: isLateNight ? 23 : 11,
      communityRadarList: communityRadar,
    });

    if (analysis.level === 'LOW') {
      // Safe transaction -> straight to PIN entry with zero friction!
      setPinModalState({
        isOpen: true,
        amount,
        payee,
      });
    } else {
      // Medium or High risk -> show Explainable Risk Alert first!
      setRiskModalState({
        isOpen: true,
        result: analysis,
        title: `Transfer Risk Check: ₹${amount.toLocaleString('en-IN')} to ${payee.name}`,
        proceedLabel: 'Enter Cooling-Off Companion',
        onProceed: () => {
          setRiskModalState({ isOpen: false });
          setCoolingModalState({
            isOpen: true,
            amount,
            payee,
          });
        },
      });
    }
  };

  // Step 2: Cooling companion complete -> Go to Trusted Contact Loop
  const handleCoolingProceed = () => {
    if (!coolingModalState.payee) return;
    const { amount, payee } = coolingModalState;
    setCoolingModalState({ isOpen: false, amount: 0 });

    // Open Trusted Contact Approval Modal
    setApprovalModalState({
      isOpen: true,
      amount,
      payee,
    });
  };

  // Step 3: Trusted contact approves -> Go to PIN entry
  const handleTrustedApproval = () => {
    if (!approvalModalState.payee) return;
    const { amount, payee } = approvalModalState;
    setApprovalModalState({ isOpen: false, amount: 0 });

    setPinModalState({
      isOpen: true,
      amount,
      payee,
    });
  };

  // Trusted contact declines -> cancel transfer safely
  const handleTrustedDecline = () => {
    const payee = approvalModalState.payee;
    const amount = approvalModalState.amount;
    setApprovalModalState({ isOpen: false, amount: 0 });

    if (payee) {
      setTransactions((prev) => [
        {
          id: `tx-declined-${Date.now()}`,
          payeeName: payee.name,
          payeeUpi: payee.upiId,
          amount,
          timestamp: 'Just now',
          status: 'blocked',
          riskLevel: 'HIGH',
          riskReason: 'Declined by trusted contact (Raja Sundaram)',
        },
        ...prev,
      ]);
    }
  };

  // Step 4: PIN verification success
  const handlePinSuccess = (isDuress: boolean) => {
    const { amount, payee } = pinModalState;
    if (!payee) return;

    setPinModalState({ isOpen: false, amount: 0 });

    if (isDuress) {
      // Silent SOS trigger!
      // Add alert log for Bank Security desk
      const newDuressLog: DuressAlertLog = {
        id: `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        amount,
        payeeName: payee.name,
        payeeUpi: payee.upiId,
        duressPinEntered: settings.duressPin,
        location: 'Anna Nagar West, Chennai (GPS: 13.0850, 80.2101)',
        status: 'ACTIVE_POLICE_DISPATCH',
        actionTaken: 'Screen displayed fake success. Real transfer held in shadow quarantine. Police cyber response dispatched with cellular triangulation.',
      };

      setDuressLogs((prev) => [newDuressLog, ...prev]);

      // Record transaction
      setTransactions((prev) => [
        {
          id: `tx-${Date.now()}`,
          payeeName: payee.name,
          payeeUpi: payee.upiId,
          amount,
          timestamp: 'Just now',
          status: 'duress_completed',
          riskLevel: 'HIGH',
          isDuress: true,
          riskReason: 'Silent SOS Triggered: Intercepted in shadow escrow',
        },
        ...prev,
      ]);
    } else {
      // Normal transaction completion
      setBalance((prev) => Math.max(0, prev - amount));
      setTransactions((prev) => [
        {
          id: `tx-${Date.now()}`,
          payeeName: payee.name,
          payeeUpi: payee.upiId,
          amount,
          timestamp: 'Just now',
          status: 'completed',
          riskLevel: 'LOW',
        },
        ...prev,
      ]);
    }

    // Open Success confirmation screen
    setSuccessModalState({
      isOpen: true,
      amount,
      payeeName: payee.name,
      payeeUpi: payee.upiId,
      isDuress,
    });
  };

  // Report message to Community Radar
  const handleReportMessageToRadar = (msg: SMSMessage) => {
    const newItem: CommunityRadarItem = {
      id: `radar-${Date.now()}`,
      identifier: msg.sender,
      type: 'scam',
      reportCount: 1,
      reportedBy: 'You (Reported via SMS Scanner)',
      bankSources: ['State Bank of India', 'HDFC Bank', 'Canara Bank'],
      scamCategory: 'Fake Phishing SMS Link',
      lastReported: 'Just now',
      notes: msg.fullText,
    };

    setCommunityRadar((prev) => [newItem, ...prev]);
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, isReported: true } : m))
    );
    alert(`Report submitted! "${msg.sender}" has been broadcast to the cross-bank Community Radar.`);
  };

  // Report phone from scam call to radar
  const handleReportScamCallToRadar = (phone: string, reason: string) => {
    const newItem: CommunityRadarItem = {
      id: `radar-${Date.now()}`,
      identifier: phone,
      type: 'scam',
      reportCount: 20,
      reportedBy: 'You & 19 Other Seniors',
      bankSources: ['SBI', 'Bank of Baroda', 'Indian Bank'],
      scamCategory: 'Grandchild Impersonation Call',
      lastReported: 'Just now',
      notes: reason,
    };

    setCommunityRadar((prev) => [newItem, ...prev]);
    alert(`Scam call blocked! "${phone}" has been blacklisted on the cross-bank fraud radar.`);
  };

  // Add new radar report from form
  const handleAddNewRadarReport = (report: Omit<CommunityRadarItem, 'id'>) => {
    const newItem: CommunityRadarItem = {
      ...report,
      id: `radar-${Date.now()}`,
    };
    setCommunityRadar((prev) => [newItem, ...prev]);
    alert('Thank you! Your fraud report helps protect other senior citizens in your area.');
  };

  // Manage trusted contacts
  const handleAddTrustedContact = (contact: Omit<any, 'id'>) => {
    const newContact = { ...contact, id: `tc-${Date.now()}` };
    setSettings((prev) => ({
      ...prev,
      trustedContacts: [...prev.trustedContacts, newContact],
    }));
  };

  const handleRemoveTrustedContact = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      trustedContacts: prev.trustedContacts.filter((c) => c.id !== id),
    }));
  };

  const activeTrustedContact =
    settings.trustedContacts.find((c) => c.isActive) || settings.trustedContacts[0];

  return (
    <div
      className={`min-h-screen ${
        settings.highContrast ? 'high-contrast' : 'bg-slate-100'
      } text-slate-900 ${settings.textSize === 'large' ? 'text-lg' : 'text-base'}`}
    >
      {/* Top Header */}
      <Header
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenDemoBar={() => setIsDemoBarOpen(!isDemoBarOpen)}
        onSimulateCall={() => setIsCallModalOpen(true)}
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
      />

      {/* Demo Scenarios Quick Drawer (Crucial for Hackathon Evaluation) */}
      <DemoScenariosBar
        isOpen={isDemoBarOpen}
        onClose={() => setIsDemoBarOpen(false)}
        language={settings.language}
        onTriggerScenario={handleTriggerScenario}
        onResetDemo={handleResetDemo}
      />

      {/* Main Container */}
      <main className="max-w-xl mx-auto px-4 py-5">
        {activeScreen === 'home' && (
          <HomeScreen
            balance={balance}
            transactions={transactions}
            messages={messages}
            settings={settings}
            onNavigate={setActiveScreen}
            onSelectTransaction={(tx) => {
              const analysis = analyzeTransactionRisk({
                amount: tx.amount,
                payee: {
                  id: 'prev-tx',
                  name: tx.payeeName,
                  upiId: tx.payeeUpi,
                  isFrequent: tx.riskLevel === 'LOW',
                  reputation: tx.riskLevel === 'LOW' ? 'trusted' : 'scam',
                },
                communityRadarList: communityRadar,
              });
              setRiskModalState({
                isOpen: true,
                result: analysis,
                title: `Past Transaction: ${tx.payeeName}`,
              });
            }}
            onTriggerScamCall={() => setIsCallModalOpen(true)}
          />
        )}

        {activeScreen === 'inbox' && (
          <InboxScreen
            messages={messages}
            settings={settings}
            onBack={() => setActiveScreen('home')}
            onReportMessage={handleReportMessageToRadar}
            onInspectRisk={(result, title) => {
              setRiskModalState({
                isOpen: true,
                result,
                title,
                onReport: () => {
                  const targetMsg = messages.find((m) => title.includes(m.sender));
                  if (targetMsg) handleReportMessageToRadar(targetMsg);
                  setRiskModalState({ isOpen: false });
                },
              });
            }}
          />
        )}

        {activeScreen === 'send' && (
          <SendMoneyScreen
            payees={payees}
            communityRadar={communityRadar}
            settings={settings}
            onBack={() => setActiveScreen('home')}
            onSubmitTransaction={handleInitiateTransaction}
          />
        )}

        {activeScreen === 'radar' && (
          <CommunityRadarScreen
            radarItems={communityRadar}
            settings={settings}
            onBack={() => setActiveScreen('home')}
            onAddNewReport={handleAddNewRadarReport}
          />
        )}

        {activeScreen === 'contacts' && (
          <TrustedContactsScreen
            contacts={settings.trustedContacts}
            settings={settings}
            onBack={() => setActiveScreen('home')}
            onAddContact={handleAddTrustedContact}
            onRemoveContact={handleRemoveTrustedContact}
          />
        )}

        {activeScreen === 'settings' && (
          <SettingsScreen
            settings={settings}
            onBack={() => setActiveScreen('home')}
            onUpdateSettings={handleUpdateSettings}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
        unreadCount={messages.filter((m) => !m.isRead).length}
        settings={settings}
      />

      {/* Modals & Dialogs */}

      {/* Feature 1: Explainable AI Risk Card Modal */}
      {riskModalState.isOpen && riskModalState.result && (
        <RiskAlertModal
          isOpen={riskModalState.isOpen}
          onClose={() => setRiskModalState({ isOpen: false })}
          result={riskModalState.result}
          language={settings.language}
          contextTitle={riskModalState.title}
          onProceed={riskModalState.onProceed}
          proceedLabel={riskModalState.proceedLabel}
          onReportToRadar={riskModalState.onReport}
        />
      )}

      {/* Feature 2: Cooling Companion Modal */}
      {coolingModalState.isOpen && coolingModalState.payee && (
        <CoolingCompanionModal
          isOpen={coolingModalState.isOpen}
          onClose={() => setCoolingModalState({ isOpen: false, amount: 0 })}
          onConfirmProceed={handleCoolingProceed}
          onCancelTransfer={() => {
            setCoolingModalState({ isOpen: false, amount: 0 });
            alert('Transfer cancelled safely. No money was sent.');
          }}
          amount={coolingModalState.amount}
          payeeName={coolingModalState.payee.name}
          payeeUpi={coolingModalState.payee.upiId}
          language={settings.language}
        />
      )}

      {/* Feature 3: Trusted Contact Loop Modal */}
      {approvalModalState.isOpen && approvalModalState.payee && (
        <TrustedContactApprovalModal
          isOpen={approvalModalState.isOpen}
          onClose={() => setApprovalModalState({ isOpen: false, amount: 0 })}
          trustedContact={activeTrustedContact}
          amount={approvalModalState.amount}
          payeeName={approvalModalState.payee.name}
          payeeUpi={approvalModalState.payee.upiId}
          language={settings.language}
          onApprove={handleTrustedApproval}
          onDecline={handleTrustedDecline}
        />
      )}

      {/* Feature 6: PIN Entry & Silent SOS Duress Modal */}
      {pinModalState.isOpen && pinModalState.payee && (
        <PinEntryModal
          isOpen={pinModalState.isOpen}
          onClose={() => setPinModalState({ isOpen: false, amount: 0 })}
          amount={pinModalState.amount}
          payeeName={pinModalState.payee.name}
          payeeUpi={pinModalState.payee.upiId}
          settings={settings}
          onSuccess={handlePinSuccess}
        />
      )}

      {/* Feature 5: Grandchild Call Simulator Modal */}
      <GrandchildCallModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        settings={settings}
        onReportNumber={handleReportScamCallToRadar}
      />

      {/* Feature 6 & 7: Bank Security Room Telemetry Modal */}
      <AdminBankViewModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        duressLogs={duressLogs}
        communityRadar={communityRadar}
      />

      {/* Transaction Receipt & Success Modal */}
      {successModalState.isOpen && (
        <TransactionSuccessModal
          isOpen={successModalState.isOpen}
          onClose={() => {
            setSuccessModalState({
              isOpen: false,
              amount: 0,
              payeeName: '',
              payeeUpi: '',
              isDuress: false,
            });
            setActiveScreen('home');
          }}
          amount={successModalState.amount}
          payeeName={successModalState.payeeName}
          payeeUpi={successModalState.payeeUpi}
          isDuress={successModalState.isDuress}
          language={settings.language}
          onOpenAdmin={() => {
            setSuccessModalState((prev) => ({ ...prev, isOpen: false }));
            setIsAdminOpen(true);
          }}
        />
      )}
    </div>
  );
}
