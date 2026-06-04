/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false,
      },
    ];
  },
  images: {
    domains: ['i.ibb.co', 'res.cloudinary.com', 'lh3.googleusercontent.com', 'localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '7000',
        pathname: '/images/**',
      },
    ],
  },
};

module.exports = nextConfig;
