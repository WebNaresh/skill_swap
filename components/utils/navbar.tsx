"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Home, Menu, Search, Inbox } from "lucide-react";
import { AuthStatus } from "@/app/components/auth-status";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Discover Skills", icon: Search },
  { href: "/request", label: "My Requests", icon: Inbox },
];

function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/70">
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo and Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-lg transition-opacity hover:opacity-80"
          >
            <Image
              src="/web-app-manifest-192x192.png"
              alt="SkillCircle Logo"
              width={32}
              height={32}
              className="rounded-lg shadow-sm"
            />
            <span className="text-lg font-bold tracking-tight">
              Skill<span className="text-primary">Circle</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 rounded-full border bg-card/60 p-1 shadow-xs md:flex">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  isActivePath(pathname, href)
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <AuthStatus />

            {/* Mobile Navigation */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Image
                      src="/web-app-manifest-192x192.png"
                      alt=""
                      width={24}
                      height={24}
                      className="rounded-md"
                    />
                    SkillCircle
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1 px-4">
                  {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActivePath(pathname, href)
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="size-4" />
                      {label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
