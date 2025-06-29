import { getToken } from "@/framework-drivers/token/tokenService";
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
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workgroupData),
    });

    console.log("Add Workgroup status:", response.status);

    if (response.status === 201) {
      return response.status; // ✅ Just return success flag
    }

    // If not 201, throw error
    throw new Error(`Failed to add workgroup. Status: ${response.status}`);
  } catch (error) {
    console.error("Error adding workgroup:", error);
    throw error;
  }
}