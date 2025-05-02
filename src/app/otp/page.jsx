"use client";

import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/interface-adapters/components/ui/input-otp";
import { otpUserUseCase } from "@/interface-adapters/usecases/otpUser";
import Swal from "sweetalert2";

export default function OTPPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (value) => {
    setOtp(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 5) {
      Swal.fire("Invalid OTP", "OTP must be 5 digits", "error");
      return;
    }

    setLoading(true);
    try {
      const result = await otpUserUseCase({ otp });
      await Swal.fire("Success", "OTP verified successfully!", "success");
      window.location.href = "/login";
    } catch (error) {
      Swal.fire("Error", error.message || "Verification failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-md"
      >
        <h1 className="text-2xl font-bold text-center">Enter OTP</h1>
        <p className="text-center text-sm text-muted-foreground">
          We’ve sent a 5-digit code to your email/phone.
        </p>
        <div className="flex justify-center">
          <InputOTP maxLength={5} value={otp} onChange={handleChange}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-md px-4 py-2 text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </main>
  );
}
