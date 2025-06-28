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

export default function UserProfileEditForm({ user, onSave, onCancel, canChangePassword }) {
  const [status, setStatus] = useState(user.status || "unlocked");
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const [posisi, setPosisi] = useState(user.posisi || "");
  const [passwordData, setPasswordData] = useState({ newPassword: "", confirmPassword: "" });
  const [passwordError, setPasswordError] = useState("");

  const validateAndSave = () => {
    // Only validate passwords if they are editable
    if (canChangePassword && (passwordData.newPassword || passwordData.confirmPassword)) {
      if (passwordData.newPassword.length < 6) {
        setPasswordError("Password must be at least 6 characters long");
        return;
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError("Passwords do not match");
        return;
      }
    }
    setPasswordError("");

    const formData = {};
    const userUpdates = {};

    if (status !== user.status) {
      formData.status = status;
    }
    
    // Only include password in payload if it can be changed and is not empty
    if (canChangePassword && passwordData.newPassword) {
      userUpdates.password = passwordData.newPassword;
    }
    if (phoneNumber !== (user.phoneNumber || "")) {
      userUpdates.phoneNumber = phoneNumber;
    }
    if (posisi !== (user.posisi || "")) {
      userUpdates.posisi = posisi;
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
                        <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="bg-slate-50" placeholder="Enter phone number" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2"><Unlock className="w-4 h-4" /><span>Account Status</span></label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="bg-slate-50 w-full"><SelectValue placeholder="Select status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="unlocked"><div className="flex items-center"><Unlock className="w-4 h-4 mr-2 text-green-600"/>Unlocked</div></SelectItem>
                                <SelectItem value="locked"><div className="flex items-center"><Lock className="w-4 h-4 mr-2 text-red-600"/>Locked</div></SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2"><Briefcase className="w-4 h-4" /><span>Jabatan (Position)</span></label>
                        <Select value={posisi} onValueChange={setPosisi}>
                            <SelectTrigger className="bg-slate-50 w-full">
                                <SelectValue placeholder="Select a position" />
                            </SelectTrigger>
                            <SelectContent>
                                {JABATAN_LIST.map((jabatan, index) => (
                                    <SelectItem key={index} value={jabatan}>{jabatan}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2"><Lock className="w-4 h-4" /><span>New Password</span></label>
                        <Input 
                            type="password" 
                            value={passwordData.newPassword} 
                            onChange={(e) => handlePasswordChange('newPassword', e.target.value)} 
                            className="bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed" 
                            placeholder="Enter new password"
                            disabled={!canChangePassword}
                        />
                         {!canChangePassword && (
                            <div className="flex items-center space-x-2 text-yellow-700 text-xs p-2 bg-yellow-50 rounded-md mt-2">
                                <Info className="w-4 h-4" />
                                <span>You can only change your own password.</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2"><Lock className="w-4 h-4" /><span>Confirm New Password</span></label>
                        <Input 
                            type="password" 
                            value={passwordData.confirmPassword} 
                            onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)} 
                            className={`bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed ${passwordError ? 'border-red-300' : ''}`} 
                            placeholder="Confirm new password"
                            disabled={!canChangePassword}
                        />
                        {passwordError && (
                          <div className="flex items-center space-x-2 text-red-600 text-sm">
                              <AlertCircle className="w-4 h-4" /><span>{passwordError}</span>
                          </div>
                        )}
                        {!canChangePassword && (
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
                    <Button onClick={validateAndSave} className="bg-blue-600 hover:bg-blue-700" disabled={!!passwordError}><Save className="w-4 h-4 mr-2" />Save Changes</Button>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}