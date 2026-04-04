import type { HeroTechChip } from "@/lib/hero-tech-chips";
import { DEFAULT_HERO_TECH_CHIPS, resolveHeroTechIcon } from "@/lib/hero-tech-chips";

/** Slightly smaller than the max “original” size — balanced on the portrait. */
const chipBase =
  "hero-badge absolute z-20 flex items-center gap-2 rounded-xl border border-white/10 px-2.5 py-2 shadow-xl md:gap-2.5 md:px-3.5 md:py-3";

const labelClass = "text-xs font-bold tracking-tight text-on-surface md:text-[13px]";

const iconClass = "h-5 w-5 shrink-0 md:h-6 md:w-6";

/** Fixed positions for the three portrait chips (top-right, middle-left, bottom-right). */
const SLOT_CLASSES = [
  "-right-3 -top-3 md:-right-5 md:-top-5",
  "left-0 top-1/2 -translate-x-[12%] -translate-y-1/2 sm:-translate-x-[18%] md:-left-12 md:translate-x-0",
  "-bottom-5 right-6 md:-bottom-7 md:right-10",
] as const;

type Props = {
  chips: HeroTechChip[];
};

export function HeroTechBadges({ chips }: Props) {
  return (
    <>
      {([0, 1, 2] as const).map((i) => {
        const chip = chips[i] ?? DEFAULT_HERO_TECH_CHIPS[i];
        const { Icon, color } = resolveHeroTechIcon(chip.icon);
        return (
          <div key={i} className={`${chipBase} ${SLOT_CLASSES[i]}`}>
            <Icon className={`${iconClass} ${color}`} aria-hidden />
            <span className={labelClass}>{chip.label}</span>
          </div>
        );
      })}
    </>
  );
}
