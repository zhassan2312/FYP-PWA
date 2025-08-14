import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { AppShell } from "~/components/layout/app-shell";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "Robot Platform - Code, Build, Learn",
  description: "A Progressive Web App for programming robots with blocks and Python",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <AppShell>
          {children}
        </AppShell>
        <Toaster />
      </body>
    </html>
  );
}
