import { getToken } from "@/framework-drivers/token/tokenService";

export async function getVendors(searchTerm = "") {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    return [];
  }

  try {
    const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : "";
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch vendors");
    }

    return Array.isArray(data.vendor) ? data.vendor : [];
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return [];
  }
}

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

export async function updateVendor(vendorId, vendorData) {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    throw new Error("No token found.");
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/${vendorId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vendorData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Failed to update vendor: ${response.status}`);
    }

    return data.vendor;
  } catch (error) {
    console.error("Error updating vendor:", error);
    throw error;
  }
}