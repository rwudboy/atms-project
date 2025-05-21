
import { getToken } from "@/framework-drivers/token/tokenService";

export async function createRole(roleData) {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    throw new Error("No token found.");
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/role`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roleData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Failed to create role: ${response.status}`);
    }

    return data.role;
  } catch (error) {
    console.error("Error creating role:", error);
    throw error;
  }
}