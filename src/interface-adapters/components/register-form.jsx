"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { cn } from "@/enterprise-business-rules/lib/utils";
import { Button } from "@/interface-adapters/components/ui/button";
import { Input } from "@/interface-adapters/components/ui/input";
import { Label } from "@/interface-adapters/components/ui/label";
import { registerUserUseCase } from "@/app/usecases/registerUser";
import { ClipLoader } from "react-spinners";

export function RegisterForm({ className, ...props }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birth, setBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const isValid = {
    username: username && !errors.username,
    password: password && !errors.password,
    email: email && !errors.email,
    phone: phone && !errors.phone,
  };

  const validateInputs = () => {
    const newErrors = {};

    if (!username) newErrors.username = "Data cant be empty";
    if (!password) newErrors.password = "Data cant be empty";
    if (!email) newErrors.email = "Data cant be empty";
    if (!birth) newErrors.birth = "Data cant be empty";

    if (username && (!/[a-zA-Z]/.test(username) || username.length < 3)) {
      newErrors.username = "Username must include letters and be at least 3 characters.";
    }

    if (password && (!/[A-Z]/.test(password) || !/[^a-zA-Z0-9]/.test(password) || password.length < 6)) {
      newErrors.password = "Password must be at least 6 characters, with 1 capital and 1 symbol.";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email address.";
    }

    if (phone && !/^\d{10,13}$/.test(phone)) {
      newErrors.phone = "Phone number must be 10–13 digits if filled.";
    }

    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setShowErrors(true);
    setLoading(true);

    const newErrors = validateInputs();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setLoading(false);
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
      }).then(() => {
        window.location.href = "/login";
      });

      setUsername("");
      setPassword("");
      setEmail("");
      setBirth("");
      setPhone("");
      setShowErrors(false);
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
    <form onSubmit={handleRegister} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="text-center">
        <h1 className="text-2xl font-bold">Register to your account</h1>
        <p className="text-muted-foreground text-sm">Enter your credentials below</p>
      </div>

      {/* Username */}
      <div className="grid gap-1 relative">
        <Label htmlFor="username">Username</Label>
        <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        {isValid.username && (
          <motion.div className="absolute top-8 right-3 text-green-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <CheckCircle size={20} />
          </motion.div>
        )}
        {showErrors && errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
      </div>

      {/* Password */}
      <div className="grid gap-1 relative">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {isValid.password && (
          <motion.div className="absolute top-8 right-3 text-green-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <CheckCircle size={20} />
          </motion.div>
        )}
        {password && (
          <div className="mt-1">
            <div className="h-2 w-full bg-gray-200 rounded">
              <div
                className={`${strengthColor} h-2 rounded`}
                style={{ width: `${(passwordStrength / 4) * 100}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-1">{strengthLabel}</p>
          </div>
        )}
        {showErrors && errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
      </div>

      {/* Email */}
      <div className="grid gap-1 relative">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {isValid.email && (
          <motion.div className="absolute top-8 right-3 text-green-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <CheckCircle size={20} />
          </motion.div>
        )}
        {showErrors && errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      {/* Date of Birth */}
      <div className="grid gap-1">
        <Label htmlFor="birth">Date of Birth</Label>
        <Input type="date" id="birth" value={birth} onChange={(e) => setBirth(e.target.value)} />
        {showErrors && errors.birth && <p className="text-red-500 text-sm">{errors.birth}</p>}
      </div>

      {/* Phone (optional) */}
      <div className="grid gap-1 relative">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input type="number" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        {isValid.phone && (
          <motion.div className="absolute top-8 right-3 text-green-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <CheckCircle size={20} />
          </motion.div>
        )}
        {showErrors && errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
      </div>

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
