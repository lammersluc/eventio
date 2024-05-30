'use client';

import { useRouter } from 'next/navigation';
import { Group, Text, Image, Paper } from '@mantine/core';

export default () => {
      const router = useRouter();

    return (
        <Paper
            shadow='md'
            radius={0}
        >
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
                    
                </Group>
            </Group>
        </Paper>
    );
}