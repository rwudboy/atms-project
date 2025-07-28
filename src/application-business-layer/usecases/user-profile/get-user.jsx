import { getUsers as fetchUsers } from "@/framework-drivers/api/user/getUserList";

export const getUsers = async () => {
  const users = await fetchUsers();
  return users;
};