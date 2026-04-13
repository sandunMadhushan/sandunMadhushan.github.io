import { BookOpen, Link2 } from "lucide-react";
import { IconFacebook, IconGithub, IconLinkedin } from "@/components/icons/social-brand-icons";
import { cn } from "@/lib/utils";

type Props = { platform: string; className?: string };

export function SocialBrandGlyph({ platform, className }: Props) {
  const c = cn("shrink-0", className);
  switch (platform) {
    case "github":
      return <IconGithub className={c} />;
    case "linkedin":
      return <IconLinkedin className={c} />;
    case "facebook":
      return <IconFacebook className={c} />;
    case "blog":
      return <BookOpen className={c} strokeWidth={2} aria-hidden />;
    default:
      return <Link2 className={c} strokeWidth={2} aria-hidden />;
  }
}
