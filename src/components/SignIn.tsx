import Link from "next/link";
import { Icons } from "./Icons";
import AuthForm from "./AuthForm";

const SignIn = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="w-7 h-7 mx-auto" />
        <h2 className="text-2xl font-semibold tracking-tight">Welcome Back!</h2>
        <p className="text-sm max-w-xs mx-auto">
          By continuing, you are setting up a Breadit account and agree our User
          Agrement and Privacy Policy.
        </p>

        <AuthForm />
      </div>
    </div>
  );
};

export default SignIn;
