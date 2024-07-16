/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: process.env.IMAGE_DOMAIN
      ? process.env.IMAGE_DOMAIN.split(",")
      : [],
  },
  env: {
    MICROSERVICE_URL: process.env.MICROSERVICE_URL,
  },
};

export default nextConfig;
