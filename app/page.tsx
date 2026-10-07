import Link from "next/link";
import {
  ArrowRight,
  ArrowRightLeft,
  BadgeCheck,
  Code2,
  Dumbbell,
  Globe2,
  Languages,
  Music,
  Palette,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const FEATURES = [
  {
    icon: Users,
    title: "Connect",
    description:
      "Find people with complementary skills in your area or online, matched to what you want to learn.",
  },
  {
    icon: ArrowRightLeft,
    title: "Exchange",
    description:
      "Trade your expertise for new skills through a fair barter system — no money involved.",
  },
  {
    icon: TrendingUp,
    title: "Grow",
    description:
      "Build your skills, expand your network, and keep track of every exchange in one place.",
  },
];

const STEPS = [
  {
    icon: UserPlus,
    title: "Create your profile",
    description: "Sign in with Google and list the skills you can teach and want to learn.",
  },
  {
    icon: Search,
    title: "Discover matches",
    description: "Search by category and level to find the right exchange partner.",
  },
  {
    icon: ArrowRightLeft,
    title: "Start swapping",
    description: "Send a request, agree on the terms, and start learning together.",
  },
];

const CATEGORIES = [
  { icon: Code2, label: "Technology" },
  { icon: Languages, label: "Languages" },
  { icon: Music, label: "Music" },
  { icon: Palette, label: "Creative Arts" },
  { icon: UtensilsCrossed, label: "Cooking" },
  { icon: Dumbbell, label: "Fitness" },
];

const TRUST_POINTS = [
  { icon: BadgeCheck, label: "Verified profiles" },
  { icon: ShieldCheck, label: "Privacy controls" },
  { icon: Globe2, label: "Online or in person" },
];

export default function Home() {
  return (
    <div className="bg-page">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
        <div className="container relative mx-auto px-4 pb-16 pt-16 text-center sm:pt-24">
          <Badge
            variant="outline"
            className="mb-6 rounded-full border-primary/20 bg-background/70 px-3 py-1 text-sm text-primary backdrop-blur"
          >
            <Sparkles />
            Learn anything by teaching what you know
          </Badge>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-balance sm:text-6xl">
            Where skills come <span className="text-gradient">full circle</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty sm:text-xl">
            Connect with people who want to teach skills they know in exchange
            for learning skills they need. Skill exchange made simple, safe, and
            rewarding.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="xl" className="rounded-full shadow-lg shadow-primary/25">
              <Link href="/sign-in">
                Get started free
                <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="outline"
              className="rounded-full bg-background/70 backdrop-blur"
            >
              <Link href="/search">
                <Search />
                Browse skills
              </Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5">
                <Icon className="size-4 text-primary" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="group border-border/70 bg-card/80 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
            >
              <CardContent className="space-y-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-6" />
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y bg-card/60">
        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
              How it works
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Start swapping skills in three steps
            </h2>
          </div>
          <ol className="relative grid gap-8 md:grid-cols-3">
            <div
              aria-hidden
              className="absolute left-[16.66%] right-[16.66%] top-6 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block"
            />
            {STEPS.map(({ icon: Icon, title, description }, index) => (
              <li key={title} className="relative text-center">
                <div className="relative mx-auto mb-5 flex size-12 items-center justify-center rounded-full border bg-background shadow-sm">
                  <Icon className="size-5 text-primary" />
                  <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mb-2 font-semibold">{title}</h3>
                <p className="mx-auto max-w-xs text-sm text-muted-foreground">
                  {description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Explore popular categories
          </h2>
          <p className="mt-3 text-muted-foreground">
            From coding to cooking, there is always someone ready to share.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map(({ icon: Icon, label }) => (
            <Link
              key={label}
              href="/search"
              className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-5 text-center transition-all hover:border-primary/40 hover:shadow-md"
            >
              <Icon className="size-7 text-muted-foreground transition-colors group-hover:text-primary" />
              <span className="text-sm font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-600 px-6 py-14 text-center text-white shadow-xl sm:px-12">
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to share what you know?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/80">
              Join SkillCircle today and turn your expertise into new
              knowledge.
            </p>
            <Button
              asChild
              size="xl"
              className="mt-8 rounded-full bg-white text-blue-700 hover:bg-white/90"
            >
              <Link href="/sign-in">
                Join the circle
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
