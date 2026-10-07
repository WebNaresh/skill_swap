/**
 * Profile Setup Page for SkillCircle Platform
 * Allows new users to complete their profile after Google OAuth
 */

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRoundCog } from "lucide-react";
import { PageHeader } from "@/components/utils/page-header";
import { ProfileSetupForm } from "./components/profile-setup-form";

export const metadata: Metadata = {
  title: "Complete Your Profile - SkillCircle",
  description:
    "Complete your SkillCircle profile to start exchanging skills with our community.",
  openGraph: {
    title: "Complete Your Profile - SkillCircle",
    description:
      "Complete your SkillCircle profile to start exchanging skills with our community.",
    type: "website",
  },
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  // Redirect if not authenticated
  if (!session?.user) {
    redirect("/sign-in");
  }

  // Redirect if profile is already completed
  if (session.user.isSetupCompleted) {
    redirect("/");
  }

  return (
    <div className="bg-page min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <PageHeader
          icon={UserRoundCog}
          eyebrow="Getting started"
          title="Complete your profile"
          description="Tell us what you can teach and what you'd like to learn so we can match you with the right people."
        />

        <ProfileSetupForm user={session.user} />

        <p className="mt-8 text-center text-sm text-muted-foreground">
          You can always update your profile later in your account settings.
        </p>
      </div>
    </div>
  );
}
