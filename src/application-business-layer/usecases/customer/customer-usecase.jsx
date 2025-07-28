import { addCustomer } from "@/framework-drivers/api/customer/add-customer";
import { Customer } from "@/enterprise-business-rules/entities/customer/Customer";
import { isValidCustomer } from "@/enterprise-business-rules/validation/customer/customer-validation";

export async function addCustomerUseCase(formData) {
  const customer = new Customer(formData);
  const { isValid, errors } = isValidCustomer(customer);

  if (!isValid) {
    throw { validationErrors: errors };
  }

  const result = await addCustomer(customer);
  return result;
}
