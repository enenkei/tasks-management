import { SignIn } from "@clerk/nextjs";
import React from "react";

const SignInPage = () => {
  return (
    <div className="flex items-center justify-center translate-y-1/2">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  )
};
export default SignInPage;