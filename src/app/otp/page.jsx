"use client";

import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/interface-adapters/components/ui/input-otp";
import { Button } from "@/interface-adapters/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/interface-adapters/components/ui/card";
import { Shield, ArrowLeft, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { otpUserUseCase } from "@/interface-adapters/usecases/otp/otpUser";

export default function OTPPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async () => {
    if (otp.length !== 5) {
      Swal.fire("Invalid OTP", "OTP must be 5 digits", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await otpUserUseCase({ otp });

      if (response?.user?.success === true && response?.user?.message === true) {
        await Swal.fire("Success", "OTP verified successfully!", "success");
        window.location.href = "/login";
      } else {
        throw new Error("OTP verification failed");
      }
    } catch (error) {
      Swal.fire("Error", error.message || "Verification failed", "error");
    } finally {
      setLoading(false);
    }
  };





  const handleBackToLogin = () => {
    window.location.href = "/login";
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Verify Your Account</CardTitle>
              <CardDescription className="mt-2">
                We've sent a 5-digit verification code to your email. Please enter it below to continue.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <label className="text-sm font-medium block mb-2">
                Enter verification code
              </label>
              <div className="flex justify-center">
                <InputOTP maxLength={5} value={otp} onChange={setOtp} className="gap-2">
                  <InputOTPGroup className="gap-2">
                    {[0, 1, 2, 3, 4].map((index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="w-12 h-12 text-lg font-semibold"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={otp.length !== 5 || loading}
                className="w-full font-semibold py-3"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </Button>
            </div>

            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?
              </p>
              <Button
                variant="outline"
                disabled={resending}
                className="font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                type="button"
              >
                <RotateCcw className={`w-4 h-4 mr-2 ${resending ? 'animate-spin' : ''}`} />
                {resending ? "Resending..." : "Resend verification code"}
              </Button>
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="ghost"
                onClick={handleBackToLogin}
                className="w-full font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}