import { getToken } from "@/framework-drivers/token/tokenService";

export async function getCustomers() {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    return [];
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch customers");
    }

    if (Array.isArray(data)) {
      return data.map((item) => item.user).filter(Boolean);
    }

    if (data.user) {
      return [data.user];
    }

    if (data.data && Array.isArray(data.data)) {
      return data.data.map((item) => item.user).filter(Boolean);
    }

    return [];
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}