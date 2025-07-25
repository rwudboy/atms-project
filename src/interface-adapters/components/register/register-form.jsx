"use client"
import { useState } from "react";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/interface-adapters/components/ui/button";
import { Input } from "@/interface-adapters/components/ui/input";
import { Label } from "@/interface-adapters/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/interface-adapters/components/ui/select";
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

  // This function determines the strength color and label.
  const getPasswordStrength = (password) => {
    let score = 0;

    // If password is empty
    if (password.length === 0) {
      return { label: "Empty", percentage: 0, color: "bg-gray-300" };
    }
    
    // Check length only
    if (password.length < 6) {
      return { label: "Very Weak", percentage: 25, color: "bg-red-500" };
    }

    // For each condition, give 1 point
    if (/[A-Z]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;

    if (score < 2) {
      return { label: "Weak", percentage: 50, color: "bg-red-500" };
    } else if (score < 4) {
      return { label: "Good", percentage: 75, color: "bg-yellow-500" };
    } else {
      return { label: "Strong", percentage: 100, color: "bg-green-500" };
    }
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthColor = passwordStrength.color;
  const strengthLabel = passwordStrength.label;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowErrors(true);
    setLoading(true);

    try {
      // First validate with application layer
      const validationResult = await registerUser({
        fullName,
        username,
        password,
        email,
        birthDate: birth,
        phoneNumber: phone,
        position: jabatan
      });

      if (!validationResult.success) {
        setErrors(validationResult.errors || {});
        setLoading(false);
        return;
      }

      // Then call the API
      const apiResult = await registerUserApiCall({
        fullName,
        username,
        password,
        email,
        birth,
        phone,
        jabatan
      });

      // Store the email in localStorage
      localStorage.setItem('registeredEmail', email);

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

        {password && (
          <div className="mt-1">
            <div className="h-2 w-full bg-gray-200 rounded">
              <div
                className={`${strengthColor} h-2 rounded`}
                style={{ width: `${passwordStrength.percentage}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-1">{strengthLabel}</p>
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
