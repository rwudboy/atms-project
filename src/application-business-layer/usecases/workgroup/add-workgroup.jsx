import { getToken } from "@/framework-drivers/token/tokenService";

/**
 * Adds a new workgroup
 * @param {Object} workgroupData - Data for the new workgroup
 * @returns {Object} Response object with success status, status code, and data
 */
export async function addWorkgroup(workgroupData) {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    return {
      success: false,
      status: 401,
      message: "No authentication token found",
      data: null
    };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workgroup`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workgroupData),
    });

    console.log("Add Workgroup status:", response.status);
    
    // Get response data if available
    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      // If response cannot be parsed as JSON
      responseData = null;
    }

    // Return standardized response object
    return {
      success: response.status >= 200 && response.status < 300,
      status: response.status,
      message: responseData?.message || getDefaultMessage(response.status),
      data: responseData
    };
  } catch (error) {
    console.error("Error adding workgroup:", error);
    return {
      success: false,
      status: 0,
      message: error.message || "Network error occurred",
      data: null
    };
  }
}

/**
 * Get a default message based on HTTP status code
 * @param {number} statusCode - HTTP status code
 * @returns {string} Default message
 */
function getDefaultMessage(statusCode) {
  switch (statusCode) {
    case 201:
      return "Workgroup created successfully";
    case 400:
      return "Invalid workgroup data provided";
    case 401:
      return "Unauthorized: Please login again";
    case 403:
      return "You don't have permission to create workgroups";
    case 409:
      return "Workgroup with this name already exists";
    case 500:
      return "Server error occurred";
    default:
      return `Request failed with status ${statusCode}`;
  }
}