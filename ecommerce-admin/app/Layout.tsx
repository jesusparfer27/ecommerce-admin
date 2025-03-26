import "./globals.css";

export const metadata = {
  title: "Mi App con Tailwind y Next.js",
  description: "Usando Tailwind CSS 3 en Next.js 15",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
