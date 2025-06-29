import { getToken } from "@/framework-drivers/token/tokenService";
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