import { getToken } from "@/framework-drivers/token/tokenService";

export async function AddUser(workgroupId, userData) {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    throw new Error("No token found.");
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workgroup/addUser/${workgroupId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData), // expects: { uuid: "user-id" }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Failed to add user: ${response.status}`);
    }

    return data.role;
  } catch (error) {
    console.error("Error adding user to workgroup:", error);
    throw error;
  }
}
