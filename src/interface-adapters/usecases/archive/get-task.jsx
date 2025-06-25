import { getToken } from "@/framework-drivers/token/tokenService";

export async function getTasks() {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    return [];
  }

  try {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch project");
    }

    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error("Error fetching project:", error);
    return [];
  }
}
