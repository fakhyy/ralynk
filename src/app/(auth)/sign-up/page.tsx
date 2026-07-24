import { Metadata } from "next";
import { SignUpPage } from "./SignUpPage";

export default function () {
  return <SignUpPage />
}

export const metadata: Metadata = {
  title: "Sign up"
}