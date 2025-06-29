import { getToken } from "@/framework-drivers/token/tokenService";
export async function viewWorkgroup(id) {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    throw new Error("No token found.");
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workgroup/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Failed to update fetch workgroup: ${response.status}`);
    }

    return data.role;
  } catch (error) {
    console.error("Error updating workgroup:", error);
    throw error;
  }
}