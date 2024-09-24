import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

import { MantineProvider } from '@mantine/core';

import '@mantine/core/styles.css';
import dynamic from "next/dynamic";

const App = dynamic(() => import("./app"), { ssr: false });

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Eventio",
  description: "Event management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        <MantineProvider defaultColorScheme='auto'>
          <App>
            {children}
          </App>
        </MantineProvider>
      </body>
    </html>
  );
}