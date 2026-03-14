import { useState, useRef, useEffect } from "react";
import { PageWrapper } from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import QRCode from "qrcode";
import { toast } from "sonner";
import { Download, Share2, QrCode as QrIcon } from "lucide-react";

interface GeneratePageProps {
  onGenerate: (batchId: string) => void;
  generatedHistory: string[];
}

export const GeneratePage = ({ onGenerate, generatedHistory }: GeneratePageProps) => {
  const [batchId, setBatchId] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = async () => {
    if (!batchId.trim()) {
      toast.error("Please enter a batch ID");
      return;
    }

    try {
      const dataUrl = await QRCode.toDataURL(batchId, {
        width: 256,
        margin: 2,
        color: {
          dark: "#0000FF",
          light: "#FFFFFF",
        },
      });
      
      setQrDataUrl(dataUrl);
      onGenerate(batchId);
      toast.success("QR code generated successfully!");
    } catch (error) {
      toast.error("Failed to generate QR code");
      console.error(error);
    }
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    
    const link = document.createElement("a");
    link.download = `blocmeds-${batchId}.png`;
    link.href = qrDataUrl;
    link.click();
    toast.success("QR code downloaded!");
  };

  const shareQR = async () => {
    if (!qrDataUrl) return;

    try {
      const blob = await (await fetch(qrDataUrl)).blob();
      const file = new File([blob], `blocmeds-${batchId}.png`, { type: "image/png" });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "BlocMeds QR Code",
          text: `Batch ID: ${batchId}`,
        });
        toast.success("QR code shared!");
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(batchId);
        toast.success("Batch ID copied to clipboard!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to share QR code");
    }
  };

  return (
    <PageWrapper>
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Generate QR Code</h1>
        <p className="text-muted-foreground">Create QR codes for verified drug batches</p>
      </header>

      <div className="space-y-6">
        <Card className="glass-card">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Batch ID</label>
              <Input
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                placeholder="Enter batch ID (e.g., RX-2024-001A)"
                className="h-12"
                list="batch-history"
              />
              <datalist id="batch-history">
                {generatedHistory.map((id, i) => (
                  <option key={i} value={id} />
                ))}
              </datalist>
            </div>

            <Button
              onClick={generateQR}
              className="w-full h-12 hover-scale"
              size="lg"
            >
              <QrIcon className="w-5 h-5 mr-2" />
              Generate QR Code
            </Button>
          </CardContent>
        </Card>

        {qrDataUrl && (
          <Card className="glass-card animate-scale-in">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-center">
                <div className="glass-card p-4 rounded-2xl">
                  <img
                    src={qrDataUrl}
                    alt="Generated QR Code"
                    className="w-64 h-64 hover-scale"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={downloadQR}
                  variant="secondary"
                  className="h-12 hover-scale"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={shareQR}
                  variant="secondary"
                  className="h-12 hover-scale"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button>
              </div>

              <div className="glass-card p-4 rounded-xl">
                <p className="text-sm text-center">
                  <span className="text-muted-foreground">Batch ID: </span>
                  <span className="font-mono font-semibold">{batchId}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {generatedHistory.length > 0 && (
          <Card className="glass-card">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <QrIcon className="w-5 h-5" />
                Recent Generated
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {generatedHistory.slice(-5).reverse().map((id, i) => (
                  <button
                    key={i}
                    onClick={() => setBatchId(id)}
                    className="w-full text-left p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <p className="font-mono text-sm">{id}</p>
                    <p className="text-xs text-muted-foreground">Tap to regenerate</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageWrapper>
  );
};
