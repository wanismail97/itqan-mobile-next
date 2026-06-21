/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "dl.airtable.com",
      },
    ],
  },
  // ─── Scoped headers ──────────────────────────────────────────────────────
  // Allow ONLY the /preorder-ktb route to be embedded as an iframe by
  // dftrhadis.pondokgajahmati.com.my. All other routes are unaffected.
  async headers() {
    return [
      {
        source: "/preorder-ktb",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://dftrhadis.pondokgajahmati.com.my;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
