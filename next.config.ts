import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  output: 'standalone', // Necesario para despliegues
  reactStrictMode: true,
}
export default nextConfig;
