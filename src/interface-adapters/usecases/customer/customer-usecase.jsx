import { getToken } from "@/framework-drivers/token/tokenService";

export async function getCustomers(searchTerm = "") {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    return [];
  }

  try {
    const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : "";
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers${query}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch customers");
    }

    return Array.isArray(data.user) ? data.user : [];
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

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

export async function addCustomer(customerData) {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    throw new Error("No token found.");
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Failed to add customer: ${response.status}`);
    }

    return data.user; // only return success message object
  } catch (error) {
    console.error("Error adding customer:", error);
    throw error;
  }

  
}
