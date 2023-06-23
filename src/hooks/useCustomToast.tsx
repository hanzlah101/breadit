import Link from "next/link";
import { toast } from "./useToast";
import { buttonVariants } from "@/components/ui/Button";

export const useCustomToast = () => {
  const loginToast = () => {
    const { dismiss } = toast({
      title: "Login Required!",
      description: "You need to be logged in to do that.",
      variant: "destructive",
      action: (
        <Link
          href={"/sign-in"}
          onClick={() => dismiss()}
          className={
            "bg-inherit border text-xs border-white text-white rounded-sm py-1 px-1.5"
          }
        >
          Login
        </Link>
      ),
    });
  };

  return { loginToast };
};
