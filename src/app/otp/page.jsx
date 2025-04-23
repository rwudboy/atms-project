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
    alert(`Your entered email OTP is: ${otp}`);
    // Here you can add email OTP verification logic or navigation
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Email Verification</h1>
          <p className="text-sm text-gray-500">
            We've sent a 6-digit verification code to your email. <br />
            Please enter it below to continue.
          </p>
        </div>

        <div className="flex justify-center">
          <InputOTP maxLength={5} value={otp} onChange={handleChange}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSeparator />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
        >
          Verify Email
        </button>

        <p className="text-center text-xs text-gray-400">
          Didn’t receive the code? <a href="#" className="text-blue-600 hover:underline">Resend</a>
        </p>
      </form>
    </main>
  );
}
