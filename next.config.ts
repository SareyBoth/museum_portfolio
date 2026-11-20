import path from "node:path";
import type { NextConfig } from "next";

// Parse R2_PUBLIC_URL into a remotePatterns entry for next/image
function getR2RemotePatterns(): NextConfig["images"] {
  const r2Url = process.env.R2_PUBLIC_URL;
  if (!r2Url) return {};
  try {
    const url = new URL(r2Url);
    return {
      remotePatterns: [
        {
          protocol: url.protocol.replace(":", "") as "http" | "https",
          hostname: url.hostname,
          pathname: "/**",
        },
      ],
    };
  } catch {
    return {};
  }
}

const r2Images = getR2RemotePatterns();

const nextConfig: NextConfig = {
  /* config options here */
  sassOptions: {
    includePaths: [
      path.join(__dirname, "src", "styles", "admin"),
      path.join(__dirname, "src"),
    ],
  },
  images: {
    localPatterns: [
      {
        pathname: "/media/**",
        search: "",
      },
    ],
    ...r2Images,
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "globals.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
