/** @type {import("next").NextConfig} */
const nextConfig = {
  reactCompiler: true,
  turbopack: {
    root: __dirname,
  },

  async rewrites() {
    return [
      {
        source: "/article/:path*",
        destination: "http://seaweed-filer:8888/article/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
