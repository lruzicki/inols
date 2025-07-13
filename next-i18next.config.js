module.exports = {
  i18n: {
    defaultLocale: "pl",
    locales: ["en", "pl"],
  },
  fallbackLng: {
    default: ["en"],
  },
  debug: false,
  reloadOnPrerender: process.env.NODE_ENV === "development",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}
