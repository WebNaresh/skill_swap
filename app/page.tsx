import Link from "next/link";
import {
  Users,
  BookOpen,
  TrendingUp,
  Star,
  ArrowRight,
  CheckCircle,
  Zap,
  Heart,
  Globe,
  Award,
  MessageCircle,
  Target,
} from "lucide-react";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        <div className="container mx-auto px-4 py-20 text-center relative">
          <div className="max-w-5xl mx-auto">
            {/* Hero Badge */}
            <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Zap className="h-4 w-4" />
              Join the skill exchange revolution
            </div>

            {/* Main Headline */}
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Where Skills Come{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">
                Full Circle
              </span>
            </h1>

            {/* Enhanced Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-4 leading-relaxed max-w-3xl mx-auto">
              Trade your expertise for new knowledge. No money required.
            </p>
            <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
              Connect with passionate learners and teachers in your community.
              Exchange skills, build relationships, and grow together.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/sign-in"
                className="group px-8 py-4 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Start Exchanging Skills
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/search"
                className="px-8 py-4 border-2 border-sky-600 text-sky-600 rounded-xl font-semibold hover:bg-sky-50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <BookOpen className="h-5 w-5" />
                Browse Skills
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                100% Free Platform
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Verified Community
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Safe & Secure
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Join Our Growing Community
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Thousands of learners and teachers are already exchanging skills
              on SkillCircle
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-sky-600 mb-2">
                1,200+
              </div>
              <div className="text-gray-600 font-medium">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-sky-600 mb-2">
                500+
              </div>
              <div className="text-gray-600 font-medium">Skills Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-sky-600 mb-2">
                850+
              </div>
              <div className="text-gray-600 font-medium">
                Successful Exchanges
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-sky-600 mb-2">
                4.9
              </div>
              <div className="text-gray-600 font-medium">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Contributors Section */}
      <section className="py-20 bg-gradient-to-br from-sky-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Users className="h-4 w-4" />
                Open Source Community
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Top Contributors
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Meet the amazing developers who are building SkillCircle and
                making skill exchange accessible to everyone
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Primary Contributor - WebNaresh */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-sky-200 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-sky-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Project Lead
                  </div>
                </div>
                <div className="text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                      WN
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    WebNaresh
                  </h3>
                  <p className="text-sky-600 font-medium mb-3">
                    Repository Owner & Lead Developer
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    Created and maintains the entire SkillCircle platform.
                    Passionate about building community-driven solutions.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>500+ Commits</span>
                  </div>
                  <a
                    href="https://github.com/WebNaresh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    View Profile
                  </a>
                </div>
              </div>

              {/* Community Contributor 1 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                    CC
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Community Contributor
                  </h3>
                  <p className="text-green-600 font-medium mb-3">
                    UI/UX Improvements
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    Enhanced user interface components and improved
                    accessibility features across the platform.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>25+ Contributions</span>
                  </div>
                  <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium">
                    Join Our Community
                  </div>
                </div>
              </div>

              {/* Community Contributor 2 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                    DC
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Documentation Contributor
                  </h3>
                  <p className="text-purple-600 font-medium mb-3">
                    Documentation & Testing
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    Improved project documentation, added comprehensive guides,
                    and enhanced testing coverage.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span>15+ Contributions</span>
                  </div>
                  <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium">
                    Join Our Community
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-sky-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Want to Contribute?
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Join our growing community of contributors and help make skill
                  exchange accessible to everyone. Every contribution, big or
                  small, makes a difference!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/opensource"
                    className="px-8 py-4 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    <Users className="h-5 w-5" />
                    View All Contributors
                  </Link>
                  <a
                    href="https://github.com/WebNaresh/skill_swap"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 border-2 border-sky-600 text-sky-600 rounded-xl font-semibold hover:bg-sky-50 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <BookOpen className="h-5 w-5" />
                    Contribute on GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-sky-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How SkillCircle Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform makes skill exchange simple, safe, and rewarding for
              everyone
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                Connect
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Find people with complementary skills in your area or online.
                Browse our diverse community of passionate learners and
                teachers.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                Exchange
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Trade your expertise for new skills through our secure barter
                system. No money required - just knowledge and enthusiasm.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                Grow
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Build your skills, expand your network, and track your progress.
                Join a community that values continuous learning and growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Why Choose SkillCircle?
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Experience the future of learning through our innovative skill
                  exchange platform.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Heart className="w-4 h-4 text-sky-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Community-Driven Learning
                      </h3>
                      <p className="text-gray-600">
                        Learn from real people with real experience. Build
                        meaningful connections while acquiring new skills.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Globe className="w-4 h-4 text-sky-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Global Reach, Local Impact
                      </h3>
                      <p className="text-gray-600">
                        Connect with learners worldwide or find teachers in your
                        local area. Choose online or in-person exchanges.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Award className="w-4 h-4 text-sky-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Verified & Trusted
                      </h3>
                      <p className="text-gray-600">
                        Our community is built on trust. Rate and review your
                        exchanges to help others find the best teachers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-sky-400 to-blue-600 rounded-3xl p-8 text-white">
                  <div className="text-center">
                    <Star className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
                    <h3 className="text-2xl font-bold mb-4">Ready to Start?</h3>
                    <p className="text-sky-100 mb-6">
                      Join thousands of learners and teachers who are already
                      growing together.
                    </p>
                    <Link
                      href="/sign-in"
                      className="inline-flex items-center gap-2 bg-white text-sky-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Join SkillCircle Today
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Source Section */}
      <section className="py-20 bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
              <BookOpen className="h-4 w-4" />
              Open Source Project
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Built for the Community, by the Community
            </h2>

            <p className="text-xl text-sky-100 mb-8 leading-relaxed">
              SkillCircle is proudly open source, fostering transparency,
              collaboration, and community-driven development. Join us in
              building the future of skill exchange.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Open Development
                </h3>
                <p className="text-sky-100">
                  Transparent development process with community input and
                  collaboration
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Community Driven
                </h3>
                <p className="text-sky-100">
                  Features and improvements guided by user feedback and
                  contributions
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Free Forever
                </h3>
                <p className="text-sky-100">
                  Committed to keeping skill exchange accessible to everyone,
                  always
                </p>
              </div>
            </div>

            <div className="bg-white/10 rounded-2xl p-8 border border-white/20 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    Thanks to NaviByte Innovation
                  </h3>
                  <p className="text-sky-100">
                    Special acknowledgment to NaviByte Innovation for their
                    exceptional development work and commitment to open source
                    principles.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="https://github.com/WebNaresh/skill_swap"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-white text-sky-600 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-lg"
                  >
                    <BookOpen className="h-4 w-4" />
                    View on GitHub
                  </a>
                  <a
                    href="http://navibyte.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-sky-600 transition-colors"
                  >
                    Visit NaviByte
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-sky-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Community Says
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real stories from real people who have transformed their skills
              through SkillCircle
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                &quot;I learned web development by teaching someone guitar. The
                exchange was amazing and I made a great friend!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-200 rounded-full flex items-center justify-center">
                  <span className="text-sky-700 font-semibold">SM</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah M.</div>
                  <div className="text-sm text-gray-500">
                    Musician → Web Developer
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                &quot;SkillCircle helped me find a photography mentor in
                exchange for teaching Spanish. Both skills improved
                tremendously!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-200 rounded-full flex items-center justify-center">
                  <span className="text-sky-700 font-semibold">JR</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">James R.</div>
                  <div className="text-sm text-gray-500">
                    Language Teacher → Photographer
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                &quot;The community is incredibly supportive. I&apos;ve learned
                cooking and taught coding - both experiences were
                fantastic!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-200 rounded-full flex items-center justify-center">
                  <span className="text-sky-700 font-semibold">AL</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Alex L.</div>
                  <div className="text-sm text-gray-500">Developer → Chef</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-sky-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Your Next Skill is Just an Exchange Away
            </h2>
            <p className="text-xl text-sky-100 mb-8">
              Join SkillCircle today and discover the joy of learning through
              teaching.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sign-in"
                className="px-8 py-4 bg-white text-sky-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg"
              >
                Get Started for Free
              </Link>
              <Link
                href="/search"
                className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-sky-600 transition-colors"
              >
                Explore Skills
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
