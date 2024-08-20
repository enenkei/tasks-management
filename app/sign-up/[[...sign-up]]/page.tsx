import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center translate-y-1/2">
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </div>
  );
};
export default SignUpPage;