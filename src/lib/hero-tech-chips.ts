import type { IconType } from "react-icons";
import {
  SiDocker,
  SiExpress,
  SiFigma,
  SiGit,
  SiGithub,
  SiJavascript,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";

export type HeroTechChip = {
  label: string;
  /** Key into `HERO_TECH_ICON_REGISTRY` */
  icon: string;
};

export const DEFAULT_HERO_TECH_CHIPS: HeroTechChip[] = [
  { label: "React.js", icon: "react" },
  { label: "TypeScript", icon: "typescript" },
  { label: "Node.js", icon: "nodedotjs" },
];

/** Admin dropdown: value → label */
export const HERO_TECH_ICON_OPTIONS: { id: string; label: string }[] = [
  { id: "react", label: "React" },
  { id: "typescript", label: "TypeScript" },
  { id: "nodedotjs", label: "Node.js" },
  { id: "nextdotjs", label: "Next.js" },
  { id: "javascript", label: "JavaScript" },
  { id: "tailwindcss", label: "Tailwind CSS" },
  { id: "express", label: "Express" },
  { id: "prisma", label: "Prisma" },
  { id: "postgresql", label: "PostgreSQL" },
  { id: "mongodb", label: "MongoDB" },
  { id: "docker", label: "Docker" },
  { id: "git", label: "Git" },
  { id: "github", label: "GitHub" },
  { id: "python", label: "Python" },
  { id: "figma", label: "Figma" },
];

const HERO_TECH_ICON_REGISTRY: Record<string, { Icon: IconType; color: string }> = {
  react: { Icon: SiReact, color: "text-[#61DAFB]" },
  typescript: { Icon: SiTypescript, color: "text-[#3178C6]" },
  nodedotjs: { Icon: SiNodedotjs, color: "text-[#339933]" },
  nextdotjs: { Icon: SiNextdotjs, color: "text-white" },
  javascript: { Icon: SiJavascript, color: "text-[#F7DF1E]" },
  tailwindcss: { Icon: SiTailwindcss, color: "text-[#06B6D4]" },
  express: { Icon: SiExpress, color: "text-on-surface" },
  prisma: { Icon: SiPrisma, color: "text-[#5B64F3]" },
  postgresql: { Icon: SiPostgresql, color: "text-[#4169E1]" },
  mongodb: { Icon: SiMongodb, color: "text-[#47A248]" },
  docker: { Icon: SiDocker, color: "text-[#2496ED]" },
  git: { Icon: SiGit, color: "text-[#F05032]" },
  github: { Icon: SiGithub, color: "text-on-surface" },
  python: { Icon: SiPython, color: "text-[#3776AB]" },
  figma: { Icon: SiFigma, color: "text-[#F24E1E]" },
};

export function resolveHeroTechIcon(iconId: string): { Icon: IconType; color: string } {
  const hit = HERO_TECH_ICON_REGISTRY[iconId];
  if (hit) return hit;
  return { Icon: SiReact, color: "text-primary" };
}

export function normalizeHeroTechChips(raw: unknown): HeroTechChip[] {
  const defaults = DEFAULT_HERO_TECH_CHIPS;
  if (!Array.isArray(raw)) return defaults.map((c) => ({ ...c }));

  const out: HeroTechChip[] = [];
  for (let i = 0; i < 3; i++) {
    const item = raw[i] as { label?: unknown; icon?: unknown } | undefined;
    const label =
      typeof item?.label === "string" && item.label.trim() ? item.label.trim() : defaults[i].label;
    const iconRaw = typeof item?.icon === "string" ? item.icon.trim() : defaults[i].icon;
    const icon = HERO_TECH_ICON_REGISTRY[iconRaw] ? iconRaw : defaults[i].icon;
    out.push({ label, icon });
  }
  return out;
}
