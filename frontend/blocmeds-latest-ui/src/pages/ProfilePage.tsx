import { PageWrapper } from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { UserData } from "@/lib/storage";
import { leaderboard } from "@/lib/mockData";
import { 
  User, 
  Trophy, 
  TrendingUp, 
  Activity, 
  Award, 
  Download, 
  Bell, 
  Moon,
  Share2
} from "lucide-react";
import QRCode from "qrcode";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface ProfilePageProps {
  user: UserData;
  onUpdateSettings: (settings: Partial<UserData>) => void;
}

export const ProfilePage = ({ user, onUpdateSettings }: ProfilePageProps) => {
  const [referralQr, setReferralQr] = useState("");
  const referralCode = `BLOCMEDS-${user.username.substring(0, 3).toUpperCase()}123`;

  useEffect(() => {
    QRCode.toDataURL(referralCode, {
      width: 128,
      margin: 1,
      color: { dark: "#0000FF", light: "#FFFFFF" },
    }).then(setReferralQr);
  }, [referralCode]);

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Gold': return 'text-yellow-500';
      case 'Silver': return 'text-gray-400';
      default: return 'text-orange-600';
    }
  };

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case 'Gold': return '🥇';
      case 'Silver': return '🥈';
      default: return '🥉';
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(user, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `blocmeds-data-${user.username}.json`;
    link.href = url;
    link.click();
    toast.success("Data exported successfully!");
  };

  const shareReferral = async () => {
    const shareData = {
      title: "Join BlocMeds QR",
      text: `Use my referral code: ${referralCode}`,
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Referral shared!");
      } catch (error) {
        navigator.clipboard.writeText(referralCode);
        toast.success("Referral code copied!");
      }
    } else {
      navigator.clipboard.writeText(referralCode);
      toast.success("Referral code copied!");
    }
  };

  return (
    <PageWrapper>
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profile & Rewards</h1>
        <p className="text-muted-foreground">Track your progress and achievements</p>
      </header>

      <div className="space-y-6">
        {/* User Profile Card */}
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{user.username || 'User'}</h2>
                <p className={`text-lg font-semibold ${getRankColor(user.rank)} flex items-center gap-2`}>
                  {getRankIcon(user.rank)} {user.rank} Member
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Trust Score</span>
                </div>
                <p className="text-2xl font-bold">{user.trustScore}</p>
              </div>

              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Total Scans</span>
                </div>
                <p className="text-2xl font-bold">{user.scans}</p>
              </div>

              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Reports</span>
                </div>
                <p className="text-2xl font-bold">{user.reports}</p>
              </div>

              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Streak</span>
                </div>
                <p className="text-2xl font-bold">{user.streak} 🔥</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card className="glass-card">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Transaction History
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {user.transactions.slice(-10).reverse().map((transaction, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    transaction.includes('+') ? 'bg-success' : 'bg-muted-foreground'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm">{transaction}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Referral */}
        <Card className="glass-card">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-primary" />
              Invite & Earn
            </h3>
            <div className="flex flex-col items-center gap-4">
              {referralQr && (
                <div className="glass-card p-3 rounded-2xl">
                  <img src={referralQr} alt="Referral QR" className="w-32 h-32" />
                </div>
              )}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Your referral code</p>
                <p className="font-mono font-bold text-lg">{referralCode}</p>
              </div>
              <Button onClick={shareReferral} className="w-full hover-scale">
                <Share2 className="w-4 h-4 mr-2" />
                Share & Earn ETH
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="glass-card">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold mb-4">Settings</h3>
            
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5" />
                <span className="text-sm font-medium">Notifications</span>
              </div>
              <Switch
                checked={user.notifications}
                onCheckedChange={(checked) => 
                  onUpdateSettings({ notifications: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5" />
                <span className="text-sm font-medium">Dark Mode</span>
              </div>
              <Switch
                checked={user.darkMode}
                onCheckedChange={(checked) => 
                  onUpdateSettings({ darkMode: checked })
                }
              />
            </div>

            <Button
              onClick={exportData}
              variant="outline"
              className="w-full hover-scale"
            >
              <Download className="w-4 h-4 mr-2" />
              Export My Data
            </Button>
          </CardContent>
        </Card>

        {/* Full Leaderboard */}
        <Card className="glass-card">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Global Leaderboard
            </h3>
            <div className="space-y-2">
              {leaderboard.map((entry, i) => (
                <div
                  key={i}
                  className={`flex justify-between items-center p-3 rounded-lg ${
                    entry.username === user.username 
                      ? 'bg-primary/20 border border-primary' 
                      : 'bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold w-8">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                    </span>
                    <span className="font-medium">{entry.username}</span>
                  </div>
                  <span className="font-bold">{entry.score}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
};
