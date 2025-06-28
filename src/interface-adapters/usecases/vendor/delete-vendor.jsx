import { getToken } from "@/framework-drivers/token/tokenService";

export async function deleteVendor(vendorId) {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    throw new Error("No token found.");
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/${vendorId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Failed to delete vendor: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error deleting vendor:", error);
    throw error;
  }
}
