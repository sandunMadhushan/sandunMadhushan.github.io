import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid Turbopack bundling Prisma/bcrypt into the auth route (can drop handlers → /api/auth 404).
  serverExternalPackages: ["@prisma/client", "prisma", "bcryptjs"],
  async redirects() {
    return [
      { source: "/blog", destination: "https://blog.madhushan.me/", permanent: true },
      { source: "/blog/", destination: "https://blog.madhushan.me/", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "avatars.githubusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "drive.google.com", pathname: "/**" },
      { protocol: "https", hostname: "drive.usercontent.google.com", pathname: "/**" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
