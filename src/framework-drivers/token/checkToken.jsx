import { getToken, removeToken } from "./tokenService";

export function isTokenValid() {
  const token = getToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp > now) {
      return true; 
    } else {
      removeToken();
      return false; 
    }
  } catch (error) {
    console.error("Token parsing error:", error);
    removeToken();
    return false;
  }
}
