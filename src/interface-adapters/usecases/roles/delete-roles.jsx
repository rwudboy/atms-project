import { getToken } from "@/framework-drivers/token/tokenService";

export async function deleteRole(roleId) {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    throw new Error("No token found.");
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/role/${roleId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Failed to delete role: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error deleting role:", error);
    throw error;
  }
}