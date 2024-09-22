'use client';
import React from 'react';
import { Box, Center, Group, Image, Text } from '@mantine/core'

import client from '@/lib/client';

type Account = {
    username: string;
    email: string;
    image: string | null;
    createdAt: Date;
} | null;

export default function Page() {
    const [account, setAccount] = React.useState<Account>();

    React.useEffect(() => {
        (async () => {

            const result = await client.account.get();

            setAccount(result.data);

        })();

    });

    return account && (
        <Center h='100%'>

            <Group
                w='100%'
            >

                <Box>

                    <Image
                        src={account.image}
                        radius='xl'
                        width={64}
                        height={64}
                        alt=''
                    />

                </Box>

                <Box>

                    <Text size='xl'>{account.username}</Text>
                    <Text size='sm'>{account.email}</Text>

                </Box>

            </Group>

        </Center>
    );
}