'use client';

import { usePathname } from 'next/navigation';
import { Box, useMantineColorScheme } from "@mantine/core"

import Navbar from '@/components/main/navbar';

export default ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
    const { colorScheme } = useMantineColorScheme();
    const pathname = usePathname();

    const hiddenNavbarRoutes = [
        '/auth'
    ]

    return (
        <Box
            bg={colorScheme === 'dark' ? '#191919' : '#f8f8ff'}
            h='100dvh'
        >
            {
                hiddenNavbarRoutes.some(route => !pathname.startsWith(route)) &&
                <Navbar />
            }
            <Box
                h='100dvh'
                p='68px'
            >
                {children}
            </Box>
        </Box>
    );
}