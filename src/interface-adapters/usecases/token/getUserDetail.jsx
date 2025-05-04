import { getToken } from "@/framework-drivers/token/tokenService";

export async function getUserDetail() {
  const token = getToken();
  if (!token) {
    throw new Error("Token not found");
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/`, {
      method: "GET",
      headers: {
        "Accept": "*/*",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch user data");
    }

    return data
  } catch (error) {
    console.error("Error fetching user role:", error);
    throw new Error("Error fetching user role");
  }
}

