import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 

  // !! WARN !!
  // This is a dangerous setting that allows your project to build even with TypeScript errors.
  // This should only be used as a temporary solution.
  // It is highly recommended to fix the underlying type errors instead of ignoring them.
  typescript: {
    ignoreBuildErrors: true,
  },

  // !! WARN !!
  // This setting allows your project to build even with ESLint errors and warnings.
  // It is recommended to fix all linting issues to maintain code quality.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
