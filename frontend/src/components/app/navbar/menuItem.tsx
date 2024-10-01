import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Group, Menu, SegmentedControl, useMantineColorScheme, isMantineColorScheme } from '@mantine/core';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import { IconCategory, IconMenu, IconMoon, IconSettings, IconSun } from '@tabler/icons-react';

import { BarItem } from './barItem';

export const MenuItem = () => {
    const {colorScheme, setColorScheme} = useMantineColorScheme({
        keepTransitions: true
    });
    const [, , removeAuth] = useLocalStorage({
        key: 'auth'
    });
    const [opened, menu] = useDisclosure(false);

    const router = useRouter();

    const barItem = {
        name: 'Menu',
        icon: IconCategory,
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

    const changeColorScheme = (value: string) => {
        if (!isMantineColorScheme(value)) return;

        document.querySelectorAll<HTMLElement>('*').forEach((element) => {
            const previousTransition = element.style.transition;
            element.style.transition = 'all 0.3s ease-in-out';

            setTimeout(() => {
                element.style.transition = previousTransition;
            }, 300);
        });

        setColorScheme(value);
    };

    return (
        <Menu
            opened={opened}
            onClose={menu.close}
            shadow='md'
            radius='md'
            position='right-end'
            offset={32}
        >

            <Menu.Target>
                <BarItem barItem={barItem} />
            </Menu.Target>


            <Menu.Dropdown
                p='xs'
                style={{
                    transition: 'opacity 0.2s ease-in-out'
                }}
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
                        onChange={changeColorScheme}
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