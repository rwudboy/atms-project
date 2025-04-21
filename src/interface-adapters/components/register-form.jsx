"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { cn } from "@/enterprise-business-rules/lib/utils";
import { Button } from "@/interface-adapters/components/ui/button";
import { Input } from "@/interface-adapters/components/ui/input";
import { Label } from "@/interface-adapters/components/ui/label";
import { registerUserUseCase } from "@/app/usecases/registerUser";
import { ClipLoader } from "react-spinners";  // Import ClipLoader from react-spinners

export function RegisterForm({ className, ...props }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birth, setBirth] = useState("");
  const [phone, setPhone] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // State for loading

  // Helper: password strength
  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    if (password.length >= 10) score++;
    return score;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthLabel = ["Weak", "Fair", "Good", "Strong"][passwordStrength - 1] || "";
  const strengthColor = ["bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"][passwordStrength - 1] || "bg-gray-200";

  // Helper: valid fields
  const isValid = {
    username: username && !errors.username,
    password: password && !errors.password,
    email: email && !errors.email,
    phone: phone && !errors.phone,
  };

  // Live validation
  useEffect(() => {
    const newErrors = {};

    if (username && (!/[a-zA-Z]/.test(username) || username.length < 3)) {
      newErrors.username = "Username must include letters and be at least 3 characters.";
    }

    if (
      password &&
      (!/[A-Z]/.test(password) || !/[^a-zA-Z0-9]/.test(password) || password.length < 6)
    ) {
      newErrors.password = "Password must be at least 6 characters, with 1 capital and 1 symbol.";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email address.";
    }

    if (phone && !/^\d{10,13}$/.test(phone)) {
      newErrors.phone = "Phone number must be 10–13 digits if filled.";
    }

    setErrors(newErrors);
  }, [username, password, email, phone]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);  // Set loading to true

    if (Object.keys(errors).length > 0) {
      const checklist = Object.values(errors)
        .map((error) => `<li style="text-align: left;">❌ ${error}</li>`)
        .join("");

      Swal.fire({
        icon: "error",
        title: "Please fix the following issues:",
        html: `<ul style="list-style: none; padding-left: 0;">${checklist}</ul>`,
        confirmButtonText: "OK",
      });

      setLoading(false); // Set loading to false when done
      return;
    }

    try {
      await registerUserUseCase({
        username,
        password,
        email,
        birth,
        phone,
      });

      Swal.fire({
        icon: "success",
        title: "Registered Successfully!",
        text: "You can now log in with your account.",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/login";
        }
      });

      setUsername("");
      setPassword("");
      setEmail("");
      setBirth("");
      setPhone("");
      setLoading(false); // Set loading to false after successful registration
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message,
      });
      setLoading(false); // Set loading to false if there's an error
    }
  };

  return (
    <form onSubmit={handleRegister} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Register to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your credentials below to register your account
        </p>
      </div>

      <div className="grid gap-6">
        {/* Username */}
        <div className="grid gap-1 relative">
          <Label htmlFor="username">Username</Label>
          <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          {isValid.username && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-8 right-3 text-green-500"
            >
              <CheckCircle size={20} />
            </motion.div>
          )}
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
        </div>

        {/* Password */}
        <div className="grid gap-1 relative">
          <Label htmlFor="password">Password</Label>
          <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {isValid.password && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-8 right-3 text-green-500"
            >
              <CheckCircle size={20} />
            </motion.div>
          )}
          {password && (
            <div className="mt-1">
              <div className="h-2 w-full bg-gray-200 rounded">
                <div
                  className={`${strengthColor} h-2 rounded transition-all`}
                  style={{ width: `${(passwordStrength / 4) * 100}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">{strengthLabel}</p>
            </div>
          )}
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        {/* Email */}
        <div className="grid gap-1 relative">
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          {isValid.email && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-8 right-3 text-green-500"
            >
              <CheckCircle size={20} />
            </motion.div>
          )}
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        {/* Date of Birth */}
        <div className="grid gap-1">
          <Label htmlFor="birth">Date of Birth</Label>
          <Input type="date" id="birth" value={birth} onChange={(e) => setBirth(e.target.value)} required />
        </div>

        {/* Phone */}
        <div className="grid gap-1 relative">
          <Label htmlFor="phone">Phone Number (optional)</Label>
          <Input type="number" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          {isValid.phone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-8 right-3 text-green-500"
            >
              <CheckCircle size={20} />
            </motion.div>
          )}
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>

        <Button type="submit" disabled={Object.keys(errors).length > 0 || loading}>
          {loading ? <ClipLoader size={20} color="#fff" /> : "Register"}
        </Button>
      </div>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="/login" className="underline underline-offset-4">
          Login
        </a>
      </div>
    </form>
  );
}
