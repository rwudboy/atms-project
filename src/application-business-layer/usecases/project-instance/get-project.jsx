import { getToken } from "@/framework-drivers/token/tokenService";

export async function getProjects() {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    return [];
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projek/definition`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });

    const result = await response.json();


    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch projects");
    }

    return Array.isArray(result.data) ? result.data : [];

    
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}
