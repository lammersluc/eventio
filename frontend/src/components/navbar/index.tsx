'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Group, Stack, Text, Image, ActionIcon, Divider } from '@mantine/core';
import { IconUser, IconWallet, IconDashboard, IconChevronRight, IconHome, IconSearch } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

import BarProp, { type BarItem } from './barItem';
import Settings from './settings';

export default () => {
    const [menuOpened, menu] = useDisclosure(false);

    const router = useRouter();

    const topBar: BarItem[] = [
        {
            name: 'Home',
            icon: IconHome,
            clickEvent: () => router.push('/')
        },
        {
            name: 'Search',
            icon: IconSearch,
            clickEvent: () => router.push('/search')
        },
        {
            name: 'Wallet',
            icon: IconWallet,
            clickEvent: () => router.push('/wallet')
        }
    ];

    const bottomBar: BarItem[] = [
        {
            name: 'Hosting',
            icon: IconDashboard,
            clickEvent: () => router.push('/hosting')
        },
        null,
        {
            name: 'Account',
            icon: IconUser,
            clickEvent: () => router.push('/account')
        }
    ];

    return (
        <Stack
            w={menuOpened ? '150px' : '50px'}
            h='100%'
            pl='md'
            pr={0}
            py='xl'
            justify='space-between'
            style={{
                transition: 'width 0.5s ease-in-out'
            }}
        >

            <Stack
                gap='xs'
            >

                <Group
                    gap='xs'
                    wrap='nowrap'
                    justify='flex-end'
                    style={{
                        transition: 'width 0.5s ease-in-out',
                        overflow: 'hidden'
                    }}
                    onClick={() => router.push('/')}
                >

                    <Group
                        align='end'
                        wrap='nowrap'
                        gap='0'
                    >

                        <Image
                            src='/logo.png'
                            w={32}
                        />

                        <Text
                            inline
                            size='xl'
                            fw={700}
                        >
                            ventio
                        </Text>

                    </Group>

                    <ActionIcon
                        radius='md'
                        size='lg'
                        variant='default'
                        color='normal'
                        onClick={() => menu.toggle()}
                        style={{
                            zIndex: 1,
                            transform: menuOpened ? 'rotate(0.25turn)' : 'rotate(0turn)',
                            transition: 'transform 0.3s ease-in-out'
                        }}
                    >
                        <IconChevronRight
                            stroke={1.5}
                            style={{
                                transform: menuOpened ? 'rotate(0.25turn)' : 'rotate(0turn)',
                                transition: 'transform 0.5s ease-in-out'
                            }}
                        />
                    </ActionIcon>

                </Group>


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

                    <Settings />

                </Stack>

            </Stack>

        </Stack>
    );
}