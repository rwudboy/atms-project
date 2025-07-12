import { getToken } from "@/framework-drivers/token/tokenService";

export async function viewWorkgroup(id) {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    throw new Error("No token found.");
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workgroup/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data.workgroup)

    if (!response.ok) {
      throw new Error(data.message || `Failed to fetch workgroup: ${response.status}`);
    }

    // Change this line from data.role to data.workgroup
    return data.workgroup;
  } catch (error) {
    console.error("Error fetching workgroup:", error);
    throw error;
  }
}