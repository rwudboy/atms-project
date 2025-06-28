"use client"

import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/interface-adapters/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/interface-adapters/components/ui/avatar"
import { Badge } from "@/interface-adapters/components/ui/badge"
import { Button } from "@/interface-adapters/components/ui/button"
import {
  User, Mail, Phone, Calendar, Shield, Globe, Briefcase, Edit, Lock, Unlock
} from "lucide-react"


// --- Helper Functions ---

const getInitials = (name) =>
  name?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

const getRoleBadgeVariant = (role) => {
  switch (role.toLowerCase()) {
    case "admin": return "destructive";
    case "manager": return "default";
    case "user": return "secondary";
    default: return "outline";
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "Not provided";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// --- Reusable Field Component for Readability ---

const InfoField = ({ icon: Icon, label, children }) => (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
        <Icon className="w-4 h-4 text-slate-500" />
        <span>{label}</span>
      </label>
      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 min-h-[42px] flex items-center">
        <div className="text-slate-900 font-medium w-full">{children}</div>
      </div>
    </div>
);


export default function UserProfileView({ user, onEdit }) {
  const isLocked = user.status === "locked";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Profile Card (Left Column) */}
      <div className="lg:col-span-1">
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" />
                    <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        {getInitials(user.fullName)}
                    </AvatarFallback>
                </Avatar>
            </div>
            <CardTitle className="text-xl font-bold text-slate-900">{user.fullName}</CardTitle>
            {(user.posisi || user.department) && (
              <CardDescription className="text-slate-600">
                {[user.posisi, user.department].filter(Boolean).join(" • ")}
              </CardDescription>
            )}
            {Array.isArray(user.role) && user.role.length > 0 && (
              <div className="flex justify-center flex-wrap gap-2 mt-3">
                {user.role.map((role, index) => (
                  <Badge key={index} variant={getRoleBadgeVariant(role)} className="text-xs">
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
                {user.id && (
                  <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600">ID:</span>
                      <span className="font-mono text-slate-900">{user.id}</span>
                  </div>
                )}
                {user.joinDate && (
                  <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600">Joined:</span>
                      <span className="text-slate-900">{formatDate(user.joinDate)}</span>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personal Information (Right Column) */}
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
              <Button variant="outline" size="sm" onClick={onEdit} className="hover:bg-blue-50 hover:border-blue-300">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* --- THIS IS THE CORRECTED LINE --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <InfoField icon={User} label="Full Name">
                {user.fullName || "Not provided"}
              </InfoField>

              <InfoField icon={Mail} label="Email Address">
                <span className="font-mono">{user.email || "Not provided"}</span>
              </InfoField>

              <InfoField icon={Phone} label="Phone Number">
                <span className="font-mono">{user.phoneNumber || "Not provided"}</span>
              </InfoField>
              
              <InfoField icon={Calendar} label="Date of Birth">
                {formatDate(user.TanggalLahir)}
              </InfoField>

              <InfoField icon={Briefcase} label="Position">
                {user.posisi || "Not provided"}
              </InfoField>

              <InfoField icon={Globe} label="Username">
                <span className="font-mono">@{user.username || "N/A"}</span>
              </InfoField>

              <InfoField icon={isLocked ? Lock : Unlock} label="Account Status">
                {isLocked ? (
                  <Badge variant="default" className="flex items-center w-fit">
                    <Lock className="w-3 h-3 mr-1.5" />
                    <span className="font-bold">{user.status.toUpperCase()}</span>
                  </Badge>
                ) : (
                  <Badge className="flex items-center w-fit font-bold bg-green-100 text-green-800 border border-green-200 hover:bg-green-200">
                    <Unlock className="w-3 h-3 mr-1.5" />
                    <span className="font-bold">{user.status.toUpperCase()}</span>
                  </Badge>
                )}
              </InfoField>
              
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}