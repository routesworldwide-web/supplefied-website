/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "supplefied.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "www.supplefied.com",
        pathname: "/images/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "7000",
        pathname: "/images/**",
      },
    ],
  },
};

module.exports = nextConfig;
