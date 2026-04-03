import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav({ active }: { active?: string }) {
  return (
    <header className="fixed top-0 z-50 w-full bg-surface/60 backdrop-blur-xl transition-all">
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4 md:px-12">
        <Link href="/" className="text-xl font-bold tracking-tighter text-[#e5e2e3]">
          Architect Portfolio
        </Link>
        <div className="hidden items-center gap-8 font-medium tracking-tight text-[15px] md:flex">
          {links.map((l) => {
            const isActive = active === l.href || (l.href !== "/" && active?.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  isActive
                    ? "border-b-2 border-[#4F46E5] pb-1 font-semibold text-[#4F46E5]"
                    : "text-[#e5e2e3]/70 transition-colors duration-300 hover:text-[#4F46E5]"
                }
              >
                {l.label}
              </Link>
            );
          })}
        </div>
        <Link
          href="/contact"
          className="rounded-lg bg-primary-container px-4 py-2 text-sm font-semibold text-on-primary-container transition-all hover:opacity-90 active:scale-95 md:px-6"
        >
          Connect
        </Link>
      </nav>
    </header>
  );
}
