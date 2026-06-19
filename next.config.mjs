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
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "localhost:3001",
        "localhost:3002",
        "*.agent.cvm.dev",
        "*.cvm.dev",
      ],
    },
  },
};

export default nextConfig;
