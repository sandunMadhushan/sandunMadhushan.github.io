import { resolveSkillIconKey } from "@/components/skill-tech-icon";

/**
 * One-line blurbs keyed like `SKILL_ICON_MAP` / `resolveSkillIconKey`.
 * Used when the DB `description` is null or empty (same idea as auto icons).
 */
const DESCRIPTION_BY_ICON_KEY: Record<string, string> = {
  android: "Native-adjacent workflows, SDKs, and platform constraints.",
  angular: "Structured SPAs, dependency injection, and Rx-style patterns.",
  astro: "Content-focused sites with partial hydration and islands.",
  bootstrap: "Rapid layout and components with a consistent design system.",
  cplusplus: "Systems-style code, performance-sensitive logic, and tooling.",
  css3: "Layout, responsive rules, and maintainable stylesheets.",
  django: "Batteries-included web apps, ORM-backed models, and admin.",
  docker: "Reproducible environments and containerized delivery.",
  dotnet: "CLR ecosystems, ASP.NET-style stacks, and typed backends.",
  express: "Lean HTTP APIs, middleware, and routing layers.",
  figma: "UI exploration, specs, and design–dev handoff.",
  firebase: "Auth, Firestore, hosting, and serverless-friendly backends.",
  flask: "Lightweight Python APIs and quick prototypes.",
  framer: "Motion-driven UI and interactive prototypes.",
  git: "Branching, reviews, and history-aware collaboration.",
  github: "Repos, actions, and team workflows on GitHub.",
  gitlab: "CI/CD and collaboration on GitLab.",
  go: "Simple concurrency, static binaries, and fast services.",
  googlecloud: "GCP services, IAM, and cloud-native deployment.",
  graphql: "Typed APIs, schema-first queries, and efficient data fetching.",
  html5: "Semantic structure, accessibility-minded markup, and forms.",
  javascript: "Modern ES modules, async flows, and browser APIs.",
  java: "OOP on the JVM, strong typing, and ecosystem libraries.",
  jest: "Unit and integration tests with mocks and snapshots.",
  kotlin: "Concise JVM/Android code and null-safe APIs.",
  kubernetes: "Scheduling, workloads, and cluster operations.",
  laravel: "Convention-heavy PHP apps, Eloquent, and queues.",
  linux: "Shell workflows, permissions, and server fundamentals.",
  mongodb: "Flexible documents, indexing, and aggregation pipelines.",
  mysql: "Relational modeling, joins, and transactional workloads.",
  nestjs: "Modular Node backends with DI and typed boundaries.",
  nextjs: "App Router, SSR/SSG, and edge-ready React deployments.",
  nodedotjs: "Evented I/O, npm ecosystem, and service-side JavaScript.",
  openjdk: "JVM runtimes, JDK tooling, and Java platform behavior.",
  php: "Server-rendered pages and Composer-based dependencies.",
  postgresql: "Relational integrity, SQL, and advanced extensions.",
  postman: "Collections, environments, and API debugging.",
  prisma: "Type-safe DB access, migrations, and schema workflows.",
  python: "Readable scripting, data work, and small services.",
  reactnative: "Cross-platform mobile UIs with native modules and React.",
  react: "Component-driven interfaces and declarative UI state.",
  redis: "Caching, pub/sub, and fast in-memory data structures.",
  rust: "Memory-safe systems code and fearless concurrency.",
  sass: "Variables, nesting, and maintainable CSS authoring.",
  springboot: "Convention-based Java services and REST layers.",
  supabase: "Postgres-backed auth, storage, and realtime APIs.",
  svelte: "Compile-time UI and lean runtime bundles.",
  tailwindcss: "Utility-first styling, design tokens, and responsive UI.",
  terraform: "Infrastructure as code and repeatable provisioning.",
  threedotjs: "WebGL scenes, shaders, and 3D in the browser.",
  typescript: "Typed JavaScript, safer refactors, and editor tooling.",
  vercel: "Preview deploys, edge functions, and serverless hosting.",
  vite: "Fast dev server, HMR, and optimized front-end builds.",
  vscode: "Editing, debugging, extensions, and integrated Git.",
  vuedotjs: "Progressive UI, single-file components, and reactivity.",
  webpack: "Bundling, loaders, and complex front-end pipelines.",
  zod: "Runtime validation, inferred types, and schema parsing.",
};

function genericFallback(name: string): string {
  const t = name.trim();
  if (!t) return "Technology I use in coursework and personal projects.";
  return `${t} — patterns and tooling I apply when building software.`;
}

/**
 * Public copy for a skill: custom DB text when set; otherwise a short line
 * inferred from the resolved icon key (mirrors auto-icon behavior).
 */
export function resolveSkillDescription(
  stored: string | null | undefined,
  name: string,
  iconKey?: string | null,
): string {
  const manual = (stored ?? "").trim();
  if (manual) return manual;

  const key = resolveSkillIconKey(iconKey, name);
  const fromKey = DESCRIPTION_BY_ICON_KEY[key];
  if (fromKey) return fromKey;

  return genericFallback(name);
}

/** Category order used on the public skills page and admin grouping. */
export const SKILL_CATEGORY_WEB_ORDER = [
  "Frontend",
  "Languages",
  "Backend",
  "Mobile",
  "Database",
  "Tools",
] as const;

export function sortSkillsLikeWebsite<T extends { category: string; name: string }>(items: T[]): T[] {
  const order = SKILL_CATEGORY_WEB_ORDER;
  return [...items].sort((a, b) => {
    const ai = order.indexOf(a.category as (typeof order)[number]);
    const bi = order.indexOf(b.category as (typeof order)[number]);
    const ar = ai === -1 ? 999 : ai;
    const br = bi === -1 ? 999 : bi;
    if (ar !== br) return ar - br;
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });
}
