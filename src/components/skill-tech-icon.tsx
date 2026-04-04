import type { IconType } from "react-icons";
import {
  SiAngular,
  SiAstro,
  SiBootstrap,
  SiCplusplus,
  SiCss,
  SiDocker,
  SiDjango,
  SiDotnet,
  SiExpress,
  SiFigma,
  SiFirebase,
  SiFlask,
  SiFramer,
  SiGit,
  SiGithub,
  SiGitlab,
  SiGo,
  SiGooglecloud,
  SiGraphql,
  SiHtml5,
  SiJavascript,
  SiJest,
  SiKotlin,
  SiKubernetes,
  SiOpenjdk,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReact,
  SiRedis,
  SiRust,
  SiSass,
  SiSpringboot,
  SiSupabase,
  SiSvelte,
  SiTailwindcss,
  SiTerraform,
  SiThreedotjs,
  SiTypescript,
  SiVercel,
  SiVite,
  SiVuedotjs,
  SiWebpack,
  SiPhp,
  SiLaravel,
  SiCodesandbox,
  SiZod,
} from "react-icons/si";

/** Simple Icons keys → component. `default` is the fallback glyph. */
export const SKILL_ICON_MAP: Record<string, IconType> = {
  default: SiCodesandbox,
  angular: SiAngular,
  astro: SiAstro,
  bootstrap: SiBootstrap,
  cplusplus: SiCplusplus,
  css3: SiCss,
  django: SiDjango,
  docker: SiDocker,
  dotnet: SiDotnet,
  express: SiExpress,
  figma: SiFigma,
  firebase: SiFirebase,
  flask: SiFlask,
  framer: SiFramer,
  git: SiGit,
  github: SiGithub,
  gitlab: SiGitlab,
  go: SiGo,
  googlecloud: SiGooglecloud,
  graphql: SiGraphql,
  html5: SiHtml5,
  javascript: SiJavascript,
  jest: SiJest,
  java: SiOpenjdk,
  kotlin: SiKotlin,
  kubernetes: SiKubernetes,
  laravel: SiLaravel,
  linux: SiLinux,
  mongodb: SiMongodb,
  mysql: SiMysql,
  nestjs: SiNestjs,
  nextjs: SiNextdotjs,
  nodedotjs: SiNodedotjs,
  php: SiPhp,
  postgresql: SiPostgresql,
  prisma: SiPrisma,
  python: SiPython,
  react: SiReact,
  redis: SiRedis,
  rust: SiRust,
  sass: SiSass,
  springboot: SiSpringboot,
  supabase: SiSupabase,
  svelte: SiSvelte,
  tailwindcss: SiTailwindcss,
  terraform: SiTerraform,
  threedotjs: SiThreedotjs,
  typescript: SiTypescript,
  vercel: SiVercel,
  vite: SiVite,
  vuedotjs: SiVuedotjs,
  webpack: SiWebpack,
  zod: SiZod,
};

/** Admin dropdown: label + registry key (sorted by label). */
export const SKILL_ICON_CHOICES: { value: string; label: string }[] = [
  { value: "angular", label: "Angular" },
  { value: "astro", label: "Astro" },
  { value: "bootstrap", label: "Bootstrap" },
  { value: "cplusplus", label: "C++" },
  { value: "css3", label: "CSS3" },
  { value: "django", label: "Django" },
  { value: "docker", label: "Docker" },
  { value: "dotnet", label: ".NET" },
  { value: "express", label: "Express" },
  { value: "figma", label: "Figma" },
  { value: "firebase", label: "Firebase" },
  { value: "flask", label: "Flask" },
  { value: "framer", label: "Framer Motion" },
  { value: "git", label: "Git" },
  { value: "github", label: "GitHub" },
  { value: "gitlab", label: "GitLab" },
  { value: "go", label: "Go" },
  { value: "googlecloud", label: "Google Cloud" },
  { value: "graphql", label: "GraphQL" },
  { value: "html5", label: "HTML5" },
  { value: "javascript", label: "JavaScript" },
  { value: "java", label: "Java" },
  { value: "jest", label: "Jest" },
  { value: "kotlin", label: "Kotlin" },
  { value: "kubernetes", label: "Kubernetes" },
  { value: "laravel", label: "Laravel" },
  { value: "linux", label: "Linux" },
  { value: "mongodb", label: "MongoDB" },
  { value: "mysql", label: "MySQL" },
  { value: "nestjs", label: "NestJS" },
  { value: "nextjs", label: "Next.js" },
  { value: "nodedotjs", label: "Node.js" },
  { value: "php", label: "PHP" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "prisma", label: "Prisma" },
  { value: "python", label: "Python" },
  { value: "react", label: "React" },
  { value: "redis", label: "Redis" },
  { value: "rust", label: "Rust" },
  { value: "sass", label: "Sass" },
  { value: "springboot", label: "Spring Boot" },
  { value: "supabase", label: "Supabase" },
  { value: "svelte", label: "Svelte" },
  { value: "tailwindcss", label: "Tailwind CSS" },
  { value: "terraform", label: "Terraform" },
  { value: "threedotjs", label: "Three.js" },
  { value: "typescript", label: "TypeScript" },
  { value: "vercel", label: "Vercel" },
  { value: "vite", label: "Vite" },
  { value: "vuedotjs", label: "Vue.js" },
  { value: "webpack", label: "Webpack" },
  { value: "zod", label: "Zod" },
].sort((a, b) => a.label.localeCompare(b.label));

