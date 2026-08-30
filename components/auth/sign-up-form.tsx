"use client";

import React, { useState } from "react";
import Link from "next/link";
import { NeoInput } from "@/components/common/neo-input";
import { NeoButton } from "@/components/common/neo-button";
import { usePostContext } from "@/context/post-context";

export const SignUpForm: React.FC = () => {
  const { signup } = usePostContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const success = await signup({ name, email, password, confirmPassword });
      if (!success) {
        setErrorMsg("Email already exists or registration failed.");
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {errorMsg && (
        <div className="bg-[#ff94b1] border-[3px] border-[#000000] p-3 text-xs font-bold text-[#1b1c1a] shadow-[4px_4px_0px_0px_#000000]">
          ⚠️ {errorMsg}
        </div>
      )}

      <NeoInput
        label="Full Name"
        type="text"
        placeholder="Alex Rivera"
        value={name}
        onChange={(e) => setName(e.target.value)}
        icon="person"
        required
      />

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
        placeholder="Create a strong password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon="lock"
        required
      />

      <NeoInput
        label="Confirm Password"
        type="password"
        placeholder="Repeat your password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        icon="lock_reset"
        required
      />

      <div className="text-xs font-bold text-[#414750] my-1">
        By creating an account, you agree to our Terms of Service & Privacy Policy.
      </div>

      <NeoButton variant="primary" size="lg" fullWidth type="submit" disabled={loading}>
        {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT →"}
      </NeoButton>

      <div className="text-center pt-3 border-t-[3px] border-[#000000] mt-2">
        <p className="text-xs font-bold text-[#414750]">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-[#0062a0] font-black hover:underline ml-1">
            SIGN IN →
          </Link>
        </p>
      </div>
    </form>
  );
};
