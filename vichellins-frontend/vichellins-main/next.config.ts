import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vichellinsnation.s3.us-east-1.amazonaws.com",
        port: "",
        pathname: "/deployment/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
