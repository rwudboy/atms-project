import { getToken } from "@/framework-drivers/token/tokenService";

export async function getUsers() {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    return [];
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/workgroup`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });

    const result = await response.json();

    // Fixed validation logic to match your API response structure
    if (!response.ok || !result.data || !Array.isArray(result.data)) {
      throw new Error(result.message || "Failed to fetch users");
    }

    return result;
  } catch (error) {
    console.error("Error fetching users:", error);
    return { data: [] }; // Return consistent structure
  }
}