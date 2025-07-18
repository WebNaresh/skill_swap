/**
 * Skills Search and Discovery Page for SkillCircle Platform
 * Allows authenticated users to browse and search for available skills
 */

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SkillsSearchClient } from "./components/skills-search-client";

export const metadata: Metadata = {
  title: "Discover Skills - SkillCircle",
  description:
    "Browse and search for skills offered by the SkillCircle community. Find the perfect skill exchange partner.",
  openGraph: {
    title: "Discover Skills - SkillCircle",
    description:
      "Browse and search for skills offered by the SkillCircle community. Find the perfect skill exchange partner.",
    type: "website",
  },
};

export default async function SkillsSearchPage() {
  const session = await getServerSession(authOptions);

  // Redirect if not authenticated
  if (!session?.user) {
    redirect("/sign-in");
  }

  // Redirect if profile is not completed
  if (!session.user.isSetupCompleted) {
    redirect("/profile");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Skills
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Browse and search for skills offered by our community
          </p>
          <p className="text-gray-500">
            Find the perfect skill exchange partner and start learning today
          </p>
        </div>

        {/* Skills Search Client Component */}
        <SkillsSearchClient />
      </div>
    </div>
  );
}
