import { getToken } from "@/framework-drivers/token/tokenService";

export async function DownloadFile(fileName = "") {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    return { success: false, message: "Unauthorized" };
  }

  try {
    const query = fileName ? `?fileName=${encodeURIComponent(fileName)}` : "";
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/inbox${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to assign role");
    }

    return response

  } catch (error) {
    console.error("Error assigning role:", error);
    return {
      success: false,
      message: error.message || "Failed to assign role",
    };
  }
}
