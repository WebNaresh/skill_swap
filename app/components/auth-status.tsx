"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Inbox, LogOut, Search, UserCog } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

function getInitials(name?: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Skeleton className="size-9 rounded-full" />;
  }

  if (!session) {
    return (
      <Button asChild size="pill">
        <Link href="/sign-in">Sign In</Link>
      </Button>
    );
  }

  const { user } = session;

  return (
    <div className="flex items-center gap-2">
      {!user.isSetupCompleted && (
        <Badge
          asChild
          className="hidden border-amber-200 bg-amber-50 text-amber-700 sm:inline-flex"
        >
          <Link href="/profile" title="Complete your profile setup">
            <span className="size-1.5 animate-pulse rounded-full bg-amber-500" />
            Finish setup
          </Link>
        </Badge>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="rounded-full ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Open account menu"
          >
            <Avatar className="size-9 border-2 border-background shadow-sm ring-1 ring-border">
              {user.image && (
                <AvatarImage src={user.image} alt={user.name || "User"} />
              )}
              <AvatarFallback className="bg-accent text-sm font-semibold text-accent-foreground">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuLabel className="font-normal">
            <p className="truncate text-sm font-semibold">
              {user.name || "SkillCircle member"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {!user.isSetupCompleted && (
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <UserCog />
                Complete profile
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link href="/search">
              <Search />
              Discover skills
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/request">
              <Inbox />
              My requests
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
