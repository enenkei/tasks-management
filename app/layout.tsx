import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider
} from "@clerk/nextjs";
import { QueryProvider } from "@/lib/query-provider";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task management",
  description: "Light-weighted task management platform, project, simple todos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body className={inter.className}>
          <QueryProvider>
            {children}            
          </QueryProvider>
          <Toaster />
        </body>
      </ClerkProvider>
    </html>
  );
}
