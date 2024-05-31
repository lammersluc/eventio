'use client';

import { Box, useMantineColorScheme } from "@mantine/core"

import Navbar from '@/components/main/navbar';

export default ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
    const { colorScheme } = useMantineColorScheme();

    return (
        <Box
            bg={colorScheme === 'dark' ? '#191919' : '#f8f8ff'}
            h='100dvh'
        >
            <Navbar />
            <Box h='85dvh'>
                {children}
            </Box>
        </Box>
    );
}