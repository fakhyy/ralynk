"use client";

import { LoginForm } from "./LoginForm";
import { SocialLogins } from "../_components/social-logins";
import { AuthPageWrapper } from "../_components/wrapper";

export function LoginPage() {
  return (
    <AuthPageWrapper
      title="Noesis"
      description="A place for your thoughts"
      footer={{
        label: "Don't have an account?",
        linkText: "Sign up",
        link: "/register",
      }}
    >
      <LoginForm />
      <SocialLogins />
    </AuthPageWrapper>
  );
}
