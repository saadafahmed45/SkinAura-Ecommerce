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
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
