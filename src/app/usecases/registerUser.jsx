export async function registerUserUseCase({ username, password, email, birth, phone, jabatan }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true", 
    },
    body: JSON.stringify({
      namaLengkap:username,
      email,
      password,
      dateOfBirth: birth,
      phoneNumber: phone,
      jabatan,
    }),
  });

  let data;
  try {
    data = await response.json();
  } catch (err) {
    const text = await response.text();
    console.error("Failed to parse JSON. Raw response:", text);
    throw new Error("Invalid server response");
  }

  if (!response.ok) {
    throw new Error(data?.message || "Registration failed");
  }

  return data;
}
