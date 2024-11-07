'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Flex, Group, Paper, useComputedColorScheme, useMantineTheme } from '@mantine/core'
import { Toaster } from 'react-hot-toast';

import { Navbar } from '@/components/navbar';

export default dynamic(() => Promise.resolve(({
    children
}: {
    children: React.ReactNode
}) => App({ children })), {
    ssr: false
});

function App({
    children,
}: {
    children: React.ReactNode;
}) {
    const theme = useMantineTheme();
    const colorScheme = useComputedColorScheme();
    const pathName = usePathname();

    return (
        <Group
            h='100dvh'
            p={0}
            gap={0}
            bg={colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[1]}
        >

            {
                !pathName.includes('auth') &&
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