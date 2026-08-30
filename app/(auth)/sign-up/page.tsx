import React from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { SignUpForm } from "@/components/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <AuthLayout
      title="CREATE YOUR ACCOUNT"
      subtitle="Join PostForge AI and start crafting viral LinkedIn posts."
    >
      <SignUpForm />
    </AuthLayout>
  );
}
