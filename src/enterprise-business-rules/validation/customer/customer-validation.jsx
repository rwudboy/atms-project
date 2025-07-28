export function isValidCustomer(customer) {
  const errors = {};

  if (!customer.name || customer.name.trim() === "") {
    errors.name = "Name is required";
  }

  if (!customer.address || customer.address.trim() === "") {
    errors.address = "Address is required";
  }

  if (!customer.city || customer.city.trim() === "") {
    errors.city = "City is required";
  }

  if (!customer.country || customer.country.trim() === "") {
    errors.country = "Country is required";
  }

  if (!customer.category || customer.category.trim() === "") {
    errors.category = "Category is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
