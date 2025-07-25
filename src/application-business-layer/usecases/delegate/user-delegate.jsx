import { getToken } from "@/framework-drivers/token/tokenService";

export async function getUsers(id) {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    return [];
  }

  try {
    const query = id ? `?intanceid=${encodeURIComponent(id)}` : "";
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/workgroup${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch user");
    }

    return data


  } catch (error) {
    console.error("Error fetching user:", error);
    return [];
  }
}              