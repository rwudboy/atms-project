export function validateUserRegistration({ fullName, username, password, email, birth, phone, jabatan }) {
  const errors = {};

  if (!fullName) errors.fullName = "Full Name can't be empty";
  else if (!/[a-zA-Z]/.test(fullName) || fullName.length < 3) {
    errors.fullName = "Full Name must include letters and be at least 3 characters.";
  }

  if (!username) errors.username = "Username can't be empty";
  else if (!/[a-zA-Z]/.test(username) || username.length < 3) {
    errors.username = "Username must include letters and be at least 3 characters.";
  }

  if (!password) errors.password = "Password can't be empty";
  else if (!/[A-Z]/.test(password) || !/[^a-zA-Z0-9]/.test(password) || password.length < 6) {
    errors.password = "Password must be at least 6 characters, include 1 uppercase letter and 1 symbol.";
  }

  if (!email) errors.email = "Email can't be empty";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Invalid email address.";
  }

  if (phone && !/^\d{10,13}$/.test(phone)) {
    errors.phone = "Phone number must be 10–13 digits if filled.";
  }

  if (!birth) errors.birth = "Birth date can't be empty";

  if (!jabatan) errors.jabatan = "Please select a role";

  return errors;
}
