'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useMantineColorScheme, Box, Group, Stack, Text, Image, ActionIcon, Divider, Tooltip } from '@mantine/core';
import { IconSun, IconMoon, IconHome, IconTicket, IconUser, IconSettings } from '@tabler/icons-react';

import BarProp, { type BarItem } from './barItem';

export default () => {
    const [collapsed, setCollapsed] = React.useState(true);
    const { colorScheme, toggleColorScheme } = useMantineColorScheme({
        keepTransitions: true
    })
    const router = useRouter();

    const topBar: BarItem[] = [
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

    const bottomBar: BarItem[] = [
        null,
        {
            name: 'Account',
            icon: IconUser,
            clickEvent: () => router.push('/account')
        },
        {
            name: 'Settings',
            icon: IconSettings,
            clickEvent: () => { }
        }
    ];

    return (
        <Stack
            pos='relative'
            w={collapsed ? '50px' : '135px'}
            h='100%'
            pl='md'
            pr={0}
            py='xl'
            justify='space-between'
            style={{
                transition: 'width 0.5s ease-in-out'
            }}
            onMouseEnter={() => setCollapsed(false)}
            onMouseLeave={() => setCollapsed(true)}
        >

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
                        topBar.map((barItem, i) =>
                            <BarProp
                                barItem={barItem}
                                key={i}
                            />
                        )}

                </Stack>

                <Stack>

                    {
                        bottomBar.map((barItem, i) =>
                            <BarProp
                                barItem={barItem}
                                key={i}
                            />
                        )
                    }

                </Stack>

            </Stack>

        </Stack>
    );
}