import { getToken } from "@/framework-drivers/token/tokenService";
export async function getUserDetail() {
  const token = getToken();
  if (!token) {
    throw new Error("Token not found");
  }

  try {
    
    const firstResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });

    const first = await firstResponse.json();

    if (!firstResponse.ok) {
      throw new Error(first.message || "Failed to fetch initial user data");
    }

    const username = first?.user?.[0]?.username;
    if (!username) {
      throw new Error("Username not found in initial user data");
    }
    
    const secondResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user?username=${username}`,
      {
        method: "GET",
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await secondResponse.json();

    if (!secondResponse.ok) {
      throw new Error(data.message || "Failed to fetch user detail by username");
    }

    return { first, data }; // Returning both responses
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw new Error("Error fetching user details");
  }
}

