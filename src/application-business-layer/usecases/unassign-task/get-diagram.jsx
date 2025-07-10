import { getToken } from "@/framework-drivers/token/tokenService";

export async function getDiagram(id) {
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
      throw new Error(result.message || "Failed to fetch diagram");
    }

    return result;
  } catch (error) {
    console.error("Error fetching diagram:", error);
    return null;
  }
}