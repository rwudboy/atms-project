import { getCustomers as fetchCustomers } from "@/framework-drivers/api/customer/get-customer";

export const getCustomers = async () => {
  const customers = await fetchCustomers();
  return customers;
};