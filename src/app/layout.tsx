import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { AudioProvider } from "@/lib/AudioContext";

export const metadata: Metadata = {
  title: "Grand Aurum Hotel",
  description: "Luxury stay with an AI-powered dining experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AudioProvider>
          <Navbar />
          {children}
        </AudioProvider>
      </body>
    </html>
  );
}