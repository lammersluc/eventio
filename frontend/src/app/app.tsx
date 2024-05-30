'use client';

import { useMantineColorScheme, Box } from "@mantine/core"

import Navbar from '@/components/main/navbar';

export default ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {

    const { colorScheme } = useMantineColorScheme();

    return (
        <Box
            bg='#f8f8ff'
            h='100dvh'
        >
            <Navbar />
            <Box h='85dvh'>
                {children}
            </Box>
        </Box>
    );
}