import { getToken } from "@/framework-drivers/token/tokenService";

export async function AddRoleUser(roleName = "", id = "") {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    return { success: false, message: "Unauthorized" };
  }

  try {
    const query = roleName ? `?RoleName=${encodeURIComponent(roleName)}` : "";
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/role/addUser${query}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uuid: id }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to assign role");
    }

    return {
      success: true,
      data: data.user, // { name_Role, user }
    };

  } catch (error) {
    console.error("Error assigning role:", error);
    return {
      success: false,
      message: error.message || "Failed to assign role",
    };
  }
}
