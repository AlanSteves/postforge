"use client";

import React, { useState } from "react";
import Link from "next/link";
import { NeoInput } from "@/components/common/neo-input";
import { NeoButton } from "@/components/common/neo-button";
import { usePostContext } from "@/context/post-context";

export const SignInForm: React.FC = () => {
  const { signin } = usePostContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const success = await signin(email, password);
      if (!success) {
        setErrorMsg("Invalid email or password.");
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {errorMsg && (
        <div className="bg-[#ff94b1] border-[3px] border-[#000000] p-3 text-xs font-bold text-[#1b1c1a] shadow-[4px_4px_0px_0px_#000000]">
          ⚠️ {errorMsg}
        </div>
      )}

      <NeoInput
        label="Email Address"
        type="email"
        placeholder="creator@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon="mail"
        required
      />

      <NeoInput
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon="lock"
        required
      />

      <div className="flex justify-between items-center text-xs font-bold">
        <label className="flex items-center gap-2 cursor-pointer text-[#1b1c1a]">
          <input
            type="checkbox"
            defaultChecked
            className="w-4 h-4 border-[2px] border-[#000] rounded-none accent-[#74b9ff]"
          />
          Remember Me
        </label>
        <a href="#" className="text-[#0062a0] hover:underline">
          Forgot Password?
        </a>
      </div>

      <NeoButton variant="primary" size="lg" fullWidth type="submit" disabled={loading}>
        {loading ? "AUTHENTICATING..." : "SIGN IN →"}
      </NeoButton>

      <div className="text-center pt-3 border-t-[3px] border-[#000000] mt-2">
        <p className="text-xs font-bold text-[#414750]">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-[#0062a0] font-black hover:underline ml-1">
            SIGN UP NOW →
          </Link>
        </p>
      </div>
    </form>
  );
};
