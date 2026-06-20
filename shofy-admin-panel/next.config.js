/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/admin",

  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: false,
      },
    ];
  },

  images: {
    domains: [
      "i.ibb.co",
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "localhost",
      "35.200.248.118",
      "supplefied.com",
      "www.supplefied.com",
    ],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "7000",
        pathname: "/images/**",
      },
      {
        protocol: "http",
        hostname: "35.200.248.118",
        pathname: "/images/**",
      },
      {
        protocol: "http",
        hostname: "35.200.248.118",
        pathname: "/uploads/**",
      },
    ],
  },
};

module.exports = nextConfig;
