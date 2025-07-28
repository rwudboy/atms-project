"use client";

import { useState } from "react";
import { verifyOtpUseCase } from "@/application-business-layer/usecases/otp/verifyOtpUseCase";
import { resendOtpUseCase } from "@/application-business-layer/usecases/otp/resendOtpUseCase";

import { isValidOTP } from "@/enterprise-business-rules/validation/otp/otp-validation";

export default function OtpPage({ email }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    if (!isValidOTP(otp)) {
      setError("OTP must be 5 digits.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await verifyOtpUseCase({ otp });
      setSuccess("OTP verified successfully.");
      console.log("Verification success:", data);
    } catch (err) {
      setError(err.message || "Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Email is required to resend OTP.");
      return;
    }

    setResendLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await resendOtpUseCase(email);
      setSuccess("OTP resent successfully to your email.");
      console.log("Resend result:", data);
    } catch (err) {
      setError(err.message || "Failed to resend OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Verify OTP</h1>

        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
        {success && <div className="mb-4 text-green-600 text-sm">{success}</div>}

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 5-digit OTP"
          maxLength={5}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="text-center mt-6 text-sm text-gray-600">Didn’t receive the code?</div>

        <button
          onClick={handleResend}
          disabled={resendLoading}
          className={`mt-2 w-full py-2 px-4 rounded-lg border text-blue-600 ${
            resendLoading ? "border-gray-300" : "border-blue-600 hover:bg-blue-50"
          }`}
        >
          {resendLoading ? "Resending..." : "Resend OTP"}
        </button>
      </div>
    </div>
  );
}
