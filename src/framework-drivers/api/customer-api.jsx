export const customerApi = {
    async fetchCustomers() {
      const token = getToken();
      if (!token) {
        throw new Error("Token not found");
      }
  
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }
  
        const data = await response.json();
        return { data };
      } catch (error) {
        console.error("Error fetching customers:", error);
        return { data: [] };
      }
    },
  
    async deleteCustomer(id) {
      const token = getToken();
      if (!token) {
        throw new Error("Token not found");
      }
  
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to delete customer");
        }
  
        return {};
      } catch (error) {
        console.error("Error deleting customer:", error);
        return { success: false, error: "Failed to delete customer" };
      }
    }
  };
  