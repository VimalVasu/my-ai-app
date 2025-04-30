/** 
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
/*};

export default nextConfig;
*/


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure Next.js looks in src/app
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig