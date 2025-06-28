"use client"

import { useParams } from "next/navigation"
import UserProfilePage from "@/application-business-layer/userProfile/userProfileDetail"

export default function UserProfilePageWrapper() {
  const { username } = useParams()

  return <UserProfilePage username={username} />
}
