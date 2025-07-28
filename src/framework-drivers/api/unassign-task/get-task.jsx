import { getToken } from "@/framework-drivers/token/tokenService";

export async function getTasks() {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    return [];
  }

  try {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projek/Unassigned`, {
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

    return result

    
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}
