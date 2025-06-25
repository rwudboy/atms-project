"use client"

import { useParams } from "next/navigation"
import UserProfilePage from "@/interface-adapters/components/user-role/userRoleDetail"

export default function UserProfilePageWrapper() {
  const { username } = useParams()

  return <UserProfilePage username={username} />
}
