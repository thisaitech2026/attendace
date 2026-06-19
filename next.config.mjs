/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
  experimental: {
    serverComponentsExternalPackages: [
      "@prisma/client",
      "better-sqlite3",
      "@prisma/adapter-better-sqlite3",
    ],
  },
};

export default nextConfig;
