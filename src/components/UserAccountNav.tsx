"use client";

import { FC } from "react";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";

interface UserAccountNavProps {
  user: Pick<User, "name" | "image" | "email">;
}

const UserAccountNav: FC<UserAccountNavProps> = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          className="w-8 h-8"
          user={{ name: user.name || null, image: user.image || null }}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="font-medium w-[200px] truncate text-sm text-zinc-700">
                {user.email}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          asChild
          className="cursor-pointer hover:bg-gray-100 rounded-sm"
        >
          <Link href={"/"}>Feed</Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          className="cursor-pointer hover:bg-gray-100 rounded-sm"
        >
          <Link href={"/r/create"}>Create Community</Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          className="cursor-pointer hover:bg-gray-100 rounded-sm"
        >
          <Link href={"/settings"}>Settings</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-300" />

        <DropdownMenuItem
          className="cursor-pointer hover:bg-gray-100 rounded-sm"
          onSelect={(event) => {
            event.preventDefault();
            signOut({ callbackUrl: `${window.location.origin}/sign-in` });
          }}
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
