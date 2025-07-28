export const isValidOTP = (otp) => otp.length === 5 && /^\d{5}$/.test(otp);
