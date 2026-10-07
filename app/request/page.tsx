/**
 * Skill Exchange Requests Page for SkillCircle Platform
 * Displays incoming and outgoing skill exchange requests for authenticated users
 */

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Inbox } from "lucide-react";
import { PageHeader } from "@/components/utils/page-header";
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
    <div className="bg-page min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto px-4 py-10">
        <PageHeader
          icon={Inbox}
          eyebrow="Exchanges"
          title="My Requests"
          description="Manage incoming and outgoing skill exchange requests and track your learning journey."
        />
        <SkillExchangeRequestsClient />
      </div>
    </div>
  );
}
