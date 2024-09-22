'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Group, MantineColorScheme, Menu, SegmentedControl, useMantineColorScheme } from '@mantine/core';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import { IconMoon, IconSettings, IconSun } from '@tabler/icons-react';

import { BarItem } from './barItem';

export const Settings = () => {
    const {colorScheme, setColorScheme} = useMantineColorScheme({
        keepTransitions: true
    });
    const [auth, setAuth, removeAuth] = useLocalStorage({
        key: 'auth'
    });
    const [opened, menu] = useDisclosure(false);

    const router = useRouter();

    const barItem = {
        name: 'Settings',
        icon: IconSettings,
        clickEvent: () => menu.toggle()
    };

    const colorSchemeOptions = [
        {
            name: 'Light',
            icon: IconSun,
            value: 'light'
        },
        {
            name: 'Dark',
            icon: IconMoon,
            value: 'dark'
        },
        {
            name: 'System',
            icon: IconSettings,
            value: 'auto'
        }
    ];

    return (
        <Menu
            opened={opened}
            onClose={menu.close}
            shadow='md'
            radius='md'
            position='right-end'
            offset={32}
            transitionProps={{
                transition: 'fade',
                duration: 300
            }}
        >

            <Menu.Target>
                <BarItem barItem={barItem} />
            </Menu.Target>


            <Menu.Dropdown
                p='xs'
            >

                <Menu.Label>
                    Theme
                </Menu.Label>

                <Box
                    px='xs'
                >
                    <SegmentedControl
                        radius='md'
                        value={colorScheme}
                        onChange={(value) => setColorScheme(value as MantineColorScheme)}
                        data={colorSchemeOptions.map(({ name, icon, value }) => ({
                            value,
                            label: (
                                <Group
                                    gap={4}
                                    wrap='nowrap'
                                >
                                    {React.createElement(icon, { size: 16, stroke: 2 })}
                                    {name}
                                </Group>
                            )
                        }))}
                    />
                </Box>

                <Menu.Label>
                    Account
                </Menu.Label>
                
                <Menu.Item
                    onClick={() => {
                        removeAuth();
                        router.push('/auth');
                    }}
                >
                    Logout
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}