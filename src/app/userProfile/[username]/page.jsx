"use client"

import { useParams } from "next/navigation"
import UserProfilePage from "@/interface-adapters/components/user-profile/userProfileDetail"

export default function UserProfilePageWrapper() {
  const { username } = useParams()

  return <UserProfilePage username={username} />
}
