/** @type {import('next').NextConfig} */

import createJiti from "jiti";
import { fileURLToPath } from "url";

const jiti = createJiti(fileURLToPath(import.meta.url));

const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 60,
    },
  },
  serverExternalPackages: ["@node-rs/argon2"],
};
// Import env here to validate during build.Using jiti we can import
jiti("./env.ts");
export default nextConfig;
