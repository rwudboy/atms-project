import { getToken } from "@/framework-drivers/token/tokenService";

export async function getVendors(searchTerm = "") {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    return [];
  }

  try {
    const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : "";
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch vendors");
    }

    return Array.isArray(data.vendor) ? data.vendor : [];
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return [];
  }
}
