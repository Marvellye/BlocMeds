import { useState } from 'react';
import { Shield, CheckCircle, Ban, Wallet, Key } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { manufacturerAPI } from '@/lib/api';

interface VerificationResult {
  type: 'success' | 'error';
  title: string;
  message: string;
  show: boolean;
}

const VerifyManufacturer = () => {
  const [manufacturerAddress, setManufacturerAddress] = useState('');
  const [regulatorPrivateKey, setRegulatorPrivateKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [result, setResult] = useState<VerificationResult>({
    type: 'success',
    title: '',
    message: '',
    show: false
  });
  const { toast } = useToast();

  const validateInputs = () => {
    if (!manufacturerAddress.trim()) {
      toast({
        title: "Validation Error",
        description: "Manufacturer wallet address is required",
        variant: "destructive"
      });
      return false;
    }

    if (!regulatorPrivateKey.trim()) {
      toast({
        title: "Validation Error",
        description: "Regulator private key is required",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleVerify = async () => {
    if (!validateInputs()) return;

    setIsVerifying(true);
    setResult({ ...result, show: false });

    const response = await manufacturerAPI.verify(manufacturerAddress, regulatorPrivateKey);

    if (response.success) {
      setResult({
        type: 'success',
        title: 'Manufacturer Verified!',
        message: `Address ${manufacturerAddress} verified successfully!\n\nTransaction Hash: ${response.transactionHash}\nStatus: Active\nNetwork: Base Testnet`,
        show: true
      });

      toast({
        title: "Success",
        description: "Manufacturer verified on Base network!",
      });
    } else {
      toast({
        title: "Verification Failed",
        description: response.error || "An error occurred during verification.",
        variant: "destructive"
      });
    }

    setIsVerifying(false);
  };

  const handleRevoke = async () => {
    if (!validateInputs()) return;

    setIsRevoking(true);
    setResult({ ...result, show: false });

    const response = await manufacturerAPI.revoke(manufacturerAddress, regulatorPrivateKey);

    if (response.success) {
      setResult({
        type: 'error',
        title: 'Access Revoked!',
        message: `Address ${manufacturerAddress} has been revoked.\n\nTransaction Hash: ${response.transactionHash}\nStatus: Inactive\nNetwork: Base Testnet`,
        show: true
      });

      toast({
        title: "Access Revoked",
        description: "Manufacturer access has been revoked.",
      });
    } else {
      toast({
        title: "Revocation Failed",
        description: response.error || "An error occurred during revocation.",
        variant: "destructive"
      });
    }

    setIsRevoking(false);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Verify Manufacturers
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage manufacturer verification using Base smart contracts
        </p>
      </div>

      <Card className="glass-effect border-none shadow-glass max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Manufacturer Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="manufacturerAddress" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Manufacturer Wallet Address
              </Label>
              <Input
                id="manufacturerAddress"
                type="text"
                placeholder="e.g., 0.0.XXXXX"
                value={manufacturerAddress}
                onChange={(e) => setManufacturerAddress(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="regulatorPrivateKey" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Regulator Private Key
              </Label>
              <Input
                id="regulatorPrivateKey"
                type="password"
                placeholder="Enter regulator private key"
                value={regulatorPrivateKey}
                onChange={(e) => setRegulatorPrivateKey(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleVerify}
              disabled={isVerifying || isRevoking}
              className="flex-1 h-12 rounded-xl gradient-primary text-white shadow-hover hover:scale-[1.02] transition-smooth"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verify Manufacturer
                </>
              )}
            </Button>

            <Button
              onClick={handleRevoke}
              disabled={isVerifying || isRevoking}
              variant="destructive"
              className="flex-1 h-12 rounded-xl shadow-hover hover:scale-[1.02] transition-smooth"
            >
              {isRevoking ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Revoking...
                </>
              ) : (
                <>
                  <Ban className="h-4 w-4 mr-2" />
                  Revoke Access
                </>
              )}
            </Button>
          </div>

          {result.show && (
            <div
              className={`p-6 rounded-xl border animate-fade-in-up ${
                result.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    result.type === 'success'
                      ? 'bg-green-100 dark:bg-green-900/40'
                      : 'bg-red-100 dark:bg-red-900/40'
                  }`}
                >
                  {result.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <Ban className="h-5 w-5 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-semibold mb-2 ${
                      result.type === 'success'
                        ? 'text-green-900 dark:text-green-400'
                        : 'text-red-900 dark:text-red-400'
                    }`}
                  >
                    {result.title}
                  </h3>
                  <p
                    className={`text-sm whitespace-pre-line ${
                      result.type === 'success'
                        ? 'text-green-800 dark:text-green-300'
                        : 'text-red-800 dark:text-red-300'
                    }`}
                  >
                    {result.message}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glass-effect border-none shadow-glass max-w-2xl">
        <CardHeader>
          <CardTitle>About Manufacturer Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Verify Manufacturer:</strong> Grant access to a manufacturer's
              wallet address, allowing them to upload batch information to the Base network.
            </p>
            <p>
              <strong className="text-foreground">Revoke Access:</strong> Remove verification status from a
              manufacturer, preventing them from uploading new batches.
            </p>
            <p>
              <strong className="text-foreground">Security:</strong> All verification transactions are recorded
              on the Base Consensus Service for complete transparency and immutability.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyManufacturer;