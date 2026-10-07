/**
 * Skills Search and Discovery Page for SkillCircle Platform
 * Allows authenticated users to browse and search for available skills
 */

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Compass } from "lucide-react";
import { PageHeader } from "@/components/utils/page-header";
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
    <div className="bg-page min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto px-4 py-10">
        <PageHeader
          icon={Compass}
          eyebrow="Explore"
          title="Discover Skills"
          description="Browse skills offered by the community and find the perfect exchange partner."
        />
        <SkillsSearchClient />
      </div>
    </div>
  );
}
