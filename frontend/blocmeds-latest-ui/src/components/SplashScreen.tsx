import { useEffect, useState } from "react";
import { QrCode } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] z-50 flex flex-col items-center justify-center">
      <div className="animate-pulse mb-8">
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl bg-primary/30 blur-2xl animate-pulse" />
          <div className="relative glass-card p-8 rounded-3xl">
            <QrCode className="w-24 h-24 text-primary animate-spin" style={{ animationDuration: '3s' }} />
          </div>
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        BlocMeds QR
      </h1>
      <p className="text-muted-foreground mb-8">Verify. Earn. Protect.</p>

      <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
