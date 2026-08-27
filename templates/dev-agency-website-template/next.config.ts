import type { NextConfig } from "next";
import { SITE } from "./constants";

const nextConfig: NextConfig = {
  async redirects() {
    if (!SITE.domain.wwwHost) return [];

    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: SITE.domain.wwwHost,
          },
        ],
        destination: `${SITE.domain.baseUrl}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
