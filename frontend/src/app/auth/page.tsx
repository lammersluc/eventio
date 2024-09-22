'use client';
import React from 'react';
import { Center, Group, Image, Paper } from '@mantine/core'

import { Login, Register } from '@/components/auth';

export default function Page() {
    const toggleVisible = () => {
        const banner = document.getElementById('banner');
        if (!banner) return;

        banner.style.transform = banner.style.transform === 'translateX(100%)' ? 'translateX(0%)' : 'translateX(100%)';
    }

    return (
        <Center h='100%'>

            <Paper
                radius='lg'
                shadow='lg'
                style={{
                    overflow: 'hidden'
                }}
            >
                
                <Group
                    pos='relative'
                >
                    
                    <Paper
                        id='banner'
                        pos='absolute'
                        h='100%'
                        w='50%'
                        radius='md'
                        shadow='md'
                        display='flex'
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            transition: 'transform 0.5s ease-in-out',
                            zIndex: 10
                        }}
                    >
                        <Image
                            src='/logo.png'
                            height={150}
                            w='auto'
                            top={0}
                            left={0}
                            alt=''
                        />
                    </Paper>

                    <Register toggleVisible={toggleVisible} />
                    <Login toggleVisible={toggleVisible} />

                </Group>

            </Paper>

        </Center>
    );
}
