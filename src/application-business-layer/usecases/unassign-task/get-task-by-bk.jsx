import { getToken } from "@/framework-drivers/token/tokenService";

export async function getTaskByBusinessKey(businessKey = "") {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    return { status: false, data: null };
  }

  try {
    const query = businessKey ? `?businessKey=${encodeURIComponent(businessKey)}` : "";
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task${query}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });

    const data = await response.json();
    console.log("API Response received:", data);

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch tasks");
    }
    return data;
    
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { status: false, data: null };
  }
}