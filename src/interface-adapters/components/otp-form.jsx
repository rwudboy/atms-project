"use client";

import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/interface-adapters/components/ui/input-otp";

export default function OTPPage() {
  const [otp, setOtp] = useState("");

  const handleChange = (value) => {
    setOtp(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Entered OTP: ${otp}`);
    // You can route or validate here
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-md"
      >
        <h1 className="text-2xl font-bold text-center">Enter OTP</h1>
        <p className="text-center text-sm text-muted-foreground">
          We’ve sent a 6-digit code to your email/phone.
        </p>

        <InputOTP maxLength={6} value={otp} onChange={handleChange}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSeparator />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
        >
          Verify
        </button>
      </form>
    </main>
  );
}
