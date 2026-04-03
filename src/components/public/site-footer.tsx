import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-[#e5e2e3]/10 bg-[#131314] px-6 py-20 md:px-12">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-12 md:flex-row">
        <div className="space-y-4 text-center md:text-left">
          <div className="text-xl font-bold tracking-tighter text-[#e5e2e3]">
            Sandun Madhushan
          </div>
          <p className="max-w-sm text-[#e5e2e3]/40">
            Building the future of the web, one pixel at a time.
          </p>
        </div>
        <div className="flex items-center gap-8 text-on-surface">
          <Link
            href="https://github.com"
            className="text-[#e5e2e3]/40 transition-transform hover:translate-y-[-2px] hover:text-[#e5e2e3]"
          >
            GitHub
          </Link>
          <Link
            href="https://linkedin.com"
            className="text-[#e5e2e3]/40 transition-transform hover:translate-y-[-2px] hover:text-[#e5e2e3]"
          >
            LinkedIn
          </Link>
          <Link
            href="https://twitter.com"
            className="text-[#e5e2e3]/40 transition-transform hover:translate-y-[-2px] hover:text-[#e5e2e3]"
          >
            Twitter
          </Link>
        </div>
        <p className="text-sm text-[#e5e2e3]/40">
          © {new Date().getFullYear()} The Digital Curator. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
