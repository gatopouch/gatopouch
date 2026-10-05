import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Autorise les requêtes cross-origin depuis le preview IM (space-z.ai)
  allowedDevOrigins: ["*.space-z.ai"],
};

export default withNextIntl(nextConfig);
