import { getToken } from "@/framework-drivers/token/tokenService";

export async function deleteCustomer(customerId) {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    throw new Error("No token found.");
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${customerId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Failed to delete customer: ${response.status}`);
    }

    return data; // Success message or status
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
}
