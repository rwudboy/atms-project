import { otpUserUseCase } from "@/framework-drivers/api/otp";

export const verifyOtpUseCase = async ({ otp }) => {
  return await otpUserUseCase({ otp });
};
