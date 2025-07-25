"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/interface-adapters/components/ui/button";
import { Input } from "@/interface-adapters/components/ui/input";
import { Label } from "@/interface-adapters/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/interface-adapters/components/ui/select";
import { ClipLoader } from "react-spinners";
import { registerUser } from "@/application-business-layer/usecases/register/register-user";
import { registerUserApiCall } from "@/framework-drivers/api/register/register-user";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birth, setBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(false);

  const getPasswordCriteriaStatus = (password) => ({
    length: password.length >= 6,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[^a-zA-Z0-9]/.test(password),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowErrors(true);
    setLoading(true);

    try {
      const validationResult = await registerUser({
        fullName,
        username,
        password,
        email,
        birthDate: birth,
        phoneNumber: phone,
        position: jabatan,
      });

      if (!validationResult.success) {
        setErrors(validationResult.errors || {});
        setLoading(false);
        return;
      }

      const apiResult = await registerUserApiCall({
        fullName,
        username,
        password,
        email,
        birth,
        phone,
        jabatan,
      });

      localStorage.setItem("registeredEmail", email);

      Swal.fire({
        icon: "success",
        title: "Registered Successfully!",
        text: "Redirecting to OTP verification...",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        window.location.href = "/otp";
      }, 2000);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Register to your account</h1>
        <p className="text-muted-foreground text-sm">Enter your credentials below</p>
      </div>

      {/* Full Name */}
      <div className="grid gap-1 relative">
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        {showErrors && errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
      </div>

      {/* Username */}
      <div className="grid gap-1 relative">
        <Label htmlFor="username">Username</Label>
        <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        {showErrors && errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
      </div>

      {/* Email */}
      <div className="grid gap-1 relative">
        <Label htmlFor="email">Email</Label>
        <Input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {showErrors && errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      {/* Password Field */}
      <div className="grid gap-1 relative">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-500 hover:text-black"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Password Rules */}
        {password && (
          <div className="mt-2 space-y-1">
            {Object.entries(getPasswordCriteriaStatus(password)).map(([key, isValid]) => {
              const labels = {
                length: "Minimum 6 characters",
                lowercase: "At least 1 lowercase letter",
                uppercase: "At least 1 uppercase letter",
                number: "At least 1 number",
                special: "At least 1 special character",
              };
              const Icon = isValid ? CheckCircle : XCircle;
              const iconColor = isValid ? "text-green-600" : "text-red-500";
              const textColor = isValid ? "text-green-700" : "text-gray-600";

              return (
                <div key={key} className="flex items-center text-sm gap-2">
                  <Icon size={16} className={iconColor} />
                  <span className={textColor}>{labels[key]}</span>
                </div>
              );
            })}
          </div>
        )}
        {showErrors && errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
      </div>

      {/* Phone */}
      <div className="grid gap-1 relative">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input type="number" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        {showErrors && errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
      </div>

      {/* Birth */}
      <div className="grid gap-1">
        <Label htmlFor="birth">Date of Birth</Label>
        <Input type="date" id="birth" value={birth} onChange={(e) => setBirth(e.target.value)} />
        {showErrors && errors.birth && <p className="text-red-500 text-sm">{errors.birth}</p>}
      </div>

      {/* Jabatan */}
      <div className="grid gap-1">
        <Label htmlFor="jabatan">Job Position</Label>
        <Select onValueChange={setJabatan}>
          <SelectTrigger
            id="jabatan"
            className="w-full h-10 px-3 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            {[
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
            ].map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {showErrors && errors.jabatan && <p className="text-red-500 text-sm">{errors.jabatan}</p>}
      </div>

      {/* Submit */}
      <Button type="submit" disabled={loading}>
        {loading ? <ClipLoader size={20} color="#fff" /> : "Register"}
      </Button>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="/login" className="underline underline-offset-4">
          Login
        </a>
      </div>
    </form>
  );
}
