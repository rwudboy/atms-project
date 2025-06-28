import { getToken } from "@/framework-drivers/token/tokenService";

export async function addVendor(vendorData) {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    throw new Error("No token found.");
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vendorData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Failed to add vendor: ${response.status}`);
    }

    return data.vendor;
  } catch (error) {
    console.error("Error adding vendor:", error);
    throw error;
  }
}
