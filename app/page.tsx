import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-sky-50 to-blue-50">
      {/* Removed min-h-screen since layout handles it */}

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Where Skills Come <span className="text-sky-600">Full Circle</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Connect with people who want to teach skills they know in exchange
            for learning skills they need. Our modern barter platform makes
            skill exchange simple, safe, and rewarding.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/sign-in"
              className="px-8 py-4 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/terms"
              className="px-8 py-4 border-2 border-sky-600 text-sky-600 rounded-lg font-semibold hover:bg-sky-50 transition-colors"
            >
              Learn More
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-sky-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Connect
              </h3>
              <p className="text-gray-600">
                Find people with complementary skills in your area or online
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-sky-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414L2.586 7l3.707-3.707a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Exchange
              </h3>
              <p className="text-gray-600">
                Trade your expertise for new skills through our barter system
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-sky-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Grow</h3>
              <p className="text-gray-600">
                Build your skills, expand your network, and track your progress
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
