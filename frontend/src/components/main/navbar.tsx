'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useMantineColorScheme, Box, Group, Stack, Text, Image, Paper, ActionIcon, Divider, Tooltip } from '@mantine/core';
import { IconSun, IconMoon, IconChevronsLeft, IconChevronsRight, IconDashboard, IconTicket, IconUser } from '@tabler/icons-react';

export default () => {
    const [collapsed, setCollapsed] = React.useState(true);
    const { colorScheme, toggleColorScheme } = useMantineColorScheme({
        keepTransitions: true
    })
    const router = useRouter();

    const routes: ({
        name: string;
        icon: typeof IconDashboard;
        path: string;
    } | null)[] = [
        {
            name: 'Dashboard',
            icon: IconDashboard,
            path: '/dashboard'
        },
        {
            name: 'Events',
            icon: IconTicket,
            path: '/events'
        },
        null,
        {
            name: 'Account',
            icon: IconUser,
            path: '/account'
        }
    ]

    return (
        <Stack
            w={collapsed ? '40px' : '135px'}
            h='100%'
            py='xs'
            justify='space-between'
            style={{
                transition: 'width 0.5s ease-in-out'
            }}
        >

            <Stack
                align='center'
                gap='xs'
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
                            transition: 'width 0.5s ease-in-out',
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
                h='100%'
                align='start'
                gap='xs'
            >

                {
                    routes.map((route, i) => route ?

                        <Box
                            key={i}
                            w='100%'
                        >
                            <Tooltip
                                label={route.name}
                                disabled={!collapsed}
                            >

                                <ActionIcon
                                    radius='md'
                                    size='lg'
                                    w='100%'
                                    variant='subtle'
                                    color='dark'
                                    onClick={() => router.push(route.path)}
                                >

                                    <Group
                                        w={collapsed ? '40px' : '135px'}
                                        justify='start'
                                        gap='xs'
                                        wrap='nowrap'
                                        pl='7px'
                                        style={{
                                            transition: 'width 0.5s ease-in-out',
                                            overflow: 'hidden'
                                        }}
                                    >
                                    
                                        <Box
                                            w='25px'
                                            h='25px'
                                        >

                                            <route.icon
                                                stroke={1.5}
                                            />

                                        </Box>

                                        <Text
                                            size='sm'
                                            fw={700}
                                        >
                                            {route.name}
                                        </Text>

                                    </Group>

                                </ActionIcon>

                            </Tooltip>
                        </Box>
                        :
                        <Divider
                            key={i}
                            size='sm'
                            w='100%'
                        />
                    )
                }

            </Stack>

            <Stack
                align='center'
                gap='xs'
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