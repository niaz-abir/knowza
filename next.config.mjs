/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // make sure the dataset + RNN weights ship with the serverless function on Vercel
    outputFileTracingIncludes: { "/api/ask": ["./data/**/*"] },
  },
};
export default nextConfig;
