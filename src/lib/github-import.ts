import { prisma } from "@/lib/prisma";
import { validateProjectBody } from "@/lib/project-validation";
import { DEFAULT_PORTRAIT_SRC } from "@/lib/site-constants";

const GITHUB_API = "https://api.github.com";

export type GithubRepoSummary = {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  htmlUrl: string;
  description: string | null;
  fork: boolean;
  homepage: string | null;
  language: string | null;
  topics: string[];
  private: boolean;
  updatedAt: string;
  avatarUrl: string;
};

export function getGithubListConfig():
  | { ok: true; useToken: boolean }
  | { ok: false; message: string } {
  const token = process.env.GITHUB_TOKEN?.trim();
  const username = process.env.GITHUB_USERNAME?.trim();
  if (token) return { ok: true, useToken: true };
  if (username) return { ok: true, useToken: false };
  return {
    ok: false,
    message:
      "Add GITHUB_TOKEN (recommended) or GITHUB_USERNAME to your environment to list repositories.",
  };
}

function githubHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN?.trim();
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function fetchGithubReposForAdmin(): Promise<
  { ok: true; repos: GithubRepoSummary[] } | { ok: false; status: number; message: string }
> {
  const cfg = getGithubListConfig();
  if (!cfg.ok) return { ok: false, status: 503, message: cfg.message };

  const token = process.env.GITHUB_TOKEN?.trim();
  const username = process.env.GITHUB_USERNAME?.trim();

  let url: string;
  if (token) {
    url = `${GITHUB_API}/user/repos?per_page=100&sort=updated&affiliation=owner`;
  } else {
    url = `${GITHUB_API}/users/${encodeURIComponent(username!)}/repos?per_page=100&sort=updated`;
  }

  const res = await fetch(url, { headers: githubHeaders(), next: { revalidate: 0 } });
  if (!res.ok) {
    const err = await res.text().catch(() => "");
    return {
      ok: false,
      status: res.status,
      message: err || `GitHub API error (${res.status})`,
    };
  }

  const data = (await res.json()) as Array<{
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    description: string | null;
    fork: boolean;
    homepage: string | null;
    language: string | null;
    topics?: string[];
    private: boolean;
    updated_at: string;
    owner: { login: string; avatar_url: string };
  }>;

  const repos: GithubRepoSummary[] = data.map((r) => ({
    id: r.id,
    name: r.name,
    fullName: r.full_name,
    owner: r.owner.login,
    htmlUrl: r.html_url,
    description: r.description,
    fork: r.fork,
    homepage: r.homepage,
    language: r.language,
    topics: Array.isArray(r.topics) ? r.topics : [],
    private: r.private,
    updatedAt: r.updated_at,
    avatarUrl: r.owner.avatar_url,
  }));

  return { ok: true, repos };
}

function slugFromRepoName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "project";
}

function readmeToPortfolioContent(raw: string, repoUrl: string): string {
  const stripped = raw
    .replace(/\r\n/g, "\n")
    .replace(/^---[\s\S]*?^---\s*/m, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .trim();

  const paragraphs = stripped
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\n/g, " ").replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const body = paragraphs.slice(0, 24).join("\n\n").slice(0, 12000);
  if (body.length >= 50) return body;

  return [
    "This project was imported from GitHub. You can replace this text with a full case study in the admin.",
    "",
    `Repository: ${repoUrl}`,
  ].join("\n\n");
}

async function ensureUniqueSlug(base: string): Promise<string> {
  let slug = base;
  let n = 2;
  while (await prisma.project.findUnique({ where: { slug } })) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

async function fetchReadmeText(owner: string, repo: string): Promise<string | null> {
  const token = process.env.GITHUB_TOKEN?.trim();
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.raw",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/readme`, {
    headers,
    next: { revalidate: 0 },
  });
  if (!res.ok) return null;
  return res.text();
}

export async function importGithubRepoAsProject(
  owner: string,
  repoName: string,
): Promise<
  | { ok: true; projectId: string; slug: string }
  | { ok: false; status: number; message: string }
> {
  const cfg = getGithubListConfig();
  if (!cfg.ok) return { ok: false, status: 503, message: cfg.message };

  const metaRes = await fetch(`${GITHUB_API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}`, {
    headers: githubHeaders(),
    next: { revalidate: 0 },
  });
  if (!metaRes.ok) {
    return { ok: false, status: metaRes.status, message: "Could not load repository from GitHub." };
  }

  const meta = (await metaRes.json()) as {
    html_url: string;
    description: string | null;
    homepage: string | null;
    language: string | null;
    topics?: string[];
    owner: { login: string; avatar_url: string };
    name: string;
    fork: boolean;
  };

  const htmlUrl = meta.html_url;

  const existing = await prisma.project.findFirst({ where: { githubLink: htmlUrl } });
  if (existing) {
    return {
      ok: false,
      status: 409,
      message: `This repository is already linked to project “${existing.title}”.`,
    };
  }

  const readme = await fetchReadmeText(owner, repoName);
  const title = meta.name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const description =
    (meta.description && meta.description.trim()) ||
    `Open-source work on GitHub — ${meta.name}.`;
  const baseSlug = slugFromRepoName(meta.name);
  const slug = await ensureUniqueSlug(baseSlug);

  const technologies = [
    ...(meta.language ? [meta.language] : []),
    ...(Array.isArray(meta.topics) ? meta.topics : []),
  ]
    .map((t) => t.trim())
    .filter(Boolean);
  const techUnique = [...new Set(technologies)].slice(0, 20);
  if (techUnique.length === 0) techUnique.push("GitHub");

  const content = readme
    ? readmeToPortfolioContent(readme, htmlUrl)
    : [
        "This project was imported from GitHub. Add a full write-up in the admin, or paste your README there.",
        "",
        `Repository: ${htmlUrl}`,
      ].join("\n\n");

  const thumb = meta.owner.avatar_url?.trim() || DEFAULT_PORTRAIT_SRC;
  const features =
    (Array.isArray(meta.topics) && meta.topics.length > 0
      ? meta.topics.slice(0, 6)
      : ["Public repository on GitHub"]) ?? [];

  const payload = {
    title,
    slug,
    description,
    content,
    technologies: techUnique,
    coverImage: thumb,
    heroImage: thumb,
    galleryImages: [] as string[],
    githubLink: htmlUrl,
    liveLink: meta.homepage?.trim() || null,
    blogLink: null,
    featured: false,
    published: false,
    categories: ["Web"],
    cardIcon: "code",
    features,
  };

  const v = validateProjectBody(payload);
  if (!v.ok) {
    return { ok: false, status: 400, message: v.error };
  }

  const project = await prisma.project.create({ data: v.data });
  return { ok: true, projectId: project.id, slug: project.slug };
}
