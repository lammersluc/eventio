'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useMantineColorScheme, Group, Stack, Text, Image, Paper, ActionIcon, Divider } from '@mantine/core';
import { IconSun, IconMoon, IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react';

export default () => {
    const [collapsed, setCollapsed] = React.useState(true);
    const { colorScheme, toggleColorScheme } = useMantineColorScheme({
        keepTransitions: true
    })
    const router = useRouter();

    return (
        <Stack
            w={collapsed ? '50px' : '180px'}
            h='100%'
            py='xs'
            justify='space-between'
            style={{
                transition: 'all 0.5s ease-in-out'
            }}
        >

            <Stack
                align='center'
            >

                <Paper
                    p='xs'
                    radius='md'
                    withBorder
                    onClick={() => router.push('/')}
                    style={{
                        cursor: 'pointer'
                    }}
                >

                    <Group
                        w={collapsed ? 25 : 100}
                        pl='2px'
                        gap='xs'
                        wrap='nowrap'
                        style={{
                            transition: 'all 0.5s ease-in-out',
                            overflow: 'hidden'
                        }}
                    >

                        <Image
                            src='/logo.png'
                            w={25}
                            h={25}
                        />

                        <Text
                            size='md'
                            fw={700}
                        >
                            Eventio
                        </Text>

                    </Group>

                </Paper>

                <ActionIcon
                    radius='md'
                    size='lg'
                    variant='default'
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {
                        collapsed ?
                            <IconChevronsRight stroke={1.5} /> :
                            <IconChevronsLeft stroke={1.5} />
                    }
                </ActionIcon>

                <Divider
                    size='sm'
                    w='100%'
                />

            </Stack>

            <Stack
                justify='space-evenly'
            >



            </Stack>

            <Stack
                align='center'
            >

                <Divider
                    size='sm'
                    w='100%'
                />

                <ActionIcon
                    onClick={toggleColorScheme}
                    variant='default'
                    size='xl'
                >
                    {
                        colorScheme === 'dark' ?
                            <IconSun stroke={1.5} /> :
                            <IconMoon stroke={1.5} />
                    }
                </ActionIcon>

            </Stack>

        </Stack>
    );
}