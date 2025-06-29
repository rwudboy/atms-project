"use client";
import Swal from "sweetalert2";
import { useState } from "react";
import { loginUser } from "@/interface-adapters/usecases/login/loginUser";
import { cn } from "@/interface-adapters/lib/utils";
import { Button } from "@/interface-adapters/components/ui/button";
import { Input } from "@/interface-adapters/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/interface-adapters/components/ui/label";
import { ClipLoader } from "react-spinners";

export function LoginForm({ className, ...props }) {
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = { email: "", password: "" };

    if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);

    // If any error exists, do not proceed
    if (newErrors.email || newErrors.password) return;

    setLoading(true);

    try {
      await loginUser(email, password);

      Swal.fire({
        icon: "success",
        title: "Login Success!",
        text: "You can now go in with your account.",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/dashboard";
        }
      });

      setEmail("");
      setPassword("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="text"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div className="grid gap-1.5 relative">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a href="/forgotPassword" className="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-500 hover:text-black"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>


        <Button type="submit" disabled={loading}>
          {loading ? <ClipLoader size={20} color="#fff" /> : "Login"}
        </Button>
      </div>

      <div className="text-center text-sm">
        Don't have an account?{" "}
        <a href="/register" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  );
}
