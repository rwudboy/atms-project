

export async function resendOTPUseCase(email) {

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resendotp`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok || !data.user?.status) {
      throw new Error(data.user?.message || `Failed to resend OTP: ${response.status}`);
    }

    return data.user; // return the inner object directly
  } catch (error) {
    console.error("Error resending OTP:", error);
    throw error;
  }
}
