export async function registerUserUseCase({ username, password, email, birth, phone }) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        password,
        dateOfBirth: birth,
        phoneNumber: phone,
      }),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }
  
    return data;
  }
  