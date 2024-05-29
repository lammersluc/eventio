import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import '@mantine/core/styles.css';
import { MantineProvider, Box, Center } from '@mantine/core';
import Menu from "@/components/layout/menu";

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
          <Box h='100dvh'>
            <Menu />
            <Center h='85dvh' p='lg'>
              {children}
            </Center>
          </Box>
        </MantineProvider>
      </body>
    </html>
  );
}
