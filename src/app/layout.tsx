import "./globals.css";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import SessionProvider from "@/app/context/SessionProvider";
import NavigationBar from "./components/NavigationBar";

const inter = Inter({ subsets: ["latin"] });
export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <SessionProvider session={session}>
          <NavigationBar />
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
