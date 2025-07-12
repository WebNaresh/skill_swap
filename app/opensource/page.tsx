import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Users,
  Heart,
  Code,
  GitBranch,
  MessageSquare,
  Shield,
  CheckCircle,
  Github,
  ExternalLink,
  Star,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Open Source Guidelines | SkillCircle",
  description:
    "Learn how to contribute to SkillCircle, our open source skill exchange platform. Find guidelines for contributing, code of conduct, and development setup.",
  keywords: [
    "open source",
    "contributing",
    "SkillCircle",
    "skill exchange",
    "community",
    "development",
  ],
  openGraph: {
    title: "Open Source Guidelines | SkillCircle",
    description:
      "Join our open source community and help build the future of skill exchange",
    url: "https://circleskills.vercel.app/opensource",
    siteName: "SkillCircle",
    type: "website",
  },
};

export default function OpenSourcePage() {
  return (
    <div className="bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <BookOpen className="h-4 w-4" />
              Open Source Project
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Built for the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">
                Community
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              SkillCircle is proudly open source. Join our community of
              developers, designers, and contributors who are building the
              future of skill exchange together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href="https://github.com/WebNaresh/skill_swap"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-4 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <Github className="h-5 w-5" />
                View on GitHub
                <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                href="#contributing"
                className="px-8 py-4 border-2 border-sky-600 text-sky-600 rounded-xl font-semibold hover:bg-sky-50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Code className="h-5 w-5" />
                Start Contributing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Open Source Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Open Source?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We believe in transparency, collaboration, and community-driven
                development
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Community Driven
                </h3>
                <p className="text-gray-600">
                  Features and improvements guided by real user needs and
                  community feedback
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Transparency
                </h3>
                <p className="text-gray-600">
                  Open development process where everyone can see how decisions
                  are made
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Free Forever
                </h3>
                <p className="text-gray-600">
                  Committed to keeping skill exchange accessible to everyone,
                  always
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contributing Guidelines Section */}
      <section
        id="contributing"
        className="py-20 bg-gradient-to-br from-gray-50 to-sky-50"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Contributing Guidelines
              </h2>
              <p className="text-lg text-gray-600">
                Learn how to contribute to SkillCircle and make a meaningful
                impact
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <GitBranch className="w-4 h-4 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Getting Started
                    </h3>
                    <div className="space-y-2 text-gray-600">
                      <p>1. Fork the repository on GitHub</p>
                      <p>2. Clone your fork locally</p>
                      <p>3. Create a new branch for your feature or bug fix</p>
                      <p>4. Make your changes and test thoroughly</p>
                      <p>5. Submit a pull request with a clear description</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Code className="w-4 h-4 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Development Setup
                    </h3>
                    <div className="space-y-2 text-gray-600">
                      <p>• Node.js 18+ and npm/yarn/pnpm</p>
                      <p>• MongoDB (local or Atlas)</p>
                      <p>• Google OAuth credentials for authentication</p>
                      <p>• Follow our detailed setup guide in README.md</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Code Standards
                    </h3>
                    <div className="space-y-2 text-gray-600">
                      <p>• Use TypeScript for all new code</p>
                      <p>• Follow existing code style and conventions</p>
                      <p>• Write meaningful commit messages</p>
                      <p>
                        • Ensure all tests pass and add new tests for features
                      </p>
                      <p>• Maintain responsive design principles</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contributors Section */}
      <section className="py-20 bg-gradient-to-br from-sky-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Amazing Contributors
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Meet the talented developers who are building SkillCircle and
                making skill exchange accessible to everyone
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 mb-12">
              {/* Primary Contributor - WebNaresh */}
              <div className="md:col-span-2 bg-white rounded-2xl p-8 shadow-lg border-2 border-sky-200 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-sky-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Project Lead & Creator
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-sky-200 shadow-lg">
                      <Image
                        src="https://avatars.githubusercontent.com/u/91016022?v=4"
                        alt="WebNaresh GitHub Avatar"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        priority
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center ring-2 ring-white shadow-md">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      WebNaresh
                    </h3>
                    <p className="text-sky-600 font-semibold mb-3">
                      Repository Owner & Lead Developer
                    </p>
                    <p className="text-gray-600 mb-4">
                      Created and maintains the entire SkillCircle platform.
                      Passionate about building community-driven solutions that
                      make learning accessible to everyone.
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>500+ Commits</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Code className="w-4 h-4 text-blue-500" />
                        <span>Full Stack</span>
                      </div>
                    </div>
                    <a
                      href="https://github.com/WebNaresh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      View GitHub Profile
                    </a>
                  </div>
                </div>
              </div>

              {/* Community Contributors */}
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                    CC
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Community Contributors
                  </h3>
                  <p className="text-green-600 font-medium mb-3">
                    UI/UX & Features
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    Enhanced user interface and added new platform features
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>25+ Contributions</span>
                  </div>
                  <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium text-sm">
                    Join Our Community
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                    DC
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Documentation Team
                  </h3>
                  <p className="text-purple-600 font-medium mb-3">
                    Docs & Testing
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    Improved documentation and testing coverage
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span>15+ Contributions</span>
                  </div>
                  <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium text-sm">
                    Join Our Community
                  </div>
                </div>
              </div>
            </div>

            {/* Contribution Stats */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-sky-200 mb-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Contribution Statistics
                </h3>
                <p className="text-gray-600">
                  See the impact our community is making on SkillCircle
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-sky-600 mb-2">
                    540+
                  </div>
                  <div className="text-gray-600 font-medium">Total Commits</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    3
                  </div>
                  <div className="text-gray-600 font-medium">
                    Active Contributors
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    50+
                  </div>
                  <div className="text-gray-600 font-medium">
                    Issues Resolved
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    100%
                  </div>
                  <div className="text-gray-600 font-medium">Open Source</div>
                </div>
              </div>
            </div>

            {/* Call to Action for Contributors */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-sky-600 to-blue-700 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">
                  Ready to Join Our Contributors?
                </h3>
                <p className="text-sky-100 mb-6 max-w-2xl mx-auto">
                  Whether you&apos;re a seasoned developer or just starting out,
                  there&apos;s a place for you in our community. Every
                  contribution helps make skill exchange more accessible.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://github.com/WebNaresh/skill_swap"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-white text-sky-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    <Github className="h-5 w-5" />
                    Start Contributing
                  </a>
                  <a
                    href="https://github.com/WebNaresh/skill_swap/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-sky-600 transition-colors"
                  >
                    View Open Issues
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Code of Conduct Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Code of Conduct
              </h2>
              <p className="text-lg text-gray-600">
                We are committed to providing a welcoming and inclusive
                environment for all
              </p>
            </div>

            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Heart className="w-6 h-6 text-sky-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Be Respectful
                    </h3>
                    <p className="text-gray-600">
                      Treat all community members with respect and kindness,
                      regardless of their background or experience level.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Users className="w-6 h-6 text-sky-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Be Inclusive
                    </h3>
                    <p className="text-gray-600">
                      Welcome newcomers and help create an environment where
                      everyone feels comfortable contributing.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MessageSquare className="w-6 h-6 text-sky-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Communicate Constructively
                    </h3>
                    <p className="text-gray-600">
                      Provide helpful feedback, ask questions respectfully, and
                      engage in productive discussions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NaviByte Acknowledgment Section */}
      <section className="py-20 bg-gradient-to-r from-sky-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Thanks to NaviByte Innovation
            </h2>
            <p className="text-xl text-sky-100 mb-8">
              Special recognition to NaviByte Innovation for their exceptional
              development work, commitment to open source principles, and
              dedication to building community-driven solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="http://navibyte.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-sky-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                Visit NaviByte Innovation
                <ExternalLink className="h-4 w-4" />
              </a>
              <Link
                href="/"
                className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-sky-600 transition-colors"
              >
                Back to SkillCircle
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
