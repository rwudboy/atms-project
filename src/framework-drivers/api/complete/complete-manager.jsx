import { getToken } from "@/framework-drivers/token/tokenService";

export async function sendTaskFileManager(taskId, files, fieldName, stringValue = null) {
  const token = await getToken();

  const formData = new FormData();
  
  // Add files if provided
  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append(fieldName, file);
    });
  }
  
  // Add string value if provided
  if (stringValue !== null) {
    formData.append(fieldName, stringValue);
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inbox/${taskId}/complete`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("File upload error:", error);
    return { success: false, message: "File upload failed due to network error" };
  }
}
