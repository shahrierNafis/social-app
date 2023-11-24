import "./globals.css";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import NavigationBar from "./components/NavigationBar";
import Presence from "./components/Presence";

const inter = Inter({ subsets: ["latin"] });
export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`} data-bs-theme="dark">
        <Presence />
        <NavigationBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
