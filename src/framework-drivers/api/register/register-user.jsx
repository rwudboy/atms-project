export async function registerUserApiCall({
    fullName,
    username,
    password,
    email,
    birth,
    phone,
    jabatan
}) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
            namaLengkap: fullName,
            username,
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
        const errorMessage = data?.message ||
            text ||
            "Registration failed";
        throw new Error(errorMessage);
    }

    return data;
}