import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      toast.error("Veuillez entrer votre numéro de téléphone");
      return;
    }
    setOtpSent(true);
    toast.success("Code OTP envoyé par SMS");
    
    // Simulate timer
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      toast.success("Connexion réussie");
      navigate("/dashboard");
    } else {
      toast.error("Code OTP invalide");
    }
  };

  const handleResend = () => {
    setTimer(60);
    toast.success("Nouveau code OTP envoyé");
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-tekhe p-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--tekhe-red))] via-[hsl(var(--tekhe-orange))] to-[hsl(var(--tekhe-green))] bg-clip-text text-transparent">
            TEKHE
          </CardTitle>
          <CardDescription>
            Plateforme de suivi district/région
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!otpSent ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+221 77 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Envoyer OTP
              </Button>
              <div className="text-center text-xs text-muted-foreground space-x-4">
                <a href="#" className="hover:underline">CGU</a>
                <a href="#" className="hover:underline">Confidentialité</a>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Label>Code OTP</Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                {timer > 0 ? (
                  <span>Renvoyer dans {timer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-primary hover:underline"
                  >
                    Renvoyer le code
                  </button>
                )}
              </div>
              <Button type="submit" className="w-full">
                Vérifier
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
