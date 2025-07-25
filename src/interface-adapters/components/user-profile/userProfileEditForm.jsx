"use client"

import { useState } from "react"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/interface-adapters/components/ui/card"
import { Input } from "@/interface-adapters/components/ui/input"
import { Button } from "@/interface-adapters/components/ui/button"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/interface-adapters/components/ui/select"
import {
  User, Mail, Phone, Lock, Unlock, Save, X, AlertCircle, Briefcase, Info
} from "lucide-react"
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/interface-adapters/context/AuthContext";

const JABATAN_LIST = [
  "Project Manager",
  "System Analyst",
  "Solution Archi",
  "Business Analyst",
  "Developer",
  "IT Infrastructure",
  "Finance & Accounting staff",
  "Supply Chain",
  "Warehouse",
  "Quality Assurance",
  "IT Support",
  "Staf Administrator",
];

export default function UserProfileEditForm({ user, onSave, onCancel, userIsOwner }) {


  const { user: currentUser} = useAuth();
 
  const [status, setStatus] = useState(user.status || "unlocked");
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const [phoneError, setPhoneError] = useState("");
  const [jabatan, setJabatan] = useState(user.posisi || "");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({ newPassword: "", confirmPassword: "" });
  const [passwordError, setPasswordError] = useState("");

  // Check if status should be disabled (when user roles is staff)
  const isStatusDisabled = currentUser.role === "staff";

  const validateAndSave = () => {
    // Validate phone number first
    if (userIsOwner && phoneNumber) {
      if (phoneNumber.length < 10) {
        setPhoneError("Phone number must be 10-13 digits");
        return;
      }
      if (phoneNumber.length > 13) {
        setPhoneError("Phone number can't be more than 13 digits");
        return;
      }
    }

    if (userIsOwner && (passwordData.newPassword || passwordData.confirmPassword)) {
      if (passwordData.newPassword.length < 6) {
        setPasswordError("Password must be at least 6 characters long");
        return;
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError("Passwords do not match");
        return;
      }
    }

    setPhoneError("");
    setPasswordError("");

    const formData = {};
    const userUpdates = {};

    // Only include status in payload if it's not disabled and has changed
    if (!isStatusDisabled && status !== user.status) {
      formData.status = status;
    }

    // Only include password in payload if user is owner and password is not empty
    if (userIsOwner && passwordData.newPassword) {
      userUpdates.password = passwordData.newPassword;
    }
    if (userIsOwner && phoneNumber !== (user.phoneNumber || "")) {
      userUpdates.phoneNumber = phoneNumber;
    }
    if (userIsOwner && jabatan !== (user.posisi || "")) {
      userUpdates.jabatan = jabatan;
    }

    if (Object.keys(userUpdates).length > 0) {
      formData.user = userUpdates;
    }

    onSave(formData);
  }

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    if (passwordError) setPasswordError("");
  }

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    setPhoneNumber(value);
    if (phoneError) setPhoneError("");
  }

  return (
    <div className="lg:col-span-3">
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-600" />
            <span>Edit Personal Information</span>
          </CardTitle>
          <CardDescription>Update the user's details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2"><Phone className="w-4 h-4" /><span>Phone Number</span></label>
              <Input
                type="number"
                value={phoneNumber}
                onChange={handlePhoneChange}
                className="bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="Enter phone number (digits only)"
                disabled={!userIsOwner}
              />
              {phoneError && (
                <div className="flex items-center space-x-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" /><span>{phoneError}</span>
                </div>
              )}
              {!userIsOwner && (
                <div className="flex items-center space-x-2 text-yellow-700 text-xs p-2 bg-yellow-50 rounded-md mt-2">
                  <Info className="w-4 h-4" />
                  <span>You can only edit your own profile details.</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2"><Unlock className="w-4 h-4" /><span>Account Status</span></label>
              <Select value={status} onValueChange={setStatus} disabled={isStatusDisabled}>
                <SelectTrigger className="bg-slate-50 w-full disabled:opacity-60 disabled:cursor-not-allowed"><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="unlocked"><div className="flex items-center"><Unlock className="w-4 h-4 mr-2 text-green-600" />Unlocked</div></SelectItem>
                  <SelectItem value="locked"><div className="flex items-center"><Lock className="w-4 h-4 mr-2 text-red-600" />Locked</div></SelectItem>
                </SelectContent>
              </Select>
              {isStatusDisabled && (
                <div className="flex items-center space-x-2 text-yellow-700 text-xs p-2 bg-yellow-50 rounded-md mt-2">
                  <Info className="w-4 h-4" />
                  <span>Staff users cannot modify account status.</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>New Password</span>
              </label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  className="bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed pr-10"
                  placeholder="Enter new password"
                  disabled={!userIsOwner}
                />
                {userIsOwner && (
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute top-1/2 right-2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    onClick={() => setShowNewPassword(v => !v)}
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                )}
              </div>
              {!userIsOwner && (
                <div className="flex items-center space-x-2 text-yellow-700 text-xs p-2 bg-yellow-50 rounded-md mt-2">
                  <Info className="w-4 h-4" />
                  <span>You can only change your own password.</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2"><Briefcase className="w-4 h-4" /><span>Position</span></label>
              <Select value={jabatan} onValueChange={setJabatan} disabled={!userIsOwner}>
                <SelectTrigger className="bg-slate-50 w-full disabled:opacity-60 disabled:cursor-not-allowed">
                  <SelectValue placeholder="Select a position" />
                </SelectTrigger>
                <SelectContent>
                  {JABATAN_LIST.map((jabatan, index) => (
                    <SelectItem key={index} value={jabatan}>{jabatan}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!userIsOwner && (
                <div className="flex items-center space-x-2 text-yellow-700 text-xs p-2 bg-yellow-50 rounded-md mt-2">
                  <Info className="w-4 h-4" />
                  <span>You can only edit your own profile details.</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Confirm New Password</span>
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  className={`bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed pr-10 ${passwordError ? 'border-red-300' : ''}`}
                  placeholder="Confirm new password"
                  disabled={!userIsOwner}
                />
                {userIsOwner && (
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute top-1/2 right-2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    onClick={() => setShowConfirmPassword(v => !v)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                )}
              </div>
              {passwordError && (
                <div className="flex items-center space-x-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" /><span>{passwordError}</span>
                </div>
              )}
              {!userIsOwner && (
                <div className="flex items-center space-x-2 text-yellow-700 text-xs p-2 bg-yellow-50 rounded-md mt-2">
                  <Info className="w-4 h-4" />
                  <span>You can only change your own password.</span>
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 opacity-60">
              <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2"><Mail className="w-4 h-4" /><span>Email (Cannot be changed)</span></label>
              <p className="text-slate-700 font-mono mt-2">{user.email}</p>
            </div>

            <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 opacity-60">
              <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2"><User className="w-4 h-4" /><span>Full Name (Cannot be changed)</span></label>
              <p className="text-slate-700 font-medium mt-2">{user.fullName}</p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-200">
            <Button variant="outline" onClick={onCancel} className="hover:bg-slate-50"><X className="w-4 h-4 mr-2" />Cancel</Button>
            <Button
              onClick={validateAndSave}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!!passwordError || !!phoneError}
            >
              <Save className="w-4 h-4 mr-2" />Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}