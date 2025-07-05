import { getToken } from "@/framework-drivers/token/tokenService";


export async function getWorkgroups(searchTerm = "") {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    return [];
  }

  try {
    const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : "";
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workgroup${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch workgroups");
    }

    return Array.isArray(data.workgroup) ? data.workgroup : [];
  } catch (error) {
    console.error("Error fetching workgroups:", error);
    return [];
  }
}
