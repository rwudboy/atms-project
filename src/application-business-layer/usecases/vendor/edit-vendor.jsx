import { getToken } from "@/framework-drivers/token/tokenService";
export async function updateVendorDetail(id, formData) {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    throw new Error("No token found.");
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Failed to update role: ${response.status}`);
    }

    return data.role;
  } catch (error) {
    console.error("Error updating role:", error);
    throw error;
  }
}