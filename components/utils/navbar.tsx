"use client";

import Link from "next/link";
import Image from "next/image";
import { AuthStatus } from "@/app/components/auth-status";
import { useState, useEffect } from "react";

export function Navbar() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/web-app-manifest-192x192.png"
              alt="SkillCircle Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-xl font-bold text-gray-900">SkillCircle</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {isClient ? (
              <>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-sky-600 transition-colors font-medium"
                >
                  Home
                </Link>
                <Link
                  href="/search"
                  className="text-gray-600 hover:text-sky-600 transition-colors font-medium"
                >
                  Search Skills
                </Link>
                <Link
                  href="/request"
                  className="text-gray-600 hover:text-sky-600 transition-colors font-medium"
                >
                  My Requests
                </Link>
              </>
            ) : (
              <>
                <span className="text-gray-600 font-medium">Home</span>
                <span className="text-gray-600 font-medium">Search Skills</span>
                <span className="text-gray-600 font-medium">My Requests</span>
              </>
            )}
          </div>

          {/* Auth Status */}
          <div className="flex items-center">
            {isClient ? (
              <AuthStatus />
            ) : (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
