import { getToken } from "@/framework-drivers/token/tokenService";

export async function createProjects({ key, businessKey, name, customer }) {
  const token = getToken();
  if (!token) return [];

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projek/start`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key,
        businesskey: businessKey,
        name,
        customer,
      }),
    });

     const result = await response.json();

    if (!result.status) {
      throw new Error(result.message || "Project creation failed");
    }

    return result;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}
