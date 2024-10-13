import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

import { MantineProvider } from '@mantine/core';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import App from "./app";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Eventio",
  description: "Event management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        <MantineProvider defaultColorScheme='light'>
          <div style={{ width: '100dvw', height: '100dvh' }}>
            <App>
              {children}
            </App>
          </div>
        </MantineProvider>
      </body>
    </html>
  );
}