import { editCustomer as updateCustomerInAPI } from "@/framework-drivers/api/customer/edit-customer";

export const updateCustomer = async (customerId, formData) => {
  await updateCustomerInAPI(customerId, formData);
};