/** Old Material Symbols / ambiguous `icon` values from earlier versions → default icon key. */
const LEGACY_MATERIAL_TO_KEY: Record<string, string> = {
  layers: "nextjs",
  palette: "tailwindcss",
  api: "nodedotjs",
  terminal: "express",
  data_object: "mongodb",
  database: "postgresql",
  commit: "git",
  deployed_code: "github",
};

const NAME_RULES: { re: RegExp; key: string }[] = [
  { re: /\bnext\.?js\b/i, key: "nextjs" },
  { re: /\breact\b/i, key: "react" },
  { re: /\btypescript\b|\bts\b(?![a-z])/i, key: "typescript" },
  { re: /\bjavascript\b|\bjs\b(?![a-z])/i, key: "javascript" },
  { re: /\btailwind\b/i, key: "tailwindcss" },
  { re: /\bnode\.?js\b|\bnode\b/i, key: "nodedotjs" },
  { re: /\bexpress\b/i, key: "express" },
  { re: /\bmongo(db)?\b/i, key: "mongodb" },
  { re: /\bpostgres(ql)?\b/i, key: "postgresql" },
  { re: /\bmysql\b/i, key: "mysql" },
  { re: /\bredis\b/i, key: "redis" },
  { re: /\bdocker\b/i, key: "docker" },
  { re: /\bkubernetes\b|\bk8s\b/i, key: "kubernetes" },
  { re: /\bgit\b/i, key: "git" },
  { re: /\bgithub\b/i, key: "github" },
  { re: /\bgraphql\b/i, key: "graphql" },
  { re: /\bprisma\b/i, key: "prisma" },
  { re: /\bfigma\b/i, key: "figma" },
  { re: /\bvue\b/i, key: "vuedotjs" },
  { re: /\bsvelte\b/i, key: "svelte" },
  { re: /\bangular\b/i, key: "angular" },
  { re: /\bnest\.?js\b/i, key: "nestjs" },
  { re: /\bpython\b/i, key: "python" },
  { re: /\bjava\b/i, key: "java" },
  { re: /\brust\b/i, key: "rust" },
  { re: /\bgo\b|\bgolang\b/i, key: "go" },
  { re: /\bdjango\b/i, key: "django" },
  { re: /\bflask\b/i, key: "flask" },
  { re: /\bfastapi\b/i, key: "python" },
  { re: /\bvercel\b/i, key: "vercel" },
  { re: /\bfirebase\b/i, key: "firebase" },
  { re: /\bsupabase\b/i, key: "supabase" },
  { re: /\bwebpack\b/i, key: "webpack" },
  { re: /\bvite\b/i, key: "vite" },
  { re: /\bjest\b/i, key: "jest" },
  { re: /\bframer\b/i, key: "framer" },
  { re: /\bthree\.?js\b|\bthreejs\b/i, key: "threedotjs" },
  { re: /\bhtml\b/i, key: "html5" },
  { re: /\bcss\b/i, key: "css3" },
  { re: /\bzod\b/i, key: "zod" },
  { re: /\bastro\b/i, key: "astro" },
  { re: /\bterraform\b/i, key: "terraform" },
  { re: /\bgcp\b|\bgoogle cloud\b/i, key: "googlecloud" },
  { re: /\bphp\b/i, key: "php" },
  { re: /\blaravel\b/i, key: "laravel" },
  { re: /\bspring\b/i, key: "springboot" },
  { re: /\.net\b|\bc#\b|\bcsharp\b/i, key: "dotnet" },
  { re: /\bc\+\+\b/i, key: "cplusplus" },
  { re: /\bbootstrap\b/i, key: "bootstrap" },
  { re: /\bsass\b|\bscss\b/i, key: "sass" },
  { re: /\blinux\b/i, key: "linux" },
];

function inferIconKeyFromName(nameLower: string): string | null {
  for (const { re, key } of NAME_RULES) {
    if (re.test(nameLower)) return key;
  }
  return null;
}

/**
 * Resolves which Simple Icons key to use: explicit DB value, legacy Material symbols, or name matching.
 */
export function resolveSkillIconKey(stored: string | null | undefined, name: string): string {
  const s = (stored ?? "").trim().toLowerCase();
  const n = name.toLowerCase();

  if (!s || s === "variable") {
    return inferIconKeyFromName(n) ?? "default";
  }

  if (s in SKILL_ICON_MAP && s !== "default") {
    return s;
  }

  if (s === "javascript") {
    return inferIconKeyFromName(n) ?? "javascript";
  }

  const legacy = LEGACY_MATERIAL_TO_KEY[s];
  if (legacy) {
    if (legacy === "postgresql" && n.includes("mysql")) return "mysql";
    return legacy;
  }

  return inferIconKeyFromName(n) ?? "default";
}

type SkillTechIconProps = {
  name: string;
  iconKey?: string | null;
  className?: string;
  size?: number;
  title?: string;
};

export function SkillTechIcon({ name, iconKey, className, size = 24, title }: SkillTechIconProps) {
  const key = resolveSkillIconKey(iconKey, name);
  const Icon = SKILL_ICON_MAP[key] ?? SKILL_ICON_MAP.default;
  return <Icon className={className} size={size} aria-hidden title={title} />;
}
