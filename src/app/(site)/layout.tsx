import { ScrollToTop } from "@/components/public/scroll-to-top";
import { SiteFooter } from "@/components/public/site-footer";
import { SmoothScrollProvider } from "@/components/public/smooth-scroll-provider";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScrollProvider>
      {children}
      <SiteFooter />
      <ScrollToTop />
    </SmoothScrollProvider>
  );
}
