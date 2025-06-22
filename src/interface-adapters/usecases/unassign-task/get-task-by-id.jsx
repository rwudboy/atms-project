import { getToken } from "@/framework-drivers/token/tokenService";

export async function getTaskById(id) {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    return null;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch task");
    }

    return result.data || null;
  } catch (error) {
    console.error("Error fetching task:", error);
    return null;
  }
}
