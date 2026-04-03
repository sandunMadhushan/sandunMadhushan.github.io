import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid Turbopack bundling Prisma/bcrypt into the auth route (can drop handlers → /api/auth 404).
  serverExternalPackages: ["@prisma/client", "prisma", "bcryptjs"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
