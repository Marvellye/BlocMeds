import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode, Trophy, Flag, ArrowRight, X } from "lucide-react";

interface OnboardingProps {
  onComplete: (username: string) => void;
  onSkip: () => void;
}

const slides = [
  {
    icon: QrCode,
    title: "Verify Drugs Instantly",
    description: "Scan QR codes on drug packaging to verify authenticity in seconds",
    color: "text-primary",
  },
  {
    icon: Trophy,
    title: "Earn ETH Rewards",
    description: "Get rewarded with ETH cryptocurrency for every verified scan",
    color: "text-accent",
  },
  {
    icon: Flag,
    title: "Report Fakes Safely",
    description: "Help protect others by reporting counterfeit medications anonymously",
    color: "text-destructive",
  },
];

export const Onboarding = ({ onComplete, onSkip }: OnboardingProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [username, setUsername] = useState("");

  const isLastSlide = currentSlide === slides.length;

  const handleNext = () => {
    if (isLastSlide) {
      if (username.trim()) {
        onComplete(username);
      }
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    setCurrentSlide(slides.length);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] z-50 flex items-center justify-center p-4">
      <button
        onClick={onSkip}
        className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Skip onboarding"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="w-full max-w-md">
        {!isLastSlide ? (
          <Card className="glass-card border-2 animate-fade-in-up">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className={`w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center ${slides[currentSlide].color}`}>
                  {(() => {
                    const Icon = slides[currentSlide].icon;
                    return <Icon className="w-12 h-12" />;
                  })()}
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-3">
                    {slides[currentSlide].title}
                  </h2>
                  <p className="text-muted-foreground">
                    {slides[currentSlide].description}
                  </p>
                </div>

                <div className="flex gap-2 justify-center">
                  {slides.map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-full transition-all ${
                        i === currentSlide 
                          ? 'w-8 bg-primary' 
                          : 'w-2 bg-muted'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex gap-3 w-full">
                  {currentSlide > 0 && (
                    <Button
                      onClick={() => setCurrentSlide(prev => prev - 1)}
                      variant="outline"
                      className="flex-1 h-12"
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    onClick={currentSlide === slides.length - 1 ? handleSkip : handleNext}
                    className="flex-1 h-12 hover-scale"
                  >
                    {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="glass-card border-2 animate-fade-in-up">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-white" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-2">Welcome to BlocMeds QR</h2>
                  <p className="text-muted-foreground">
                    Enter your username to get started
                  </p>
                </div>

                <div className="space-y-4">
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="h-12 text-center text-lg"
                    autoFocus
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && username.trim()) {
                        onComplete(username);
                      }
                    }}
                  />

                  <Button
                    onClick={handleNext}
                    disabled={!username.trim()}
                    className="w-full h-12 text-lg hover-scale"
                  >
                    Start Earning ETH
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>

                <div className="glass-card p-4 rounded-xl">
                  <p className="text-sm text-muted-foreground">
                    🎁 Welcome bonus: <span className="font-bold text-primary">100 ETH</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
