/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.googleusercontent.*",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
