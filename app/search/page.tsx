import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Search Skills - SkillCircle",
  description:
    "Discover and search for skills to learn or teach on SkillCircle. Find people in your area or online who want to exchange knowledge through our skill barter platform.",
  openGraph: {
    title: "Search Skills - SkillCircle",
    description:
      "Discover and search for skills to learn or teach on SkillCircle.",
    type: "website",
  },
};

export default function SearchPage() {
  // Sample skills data - in a real app, this would come from a database
  const sampleSkills = [
    {
      id: 1,
      title: "Web Development",
      category: "Technology",
      description:
        "Learn modern web development with React, Next.js, and TypeScript",
      teacher: "John Doe",
      location: "Online",
      exchange: "Looking to learn: Graphic Design",
    },
    {
      id: 2,
      title: "Guitar Lessons",
      category: "Music",
      description:
        "Beginner to intermediate guitar lessons, acoustic and electric",
      teacher: "Sarah Smith",
      location: "New York, NY",
      exchange: "Looking to learn: Photography",
    },
    {
      id: 3,
      title: "Spanish Language",
      category: "Languages",
      description: "Native Spanish speaker offering conversational practice",
      teacher: "Carlos Rodriguez",
      location: "Online",
      exchange: "Looking to learn: English Business Writing",
    },
    {
      id: 4,
      title: "Digital Marketing",
      category: "Business",
      description: "SEO, social media marketing, and content strategy",
      teacher: "Emily Chen",
      location: "San Francisco, CA",
      exchange: "Looking to learn: Data Analysis",
    },
    {
      id: 5,
      title: "Cooking - Italian Cuisine",
      category: "Culinary",
      description: "Traditional Italian recipes and cooking techniques",
      teacher: "Marco Rossi",
      location: "Chicago, IL",
      exchange: "Looking to learn: Baking & Pastry",
    },
    {
      id: 6,
      title: "Yoga & Meditation",
      category: "Health & Wellness",
      description: "Hatha yoga and mindfulness meditation for beginners",
      teacher: "Lisa Johnson",
      location: "Online",
      exchange: "Looking to learn: Nutrition Planning",
    },
  ];

  const categories = [
    "All",
    "Technology",
    "Music",
    "Languages",
    "Business",
    "Culinary",
    "Health & Wellness",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Search Skills
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing skills to learn and find people who want to teach
            what you know
          </p>
        </div>

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
