'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Flex, Group, Image, Paper, Stack, Text } from '@mantine/core'
import { IconPencil } from '@tabler/icons-react';

import { PictureModal } from '@/components/account/pictureModal';

import client from '@/lib/client';

type Account = {
    username: string;
    email: string;
    image: string | null;
    createdAt: Date;
} | null;

export default function Page() {
    const [account, setAccount] = React.useState<Account>();
    const [hovered, setHovered] = React.useState(false);
    const [pictureModal, setPictureModal] = React.useState(false);

    const router = useRouter();

    React.useEffect(() => {
        (async () => {
            const result = await client.account.get();

            if (result.error) {
                localStorage.removeItem('auth');
                router.push('/auth');
                return;
            }

            setAccount(result.data);
        })();

    }, []);

    return account && (
        <Stack
            p='xl'
        >

            <Group
                w='100%'
            >

                <Paper
                    pos='relative'
                    w='92px'
                    h='92px'
                    shadow='sm'
                    radius='50%'
                    style={{
                        overflow: 'hidden'
                    }}
                >

                    <Image
                        src={account.image}
                        alt=''
                    />

                    <Flex
                        pos='absolute'
                        top={0}
                        left={0}
                        w='100%'
                        h='100%'
                        justify='center'
                        align='center'
                        opacity={hovered ? 0.7 : 0}
                        bg='black'
                        style={{
                            cursor: 'pointer',
                            transition: 'opacity 0.3s ease-in-out'
                        }}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        onClick={() => setPictureModal(true)}
                    >
                        <IconPencil size={24} color='white' />
                    </Flex>

                </Paper>

                <Box>

                    <Text size='xl'>{account.username}</Text>
                    <Text size='sm'>{account.email}</Text>

                </Box>

            </Group>

            <PictureModal opened={pictureModal} onClose={() => setPictureModal(false)} />

        </Stack>
    );
}