"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuth } from "@/interface-adapters/context/AuthContext"
import { getUserDetails } from "@/framework-drivers/api/user-role/user-detail"
import { updateUserDetails } from "@/framework-drivers/api/user-role/edit-user"
import UserProfileView from "@/interface-adapters/components/user-profile/userProfileView"
import UserProfileEditForm from "@/interface-adapters/components/user-profile/userProfileEditForm"
import { Button } from "@/interface-adapters/components/ui/button"
import { ArrowLeft } from "lucide-react"

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
      toast.error("Cannot save: User ID is missing.");
      return;
    }
    // If no actual data was changed, just exit the editing mode.
    if (Object.keys(formData).length === 0) {
      setIsEditing(false);
      return;
    }

    // Prepare the payload for the API.
    const payload = { ...formData };

    // If other user details (like job or phone) are being updated BUT a new status
    // isn't, we ensure the original status is sent along with the other updates.
    if (payload.user && payload.status === undefined) {
      payload.status = user.status;
    }

    try {
      await updateUserDetails(user.id, payload);
      setUser((prevUser) => ({
        ...prevUser,
        status: payload.status !== undefined ? payload.status : prevUser.status,
        phoneNumber: payload.user?.phoneNumber !== undefined ? payload.user.phoneNumber : prevUser.phoneNumber,
        posisi: payload.user?.jabatan !== undefined ? payload.user.jabatan : prevUser.posisi, // <- this line
      }));



      setIsEditing(false);
      toast.success("Profile Updated Successfully", {
        description: `Changes for ${user.fullName} have been saved.`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Update Failed", {
        description: error.message || "Could not save user details.",
      });
    }
  };


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