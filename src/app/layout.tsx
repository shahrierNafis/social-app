import "./globals.css";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import NavigationBar from "./components/NavigationBar";

const inter = Inter({ subsets: ["latin"] });
export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`} data-bs-theme="dark">
        
          <NavigationBar />
          <main>{children}</main>
      </body>
    </html>
  );
}
