import { getToken } from "@/framework-drivers/token/tokenService";

export async function getUsers() {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    return [];
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok || !result.status || !Array.isArray(result.user)) {
      throw new Error(result.message || "Failed to fetch users");
    }

    return result.user;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}
