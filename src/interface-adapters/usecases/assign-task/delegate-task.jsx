import { getToken } from "@/framework-drivers/token/tokenService";

export async function DelegateTask(id, bodyData) {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    return { task: { code: 1, message: "No token provided" } };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/${id}/delegate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });

    const result = await response.json();
    console.log("Fetched result:", result);
    return result; // ✅ Just return the full original response
  } catch (error) {
    console.error("Error delegating task:", error);
    return {
      task: {
        code: 1,
        message: "Failed to delegate task",
      },
    };
  }
}
