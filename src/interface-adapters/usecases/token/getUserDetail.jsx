import { getToken } from "@/framework-drivers/token/tokenService";

// Helper function to decode JWT token
function decodeToken(token) {
  try {
    const payload = token.split(".")[1]; 
    const decodedPayload = atob(payload); 
    return JSON.parse(decodedPayload);
  } catch (error) {
    throw new Error("Failed to decode token");
  }
}

export async function getUserDetail() {
  const token = getToken();
  if (!token) {
    throw new Error("Token not found");
  }

  try {
    // Decode the token to get embedded user data
    const decodedToken = decodeToken(token);

    // Extract username from decoded token
    const username = decodedToken.username;
    if (!username) {
      throw new Error("Username not found in token");
    }

    // Fetch user detail using the username from token
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

    return { data };
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw new Error("Error fetching user details");
  }
}