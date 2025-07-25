function validatePassword(password) {
  const errors = [];

  if (password.length < 6) {
    errors.push("at least 6 characters");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("1 uppercase letter");
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push("1 symbol");
  }

  return errors;
}

export function validateUserRegistration({
  fullName,
  username,
  password,
  email,
  birth,
  phone,
  jabatan
}) {
  const errors = {};

  // Full Name
  if (!fullName) {
    errors.fullName = "Full Name can't be empty";
  } else if (!/[a-zA-Z]/.test(fullName) || fullName.length < 3) {
    errors.fullName = "Full Name must include letters and be at least 3 characters.";
  }

  // Username
  if (!username) {
    errors.username = "Username can't be empty";
  } else if (!/[a-zA-Z]/.test(username) || username.length < 3 || username.includes(" ")) {
    errors.username = "Username must include letters, be at least 3 characters, and cannot contain spaces.";
  }

  // Password
  if (!password) {
    errors.password = "Password can't be empty";
  } else {
    const passwordIssues = validatePassword(password);
    if (passwordIssues.length > 0) {
      errors.password = `Password must include ${passwordIssues.join(", ")}.`;
    }
  }

  // Email
  if (!email) {
    errors.email = "Email can't be empty";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Invalid email address.";
  }

  // Phone (optional)
  if (phone && !/^\d{10,13}$/.test(phone)) {
    errors.phone = "Phone number must be 10–13 digits ";
  }

  // Birth date
  if (!birth) {
    errors.birth = "Birth date can't be empty";
  } else {
    const birthDateObj = new Date(birth);
    if (isNaN(birthDateObj.getTime())) {
      errors.birth = "Invalid birth date format.";
    } else {
      const today = new Date();
      let age = today.getFullYear() - birthDateObj.getFullYear();
      const monthDiff = today.getMonth() - birthDateObj.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
      ) {
        age--;
      }
      if (age < 18) {
        errors.birth = "You must be at least 18 years old to register.";
      }
    }
  }

  // Jabatan
  if (!jabatan) {
    errors.jabatan = "Please select a role";
  }

  return errors;
}
