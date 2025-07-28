import { resendOTPUseCase } from "@/framework-drivers/api/resend-otp";

export const resendOtpUseCase = async (email) => {
  return await resendOTPUseCase(email);
};
