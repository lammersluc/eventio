'use client';

import { usePathname } from 'next/navigation';
import { Flex, Group, Paper, useMantineColorScheme, useMantineTheme } from "@mantine/core"

import Navbar from '@/components/navbar';

export default ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const { colorScheme } = useMantineColorScheme();
    const theme = useMantineTheme();
    const pathname = usePathname();

    const hiddenNavbarRoutes = [
        '/auth'
    ]

    return (
        <Group
            bg={colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[1]}
            h='100dvh'
            align='start'
            p={0}
            gap={0}
        >

            {
                hiddenNavbarRoutes.every(route => pathname !== route) &&
                <Navbar />
            }

            <Flex
                h='100%'
                justify='center'
                align='center'
                style={{
                    flexGrow: 1,
                }}
                p='md'
            >

                <Paper
                    w='100%'
                    h='100%'
                    style={{
                        overflow: 'scroll'
                    }}
                    radius='lg'
                    shadow='xl'
                    bg={colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]}
                >
                    {children}
                </Paper>

            </Flex>

        </Group>
    );
}