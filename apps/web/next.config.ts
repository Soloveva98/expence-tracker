import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow importing the shared workspace package (TypeScript source).
  transpilePackages: ['@expence-tracker/shared'],
};

export default nextConfig;
