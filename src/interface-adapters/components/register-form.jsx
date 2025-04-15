"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import { cn } from "@/enterprise-business-rules/lib/utils";
import { Button } from "@/interface-adapters/components/ui/button";
import { Input } from "@/interface-adapters/components/ui/input";
import { Label } from "@/interface-adapters/components/ui/label";
import { registerUserUseCase } from "@/app/usecases/registerUser";

export function RegisterForm({ className, ...props }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birth, setBirth] = useState("");
  const [phone, setPhone] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await registerUserUseCase({
        username,
        password,
        email,
        birth,
        phone,
      });
      console.log(username)
      console.log(password)
      console.log(email)
      console.log(birth)
      console.log(phone)

      Swal.fire({
        icon: "success",
        title: "Registered Successfully!",
        text: "You can now log in with your account.",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/login";
        }
      })

      // Optionally clear the form
      setUsername("");
      setPassword("");
      setEmail("");
      setBirth("");
      setPhone("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message,
      });
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
        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="birth">Date of Birth</Label>
          <Input type="date" id="birth" value={birth} onChange={(e) => setBirth(e.target.value)} required />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="phone">Phone Number</Label>
          <Input type="number" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <Button type="submit">Register</Button>
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
