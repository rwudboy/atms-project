import { deleteCustomer as deleteCustomerFromAPI } from "@/framework-drivers/api/customer/delete-customer";

export const deleteCustomer = async (customerId) => {
  await deleteCustomerFromAPI(customerId);
};