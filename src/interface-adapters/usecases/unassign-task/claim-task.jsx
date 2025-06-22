import { getToken } from "@/framework-drivers/token/tokenService";

export async function ClaimTask(id) {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    return { status: false, message: "No token provided", data: null };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/${id}/claim`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const result = await response.json();

    return {
      status: result.status ?? false,
      message: result.message ?? "Unknown error",
      data: result.data ?? null,
    };
    
  } catch (error) {
    console.error("Error claiming task:", error);
    return {
      status: false,
      message: "Failed to claim task",
      data: null,
    };
  }
}
