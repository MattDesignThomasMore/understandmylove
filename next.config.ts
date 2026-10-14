
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/cancel-subscription",
        destination: "/cancel",
        permanent: true,
      },
      {
        source: "/terms-of-service",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/privacy-policy",
        destination: "/privacy",
        permanent: true,
      },
      {
        source: "/cookie-policy",
        destination: "/cookie",
        permanent: true,
      },
      {
        source: "/refund-policy",
        destination: "/refund",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
