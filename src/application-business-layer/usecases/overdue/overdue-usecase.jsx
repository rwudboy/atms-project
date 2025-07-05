import { getToken } from "@/framework-drivers/token/tokenService";

export async function getOverdue() {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    return [];
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/overdue`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch overdue tasks");
    }

    // Fix: Access 'overdue' property instead of 'data'
    return Array.isArray(result.overdue) ? result.overdue : [];
    
  } catch (error) {
    console.error("Error fetching overdue tasks:", error);
    return [];
  }
}