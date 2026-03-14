import { PageWrapper } from "@/components/PageWrapper";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserData } from "@/lib/storage";
import { leaderboard } from "@/lib/mockData";
import { Camera, QrCode, Flag, Trophy, TrendingUp, Award, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface HomePageProps {
  user: UserData;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigate: (page: string) => void;
}

export const HomePage = ({ user, darkMode, onToggleDarkMode, onNavigate }: HomePageProps) => {
  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Gold': return 'text-yellow-500';
      case 'Silver': return 'text-gray-400';
      default: return 'text-orange-600';
    }
  };

  return (
    <PageWrapper>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            BlocMeds QR
          </h1>
          <p className="text-sm text-muted-foreground">Welcome back, {user.username || 'User'}</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="glass-card px-4 py-2 rounded-full">
            <span className="text-sm font-semibold">{user.balance} ETH</span>
          </div>
          <DarkModeToggle darkMode={darkMode} onToggle={onToggleDarkMode} />
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Balance Card */}
        <Card className="glass-card border-2 col-span-2 pulse-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="w-5 h-5 text-primary" />
              ETH Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">{user.balance}</p>
            <p className="text-sm text-muted-foreground mt-1">Available for withdrawal</p>
          </CardContent>
        </Card>

        {/* Trust Score */}
        <Card className="glass-card hover-scale">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4" />
              Trust Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${user.trustScore * 17.6} 176`}
                    className="text-primary"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                  {user.trustScore}
                </span>
              </div>
              <div>
                <p className={`text-xl font-bold ${getRankColor(user.rank)}`}>{user.rank}</p>
                <p className="text-xs text-muted-foreground">Rank</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Streak */}
        <Card className="glass-card hover-scale">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Award className="w-4 h-4" />
              Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{user.streak} 🔥</p>
            <p className="text-xs text-muted-foreground mt-1">Days active</p>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-card col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {user.recentActivity.slice(0, 5).map((activity, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1" />
                  <p className="text-muted-foreground">{activity}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="glass-card col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Trophy className="w-4 h-4" />
              Leaderboard Top 5
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leaderboard.map((entry, i) => (
                <div
                  key={i}
                  className={`flex justify-between items-center p-2 rounded-lg ${
                    entry.username === user.username ? 'bg-primary/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold w-6">#{i + 1}</span>
                    <span className="text-sm">{entry.username}</span>
                  </div>
                  <span className="text-sm font-semibold">{entry.score}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => onNavigate('scan')}
          className="h-16 text-base hover-scale"
          variant="default"
        >
          <Camera className="w-5 h-5 mr-2" />
          Scan QR
        </Button>
        <Button
          onClick={() => onNavigate('generate')}
          className="h-16 text-base hover-scale"
          variant="secondary"
        >
          <QrCode className="w-5 h-5 mr-2" />
          Generate
        </Button>
        <Button
          onClick={() => onNavigate('report')}
          className="h-16 text-base hover-scale"
          variant="outline"
        >
          <Flag className="w-5 h-5 mr-2" />
          Report
        </Button>
        <Button
          onClick={() => onNavigate('profile')}
          className="h-16 text-base hover-scale"
          variant="outline"
        >
          <Trophy className="w-5 h-5 mr-2" />
          Rewards
        </Button>
      </div>
    </PageWrapper>
  );
};
