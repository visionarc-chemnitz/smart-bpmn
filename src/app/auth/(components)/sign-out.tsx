"use client";

import { LogOut } from "lucide-react";
import { handleSignOut } from "../actions";

export default function SignOut() {
  return (
    <form action={handleSignOut}>
      <button className="flex w-full items-center justify-center gap-2">
        <LogOut />
        <span>Log out</span>
      </button>
    </form>
  )
}