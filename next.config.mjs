/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
      {
        protocol: "https",
        hostname: "api.escuelajs.co",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "www.cerave.com",
      },
      {
        protocol: "https",
        hostname: "www.laroche-posay.us",
      },
      {
        protocol: "https",
        hostname: "theordinary.com",
      },
      {
        protocol: "https",
        hostname: "www.cetaphil.com",
      },
      {
        protocol: "https",
        hostname: "cdn11.bigcommerce.com",
      },
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
      {
        protocol: "https",
        hostname: "bk.shajgoj.com",
      },
      {
        protocol: "https",
        hostname: "www.bioderma.co.uk",
      },
      {
        protocol: "https",
        hostname: "www.skinplusbd.com",
      },
      {
        protocol: "https",
        hostname: "www.garnier.in",
      },
      {
        protocol: "https",
        hostname: "www.cosrx.com",
      },
      {
        protocol: "https",
        hostname: "cdn.thewirecutter.com",
      },
    ],
  },
  async rewrites() {
    const rawTarget =
      process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      (process.env.NODE_ENV === "production"
        ? "https://skin-aura-server.vercel.app/api"
        : "http://localhost:5000/api");

    const destinationBase = rawTarget.replace(/\/api\/?$/, "");

    return [
      {
        source: "/api/:path*",
        destination: `${destinationBase}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
