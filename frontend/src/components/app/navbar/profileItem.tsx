import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Group, Menu, Avatar, SegmentedControl, useMantineColorScheme, isMantineColorScheme, Button } from '@mantine/core';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import { IconCategory, IconMoon, IconSettings, IconSun } from '@tabler/icons-react';

import { BarItem } from './barItem';
import client from '@/lib/client';

type Account = {
    username: string;
    email: string;
    avatar: string;
};

export const ProfileItem = () => {
    const { colorScheme, setColorScheme } = useMantineColorScheme({
        keepTransitions: true
    });
    const [, , removeAuth] = useLocalStorage({
        key: 'auth'
    });
    const [opened, menu] = useDisclosure(false);
    const [account, setAccount] = React.useState<Account>();

    const router = useRouter();

    React.useEffect(() => {
        (async () => {
            const result = await client.account.get();

            if (!result.error)
                setAccount(result.data);
        })();
    }, []);

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
                <BarItem
                    barItem={{
                        name: 'Menu',
                        icon: IconCategory,
                        clickEvent: () => menu.toggle()
                    }}
                />

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
                        router.push('/app/auth');
                    }}
                >
                    Logout
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}