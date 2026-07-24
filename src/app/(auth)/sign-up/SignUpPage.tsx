"use client";

import { SocialLogins } from "../_components/social-logins";
import { AuthPageWrapper } from "../_components/wrapper";
import { SignUpForm } from "./SignUpForm";

export function SignUpPage() {
  return (
    <AuthPageWrapper
      title="Noesis"
      description="Create your account."
      footer={{
        label: "Already have an account?",
        linkText: "Sign in",
        link: "/login",
      }}
    >
      <SignUpForm />
      <SocialLogins />
    </AuthPageWrapper>
  );
}
