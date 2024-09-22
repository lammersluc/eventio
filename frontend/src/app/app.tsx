'use client';
import { usePathname } from 'next/navigation';
import { Flex, Group, Paper, useComputedColorScheme, useMantineTheme } from '@mantine/core'
import { Toaster } from 'react-hot-toast';

import { Navbar } from '@/components/navbar';

export default function App ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const theme = useMantineTheme();
    const colorScheme = useComputedColorScheme();
    const pathname = usePathname();

    const hiddenNavbarRoutes = [
        '/auth'
    ]

    return (
        <Group
            h='100dvh'
            p={0}
            gap={0}
            bg={colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[1]}
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
                    flexGrow: 1
                }}
                p='md'
            >

                <Paper
                    w='100%'
                    h='100%'
                    radius='lg'
                    shadow='xl'
                    bg={colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]}
                >
                    
                    {children}

                    <Toaster
                        position='bottom-right'
                        containerStyle={{
                            margin: '16px'
                        }}
                        toastOptions={{
                            style: {
                                color: colorScheme === 'dark' ? '#fff' : '#000',
                                background: colorScheme === 'dark' ? '#000' : '#fff',
                            }
                        }}
                    />

                </Paper>

            </Flex>

        </Group>
    );
}