import React from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <AuthLayout
      title="SIGN IN TO POSTFORGE"
      subtitle="Welcome back! Access your Neubrutalist LinkedIn content studio."
    >
      <SignInForm />
    </AuthLayout>
  );
}
