import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "*.serveo.net",
        "*.serveousercontent.com",
        "*.localhost.run"
      ],
    },
  },
};

export default nextConfig;
