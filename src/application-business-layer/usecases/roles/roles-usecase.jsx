// src/app/roles/usecases/roleUseCases.js

import { getToken } from "@/framework-drivers/token/tokenService";

// Get Roles
export async function getRoles(searchTerm = "") {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    return [];
  }

  try {
    const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : "";
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/role${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();
 
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch roles");
    }

    return data


  } catch (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
}

// Create Role
export async function createRole(roleData) {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    throw new Error("No token found.");
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/role`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roleData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Failed to create role: ${response.status}`);
    }

    return data.role;
  } catch (error) {
    console.error("Error creating role:", error);
    throw error;
  }
}

// Update Role
export async function updateRole(roleId, roleData) {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    throw new Error("No token found.");
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/role/${roleId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roleData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Failed to update role: ${response.status}`);
    }

    return data.role;
  } catch (error) {
    console.error("Error updating role:", error);
    throw error;
  }
}

// Delete Role
export async function deleteRole(roleId) {
  const token = getToken();
  if (!token) {
    console.error("No token found.");
    throw new Error("No token found.");
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles=/${roleId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Failed to delete role: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error deleting role:", error);
    throw error;
  }
}
