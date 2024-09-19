'use client';
import { useRouter } from 'next/navigation';
import { Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSettings } from '@tabler/icons-react';

import BarItem from './barItem';

export default () => {
    const [opened, { toggle }] = useDisclosure(false);

    const barItem = {
        name: 'Settings',
        icon: IconSettings,
        clickEvent: () => toggle()
    };

    const router = useRouter();

    return (
        <Menu
            opened={opened}
            shadow='md'
            width={200}
            position='right-end'
            offset={32}
            transitionProps={{
                transition: 'rotate-right',
                duration: 200
            }}
        >

            <Menu.Target>
                <BarItem barItem={barItem} />
            </Menu.Target>


            <Menu.Dropdown>

                <Menu.Item>
                    Account
                </Menu.Item>

                <Menu.Item>
                    Logout
                </Menu.Item>

            </Menu.Dropdown>
        </Menu>
    );
}