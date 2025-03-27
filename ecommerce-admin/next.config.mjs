/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL, // Definir la URL de NextAuth
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET, // Definir el secreto de NextAuth
  },
};

export default nextConfig;
