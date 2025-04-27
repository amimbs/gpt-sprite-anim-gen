import "./globals.css";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "GPT Sprite Animation Generator",
  description: "Generate sprite animations using GPT",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
} 