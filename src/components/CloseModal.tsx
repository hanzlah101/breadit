"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "./ui/Button";
import { useRouter } from "next/navigation";

const CloseModal = () => {
  const router = useRouter();

  return (
    <Button
      variant={"subtle"}
      className="w-6 h-6 rounded-md p-0"
      aria-label="Close Modal"
      onClick={router.back}
    >
      <X className="w-4 h-4" />
    </Button>
  );
};

export default CloseModal;
