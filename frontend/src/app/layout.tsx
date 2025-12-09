import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MusicPlayer from "@/components/MusicPlayer";
import { AuthProvider } from "@/context/AuthContext"; // <--- Import

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ 
  weight: ['400', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins" 
});

export const metadata: Metadata = {
  title: "Serenova",
  description: "Digital Sanctuary",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-serenova-bg`}>
        <AuthProvider> {/* <--- Wrap Everything */}
          <Navbar />
          {children}
          <MusicPlayer />
        </AuthProvider>
      </body>
    </html>
  );
}