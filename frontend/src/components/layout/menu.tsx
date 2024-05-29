'use client';

import { useRouter } from 'next/navigation';
import { ActionIcon, useMantineColorScheme, Group, Text, Image } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

export default () => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme({
        keepTransitions: true
      });

      const router = useRouter();
    return (
        <Group
            p='sm'
            justify='space-between'
        >
            <Group
                onClick={() => router.push('/')}
                style={{
                    cursor: 'pointer'
                }}
            >
                <Image
                    src='/eventio.png'
                    alt='Eventio'
                    width={40}
                    height={40}
                />
                <Text
                    size='xl'
                    fw={700}
                >
                    Eventio
                </Text>
            </Group>
            <Group>
                <ActionIcon
                onClick={toggleColorScheme}
                variant="default"
                size="xl"
                aria-label="Toggle color scheme"
                >
                    {
                        colorScheme === 'dark' ?
                        <IconSun stroke={1.5} /> :
                        <IconMoon stroke={1.5} />
                    }
                </ActionIcon>
            </Group>
        </Group>
    );
}