import { customerApi } from "./customer-api";

export async function getCustomers() {
  try {
    const response = await customerApi.fetchCustomers();

    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

export async function deleteCustomer(id) {
  try {
    const response = await customerApi.deleteCustomer(id);
    return { success: true };
  } catch (error) {
    console.error("Error deleting customer:", error);
    return { success: false, error: "Failed to delete customer" };
  }
}
