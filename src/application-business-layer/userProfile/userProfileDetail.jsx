"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuth } from "@/interface-adapters/context/AuthContext" 
import { getUserDetails } from "@/interface-adapters/usecases/user-role/user-detail"
import { updateUserDetails } from "@/interface-adapters/usecases/user-role/edit-user"
import UserProfileView from "@/interface-adapters/components/user-profile/userProfileView"
import UserProfileEditForm from "@/interface-adapters/components/user-profile/userProfileEditForm"
import { Button } from "@/interface-adapters/components/ui/button"
import { ArrowLeft } from "lucide-react"

// --- 1. The signature is changed back to accept the `username` prop directly ---
export default function UserProfilePage({ username }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [userIsOwner, setuserIsOwner] = useState(false)
  
  const { user: loggedInUser } = useAuth();

  useEffect(() => {
    const fetchProfileUser = async () => {
      try {
        // We can use the 'username' prop directly here
        const res = await getUserDetails(username);
        if (res?.user) {
          const profileUser = res.user;
          setUser({ ...profileUser, status: profileUser.status || "unlocked" });

          if (loggedInUser) {
            const isOwner = loggedInUser.username === profileUser.username;
            setuserIsOwner(isOwner);
          }
        }
      } catch (error) {
        console.error("Failed to load user profile:", error);
        toast.error("Failed to load profile", { description: error.message });
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfileUser();
    }
  }, [username, loggedInUser]); 


  const handleSave = async (formData) => {
    if (!user || !user.id) {
        alert("Cannot save: User ID is missing.")
        return;
    }
    if (Object.keys(formData).length === 0) {
        setIsEditing(false);
        return;
    }
    try {
      await updateUserDetails(user.id, formData)
      setUser(prevUser => ({
        ...prevUser,
        ...(formData.status !== undefined && { status: formData.status }),
        ...(formData.user?.phoneNumber !== undefined && { phoneNumber: formData.user.phoneNumber }),
        ...(formData.user?.posisi !== undefined && { posisi: formData.user.posisi }),
      }))
      setIsEditing(false)
      toast.success("Profile Updated Successfully", {
        description: `Changes for ${user.fullName} have been saved.`,
        duration: 3000,
      })
    } catch (error) {
      console.error("Failed to update user:", error)
      toast.error("Update Failed", {
        description: error.message || "Could not save user details.",
      })
    }
  }

  const handleCancel = () => { setIsEditing(false) }
  const handleEdit = () => { setIsEditing(true) }

  if (loading) return <p className="p-6 text-slate-500">Loading profile...</p>
  if (!user) return <p className="p-6 text-red-500">User not found.</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/userProfile")} className="hover:bg-slate-200" >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
            </div>
        </div>

        {isEditing ? (
          <UserProfileEditForm 
            user={user} 
            onSave={handleSave} 
            onCancel={handleCancel}
            userIsOwner={userIsOwner}
          />
        ) : (
          <UserProfileView 
            user={user} 
            onEdit={handleEdit} 
          />
        )}
      </div>
    </div>
  )
}