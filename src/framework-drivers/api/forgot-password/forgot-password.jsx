export async function forgotPassword({ email }) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgotPassword`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }), // sends: { "email": "example@gmail.com" }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `Failed to send reset link: ${response.status}`)
    }

    return data // return the full response data object
  } catch (error) {
    console.error("Error sending reset link:", error)
    throw error
  }
}
