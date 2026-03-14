import { useState, useEffect } from "react";
import { PageWrapper } from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Html5QrcodeScanner } from "html5-qrcode";
import { verifyDrug, DrugVerificationResult } from "@/lib/mockData";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { CheckCircle2, XCircle, AlertCircle, Camera, Flame } from "lucide-react";

interface ScanPageProps {
  onScanComplete: (result: DrugVerificationResult) => void;
  scans: number;
  streak: number;
}

export const ScanPage = ({ onScanComplete, scans, streak }: ScanPageProps) => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<DrugVerificationResult | null>(null);
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);

  const startScanning = () => {
    setScanning(true);
    setResult(null);
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.clear();
      setScanning(false);
    }
  };

  useEffect(() => {
    if (scanning && !scanner) {
      const qrScanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      qrScanner.render(
        async (decodedText) => {
          qrScanner.clear();
          setScanning(false);
          
          // Verify the scanned code
          const verification = await verifyDrug(decodedText);
          setResult(verification);
          onScanComplete(verification);

          if (verification.status === 'verified') {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
            toast.success(`Verified! +${verification.reward} ETH earned`);
            
            // Voice feedback
            if ('speechSynthesis' in window) {
              const utterance = new SpeechSynthesisUtterance(`Verified! Earned ${verification.reward} ETH`);
              speechSynthesis.speak(utterance);
            }
          } else if (verification.status === 'fake') {
            toast.error("Fake drug detected! Please report it.");
          } else {
            toast.error("Invalid QR code");
          }
        },
        (error) => {
          console.error("Scan error:", error);
        }
      );

      setScanner(qrScanner);
    }

    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [scanning, scanner, onScanComplete]);

  return (
    <PageWrapper>
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Scan QR Code</h1>
        <p className="text-muted-foreground">Point your camera at the drug package</p>
        
        <div className="flex gap-4 mt-4">
          <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-2">
            <Camera className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Scans: {scans}</span>
          </div>
          <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-semibold">Streak: {streak}</span>
          </div>
        </div>
      </header>

      {!scanning && !result && (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="glass-card p-8 rounded-3xl mb-6 w-full max-w-sm">
            <Camera className="w-24 h-24 mx-auto mb-4 text-primary" />
            <p className="text-center text-muted-foreground mb-6">
              Ready to scan a drug package QR code
            </p>
            <Button
              onClick={startScanning}
              className="w-full h-14 text-lg hover-scale"
              size="lg"
            >
              Start Scanning
            </Button>
          </div>
        </div>
      )}

      {scanning && (
        <div className="space-y-4">
          <Card className="glass-card overflow-hidden">
            <CardContent className="p-0">
              <div id="qr-reader" className="w-full"></div>
            </CardContent>
          </Card>
          
          <Button
            onClick={stopScanning}
            variant="destructive"
            className="w-full h-12 hover-scale"
          >
            Stop Scanning
          </Button>

          <div className="glass-card p-4 rounded-xl">
            <p className="text-sm text-center text-muted-foreground animate-pulse">
              🎯 Align the QR code within the frame
            </p>
          </div>
        </div>
      )}

      {result && (
        <Card className={`glass-card border-2 animate-scale-in ${
          result.status === 'verified' ? 'border-success' :
          result.status === 'fake' ? 'border-destructive' :
          'border-muted'
        }`}>
          <CardContent className="p-6">
            <div className="flex flex-col items-center mb-6">
              {result.status === 'verified' && (
                <CheckCircle2 className="w-20 h-20 text-success mb-4" />
              )}
              {result.status === 'fake' && (
                <XCircle className="w-20 h-20 text-destructive mb-4" />
              )}
              {result.status === 'invalid' && (
                <AlertCircle className="w-20 h-20 text-muted-foreground mb-4" />
              )}
              
              <h2 className="text-2xl font-bold mb-2">
                {result.status === 'verified' && 'Verified! ✓'}
                {result.status === 'fake' && 'Fake Detected!'}
                {result.status === 'invalid' && 'Invalid Code'}
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Batch ID</span>
                <span className="font-mono font-semibold">{result.batchId}</span>
              </div>
              
              {result.drugName && (
                <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Drug Name</span>
                  <span className="font-semibold">{result.drugName}</span>
                </div>
              )}
              
              {result.expiry && (
                <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Expiry</span>
                  <span className="font-semibold">{result.expiry}</span>
                </div>
              )}
              
              {result.manufacturer && (
                <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Manufacturer</span>
                  <span className="font-semibold">{result.manufacturer}</span>
                </div>
              )}
              
              {result.tokenId && (
                <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Token ID</span>
                  <span className="font-mono text-xs">{result.tokenId}</span>
                </div>
              )}
              
              {result.reward > 0 && (
                <div className="flex justify-between p-4 bg-primary/20 rounded-lg pulse-glow">
                  <span className="text-sm font-semibold">Reward Earned</span>
                  <span className="text-xl font-bold text-primary">+{result.reward} ETH</span>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-2">
              <Button
                onClick={() => {
                  setResult(null);
                  startScanning();
                }}
                className="w-full h-12 hover-scale"
              >
                Scan Another
              </Button>
              
              {result.status === 'fake' && (
                <Button
                  variant="destructive"
                  className="w-full h-12 hover-scale"
                  onClick={() => {/* Navigate to report page with pre-filled data */}}
                >
                  Report This Fake
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </PageWrapper>
  );
};
