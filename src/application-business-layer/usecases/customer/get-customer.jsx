import { getToken } from "@/framework-drivers/token/tokenService";

export async function getCustomers() {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    return [];
  }

  try {
    // const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : "";
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

    return Array.isArray(data.user) ? data.user : [];
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}
