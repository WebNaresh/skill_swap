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

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search for skills, topics, or keywords..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="lg:w-48">
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent">
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <button className="px-8 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleSkills.map((skill) => (
            <div
              key={skill.id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              {/* Category Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 bg-sky-100 text-sky-700 text-sm font-medium rounded-full">
                  {skill.category}
                </span>
                <span className="text-sm text-gray-500">{skill.location}</span>
              </div>

              {/* Skill Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {skill.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-4">{skill.description}</p>

              {/* Teacher */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-sky-200 rounded-full flex items-center justify-center">
                  <span className="text-sky-700 font-medium text-sm">
                    {skill.teacher
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <span className="text-gray-700 font-medium">
                  {skill.teacher}
                </span>
              </div>

              {/* Exchange Info */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Exchange:</span>{" "}
                  {skill.exchange}
                </p>
              </div>

              {/* Action Button */}
              <button className="w-full px-4 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors">
                Connect & Exchange
              </button>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Don&apos;t see what you&apos;re looking for?
            </h2>
            <p className="text-gray-600 mb-6">
              Join our community and post your own skills or learning requests.
              Connect with like-minded people who share your passion for
              learning.
            </p>
            <Link
              href="/sign-in"
              className="inline-block px-8 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors"
            >
              Join SkillCircle
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
