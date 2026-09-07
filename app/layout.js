import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MainLayoutShell from "./components/MainLayoutShell";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SkinAura – A luxurious, dermatologist-inspired vibe",
  description:
    "Discover premium skincare products for all skin types. From cleansers and serums to moisturizers and sunscreens, Glow Haven helps you achieve healthy, radiant skin every day.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            <MainLayoutShell>{children}</MainLayoutShell>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
