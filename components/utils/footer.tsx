import Link from "next/link";
import Image from "next/image";

const FOOTER_SECTIONS = [
  {
    title: "Platform",
    links: [
      { href: "/", label: "Home" },
      { href: "/search", label: "Discover Skills" },
      { href: "/request", label: "My Requests" },
      { href: "/sign-in", label: "Sign In" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms & Conditions" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/refund", label: "Refund Policy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link href="/" className="mb-4 inline-flex items-center gap-2.5">
              <Image
                src="/web-app-manifest-192x192.png"
                alt="SkillCircle Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-lg font-bold tracking-tight">
                Skill<span className="text-primary">Circle</span>
              </span>
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Where skills come full circle. Teach what you know, learn what you
              need, and grow together with a community of curious people.
            </p>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-semibold">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} SkillCircle. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
