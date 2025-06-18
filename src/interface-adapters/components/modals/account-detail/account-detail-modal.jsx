"use client";

import { useState, useEffect } from "react";

// Importing Dialog Components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/interface-adapters/components/ui/dialog";

// Importing UI Components
import { Input } from "@/interface-adapters/components/ui/input";
import { Label } from "@/interface-adapters/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/interface-adapters/components/ui/select";
import { Button } from "@/interface-adapters/components/ui/button";
import { getUserDetail } from "@/interface-adapters/usecases/token/getUserDetail";

const jabatan = [
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

export default function AccountDetailModal({ isOpen, onOpenChange, defaultValues = {}, onSave }) {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [position, setPosition] = useState("");

  useEffect(() => {
    let isMounted = true;
  
    const fetchUserData = async () => {
      try {
        const { data } = await getUserDetail();
        const dataUser = data.user;
  
        if (dataUser && isMounted) {
          const roles = dataUser.Role?.split(",").map(r => r.trim()) || [];

          setUsername(dataUser.username || "");
          setEmail(dataUser.email || "");
          setPassword(""); 
          setPhone(dataUser.phone || "");
          setDate(dataUser.TanggalLahir || "");
          setPosition("");
        }
      } catch (error) {
        console.error("Error fetching user detail:", error);
      }
    };
  
    if (isOpen) {
      fetchUserData();
    }
  
    return () => {
      isMounted = false;
    };
  }, [isOpen]);
     
  const handleSave = () => {
    if (onSave) {
      onSave({
        fullName,
        username,
        email,
        password,
        phone,
        dateOfBirth: date,
        position,
      });
    }

    if (onOpenChange) {
      onOpenChange(false); 
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Account Details</DialogTitle>
          <DialogDescription>View and update your account information.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Full Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fullName" className="text-right">
              Full Name
            </Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="col-span-3"
            />
          </div>

          {/* Username */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="col-span-3"
            />
          </div>

          {/* Email */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
            />
          </div>

          {/* Password */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-3"
            />
          </div>

          {/* Phone Number */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="col-span-3"
            />
          </div>

          {/* Date of Birth */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dob" className="text-right">
              Date of Birth
            </Label>
            <div className="col-span-3">
              <Input
                id="dob"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Position / Jabatan */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="position" className="text-right">
              Position
            </Label>
            <div className="col-span-3">
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select position..." />
                </SelectTrigger>
                <SelectContent>
                  {jabatan.map((pos) => (
                    <SelectItem key={pos} value={pos}>
                      {pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}