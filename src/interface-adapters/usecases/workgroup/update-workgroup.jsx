import { getToken } from "@/framework-drivers/token/tokenService";

export async function updateWorkgroup(id, formData) {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    throw new Error("No token found.");
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workgroup/${id}`, {
      method: "POST", // Changed from POST to PUT for updates
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Failed to update workgroup: ${response.status}`);
    }

    // Return the full response data instead of just data.role
    return data;
  } catch (error) {
    console.error("Error updating workgroup:", error);
    throw error;
  }
}