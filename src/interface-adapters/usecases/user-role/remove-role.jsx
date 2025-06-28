import { getToken } from "@/framework-drivers/token/tokenService";

export async function RemoveRole(roleName = "", id = "") {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    return null;
  }

  try {
    const query = roleName ? `?RoleName=${encodeURIComponent(roleName)}` : "";
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/role/removeuser${query}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uuid: id }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to remove user from role");
    }

    return data; 

  } catch (error) {
    console.error("Error removing user from role:", error);
    return null;
  }
}
