import { DeleteUser as deleteUserFromAPI } from "@/framework-drivers/api/user/deleteUser";

export const deleteUser = async (userId) => {
  await deleteUserFromAPI(userId);
};