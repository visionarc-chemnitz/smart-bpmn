// user-avatar.tsx
"use client"; // This indicates the component is a client component.

import { useSession } from "next-auth/react";

export default function UserAvatar() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <div>
      <img src={session.user.image ?? ""} alt="User Avatar" />
    </div>
  );
}
