"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { signIn } from "next-auth/react";
import { Icons } from "./Icons";
import { toast } from "@/hooks/useToast";

const AuthForm = () => {
  const [isLoading, setisLoading] = useState<boolean>(false);

  const loginWithGoogle = async () => {
    setisLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      toast({
        title: "Oh uh!",
        description: "There was an error signing in.",
        variant: "destructive",
      });
    } finally {
      setisLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <Button
        onClick={loginWithGoogle}
        isLoading={isLoading}
        size="sm"
        className="w-full"
      >
        {!isLoading && <Icons.google className="w-4 h-4 mr-2" />}
        Google
      </Button>
    </div>
  );
};

export default AuthForm;
