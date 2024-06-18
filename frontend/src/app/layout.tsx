import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { MantineProvider } from '@mantine/core';

import '@mantine/core/styles.css';
// import '@mantine/dates/styles.css';
// import '@mantine/dropzone/styles.css';
// import '@mantine/code-highlight/styles.css';

import App from "./app";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <MantineProvider>
          <App children={children} />
        </MantineProvider>
      </body>
    </html>
  );
}