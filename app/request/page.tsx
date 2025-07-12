/**
 * Skill Exchange Requests Page for SkillCircle Platform
 * Displays incoming and outgoing skill exchange requests for authenticated users
 */

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SkillExchangeRequestsClient } from "./components/skill-exchange-requests-client";

export const metadata: Metadata = {
  title: "My Skill Exchange Requests - SkillCircle",
  description: "Manage your incoming and outgoing skill exchange requests on SkillCircle.",
  openGraph: {
    title: "My Skill Exchange Requests - SkillCircle",
    description: "Manage your incoming and outgoing skill exchange requests on SkillCircle.",
    type: "website",
  },
};

export default async function SkillExchangeRequestsPage() {
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
            My Skill Exchange Requests
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Manage your incoming and outgoing skill exchange requests
          </p>
          <p className="text-gray-500">
            Connect with community members and track your learning journey
          </p>
        </div>

        {/* Skill Exchange Requests Client Component */}
        <SkillExchangeRequestsClient />
      </div>
    </div>
  );
}
