import type { Metadata } from 'next'
import Link from 'next/link'
import { signIn } from '@/auth'

export const metadata: Metadata = {
  title: 'Sign In - SkillCircle',
  description: 'Sign in to SkillCircle to start exchanging skills with our community. Connect with people who want to teach skills they know in exchange for learning skills they need.',
  openGraph: {
    title: 'Sign In - SkillCircle',
    description: 'Sign in to SkillCircle to start exchanging skills with our community.',
    type: 'website',
  },
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-sky-600 hover:text-sky-700 mb-6 transition-colors"
          >
            ← Back to SkillCircle
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue your skill exchange journey</p>
        </div>

        {/* Sign-in Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full flex items-center justify-center">
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 32 32" 
                className="text-white"
                fill="currentColor"
              >
                {/* Origami Exchange Icon */}
                <path d="M16 4 L24 12 L20 12 L20 16 L12 16 L12 12 L8 12 Z" />
                <path d="M16 28 L8 20 L12 20 L12 16 L20 16 L20 20 L24 20 Z" />
                <line x1="12" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">SkillCircle</h2>
            <p className="text-gray-600 text-sm">Where Skills Come Full Circle</p>
          </div>

          {/* Sign-in Form */}
          <div className="space-y-6">
            {/* Google Sign-in Button */}
            <form
              action={async () => {
                "use server"
                await signIn("google", { redirectTo: "/" })
              }}
            >
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 rounded-lg px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Why sign in?</span>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-sky-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Create Your Profile</p>
                  <p className="text-xs text-gray-600">Showcase your skills and learning interests</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-sky-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Connect & Exchange</p>
                  <p className="text-xs text-gray-600">Find perfect skill matches in our community</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-sky-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Track Progress</p>
                  <p className="text-xs text-gray-600">Monitor your learning journey and exchanges</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-sky-600 hover:text-sky-700 underline">
              Terms & Conditions
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-sky-600 hover:text-sky-700 underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
