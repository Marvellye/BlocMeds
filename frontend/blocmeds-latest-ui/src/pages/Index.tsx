import { useState, useEffect } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import { Onboarding } from "@/components/Onboarding";
import { BottomNav } from "@/components/BottomNav";
import { HomePage } from "./HomePage";
import { ScanPage } from "./ScanPage";
import { GeneratePage } from "./GeneratePage";
import { ReportPage } from "./ReportPage";
import { ProfilePage } from "./ProfilePage";
import { getUser, saveUser, updateUser, defaultUser, UserData } from "@/lib/storage";
import { DrugVerificationResult } from "@/lib/mockData";
import { Toaster } from "@/components/ui/sonner";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const existingUser = getUser();
    if (existingUser) {
      setUser(existingUser);
      setShowOnboarding(false);
    } else {
      setShowOnboarding(true);
    }
  }, []);

  useEffect(() => {
    if (user) {
      document.documentElement.classList.toggle('dark', user.darkMode);
    }
  }, [user?.darkMode]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleOnboardingComplete = (username: string) => {
    const newUser: UserData = {
      ...defaultUser,
      username,
    };
    saveUser(newUser);
    setUser(newUser);
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    const newUser: UserData = {
      ...defaultUser,
      username: 'User',
    };
    saveUser(newUser);
    setUser(newUser);
    setShowOnboarding(false);
  };

  const handleScanComplete = (result: DrugVerificationResult) => {
    if (!user) return;

    const updates: Partial<UserData> = {
      scans: user.scans + 1,
      balance: user.balance + result.reward,
    };

    if (result.status === 'verified') {
      updates.streak = user.streak + 1;
      updates.recentActivity = [
        `Scanned ${result.batchId} - Verified +${result.reward} ETH`,
        ...user.recentActivity,
      ].slice(0, 10);
      updates.transactions = [
        `Scan reward: +${result.reward} ETH`,
        ...user.transactions,
      ].slice(0, 20);

      // Check for achievements
      if ((user.scans + 1) % 10 === 0) {
        updates.achievements = [
          ...user.achievements,
          `${user.scans + 1}x Verifier`,
        ];
      }
    }

    const updatedUser = updateUser(updates);
    setUser(updatedUser);
  };

  const handleGenerate = (batchId: string) => {
    if (!user) return;

    const updates: Partial<UserData> = {
      generatedHistory: [batchId, ...user.generatedHistory].slice(0, 10),
      recentActivity: [
        `Generated QR for ${batchId}`,
        ...user.recentActivity,
      ].slice(0, 10),
    };

    const updatedUser = updateUser(updates);
    setUser(updatedUser);
  };

  const handleReport = (batchId: string, description: string) => {
    if (!user) return;

    const updates: Partial<UserData> = {
      reports: user.reports + 1,
      balance: user.balance + 50,
      reportsHistory: [batchId, ...user.reportsHistory].slice(0, 10),
      recentActivity: [
        `Reported fake ${batchId} +50 ETH`,
        ...user.recentActivity,
      ].slice(0, 10),
      transactions: [
        `Fake report reward: +50 ETH`,
        ...user.transactions,
      ].slice(0, 20),
    };

    const updatedUser = updateUser(updates);
    setUser(updatedUser);
  };

  const handleUpdateSettings = (settings: Partial<UserData>) => {
    if (!user) return;
    const updatedUser = updateUser(settings);
    setUser(updatedUser);
  };

  const handleToggleDarkMode = () => {
    if (!user) return;
    handleUpdateSettings({ darkMode: !user.darkMode });
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (showOnboarding || !user) {
    return (
      <Onboarding
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    );
  }

  return (
    <div className="min-h-screen">
      {currentPage === "home" && (
        <HomePage
          user={user}
          darkMode={user.darkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onNavigate={setCurrentPage}
        />
      )}
      {currentPage === "scan" && (
        <ScanPage
          onScanComplete={handleScanComplete}
          scans={user.scans}
          streak={user.streak}
        />
      )}
      {currentPage === "generate" && (
        <GeneratePage
          onGenerate={handleGenerate}
          generatedHistory={user.generatedHistory}
        />
      )}
      {currentPage === "report" && (
        <ReportPage
          onReport={handleReport}
          reportsHistory={user.reportsHistory}
        />
      )}
      {currentPage === "profile" && (
        <ProfilePage
          user={user}
          onUpdateSettings={handleUpdateSettings}
        />
      )}

      <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
      <Toaster />
    </div>
  );
};

export default Index;
