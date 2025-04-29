import { saveToken } from "@/framework-drivers/token/tokenService";

export async function loginUser(email, password) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }
  console.log(data.token)
  saveToken(data.token);

  return data;
}
