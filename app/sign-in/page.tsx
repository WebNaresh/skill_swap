import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRightLeft, LineChart, UserRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GoogleSignInButton } from "./components";

export const metadata: Metadata = {
  title: "Sign In - SkillCircle",
  description:
    "Sign in to SkillCircle to start exchanging skills with our community. Connect with people who want to teach skills they know in exchange for learning skills they need.",
  openGraph: {
    title: "Sign In - SkillCircle",
    description:
      "Sign in to SkillCircle to start exchanging skills with our community.",
    type: "website",
  },
};

const BENEFITS = [
  {
    icon: UserRound,
    title: "Create your profile",
    description: "Showcase your skills and learning interests",
  },
  {
    icon: ArrowRightLeft,
    title: "Connect & exchange",
    description: "Find perfect skill matches in our community",
  },
  {
    icon: LineChart,
    title: "Track progress",
    description: "Follow your learning journey and exchanges",
  },
];

export default function SignInPage() {
  return (
    <div className="bg-page flex min-h-[calc(100vh-4rem)] items-center">
      <div className="container mx-auto max-w-md px-4 py-12">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to home
        </Link>

        <Card className="border-border/70 shadow-xl shadow-primary/5">
          <CardContent className="space-y-8">
            {/* Brand */}
            <div className="text-center">
              <Image
                src="/web-app-manifest-512x512.png"
                alt="SkillCircle Logo"
                width={64}
                height={64}
                className="mx-auto mb-4 rounded-2xl shadow-md"
                priority
              />
              <h1 className="text-2xl font-bold tracking-tight">
                Welcome to SkillCircle
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Sign in to continue your skill exchange journey
              </p>
            </div>

            <GoogleSignInButton />

            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Why sign in
              </span>
              <Separator className="flex-1" />
            </div>

            <ul className="space-y-4">
              {BENEFITS.map(({ icon: Icon, title, description }) => (
                <li key={title} className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-xs text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="font-medium text-primary hover:underline">
            Terms & Conditions
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-medium text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
