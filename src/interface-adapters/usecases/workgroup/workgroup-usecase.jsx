import { getToken } from "@/framework-drivers/token/tokenService";


export async function getWorkgroups(searchTerm = "") {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    return [];
  }

  try {
    const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : "";
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workgroup${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch workgroups");
    }

    return Array.isArray(data.workgroup) ? data.workgroup : [];
  } catch (error) {
    console.error("Error fetching workgroups:", error);
    return [];
  }
}


export async function addWorkgroup(workgroupData) {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    throw new Error("No token found.");
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workgroup`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workgroupData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Failed to add workgroup: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error adding workgroup:", error);
    throw error;
  }
}

export async function deleteWorkgroup(workgroupId) {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    throw new Error("No token found.");
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workgroup/${workgroupId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Failed to delete workgroup: ${response.status}`);
    }
    return true; // Return success status
  } catch (error) {
    console.error("Error deleting workgroup:", error);
    throw error;
  }
}
