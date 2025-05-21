export function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 6) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  if (password.length >= 10) score++;

  const label = ["Weak", "Fair", "Good", "Strong"][score - 1] || "Very Weak";
  const color = ["bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"][score - 1] || "bg-gray-200";

  return {
    score,
    label,
    color,
    percentage: (score / 4) * 100,
  };
}
