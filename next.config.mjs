/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Vercel converts originals to AVIF/WebP automatically — typically 1/3–1/5 the size
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
