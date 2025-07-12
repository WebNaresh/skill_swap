"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export function AuthStatus() {
  const { data: session, status } = useSession();

  console.log(`🚀 ~ auth-status.tsx:10 ~ AuthStatus ~ status:`, status);

  console.log(`🚀 ~ auth-status.tsx:10 ~ AuthStatus ~ data:`, session);

  if (status === "loading") {
    return <div className="text-gray-600">Loading...</div>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt={`${session.user?.name || "User"} profile picture`}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
              priority
            />
          )}
          <span className="text-gray-700">
            Welcome, {session.user?.name || session.user?.email}!
          </span>
          {!session.user?.isSetupCompleted && (
            <Link
              href="/profile"
              className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded-full hover:bg-sky-200 transition-colors cursor-pointer"
              title="Click to complete your profile setup"
            >
              Setup Required
            </Link>
          )}
        </div>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/sign-in"
      className="px-4 py-2 text-sm bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
    >
      Sign In
    </Link>
  );
}
