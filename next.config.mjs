/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: process.env.IMAGE_DOMAINS
      ? process.env.IMAGE_DOMAINS.split(",")
      : [],
  },
  env: {
    MICROSERVICE_URL: process.env.MICROSERVICE_URL,
  },
};

export default nextConfig;
