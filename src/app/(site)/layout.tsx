import { ScrollToTop } from "@/components/public/scroll-to-top";
import { Cursor } from "@/components/motion/cursor";
import { SiteFooter } from "@/components/public/site-footer";
import { SmoothScrollProvider } from "@/components/public/smooth-scroll-provider";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScrollProvider>
      <Cursor />
      {children}
      <SiteFooter />
      <ScrollToTop />
    </SmoothScrollProvider>
  );
}
