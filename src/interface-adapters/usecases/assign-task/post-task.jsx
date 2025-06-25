import { getToken } from "@/framework-drivers/token/tokenService";

export async function sendTaskFiles(taskId, files, fieldName) {
  const token = await getToken();

  const formData = new FormData();
  files.forEach((file) => {
    formData.append(fieldName, file);
  });

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inbox/${taskId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();
    return result; // ⬅️ Return the full response object
  } catch (error) {
    console.error("File upload error:", error);
    return { success: false, message: "File upload failed due to network error" };
  }
}
