import type { IconType } from "react-icons";
import { FaJava } from "react-icons/fa6";
import { FaAws } from "react-icons/fa";
import { TbBrandAzure, TbBrandReactNative } from "react-icons/tb";
import { VscVscode } from "react-icons/vsc";
import { cn } from "@/lib/utils";
import {
  SiAndroid,
  SiAngular,
  SiAstro,
  SiBootstrap,
  SiCloudflare,
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
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNestjs,
  SiNetlify,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReact,
  SiRedis,
  SiRust,
  SiRailway,
  SiRender,
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
  SiPostman,
  SiCodesandbox,
  SiZod,
} from "react-icons/si";

/** Simple Icons keys → component. `default` is the fallback glyph. */
export const SKILL_ICON_MAP: Record<string, IconType> = {
  default: SiCodesandbox,
  android: SiAndroid,
  angular: SiAngular,
  amazonaws: FaAws,
  astro: SiAstro,
  bootstrap: SiBootstrap,
  cloudflare: SiCloudflare,
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
  /** Font Awesome — official Java wordmark (Simple Icons only has OpenJDK’s cup). */
  java: FaJava,
  /** Legacy / Simple Icons key — same glyph as Java language. */
  openjdk: FaJava,
  kotlin: SiKotlin,
  kubernetes: SiKubernetes,
  laravel: SiLaravel,
  linux: SiLinux,
  mongodb: SiMongodb,
  microsoftazure: TbBrandAzure,
  mysql: SiMysql,
  nestjs: SiNestjs,
  netlify: SiNetlify,
  nextjs: SiNextdotjs,
  nodedotjs: SiNodedotjs,
  php: SiPhp,
  postgresql: SiPostgresql,
  prisma: SiPrisma,
  postman: SiPostman,
  python: SiPython,
  /** Tabler — Simple Icons has no React Native mark. */
  reactnative: TbBrandReactNative,
  react: SiReact,
  redis: SiRedis,
  rust: SiRust,
  railway: SiRailway,
  render: SiRender,
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
  /** VS Code product icon from the Codicons set (Si “Vsco” is a different brand). */
  vscode: VscVscode,
  vuedotjs: SiVuedotjs,
  webpack: SiWebpack,
  zod: SiZod,
};

/** Alternate DB / admin values → canonical `SKILL_ICON_MAP` key */
const STORED_ICON_ALIASES: Record<string, string> = {
  aws: "amazonaws",
  azure: "microsoftazure",
  reactjs: "react",
  "react.js": "react",
  react_native: "reactnative",
  "react-native": "reactnative",
  vsc: "vscode",
  visualstudiocode: "vscode",
  "vs code": "vscode",
};

/** Optional brand tint so marks stay recognizable on muted surfaces (e.g. skills grid). */
const SKILL_ICON_BRAND_CLASS: Record<string, string> = {
  react: "text-[#61DAFB] transition-colors group-hover:text-primary",
  reactnative: "text-[#61DAFB] transition-colors group-hover:text-primary",
};

/** Admin dropdown: label + registry key (sorted by label). */
export const SKILL_ICON_CHOICES: { value: string; label: string }[] = [
  { value: "android", label: "Android" },
  { value: "angular", label: "Angular" },
  { value: "amazonaws", label: "AWS" },
  { value: "astro", label: "Astro" },
  { value: "bootstrap", label: "Bootstrap" },
  { value: "cloudflare", label: "Cloudflare" },
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
  { value: "microsoftazure", label: "Microsoft Azure" },
  { value: "mysql", label: "MySQL" },
  { value: "nestjs", label: "NestJS" },
  { value: "netlify", label: "Netlify" },
  { value: "nextjs", label: "Next.js" },
  { value: "nodedotjs", label: "Node.js" },
  { value: "php", label: "PHP" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "postman", label: "Postman" },
  { value: "prisma", label: "Prisma" },
  { value: "python", label: "Python" },
  { value: "reactnative", label: "React Native" },
  { value: "react", label: "React" },
  { value: "redis", label: "Redis" },
  { value: "rust", label: "Rust" },
  { value: "railway", label: "Railway" },
  { value: "render", label: "Render" },
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
  { value: "vscode", label: "VS Code" },
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
  { re: /\breact native\b/i, key: "reactnative" },
  { re: /\bnext\.?js\b/i, key: "nextjs" },
  { re: /\bvs code\b|\bvisual studio code\b|\bvscode\b/i, key: "vscode" },
  { re: /\bpostman\b/i, key: "postman" },
  { re: /\bandroid\b/i, key: "android" },
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
  { re: /\baws\b|\bamazon web services\b/i, key: "amazonaws" },
  { re: /\bazure\b|\bmicrosoft azure\b/i, key: "microsoftazure" },
  { re: /\bnetlify\b/i, key: "netlify" },
  { re: /\bcloudflare\b/i, key: "cloudflare" },
  { re: /\brender\b/i, key: "render" },
  { re: /\brailway\b/i, key: "railway" },
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
  const raw = (stored ?? "").trim().toLowerCase();
  const s = STORED_ICON_ALIASES[raw] ?? raw;
  const n = name.toLowerCase();
  const inferredFromName = inferIconKeyFromName(n);

  // For cloud/deployment brand names, prioritize name match to prevent stale/mis-set icon keys.
  if (inferredFromName && ["amazonaws", "microsoftazure", "cloudflare", "netlify", "render", "railway", "vercel"].includes(inferredFromName)) {
    return inferredFromName;
  }

  if (!s || s === "variable") {
    return inferredFromName ?? "default";
  }

  // "javascript" is a valid key but is often mis-assigned to React in the DB — trust the name first.
  if (s === "javascript") {
    return inferredFromName ?? "javascript";
  }

  if (s in SKILL_ICON_MAP && s !== "default") {
    return s;
  }

  const legacy = LEGACY_MATERIAL_TO_KEY[s];
  if (legacy) {
    if (legacy === "postgresql" && n.includes("mysql")) return "mysql";
    return legacy;
  }

  return inferredFromName ?? "default";
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
  const brandClass = SKILL_ICON_BRAND_CLASS[key];
  return (
    <Icon
      className={cn(className, brandClass)}
      size={size}
      aria-hidden
      title={title}
    />
  );
}
