"use client"

import { useEffect, useState } from "react"
import { getUserDetails } from "@/interface-adapters/usecases/user-role/user-detail"
import { Badge } from "@/interface-adapters/components/ui/badge"
import { Button } from "@/interface-adapters/components/ui/button"
import { useRouter } from "next/navigation"
import { Input } from "@/interface-adapters/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/interface-adapters/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/interface-adapters/components/ui/card"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/interface-adapters/components/ui/avatar"
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Globe,
  Briefcase,
  Building2,
  Clock,
  ArrowLeft,
  Edit,
  Save,
  X,
  Lock,
  Unlock,
  AlertCircle,
} from "lucide-react"

export default function UserProfilePage({ username, onBack }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState(null)
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: ""
  })
  const [phoneNumber, setPhoneNumber] = useState("")
  const [passwordError, setPasswordError] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserDetails(username)
        if (res?.status && res?.user) {
          console.log("User ID from getUserDetails:", res.user.id) // Log the user ID
          setUser(res.user)
          setEditedUser({ 
            ...res.user, 
            status: res.user.status || "unlocked" // Default to unlocked if no status
          })
          setPhoneNumber(res.user.phoneNumber || "")
        }
      } catch (error) {
        console.error("Failed to load user:", error)
      } finally {
        setLoading(false)
      }
    }

    if (username) fetchUser()
  }, [username])

  const getInitials = (name) =>
    name?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)

  const getRoleBadgeVariant = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "destructive"
      case "manager":
        return "default"
      case "user":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusBadgeVariant = (status) => {
    return status === "locked" ? "destructive" : "default"
  }

  const handleEdit = () => {
    setIsEditing(true)
    setPasswordData({ newPassword: "", confirmPassword: "" })
    setPhoneNumber(user.phoneNumber || "")
    setPasswordError("")
  }

  const handleCancel = () => {
    setEditedUser({ 
      ...user, 
      status: user.status || "unlocked"
    })
    setPasswordData({ newPassword: "", confirmPassword: "" })
    setPhoneNumber(user.phoneNumber || "")
    setPasswordError("")
    setIsEditing(false)
  }

  const validatePasswords = () => {
    if (passwordData.newPassword || passwordData.confirmPassword) {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError("Passwords do not match")
        return false
      }
      if (passwordData.newPassword.length < 6) {
        setPasswordError("Password must be at least 6 characters long")
        return false
      }
    }
    setPasswordError("")
    return true
  }

  const handleSave = async () => {
    if (!validatePasswords()) {
      return
    }

    try {
      // Prepare form data in the requested format
      const formData = {
        status: editedUser.status, // "locked" or "unlocked" based on selected
        user: {}
      }

      // Only add password if it was changed
      if (passwordData.newPassword) {
        formData.user.password = passwordData.newPassword
      }

      // Only add phone number if it was changed
      if (phoneNumber !== (user.phoneNumber || "")) {
        formData.user.phoneNumber = phoneNumber
      }

      console.log("Form data:", formData) // Log the form data

      // Example: await updateUserDetails(formData)
      setUser({
        ...user,
        status: editedUser.status,
        ...(phoneNumber !== (user.phoneNumber || "") && { phoneNumber }),
        ...(passwordData.newPassword && { password: passwordData.newPassword })
      })
      setIsEditing(false)
      setPasswordData({ newPassword: "", confirmPassword: "" })
      console.log("User updated successfully")
    } catch (error) {
      console.error("Failed to update user:", error)
    }
  }

  const handleStatusChange = (newStatus) => {
    setEditedUser(prev => ({
      ...prev,
      status: newStatus
    }))
  }

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (passwordError) {
      setPasswordError("")
    }
  }

  if (loading) return <p className="p-6 text-slate-500">Loading profile...</p>
  if (!user) return <p className="p-6 text-red-500">User not found.</p>

  const displayUser = user

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
             onClick={() => router.push("/userProfile")}
              className="hover:bg-slate-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" />
                    <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                      {getInitials(displayUser.fullName)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  {displayUser.fullName}
                </CardTitle>
                {(displayUser.posisi || displayUser.department) && (
                  <CardDescription className="text-slate-600">
                    {[displayUser.posisi, displayUser.department].filter(Boolean).join(" • ")}
                  </CardDescription>
                )}
                {Array.isArray(displayUser.role) && displayUser.role.length > 0 && (
                  <div className="flex justify-center space-x-2 mt-3">
                    {displayUser.role.map((role, index) => (
                      <Badge key={index} variant={getRoleBadgeVariant(role)} className="text-xs">
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {displayUser.id && (
                    <div className="flex items-center space-x-3 text-sm">
                      <User className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600">ID:</span>
                      <span className="font-mono text-slate-900">{displayUser.id}</span>
                    </div>
                  )}
                  {displayUser.joinDate && (
                    <div className="flex items-center space-x-3 text-sm">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600">Joined:</span>
                      <span className="text-slate-900">
                        {new Date(displayUser.joinDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                  {displayUser.lastLogin && (
                    <div className="flex items-center space-x-3 text-sm">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600">Last Login:</span>
                      <span className="text-slate-900">{new Date(displayUser.lastLogin).toLocaleString()}</span>
                    </div>
                  )}
                  {displayUser.workLocation && (
                    <div className="flex items-center space-x-3 text-sm">
                      <Building2 className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600">Location:</span>
                      <span className="text-slate-900">{displayUser.workLocation}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Personal Information */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-blue-600" />
                      <span>Personal Information</span>
                    </CardTitle>
                    <CardDescription>Details and contact info</CardDescription>
                  </div>
                  {!isEditing && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleEdit}
                      className="hover:bg-blue-50 hover:border-blue-300"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {displayUser.fullName && (
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>Full Name</span>
                        </label>
                        {!isEditing ? (
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <p className="text-slate-900 font-medium">{displayUser.fullName}</p>
                          </div>
                        ) : (
                          <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 opacity-60">
                            <p className="text-slate-700 font-medium">{displayUser.fullName}</p>
                            <p className="text-xs text-slate-500 mt-1">This field cannot be edited</p>
                          </div>
                        )}
                      </div>
                    )}

                    {displayUser.email && (
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>Email Address</span>
                        </label>
                        {!isEditing ? (
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <p className="text-slate-900 font-mono">{displayUser.email}</p>
                          </div>
                        ) : (
                          <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 opacity-60">
                            <p className="text-slate-700 font-mono">{displayUser.email}</p>
                            <p className="text-xs text-slate-500 mt-1">This field cannot be edited</p>
                          </div>
                        )}
                      </div>
                    )}

                    {(displayUser.phoneNumber || isEditing) && (
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>Phone Number</span>
                        </label>
                        {isEditing ? (
                          <Input
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="bg-slate-50 border-slate-200 font-mono"
                            placeholder="Enter phone number"
                          />
                        ) : (
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <p className="text-slate-900 font-mono">{displayUser.phoneNumber || "Not provided"}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {displayUser.TanggalLahir && (
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Date of Birth</span>
                        </label>
                        {!isEditing ? (
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <p className="text-slate-900">
                              {new Date(displayUser.TanggalLahir).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        ) : (
                          <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 opacity-60">
                            <p className="text-slate-700">
                              {new Date(displayUser.TanggalLahir).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">This field cannot be edited</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Password Fields - Only show in edit mode */}
                    {isEditing && (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                            <Lock className="w-4 h-4" />
                            <span>New Password</span>
                          </label>
                          <Input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                            placeholder="Enter new password (optional)"
                            className="bg-slate-50 border-slate-200"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                            <Lock className="w-4 h-4" />
                            <span>Confirm New Password</span>
                          </label>
                          <Input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                            placeholder="Confirm new password"
                            className={`bg-slate-50 border-slate-200 ${passwordError ? 'border-red-300' : ''}`}
                          />
                          {passwordError && (
                            <div className="flex items-center space-x-2 text-red-600 text-sm">
                              <AlertCircle className="w-4 h-4" />
                              <span>{passwordError}</span>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {Array.isArray(displayUser.role) && displayUser.role.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                          <Shield className="w-4 h-4" />
                          <span>User Roles</span>
                        </label>
                        {!isEditing ? (
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="flex flex-wrap gap-2">
                              {displayUser.role.map((role, index) => (
                                <Badge key={index} variant={getRoleBadgeVariant(role)} className="text-xs">
                                  {role.charAt(0).toUpperCase() + role.slice(1)}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 opacity-60">
                            <div className="flex flex-wrap gap-2">
                              {displayUser.role.map((role, index) => (
                                <Badge key={index} variant={getRoleBadgeVariant(role)} className="text-xs opacity-80">
                                  {role.charAt(0).toUpperCase() + role.slice(1)}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-xs text-slate-500 mt-2">This field cannot be edited</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {displayUser.username && (
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                          <Globe className="w-4 h-4" />
                          <span>Username</span>
                        </label>
                        {!isEditing ? (
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <p className="text-slate-900 font-mono">@{displayUser.username}</p>
                          </div>
                        ) : (
                          <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 opacity-60">
                            <p className="text-slate-700 font-mono">@{displayUser.username}</p>
                            <p className="text-xs text-slate-500 mt-1">This field cannot be edited</p>
                          </div>
                        )}
                      </div>
                    )}

                    {displayUser.posisi && (
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                          <Briefcase className="w-4 h-4" />
                          <span>Position</span>
                        </label>
                        {!isEditing ? (
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <p className="text-slate-900 font-medium">{displayUser.posisi}</p>
                            {displayUser.department && (
                              <p className="text-sm text-slate-600">{displayUser.department}</p>
                            )}
                          </div>
                        ) : (
                          <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 opacity-60">
                            <p className="text-slate-700 font-medium">{displayUser.posisi}</p>
                            {displayUser.department && (
                              <p className="text-sm text-slate-600">{displayUser.department}</p>
                            )}
                            <p className="text-xs text-slate-500 mt-1">This field cannot be edited</p>
                          </div>
                        )}
                      </div>
                    )}

                    {displayUser.address && (
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                          <Building2 className="w-4 h-4" />
                          <span>Address</span>
                        </label>
                        {!isEditing ? (
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <p className="text-slate-900 leading-relaxed">{displayUser.address}</p>
                          </div>
                        ) : (
                          <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 opacity-60">
                            <p className="text-slate-700 leading-relaxed">{displayUser.address}</p>
                            <p className="text-xs text-slate-500 mt-1">This field cannot be edited</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Account Status Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                        {(isEditing ? editedUser.status : displayUser.status) === "locked" ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <Unlock className="w-4 h-4" />
                        )}
                        <span>Account Status</span>
                      </label>
                      {isEditing ? (
                        <Select
                          value={editedUser.status}
                          onValueChange={handleStatusChange}
                        >
                          <SelectTrigger className="bg-slate-50 border-slate-200">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unlocked">
                              <div className="flex items-center space-x-2">
                                <Unlock className="w-4 h-4 text-green-600" />
                                <span>Unlocked</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="locked">
                              <div className="flex items-center space-x-2">
                                <Lock className="w-4 h-4 text-red-600" />
                                <span>Locked</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <Badge 
                            variant={getStatusBadgeVariant(displayUser.status)} 
                            className={`flex items-center w-fit ${
                              displayUser.status === "locked" 
                                ? "bg-red-50 text-red-700 border-red-200" 
                                : "bg-green-50 text-green-700 border-green-200"
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              displayUser.status === "locked" ? "bg-red-500" : "bg-green-500"
                            }`}></div>
                            {displayUser.status === "locked" ? (
                              <>
                                <Lock className="w-3 h-3 mr-1" />
                                Locked
                              </>
                            ) : (
                              <>
                                <Unlock className="w-3 h-3 mr-1" />
                                Unlocked
                              </>
                            )}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-200">
                    <Button 
                      variant="outline" 
                      onClick={handleCancel}
                      className="hover:bg-slate-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSave}
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={!!passwordError}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}