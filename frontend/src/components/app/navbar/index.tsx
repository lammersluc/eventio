import React from 'react';
import { useRouter } from 'next/navigation';
import { Group, Stack, Text, Image, ActionIcon, Menu } from '@mantine/core';
import { IconUser, IconWallet, IconChevronRight, IconHome, IconSearch, IconAdjustments, IconSettings } from '@tabler/icons-react';
import { useLocalStorage } from '@mantine/hooks';

import { BarItem, type BarProp } from './barItem';
import { MenuItem } from './menuItem';

export const Navbar = () => {
    const [menuOpened, setMenuOpened] = useLocalStorage({
        key: 'menuOpened',
        defaultValue: false
    });

    const router = useRouter();

    const topBar: BarProp[] = [
        'divider',
        {
            name: 'Home',
            icon: IconHome,
            clickEvent: () => router.push('/app')
        },
        {
            name: 'Search',
            icon: IconSearch,
            clickEvent: () => router.push('/app/search')
        },
        {
            name: 'Wallet',
            icon: IconWallet,
            clickEvent: () => router.push('/app/wallet')
        }
    ];

    const bottomBar: BarProp[] = [
        {
            name: 'Management',
            icon: IconAdjustments,
            clickEvent: () => router.push('/app/management')
        },
        'divider',
        {
            name: 'Settings',
            icon: IconSettings,
            clickEvent: () => router.push('/app/settings')
        },
        <MenuItem />
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
                    w='100%'
                    gap={0}
                    wrap='nowrap'
                    justify='end'
                >

                    <Group
                        w='100%'
                        align='end'
                        pl='sm'
                        gap={0}
                        wrap='nowrap'
                        style={{
                            overflow: 'hidden'
                        }}
                    >
                        <Image
                            src='/logo.png'
                            w={26}
                            alt=''
                        />
                        <Text
                            inline
                            size='md'
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
                        onClick={() => setMenuOpened(!menuOpened)}
                    >
                        <IconChevronRight
                            stroke={1.5}
                            style={{
                                transform: menuOpened ? 'rotate(0.5turn)' : 'rotate(0turn)',
                                transition: 'transform 0.5s ease-in-out'
                            }}
                        />
                    </ActionIcon>

                </Group>

            </Stack>

            <Stack
                h='100%'
                justify='space-between'
                gap='xs'
            >
                <Stack>

                    {
                        topBar.map((barItem, i) =>
                            <BarItem
                                barItem={barItem}
                                key={i}
                            />
                        )}

                </Stack>

                <Stack>

                    {
                        bottomBar.map((barItem, i) =>
                            <BarItem
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