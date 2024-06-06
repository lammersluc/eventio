'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useMantineColorScheme, Box, Group, Stack, Text, Image, ActionIcon, Divider, Tooltip } from '@mantine/core';
import { IconSun, IconMoon, IconChevronsLeft, IconChevronsRight, IconHome, IconTicket, IconUser, IconSettings } from '@tabler/icons-react';

type barItem = {
    name: string;
    icon: typeof IconHome;
    clickEvent: () => void;
} | null;

export default () => {
    const [collapsed, setCollapsed] = React.useState(true);
    const { colorScheme, toggleColorScheme } = useMantineColorScheme({
        keepTransitions: true
    })
    const router = useRouter();

    const topBar: barItem[] = [
        {
            name: 'Home',
            icon: IconHome,
            clickEvent: () => router.push('/')
        },
        {
            name: 'Events',
            icon: IconTicket,
            clickEvent: () => router.push('/events')
        }
    ];

    const bottomBar: barItem[] = [
        null,
        {
            name: 'Account',
            icon: IconUser,
            clickEvent: () => router.push('/account')
        },
        {
            name: 'Settings',
            icon: IconSettings,
            clickEvent: () => {}
        }
    ];

    return (
        <Stack
            pos='relative'
            w={collapsed ? '35px' : '120px'}
            h='100%'
            py='xs'
            justify='space-between'
            style={{
                transition: 'width 0.5s ease-in-out'
            }}
        >

            <ActionIcon
                pos='absolute'
                bottom='96px'
                right='-32px'
                radius='xl'
                variant='default'
                onClick={() => setCollapsed(!collapsed)}
            >
                {
                    collapsed ?
                        <IconChevronsRight stroke={1.5} /> :
                        <IconChevronsLeft stroke={1.5} />
                }
            </ActionIcon>

            <Stack
                pos='relative'
                gap='xs'
            >

                <ActionIcon
                    p={0}
                    radius={0}
                    w='100%'
                    h='100%'
                    variant='transparent'
                    color='normal'
                    onClick={() => router.push('/')}
                >

                    <Group
                        gap='xs'
                        wrap='nowrap'
                        pos='relative'
                        style={{
                            transition: 'width 0.5s ease-in-out',
                            overflow: 'hidden'
                        }}
                        onClick={() => router.push('/')}
                    >
                    
                        <Image
                            src='/logo.png'
                            w={42}
                            h={42}
                        />

                        <Text
                            size='lg'
                            fw={700}
                        >
                            Eventio
                        </Text>

                    </Group>

                </ActionIcon>

                <Divider
                    size='sm'
                    w='100%'
                />

            </Stack>

            <Stack
                h='100%'
                justify='space-between'
                gap='xs'
            >
                <Stack>

                    {
                        topBar.map((barItem, i) => barItem ?

                            <Box
                                key={i}
                                w='100%'
                            >

                                <Tooltip
                                    label={barItem.name}
                                    disabled={!collapsed}
                                >

                                    <ActionIcon
                                        w='100%'
                                        radius='md'
                                        size='lg'
                                        variant='subtle'
                                        color='normal'
                                        onClick={barItem.clickEvent}
                                    >

                                        <Group
                                            w='100%'
                                            ml='3.5px'
                                            gap='xs'
                                            wrap='nowrap'
                                            style={{
                                                transition: 'width 0.5s ease-in-out',
                                                overflow: 'hidden'
                                            }}
                                        >
                                        
                                            <Box
                                                w='25px'
                                                h='25px'
                                            >

                                                <barItem.icon
                                                    stroke={1.5}
                                                />

                                            </Box>

                                            <Text
                                                w='100%'
                                                size='sm'
                                                fw={700}
                                            >
                                                {barItem.name}
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

                <Stack>

                    {
                        bottomBar.map((barItem, i) => barItem ?

                            <Box
                                key={i}
                                w='100%'
                            >

                                <Tooltip
                                    label={barItem.name}
                                    disabled={!collapsed}
                                >

                                    <ActionIcon
                                        w='100%'
                                        radius='md'
                                        size='lg'
                                        variant='subtle'
                                        color='normal'
                                        onClick={barItem.clickEvent}
                                    >

                                        <Group
                                            w='100%'
                                            ml='3.5px'
                                            gap='xs'
                                            wrap='nowrap'
                                            style={{
                                                transition: 'width 0.5s ease-in-out',
                                                overflow: 'hidden'
                                            }}
                                        >
                                        
                                            <Box
                                                w='25px'
                                                h='25px'
                                            >

                                                <barItem.icon
                                                    stroke={1.5}
                                                />

                                            </Box>

                                            <Text
                                                w='100%'
                                                size='sm'
                                                fw={700}
                                            >
                                                {barItem.name}
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

            </Stack>

            {/* <Stack
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

            </Stack> */}

        </Stack>
    );
}