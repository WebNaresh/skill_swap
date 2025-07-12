/**
 * Profile Setup Page for SkillCircle Platform
 * Allows new users to complete their profile after Google OAuth
 */

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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

  console.log(`🚀 ~ page.tsx:25 ~ ProfilePage ~ session:`, session);

  // Redirect if not authenticated
  if (!session?.user) {
    redirect("/sign-in");
  }

  // Redirect if profile is already completed
  if (session.user.isSetupCompleted) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to SkillCircle!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Let&apos;s complete your profile to get started
          </p>
          <p className="text-gray-500">
            This will help us match you with the perfect skill exchange partners
          </p>
        </div>

        {/* Profile Setup Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <ProfileSetupForm user={session.user} />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            You can always update your profile later in your account settings
          </p>
        </div>
      </div>
    </div>
  );
}
