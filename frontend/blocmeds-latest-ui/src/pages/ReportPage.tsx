import { useState } from "react";
import { PageWrapper } from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Flag, Upload, Mic, CheckCircle2 } from "lucide-react";

interface ReportPageProps {
  onReport: (batchId: string, description: string) => void;
  reportsHistory: string[];
}

export const ReportPage = ({ onReport, reportsHistory }: ReportPageProps) => {
  const [batchId, setBatchId] = useState("");
  const [description, setDescription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.success("Image uploaded");
    }
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error("Voice input not supported in this browser");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.onstart = () => {
      setIsRecording(true);
      toast.info("Listening... Speak now");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setDescription(prev => prev + " " + transcript);
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
      toast.error("Voice input failed");
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleSubmit = async () => {
    if (!batchId.trim() || !description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    onReport(batchId, description);
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    toast.success("Report submitted! +50 ETH earned");
    
    // Voice feedback
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Report submitted! Earned 50 ETH");
      speechSynthesis.speak(utterance);
    }

    setBatchId("");
    setDescription("");
    setIsSubmitting(false);
  };

  return (
    <PageWrapper>
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Report Fake Drug</h1>
        <p className="text-muted-foreground">Help protect others by reporting counterfeit medications</p>
      </header>

      <div className="space-y-6">
        <Card className="glass-card">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Batch ID</label>
              <Input
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                placeholder="Enter batch ID of fake drug"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Description</label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={startVoiceInput}
                  disabled={isRecording}
                  className="hover-scale"
                >
                  <Mic className={`w-4 h-4 mr-2 ${isRecording ? 'text-destructive animate-pulse' : ''}`} />
                  {isRecording ? 'Recording...' : 'Voice Input'}
                </Button>
              </div>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the fake drug, packaging issues, or suspicious details..."
                className="min-h-32"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Photo Evidence (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="block border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
              >
                {imagePreview ? (
                  <div className="space-y-2">
                    <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover mx-auto rounded-lg" />
                    <p className="text-sm text-muted-foreground">Click to change image</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload image</p>
                  </>
                )}
              </label>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full h-14 text-lg hover-scale"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Flag className="w-5 h-5 mr-2" />
                  Submit Report
                </>
              )}
            </Button>

            <div className="glass-card p-4 rounded-xl">
              <p className="text-sm text-center">
                <span className="text-muted-foreground">Reward for verified fake report: </span>
                <span className="font-bold text-primary">+50 ETH</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {reportsHistory.length > 0 && (
          <Card className="glass-card">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Flag className="w-5 h-5" />
                Your Reports
              </h3>
              <div className="space-y-3">
                {reportsHistory.slice(-5).reverse().map((report, i) => (
                  <div key={i} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-mono text-sm font-semibold">{report}</p>
                      <span className="glass-card px-3 py-1 rounded-full text-xs">
                        Pending
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Submitted {new Date().toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageWrapper>
  );
};
