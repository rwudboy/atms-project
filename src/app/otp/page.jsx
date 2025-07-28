"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/interface-adapters/components/ui/card";
import { Button } from "@/interface-adapters/components/ui/button";
import { Shield, ArrowLeft, RotateCcw } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/interface-adapters/components/ui/input-otp";
import { resendOTPUseCase } from "@/framework-drivers/api/resend-otp/resendotp";
import { otpUserUseCase } from "@/framework-drivers/api/otp/otpUser";

const RESEND_DELAY = 5 * 60; // 5 minutes in seconds

export default function OTPPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Restore countdown on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("registeredEmail");
    const lastResend = localStorage.getItem("lastResend");

    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      Swal.fire({
        icon: "error",
        title: "No email found",
        text: "Please register first",
        confirmButtonText: "Go to Register",
      }).then(() => {
        window.location.href = "/register";
      });
    }

    if (lastResend) {
      const elapsed = Math.floor((Date.now() - parseInt(lastResend)) / 1000);
      if (elapsed < RESEND_DELAY) {
        setCountdown(RESEND_DELAY - elapsed);
      }
    }
  }, []);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          const next = prev - 1;
          if (next <= 0) {
            localStorage.removeItem("lastResend");
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

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
        localStorage.removeItem("registeredEmail");
        localStorage.removeItem("lastResend");
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

  const handleResendOTP = async () => {
    if (!email) {
      Swal.fire("Error", "Email not found. Please register again.", "error");
      return;
    }

    setResending(true);
    try {
      const result = await resendOTPUseCase(email);

      if (result.status) {
        toast.success(result.message || "OTP resent successfully!");
        const now = Date.now();
        localStorage.setItem("lastResend", now.toString());
        setCountdown(RESEND_DELAY);
      } else {
        throw new Error(result.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error(error.message || "Failed to resend OTP");
      console.error("Resend OTP error:", error);
    } finally {
      setResending(false);
    }
  };

  const handleBackToLogin = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will need to register again if you go back.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, go back",
      cancelButtonText: "No, stay here",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("registeredEmail");
        localStorage.removeItem("lastResend");
        window.location.href = "/login";
      }
    });
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
              {email && (
                <CardDescription className="mt-2">
                  We've sent a 5-digit verification code to {email}. Please enter it below to
                  continue.
                </CardDescription>
              )}
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
              <p className="text-sm text-muted-foreground">Didn't receive the code?</p>
              <Button
                variant="outline"
                disabled={resending || countdown > 0}
                onClick={handleResendOTP}
                className="font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                type="button"
              >
                <RotateCcw className={`w-4 h-4 mr-2 ${resending ? "animate-spin" : ""}`} />
                {resending
                  ? "Resending..."
                  : countdown > 0
                  ? `Wait ${Math.floor(countdown / 60)
                      .toString()
                      .padStart(1, "0")}:${(countdown % 60).toString().padStart(2, "0")}`
                  : "Resend verification code"}
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
